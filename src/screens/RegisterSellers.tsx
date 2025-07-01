import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Button } from '../components/Button';
import { colors } from '../styles/colors';
import images from '../data/images';
import { getFirestore } from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CustomModal } from '../components/CustomModal';
import { fetchSellersService, createSellerService, toggleSellerActiveService } from '../services/registerSellers/registerSellers';
import { useAuth } from '../contexts/Auth';
import { useNavigation } from '@react-navigation/native';

const db = getFirestore();

// Novo schema para cadastro de vendedor sem unidade e termos
const sellerSignUpSchema = z.object({
  fullName: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Digite um telefone válido!").max(15, "Digite um telefone válido!").regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Formato de telefone inválido!"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas devem ser iguais!",
  path:["password"]
});

export function RegisterSellers() {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', description: '' });
  const [editingSeller, setEditingSeller] = useState<any>(null);
  const { reset: resetEdit, watch: watchEdit } = useForm({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [editModalVisible, setEditModalVisible] = useState(false);

  React.useEffect(() => {
    if (
      userData &&
      !['parceiro_indicador', 'admin_franqueadora', 'admin_unidade'].includes(userData.rule)
    ) {
      // @ts-ignore
      navigation.reset({
        index: 0,
        routes: [{ name: 'NoPermission' as never }],
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
          seller.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, sellers]);

  // Formulário
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(sellerSignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function fetchSellers() {
    setIsLoading(true);
    try {
      const sellersList = await fetchSellersService();
      setSellers(sellersList);
      setFilteredSellers(sellersList);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderSeller({ item }: { item: any }) {
    return (
      <View className="bg-[#EDE9FF] w-full p-3 mt-2 rounded-xl flex-row items-center justify-between">
        <View>
          <Text className="text-primary_purple font-bold text-base">{item.fullName}</Text>
          <Text className="text-gray_dark text-xs">{item.email}</Text>
          <Text className="text-xs mt-1" style={{ color: item.disabled ? colors.red : colors.green }}>
            {item.disabled ? 'Inativo' : 'Ativo'}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => handleEdit(item)} className="mr-2">
            <Ionicons name="create-outline" size={22} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleToggleActive(item)}>
            <Ionicons name={item.disabled ? 'checkmark-done' : 'close-circle'} size={22} color={item.disabled ? colors.green : colors.red} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function handleEdit(seller: any) {
    setEditingSeller(seller);
    resetEdit({
      fullName: seller.fullName || '',
      email: seller.email || '',
      phone: seller.phone || '',
      password: '********',
      confirmPassword: '********',
    });
    setEditModalVisible(true);
  }

  async function handleToggleActive(seller: any) {
    try {
      await toggleSellerActiveService(seller.id, seller.disabled);
      fetchSellers();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  }

  // Botão de cadastrar usuário no estilo do BackButton
  function AddUserButton({ color, borderColor, onPress }: { color?: string; borderColor?: string; onPress?: () => void }) {
    return (
      <TouchableOpacity
        className="border-[1px] items-center justify-center rounded-md w-8 h-8"
        style={{ borderColor: borderColor || colors.primary_purple }}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <MaterialIcons name="person-add-alt" size={21} color={color || colors.primary_purple} />
      </TouchableOpacity>
    );
  }

  async function onSubmit(data: z.infer<typeof sellerSignUpSchema>) {
    try {
      const { fullName, email, phone, password } = data;
      await createSellerService({ fullName, email, phone, password });
      setShowModal(false);
      reset();
      setModalMessage({
        title: 'Vendedor cadastrado!',
        description: 'O vendedor foi cadastrado com sucesso.'
      });
      setIsModalVisible(true);
      fetchSellers();
    } catch (error: any) {
      setModalMessage({
        title: 'Erro ao cadastrar',
        description: error.message || 'Não foi possível cadastrar o vendedor.'
      });
      setIsModalVisible(true);
    }
  }

  return (
    <ImageBackground source={images.bg_dark} className="flex-1">
      <View className="flex-1 mt-20 px-5">
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
        <View className="flex-row items-center mt-6 w-full h-14 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4 mb-2">
          <Ionicons
            name="search"
            size={24}
            color={colors.white}
            style={{ position: 'absolute', left: 20 }}
          />
          <TextInput
            style={{
              flex: 1,
              color: colors.white,
              fontFamily: 'FamiljenGrotesk-regular',
              fontSize: 13,
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
          className="mt-4"
          ListEmptyComponent={isLoading ? null : (
            <View className="items-center justify-center mt-16">
              <Text className="text-white text-lg font-bold mb-4">Nenhum vendedor cadastrado</Text>
              <AddUserButton
                borderColor={colors.blue}
                color={colors.blue}
                onPress={() => setShowModal(true)}
              />
              <Text className="text-blue font-semibold mt-2">Cadastrar novo vendedor</Text>
            </View>
          )}
        />
      </View>
      {/* Modal de cadastro de vendedor */}
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)} transparent={true} animationType="fade">
        <BlurView style={{ flex: 1, backgroundColor: 'transparent' }} blurType="dark" blurAmount={5} reducedTransparencyFallbackColor="transparent">
          <View className="flex-1 justify-center items-center">
            <View className="w-[80%] bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7">
              <View className="justify-between items-center flex-row">
                <BackButton onPress={() => setShowModal(false)} color={colors.blue} borderColor={colors.blue} />
                <Text className="text-blue font-bold text-2xl absolute left-1/2 -translate-x-1/2">Cadastrar</Text>
              </View>
              <View className="flex-col mt-5 gap-2">
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, value, onBlur } }) => (
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
                        fontFamily: 'FamiljenGrotesk-regular',
                      }}
                    />
                  )}
                />
                {errors.fullName && <Text className="text-red text-xs mb-1">{errors.fullName.message}</Text>}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
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
                        fontFamily: 'FamiljenGrotesk-regular',
                      }}
                    />
                  )}
                />
                {errors.email && <Text className="text-red text-xs mb-1">{errors.email.message}</Text>}
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      placeholder="Telefone"
                      placeholderTextColor={colors.white_opacity}
                      value={value}
                      onChangeText={onChange}
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
                        fontFamily: 'FamiljenGrotesk-regular',
                      }}
                    />
                  )}
                />
                {errors.phone && <Text className="text-red text-xs mb-1">{errors.phone.message}</Text>}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      placeholder="Senha"
                      placeholderTextColor={colors.white_opacity}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      style={{
                        borderWidth: 1,
                        borderColor: errors.password ? colors.red : colors.blue,
                        backgroundColor: colors.tertiary_purple_opacity,
                        color: colors.white_opacity,
                        borderRadius: 10,
                        height: 49,
                        paddingLeft: 20,
                        fontSize: 13,
                        marginBottom: 2,
                        fontFamily: 'FamiljenGrotesk-regular',
                      }}
                    />
                  )}
                />
                {errors.password && <Text className="text-red text-xs mb-1">{errors.password.message}</Text>}
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      placeholder="Confirmar senha"
                      placeholderTextColor={colors.white_opacity}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      style={{
                        borderWidth: 1,
                        borderColor: errors.confirmPassword ? colors.red : colors.blue,
                        backgroundColor: colors.tertiary_purple_opacity,
                        color: colors.white_opacity,
                        borderRadius: 10,
                        height: 49,
                        paddingLeft: 20,
                        fontSize: 13,
                        marginBottom: 2,
                        fontFamily: 'FamiljenGrotesk-regular',
                      }}
                    />
                  )}
                />
                {errors.confirmPassword && <Text className="text-red text-xs mb-1">{errors.confirmPassword.message}</Text>}
                <View className="pt-5 justify-center items-center w-full">
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    text="CADASTRAR"
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
        </BlurView>
        <CustomModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title={modalMessage.title}
          description={modalMessage.description}
          buttonText="FECHAR"
        />
      </Modal>
    </ImageBackground>
  );
}
