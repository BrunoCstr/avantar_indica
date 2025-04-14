import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import {BottomNavigator} from '../components/BottomNavigator';
import {Notifications} from '../screens/Notifications';
import {Rules} from '../screens/RulesScreen';
import { IndicateScreen } from '../screens/IndicateScreen';
import { IndicateInBulkScreen } from '../screens/IndicateInBulkScreen';

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
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Rules"
        component={Rules}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Indicate"
        component={IndicateScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="IndicateInBulk"
        component={IndicateInBulkScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
}
