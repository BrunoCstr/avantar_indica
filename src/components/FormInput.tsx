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
}

export const FormInput = ({
  name,
  placeholder,
  control,
  secureTextEntry = false,
  errorMessage,
  mask
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
            style={{
              borderWidth: 1,
              borderColor: errorMessage ? 'red' : 'gray',
              marginBottom: 10,
              height: 45,
              padding: 10,
              borderRadius: 5,
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
          style={{
            borderWidth: 1,
            borderColor: errorMessage ? 'red' : 'gray',
            marginBottom: 10,
            height: 45,
            padding: 10,
            borderRadius: 5
          }}
        />
      )}
      name={name}
    />
  </>
);
