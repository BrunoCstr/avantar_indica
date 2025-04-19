import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText: string;
}

export function CustomModal({
  visible,
  onClose,
  title,
  description,
  buttonText,
}: ModalProps) {
  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <BlurView
        style={{flex: 1, backgroundColor: 'transparent'}}
        blurType="dark"
        blurAmount={5}
        reducedTransparencyFallbackColor="transparent">
        <View className="flex-1 justify-center items-center">
          <View className="w-3/4 h-1/5 bg-[#FFF] rounded-2xl border-2 border-blue px-5 py-5 justify-center items-center">
            <Text className="text-lg font-bold text-center">{title}</Text>
            <Text className="text-base font-regular text-center text-gray-500 mt-2">
              {description}
            </Text>
            <View className="pt-5 justify-center items-center w-full">
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white_btn_modal rounded-xl w-2/4 py-2"
                onPress={onClose}>
                <Text className="text-primary_purple text-center font-bold">
                  {buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
