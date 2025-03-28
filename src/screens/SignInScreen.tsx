import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Feather';
import {createBox, createText, useTheme} from '@shopify/restyle';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import images from '../data/images';
import {signInSchema, SignInFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import {ThemeProps} from '../styles';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';

const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function SignInScreen() {
  const {signIn} = useAuth();
  const [showPassword, setShowPassword] = useState(true);
  const theme = useTheme<ThemeProps>();

  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    signIn(data.email, data.password);
  };

  return (
    <ImageBackground
      source={images.bg_purple}
      style={{flex: 1}}
      resizeMode="cover">
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
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
        <Box width="100%">
          <Box position="relative">
            <FormInput
              name="password"
              placeholder="Senha"
              secureTextEntry={showPassword}
              control={control}
              errorMessage={errors.password?.message}
              borderColor={theme.colors.blue}
              backgroundColor={theme.colors.tertiary_purple}
            />
          </Box>
          <TouchableOpacity
            style={{position: 'absolute', right: 20, top: '26%'}}
            onPress={() => {
              setShowPassword(!showPassword);
            }}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </Box>

        {/* Envio do Formulário de Cadastro */}
        <Box mt="m" width="100%">
          <Button
            text="ENTRAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <Text pt="s" pr="s" textAlign="right" variant="anchorLink">
              Esqueci minha senha!
            </Text>
          </TouchableOpacity>
        </Box>

        <Box mt="xl">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}>
            <Text pt="s" pr="s" textAlign="right" variant="anchorLink" mt='xl'>
              Não tem uma conta? <Text variant='anchorLink_SignUp'>Cadastre aqui</Text>
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </ImageBackground>
  );
}
