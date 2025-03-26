import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';
import {AppStack} from './AppStack';
import {theme} from '../theme';
import {useAuth} from '../contexts/Auth';

const Stack = createNativeStackNavigator();

export function WaitingStack() {
  const {registrationStaus} = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
        {registrationStaus ? (
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="WaitingConfirmationScreen"
            component={WaitingConfirmationScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </ThemeProvider>
  );
}
