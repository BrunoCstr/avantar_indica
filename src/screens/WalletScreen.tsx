import React, {useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

import images from '../data/images';
import {colors} from '../styles/colors';
import { useAuth } from '../contexts/Auth';

export function WalletScreen() {
  const { userData } = useAuth()
  const [showBalance, setShowBalance] = useState(true);
  const navigation = useNavigation();

  function withdrawalRequest() {
    const balance = 4.008; 
    if(balance > 700 ) {
      Alert.alert(`Saldo insuficiente!`, `Seu saldo precisa ser maior que R$ 700,00 para realizar o saque.`)
    } else {
      Alert.alert('Saque solicitado!' ,`Saque solicitado à unidade: ${userData?.affiliated_to}, você pode acompanhar o status em sua carteira.`)
    }
  }

  return (
    <View className="flex-1">
      <Image source={images.bg_home_white} resizeMode="contain" />

      <View>
        <View className="justify-between items-center flex-row ml-5 mr-5">
          <TouchableOpacity
            className="border-[1px] rounded-md border-primary_purple h-15 w-15 p-2"
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Entypo
              name="arrow-long-left"
              size={21}
              color={colors.primary_purple}
            />
          </TouchableOpacity>
          <Text className="text-primary_purple font-bold text-3xl absolute left-1/2 -translate-x-1/2">
            Carteira
          </Text>
        </View>
      </View>

      <View>
        <View className="mr-5 ml-5 bg-fourth_purple rounded-2xl h-28 justify-center items-center mt-5">
          <LinearGradient
            className="w-[100%] flex-1 justify-center items-center rounded-2xl"
            style={{borderRadius: 8}}
            colors={['#4E00A7', '#6800E0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text className="text-white font-regular">
              Saldo Disponível para Saque
            </Text>
            <View className="flex-row items-end justify-center mt-2">
              <Text className="text-blue text-lg font-bold">R$ </Text>

              {showBalance ? (
                <Text className="text-blue text-5xl font-bold">4.008,00</Text>
              ) : (
                <Text className="text-blue text-5xl font-bold">******</Text>
              )}

              <TouchableOpacity
                className="ml-3 justify-center items-center -top-1/4"
                activeOpacity={0.8}
                onPress={() => {
                  setShowBalance(!showBalance);
                }}>
                <Ionicons
                  name={showBalance ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <View className="mr-5 ml-5 bg-fourth_white border-[1px] border-t-0 rounded-br-2xl rounded-bl-2xl border-gray h-30 pl-4 pr-4 pt-5 -mt-3">
          <Text className="text-black font-bold">Últimos Saques</Text>
          <View className="bg-[#EDE9FF] w-full p-1 pl-[0.7rem] mt-1 rounded-[0.300rem] flex-row">
            <View className="bg-secondary_lillac rounded-[0.250rem] w-8 justify-center items-center mr-3">
              <MaterialCommunityIcons name="cash" color="white" size={20} />
            </View>
            <View className="flex-row gap-28">
              <Text className="text-primary_purple font-regular">
                03/04/2025
              </Text>
              <Text className="text-primary_purple font-semiBold">
                R$ 3000,00
              </Text>
            </View>
          </View>

          <View className="bg-[#EDE9FF] w-full p-1 pl-[0.7rem] mt-1 rounded-[0.300rem] flex-row">
            <View className="bg-secondary_lillac rounded-[0.250rem] w-8 justify-center items-center mr-3">
              <MaterialCommunityIcons name="cash" color="white" size={20} />
            </View>
            <View className="flex-row gap-28">
              <Text className="text-primary_purple font-regular">
                03/04/2025
              </Text>
              <Text className="text-primary_purple font-semiBold">
                R$ 3000,00
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 ml-5 mr-5">
          <TouchableOpacity
            className="justify-center items-center h-20"
            activeOpacity={0.8}
            onPress={withdrawalRequest}>
            <LinearGradient
              className="w-[100%] flex-1 justify-center items-center rounded-lg border-[1px] border-blue"
              style={{borderRadius: 8}}
              colors={['#9743F8', '#4F00A9']}
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}>
              <Text className="text-white font-bold text-4xl">Sacar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
