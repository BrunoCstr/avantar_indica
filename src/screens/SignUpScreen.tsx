import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Picker, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {signUpSchema, SignUpFormData} from '../schemas/signUpSchema';
import {FormInput} from '../components/FormInput';

import {createBox, createText} from '@shopify/restyle';
import {ThemeProps} from '../theme';
const Box = createBox<ThemeProps>();
const Text = createText<ThemeProps>();

export function SignUpScreen() {
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    // Pegar as unidades do Firebase
    const fetchUnits = async () => {
      const fetchedUnits = [
        'Unidade de Teste 1',
        'Unidade de Teste 2',
        'Unidade de Teste 3',
      ];
      setUnits(fetchedUnits);
    };
    fetchUnits();
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      affiliated_to: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log('Usuário cadastrado com sucesso!', data);
  };

  return (
    <Box
      flex={1}
      justifyContent="center"
      marginLeft="l"
      marginRight="l"
      backgroundColor="purple">
      <FormInput
        name="fullName"
        placeholder="Nome"
        control={control}
        errorMessage={errors.fullName?.message}
      />
      <FormInput
        name="email"
        placeholder="E-mail"
        control={control}
        errorMessage={errors.email?.message}
      />
      <FormInput
        name="cpf"
        placeholder="CPF"
        control={control}
        errorMessage={errors.cpf?.message}
      />
      <FormInput
        name="password"
        placeholder="Senha"
        secureTextEntry
        control={control}
        errorMessage={errors.password?.message}
      />
      <FormInput
        name="confirmPassword"
        placeholder="Confirmar Senha"
        secureTextEntry
        control={control}
        errorMessage={errors.confirmPassword?.message}
      />

      {/* Input de Seleção da Unidade */}
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <>
            <Picker selectedValue={value} onValueChange={onChange}>
              <Picker.Item label="Selecione uma unidade" value="" />
              {units.map(unit => (
                <Picker.Item key={unit} label={unit} value={unit} />
              ))}
            </Picker>
            {errors.affiliated_to && (
              <Text color="red">{errors.affiliated_to?.message}</Text>
            )}
          </>
        )}
        name="affiliated_to"
      />

      {/* Envio do Formulário de Cadastro */}
      
    </Box>
  );
}
