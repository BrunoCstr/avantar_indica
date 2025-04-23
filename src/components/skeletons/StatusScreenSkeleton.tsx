import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const { width } = Dimensions.get('window');
const containerWidth = width * 0.9;

export const StatusScreenSkeleton = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <ContentLoader
      speed={1.2}
      width={width}
      height={600}
      backgroundColor="#D8CDE8" // cinza roxo claro
      foregroundColor="#EFEAF6" // brilho lilás suave
    >
      {/* Título e botão voltar */}
      <Rect x="15" y="10" rx="8" ry="8" width="30" height="30" />
      <Rect x={width / 2 - 50} y="10" rx="5" ry="5" width="100" height="25" />

      {/* Barra de busca */}
      <Rect x="15" y="60" rx="12" ry="12" width={containerWidth} height="50" />

      {/* Cabeçalhos da lista */}
      <Rect x="30" y="130" rx="6" ry="6" width="100" height="20" />
      <Rect x={width - 130} y="130" rx="6" ry="6" width="80" height="20" />

      {/* Linhas de carregamento da lista */}
      {[...Array(6)].map((_, i) => (
        <Rect
          key={i}
          x="20"
          y={170 + i * 60}
          rx="12"
          ry="12"
          width={containerWidth}
          height="45"
        />
      ))}
    </ContentLoader>
  </View>
);
