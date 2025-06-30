import React, {useState, useEffect} from 'react';
import {
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

import images from '../data/images';
import {colors} from '../styles/colors';
import {useAuth} from '../contexts/Auth';
import {BackButton} from '../components/BackButton';
import {FlatList} from 'react-native-gesture-handler';
import DashboardWallet from '../components/DashboardWallet';
import {getUserBalance} from '../services/wallet/Dashboard';
import {getUserWithdrawals} from '../services/wallet/Withdrawals';
import {WithdrawalRequest} from '../services/wallet/Withdrawals';
import {WalletSkeleton} from '../components/skeletons/WalletSkeleton';

export function WalletScreen() {
  const [data, setData] = useState<WithdrawalRequest[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);

  const {userData} = useAuth();

  // Verifica se todos os dados necessários foram carregados
  const isLoading = isLoadingBalance; // Só depende do balance agora

  useEffect(() => {
    if (!userData?.uid) return;

    setIsLoadingBalance(true);
    
    const fetchData = async () => {
      try {
        const data = await getUserWithdrawals(userData?.uid);
        setData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar suas solicitações de saque',
        );
      }
    };

    const fetchBalance = async () => {
      try {
        const balance = await getUserBalance(userData?.uid);
        setBalance(balance);
      } catch (error) {
        console.error('Erro ao buscar balance do usuário:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchData();
    fetchBalance();
  }, [userData?.uid]);

  async function handleWithdrawalRequest() {
    if (balance >= 700) {
      try {
        const withdrawalData = {
          amount: balance,
          fullName: userData?.displayName || '',
          pixKey: userData?.pixKey || '',
          rule: userData?.rule || '',
          unitId: userData?.affiliated_to || '',
          unitName: userData?.unitName || '',
          userId: userData?.uid || '',
        };

        console.log('withdrawalData', withdrawalData);

        Alert.alert(
          'Saque solicitado!',
          `Saque solicitado à unidade: ${userData?.affiliated_to}, você pode acompanhar o status em sua carteira.`,
        );
      } catch (error) {
        console.error('Erro ao criar solicitação de saque:', error);
        Alert.alert('Erro!', 'Erro ao solicitar saque. Tente novamente.');
      }
    } else {
      Alert.alert(
        'Saldo insuficiente!',
        'Seu saldo precisa ser maior que R$ 700,00 para realizar o saque.',
      );
    }
  }

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <ImageBackground source={images.bg_white} className="flex-1">
      <View className="flex-1 mt-10">
        <View>
          <View className="justify-between items-center flex-row ml-5 mr-5">
            <BackButton borderColor="#4A04A5" color="#4A04A5" />
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
                  <View className="flex-row items-end">
                    <Text className="text-blue text-5xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(Math.floor(balance))}
                    </Text>
                    <Text className="text-blue text-lg font-bold">
                      ,
                      {new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                        .format(balance % 1)
                        .replace('0,', '')}
                    </Text>
                  </View>
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

          <View className="mr-5 ml-5 bg-[#FFF] border-[1px] border-t-0 rounded-br-2xl rounded-bl-2xl border-[#CDCDCD] h-32 pl-4 pr-4 pt-3 pb-3">
            {data.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={item => item.withdrawId}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <View className="bg-[#EDE9FF] w-full p-1 px-3 mt-1 rounded-[0.300rem] flex-row">
                    <View className="bg-secondary_lillac rounded-[0.250rem] w-8 justify-between items-center mr-3">
                      <MaterialCommunityIcons
                        name="cash"
                        color="white"
                        size={20}
                      />
                    </View>
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text className="text-primary_purple font-regular">
                        {item.createdAt.toDate().toLocaleDateString('pt-BR')}
                      </Text>
                      <Text className="text-primary_purple font-semiBold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.amount)}
                      </Text>
                      <Text
                        className="font-bold"
                        style={{
                          color:
                            item.status === 'PAGO'
                              ? colors.green
                              : item.status === 'RECUSADO'
                                ? colors.red
                                : colors.primary_purple,
                        }}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <MaterialCommunityIcons
                  name="cash-remove"
                  color={colors.primary_purple}
                  size={40}
                />
                <Text className="text-primary_purple font-regular text-center mt-2">
                  Nenhuma solicitação de saque encontrada
                </Text>
                <Text className="text-gray-500 font-regular text-center text-sm mt-1">
                  Suas solicitações aparecerão aqui
                </Text>
              </View>
            )}
          </View>

          <View className="mt-4 ml-5 mr-5">
            <TouchableOpacity
              className="justify-center items-center h-20"
              activeOpacity={0.8}
              onPress={handleWithdrawalRequest}>
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

          <View className="mt-4 mb-4 ml-5 mr-5">
            <DashboardWallet onReady={() => {
              setIsLoadingDashboard(false);
            }} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
