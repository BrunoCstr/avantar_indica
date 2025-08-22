import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import images from '../data/images';
import {signInSchema, SignInFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {colors} from '../styles/colors';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';

type AuthStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  AuthScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignInScreen'>;

export function SignInScreen() {
  const {signIn} = useAuth();
  const [showPassword, setShowPassword] = useState(true);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

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

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const errorCode = await signIn(data.email, data.password);

      if (errorCode) {
        switch (errorCode) {
          case 'auth/invalid-email':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'E-mail inválido!',
            });
            setIsModalVisible(true);
            break;
          case 'auth/user-disabled':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Conta desativada.',
            });
            setIsModalVisible(true);
            break;
          case 'auth/user-not-found':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Usuário não encontrado.',
            });
            setIsModalVisible(true);
            break;
          case 'auth/wrong-password':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Senha incorreta.',
            });
            setIsModalVisible(true);
            break;
          case 'auth/too-many-requests':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Muitas tentativas. Tente novamente mais tarde.',
            });
            setIsModalVisible(true);
            break;
          case 'auth/network-request-failed':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Falha de conexão com a rede.',
            });
            setIsModalVisible(true);
            break;
          case 'auth/invalid-credential':
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Credenciais inválidas.',
            });
            setIsModalVisible(true);
            break;
          default:
            setModalMessage({
              title: 'Falha ao realizar o login',
              description: 'Erro desconhecido, entre em contato com o suporte!',
            });
            setIsModalVisible(true);
            break;
        }
      }
    } catch (error: any) {
      console.log(error);
      setModalMessage({
        title: 'Falha ao realizar o login',
        description: 'Erro desconhecido, entre em contato com o suporte!',
      });
      setIsModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback>
        <View
          style={{flexGrow: 1, justifyContent: 'center'}}
          >
          <ImageBackground
            source={images.bg_login}
            style={{flex: 1}}
            resizeMode="cover">
            <View className="pt-16 ml-10">
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
                  fontWeight="bold"
                  isLoading={isLoading}
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

              <CustomModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                title={modalMessage.title}
                description={modalMessage.description}
                buttonText="FECHAR"
              />
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
