import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Feather';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import images from '../data/images';
import {signInSchema, SignInFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import gStyles from '../styles/gStyles';
import {colors} from '../styles/colors';

export function SignInScreen() {
  const {signIn} = useAuth();
  const [showPassword, setShowPassword] = useState(true);

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
      <View
        className="flex-1 justify-center items-center ml-10 mr-10"
        style={{gap: 8}}>
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
        <View className="w-full">
          <View className="relative">
            <FormInput
              name="password"
              placeholder="Senha"
              secureTextEntry={showPassword}
              control={control}
              errorMessage={errors.password?.message}
              borderColor={colors.blue}
              backgroundColor={colors.tertiary_purple}
              placeholderColor={colors.secondary_lillac}
              height={55}
            />
          </View>
          <TouchableOpacity
            style={{position: 'absolute', right: 20, top: '30%'}}
            onPress={() => {
              setShowPassword(!showPassword);
            }}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Envio do Formulário de Cadastro */}
        <View className="w-full mt-5">
          <Button
            text="ENTRAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View className='w-full'>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            className="w-full">
            <Text className="text-right" style={gStyles.anchorTextSingIn}>
              Esqueci minha senha!
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height:100, justifyContent:'flex-end'}}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={gStyles.anchorText2SingIn}>
              Não tem uma conta?{' '}
              <Text style={gStyles.anchorLinkSingIn}>Crie aqui</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
