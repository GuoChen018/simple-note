import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/Theme';

export function useThemedStyles() {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  
  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundPrimary,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4,
    },
    list: {
      paddingVertical: 2
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
      paddingHorizontal: 12,
    },
    searchInput: {
      flex: 1,
      color: colors.textPrimary,
      padding: 12,
      fontSize: 16,
    },
    clearButton: {
      color: colors.textSecondary,
      fontSize: 16,
      paddingHorizontal: 8,
    },
    content: {
      flex: 1,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.buttonPrimary
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      marginLeft: 8,
      fontFamily: 'Inter',
    },
    titleInput: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      padding: 0,
      fontWeight: '600',
      color: colors.textPrimary,
      paddingHorizontal: 16,
    },
    contentInput: {
      flex: 1,
      fontFamily: 'Inter',
      fontSize: 16,
      color: colors.textPrimary,
      paddingHorizontal: 16,
      lineHeight: 16*1.6,
      textAlignVertical: 'top',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emptySubtext: {
      fontFamily: 'Inter',
      fontSize: 14,
      color: colors.textSecondary,
    },
  }), [theme]);
}
