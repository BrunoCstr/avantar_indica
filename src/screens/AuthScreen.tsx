import React, {useEffect} from 'react';

import {
  ImageBackground,
  Image,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import images from '../data/images';
import {useNavigation} from '@react-navigation/native';
import gStyles from '../styles/gStyles';
import messaging from '@react-native-firebase/messaging';

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
      className="flex-1"
      resizeMode="cover">
      <View className="mt-10 ml-7 mr-7">
        <Image source={images.avantar_logo_branca}></Image>
      </View>
      <View className="flex-1 ml-7 mr-7 mb-10 justify-end">
        {/* Texto */}
        <View>
          <View>
            <Text className="font-semiBold mb-[-12]" style={gStyles.title}>
              Este é o seu
            </Text>
            <Text className="font-semiBold mb-[-12]" style={gStyles.title}>
              novo app da
            </Text>
            <Text className="font-semiBold mb-[-12]" style={gStyles.title}>
              Avantar
            </Text>
          </View>
          <View className="mt-5">
            <Text style={gStyles.smallText}>onde você indica e ganha</Text>
            <Text style={gStyles.smallText}>comissão ou cashback.</Text>
          </View>
        </View>
        {/* Botões */}
        <View className="gap-5 mt-10">
          <TouchableOpacity
            style={gStyles.btnStyle}
            onPress={() => navigation.navigate('SignUpScreen')}
            activeOpacity={0.9}>
            <Text style={gStyles.smallText}>QUERO CRIAR UMA CONTA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={gStyles.btnStyleTransparent}
            onPress={() => navigation.navigate('SignInScreen')}
            activeOpacity={0.9}>
            <Text style={gStyles.smallText}>ACESSAR CONTA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
