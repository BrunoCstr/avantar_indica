import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import { HomeScreen } from '../screens/HomeScreen';
import {theme} from '../styles';

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </ThemeProvider>
  );
}
