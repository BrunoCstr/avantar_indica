import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { formatPhoneForDisplay } from '../utils/formatPhoneNumber';

import { colors } from '../styles/colors';

export function ConctactItem({contact, selected, onToggle}: any) {
  const telephone = contact.phoneNumbers[0]?.number;
  const telephoneFormatted = formatPhoneForDisplay(telephone)

  return (
    <View className="mt-2">
      <TouchableOpacity
        onPress={onToggle}
        className="p-3 border-2 rounded-lg"
        style={{borderColor: selected ? 'green' : colors.primary_purple}}
        activeOpacity={0.6}>
        <Text
          className="font-bold"
          style={{color: selected ? 'green' : colors.primary_purple}}>
          {contact.displayName}
        </Text>
        <Text
          className="font-regular"
          style={{color: selected ? 'green' : colors.primary_purple}}>
          {telephoneFormatted || 'Sem número'}
        </Text>
        <Text
          className="font-regular"
          style={{color: selected ? 'green' : colors.primary_purple}}>
          {selected ? 'Selecionado' : 'Toque para selecionar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
