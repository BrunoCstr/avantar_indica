import React from 'react';
import {Text, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';

export function ProfileScreen() {
  const {signOut, userData} = useAuth();
  const navigation = useNavigation();

  const displayName = userData?.displayName;
  const userFirstName = displayName?.slice(0, displayName.indexOf(' '));

  return (
    <View className="flex-1">
      <View className="h-1/4 justify-center items-center">
      <Image source={images.bg_profile_default} className="h-full w-full" />
      </View>
      <View className="flex-1">
        <View className="justify-center h-full bg-fifth_purple">
          <View className="mr-5 ml-5 gap-3">
            <Button
              text="Editar Perfil"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Editar Perfil')}
            />
            <Button
              text="Minhas informações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Minhas informações')}
            />
            <Button
              text="Notificações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => navigation.navigate('Notifications')}
            />
            <Button
              text="Cadastrar vendedores"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Cadatrar vendedores')}
            />
            <Button
              text="Sair"
              backgroundColor="red"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => signOut()}
            />
          </View>
        </View>
      </View>

      <View className="absolute mt-28 left-1/2 -translate-x-1/2 z-20 items-center">
        <Image
          source={images.default_profile_picture}
          className="h-30 w-30 rounded-md"
        />
        <Text className="text-white text-2xl font-bold text-center mt-2">
          {userFirstName}
        </Text>
      </View>
    </View>
  );
}
