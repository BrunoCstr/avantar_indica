import React from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import gStyles from '../styles/gStyles';
import images from '../data/images';

export function WaitingConfirmationScreen() {
  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 justify-center items-center p-10">
        <Image
          resizeMode="contain"
          source={images.avantar_voce_a_frente_roxo}
          style={gStyles.avantarVoceAFrente}></Image>
        <Text style={gStyles.titleWaiting}>Agora é só aguardar!</Text>
        <Text style={gStyles.smallTextWaiting}>
          Seu cadastro foi enviado para a unidade escolhida, assim que seu
          cadastro for aprovado chegará em seu e-mail uma notificação!
        </Text>
      </View>
    </ImageBackground>
  );
}
