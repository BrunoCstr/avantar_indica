import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import {AuthScreen} from '../screens/AuthScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {theme} from '../theme';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </ThemeProvider>
  );
}