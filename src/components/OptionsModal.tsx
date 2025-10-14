import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../styles/colors';
import IndicarIcon from '../assets/images/1.svg';
import IndicarEmMassaIcon from '../assets/images/2.svg';

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onIndicateIndividual: () => void;
  onIndicateBulk: () => void;
  onIndicateMultiple: () => void;
  onViewStatus: () => void;
  userRule?: string;
}

export function OptionsModal({
  visible,
  onClose,
  onIndicateIndividual,
  onIndicateBulk,
  onIndicateMultiple,
  onViewStatus,
  userRule,
}: OptionsModalProps) {
  const options = [
    {
      id: 'individual',
      title: 'Indicar Individualmente',
      description: 'Envie uma indicação mais completa',
      icon: 'person-add',
      iconType: 'Ionicons' as const,
      color: '#6600CC',
      onPress: onIndicateIndividual,
    },
    {
      id: 'bulk',
      title: 'Indicar em Massa',
      description: 'Envie vários contatos de seu celular',
      icon: 'people',
      iconType: 'Ionicons' as const,
      color: '#6600CC',
      onPress: onIndicateBulk,
    },
    {
      id: 'indicateMultiple',
      title: 'Indicar Múltiplos',
      description: 'Adicione várias pessoas a sua equipe',
      icon: 'business',
      iconType: 'Ionicons' as const,
      color: '#6600CC',
      onPress: onIndicateMultiple,
    },
    {
      id: 'status',
      title: 'Acompanhar as indicações',
      description: 'Acompanhe o status das suas indicações',
      icon: 'sync',
      iconType: 'AntDesign' as const,
      color: '#6600CC',
      onPress: onViewStatus,
    },
  ];

  const renderIcon = (icon: string, iconType: string, color: string) => {
    const iconSize = 24;

    switch (iconType) {
      case 'SVG':
        if (icon === 'IndicarIcon') {
          return <IndicarIcon width={iconSize} height={iconSize} tintColor={colors.white} />;
        } else if (icon === 'IndicarEmMassaIcon') {
          return <IndicarEmMassaIcon width={iconSize} height={iconSize} tintColor={colors.white} />;
        }
        return null;
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={iconSize}
            color={colors.white}
          />
        );
      case 'FontAwesome6':
        return (
          <FontAwesome6
            name={icon as any}
            size={iconSize}
            color={colors.white}
          />
        );
      case 'AntDesign':
        return (
          <AntDesign
            name={icon as any}
            size={iconSize}
            color={colors.white}
          />
        );
      case 'Ionicons':
        return (
          <Ionicons name={icon as any} size={iconSize} color={colors.white} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <TouchableOpacity 
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={onClose}>
          <TouchableOpacity 
            className="bg-fifth_purple rounded-t-3xl min-h-[60%]"
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}>
            <View className="w-full items-center mt-5">
                <View className='bg-white/20 rounded-2xl px-6 p-1'></View>
            </View>

            {/* Header */}
            <View className="flex-row justify-between items-center p-5">
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.gray}
                />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-white">
                O que deseja fazer?
              </Text>
              <View style={{width: 24}} />
            </View>

            <View className="px-6 mb-6">
              <Text className="text-white_opacity text-center text-sm">
                Escolha uma opção para começar
              </Text>
            </View>

            {/* Options List */}
            <View className="px-6 gap-3">
              {options
                .map(option => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: option.color,
                      borderRadius: 16,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                      {renderIcon(option.icon, option.iconType, option.color)}
                    </View>

                    {/* Content */}
                    <View style={{flex: 1}}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginBottom: 4,
                        }}>
                        {option.title}
                      </Text>
                      <Text
                        style={{
                          color: colors.white_opacity,
                          fontSize: 12,
                        }}>
                        {option.description}
                      </Text>
                    </View>

                    {/* Arrow */}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
