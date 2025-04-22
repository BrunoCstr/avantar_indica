import React from 'react';
import {View, ImageBackground, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import images from '../../data/images';

const screenWidth = Dimensions.get('window').width;

export function HomeSkeleton() {
  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1">
        <SkeletonPlaceholder
          backgroundColor="#3f2763"
          highlightColor="#5f3c9c"
          borderRadius={8}>
          <View style={{paddingTop: 50, paddingHorizontal: 24}}>
            {/* Avatar + Nome + Notificação */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 70, height: 70, borderRadius: 35}} />
              <View style={{marginLeft: 16}}>
                <View style={{width: 120, height: 18, borderRadius: 4}} />
                <View
                  style={{
                    width: 180,
                    height: 14,
                    borderRadius: 4,
                    marginTop: 6,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 'auto',
                  width: 35,
                  height: 35,
                  borderRadius: 10,
                }}
              />
            </View>

            {/* Botões de indicação */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 32,
              }}>
              <View style={{width: (screenWidth - 70) / 2, height: 80}} />
              <View style={{width: (screenWidth - 70) / 2, height: 80}} />
            </View>

            {/* Botão de Regras */}
            <View
              style={{
                width: '100%',
                height: 70,
                borderRadius: 10,
                marginTop: 20,
              }}
            />

            {/* Card de Indicações */}
            <View
              style={{
                width: '100%',
                height: 250,
                borderRadius: 20,
                marginTop: 24,
              }}
            />

            {/* Botão de Status */}
            <View
              style={{
                width: '100%',
                height: 70,
                borderRadius: 10,
                marginTop: 24,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      </View>
    </ImageBackground>
  );
}
