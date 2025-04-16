import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useForm, Controller} from 'react-hook-form';
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
import {useNavigation} from '@react-navigation/native';
import gStyles from '../styles/gStyles';
import app from '../../firebaseConfig';

const db = getFirestore(app);

export function SignUpScreen() {
  const [units, setUnits] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const {signUp} = useAuth();
  const navigation = useNavigation();

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
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    const {confirmPassword, ...dataFiltred} = data;

    signUp(
      dataFiltred.fullName,
      dataFiltred.email,
      dataFiltred.password,
      dataFiltred.affiliated_to,
    );
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
            source={images.bg_white}
            className="flex-1"
            resizeMode="cover">
            <View className="flex-1 justify-center ml-10 mr-10">
              <Image
                resizeMode="contain"
                className="w-full"
                source={images.avantar_voce_a_frente_roxo}></Image>
              <FormInput
                name="fullName"
                placeholder="Nome"
                control={control}
                errorMessage={errors.fullName?.message}
                borderColor={colors.tertiary_purple}
                backgroundColor={colors.white}
                placeholderColor={colors.primary_purple}
                height={50}
              />
              <FormInput
                name="email"
                placeholder="E-mail"
                control={control}
                errorMessage={errors.email?.message}
                borderColor={colors.tertiary_purple}
                backgroundColor={colors.white}
                placeholderColor={colors.primary_purple}
                height={50}
              />

              <View>
                <View className="relative">
                  <FormInput
                    name="password"
                    placeholder="Senha"
                    secureTextEntry={showPassword}
                    control={control}
                    errorMessage={errors.password?.message}
                    borderColor={colors.tertiary_purple}
                    backgroundColor={colors.white}
                    placeholderColor={colors.primary_purple}
                    height={50}
                  />
                </View>
                <TouchableOpacity
                  className="absolute right-5 top-[28%]"
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.primary_purple}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <View className="relative">
                  <FormInput
                    name="confirmPassword"
                    placeholder="Confirmar Senha"
                    secureTextEntry={showConfirmPassword}
                    control={control}
                    errorMessage={errors.confirmPassword?.message}
                    borderColor={colors.tertiary_purple}
                    backgroundColor={colors.white}
                    placeholderColor={colors.primary_purple}
                    height={50}
                  />
                </View>
                <TouchableOpacity
                  className="absolute right-5 top-[28%]"
                  activeOpacity={0.8}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.primary_purple}
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
                      borderWidth: 2,
                      borderRadius: 50,
                      backgroundColor: colors.white,
                      borderColor: errors.affiliated_to
                        ? 'red'
                        : colors.primary_purple,
                    }}>
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{
                        height: 45,
                        width: '100%',
                      }}>
                      <Picker.Item
                        label="Selecione uma unidade"
                        value=""
                        style={{
                          color: errors.affiliated_to
                            ? 'red'
                            : colors.primary_purple,
                        }}
                      />
                      {units.map(unit => (
                        <Picker.Item key={unit.unitId} label={unit.name} value={unit.unitId} />
                      ))}
                    </Picker>
                  </View>
                )}
                name="affiliated_to"
              />

              {/* Envio do Formulário de Cadastro */}
              <View className="mt-5">
                <Button
                  text="CADASTRAR"
                  backgroundColor="tertiary_purple"
                  onPress={handleSubmit(onSubmit)}
                  textColor="white"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignInScreen')}
              className="items-center">
              <Text style={gStyles.anchorTextSingUp}>
                Já tem uma conta?{' '}
                <Text style={gStyles.anchorLinkSingUp}>Faça Login</Text>
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
