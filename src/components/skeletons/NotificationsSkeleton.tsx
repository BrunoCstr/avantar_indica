import React from 'react';
import { View, ImageBackground, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import images from '../../data/images';

export function NotificationsSkeleton() {
  const { width } = Dimensions.get('window');
  const loaderWidth = width - 56; // padding horizontal: px-7 = 28px de cada lado

  return (
    <ImageBackground
      source={images.bg_home_purple}
      style={{ flex: 1 }}
      resizeMode="cover">
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 36 }}>
        <ContentLoader
          speed={1.2}
          width={loaderWidth}
          height={950}
          viewBox={`0 0 ${loaderWidth} 950`}
          backgroundColor="#3f2763"
        foregroundColor="#5f3c9c"
        >
          {/* Header com título e botões laterais */}
          <Rect x="0" y="0" rx="6" ry="6" width="35" height="35" />
          <Rect x={loaderWidth / 2 - 80} y="0" rx="6" ry="6" width="160" height="35" />

          {/* Botões de filtro */}
          <Rect x={loaderWidth - 160} y="75" rx="10" ry="10" width="80" height="20" />
          <Rect x={loaderWidth - 75} y="75" rx="10" ry="10" width="80" height="20" />

          {/* Notificações (4 simuladas) */}
          {[...Array(4)].map((_, i) => {
            const baseY = 120 + i * 80;
            return (
              <React.Fragment key={i}>
                <Circle cx="12" cy={baseY} r="12" />
                <Rect x="40" y={baseY - 12} rx="4" ry="4" width={loaderWidth - 80} height="16" />
                <Rect x="40" y={baseY + 10} rx="4" ry="4" width={loaderWidth - 40} height="14" />
                <Rect x="40" y={baseY + 30} rx="4" ry="4" width={loaderWidth / 3} height="12" />
              </React.Fragment>
            );
          })}
        </ContentLoader>
      </View>
    </ImageBackground>
  );
}
