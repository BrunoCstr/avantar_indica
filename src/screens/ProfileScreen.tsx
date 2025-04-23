import React, {useEffect, useState} from 'react';
import {Text, View, Image, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  updateDoc,
  doc,
  getFirestore,
  onSnapshot,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import app from '../../firebaseConfig';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {signUpSchema, SignUpFormData} from '../schemas/validationSchema';
import {BackButton} from '../components/BackButton';

const db = getFirestore(app);

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

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const selectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const {uri} = asset;

        if (uri) {
          const uploadTask = storage()
            .ref(`profile_pictures/${userData?.uid}/profile_picture.jpg`)
            .putFile(uri);

          uploadTask.on('state_changed', async snapshot => {
            if (snapshot.state === 'success') {
              const downloadUrl = await snapshot.ref.getDownloadURL();

              if (userData?.uid) {
                await updateDoc(doc(db, 'users', userData.uid), {
                  profilePicture: downloadUrl,
                });
              }
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!userData?.uid) return;

    const unsubscribe = onSnapshot(doc(db, 'users', userData.uid), snapshot => {
      const data = snapshot.data();

      if (data?.profilePicture) {
        setProfilePicture(data.profilePicture);
      }
    });

    return () => unsubscribe();
  }, [userData?.uid]);

  return (
    <View className="flex-1 bg-fifth_purple justify-center">
      <View className="flex-row justify-between mr-7 ml-7">
        <BackButton />

        <TouchableOpacity
          className="items-center justify-center"
          activeOpacity={0.8}>
          <Ionicons name="exit-outline" size={35} color={colors.red} />
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <TouchableOpacity activeOpacity={0.9} onPress={selectImage}>
          <Text className="text-white text-2xl font-bold text-center mb-4">
            Perfil
          </Text>
          <Image
            source={
              profilePicture
                ? {uri: profilePicture}
                : images.default_profile_picture
            }
            className="h-32 w-32 rounded-full border-2 border-white"
          />
        </TouchableOpacity>
      </View>

      <View className="items-center h-3/5 flex-col gap-4">
        <View className="bg-white h-[38%] w-4/5 rounded-3xl px-8 py-5 mt-9">
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Informações do usuário</Text>
            <TouchableOpacity activeOpacity={0.5}>
              <Text className="font-regular text-lg">Editar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col mt-1">
            <View className="flex-row items-center gap-2">
              <FontAwesome name={'user'} size={25} color={colors.black} />
              <View className="flex-col">
                <Text className="text-sm font-regular">Nome</Text>
                <Text className="text-base font-bold">
                  {userData?.displayName}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <FontAwesome name={'envelope'} size={19} color={colors.black} />
              <View className="flex-col">
                <Text className="text-sm font-regular">E-mail</Text>
                <Text className="text-base font-bold">{userData?.email}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <FontAwesome
                name={'phone-square'}
                size={22}
                color={colors.black}
              />
              <View className="flex-col">
                <Text className="text-sm font-regular">Telefone</Text>
                <Text className="text-base font-bold">{userData?.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white h-[38%] w-4/5 rounded-3xl px-8 py-5">
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Dados para pagamento</Text>
            <TouchableOpacity activeOpacity={0.5}>
              <Text className="font-regular text-lg">Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        
      </View>

      {/*<Modal
        animationType="slide"
        transparent
        visible={modalType !== null}
        onRequestClose={() => setModalType(null)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white_navBar rounded-t-2xl p-5">
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

            {/* Conteúdo do modal de acordo com o tipo 
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
      </Modal>*/}
    </View>
  );
}
