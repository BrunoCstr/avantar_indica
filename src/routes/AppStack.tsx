import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import { WaitingConfirmationScreen } from '../screens/WaitingConfirmationScreen';
import { HomeScreen } from '../screens/HomeScreen';
import {theme} from '../theme';

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
      {/* Deixei essa tela aqui de aguardando temporariamente aqui, quando o backend tiver conectado eu ajusto corretamente */}
      <Stack.Screen name="WaitingConfirmationScreen" component={WaitingConfirmationScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </ThemeProvider>
  );
}
