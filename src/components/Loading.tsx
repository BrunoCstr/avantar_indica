import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';

export function Loading() {
  return (
    <View className='flex-1 justify-center items-center bg-purple-700'>
      <ActivityIndicator size="large" color={colors.white} style={{ transform: [{ scale: 2 }] }}/>
    </View>
  );
}
