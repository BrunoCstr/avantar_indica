import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface FilterDropdownProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  selectedOptions: string[];
  onSelectOption: (option: string) => void;
  position?: {
    top?: number;
    right?: number;
    left?: number;
  };
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  visible,
  onClose,
  options,
  selectedOptions,
  onSelectOption,
  position = { top: 180, right: 20 },
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        <View 
          className="absolute"
          style={{ 
            top: position.top,
            right: position.right,
            left: position.left,
            minWidth: 200,
            zIndex: 10000
          }}
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-fifth_purple rounded-xl py-2 px-1 border-2 border-blue shadow-lg">
              {options.map((option, index) => {
                // Separador visual - não é clicável
                if (option === '---') {
                  return (
                    <View
                      key={index}
                      className="mx-3 my-1"
                    >
                      <View className="h-px bg-purple-300 opacity-50" />
                    </View>
                  );
                }

                return (
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
                    <Text className="text-purple-200 flex-1">{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
