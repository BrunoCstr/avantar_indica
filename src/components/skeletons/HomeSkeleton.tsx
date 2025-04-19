import React from 'react';
import { View, ImageBackground } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import images from '../../data/images';

export function HomeSkeleton() {
  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover"
    >
      <SkeletonPlaceholder backgroundColor="#ffffff20" highlightColor="#ffffff10" marginLeft={28} marginRight={28} marginTop={20}>
        <View style={{ flexDirection: 'row', alignItems: 'center' ,marginLeft: 28, marginRight: 28, marginTop: 20 }}>
          {/* Header com foto, texto e botão de notificação */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Foto de perfil */}
            <SkeletonPlaceholder.Item
              width={70}
              height={70}
              borderRadius={35}
              marginRight={20}
            />
            {/* Textos */}
            <View style={{ flex: 1 }}>
              <SkeletonPlaceholder.Item
                width={120}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={180}
                height={16}
                borderRadius={4}
                marginTop={8}
              />
            </View>
            {/* Botão de notificação */}
            <SkeletonPlaceholder.Item
              width={40}
              height={40}
              borderRadius={8}
              marginLeft={10}
            />
          </View>

          {/* Botões INDICAR e INDICAR EM MASSA */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
            <SkeletonPlaceholder.Item
              width={150}
              height={60}
              borderRadius={12}
            />
            <SkeletonPlaceholder.Item
              width={150}
              height={60}
              borderRadius={12}
            />
          </View>

          {/* Botão REGRAS */}
          <SkeletonPlaceholder.Item
            width="100%"
            height={70}
            borderRadius={12}
            marginTop={20}
          />

          {/* Card Indicações */}
          <SkeletonPlaceholder.Item
            width="100%"
            height={320}
            borderRadius={20}
            marginTop={24}
          />

          {/* Botão STATUS DAS PROPOSTAS */}
          <SkeletonPlaceholder.Item
            width="100%"
            height={70}
            borderRadius={12}
            marginTop={24}
          />
        </View>
      </SkeletonPlaceholder>
    </ImageBackground>
  );
}
