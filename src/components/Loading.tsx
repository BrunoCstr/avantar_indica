import React from 'react';
import {View, ActivityIndicator, ImageBackground, Animated} from 'react-native';
import {useEffect, useRef} from 'react';

import images from '../data/images';
import {colors} from '../styles/colors';

export function Loading() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      <Animated.View 
        className="flex-1 justify-center items-center"
        style={{
          opacity: fadeAnim,
          transform: [{scale: scaleAnim}],
        }}>
        <ActivityIndicator
          size='large'
          color={colors.white}
          style={{transform: [{scale: 1.5}]}}
        />
      </Animated.View>
    </ImageBackground>
  );
}
