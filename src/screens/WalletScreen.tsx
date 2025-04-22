import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

import images from '../data/images';
import {colors} from '../styles/colors';
import {useAuth} from '../contexts/Auth';
import {BackButton} from '../components/BackButton';
import {FlatList} from 'react-native-gesture-handler';

export function WalletScreen() {
  const {userData} = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const navigation = useNavigation();

  const data = [
    {
    transactionID: "1",
      date: '04/06/2004',
      value: 'R$ 3.020,00',
      status: 'SOLICITADO',
    },
    {
      transactionID: "2",
      date: '04/06/2004',
      value: 'R$ 1.000,00',
      status: 'SOLICITADO',
    },
    {
      transactionID: "3",
      date: '04/06/2004',
      value: 'R$ 3.468,00',
      status: 'SOLICITADO',
    },
    {
      transactionID: "4",
      date: '04/06/2004',
      value: 'R$ 2.590,00',
      status: 'PAGO',
    },
    {
      transactionID: "5",
      date: '04/06/2004',
      value: 'R$ 2.748,00',
      status: 'PAGO',
    },
    {
      transactionID: "6",
      date: '04/06/2004',
      value: 'R$ 1.795,00',
      status: 'PAGO',
    },
    {transactionID: "7", date: '04/06/2004', value: 'R$ 900,00', status: 'PAGO'},
    {transactionID: "8", date: '04/06/2004', value: 'R$ 792,00', status: 'PAGO'},
  ];

  function withdrawalRequest() {
    const balance = 4.008;
    if (balance > 700) {
      Alert.alert(
        `Saldo insuficiente!`,
        `Seu saldo precisa ser maior que R$ 700,00 para realizar o saque.`,
      );
    } else {
      Alert.alert(
        'Saque solicitado!',
        `Saque solicitado à unidade: ${userData?.affiliated_to}, você pode acompanhar o status em sua carteira.`,
      );
    }
  }

  return (
    <ImageBackground source={images.bg_white} className="flex-1">
      <View className="flex-1 mt-10">
        <View>
          <View className="justify-between items-center flex-row ml-5 mr-5">
            <BackButton
              borderColor={colors.primary_purple}
              color={colors.primary_purple}
            />
          </View>
        </View>

        <View>
          <View className="mr-5 ml-5 bg-fourth_purple rounded-3xl h-30 justify-center items-center mt-10">
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
          <View className="mr-5 ml-5 bg-[#FFF] border-[1px] border-t-0 rounded-br-2xl rounded-bl-2xl border-[#CDCDCD] h-48 pl-4 pr-4 pt-3 pb-3">
              <FlatList
                data={data}
                keyExtractor={(item) => item.transactionID}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <View className="bg-[#EDE9FF] w-full p-1 pl-[0.7rem] mt-1 rounded-[0.300rem] flex-row">
                    <View className="bg-secondary_lillac rounded-[0.250rem] w-8 justify-center items-center mr-3">
                      <MaterialCommunityIcons
                        name="cash"
                        color="white"
                        size={20}
                      />
                    </View>
                    <View className="flex-row gap-5">
                      <Text className="text-primary_purple font-regular">
                        {item.date}
                      </Text>
                      <Text className="text-primary_purple font-semiBold">
                        {item.value}
                      </Text>
                      <View>
                      <Text className="font-semiBold" style={{color: item.status === 'PAGO' ? colors.green : colors.primary_purple}}>{item.status}</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
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
    </ImageBackground>
  );
}
