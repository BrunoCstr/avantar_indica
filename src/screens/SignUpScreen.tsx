import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  collection,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore';

import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';
import {FormInput} from '../components/FormInput';
import images from '../data/images';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {colors} from '../styles/colors';
import app from '../../firebaseConfig';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';

const db = getFirestore(app);

export function SignUpScreen() {
  const [units, setUnits] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });

  const {signUp} = useAuth();

  useEffect(() => {
    // Pegar as unidades do Firebase
    const fetchUnits = async () => {
      try {
        const unitsCollection = collection(db, 'units');
        const unitsSnapshot = await getDocs(unitsCollection);
        const unitsList = unitsSnapshot.docs.map(doc => doc.data());

        setUnits(unitsList);
      } catch (error) {
        console.error('Erro ao buscar unidades:', error);
      }
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
      password: '',
      confirmPassword: '',
      affiliated_to: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    const {confirmPassword, ...dataFiltred} = data;

    const unit = units.find(u => u.unitId === dataFiltred.affiliated_to);
    const unitName = unit?.name ?? "";

    const errorCode = await signUp(
      dataFiltred.fullName,
      dataFiltred.email,
      dataFiltred.password,
      dataFiltred.affiliated_to,
      dataFiltred.phone,
      unitName
    );

    if (errorCode) {
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description: 'E-mail já cadastrado.',
          });
          break;
        case 'auth/invalid-email':
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description: 'E-mail inválido.',
          });
          break;
        case 'auth/weak-password':
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description: 'Senha muito fraca.',
          });
          break;
        case 'auth/operation-not-allowed':
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description:
              'Criação de conta com e-mail e senha não está habilitada.',
          });
          break;
        case 'auth/network-request-failed':
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description: 'Falha de conexão com a rede.',
          });
          break;
        default:
          setModalMessage({
            title: 'Falha ao cadastrar o usuário',
            description: 'Erro desconhecido, entre em contato com o suporte!',
          });
      }

      setIsModalVisible(true);
    }
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
            source={images.bg_dark}
            className="flex-1"
            resizeMode="cover">
            <View className="pt-16 ml-10">
              <BackButton />
            </View>
            <View className="flex-1 justify-center ml-10 mr-10">
              <View className="justify-center items-center">
                <Text className="font-semiBold text-2xl text-white mb-5">
                  Faça seu cadastro
                </Text>
              </View>

              <View className="gap-2">
                <FormInput
                  name="fullName"
                  placeholder="Nome e Sobrenome"
                  control={control}
                  errorMessage={errors.fullName?.message}
                  borderColor={colors.blue}
                  backgroundColor={colors.tertiary_purple_opacity}
                  placeholderColor={colors.white_opacity}
                  height={55}
                  color={colors.white}
                />
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

                <FormInput
                  name="phone"
                  placeholder="Telefone"
                  control={control}
                  errorMessage={errors.phone?.message}
                  borderColor={colors.blue}
                  backgroundColor={colors.tertiary_purple_opacity}
                  placeholderColor={colors.white_opacity}
                  height={55}
                  color={colors.white}
                  mask={[
                    '(',
                    /\d/,
                    /\d/,
                    ')',
                    ' ',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    '-',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                />

                <View>
                  <View className="relative">
                    <FormInput
                      name="password"
                      placeholder="Senha"
                      secureTextEntry={showPassword}
                      control={control}
                      errorMessage={errors.password?.message}
                      borderColor={colors.blue}
                      backgroundColor={colors.tertiary_purple_opacity}
                      placeholderColor={colors.white_opacity}
                      height={55}
                      color={colors.white}
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-5 top-[28%]"
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <View className="relative">
                    <FormInput
                      name="confirmPassword"
                      placeholder="Confirme sua senha"
                      secureTextEntry={showConfirmPassword}
                      control={control}
                      errorMessage={errors.confirmPassword?.message}
                      borderColor={colors.blue}
                      backgroundColor={colors.tertiary_purple_opacity}
                      placeholderColor={colors.white_opacity}
                      height={55}
                      color={colors.white}
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute right-5 top-[28%]"
                    activeOpacity={0.8}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.white}
                    />
                  </TouchableOpacity>
                </View>

                {/* Input de Seleção da Unidade */}
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View
                      className={'px-2 justify-center'}
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        backgroundColor: colors.tertiary_purple_opacity,
                        borderColor: errors.affiliated_to ? 'red' : colors.blue,
                      }}>
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={{
                          height: 53,
                          width: '100%',
                        }}>
                        <Picker.Item
                          label="Selecione uma unidade"
                          value=""
                          style={{
                            color: errors.affiliated_to
                              ? 'red'
                              : colors.white_opacity,
                          }}
                        />
                        {units.map(unit => (
                          <Picker.Item
                            key={unit.unitId}
                            label={unit.name}
                            value={unit.unitId}
                          />
                        ))}
                      </Picker>
                    </View>
                  )}
                  name="affiliated_to"
                />
              </View>

              {/* Envio do Formulário de Cadastro */}
              <View className="mt-5">
                <Button
                  text="ENTRAR"
                  backgroundColor="blue"
                  onPress={handleSubmit(onSubmit)}
                  textColor="tertiary_purple"
                  height={55}
                  fontSize={25}
                  fontWeight='bold'
                />
              </View>

              <View className="mt-5 flex-row justify-center gap-2">
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onChange(!value)}
                      className="flex-row items-center gap-1">
                      <MaterialCommunityIcons
                        name={
                          value ? 'checkbox-marked' : 'checkbox-blank-outline'
                        }
                        size={24}
                        color={errors.acceptTerms ? 'red' : colors.white}
                      />
                      <Text
                        className="underline text-center"
                        style={{
                          color: errors.acceptTerms ? 'red' : colors.white,
                        }}>
                        Aceito termos e condições*
                      </Text>
                    </TouchableOpacity>
                  )}
                  name="acceptTerms"
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
