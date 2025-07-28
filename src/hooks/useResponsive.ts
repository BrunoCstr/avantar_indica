import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ResponsiveConfig {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  screenWidth: number;
  screenHeight: number;
  horizontalPadding: number;
  verticalPadding: number;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export function useResponsive(): ResponsiveConfig {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;
  
  // Breakpoints baseados em dispositivos comuns
  const isSmallScreen = screenWidth <= 360; // S20, iPhone SE, etc.
  const isMediumScreen = screenWidth > 360 && screenWidth < 400; // S21, iPhone 12, etc.
  const isLargeScreen = screenWidth >= 400; // S22+, iPhone 13+, etc.

  // Padding responsivo
  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 28;
  const verticalPadding = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;

  // Tamanhos de fonte responsivos
  const fontSize = {
    small: isSmallScreen ? 'text-xs' : 'text-ss',
    medium: isSmallScreen ? 'text-s' : 'text-m',
    large: isSmallScreen ? 'text-xl' : 'text-2xl',
    xlarge: isSmallScreen ? 'text-l' : 'text-xl',
  };

  // Espaçamentos responsivos
  const spacing = {
    small: isSmallScreen ? 8 : isMediumScreen ? 12 : 16,
    medium: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
    large: isSmallScreen ? 24 : isMediumScreen ? 32 : 40,
  };

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    screenWidth,
    screenHeight,
    horizontalPadding,
    verticalPadding,
    fontSize,
    spacing,
  };
} 