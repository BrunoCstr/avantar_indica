import React, {useEffect} from 'react';

import {
  ImageBackground,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import images from '../data/images';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import LogoAvantarSeguros from '../assets/images/avantar_seguros_consorcios_planos_de_saude.svg';

export function AuthScreen() {
  const navigation = useNavigation();

  async function requestUserPermission() {
    await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <ImageBackground
      source={images.background}
      className="flex-1 justify-center items-center"
      resizeMode="cover">
      <View className="mt-8 ml-7 mr-7">
        <LogoAvantarSeguros />
      </View>
      <View className="flex-1 pl-7 pr-7 w-full justify-end">
        <View>
          <View>
            <Text className="font-semiBold -mb-2 text-4xl text-white">
              Este é o seu
            </Text>
            <Text className="font-semiBold -mb-2 text-4xl text-white">
              novo app da
            </Text>
            <Text className="font-semiBold -mb-2 text-4xl text-white">
              Avantar
            </Text>
          </View>
          <View className="mt-5">
            <Text className="font-regular text-white">onde você indica e ganha</Text>
            <Text className="font-regular text-white">comissão ou cashback.</Text>
          </View>
        </View>
        {/* Botões */}
        <View className="gap-4 mt-8 mb-10">
          <TouchableOpacity
            className="justify-center items-center bg-tertiary_purple h-14 rounded-full"
            onPress={() => navigation.navigate('SignUpScreen')}
            activeOpacity={0.9}>
            <Text className="font-regular text-white text-lg">QUERO CRIAR UMA CONTA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="justify-center items-center bg-transparent h-14 rounded-full border-[1px] border-white"
            onPress={() => navigation.navigate('SignInScreen')}
            activeOpacity={0.9}>
            <Text className="font-regular text-white text-lg">ACESSAR CONTA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
