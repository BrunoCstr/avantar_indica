import React from 'react';
import {Controller} from 'react-hook-form';
import {TextInput} from 'react-native';
import {createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';

const Text = createText<ThemeProps>();

interface FormInputProps {
  name: string;
  placeholder: string;
  control: any;
  secureTextEntry?: boolean;
  errorMessage?: string;
}

export const FormInput = ({
  name,
  placeholder,
  control,
  secureTextEntry = false,
  errorMessage,
}: FormInputProps) => (
  <>
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
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
