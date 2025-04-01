import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

import images from '../data/images';
import {useNavigation, useRoute} from '@react-navigation/native';

export function BottomNavigator() {
  const navigation = useNavigation();
  const route = useRoute()

  const selectedButton = (screenName: string) => {
    return route.name === screenName ? 'bg-blue' : '';
  }

  return (
    <View className="flex-row gap-7 bg-white absolute bottom-0 w-full rounded-tl-3xl rounded-tr-3xl h-[65px] pl-5 pr-5 items-center justify-center">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('HomeScreen')}>
        <View className={`h-14 w-14 rounded-full items-center justify-center ${selectedButton('HomeScreen')}`}>
          <Image source={images.home_icon} className="h-10 w-10" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('WalletScreen')}>
        <View className={`h-14 w-14 rounded-full items-center justify-center ${selectedButton('WalletScreen')}`}>
          <Image source={images.carteira_icon} className="h-10 w-10" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('StatusScreen')}>
        <View className={`h-14 w-14 rounded-full items-center justify-center ${selectedButton('StatusScreen')}`}>
          <Image source={images.status_icon} className="h-10 w-10" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ProfileScreen')}>
        <View className={`h-14 w-14 rounded-full items-center justify-center ${selectedButton('ProfileScreen')}`}>
          <Image source={images.profile_icon} className="h-10 w-10" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
