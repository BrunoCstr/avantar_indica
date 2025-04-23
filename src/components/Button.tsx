import {TouchableOpacity, Text} from 'react-native';
import {colors} from '../styles/colors';

interface ButtonProps {
  text: string;
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
  borderColor
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors[backgroundColor as keyof typeof colors],
        borderRadius: 10,
        height,
        width,
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
