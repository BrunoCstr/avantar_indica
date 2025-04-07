import React, {useState} from 'react';
import {Text, View, Image, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import images from '../data/images';

export function ProfileScreen() {
  const {signOut, userData} = useAuth();
  const navigation = useNavigation();

  const [modalType, setModalType] = useState<'edit' | 'info' | 'vendors'| null>(null);

  const displayName = userData?.displayName;
  const userFirstName = displayName?.slice(0, displayName.indexOf(' '));

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
              onPress={() => setModalType('vendors')}
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
        <Image
          source={images.default_profile_picture}
          className="h-30 w-30 rounded-md"
        />
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
          <View className="bg-white rounded-t-2xl p-5 h-[40%]">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold">
                {modalType === 'edit' && 'Editar Perfil'}
                {modalType === 'info' && 'Minhas Informações'}
                {modalType === 'vendors' && 'Cadastrar Vendedores'}
              </Text>
              <TouchableOpacity onPress={() => setModalType(null)}>
                <Text className="text-red-500 text-lg">Fechar</Text>
              </TouchableOpacity>
            </View>

            {/* Conteúdo do modal de acordo com o tipo */}
            {modalType === 'edit' && (
              <Text>Aqui vai o formulário para editar perfil</Text>
            )}
            {modalType === 'info' && <Text>Informações do usuário aqui</Text>}
            {modalType === 'vendors' && (
              <Text>Formulário de cadastro de vendedores</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
