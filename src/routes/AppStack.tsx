import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import {BottomNavigator} from '../components/BottomNavigator';
import {Notifications} from '../screens/Notifications';
import {Rules} from '../screens/Rules';

const Stack = createStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS}}
      />
      <Stack.Screen
        name="Rules"
        component={Rules}
        options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}}
      />
    </Stack.Navigator>
  );
}
