import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

export function HomeSkeleton() {
  const { width } = Dimensions.get('window');
  const horizontalPadding = 28; // ml-7 + mr-7 → 14px + 14px
  const containerWidth = width - horizontalPadding * 2;
  const halfWidth = (containerWidth - 10) / 2; // espaço entre os dois botões

  return (
    <View style={{ flex: 1, marginTop: 40, marginLeft: 28, marginRight: 28 }}>
      <ContentLoader
        speed={1}
        width={containerWidth}
        height={700}
        viewBox={`0 0 ${containerWidth} 700`}
        backgroundColor="#3f2763"
        foregroundColor="#5f3c9c"
      >
        {/* Avatar */}
        <Circle cx="40" cy="40" r="35" />

        {/* Nome + descrição */}
        <Rect x="85" y="20" rx="4" ry="4" width="35%" height="18" />
        <Rect x="85" y="44" rx="4" ry="4" width="50%" height="14" />

        {/* Notificação */}
        <Rect x={containerWidth - 40} y="20" rx="10" ry="10" width="35" height="35" />

        {/* Botões de indicação */}
        <Rect x="0" y="100" rx="10" ry="10" width={halfWidth} height={80} />
        <Rect x={halfWidth + 10} y="100" rx="10" ry="10" width={halfWidth} height={80} />

        {/* Botão de Regras */}
        <Rect x="0" y="200" rx="10" ry="10" width={containerWidth} height={80} />

        {/* Card de Indicações */}
        <Rect x="0" y="300" rx="20" ry="20" width={containerWidth} height={250} />

        {/* Botão de Status */}
        <Rect x="0" y="570" rx="10" ry="10" width={containerWidth} height={80} />
      </ContentLoader>
    </View>
  );
}
