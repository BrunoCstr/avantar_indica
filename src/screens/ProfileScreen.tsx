import React, {useState} from 'react';
import {Text, View, Image, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Feather from 'react-native-vector-icons/Feather';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';

export function ProfileScreen() {
  const {signOut, userData} = useAuth();
  const navigation = useNavigation();

  const [modalType, setModalType] = useState<'edit' | 'info' | null>(null);

  const displayName = userData?.displayName;
  const userFirstName = displayName?.slice(0, displayName.indexOf(' '));

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  return (
    <View className="flex-1">
      <View className="h-1/4 justify-center items-center">
        <Image source={images.bg_profile_default} className="h-full w-full" />
      </View>
      <View className="flex-1">
        <View className="justify-center h-full bg-fifth_purple">
          <View className="mr-5 ml-5 gap-3">
            <Button
              text="Editar Perfil"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => setModalType('edit')}
            />
            <Button
              text="Minhas informações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => setModalType('info')}
            />
            <Button
              text="Notificações"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => navigation.navigate('Notifications')}
            />
            <Button
              text="Cadastrar vendedores"
              backgroundColor="primary_purple"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => console.log('Vendedores')}
            />
            <Button
              text="Sair"
              backgroundColor="red"
              textColor="white"
              fontWeight="bold"
              fontSize={22}
              onPress={() => signOut()}
            />
          </View>
        </View>
      </View>

      <View className="absolute mt-28 left-1/2 -translate-x-1/2 z-20 items-center">
        <TouchableOpacity activeOpacity={0.9}>
          <Image
            source={images.default_profile_picture}
            className="h-30 w-30 rounded-md"
          />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold text-center mt-2">
          {userFirstName}
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalType !== null}
        onRequestClose={() => setModalType(null)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white_navBar rounded-t-2xl p-5 h-[35%]">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-fifth_purple">
                {modalType === 'edit' && 'Editar Perfil'}
                {modalType === 'info' && 'Minhas Informações'}
              </Text>
              <TouchableOpacity
                className="border-[1px] rounded-md border-fifth_purple h-15 w-15 justify-center items-center p-1"
                activeOpacity={0.8}
                onPress={() => setModalType(null)}>
                <Feather name="x" size={21} color={colors.fifth_purple} />
              </TouchableOpacity>
            </View>

            {/* Conteúdo do modal de acordo com o tipo */}
            {modalType === 'edit' && (
              <View className="mt-3">
                <FormInput
                  name="fullName"
                  placeholder="Nome"
                  control={control}
                  errorMessage={errors.email?.message}
                  borderColor={colors.primary_purple}
                  backgroundColor={colors.transparent}
                  placeholderColor={colors.black}
                  height={50}
                />
                <FormInput
                  name="email"
                  placeholder="E-mail"
                  control={control}
                  errorMessage={errors.email?.message}
                  borderColor={colors.primary_purple}
                  backgroundColor={colors.transparent}
                  placeholderColor={colors.black}
                  height={50}
                />
                <Button
                  text="SALVAR"
                  backgroundColor="primary_purple"
                  textColor="white"
                  fontSize={15}
                  onPress={() => signOut()}
                />
              </View>
            )}
            {modalType === 'info' && (
              <>
                <View className="flex-row pt-1">
                  <Text className="font-bold text-fifth_purple">Nome:</Text>
                  <Text className="text-fifth_purple"> {displayName}</Text>
                </View>
                <View className="flex-row pt-1">
                  <Text className="font-bold text-fifth_purple">E-mail:</Text>
                  <Text className="text-fifth_purple">
                    {' '}
                    brunocastro@avantar.com.br
                  </Text>
                </View>
                <View className="flex-row pt-1">
                  <Text className="font-bold text-fifth_purple">
                    Tipo de Cadastro:
                  </Text>
                  <Text className="text-fifth_purple"> Cliente Indicador</Text>
                </View>
                <View className="flex-row pt-1">
                  <Text className="font-bold text-fifth_purple">Afiliado:</Text>
                  <Text className="text-fifth_purple">
                    {' '}
                    Unidade Caratinga - MG
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
