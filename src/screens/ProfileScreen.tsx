import React from 'react';
import {Text, View, Image} from 'react-native';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';

import images from '../data/images';

export function ProfileScreen() {
  const {signOut} = useAuth();

  return (
    <View className="flex-1">
      <View className="bg-blue h-1/4 justify-center items-center">
        <Text>Teste</Text>  
        {/* <View className="justify-center items-center mt-10">
          <Image
            source={images.default_profile_picture}
            className="h-30 w-30 rounded-md absolute z-10"></Image>
        </View> */}
      </View>
      <View className="flex-1">
        <View className="justify-center h-full bg-fifth_purple">
          <View className="mr-5 ml-5 gap-3">
            <Button
              text="Editar Informações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Editar Informações')}
            />
            <Button
              text="Notificações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Notificações')}
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
    </View>
  );
}
