import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useBottomNavigationPadding() {
  const insets = useSafeAreaInsets();
  
  // Calcula o padding bottom necessário para a bottom navigation
  const bottomNavigationHeight = 65; // altura da bottom navigation
  const bottomNavigationMargin = 80; // margem da bottom navigation
  const totalBottomSpace = insets.bottom + bottomNavigationHeight + bottomNavigationMargin;
  
  // Margens laterais da bottom navigation (deve corresponder ao left/right do tabBarStyle)
  const bottomNavigationSideMargin = 28;
  
  return {
    paddingBottom: totalBottomSpace,
    paddingHorizontal: bottomNavigationSideMargin, // Para garantir que o conteúdo não interfira com as margens da nav
    bottomNavigationHeight,
    bottomNavigationMargin,
    bottomNavigationSideMargin,
    safeAreaBottom: insets.bottom,
  };
} 