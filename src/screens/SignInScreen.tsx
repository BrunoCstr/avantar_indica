import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import images from '../data/images';
import {signInSchema, SignInFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {colors} from '../styles/colors';
import {BackButton} from '../components/BackButton';
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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          keyboardShouldPersistTaps="handled">
          <ImageBackground
            source={images.bg_login}
            style={{flex: 1}}
            resizeMode="cover">
            
            <View className='pt-16 ml-10'>
              <BackButton />
            </View>

            <View className="flex-1 justify-center items-center ml-10 mr-10 gap-2">
              <Text className="font-semiBold text-2xl text-white mb-3">
                Faça seu login
              </Text>
              <FormInput
                name="email"
                placeholder="Login"
                control={control}
                errorMessage={errors.email?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white}
                height={55}
                color={colors.white}
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
                    backgroundColor={colors.tertiary_purple_opacity}
                    placeholderColor={colors.white}
                    height={55}
                    color={colors.white}
                  />
                </View>
                <TouchableOpacity
                  style={{position: 'absolute', right: 20, top: '30%'}}
                  activeOpacity={0.8}
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
              <View className="w-full mt-1">
                <Button
                  text="ENTRAR"
                  height={55}
                  fontSize={25}
                  backgroundColor="blue"
                  onPress={handleSubmit(onSubmit)}
                  textColor="tertiary_purple"
                />
              </View>

              <View className="w-full">
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPasswordScreen')}
                  className="w-full">
                  <Text className="text-center font-regular text-white underline mt-3 text-lg">
                    Esqueci minha senha!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
