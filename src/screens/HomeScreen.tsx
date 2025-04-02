import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import gStyles from '../styles/gStyles';
import {NotificationButton} from '../components/NotificationButton';
import {colors} from '../styles/colors';
import { BottomNavigator } from '../components/BottomNavigator';

export function HomeScreen() {
  // Para usar nos componentes que nao sao do restyle
  const {userData} = useAuth();

  const displayName = userData?.displayName;
  const userFirstName = displayName?.slice(0, displayName.indexOf(' '));

  const isFirstLogin = userData?.isFirstLogin;
  const welcomeMessage = isFirstLogin ? "Seja bem-vindo!" : "Seja bem-vindo de volta!"

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      {/* Header */}
      <View className="grid-cols-3 flex-row items-center mt-10 ml-7 mr-7">
        <View>
          <Image
            source={images.default_profile_picture}
            className="h-14 w-14 rounded-full"></Image>
        </View>
        <View>
          <View className="ml-2.5 flex-row">
            <Text className="text-blue text-m font-medium">Olá, </Text>
            <Text className="text-white text-m font-medium">
              {userFirstName}
            </Text>
          </View>
          <View className="ml-2.5">
            <Text className="text-white text-ss font-regular">
              {welcomeMessage}
            </Text>
          </View>
        </View>
        <View className="absolute right-0">
          <NotificationButton count={3} />
        </View>
      </View>

      <View className="ml-7 mr-7 mt-10 h-30 items-center justify-center flex-row gap-3">
        <TouchableOpacity activeOpacity={0.8}>
          <View className="bg-transparent flex-row border-[2.5px] rounded-lg border-blue justify-center items-center p-8">
            <Image source={images.indicar_icon} />
            <Text className="text-white text-regular text-2xl ml-1.5">
              INDICAR
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <View className="bg-transparent flex-row border-[2.5px] rounded-lg border-secondary_purple justify-center items-center p-8 pt-5 pb-5">
            <Image source={images.indicar_em_massa_icon} />
            <View>
              <Text className="text-white text-bold text-2xl ml-1.5">
                INDICAR
              </Text>
              <Text className="text-white text-bold text-s ml-2">EM MASSA</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="h-[50%] mt-7 rounded-[30px] bg-white">
        <View className="p-5">
          <View className='gap-2'>
            <Button
              text="STATUS DA PROPOSTA"
              backgroundColor='blue'
              textColor='primary_purple'
              fontWeight='bold'
              fontSize={22}
              onPress={() => console.log('Status da Proposta')}
            />
            <Button
              text="REGRAS"
              textColor='white'
              backgroundColor='orange'
              fontWeight='bold'
              fontSize={22}
              onPress={() => console.log('REGRAS')}
            />
          </View>
        </View>
      </View>
      <BottomNavigator/>
    </ImageBackground>
  );
}
