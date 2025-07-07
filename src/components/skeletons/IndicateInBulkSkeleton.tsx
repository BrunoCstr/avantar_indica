import React from 'react';
import { View, Dimensions } from 'react-native';

export function IndicateInBulkSkeleton() {
  const { width } = Dimensions.get('window');
  const contentWidth = width - 40; // 20px de padding de cada lado (ml-5 mr-5)

  return (
    <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ width: 30, height: 32, backgroundColor: '#D8CDE8', borderRadius: 8 }} />
        <View style={{ width: 200, height: 32, backgroundColor: '#D8CDE8', borderRadius: 8 }} />
        <View style={{ width: 30 }} />
      </View>

      {/* Texto "Selecione os contatos:" */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View style={{ width: 150, height: 20, backgroundColor: '#D8CDE8', borderRadius: 4 }} />
      </View>

      {/* Input de busca */}
      <View style={{ width: contentWidth, height: 55, backgroundColor: '#D8CDE8', borderRadius: 10, marginBottom: 20 }} />

      {/* Lista de contatos (6 itens simulados) */}
      <View style={{ flex: 1 }}>
        {[...Array(6)].map((_, i) => {
          return (
            <View key={i} style={{ marginBottom: 16 }}>
              <View style={{ 
                backgroundColor: '#EFEAF6', 
                borderRadius: 8, 
                padding: 12, 
                borderWidth: 1, 
                borderColor: '#D8CDE8' 
              }}>
                <View style={{ 
                  width: contentWidth - 80, 
                  height: 18, 
                  backgroundColor: '#D8CDE8', 
                  borderRadius: 6, 
                  marginBottom: 8 
                }} />
                <View style={{ 
                  width: contentWidth - 120, 
                  height: 14, 
                  backgroundColor: '#D8CDE8', 
                  borderRadius: 6, 
                  marginBottom: 8 
                }} />
                <View style={{ 
                  width: contentWidth - 160, 
                  height: 14, 
                  backgroundColor: '#D8CDE8', 
                  borderRadius: 6 
                }} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Botão "ENVIAR" */}
      <View style={{ marginTop: 'auto', marginBottom: 40 }}>
        <View style={{ width: contentWidth, height: 60, backgroundColor: '#D8CDE8', borderRadius: 12 }} />
      </View>
    </View>
  );
}
