import React, { useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {signInSchema, SignInFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import Icon from 'react-native-vector-icons/Feather';

import {createBox} from '@shopify/restyle';
import {ThemeProps} from '../theme';
import {Button} from '../components/Button';
import {TouchableOpacity} from 'react-native';

const Box = createBox<ThemeProps>();


export function SignInScreen() {
  const [showPassword, setShowPassword] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit = (data: SignInFormData) => {
    console.log('Usuário autenticado com sucesso!', data);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      marginLeft="l"
      marginRight="l"
      gap="s">
      <FormInput
        name="email"
        placeholder="E-mail"
        control={control}
        errorMessage={errors.email?.message}
      />
      <Box>
        <Box position="relative">
          <FormInput
            name="password"
            placeholder="Senha"
            secureTextEntry={showPassword}
            control={control}
            errorMessage={errors.password?.message}
          />
        </Box>
        <TouchableOpacity
          style={{position: 'absolute', right: 20, top: '20%'}}
          onPress={() => {
            setShowPassword(!showPassword);
          }}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="black"
          />
        </TouchableOpacity>
      </Box>

      {/* Envio do Formulário de Cadastro */}
      <Box mt='m'>
        <Button
          text="ENTRAR"
          backgroundColor="purple"
          onPress={handleSubmit(onSubmit)}
        />
      </Box>
    </Box>
  );
}
