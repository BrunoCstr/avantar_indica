import React from 'react';
import {Controller} from 'react-hook-form';
import {TextInput} from 'react-native';
import MaskInput from 'react-native-mask-input';

interface FormInputProps {
  name: string;
  placeholder: string;
  control: any;
  secureTextEntry?: boolean;
  errorMessage?: string;
  mask?: (string | RegExp)[];
  borderColor: string;
  backgroundColor: string;
  placeholderColor: string;
  height: number;
  color?: string;
}

export const FormInput = ({
  name,
  placeholder,
  control,
  secureTextEntry = false,
  errorMessage,
  mask,
  borderColor,
  backgroundColor,
  placeholderColor,
  height,
  color
}: FormInputProps) => (
  <>
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => 
        mask ? (
          <MaskInput
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mask={mask} // Aplica a máscara se existir
            placeholderTextColor= {errorMessage ? 'red' : placeholderColor}
            style={{
              borderWidth: 2,
              borderColor: errorMessage ? 'red' : borderColor,
              backgroundColor: backgroundColor,
              marginBottom: 6,
              height: height,
              width:"100%",
              padding: 15,
              paddingLeft: 20,
              borderRadius: 50,
              color: color
            }}
          />
        ) :
        (
        <TextInput
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          secureTextEntry={secureTextEntry}
          placeholderTextColor= {errorMessage ? 'red' : placeholderColor}
          style={{
            borderWidth: 2,
            borderColor: errorMessage ? 'red' : borderColor,
            backgroundColor: backgroundColor,
            marginBottom: 6,
            height: height,
            width: '100%',
            padding: 15,
            paddingLeft: 20,
            borderRadius: 50,
            color: color
          }}
        />
      )}
      name={name}
    />
  </>
);
