import React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/colors';

import images from '../data/images';

export function Rules() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={images.bg_status}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 ml-5 mr-5 mt-20 justify-start items-center">
        <View className="items-center flex-row relative w-full">
          <TouchableOpacity
            className="border-[1px] rounded-md border-white h-15 w-15 p-2 absolute "
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Entypo name="arrow-long-left" size={21} color={colors.white} />
          </TouchableOpacity>
          <Text className="text-white font-bold text-3xl mx-auto">
            Regras
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
