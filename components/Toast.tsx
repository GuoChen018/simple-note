import { View, Text } from 'react-native';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/constants/Theme';

export const toastConfig = {
  info: (props: BaseToastProps) => {
    const { theme } = useTheme();
    const colors = COLORS[theme];

    return (
      <BaseToast
        {...props}
        style={{
          borderLeftWidth: 0,
          backgroundColor: colors.buttonPrimary,
          borderRadius: 12,
          height: 'auto',
          paddingVertical: 12,
          marginHorizontal: 16,
          elevation: 0,
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        text1Style={{
          fontSize: 16,
          fontFamily: 'Inter-SemiBold',
          color: colors.textOnButtonPrimary,
        }}
        text2Style={{
          fontSize: 14,
          fontFamily: 'Inter',
          color: colors.textOnButtonPrimary,
        }}
      />
    );
  }
}; 