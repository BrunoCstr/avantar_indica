import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import images from '../data/images';

export function NotificationButton({count = 1}) {
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <View className="relative">
        <View className="bg-blue h-10 w-10 rounded-full items-center justify-center">
          <Image source={images.notification_icon} className="h-7 w-7" />
        </View>

        {count > 0 && (
          <View className="absolute -top-1 -right-1 bg-red w-4 h-4 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
