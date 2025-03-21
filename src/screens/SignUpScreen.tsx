import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import Icon from 'react-native-vector-icons/Feather';

import {createBox} from '@shopify/restyle';
import {ThemeProps} from '../theme';
import {Button} from '../components/Button';
import {TouchableOpacity} from 'react-native';

const Box = createBox<ThemeProps>();


export function SignUpScreen() {
  const [units, setUnits] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

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
      gap="s">
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

      <Box>
        <Box position="relative">
          <FormInput
            name="confirmPassword"
            placeholder="Confirmar Senha"
            secureTextEntry={showConfirmPassword}
            control={control}
            errorMessage={errors.confirmPassword?.message}
          />
        </Box>
        <TouchableOpacity
          style={{position: 'absolute', right: 20, top: '20%'}}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Icon
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={22}
            color="black"
          />
        </TouchableOpacity>
      </Box>

      {/* Input de Seleção da Unidade */}
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Box
            style={{
              borderWidth: 1,
              borderColor: errors.affiliated_to ? 'red' : 'gray', // Borda vermelha se houver erro
              borderRadius: 5,
              paddingLeft: 8,
              paddingRight: 8,
              justifyContent: 'center',
            }}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{
                height: 45,
                width: '100%',
              }}>
              <Picker.Item label="Selecione uma unidade" value="" />
              {units.map(unit => (
                <Picker.Item key={unit} label={unit} value={unit} />
              ))}
            </Picker>
          </Box>
        )}
        name="affiliated_to"
      />

      {/* Envio do Formulário de Cadastro */}
      <Box mt='m'>
        <Button
          text="CADASTRAR"
          backgroundColor="purple"
          onPress={handleSubmit(onSubmit)}
        />
      </Box>
    </Box>
  );
}