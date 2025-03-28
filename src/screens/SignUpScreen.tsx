import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Feather';
import {createBox, useTheme} from '@shopify/restyle';

import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import images from '../data/images';
import {ThemeProps} from '../styles';
import {Button} from '../components/Button';
import {Image, ImageBackground, TouchableOpacity} from 'react-native';
import {useAuth} from '../contexts/Auth';

const Box = createBox<ThemeProps>();

export function SignUpScreen() {
  const [units, setUnits] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const {signUp} = useAuth();

  const theme = useTheme<ThemeProps>();

  useEffect(() => {
    // Pegar as unidades do Firebase
    const fetchUnits = async () => {
      const fetchedUnits = [
        'Avantar São Paulo - SP - Paraíso',
        'Avantar Belo Horizonte - MG',
        'Avantar Valparaíso - GO',
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
    const {confirmPassword, cpf, ...dataFiltred} = data;

    const cleanedCPF = cpf.replace(/\D/g, '');

    signUp(
      dataFiltred.fullName,
      dataFiltred.email,
      dataFiltred.password,
      cleanedCPF,
      dataFiltred.affiliated_to,
    );
  };

  return (
    <ImageBackground
      source={images.bg_white}
      style={{flex: 1}}
      resizeMode="cover">
      <Box flex={1} justifyContent="center" marginLeft="l" marginRight="l">
        <Image
          style={{width: '95%', resizeMode: 'contain'}}
          source={images.avantar_voce_a_frente_roxo}></Image>
        <FormInput
          name="fullName"
          placeholder="Nome"
          control={control}
          errorMessage={errors.fullName?.message}
          borderColor={theme.colors.tertiary_purple}
          backgroundColor={theme.colors.white}
        />
        <FormInput
          name="email"
          placeholder="E-mail"
          control={control}
          errorMessage={errors.email?.message}
          borderColor={theme.colors.tertiary_purple}
          backgroundColor={theme.colors.white}
        />
        <FormInput
          name="cpf"
          placeholder="CPF"
          control={control}
          errorMessage={errors.cpf?.message}
          mask={[
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '.',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
          ]}
          borderColor={theme.colors.tertiary_purple}
          backgroundColor={theme.colors.white}
        />

        <Box>
          <Box position="relative">
            <FormInput
              name="password"
              placeholder="Senha"
              secureTextEntry={showPassword}
              control={control}
              errorMessage={errors.password?.message}
              borderColor={theme.colors.tertiary_purple}
              backgroundColor={theme.colors.white}
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
              borderColor={theme.colors.tertiary_purple}
              backgroundColor={theme.colors.white}
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
                borderColor: errors.affiliated_to ? 'red' : '#3E0085', // Borda vermelha se houver erro
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
        <Box mt="m">
          <Button
            text="CADASTRAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </ImageBackground>
  );
}
