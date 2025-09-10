import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import { useAuth } from '../contexts/Auth';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const { loadingProgress, loadingMessage } = useAuth();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: loadingProgress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [loadingProgress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-[#4A04A5] justify-center items-center px-10">
      {/* Logo */}
      <View className="flex-1 justify-center items-center">
        <View className="w-30 h-30 bg-white/10 rounded-full justify-center items-center border-2 border-white/30">
          <Image
            source={require('../assets/images/appLogo.svg')}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View className="w-full items-center pb-20">
        <View 
          className="bg-white/20 rounded-sm overflow-hidden mb-5"
          style={{ width: width - 80, height: 4 }}
        >
          <Animated.View 
            className="h-full bg-white rounded-sm"
            style={{ width: progressWidth }}
          />
        </View>
        <Text className="text-white text-base font-medium tracking-wide">
          {loadingMessage}
        </Text>
      </View>
    </View>
  );
}
