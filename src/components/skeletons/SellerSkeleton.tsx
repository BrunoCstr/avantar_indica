import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/colors';

export function SellerSkeleton() {
  return (
    <View
      className="bg-fifth_purple border-2 border-blue w-full p-3 mt-2 rounded-xl flex-row items-center justify-between"
      style={{ opacity: 0.7 }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ width: 120, height: 16, backgroundColor: colors.tertiary_purple, borderRadius: 6, marginBottom: 6 }} />
        <View style={{ width: 90, height: 12, backgroundColor: colors.tertiary_purple, borderRadius: 6, marginBottom: 6 }} />
        <View style={{ width: 60, height: 10, backgroundColor: colors.tertiary_purple, borderRadius: 6 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ width: 24, height: 24, backgroundColor: colors.tertiary_purple, borderRadius: 12, marginRight: 8 }} />
        <View style={{ width: 24, height: 24, backgroundColor: colors.tertiary_purple, borderRadius: 12 }} />
      </View>
    </View>
  );
} 