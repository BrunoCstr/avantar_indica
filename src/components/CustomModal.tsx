import React from 'react';
import {Modal, View, Text, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform, ViewStyle} from 'react-native';
import {BlurView} from '@react-native-community/blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onPress?: () => void;
  title: string;
  description: string;
  buttonText: string | React.ReactNode;
  buttonText2?: string;
  cancelButtonText?: string;
  onCancelButtonPress?: () => void;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
}

export function CustomModal({
  visible,
  onClose,
  onPress,
  title,
  description,
  buttonText,
  buttonText2,
  cancelButtonText,
  onCancelButtonPress,
  scrollable = false,
  containerStyle = {},
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
        <KeyboardAvoidingView 
          className="flex-1 justify-center items-center px-4"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View 
            style={Object.assign({
              maxWidth: maxModalWidth,
              minWidth: 280,
            }, containerStyle)}
            className="bg-[#FFF] rounded-2xl border-2 border-blue px-5 py-5">
            
            {/* Título */}
            <Text className="text-lg font-bold text-black text-center mb-3">
              {title}
            </Text>
            
            {/* Descrição */}
            {scrollable ? (
              <ScrollView style={{maxHeight: 400, marginBottom: 20}} showsVerticalScrollIndicator={true}>
                <Text className="text-base font-regular text-black text-center text-gray-500 mb-5">
                  {description}
                </Text>
              </ScrollView>
            ) : (
              <Text className="text-base font-regular text-black text-center text-gray-500 mb-5">
                {description}
              </Text>
            )}
            
            {/* Botões */}
            <View className="justify-center items-center w-full flex-row gap-2">
              {cancelButtonText && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="bg-white_btn_modal rounded-xl h-11 flex-1 py-3"
                  onPress={onCancelButtonPress}
                >
                  <Text className="text-primary_purple text-center font-bold">
                    {cancelButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white_btn_modal rounded-xl h-11 flex-1 py-3 justify-center items-center"
                onPress={buttonText2 && !cancelButtonText ? onClose : (onPress ? onPress : onClose)}>
                {typeof buttonText === 'string' ? (
                  <Text className="text-primary_purple text-center font-bold">
                    {buttonText}
                  </Text>
                ) : (
                  buttonText
                )}
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
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}
