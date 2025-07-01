import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import {BlurView} from '@react-native-community/blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onPress?: () => void;
  title: string;
  description: string;
  buttonText: string;
  buttonText2?: string;
}

export function CustomModal({
  visible,
  onClose,
  onPress,
  title,
  description,
  buttonText,
  buttonText2,
}: ModalProps) {
  const {width: screenWidth} = Dimensions.get('window');
  const maxModalWidth = screenWidth * 0.75; // 75% da largura da tela

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <BlurView
        style={{flex: 1, backgroundColor: 'transparent'}}
        blurType="dark"
        blurAmount={5}
        reducedTransparencyFallbackColor="transparent">
        <View className="flex-1 justify-center items-center px-4">
          <View 
            style={{
              maxWidth: maxModalWidth,
              minWidth: 280,
            }}
            className="bg-[#FFF] rounded-2xl border-2 border-blue px-5 py-5">
            
            {/* Título */}
            <Text className="text-lg font-bold text-center mb-3">
              {title}
            </Text>
            
            {/* Descrição */}
            <Text className="text-base font-regular text-center text-gray-500 mb-5">
              {description}
            </Text>
            
            {/* Botões */}
            <View className="justify-center items-center w-full flex-row gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white_btn_modal rounded-xl h-11 flex-1 py-3"
                onPress={onClose}>
                <Text className="text-primary_purple text-center font-bold">
                  {buttonText}
                </Text>
              </TouchableOpacity>
              {buttonText2 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-white_btn_modal rounded-xl flex-1 py-3"
                  onPress={onPress}>
                  <Text className="text-primary_purple text-center font-bold">
                    {buttonText2}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}
