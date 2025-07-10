import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/colors';

export function SellerSkeleton() {
  return (
    <View
      className="bg-white rounded-xl mb-2 mx-2"
      style={{
        shadowColor: '#000',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        opacity: 0.7,
      }}
    >
      <View className="flex-row items-center p-4">
        {/* Avatar skeleton */}
        <View
          className="w-12 h-12 rounded-full mr-4"
          style={{ backgroundColor: '#E1E9EE' }}
        />
        
        {/* Informações skeleton */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center flex-1">
              <View 
                style={{ 
                  width: 120, 
                  height: 16, 
                  backgroundColor: '#E1E9EE', 
                  borderRadius: 6,
                  marginRight: 8
                }} 
              />
              <View 
                style={{ 
                  width: 50, 
                  height: 20, 
                  backgroundColor: '#E1E9EE', 
                  borderRadius: 6 
                }} 
              />
            </View>
          </View>
          
          <View 
            style={{ 
              width: 90, 
              height: 14, 
              backgroundColor: '#E1E9EE', 
              borderRadius: 6,
              marginBottom: 8
            }} 
          />
          
          <View 
            style={{ 
              width: 80, 
              height: 20, 
              backgroundColor: '#E1E9EE', 
              borderRadius: 10 
            }} 
          />
        </View>

        {/* Botões de ação skeleton */}
        <View className="flex-row gap-2 ml-2">
          <View 
            style={{ 
              width: 22, 
              height: 22, 
              backgroundColor: '#E1E9EE', 
              borderRadius: 11,
              marginRight: 8
            }} 
          />
          <View 
            style={{ 
              width: 22, 
              height: 22, 
              backgroundColor: '#E1E9EE', 
              borderRadius: 11 
            }} 
          />
        </View>
      </View>
    </View>
  );
} 