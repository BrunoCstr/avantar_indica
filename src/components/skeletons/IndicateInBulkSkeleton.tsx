import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

export function IndicateInBulkSkeleton() {
  const { width } = Dimensions.get('window');
  const contentWidth = width - 40; // 20px de padding de cada lado (ml-5 mr-5)

  return (
    <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
      <ContentLoader
        speed={1}
        width={`${contentWidth}`}
        height={800}
        viewBox={`0 0 ${contentWidth} 800`}
        backgroundColor="#dddddd"
        foregroundColor="#f0f0f0"
      >
        {/* Header */}
        <Rect x="0" y="0" rx="8" ry="8" width={30} height={32} /> {/* BackButton */}
        <Rect x={`${contentWidth / 2 - 100}`} y="0" rx="8" ry="8" width={200} height={32} /> {/* Título */}

        {/* Texto "Selecione os contatos:" */}
        <Rect x={`${contentWidth / 2 - 75}`} y="60" rx="4" ry="4" width={150} height={20} />

        {/* Input de busca */}
        <Rect x="0" y="90" rx="10" ry="10" width={`${contentWidth}`} height={55} />

        {/* Lista de contatos (6 itens simulados) */}
        {[...Array(6)].map((_, i) => {
          const yOffset = 160 + i * 80;
          return (
            <React.Fragment key={i}>
              <Rect x="10" y={`${yOffset + 5}`} rx="6" ry="6" width={`${contentWidth - 80}`} height={18} />
              <Rect x="10" y={`${yOffset + 30}`} rx="6" ry="6" width={`${contentWidth - 120}`} height={14} />
            </React.Fragment>
          );
        })}

        {/* Botão "ENVIAR" */}
        <Rect x="0" y="700" rx="12" ry="12" width={`${contentWidth}`} height={60} />
      </ContentLoader>
    </View>
  );
}
