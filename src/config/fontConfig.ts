import { TextStyle } from 'react-native';

// Configuração das fontes disponíveis
export const fonts = {
  regular: 'FamiljenGrotesk-Regular',
  medium: 'FamiljenGrotesk-Medium',
  semibold: 'FamiljenGrotesk-SemiBold',
  bold: 'FamiljenGrotesk-Bold',
  italic: 'FamiljenGrotesk-Italic',
  mediumItalic: 'FamiljenGrotesk-MediumItalic',
  semiboldItalic: 'FamiljenGrotesk-SemiBoldItalic',
  boldItalic: 'FamiljenGrotesk-BoldItalic',
};

// Função helper para aplicar fonte padrão
export const withDefaultFont = (style: TextStyle): TextStyle => ({
  fontFamily: fonts.regular,
  ...style,
});

// Função helper para aplicar fonte específica
export const withFont = (fontFamily: keyof typeof fonts, style: TextStyle): TextStyle => ({
  fontFamily: fonts[fontFamily],
  ...style,
});

// Estilos pré-definidos para uso comum
export const fontStyles = {
  regular: { fontFamily: fonts.regular },
  medium: { fontFamily: fonts.medium },
  semibold: { fontFamily: fonts.semibold },
  bold: { fontFamily: fonts.bold },
  italic: { fontFamily: fonts.italic },
  mediumItalic: { fontFamily: fonts.mediumItalic },
  semiboldItalic: { fontFamily: fonts.semiboldItalic },
  boldItalic: { fontFamily: fonts.boldItalic },
};
