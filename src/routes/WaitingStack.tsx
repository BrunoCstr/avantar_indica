import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';
import {AppStack} from './AppStack';
import {useAuth} from '../contexts/Auth';
import {Loading} from '../components/Loading';

const Stack = createNativeStackNavigator();

export function WaitingStack() {
  const {registrationStatus, isLoading} = useAuth();

  if (isLoading) return <Loading />;

  return (
    <Stack.Navigator>
      {registrationStatus ? (
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
  );
}
