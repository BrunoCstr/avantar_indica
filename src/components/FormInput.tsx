import React from 'react';
import {View, Text, TextInput} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {withDefaultFont} from '../config/fontConfig';
import {colors} from '../styles/colors';

interface FormInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  mask?: 'phone' | 'cpf' | 'cnpj';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

const getMask = (maskType?: string) => {
  switch (maskType) {
    case 'phone':
      return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    case 'cpf':
      return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    case 'cnpj':
      return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    default:
      return undefined;
  }
};

export const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  hasError = false,
  errorMessage,
  mask,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) => {
  const maskPattern = getMask(mask);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-primary_purple font-medium mb-2">
          {label}
        </Text>
      )}
      
      {maskPattern ? (
        <MaskInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          mask={maskPattern}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={hasError ? colors.red : colors.gray}
          style={withDefaultFont({
            borderWidth: 1,
            borderColor: hasError ? colors.red : colors.gray,
            backgroundColor: colors.white,
            height: multiline ? 80 : 50,
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            color: colors.primary_purple,
            fontSize: 16,
            textAlignVertical: multiline ? 'top' : 'center',
          })}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor={hasError ? colors.red : colors.gray}
          style={withDefaultFont({
            borderWidth: 1,
            borderColor: hasError ? colors.red : colors.gray,
            backgroundColor: colors.white,
            height: multiline ? 80 : 50,
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            color: colors.primary_purple,
            fontSize: 16,
            textAlignVertical: multiline ? 'top' : 'center',
          })}
        />
      )}
      
      {hasError && errorMessage && (
        <Text className="text-red text-sm mt-1">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
