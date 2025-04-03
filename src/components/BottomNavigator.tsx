import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {HomeScreen} from '../screens/HomeScreen';
import {WalletScreen} from '../screens/WalletScreen';
import {StatusScreen} from '../screens/StatusScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../styles/colors';

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: colors.white_navBar,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          position: 'absolute',
          paddingBottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({focused}) => {
          let iconName: string = '';
          let IconComponent: any = Entypo;

          if (route.name === 'Home') {
            iconName = 'home';
            IconComponent = Entypo;
          } else if (route.name === 'Wallet') {
            iconName = 'wallet';
            IconComponent = Entypo;
          } else if (route.name === 'Status') {
            iconName = 'sync';
            IconComponent = AntDesign;
          } else if (route.name === 'Profile') {
            iconName = 'user';
            IconComponent = FontAwesome;
          }

          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused
                  ? colors.blue_navigator
                  : 'transparent',
              }}>
              <IconComponent
                name={iconName}
                size={32}
                color={colors.primary_purple}
              />
            </View>
          );
        },
        tabBarButton: (props) => {
          const { accessibilityLabel, accessibilityState, onPress } = props;
          return (
            <TouchableWithoutFeedback
              accessibilityLabel={accessibilityLabel}
              accessibilityState={accessibilityState}
              onPress={onPress}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {props.children}
              </View>
            </TouchableWithoutFeedback>
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
