import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Note, notesService } from '@/services/notes';
import { AppState } from 'react-native';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  updateNoteInState: (id: string, updates: Partial<Note>) => void;
  createNote: () => Promise<Note>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await notesService.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNoteInState = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(currentNotes => 
      currentNotes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
  }, []);

  const createNote = async () => {
    console.log('NotesContext: Starting note creation');
    const newNote = await notesService.createNote();
    console.log('NotesContext: Got new note:', newNote);
    setNotes(current => [newNote, ...current]);
    return newNote;
  };

  // Sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        notesService.syncNotes().catch(console.error);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Initial sync on mount
  useEffect(() => {
    notesService.syncNotes().catch(console.error);
  }, []);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <NotesContext.Provider value={{ 
      notes, 
      isLoading,
      loadNotes, 
      updateNoteInState,
      createNote
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
} 