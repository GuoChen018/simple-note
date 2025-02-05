import { db } from '@/app/_layout';
import { notes as notesTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { type Note } from './notes';

export const localNotesService = {
  async getNotes() {
    const notes = await db.select().from(notesTable).where(eq(notesTable.is_deleted, 0));
    console.log('Local notes:', notes);
    return notes;
  },

  async createNote() {
    const now = Date.now();
    const newNoteData = {
      id: uuidv4(),
      title: null,
      content: null,
      created_at: Math.floor(now / 1000),  // Convert to Unix timestamp (seconds)
      updated_at: Math.floor(now / 1000),  // Convert to Unix timestamp (seconds)
      is_deleted: 0,
      is_dirty: 1,
      last_synced_at: 0
    };
    
    console.log('About to insert note with data:', newNoteData);
    
    const [newNote] = await db.insert(notesTable)
      .values(newNoteData)
      .returning();
      
    console.log('Created local note:', newNote);
    return newNote;
  },

  async deleteNote(id: string) {
    await db
      .update(notesTable)
      .set({ is_deleted: 1 })
      .where(eq(notesTable.id, id));
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const now = Math.floor(Date.now() / 1000);  // Convert to Unix timestamp (seconds)
    const [updatedNote] = await db
      .update(notesTable)
      .set({
        ...updates,
        is_dirty: 1,
        updated_at: now
      })
      .where(eq(notesTable.id, id))
      .returning();
    return updatedNote;
  },

  async getDirtyNotes() {
    return await db.select()
      .from(notesTable)
      .where(eq(notesTable.is_dirty, 1));
  },

  async getLastSyncTimestamp() {
    // You might want to store this in a separate settings table
    // For now, we'll use the max last_synced_at from notes
    const [result] = await db.select({ 
      max: sql`MAX(last_synced_at)` 
    }).from(notesTable);
    return result?.max || null;
  },

  async updateLastSyncTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    await db.update(notesTable)
      .set({ last_synced_at: now })
      .where(eq(notesTable.is_dirty, 0));
  },

  async markAsSynced(id: string) {
    const now = Math.floor(Date.now() / 1000);
    await db.update(notesTable)
      .set({ 
        is_dirty: 0,
        last_synced_at: now
      })
      .where(eq(notesTable.id, id));
  },

  async upsertNote(note: Note) {
    await db.insert(notesTable)
      .values(note)
      .onConflictDoUpdate({
        target: notesTable.id,
        set: note
      });
  },

  // Add other CRUD operations
}; 