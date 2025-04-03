import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {BottomNavigator} from '../components/BottomNavigator';
import images from '../data/images';

export function WalletScreen() {
  return (
    <View className="flex-1 bg-white">
      <Image source={images.bg_home_white} resizeMode="contain" />
      <View className="justify-between items-center flex-row ml-5 mr-5">
        <TouchableOpacity
          className="border-[1px] rounded-md border-primary_purple h-15 w-15 p-2"
          activeOpacity={0.8}
          onPress={() => console.log('vasco')}
          >
          <Image source={images.left_icon} className="h-7 w-7" />
        </TouchableOpacity>
        <Text className="text-primary_purple font-bold text-3xl absolute left-1/2 -translate-x-1/2">
          Carteira
        </Text>
      </View>
    </View>
  );
}
