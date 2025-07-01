import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import {BottomNavigator} from '../components/BottomNavigator';
import {Notifications} from '../screens/Notifications';
import {Rules} from '../screens/RulesScreen';
import {IndicateInBulkScreen} from '../screens/IndicateInBulkScreen';
import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';
import {useAuth} from '../contexts/Auth';
import {HomeSkeleton} from '../components/skeletons/HomeSkeleton';
import {RegisterSellers} from '../screens/RegisterSellers';
import NoPermission from '../screens/NoPermission';
import Settings from '../screens/Settings';

const Stack = createStackNavigator();

export function AppStack() {
  const {registrationStatus, isLoading} = useAuth();

  if (isLoading) return <HomeSkeleton />;

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
        name="IndicateInBulk"
        component={
          registrationStatus ? IndicateInBulkScreen : WaitingConfirmationScreen
        }
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="WaitingConfirmationScreen"
        component={WaitingConfirmationScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="RegisterSellers"
        component={RegisterSellers}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="NoPermission"
        component={NoPermission}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
}
