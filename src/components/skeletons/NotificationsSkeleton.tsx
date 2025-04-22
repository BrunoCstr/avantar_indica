import React from 'react';
import {View, FlatList, ImageBackground} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import images from '../../data/images';

export function NotificationsSkeleton() {
  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1">
        <SkeletonPlaceholder
          backgroundColor="#3f2763"
          highlightColor="#5f3c9c"
          borderRadius={10}>
          <View style={{paddingTop: 70, paddingHorizontal: 28}}>
            {/* Header com título e botões laterais */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: 35, height: 35, borderRadius: 6}} />
              <View style={{width: 160, height: 24, borderRadius: 6}} />
              <View/>
            </View>

            {/* Botões de filtro (LIDAS / NÃO LIDAS) */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 6,
                marginTop: 30,
              }}>
              <View style={{width: 80, height: 20, borderRadius: 20}} />
              <View style={{width: 80, height: 20, borderRadius: 20}} />
            </View>

            {/* Lista de notificações */}
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={{
                  marginTop: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: '#3f2763',
                  borderRadius: 20,
                }}>
                <View style={{width: 24, height: 24, borderRadius: 12}} />
                <View style={{marginLeft: 16, flex: 1}}>
                  <View style={{width: '80%', height: 16, borderRadius: 4}} />
                  <View
                    style={{
                      width: '95%',
                      height: 14,
                      borderRadius: 4,
                      marginTop: 6,
                    }}
                  />
                  <View
                    style={{
                      width: 100,
                      height: 12,
                      borderRadius: 4,
                      marginTop: 6,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </SkeletonPlaceholder>
      </View>
    </ImageBackground>
  );
}
