import React from 'react';
import {Image, ImageBackground} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createBox, createText, useTheme} from '@shopify/restyle';

import images from '../data/images';
import {FormInput} from '../components/FormInput';
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from '../schemas/validationSchema';
import {ThemeProps} from '../styles';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function ForgotPasswordScreen() {
  const {forgotPassword} = useAuth();

  const theme = useTheme<ThemeProps>();

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
      <Box
        flex={1}
        justifyContent="center"
        marginLeft="l"
        marginRight="l"
        gap="s">
        <Image
          style={{width: '95%', resizeMode: 'contain'}}
          source={images.avantar_voce_a_frente_branca}></Image>
        <FormInput
          name="email"
          placeholder="E-mail"
          control={control}
          errorMessage={errors.email?.message}
          borderColor={theme.colors.blue}
          backgroundColor={theme.colors.tertiary_purple}
        />

        {/* Envio do Formulário de Cadastro */}
        <Box mt="m">
          <Button
            text="ENVIAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </ImageBackground>
  );
}
