import React, {useState} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {HomeScreen} from '../screens/HomeScreen';
import {WalletScreen} from '../screens/WalletScreen';
import {StatusScreen} from '../screens/StatusScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../styles/colors';
import {IndicateModal} from './IndicateModal';

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {
            backgroundColor: colors.white_navBar,
            borderRadius: 20,
            height: 65,
            position: 'absolute',
            marginBottom: 30,
            marginLeft: 28,
            marginRight: 28,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: () => {
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
                  width: 80,
                  height: 80,
                }}>
                <IconComponent
                  name={iconName}
                  size={32}
                  color={colors.primary_purple}
                />
              </View>
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
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {props.children}
                </View>
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
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowModal(true)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 75,
                    height: 75,
                    borderRadius: 100,
                    backgroundColor: colors.blue,
                    marginTop: -5, // elevar um pouco pra parecer centralizado
                  }}>
                  <FontAwesome
                    name="plus"
                    size={32}
                    color={colors.primary_purple}
                  />
                </TouchableOpacity>
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
