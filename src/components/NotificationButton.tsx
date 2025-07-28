import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../styles/colors';
import { useResponsive } from '../hooks/useResponsive';

export function NotificationButton({count = 1}) {
  const navigation = useNavigation();
  const { isSmallScreen } = useResponsive();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Notifications')}>
      <View className="relative">
        <View className={`${isSmallScreen ? 'h-8 w-8' : 'h-10 w-10'} rounded-full items-center justify-center`}>
          <MaterialIcons 
            name="notifications-active" 
            size={isSmallScreen ? 24 : 28} 
            color={colors.blue} 
          />
        </View>

        {count > 0 && (
          <View className={`absolute -top-1 -right-1 bg-pink ${isSmallScreen ? 'w-3 h-3' : 'w-4 h-4'} rounded-full items-center justify-center`}>
            <Text className={`text-white ${isSmallScreen ? 'text-xs' : 'text-xs'} font-bold`}>{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
