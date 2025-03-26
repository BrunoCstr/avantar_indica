import React, { useState, useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';
import {AppStack} from './AppStack';
import {theme} from '../theme';
import {useAuth} from '../contexts/Auth';

const Stack = createNativeStackNavigator();

export function WaitingStack() {
  const {registrationStaus} = useAuth();
  const [isRegistred, setIsRegistred] = useState(registrationStaus)

  useEffect(() => {
    setIsRegistred(registrationStaus)
  }, [registrationStaus])

  return (
    <ThemeProvider theme={theme}>
      <Stack.Navigator>
        {isRegistred ? (
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
