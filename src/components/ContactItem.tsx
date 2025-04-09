import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { applyMaskTelephone } from '../utils/applyMaskTelephone';

import { colors } from '../styles/colors';

export function ConctactItem({contact, selected, onToggle}: any) {
  const telephone = contact.phoneNumbers[0]?.number;
  const telephoneFormatted = applyMaskTelephone(telephone)

  return (
    <View className="mt-2">
      <TouchableOpacity
        onPress={onToggle}
        className="p-3 border-2 rounded-lg"
        style={{borderColor: selected ? 'green' : colors.secondary_lillac}}
        activeOpacity={0.6}>
        <Text
          className="font-bold"
          style={{color: selected ? 'green' : colors.secondary_purple}}>
          {contact.displayName}
        </Text>
        <Text
          className="font-regular"
          style={{color: selected ? 'green' : colors.secondary_purple}}>
          {telephoneFormatted || 'Sem número'}
        </Text>
        <Text
          className="font-regular"
          style={{color: selected ? 'green' : colors.secondary_purple}}>
          {selected ? 'Selecionado' : 'Toque para selecionar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
