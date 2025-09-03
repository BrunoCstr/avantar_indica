import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  RefreshControl,
} from 'react-native';
import {BackButton} from '../components/BackButton';
import {Button} from '../components/Button';
import {colors} from '../styles/colors';
import images from '../data/images';
import {getFirestore} from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {CustomModal} from '../components/CustomModal';
import {
  fetchSellersService,
  createSellerService,
  toggleSellerActiveService,
  updateSellerService,
} from '../services/registerSellers/registerSellers';
import {validatePassword} from '../services/settings/settings';
import {useAuth} from '../contexts/Auth';
import {useNavigation} from '@react-navigation/native';
import {applyMaskTelephone} from '../utils/applyMaskTelephone';
import {getDefaultProfilePicture} from '../utils/getDefaultProfilePicture';
import {Spinner} from '../components/Spinner';
import {SellerSkeleton} from '../components/skeletons/SellerSkeleton';
import {fonts} from '../config/fontConfig';

const db = getFirestore();

// Função para remover máscara do telefone
function removePhoneMask(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Novo schema para cadastro de vendedor sem unidade e termos
const sellerSignUpSchema = z
  .object({
    fullName: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    phone: z
      .string()
      .min(14, 'Digite um telefone válido!')
      .max(15, 'Digite um telefone válido!')
      .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Formato de telefone inválido!'),
    password: z.string().min(1, 'Senha é obrigatória'),
    profilePicture: z.string().optional(),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    commission: z.number().min(0, 'Comissão deve ser entre 0 e 100').max(100, 'Comissão deve ser entre 0 e 100').refine(val => !isNaN(val), 'Comissão deve ser um número válido'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas devem ser iguais!',
    path: ['password'],
  });

export function RegisterSellers() {
  const {userData} = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [editingSeller, setEditingSeller] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {reset: resetEdit, watch: watchEdit} = useForm({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      commission: undefined,
    },
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isLoadingToggle, setIsLoadingToggle] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    if (
      userData &&
      !['parceiro_indicador', 'admin_franqueadora', 'admin_unidade'].includes(
        userData.rule,
      )
    ) {
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{name: 'NoPermission' as never}],
      });
    }
  }, [userData, navigation]);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredSellers(sellers);
    } else {
      setFilteredSellers(
        sellers.filter(seller =>
          seller.fullName.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, sellers]);

  // Formulário
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      commission: undefined,
    },
  });

  async function fetchSellers() {
    if (!userData?.uid) return;
    setIsLoading(true);
    try {
      const sellersList = await fetchSellersService(userData?.uid);
      setSellers(sellersList);
      setFilteredSellers(sellersList);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Função do Pull Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Recarrega os vendedores
      await fetchSellers();
    } catch (error) {
      console.error("Erro ao atualizar vendedores:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  };

  function renderSeller({item}: {item: any}) {
    return (
      <View
        className="bg-white rounded-xl mb-2 mx-2"
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <View className="flex-row items-center p-4">
          {/* Avatar */}
          <View className="mr-4">
            {item.profilePicture ? (
              <Image
                source={{uri: item.profilePicture}}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{backgroundColor: colors.tertiary_purple}}>
                <Text className="text-white font-bold text-sm">
                  {getInitials(item.fullName)}
                </Text>
              </View>
            )}
          </View>

          {/* Informações */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center flex-1">
                <Text className="text-black font-bold text-base flex-1">
                  {item.fullName}
                </Text>
                {/* Badge de status */}
                <View
                  className="px-2 py-1 rounded-md ml-2"
                  style={{
                    backgroundColor: item.disabled ? '#fee2e2' : '#dcfce7',
                  }}>
                  <Text
                    className="text-xs font-medium"
                    style={{
                      color: item.disabled ? '#dc2626' : '#16a34a',
                    }}>
                    {item.disabled ? 'Inativo' : 'Ativo'}
                  </Text>
                </View>
              </View>
            </View>
            <Text className="text-black text-sm mb-2">{item.email}</Text>
            {item.commission && (
              <View
                className="self-start px-3 py-1 w-auto rounded-full"
                style={{
                  backgroundColor: '#dbeafe',
                }}>
                <Text
                  className="text-xs font-semibold"
                  style={{color: '#2563eb'}}>
                  Comissão: {item.commission}%
                </Text>
              </View>
            )}
          </View>

          {/* Botões de ação */}
          <View className="flex-row gap-2 ml-2">
            <TouchableOpacity onPress={() => handleEdit(item)} className="mr-2">
              <Ionicons
                name="create-outline"
                size={22}
                color={colors.tertiary_purple}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedSeller(item);
                setConfirmModalVisible(true);
              }}>
              <Ionicons
                name={item.disabled ? 'checkmark-done' : 'close-circle'}
                size={22}
                color={item.disabled ? colors.green : colors.red}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function handleEdit(seller: any) {
    setEditingSeller(seller);
    resetEdit({
      fullName: seller.fullName || '',
      email: seller.email || '',
      phone: seller.phone ? applyMaskTelephone(seller.phone) : '',
      password: '',
      confirmPassword: '',
      commission: seller.commission || undefined,
    });
    setEditModalVisible(true);
  }

  async function handleToggleActiveConfirmed() {
    if (!selectedSeller) return;
    setIsLoadingToggle(true);
    try {
      await toggleSellerActiveService(
        selectedSeller.id,
        selectedSeller.disabled,
        selectedSeller.email,
      );
      fetchSellers();
      setConfirmModalVisible(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setConfirmModalVisible(false);
      setSelectedSeller(null);
    } finally {
      setIsLoadingToggle(false);
    }
  }

  // Botão de cadastrar usuário no estilo do BackButton
  function AddUserButton({
    color,
    borderColor,
    onPress,
  }: {
    color?: string;
    borderColor?: string;
    onPress?: () => void;
  }) {
    return (
      <TouchableOpacity
        className="border-[1px] items-center justify-center rounded-md w-8 h-8"
        style={{borderColor: borderColor || colors.primary_purple}}
        activeOpacity={0.8}
        onPress={onPress}>
        <MaterialIcons
          name="person-add-alt"
          size={21}
          color={color || colors.primary_purple}
        />
      </TouchableOpacity>
    );
  }

  async function onSubmit(data: z.infer<typeof sellerSignUpSchema>) {
    setIsLoadingRegister(true);
    try {
      const {fullName, email, phone, password, commission} = data;

      // Validar força da senha
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setModalMessage({
          title: 'Senha fraca',
          description: passwordValidation.message,
        });
        setIsModalVisible(true);
        return;
      }

      const profilePicture = await getDefaultProfilePicture();

      // Remove a máscara do telefone antes de salvar
      const phoneWithoutMask = removePhoneMask(phone);
      await createSellerService({
        fullName,
        email,
        phone: phoneWithoutMask,
        password,
        commission: commission || undefined,
        affiliated_to: userData?.affiliated_to,
        unitName: userData?.unitName,
        profilePicture: profilePicture || undefined,
        masterUid: userData?.uid,
      });
      setShowModal(false);
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
      setModalMessage({
        title: 'Vendedor cadastrado!',
        description: 'O vendedor foi cadastrado com sucesso.',
      });
      setIsModalVisible(true);
      fetchSellers();
    } catch (error: any) {
      setModalMessage({
        title: 'Erro ao cadastrar',
        description: error.message || 'Não foi possível cadastrar o vendedor.',
      });
      setIsModalVisible(true);
    } finally {
      setIsLoadingRegister(false);
    }
  }

  async function onSubmitEdit(data: z.infer<typeof sellerSignUpSchema>) {
    setIsLoadingEdit(true);
    try {
      const {fullName, email, phone, password, commission} = data;

      // Se a senha foi alterada (não é ''), validar força da senha
      if (password && password !== '') {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          setModalMessage({
            title: 'Senha fraca',
            description: passwordValidation.message,
          });
          setIsModalVisible(true);
          return;
        }
      }

      // Remove a máscara do telefone antes de salvar
      const phoneWithoutMask = removePhoneMask(phone);

      await updateSellerService(editingSeller.id, {
        fullName,
        email,
        phone: phoneWithoutMask,
        password: password !== '' ? password : undefined,
        oldEmail: editingSeller.email,
        commission: commission || undefined,
      });
      setEditModalVisible(false);
      resetEdit();
      setModalMessage({
        title: 'Vendedor atualizado!',
        description: 'O vendedor foi atualizado com sucesso.',
      });
      setIsModalVisible(true);
      fetchSellers();
    } catch (error: any) {
      setModalMessage({
        title: 'Erro ao atualizar',
        description: error.message || 'Não foi possível atualizar o vendedor.',
      });
      setIsModalVisible(true);
    } finally {
      setIsLoadingEdit(false);
    }
  }

  return (
    <ImageBackground
      source={images.bg_dark}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 px-5 pt-4" style={{paddingTop: 80}}>
        {/* Cabeçalho */}
        <View className="flex-row items-center justify-between mb-6">
          <BackButton borderColor={colors.blue} color={colors.blue} />
          <Text className="text-white text-2xl font-bold">Vendedores</Text>
          <AddUserButton
            borderColor={colors.blue}
            color={colors.blue}
            onPress={() => setShowModal(true)}
          />
        </View>
        {/* Input de pesquisa com design igual ao StatusScreen */}
        <View className="flex-row items-center w-full h-16 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-blue px-4 mt-8">
          <Ionicons
            name="search"
            size={24}
            color={colors.white}
            style={{position: 'absolute', left: 20}}
          />
          <TextInput
            style={{
              flex: 1,
              color: colors.white,
              fontFamily: fonts.regular,
              fontSize: 16,
              paddingLeft: 40,
              paddingRight: 10,
            }}
            placeholder="Pesquisar por nome..."
            placeholderTextColor={colors.white}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Lista de vendedores */}
        <FlatList
          data={filteredSellers}
          keyExtractor={item => item.id}
          renderItem={renderSeller}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#820AD1"]}
              tintColor="#820AD1"
            />
          }
          className="mt-4"
          ListEmptyComponent={
            isLoading ? (
              <View className="mt-4">
                {[...Array(4)].map((_, idx) => (
                  <SellerSkeleton key={idx} />
                ))}
              </View>
            ) : filteredSellers.length === 0 ? (
              <View className="items-center justify-center mt-16">
                <Text className="text-white text-lg font-bold mb-4">
                  Nenhum vendedor cadastrado
                </Text>
                <AddUserButton
                  borderColor={colors.blue}
                  color={colors.blue}
                  onPress={() => setShowModal(true)}
                />
                <Text className="text-blue font-semibold mt-2">
                  Cadastrar novo vendedor
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Modal de cadastro de vendedor */}
      <Modal
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
          reset();
          setShowPassword(false);
          setShowConfirmPassword(false);
        }}
        transparent={true}
        animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View className="w-[90%] max-w-md bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7 max-h-[90%]">
            <View className="justify-between items-center flex-row">
              <BackButton
                onPress={() => {
                  setShowModal(false);
                  reset();
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                color={colors.blue}
                borderColor={colors.blue}
              />
              <Text className="text-blue font-bold text-2xl absolute left-1/2 -translate-x-1/2">
                Cadastrar
              </Text>
            </View>
            <View className="flex-col mt-5 gap-2">
              <Controller
                control={control}
                name="fullName"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    placeholder="Nome completo"
                    placeholderTextColor={colors.white_opacity}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    style={{
                      borderWidth: 1,
                      borderColor: errors.fullName ? colors.red : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                )}
              />
              {errors.fullName && (
                <Text className="text-red text-xs mb-1">
                  {errors.fullName.message}
                </Text>
              )}
              <Controller
                control={control}
                name="email"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor={colors.white_opacity}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      borderWidth: 1,
                      borderColor: errors.email ? colors.red : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red text-xs mb-1">
                  {errors.email.message}
                </Text>
              )}
              <Controller
                control={control}
                name="phone"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    placeholder="Telefone"
                    placeholderTextColor={colors.white_opacity}
                    value={value}
                    onChangeText={text => {
                      // Remove todos os caracteres não numéricos
                      const numbersOnly = text.replace(/\D/g, '');
                      // Aplica a máscara se houver números
                      const maskedValue = numbersOnly
                        ? applyMaskTelephone(numbersOnly)
                        : '';
                      onChange(maskedValue);
                    }}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    style={{
                      borderWidth: 1,
                      borderColor: errors.phone ? colors.red : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                )}
              />
              {errors.phone && (
                <Text className="text-red text-xs mb-1">
                  {errors.phone.message}
                </Text>
              )}
              <Controller
                control={control}
                name="commission"
                render={({field: {onChange, value, onBlur}}) => (
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Comissão (%)"
                    placeholderTextColor={colors.white_opacity}
                    value={
                      value !== undefined && value !== null ? `${value}%` : ''
                    }
                    onChangeText={text => {
                      // Remove o símbolo % se presente
                      const textWithoutPercent = text.replace(/%/g, '');
                      // Permite apenas números, vírgula e ponto
                      const onlyNumbers = textWithoutPercent.replace(/[^0-9.,]/g, '');
                      const normalized = onlyNumbers.replace(',', '.');
                      
                      // Se o texto estiver vazio, define como undefined para mostrar placeholder
                      if (normalized === '') {
                        onChange(undefined);
                        return;
                      }
                      
                      const numValue = parseFloat(normalized);

                      // Valida se o valor está entre 0 e 100
                      if (numValue >= 0 && numValue <= 100) {
                        onChange(numValue);
                      }
                    }}
                    onBlur={onBlur}
                    style={{
                      borderWidth: 1,
                      borderColor: errors.commission ? colors.red : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                )}
              />
              {errors.commission && (
                <Text className="text-red text-xs mb-1">
                  {errors.commission.message}
                </Text>
              )}
              <View className="w-full">
                <View className="relative">
                  <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value, onBlur}}) => (
                      <TextInput
                        placeholder="Senha"
                        placeholderTextColor={colors.white_opacity}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        style={{
                          borderWidth: 1,
                          borderColor: errors.password
                            ? colors.red
                            : colors.blue,
                          backgroundColor: colors.tertiary_purple_opacity,
                          color: colors.white_opacity,
                          borderRadius: 10,
                          height: 49,
                          paddingLeft: 20,
                          fontSize: 13,
                          marginBottom: 2,
                          fontFamily: fonts.regular,
                        }}
                      />
                    )}
                  />
                </View>
                <TouchableOpacity
                  style={{position: 'absolute', right: 20, top: '30%'}}
                  activeOpacity={0.8}
                  onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red text-xs mb-1">
                  {errors.password.message}
                </Text>
              )}
              <View className="w-full">
                <View className="relative">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({field: {onChange, value, onBlur}}) => (
                      <TextInput
                        placeholder="Confirmar senha"
                        placeholderTextColor={colors.white_opacity}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPassword}
                        style={{
                          borderWidth: 1,
                          borderColor: errors.confirmPassword
                            ? colors.red
                            : colors.blue,
                          backgroundColor: colors.tertiary_purple_opacity,
                          color: colors.white_opacity,
                          borderRadius: 10,
                          height: 49,
                          paddingLeft: 20,
                          fontSize: 13,
                          marginBottom: 2,
                          fontFamily: fonts.regular,
                        }}
                      />
                    )}
                  />
                </View>
                <TouchableOpacity
                  style={{position: 'absolute', right: 20, top: '30%'}}
                  activeOpacity={0.8}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red text-xs mb-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
              <View className="pt-5 justify-center items-center w-full">
                <Button
                  onPress={handleSubmit(onSubmit)}
                  text={
                    isLoadingRegister ? (
                      <Spinner size={32} variant="purple" />
                    ) : (
                      'CADASTRAR'
                    )
                  }
                  backgroundColor="blue"
                  textColor="tertiary_purple"
                  fontWeight="bold"
                  fontSize={18}
                  width="100%"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de edição de vendedor */}
      <Modal
        visible={editModalVisible}
        onRequestClose={() => {
          setEditModalVisible(false);
          resetEdit();
        }}
        transparent={true}
        animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View className="w-[90%] max-w-md bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7 max-h-[90%]">
            <View className="justify-between items-center flex-row">
              <BackButton
                onPress={() => {
                  setEditModalVisible(false);
                  resetEdit();
                }}
                color={colors.blue}
                borderColor={colors.blue}
              />
              <Text className="text-blue font-bold text-2xl absolute left-1/2 -translate-x-1/2">
                Editar
              </Text>
            </View>
            <View className="flex-col mt-5 gap-2">
              <TextInput
                placeholder="Nome completo"
                placeholderTextColor={colors.white_opacity}
                value={watchEdit('fullName')}
                onChangeText={text =>
                  resetEdit({...watchEdit(), fullName: text})
                }
                style={{
                  borderWidth: 1,
                  borderColor: colors.blue,
                  backgroundColor: colors.tertiary_purple_opacity,
                  color: colors.white_opacity,
                  borderRadius: 10,
                  height: 49,
                  paddingLeft: 20,
                  fontSize: 13,
                  marginBottom: 2,
                  fontFamily: fonts.regular,
                }}
              />
              <TextInput
                placeholder="E-mail"
                placeholderTextColor={colors.white_opacity}
                value={watchEdit('email')}
                onChangeText={text => resetEdit({...watchEdit(), email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: colors.blue,
                  backgroundColor: colors.tertiary_purple_opacity,
                  color: colors.white_opacity,
                  borderRadius: 10,
                  height: 49,
                  paddingLeft: 20,
                  fontSize: 13,
                  marginBottom: 2,
                  fontFamily: fonts.regular,
                }}
              />
              <TextInput
                placeholder="Telefone"
                placeholderTextColor={colors.white_opacity}
                value={watchEdit('phone')}
                onChangeText={text => {
                  // Remove todos os caracteres não numéricos
                  const numbersOnly = text.replace(/\D/g, '');
                  // Aplica a máscara se houver números
                  const maskedValue = numbersOnly
                    ? applyMaskTelephone(numbersOnly)
                    : '';
                  resetEdit({...watchEdit(), phone: maskedValue});
                }}
                keyboardType="phone-pad"
                style={{
                  borderWidth: 1,
                  borderColor: colors.blue,
                  backgroundColor: colors.tertiary_purple_opacity,
                  color: colors.white_opacity,
                  borderRadius: 10,
                  height: 49,
                  paddingLeft: 20,
                  fontSize: 13,
                  marginBottom: 2,
                  fontFamily: fonts.regular,
                }}
              />
              <TextInput
                placeholder="Comissão (%)"
                placeholderTextColor={colors.white_opacity}
                value={
                  watchEdit('commission') !== undefined &&
                  watchEdit('commission') !== null
                    ? `${watchEdit('commission')}%`
                    : ''
                }
                onChangeText={text => {
                  // Remove o símbolo % se presente
                  const textWithoutPercent = text.replace(/%/g, '');
                  // Permite apenas números, vírgula e ponto
                  const onlyNumbers = textWithoutPercent.replace(/[^0-9.,]/g, '');
                  const normalized = onlyNumbers.replace(',', '.');
                  
                  // Se o texto estiver vazio, define como undefined para mostrar placeholder
                  if (normalized === '') {
                    resetEdit({...watchEdit(), commission: undefined});
                    return;
                  }
                  
                  const numValue = parseFloat(normalized);

                  // Valida se o valor está entre 0 e 100
                  if (numValue >= 0 && numValue <= 100) {
                    console.log(
                      'Valor da comissão sendo definido (edição):',
                      numValue,
                      typeof numValue,
                    );
                    resetEdit({...watchEdit(), commission: numValue});
                  } else if (normalized !== '') {
                    // Se o valor estiver fora do range, não atualiza o campo
                    console.log(
                      'Valor fora do range (0-100) na edição:',
                      numValue,
                    );
                  }
                }}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: colors.blue,
                  backgroundColor: colors.tertiary_purple_opacity,
                  color: colors.white_opacity,
                  borderRadius: 10,
                  height: 49,
                  paddingLeft: 20,
                  fontSize: 13,
                  marginBottom: 2,
                  fontFamily: fonts.regular,
                }}
              />
              <View className="w-full">
                <View className="relative">
                  <TextInput
                    placeholder="Digite a nova senha"
                    placeholderTextColor={colors.white_opacity}
                    value={watchEdit('password') || ''}
                    onChangeText={text =>
                      resetEdit({...watchEdit(), password: text})
                    }
                    secureTextEntry={!showPassword}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                </View>
              </View>
              <View className="w-full">
                <View className="relative">
                  <TextInput
                    placeholder="Confirme a senha"
                    placeholderTextColor={colors.white_opacity}
                    value={watchEdit('confirmPassword') || ''}
                    onChangeText={text =>
                      resetEdit({...watchEdit(), confirmPassword: text})
                    }
                    secureTextEntry={!showConfirmPassword}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                      borderRadius: 10,
                      height: 49,
                      paddingLeft: 20,
                      fontSize: 13,
                      marginBottom: 2,
                      fontFamily: fonts.regular,
                    }}
                  />
                </View>
              </View>
              {/* Mensagem de erro de senha fraca */}
              {watchEdit('password') &&
                watchEdit('password') !== '********' &&
                watchEdit('password').length > 0 &&
                (() => {
                  const passwordValidation = validatePassword(
                    watchEdit('password'),
                  );
                  if (!passwordValidation.isValid) {
                    return (
                      <Text className="text-red text-xs mb-1">
                        {passwordValidation.message}
                      </Text>
                    );
                  }
                  return null;
                })()}
              {/* Mensagem de erro de confirmação de senha */}
              {watchEdit('password') &&
                watchEdit('password') !== '********' &&
                watchEdit('confirmPassword') !== watchEdit('password') && (
                  <Text className="text-red text-xs mb-1">
                    As senhas devem ser iguais!
                  </Text>
                )}
              <View className="pt-5 justify-center items-center w-full">
                <Button
                  onPress={() => onSubmitEdit(watchEdit())}
                  text={
                    isLoadingEdit ? (
                      <Spinner size={32} variant="purple" />
                    ) : (
                      'SALVAR'
                    )
                  }
                  backgroundColor="blue"
                  textColor="tertiary_purple"
                  fontWeight="bold"
                  fontSize={18}
                  width="100%"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* CustomModal global para sucesso/erro */}
      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />

      {/* Modal de confirmação de ativação/inativação */}
      <CustomModal
        visible={confirmModalVisible}
        onClose={() => {
          setConfirmModalVisible(false);
          setSelectedSeller(null);
        }}
        title={
          selectedSeller?.disabled ? 'Ativar vendedor' : 'Inativar vendedor'
        }
        description={
          selectedSeller?.disabled
            ? 'Deseja realmente ativar este vendedor?'
            : 'Deseja realmente inativar este vendedor?'
        }
        buttonText={
          isLoadingToggle ? <Spinner size={24} variant="blue" /> : 'Confirmar'
        }
        onPress={handleToggleActiveConfirmed}
        cancelButtonText="Cancelar"
        onCancelButtonPress={() => {
          setConfirmModalVisible(false);
          setSelectedSeller(null);
        }}
      />
    </ImageBackground>
  );
}
