import React from 'react';

import {createBox, createText, useTheme} from '@shopify/restyle';
import {ThemeProps} from '../theme';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function LoginScreen() {
  // Para usar nos componentes que nao sao do restyle
  const theme = useTheme<ThemeProps>();

  return (
    <Box>
        <Text>Login Screen</Text>
    </Box>
  );
}