import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {colors} from '../styles/colors';
import {Spinner} from './Spinner';
import {useResponsive} from '../hooks/useResponsive';
import {withDefaultFont, withFont} from '../config/fontConfig';

interface ButtonProps {
  onPress: () => void;
  text: string;
  backgroundColor: string;
  textColor: string;
  fontWeight: string;
  fontSize: number;
  width?: string | number;
  height?: number;
  borderBottomWidth?: number;
  borderRightWidth?: number;
  borderColor?: string;
  disabled?: boolean;
  isLoading?: boolean;
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
  isLoading = false,
}: ButtonProps) {
  const {isSmallScreen} = useResponsive();

  // Ajustar tamanhos para telas pequenas
  const adjustedFontSize = isSmallScreen
    ? Math.max(fontSize - 2, 14)
    : fontSize;
  const adjustedHeight = isSmallScreen ? Math.max(height - 10, 50) : height;

  // Determinar qual fonte usar baseado no fontWeight
  const getFontFamily = () => {
    switch (fontWeight) {
      case 'bold':
        return 'bold';
      case 'semibold':
        return 'semibold';
      case 'medium':
        return 'medium';
      default:
        return 'regular';
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          disabled || isLoading
            ? colors.gray
            : colors[backgroundColor as keyof typeof colors],
        opacity: disabled || isLoading ? 0.5 : 1,
        borderRadius: 10,
        height: adjustedHeight,
        width:
          typeof width === 'number'
            ? width
            : width === '100%'
              ? '100%'
              : undefined,
        borderBottomWidth,
        borderRightWidth,
        borderColor: colors[borderColor as keyof typeof colors],
      }}
      activeOpacity={0.8}
      onPress={onPress}>
      {isLoading ? (
        <Spinner size={32} variant="blue" />
      ) : (
        <Text
          style={withFont(getFontFamily(), {
            textAlign: 'center',
            fontSize: adjustedFontSize,
            color: colors[textColor as keyof typeof colors],
          })}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
