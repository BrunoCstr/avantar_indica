import React, { useEffect } from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {getFirestore, doc, updateDoc} from '@react-native-firebase/firestore';

import gStyles from '../styles/gStyles';
import images from '../data/images';
import {useAuth} from '../contexts/Auth';
const db = getFirestore();

export function WaitingConfirmationScreen() {
  const {userData} = useAuth();

  async function requestUserPermission() {
    await messaging().requestPermission();
  }

  useEffect(() => {
    requestUserPermission();

    const getToken = async () => {
      try {
        const fcmToken = await messaging().getToken();

        if (userData?.uid) {
          const userRef = doc(db, 'users', userData.uid);
          await updateDoc(userRef, {
            fcmToken: fcmToken,
          });
        }
      } catch (error) {
        console.error('Erro ao salvar token FCM:', error);
      }
    };

    getToken();
  }, []);

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
