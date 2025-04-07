import React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/colors';

import images from '../data/images';

export function Notifications() {
  const notificationsList = [
    {id: '1', notification: 'Saldo Disponível para Saque', date: 'Hoje'},
    {id: '2', notification: 'Proposta aceita!', date: 'Há 1 semana'},
    {id: '3', notification: 'Proposta recusada!', date: 'Há 1 semana'},
    {
      id: '4',
      notification: 'Unidade entrou em contato com sua indicação',
      date: 'Há 2 semanas',
    },
    {
      id: '5',
      notification: 'Cadastro aprovado! Faça já seu Login!',
      date: 'Há 1 mês',
    },
    {
      id: '6',
      notification: 'Cadastro aprovado! Faça já seu Login!',
      date: 'Há 1 mês',
    },
    {
      id: '7',
      notification: 'Cadastro aprovado! Faça já seu Login!',
      date: 'Há 1 mês',
    },
    {
      id: '8',
      notification: 'Cadastro aprovado! Faça já seu Login!',
      date: 'Há 1 mês',
    },
    {
      id: '9',
      notification: 'Cadastro aprovado! Faça já seu Login!',
      date: 'Há 1 mês',
    },
    {
        id: '10',
        notification: 'Cadastro aprovado! Faça já seu Login!',
        date: 'Há 1 mês',
    },
    {
        id: '11',
        notification: 'Cadastro aprovado! Faça já seu Login!',
        date: 'Há 1 mês',
    },
  ];

  const navigation = useNavigation();

  return (
    <ImageBackground
      source={images.bg_status}
      className="flex-1"
      resizeMode="cover"
      >
      <View className="flex-1 ml-7 mr-7 mt-20 justify-start items-center">
        <View className="items-center relative w-full flex-col">
          <View className="w-full flex-row items-center justify-between">
            <TouchableOpacity
              className="border-[1px] rounded-md border-white h-15 w-15 justify-center items-center p-2"
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}>
              <Entypo name="arrow-long-left" size={21} color={colors.white} />
            </TouchableOpacity>

            <Text className="text-white font-bold text-2xl text-center">
              Notificações
            </Text>

            {/* Espaço de mesmo tamanho do botão para manter o centro visual por causa do justify-between */}
            <View className="h-12 w-12" />
          </View>

          <FlatList
            className="mt-5"
            data={notificationsList}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
            renderItem={({item}) => (
              <View className="flex-row">
                <View className="w-full flex-row items-center border-b-[3px] border-b-secondary_purple pb-5 pt-5">
                  <MaterialIcons
                    className="mr-3"
                    name="notifications-active"
                    size={24}
                    color={colors.white}
                  />
                  <View className="w-full">
                    <Text className="text-white font-regular">
                      {item.notification}
                    </Text>
                    <Text className="text-white font-regular">{item.date}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
