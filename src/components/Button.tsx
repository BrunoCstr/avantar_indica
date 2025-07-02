import {TouchableOpacity, Text} from 'react-native';
import {colors} from '../styles/colors';
import { ReactNode } from 'react';

interface ButtonProps {
  text: string | ReactNode;
  backgroundColor: string;
  textColor?: string;
  fontWeight?: any;
  fontSize?: number;
  onPress: () => void;
  height?: number;
  width?: number | string;
  borderBottomWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  disabled?: boolean;
}

export function Button({
  onPress,
  text,
  backgroundColor,
  textColor,
  fontWeight,
  fontSize,
  width = '100%',
  height = 50,
  borderBottomWidth,
  borderRightWidth,
  borderColor,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled
          ? colors.gray
          : colors[backgroundColor as keyof typeof colors],
        opacity: disabled ? 0.5 : 1,
        borderRadius: 10,
        height,
        width: typeof width === 'number' ? width : width === '100%' ? '100%' : undefined,
        borderBottomWidth,
        borderRightWidth,
        borderColor: colors[borderColor as keyof typeof colors]
      }}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'FamiljenGrotesk-regular',
          fontWeight,
          fontSize,
          color: colors[textColor as keyof typeof colors],
        }}
        className="font-bold">
        {text}
      </Text>
    </TouchableOpacity>
  );
}
