
  import React from 'react';
  import { View, TextInput, Pressable, Text, KeyboardAvoidingView, Platform } from 'react-native';
  import { useThemedStyles } from '@/hooks/useThemedStyles';
  import { useTheme } from '@/context/ThemeContext';
  import { COLORS } from '@/constants/Theme';
  import { useState, useEffect, useCallback, useRef } from 'react';
  import { useLocalSearchParams, useRouter } from 'expo-router';
  import { BackIcon } from '@/components/icons';
  import { useDebounce } from '@/hooks/useDebounce';
  import { notesService, type Note } from '@/services/notes';
  import { useNotes } from '@/context/NotesContext';
  import Toast from 'react-native-toast-message';
  console.log('=== [id].tsx: Before Editor import ===');
  import Editor from "../../components/dom-components/hello-dom"; 
  import DOMComponent from '@/components/my-component';

  console.log('=== [id].tsx: After Editor import ===', { Editor });

  // At the top of [id].tsx, right after imports
  console.log('=== [id].tsx: Module loaded ===');

  // Modify your IS_DOM check
  const IS_DOM = typeof Editor !== "undefined";

  console.log('=== [id].tsx: Checking IS_DOM ===', { 
    IS_DOM, 
    EditorType: typeof Editor,
    EditorValue: Editor 
  });

  export default function NotePage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const styles = useThemedStyles();
    const { theme } = useTheme();
    const colors = COLORS[theme];
    const router = useRouter();
    const { notes, updateNoteInState } = useNotes();

    const [editorState, setEditorState] = useState<string | null>(null);
    const [plainText, setPlainText] = useState('');
    
    const note = notes.find(n => n.id === id);
    const [title, setTitle] = useState(note?.title ?? '');
    const [content, setContent] = useState(note?.content ?? '');

    const saveNote = useCallback(async () => {
      const updates = {
        title,
        content,
        updated_at: Math.floor(Date.now() / 1000)
      };

      updateNoteInState(id, updates);

      try {
        await notesService.updateNote(id, updates);
      } catch (error) {
        console.error('Error saving note:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to save note'
        });
      }
    }, [id, title, content]);

    const debouncedSave = useDebounce(saveNote, 1000);

    useEffect(() => {
      debouncedSave();
    }, [title, content]);

    const handleBack = async () => {
      if (!title && !content) {
        try {
          await notesService.deleteNote(id);
          router.back();
        } catch (error) {
          console.error('Error deleting empty note:', error);
          router.back();
        }
      } else {
        router.back();
      }
    };

    console.log('NotePage: Before note check', { noteExists: !!note });
    if (!note) {
      console.log('NotePage: Note not found, returning null');
      return null;
    }
    console.log('NotePage: Note found, continuing');
    
    console.log('NotePage: IS_DOM =', IS_DOM);
    console.log('NotePage: Editor type =', typeof Editor);

    return (
      <>
        <View style={{ flex: 1, backgroundColor: colors.backgroundPrimary}}>
          <View style={styles.header}>
            <Pressable onPress={handleBack} style={styles.backButton}>
              <BackIcon color={colors.textPrimary} />
            </Pressable>
          </View>
          <TextInput
            style={[styles.titleInput, { color: colors.textPrimary }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={{
              flex: 1,
              padding: 16,
              fontSize: 16,
              fontFamily: 'Inter',
              lineHeight: 24,
              color: colors.textPrimary,
              textAlignVertical: 'top'
            }}
            multiline
            value={content}
            onChangeText={setContent}
            placeholder="Start typing..."
            placeholderTextColor={colors.textSecondary}
          />

          {/* <DOMComponent dom={{ matchContents: true }}/> */}

          <Editor dom={{ matchContents: true}} setPlainText={setPlainText} setEditorState={setEditorState}/>

        </View>
        {(() => { console.log('About to go to Editor'); return null; })()}


        {/* <Editor dom={{ matchContents: true}} /> */}

        {/* <Editor setPlainText={setPlainText} setEditorState={setEditorState} dom={{ style: { 
        width: "100%", 
        height: "100px", 
        }, matchContents: true }} /> */}
      </>
    );
  } 
