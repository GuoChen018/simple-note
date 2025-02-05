import { supabase } from '@/lib/supabase';
import { localNotesService } from './localNotes';
import { eq } from 'drizzle-orm';
import { notes as notesTable } from '@/db/schema';
import { db } from '@/app/_layout';

export interface Note {
  id: string;
  title: string | null;
  content: string | null;
  created_at: number;  // Store as number in our app
  updated_at: number;  // Store as number in our app
  is_deleted: number;
  last_synced_at: number | null;
  is_dirty: number;  // 1 means needs sync, 0 means in sync
  user_id?: string;  // Make user_id optional since it's only used in Supabase
}

export const notesService = {
  async getNotes() {
    try {
      // Get remote notes from Supabase
      const { data: remoteNotes, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      // Get local notes
      const localNotes = await localNotesService.getNotes();
      
      // TODO: Implement proper sync logic
      // For now, merge remote and local notes, preferring local if they're newer
      const mergedNotes = this.mergeNotes(localNotes, remoteNotes);
      
      return mergedNotes;
    } catch (error) {
      console.error('Error syncing notes:', error);
      // Fallback to local notes if remote fetch fails
      return await localNotesService.getNotes();
    }
  },

  async createNote() {
    console.log('NotesService: Starting note creation');
    // Create in local DB first
    const localNote = await localNotesService.createNote();
    console.log('NotesService: Created local note:', localNote);
    
    try {
      console.log('NotesService: Syncing to Supabase');
      // Then sync to Supabase
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          id: localNote.id,
          user_id: '00000000-0000-0000-0000-000000000000',  // Use a valid UUID format
          title: null,
          content: null
        }])
        .select()
        .single();
        
      if (error) {
        console.error('NotesService: Supabase error:', error);
        throw error;
      }
      console.log('NotesService: Synced with Supabase:', data);
      return localNote;
    } catch (error) {
      console.error('NotesService: Error syncing new note:', error);
      return localNote;
    }
  },

  async updateNote(id: string, updates: Partial<Note>) {
    // Update local first
    const localNote = await localNotesService.updateNote(id, updates);
    
    try {
      // Convert timestamps to ISO strings for Supabase
      const supabaseUpdates = {
        ...updates,
        updated_at: updates.updated_at ? new Date(updates.updated_at).toISOString() : undefined,
        created_at: undefined, // Don't update created_at
      };

      const { error } = await supabase
        .from('notes')
        .update(supabaseUpdates)
        .eq('id', id);
        
      if (error) throw error;
      return localNote;
    } catch (error) {
      console.error('Error syncing note update:', error);
      return localNote;
    }
  },

  // Helper function to merge local and remote notes
  mergeNotes(localNotes: Note[], remoteNotes: any[]) {  // Change remoteNotes type to any[]
    const notesMap = new Map();
    
    // Add all remote notes first, converting to our local format
    remoteNotes.forEach(note => {
      notesMap.set(note.id, {
        ...note,
        // Convert Supabase timestamps to numbers
        created_at: new Date(note.created_at).getTime(),
        updated_at: new Date(note.updated_at).getTime(),
        // Add SQLite-specific fields
        is_deleted: 0,
        is_dirty: 0,
        last_synced_at: Date.now()
      });
    });
    
    // Override with local notes if they're newer
    localNotes.forEach(localNote => {
      const remoteNote = notesMap.get(localNote.id);
      if (!remoteNote || localNote.updated_at > new Date(remoteNote.updated_at).getTime()) {
        notesMap.set(localNote.id, localNote);
      }
    });
    
    return Array.from(notesMap.values())
      .sort((a, b) => b.updated_at - a.updated_at);
  },

  async deleteNote(id: string) {
    // Delete from local first
    await localNotesService.deleteNote(id);
    
    try {
      // Then sync with Supabase
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note from Supabase:', error);
      throw error;
    }
  },

  async syncNotes() {
    try {
      // Get all dirty notes (modified locally but not synced)
      const dirtyNotes = await localNotesService.getDirtyNotes();
      
      // Get all notes from Supabase that were updated since last sync
      const lastSync = await localNotesService.getLastSyncTimestamp();
      const { data: remoteNotes, error } = await supabase
        .from('notes')
        .select('*')
        .gt('updated_at', lastSync ? new Date(Number(lastSync) * 1000).toISOString() : '1970-01-01');
        
      if (error) throw error;

      // First, push local changes to Supabase
      for (const note of dirtyNotes) {
        await this._pushNoteToSupabase(note);
      }

      // Then, pull remote changes to local
      for (const remoteNote of remoteNotes || []) {
        await this._pullNoteFromSupabase(remoteNote);
      }

      // Update last sync timestamp
      await localNotesService.updateLastSyncTimestamp();

    } catch (error) {
      console.error('Error during sync:', error);
      throw error;
    }
  },

  async _pushNoteToSupabase(note: Note) {
    const { error } = await supabase
      .from('notes')
      .upsert({
        id: note.id,
        title: note.title,
        content: note.content,
        created_at: new Date(note.created_at * 1000).toISOString(),
        updated_at: new Date(note.updated_at * 1000).toISOString(),
        user_id: '00000000-0000-0000-0000-000000000000'
      });

    if (error) throw error;
    
    // Mark as synced in local DB
    await localNotesService.markAsSynced(note.id);
  },

  async _pullNoteFromSupabase(remoteNote: any) {
    try {
      // Get local version if it exists
      const [localNote] = await db.select()
        .from(notesTable)
        .where(eq(notesTable.id, remoteNote.id));

      const remoteTimestamp = new Date(remoteNote.updated_at).getTime();
      const localTimestamp = localNote?.updated_at ? localNote.updated_at * 1000 : 0;

      // Only update if remote is newer
      if (remoteTimestamp > localTimestamp) {
        const updatedNote = {
          ...remoteNote,
          created_at: Math.floor(new Date(remoteNote.created_at).getTime() / 1000),
          updated_at: Math.floor(remoteTimestamp / 1000),
          is_deleted: 0,
          is_dirty: 0,
          last_synced_at: Math.floor(Date.now() / 1000)
        };

        await localNotesService.upsertNote(updatedNote);
      }
    } catch (error) {
      console.error('Error pulling note:', error);
      throw error;
    }
  }
}; 