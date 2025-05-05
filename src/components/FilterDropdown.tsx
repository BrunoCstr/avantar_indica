import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
interface FilterDropdownProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  selectedOptions: string[];
  onSelectOption: (option: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  visible,
  onClose,
  options,
  selectedOptions,
  onSelectOption,
}) => {
  if (!visible) return null;

  return (
    <View className="absolute top-16 right-5 z-20">
      <TouchableOpacity
        className="absolute top-0 bottom-0 left-0 right-0"
        activeOpacity={1}
        onPress={onClose}
      />

      <View className="bg-fifth_purple rounded-xl py-2 px-1 border-2 border-blue shadow-lg">
        {options.map((option, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            onPress={() => onSelectOption(option)}
            className="flex-row items-center py-2 px-3"
          >
            <View className="w-5 h-5 border border-purple-500 rounded mr-2 flex items-center justify-center">
              {selectedOptions.includes(option) && (
                <View className="w-3 h-3 bg-purple-500 rounded-sm" />
              )}
            </View>
            <Text className="text-purple-200">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
