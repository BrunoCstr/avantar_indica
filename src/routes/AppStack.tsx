import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeScreen} from '../screens/HomeScreen';
import {WalletScreen} from '../screens/WalletScreen';
import {StatusScreen} from '../screens/StatusScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StatusScreen"
        component={StatusScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
