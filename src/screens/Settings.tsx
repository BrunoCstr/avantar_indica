import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Switch,
  TextInput,
  ScrollView,
} from 'react-native';
import {BackButton} from '../components/BackButton';
import {colors} from '../styles/colors';
import images from '../data/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {Button} from '../components/Button';
import Feather from 'react-native-vector-icons/Feather';
import {useAuth} from '../contexts/Auth';
import {
  updateNotificationPreferences,
  validatePassword,
  changeUserPassword,
  deactivateAccount,
  getNotificationPreferences,
} from '../services/settings/settings';
import {CustomModal} from '../components/CustomModal';
import {Spinner} from '../components/Spinner';

const CONTACTS_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CONTACTS,
  android: PERMISSIONS.ANDROID.READ_CONTACTS,
});

export function Settings() {
  const [contactsStatus, setContactsStatus] = useState('loading');
  const [contactsEnabled, setContactsEnabled] = useState(false);
  const [campaignsNotification, setCampaignsNotification] = useState(false);
  const [statusNotification, setStatusNotification] = useState(false);
  const [withdrawNotification, setWithdrawNotification] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [modalButtonText2, setModalButtonText2] = useState('');
  const [modalCancelButtonText, setModalCancelButtonText] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const {userData} = useAuth();
  const [
    isLoadingNotificationPreferences,
    setIsLoadingNotificationPreferences,
  ] = useState(false);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);
  const [isLoadingDeactivateAccount, setIsLoadingDeactivateAccount] =
    useState(false);

  const fetchPermissions = async () => {
    if (CONTACTS_PERMISSION) {
      const cont = await check(CONTACTS_PERMISSION);
      setContactsStatus(cont);
      setContactsEnabled(cont === RESULTS.GRANTED);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Carregar preferências de notificação do usuário
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      if (!userData?.uid) return;

      try {
        const preferences = await getNotificationPreferences(userData.uid);
        setCampaignsNotification(preferences.campaigns);
        setStatusNotification(preferences.status);
        setWithdrawNotification(preferences.withdraw);
      } catch (error) {
        console.error('Erro ao carregar preferências de notificação:', error);
      }
    };

    loadNotificationPreferences();
  }, [userData?.uid]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPermissions();
    }, []),
  );

  const handleContactsToggle = async () => {
    if (contactsStatus === RESULTS.GRANTED) {
      setModalMessage({
        title: 'Desabilitar Contatos',
        description:
          'Para desabilitar, você será direcionado para as configurações do sistema.',
      });
      setModalButtonText2('CONFIGURAÇÕES');
      setModalCancelButtonText('CANCELAR');
      setIsModalVisible(true);
    } else {
      if (CONTACTS_PERMISSION) {
        const result = await request(CONTACTS_PERMISSION);
        setContactsStatus(result);
        setContactsEnabled(result === RESULTS.GRANTED);
      }
    }
  };

  // Função para salvar preferências no Firestore
  const saveNotificationPreferences = async (
    newPrefs?: Partial<{
      campaigns: boolean;
      status: boolean;
      withdraw: boolean;
    }>,
  ) => {
    if (!userData?.uid) return;
    try {
      setIsLoadingNotificationPreferences(true);
      await updateNotificationPreferences(userData.uid, {
        campaigns: newPrefs?.campaigns ?? campaignsNotification,
        status: newPrefs?.status ?? statusNotification,
        withdraw: newPrefs?.withdraw ?? withdrawNotification,
      });
      setModalMessage({
        title: 'Sucesso',
        description: 'Preferências de notificação atualizadas!',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
    } catch (error) {
      setModalMessage({
        title: 'Erro',
        description: 'Não foi possível atualizar as preferências.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
    } finally {
      setIsLoadingNotificationPreferences(false);
    }
  };

  // Função para alterar senha
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setModalMessage({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para alterar a senha.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMessage({
        title: 'Senhas diferentes',
        description: 'A nova senha e a confirmação não coincidem.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
      return;
    }

    // Validar força da nova senha
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setModalMessage({
        title: 'Senha fraca',
        description: passwordValidation.message,
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
      return;
    }

    try {
      setIsLoadingPasswordChange(true);
      await changeUserPassword(currentPassword, newPassword);

      // Limpar campos após sucesso
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setModalMessage({
        title: 'Sucesso',
        description: 'Senha alterada com sucesso!',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
    } catch (error: any) {
      setModalMessage({
        title: 'Erro',
        description: error.message || 'Erro ao alterar senha. Tente novamente.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

  // Função para desativar conta
  const handleDeactivateAccount = async () => {
    if (!userData?.uid) return;

    try {
      await deactivateAccount(userData.uid);

      setModalMessage({
        title: 'Conta desativada',
        description:
          'Sua conta foi desativada com sucesso. Você será redirecionado para a tela de login.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);

      // O usuário será automaticamente redirecionado para login após o signOut
    } catch (error: any) {
      setModalMessage({
        title: 'Erro',
        description: 'Não foi possível desativar a conta. Tente novamente.',
      });
      setModalButtonText2('');
      setModalCancelButtonText('');
      setIsModalVisible(true);
    }
  };

  // Função para mostrar modal de confirmação de desativação
  const showDeactivateConfirmation = () => {
    setShowDeactivateModal(true);
  };

  // Handlers para cada switch (apenas setam o estado)
  const handleCampaignsNotification = (value: boolean) => {
    setCampaignsNotification(value);
  };
  const handleStatusNotification = (value: boolean) => {
    setStatusNotification(value);
  };
  const handleWithdrawNotification = (value: boolean) => {
    setWithdrawNotification(value);
  };

  return (
    <ImageBackground source={images.bg_dark} className="flex-1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 mt-20 px-5">
          {/* Cabeçalho */}
          <View className="flex-row items-center justify-between mb-6">
            <BackButton borderColor={colors.blue} color={colors.blue} />
            <Text className="text-white text-2xl font-bold">Configurações</Text>
            <View style={{width: 32}} />
          </View>

          {/* Seção Permissões do Aplicativo */}
          <Text className="text-white text-base font-bold mb-2">
            Permissões do Aplicativo
          </Text>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              paddingVertical: 4,
              marginBottom: 18,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}>
            {/* Linha Notificações */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#EEE',
              }}>
              <MaterialIcons
                name="notifications-active"
                size={28}
                color={colors.primary_purple}
                style={{marginRight: 16}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: colors.primary_purple,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Permitir Notificações
                </Text>
                <Text
                  style={{color: colors.gray_dark, fontSize: 13, marginTop: 2}}>
                  Ative ou desative nas configurações
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => openSettings()}
                style={{padding: 8}}>
                <Ionicons
                  name="settings-sharp"
                  size={26}
                  color={colors.primary_purple}
                />
              </TouchableOpacity>
            </View>
            {/* Linha Contatos */}
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 18}}>
              <MaterialIcons
                name="contacts"
                size={28}
                color={colors.primary_purple}
                style={{marginRight: 16}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: colors.primary_purple,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Permitir acesso aos contatos
                </Text>
                <Text
                  style={{color: colors.gray_dark, fontSize: 13, marginTop: 2}}>
                  {contactsEnabled ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
              <Switch
                value={contactsEnabled}
                onValueChange={handleContactsToggle}
                thumbColor={contactsEnabled ? colors.primary_purple : '#ccc'}
                trackColor={{false: '#ccc', true: colors.primary_purple + '55'}}
              />
            </View>
          </View>

          {/* Seção Preferências de Notificações */}
          <Text className="text-white text-base font-bold mb-2">
            Preferências de Notificações
          </Text>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              paddingVertical: 4,
              marginBottom: 18,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}>
            {/* Linha Campanhas */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#EEE',
              }}>
              <MaterialIcons
                name="campaign"
                size={28}
                color={colors.primary_purple}
                style={{marginRight: 16}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: colors.primary_purple,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Notificações de Campanhas
                </Text>
              </View>
              <Switch
                value={campaignsNotification}
                onValueChange={handleCampaignsNotification}
                thumbColor={
                  campaignsNotification ? colors.primary_purple : '#ccc'
                }
                trackColor={{false: '#ccc', true: colors.primary_purple + '55'}}
              />
            </View>
            {/* Linha Status das propostas */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#EEE',
              }}>
              <MaterialIcons
                name="info"
                size={28}
                color={colors.primary_purple}
                style={{marginRight: 16}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: colors.primary_purple,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Notificações de Status das propostas
                </Text>
              </View>
              <Switch
                value={statusNotification}
                onValueChange={handleStatusNotification}
                thumbColor={statusNotification ? colors.primary_purple : '#ccc'}
                trackColor={{false: '#ccc', true: colors.primary_purple + '55'}}
              />
            </View>
            {/* Linha Saque */}
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 18}}>
              <MaterialIcons
                name="attach-money"
                size={28}
                color={colors.primary_purple}
                style={{marginRight: 16}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: colors.primary_purple,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  Notificações de Saque
                </Text>
              </View>
              <Switch
                value={withdrawNotification}
                onValueChange={handleWithdrawNotification}
                thumbColor={
                  withdrawNotification ? colors.primary_purple : '#ccc'
                }
                trackColor={{false: '#ccc', true: colors.primary_purple + '55'}}
              />
            </View>
            {/* Botão Salvar Alterações */}
            <View style={{margin: 18, marginTop: 8}}>
              <Button
                text="Salvar Alterações"
                onPress={() => saveNotificationPreferences()}
                backgroundColor="primary_purple"
                textColor="white"
                fontWeight="bold"
                fontSize={16}
                isLoading={isLoadingNotificationPreferences}
              />
            </View>
          </View>

          {/* Seção Alterar Senha e Desativar Conta */}
          <Text className="text-white text-base font-bold mb-2">
            Configurações de Segurança
          </Text>
          <View style={{marginBottom: 24}}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 18,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <Text
                style={{
                  color: colors.primary_purple,
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 8,
                }}>
                Alterar Senha
              </Text>
              {/* Campo Senha Atual */}
              <View style={{position: 'relative', marginBottom: 12}}>
                <TextInput
                  placeholder="Senha atual"
                  placeholderTextColor={colors.gray_dark}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  style={{
                    backgroundColor: '#F3F3F3',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    color: colors.gray_dark,
                    paddingRight: 40,
                  }}
                />
                <TouchableOpacity
                  style={{position: 'absolute', right: 10, top: 12}}
                  onPress={() => setShowCurrentPassword(prev => !prev)}>
                  <Feather
                    name={showCurrentPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray_dark}
                  />
                </TouchableOpacity>
              </View>
              {/* Campo Nova Senha */}
              <View style={{position: 'relative', marginBottom: 12}}>
                <TextInput
                  placeholder="Nova senha"
                  placeholderTextColor={colors.gray_dark}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={{
                    backgroundColor: '#F3F3F3',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    color: colors.gray_dark,
                    paddingRight: 40,
                  }}
                />
                <TouchableOpacity
                  style={{position: 'absolute', right: 10, top: 12}}
                  onPress={() => setShowNewPassword(prev => !prev)}>
                  <Feather
                    name={showNewPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray_dark}
                  />
                </TouchableOpacity>
              </View>
              {/* Campo Confirmar Senha */}
              <View style={{position: 'relative', marginBottom: 4}}>
                <TextInput
                  placeholder="Confirmar nova senha"
                  placeholderTextColor={colors.gray_dark}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={{
                    backgroundColor: '#F3F3F3',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    color: colors.gray_dark,
                    paddingRight: 40,
                  }}
                />
                <TouchableOpacity
                  style={{position: 'absolute', right: 10, top: 12}}
                  onPress={() => setShowConfirmPassword(prev => !prev)}>
                  <Feather
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={22}
                    color={colors.gray_dark}
                  />
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 12}}>
                <Button
                  text="Alterar Senha"
                  onPress={handleChangePassword}
                  backgroundColor="primary_purple"
                  textColor="white"
                  fontWeight="bold"
                  fontSize={16}
                  isLoading={isLoadingPasswordChange}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.red,
                borderRadius: 16,
                padding: 18,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
              activeOpacity={0.8}
              onPress={showDeactivateConfirmation}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                {isLoadingDeactivateAccount ? (
                  <Spinner size={32} variant="blue" />
                ) : (
                  'DESATIVAR CONTA'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CustomModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setModalButtonText2('');
          setModalCancelButtonText('');
        }}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText={modalButtonText2 ? 'CANCELAR' : 'FECHAR'}
        buttonText2={modalButtonText2}
        onPress={modalButtonText2 ? () => openSettings() : undefined}
      />
      <CustomModal
        visible={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        title="Desativar Conta"
        description="Tem certeza que deseja desativar sua conta? Caso se arrependa, você poderá reativar sua conta em até 30 dias entrando em contato com a unidade afiliada."
        buttonText="CANCELAR"
        buttonText2="DESATIVAR"
        onPress={handleDeactivateAccount}
      />
    </ImageBackground>
  );
}

export default Settings;
