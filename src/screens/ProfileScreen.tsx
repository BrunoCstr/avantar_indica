import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  updateDoc,
  doc,
  getFirestore,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {getAuth, updateProfile} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import app from '../../firebaseConfig';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';
import {colors} from '../styles/colors';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import {Button} from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const db = getFirestore(app);
const auth = getAuth(app);

export function ProfileScreen() {
  const {signOut, userData} = useAuth();

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const navigation = useNavigation();

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

  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingPaymentInfo, setIsEditingPaymentInfo] = useState(false);

  const [editedName, setEditedName] = useState(userData?.displayName || '');
  const [editedPhone, setEditedPhone] = useState(userData?.phone || '');
  const [editedPixKey, setEditedPixKey] = useState(userData?.pixKey || '');

  useEffect(() => {
    if (isEditingUserInfo && userData) {
      setEditedName(userData.displayName || '');
      setEditedPhone(userData.phone || '');
    }
  }, [isEditingUserInfo, userData]);

  useEffect(() => {
    if (isEditingPaymentInfo && userData) {
      setEditedPixKey(userData.pixKey || '');
    }
  }, [isEditingPaymentInfo, userData]);

  // Verificando se o e-mail e telefone estão corretos
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isNameValid, setIsNameValid] = useState(true);

  function validatePhone(phone: string) {
    setEditedPhone(phone);
    const rawPhone = phone.replace(/\D/g, '');

    const isValid = rawPhone.length >= 10 && rawPhone.length <= 11;
    setIsPhoneValid(isValid);
  }

  function validateName(name: string) {
    setEditedName(name);

    const isValid = name.length >= 2;
    setIsNameValid(isValid);
  }

  // Modal de erro ou sucesso
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });

  // Funções de salvar
  const handleSaveUserInfo = async () => {
    if (!userData?.uid)
      return setModalMessage({
        title: 'Usuário não autenticado!',
        description: 'Entre em contato com o suporte.',
      });

    const noChanges =
      editedName === userData.displayName && editedPhone === userData.phone;

    if (noChanges) {
      setIsEditingUserInfo(false);
      Keyboard.dismiss();
      return;
    }

    if (isPhoneValid && isNameValid) {
      try {
        if (auth.currentUser) {
          const promises = [];

          if (auth.currentUser.displayName !== editedName) {
            promises.push(
              updateProfile(auth.currentUser, {displayName: editedName}),
            );
          }

          promises.push(
            updateDoc(doc(db, 'users', userData.uid), {
              fullName: editedName,
              phone: editedPhone,
            }),
          );

          await Promise.all(promises);

          // Atualiza os dados no contexto/local
          userData.displayName = editedName;
          userData.phone = editedPhone;
        }

        setIsEditingUserInfo(false);
        Keyboard.dismiss();

        setModalMessage({
          title: 'Feito!',
          description: 'Dados do usuário atualizados com sucesso.',
        });

        setIsModalVisible(true);
      } catch (error) {
        console.error(error);
        setModalMessage({
          title: 'Erro ao salvar!',
          description: 'Não foi possível salvar, tente novamente mais tarde.',
        });

        setIsModalVisible(true);
      }
    } else {
      if (!isNameValid) {
        setModalMessage({
          title: 'Atenção!',
          description: 'Digite um nome com mais de dois caracteres.',
        });

        setIsModalVisible(true);
      }

      if (!isPhoneValid) {
        setModalMessage({
          title: 'Atenção!',
          description: 'Este telefone não é válido, tente novamente.',
        });

        setIsModalVisible(true);
      }
    }
  };

  const [isPixKeyValid, setIsPixKeyValid] = useState(true);

  function validatePixkey(pixKey: string) {
    setEditedPixKey(pixKey);

    const isValid = pixKey.length >= 7;
    setIsPixKeyValid(isValid);
  }

  const handleSavePaymentInfo = async () => {
    if (!userData?.uid)
      return setModalMessage({
        title: 'Usuário não autenticado!',
        description: 'Entre em contato com o suporte.',
      });

    const noChanges = editedPixKey === userData.pixKey;

    if (noChanges) {
      setIsEditingPaymentInfo(false);
      Keyboard.dismiss();
      return;
    }

    if (isPixKeyValid) {
      try {
        await updateDoc(doc(db, 'users', userData.uid), {
          pixKey: editedPixKey,
        });

        setIsEditingPaymentInfo(false);
        Keyboard.dismiss();

        // Atualiza o valor local
        userData.pixKey = editedPixKey;

        setModalMessage({
          title: 'Feito!',
          description: 'Dados de pagamento atualizados com sucesso.',
        });

        setIsModalVisible(true);
      } catch (error) {
        setModalMessage({
          title: 'Erro ao salvar!',
          description: 'Não foi possível salvar, tente novamente mais tarde.',
        });

        setIsModalVisible(true);
      }
    } else {
      if (!isPixKeyValid) {
        setModalMessage({
          title: 'Atenção!',
          description: 'Esta chave pix não é válida, tente novamente.',
        });

        setIsModalVisible(true);
      }
    }
  };

  return (
    <View className="flex-1 bg-fifth_purple justify-center">
      <View className="flex-row justify-between mr-7 ml-7">
        <BackButton />

        <TouchableOpacity
          className="items-center justify-center"
          activeOpacity={0.8}
          onPress={() => signOut()}>
          <Ionicons name="exit-outline" size={35} color={colors.red} />
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <TouchableOpacity activeOpacity={0.9} onPress={selectImage}>
          <Text className="text-white text-2xl font-bold text-center mb-4">
            Perfil
          </Text>
          <View className="justify-end">
            <Image
              source={
                profilePicture
                  ? {uri: profilePicture}
                  : images.default_profile_picture
              }
              className="h-32 w-32 rounded-full border-2 border-white"
            />
            <View className="absolute -right-1 bg-white w-9 h-9 rounded-lg items-center justify-center">
              <MaterialIcons name="edit" size={25} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center h-3/5 flex-col px-8">
        <View className="bg-white h-[55%] w-full rounded-3xl px-8 py-6 mt-8">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">Informações do usuário</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                isEditingUserInfo
                  ? handleSaveUserInfo()
                  : setIsEditingUserInfo(true)
              }>
              <Text className="font-regular text-lg">
                {isEditingUserInfo ? 'Salvar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col mt-1 gap-1">
            {/* Nome */}
            <View className="flex-row items-center gap-2">
              <FontAwesome name="user" size={25} color={colors.black} />
              <View className="flex-1">
                <Text className="text-sm font-regular">Nome</Text>
                {isEditingUserInfo ? (
                  <TextInput
                    value={editedName}
                    onChangeText={validateName}
                    className={`text-base font-bold p-0 m-0 ${!isNameValid ? 'text-red' : ''}`}
                    style={{
                      lineHeight: 21,
                      includeFontPadding: false,
                    }}
                  />
                ) : (
                  <Text className="text-base font-bold">
                    {userData?.displayName}
                  </Text>
                )}
              </View>
            </View>

            {/* Telefone */}
            <View className="flex-row items-center gap-2">
              <FontAwesome name="phone-square" size={22} color={colors.black} />
              <View className="flex-1">
                <Text className="text-sm font-regular">Telefone</Text>
                {isEditingUserInfo ? (
                  <TextInput
                    value={editedPhone}
                    onChangeText={validatePhone}
                    className={`text-base font-bold text-black p-0 m-0 ${!isPhoneValid ? 'text-red' : ''}`}
                    style={{
                      lineHeight: 21,
                      includeFontPadding: false,
                    }}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text className="text-base font-bold">{userData?.phone}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Dados para pagamento */}
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-bold">Dados para pagamento</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                isEditingPaymentInfo
                  ? handleSavePaymentInfo()
                  : setIsEditingPaymentInfo(true)
              }>
              <Text className="font-regular text-lg">
                {isEditingPaymentInfo ? 'Salvar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col mt-1 gap-1">
            {/* Chave pix */}
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="pix" size={24} color={colors.black} />
              <View className="flex-1">
                <Text className="text-sm font-regular">Chave pix</Text>
                {isEditingPaymentInfo ? (
                  <TextInput
                    value={editedPixKey}
                    onChangeText={validatePixkey}
                    className={`text-base font-bold text-black p-0 m-0 ${!isPixKeyValid ? 'text-red' : ''}`}
                    style={{
                      lineHeight: 21,
                      includeFontPadding: false,
                    }}
                  />
                ) : (
                  <Text className="text-base font-bold">
                    {userData?.pixKey || 'Não cadastrado'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View className="w-full flex-col gap-3 mt-6">
          <Button
            text="CONFIGURAÇÕES"
            backgroundColor="orange"
            onPress={() => navigation.navigate('Settings')}
            textColor="white"
            fontSize={25}
            fontWeight="bold"
          />
          <Button
            text="VENDEDORES"
            backgroundColor="blue"
            onPress={() => navigation.navigate('RegisterSellers')}
            textColor="tertiary_purple"
            fontSize={25}
            fontWeight="bold"
            disabled={userData?.rule !== 'parceiro_indicador' && userData?.rule !== 'admin_franqueadora' && userData?.rule !== 'admin_unidade'}
          />
        </View>
      </View>

      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />
    </View>
  );
}
