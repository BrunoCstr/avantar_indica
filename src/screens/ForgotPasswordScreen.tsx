import React from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import images from '../data/images';
import {FormInput} from '../components/FormInput';
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from '../schemas/validationSchema';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {colors} from '../styles/colors';

export function ForgotPasswordScreen() {
  const {forgotPassword} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    forgotPassword(data.email);
  };

  return (
    <ImageBackground
      source={images.bg_purple}
      style={{flex: 1}}
      resizeMode="cover">
      <View className="flex-1 justify-center ml-10 mr-10 gap-10">
        <Image
          style={{width: '95%', resizeMode: 'contain'}}
          source={images.avantar_voce_a_frente_branca}></Image>
        <FormInput
          name="email"
          placeholder="E-mail"
          control={control}
          errorMessage={errors.email?.message}
          borderColor={colors.blue}
          backgroundColor={colors.tertiary_purple}
          placeholderColor={colors.secondary_lillac}
          height={55}
        />

        {/* Envio do Formulário de Cadastro */}
        <View className='mt-5'>
          <Button
            text="ENVIAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
