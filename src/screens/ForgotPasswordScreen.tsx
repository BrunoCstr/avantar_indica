import React, {useState} from 'react';
import {Text, ImageBackground, View} from 'react-native';
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
import {CustomModal} from '../components/CustomModal';

export function ForgotPasswordScreen() {
  const {forgotPassword} = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });

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

  const onSubmit = async (data: ForgotPasswordSchema) => {
    const errorCode = await forgotPassword(data.email);

    if (errorCode) {
      // Mapeia o erro para título e descrição
      switch (errorCode) {
        case 'auth/user-not-found':
          setModalMessage({
            title: 'Usuário não encontrado',
            description: 'Verifique o e-mail e tente novamente.',
          });
          break;
        case 'auth/invalid-email':
          setModalMessage({
            title: 'E-mail inválido',
            description: 'Digite um e-mail válido.',
          });
          break;
        case 'auth/too-many-requests':
          setModalMessage({
            title: 'Muitas tentativas',
            description: 'Aguarde alguns minutos e tente novamente.',
          });
          break;
        case 'auth/internal-error':
          setModalMessage({
            title: 'Erro interno',
            description: 'Tente novamente mais tarde.',
          });
          break;
        case 'auth/user-disabled':
          setModalMessage({
            title: 'Usuário desativado',
            description: 'Entre em contato com o suporte.',
          });
          break;
        default:
          setModalMessage({
            title: 'Erro desconhecido',
            description: 'Algo deu errado. Tente novamente.',
          });
          break;
      }

      setIsModalVisible(true);
    } else {
      setModalMessage({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
      setIsModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={images.bg_dark}
      style={{flex: 1}}
      resizeMode="cover">
      <View className="flex-1 justify-center item ml-10 mr-10">
        <View className="items-center">
          <Text className="font-semiBold text-2xl text-white mb-3">
            Altere sua senha
          </Text>
        </View>
        <FormInput
          name="email"
          placeholder="E-mail"
          control={control}
          errorMessage={errors.email?.message}
          borderColor={colors.blue}
          backgroundColor={colors.tertiary_purple_opacity}
          placeholderColor={colors.white_opacity}
          height={55}
          color={colors.white}
        />

        {/* Envio do Formulário de Cadastro */}
        <View className="mt-3">
          <Button
            text="ENVIAR"
            onPress={handleSubmit(onSubmit)}
            textColor="tertiary_purple"
            height={55}
            fontSize={25}
            backgroundColor="blue"
          />
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
  );
}
