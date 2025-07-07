import React, {useState, useEffect} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity, Image, Keyboard, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  WaitingConfirmationScreen: undefined;
  IndicateInBulk: undefined;
  Rules: undefined;
  Status: undefined;
  Settings: undefined;
  RegisterSellers: undefined;
  NoPermission: undefined;
  Notifications: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

import {HomeScreen} from '../screens/HomeScreen';
import {WalletScreen} from '../screens/WalletScreen';
import {StatusScreen} from '../screens/StatusScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../styles/colors';
import {IndicateModal} from './IndicateModal';
import images from '../data/images';
import PlusIcon from '../assets/images/plus.svg';
import { useAuth } from '../contexts/Auth';
import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  const { registrationStatus } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // Margem lateral da bottom navigation
  const sideMargin = 28;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {
            backgroundColor: colors.white_navBar,
            borderRadius: 20,
            height: 65,
            position: 'absolute',
            bottom: keyboardVisible ? -100 : 30,
            left: sideMargin,
            right: sideMargin,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: keyboardVisible ? 0 : 0.3,
            shadowRadius: 4,
            transform: [{translateY: keyboardVisible ? 100 : 0}],
            zIndex: 1000,
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
              <IconComponent
                name={iconName}
                size={28}
                color={focused ? colors.primary_purple : colors.gray}
              />
            );
          },
          tabBarButton: props => {
            const {accessibilityLabel, accessibilityState, onPress} = props;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                accessibilityLabel={accessibilityLabel}
                accessibilityState={accessibilityState}
                onPress={onPress}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  paddingHorizontal: 8,
                }}>
                {props.children}
              </TouchableOpacity>
            );
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Wallet" component={WalletScreen} />

        {/* Botão customizado para abrir o Modal */}
        <Tab.Screen
          name="IndicateButton"
          component={() => null}
          options={{
            tabBarButton: () => (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    registrationStatus 
                      ? setShowModal(true) 
                      : navigation.navigate('WaitingConfirmationScreen')
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 55,
                    height: 55,
                    borderRadius: 27.5,
                    backgroundColor: colors.blue,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}>
                  <PlusIcon width={24} height={24} color={colors.primary_purple} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <IndicateModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}