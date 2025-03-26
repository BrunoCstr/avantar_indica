import React from 'react';

import {createBox, createText, useTheme} from '@shopify/restyle';
import {ThemeProps} from '../theme';
import {Button} from '../components/Button';
import { useAuth } from '../contexts/Auth';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function HomeScreen() {
  // Para usar nos componentes que nao sao do restyle
  const theme = useTheme<ThemeProps>();
  const {signOut} = useAuth()

  return (
    <Box>
      <Text style={{color: 'black'}}>Home Screen</Text>
      <Box mt="m" p='s'>
        <Button
          text="SAIR"
          backgroundColor="red"
          onPress={signOut}
        />
      </Box>
    </Box>
  );
}
