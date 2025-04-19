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
      <View className="flex-1 ml-7 mr-7 mt-20 justify-start items-center">
        <View className="items-center relative w-full flex-col">
          <View className="w-full flex-row items-center justify-between mb-5">
            {/* Botão de voltar (só o esqueleto do quadrado com X) */}
            <SkeletonPlaceholder backgroundColor="#ffffff20" highlightColor="#ffffff10">
              <SkeletonPlaceholder.Item
                width={48}
                height={48}
                borderRadius={8}
              />
            </SkeletonPlaceholder>

            {/* Título */}
            <SkeletonPlaceholder backgroundColor="#ffffff20" highlightColor="#ffffff10">
              <SkeletonPlaceholder.Item
                width={160}
                height={30}
                borderRadius={6}
              />
            </SkeletonPlaceholder>

            {/* Espaço visual à direita */}
            <View className="h-12 w-12" />
          </View>

          {/* Lista de notificações falsas */}
          <FlatList
            data={Array.from({length: 5})}
            keyExtractor={(_, i) => i.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 60}}
            renderItem={() => (
              <SkeletonPlaceholder backgroundColor="#ffffff20" highlightColor="#ffffff10">
                <SkeletonPlaceholder.Item
                  flexDirection="row"
                  alignItems="flex-start"
                  marginBottom={25}>
                  {/* Ícone de notificação (círculo) */}
                  <SkeletonPlaceholder.Item
                    width={24}
                    height={24}
                    borderRadius={12}
                    marginRight={10}
                    marginTop={5}
                  />
                  {/* Texto da notificação */}
                  <SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item
                      width={220}
                      height={16}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                      width={280}
                      height={12}
                      borderRadius={4}
                      marginBottom={6}
                    />
                    <SkeletonPlaceholder.Item
                      width={100}
                      height={10}
                      borderRadius={4}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
