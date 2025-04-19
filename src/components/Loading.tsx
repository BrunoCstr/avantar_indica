import React from 'react';
import {View, ActivityIndicator, ImageBackground} from 'react-native';

import images from '../data/images';
import {colors} from '../styles/colors';

export function Loading() {
  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator
          size='large'
          color={colors.white}
          style={{transform: [{scale: 1.5}]}}
        />
      </View>
    </ImageBackground>
  );
}
