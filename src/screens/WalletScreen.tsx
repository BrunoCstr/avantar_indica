import React, {useState, useEffect, useCallback} from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
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
import {formatCurrency, getUserBalance} from '../services/wallet/Dashboard';
import {getUserWithdrawals} from '../services/wallet/Withdrawals';
import {WithdrawalRequest} from '../services/wallet/Withdrawals';
import {WalletSkeleton} from '../components/skeletons/WalletSkeleton';
import {CustomModal} from '../components/CustomModal';
import {Spinner} from '../components/Spinner';
import {useBottomNavigationPadding} from '../hooks/useBottomNavigationPadding';
import {WithdrawalAmountModal} from '../components/WithdrawalAmountModal';
import {createWithdrawalRequest} from '../services/wallet/Withdrawals';
import {useResponsive} from '../hooks/useResponsive';
import {getBonusParameter} from '../services/wallet/bonusParameters';

export function WalletScreen() {
  const {userData} = useAuth();
  const {paddingBottom} = useBottomNavigationPadding();
  const {isSmallScreen, isMediumScreen, horizontalPadding, fontSize, spacing} =
    useResponsive();
  const [data, setData] = useState<WithdrawalRequest[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bonusParameters, setBonusParameters] = useState<any>({
    defaultCommission: 0,
    defaultCashback: 0,
    commissionPerProduct: {
      auto: 0,
      consorcio: 0,
      vida: 0,
      empresarial: 0,
    },
    cashbackPerProduct: {
      auto: 0,
      consorcio: 0,
      vida: 0,
      empresarial: 0,
    },
    minWithdrawal: 700,
  });

  const isLoading = isLoadingBalance; // Só depende do balance agora

  useEffect(() => {
    const fetchPrefs = async () => {
      const user = userData?.uid;
      if (!user) return;

      // Buscar configurações de saques do banco de dados
      if (userData?.affiliated_to) {
        const bonusParams = await getBonusParameter(userData.affiliated_to);
        if (bonusParams) {
          setBonusParameters((prev: any) => ({
            ...prev,
            defaultCommission:
              bonusParams.defaultCommission ?? prev.defaultCommission,
            defaultCashback:
              bonusParams.defaultCashback ?? prev.defaultCashback,
            commissionPerProduct: {
              auto:
                bonusParams.commissionPerProduct?.auto ??
                prev.commissionPerProduct.auto,
              consorcio:
                bonusParams.commissionPerProduct?.consorcio ??
                prev.commissionPerProduct.consorcio,
              vida:
                bonusParams.commissionPerProduct?.vida ??
                prev.commissionPerProduct.vida,
              empresarial:
                bonusParams.commissionPerProduct?.empresarial ??
                prev.commissionPerProduct.empresarial,
            },
            cashbackPerProduct: {
              auto:
                bonusParams.cashbackPerProduct?.auto ??
                prev.cashbackPerProduct.auto,
              consorcio:
                bonusParams.cashbackPerProduct?.consorcio ??
                prev.cashbackPerProduct.consorcio,
              vida:
                bonusParams.cashbackPerProduct?.vida ??
                prev.cashbackPerProduct.vida,
              empresarial:
                bonusParams.cashbackPerProduct?.empresarial ??
                prev.cashbackPerProduct.empresarial,
            },
            minWithdrawal: bonusParams.minWithdrawal ?? prev.minWithdrawal,
          }));
        }
      }
    };

    fetchPrefs();
  }, [userData]);

  useEffect(() => {
    if (!userData?.uid) return;

    setIsLoadingBalance(true);

    const fetchData = async () => {
      try {
        const data = await getUserWithdrawals(userData?.uid);
        setData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setModalMessage({
          title: 'Erro',
          description: 'Não foi possível carregar suas solicitações de saque',
        });
        setIsModalVisible(true);
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

  // Função do Pull Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (userData?.uid) {
        // Recarrega os dados de saque
        const data = await getUserWithdrawals(userData.uid);
        setData(data);

        // Recarrega o saldo
        const balance = await getUserBalance(userData.uid);
        setBalance(balance);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados da carteira:', error);
    } finally {
      setRefreshing(false);
    }
  }, [userData?.uid]);

  async function handleWithdrawalRequest() {
    // Verificar se o usuário tem chave PIX cadastrada
    if (!userData?.pixKey || userData.pixKey.trim() === '') {
      setModalMessage({
        title: 'Chave PIX não cadastrada',
        description:
          'Para realizar um saque, você precisa cadastrar sua chave PIX no perfil. Acesse Perfil > Dados para Pagamento para atualizar.',
      });
      setIsModalVisible(true);
      return;
    }

    if (balance >= bonusParameters.minWithdrawal) {
      setShowWithdrawalModal(true);
    } else {
      setModalMessage({
        title: 'Saldo insuficiente',
        description: `O saque mínimo é de ${formatCurrency(bonusParameters.minWithdrawal)}!`,
      });
      setIsModalVisible(true);
    }
  }

  async function handleConfirmWithdrawal(amount: number) {
    setIsLoadingButton(true);
    setShowWithdrawalModal(false);

    try {
      const withdrawalData = {
        amount: amount,
        fullName: userData?.displayName || '',
        pixKey: userData?.pixKey || '',
        rule: userData?.rule || '',
        unitId: userData?.affiliated_to || '',
        unitName: userData?.unitName || '',
        userId: userData?.uid || '',
        profilePicture: userData?.profilePicture || '',
      };

      // Criar a solicitação no banco de dados
      await createWithdrawalRequest(withdrawalData);

      setModalMessage({
        title: 'Saque solicitado',
        description: `Saque de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(
          amount,
        )} foi solicitado à unidade: ${userData?.unitName}, o prazo médio de liberação é de 10 dias úteis, você pode acompanhar o status em sua carteira!`,
      });
      setIsModalVisible(true);

      // Recarregar os dados da carteira
      if (userData?.uid) {
        const data = await getUserWithdrawals(userData.uid);
        setData(data);

        // Recarregar o saldo atualizado
        const updatedBalance = await getUserBalance(userData.uid);
        setBalance(updatedBalance);
      }
    } catch (error) {
      console.error('Erro ao criar solicitação de saque:', error);

      // Verificar se é erro de chave PIX
      if (
        error instanceof Error &&
        error.message === 'Chave PIX não cadastrada'
      ) {
        setModalMessage({
          title: 'Chave PIX não cadastrada',
          description:
            'Para realizar um saque, você precisa cadastrar sua chave PIX no perfil. Acesse Perfil > Dados para Pagamento para atualizar.',
        });
      } else {
        setModalMessage({
          title: 'Erro!',
          description: `Erro ao solicitar saque. Tente novamente.`,
        });
      }
      setIsModalVisible(true);
    } finally {
      setIsLoadingButton(false);
    }
  }

  if (isLoading) {
    return <WalletSkeleton />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#820AD1']}
          tintColor="#820AD1"
        />
      }
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      keyboardShouldPersistTaps="handled">
      <ImageBackground source={images.bg_white} className="flex-1">
        <View className="flex-1 mt-10" style={{paddingBottom}}>
          <View>
            <View
              style={{
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
              }}
              className="justify-between items-center flex-row">
              <BackButton borderColor="#4A04A5" color="#4A04A5" />
            </View>
          </View>

          <View>
            <View
              style={{
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
                marginTop: spacing.medium,
                backgroundColor: colors.fourth_purple,
                borderRadius: 24,
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LinearGradient
                style={{
                  width: '100%',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16,
                }}
                colors={['#4E00A7', '#6800E0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text className="text-white font-regular">
                  Saldo Disponível para Saque
                </Text>
                <View className="flex-row items-end justify-center mt-2">
                  <Text
                    className={`text-blue ${isSmallScreen ? 'text-base' : 'text-lg'} font-bold`}>
                    R${' '}
                  </Text>

                  {showBalance ? (
                    <View className="flex-row items-end">
                      <Text
                        className={`text-blue ${isSmallScreen ? 'text-4xl' : 'text-5xl'} font-bold`}>
                        {new Intl.NumberFormat('pt-BR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(Math.floor(balance))}
                      </Text>
                      <Text
                        className={`text-blue ${isSmallScreen ? 'text-base' : 'text-lg'} font-bold`}>
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
                    <Text
                      className={`text-blue ${isSmallScreen ? 'text-4xl' : 'text-5xl'} font-bold`}>
                      ******
                    </Text>
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

            <View
              style={{
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
              }}
              className="bg-[#FFF] border-[1px] border-t-0 rounded-br-2xl rounded-bl-2xl border-[#CDCDCD] h-32 pl-4 pr-4 pt-3 pb-3">
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

            <View
              style={{
                marginTop: spacing.small,
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 80,
                }}
                activeOpacity={0.8}
                onPress={handleWithdrawalRequest}>
                <LinearGradient
                  style={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.blue,
                  }}
                  colors={['#9743F8', '#4F00A9']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: isSmallScreen ? 30 : 36,
                    }}>
                    {isLoadingButton ? (
                      <Spinner size={isSmallScreen ? 28 : 32} variant="blue" />
                    ) : (
                      'Sacar'
                    )}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: spacing.small,
                marginBottom: spacing.small,
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
              }}>
              <DashboardWallet />
            </View>
          </View>

          <CustomModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title={modalMessage.title}
            description={modalMessage.description}
            buttonText="FECHAR"
          />

          <WithdrawalAmountModal
            visible={showWithdrawalModal}
            onClose={() => setShowWithdrawalModal(false)}
            onConfirm={handleConfirmWithdrawal}
            balance={balance}
            isLoading={isLoadingButton}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
