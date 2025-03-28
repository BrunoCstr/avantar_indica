import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import {AuthScreen} from '../screens/AuthScreen';
import {SignInScreen} from '../screens/SignInScreen';
import {SignUpScreen} from '../screens/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import {theme} from '../styles';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </ThemeProvider>
  );
}