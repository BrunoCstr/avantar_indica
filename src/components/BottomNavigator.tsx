import React, {useState} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import {HomeScreen} from '../screens/HomeScreen';
import {WalletScreen} from '../screens/WalletScreen';
import {StatusScreen} from '../screens/StatusScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../styles/colors';
import {IndicateModal} from './IndicateModal';
import images from '../data/images';
import { useAuth } from '../contexts/Auth';
import {WaitingConfirmationScreen} from '../screens/WaitingConfirmationScreen';

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  const { registrationStatus } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

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
            paddingBottom: 0, // Remove padding que pode desalinhar
            paddingTop: 0,    // Remove padding que pode desalinhar
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
                size={28} // Tamanho mais consistente
                color={focused ? colors.primary_purple : colors.gray} // Cor baseada no foco
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
                  height: '100%', // Usa toda a altura disponível
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
                      : navigation.navigate('WaitingConfirmation') // Corrigido aqui
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 55, // Tamanho mais proporcional
                    height: 55,
                    borderRadius: 27.5, // Metade da width/height para círculo perfeito
                    backgroundColor: colors.blue,
                    elevation: 3, // Sombra no Android
                    shadowColor: '#000', // Sombra no iOS
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}>
                  <Image
                    source={images.plus}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: colors.primary_purple, // Cor do ícone
                    }}
                    resizeMode="contain"
                  />
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