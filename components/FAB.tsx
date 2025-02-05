import { Pressable } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';

interface FABProps {
  onPress: () => void;
  children: React.ReactNode;
}

export function FAB({ onPress, children }: FABProps) {
  const styles = useThemedStyles();

  return (
    <Pressable 
      style={styles.fab} 
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
