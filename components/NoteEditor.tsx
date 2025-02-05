import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/Theme';

interface NoteEditorProps {
  content: string | null;
  onChange: (content: string) => void;
}

export function NoteEditor({ content, onChange }: NoteEditorProps) {
  const { theme } = useTheme();
  const colors = COLORS[theme];

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
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
        value={content ?? ''}
        onChangeText={onChange}
        placeholder="Start typing..."
        placeholderTextColor={colors.textSecondary}
      />
    </KeyboardAvoidingView>
  );
} 