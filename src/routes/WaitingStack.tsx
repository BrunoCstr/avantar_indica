import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from '@shopify/restyle';

import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';
import {AppStack} from './AppStack';
import {theme} from '../styles';
import {useAuth} from '../contexts/Auth';

const Stack = createNativeStackNavigator();

export function WaitingStack() {
  const {registrationStatus} = useAuth();
  const [isRegistred, setIsRegistred] = useState(registrationStatus);

  useEffect(() => {
    if (registrationStatus) {
      setIsRegistred(registrationStatus);
    }
  }, [registrationStatus]);

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
