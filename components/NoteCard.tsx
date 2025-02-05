import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS, TYPOGRAPHY } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import { State } from 'react-native-gesture-handler';
import { DeleteIcon } from '@/components/icons';
import Toast from 'react-native-toast-message';
import { notesService } from '@/services/notes';
import { useNotes } from '@/context/NotesContext';

interface NoteCardProps {
  id: string;
  title: string | null;
  content: string | null;
}

export function NoteCard({ id, title, content }: NoteCardProps) {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const router = useRouter();
  const { updateNoteInState } = useNotes();
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteWidth = 70; // Width of delete button
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTimeoutRef = useRef<NodeJS.Timeout>();

  const handlePress = () => {
    router.push({
      pathname: "/note/[id]",
      params: { id }
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Optimistically update UI
    updateNoteInState(id, { is_deleted: 1 });
    
    Toast.show({
      type: 'info',
      text1: 'Note deleted',
      text2: 'Tap to undo',
      position: 'bottom',
      bottomOffset: 100,
      visibilityTime: 3000,
      onPress: () => {
        // Cancel the deletion
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current);
        }
        setIsDeleting(false);
        translateX.setValue(0);
        // Restore the note in UI
        updateNoteInState(id, { is_deleted: 0 });
      },
      onHide: () => {
        // Only delete from Supabase if not undone
        if (isDeleting) {
          deleteTimeoutRef.current = setTimeout(async () => {
            try {
              await notesService.deleteNote(id);
            } catch (error) {
              console.error('Error deleting note:', error);
              Toast.show({
                type: 'error',
                text1: 'Error deleting note'
              });
              // Restore the note in UI if deletion failed
              updateNoteInState(id, { is_deleted: 0 });
            }
          }, 300);
        }
      }
    });
  };

  const onGestureEvent = Animated.event<PanGestureHandlerGestureEvent>(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const shouldReveal = event.nativeEvent.translationX < -deleteWidth / 2;
      
      Animated.spring(translateX, {
        toValue: shouldReveal ? -deleteWidth : 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDeletePress = () => {
    handleDelete();
    // Reset position after delete
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    deleteButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 70,
      backgroundColor: '#E53935',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      padding: 16,
      borderBottomWidth: 1,
    },
    content: {
      paddingVertical: 2,
    },
    title: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    preview: {
      fontFamily: 'Inter',
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 14 * 1.6,
    }
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deleteButton, {
        transform: [{
          translateX: translateX.interpolate({
            inputRange: [-deleteWidth, 0],
            outputRange: [0, deleteWidth]
          })
        }]
      }]}>
        <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
          <DeleteIcon color="white" />
        </Pressable>
      </Animated.View>
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.card, {
          transform: [{ translateX }],
          borderBottomColor: colors.border
        }]}>
          <Pressable onPress={handlePress}>
            <View style={[styles.content, { borderBottomColor: colors.border }]}>
              {title ? (
                <Text 
                  style={[styles.title, { color: colors.textPrimary }]} 
                  numberOfLines={1}
                >
                  {title}
                </Text>
              ) : null}
              {content ? (
                <Text 
                  style={[styles.preview, { color: colors.textSecondary }]} 
                  numberOfLines={2}
                >
                  {content}
                </Text>
              ) : null}
              {!title && !content && (
                <Text style={[styles.preview, { color: colors.textSecondary }]}>
                  Empty note
                </Text>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}


