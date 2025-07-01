import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import gStyles from '../styles/gStyles';
import images from '../data/images';

export default function NoPermission() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 justify-center items-center p-10">
        <Image
          resizeMode="contain"
          source={images.avantar_voce_a_frente_roxo}
          style={gStyles.avantarVoceAFrente}
        />
        <Ionicons name="alert-circle" size={60} color="#EAB308" style={{ marginVertical: 24 }} />
        <Text style={gStyles.titleWaiting}>Sem permissão</Text>
        <Text style={gStyles.smallTextWaiting}>
          Você não tem permissão para acessar esta página, entre em contato com sua unidade para mais informações.
        </Text>
        <View style={{ marginTop: 32 }}>
          <BackButton onPress={() => navigation.goBack()} color="#EAB308" borderColor="#EAB308" />
        </View>
      </View>
    </ImageBackground>
  );
}
