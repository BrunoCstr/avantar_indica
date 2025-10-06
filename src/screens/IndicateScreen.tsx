import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {
  getFirestore,
  collection,
  getDocs,
} from '@react-native-firebase/firestore';

import {Button} from '../components/Button';
import {colors} from '../styles/colors';
import {FormInputOld} from '../components/FormInputOld';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import {useAuth} from '../contexts/Auth';
import Dropdown from 'react-native-dropdown-picker';
import {withDefaultFont} from '../config/fontConfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import images from '../data/images';
import {useBottomNavigationPadding} from '../hooks/useBottomNavigationPadding';
import {useResponsive} from '../hooks/useResponsive';
import {useNavigation} from '@react-navigation/native';

const db = getFirestore();

interface IndicationItem extends IndicationSchema {
  id: string;
}

export function IndicateScreen() {
  const {userData} = useAuth();
  const navigation = useNavigation();
  const {paddingBottom} = useBottomNavigationPadding();
  const {isSmallScreen, fontSize, horizontalPadding} = useResponsive();

  console.log('IndicateScreen: Componente inicializando...');

  const [products, setProducts] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [indicationsList, setIndicationsList] = useState<IndicationItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);

  // Animações para feedback visual
  const scaleAnim = useState(new Animated.Value(1))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => doc.data());

        const sortedProducts = productsList
          .map(product => product.name)
          .sort((a, b) => a.localeCompare(b, 'pt-BR'));

        setProducts(sortedProducts);

        // Configurar items para o dropdown
        const dropdownItems = sortedProducts.map(product => ({
          label: product,
          value: product,
        }));
        setItems(dropdownItems);
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      }
    };
    fetchProducts();
  }, []);

  const form = useForm<IndicationSchema>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      product: '',
      observations: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue: setFormValue,
    getValues,
  } = form;

  console.log('IndicateScreen: Form control:', !!control);
  console.log('IndicateScreen: Form errors:', errors);

  // Função para animação de sucesso
  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1500);
    });
  };

  const addToList = (data: IndicationSchema) => {
    // Garantir obrigatoriedade do consentimento mesmo em submits programáticos/teclado
    if (!consentChecked) {
      setModalMessage({
        title: 'Consentimento obrigatório',
        description:
          'Para adicionar um convite, você deve confirmar que obteve autorização verbal prévia do indicado.',
      });
      setIsModalVisible(true);
      return;
    }
    if (editingIndex !== null) {
      // Editando uma indicação existente
      const updatedList = [...indicationsList];
      updatedList[editingIndex] = {...data, id: updatedList[editingIndex].id};
      setIndicationsList(updatedList);
      setEditingIndex(null);
    } else {
      // Adicionando nova indicação
      const newIndication: IndicationItem = {
        ...data,
        id: Date.now().toString(),
      };
      setIndicationsList([...indicationsList, newIndication]);
      animateSuccess();
    }

    reset();
    setValue('');
    setConsentChecked(false);
  };

  const editIndication = (index: number) => {
    const indication = indicationsList[index];
    setFormValue('fullName', indication.fullName);
    setFormValue('email', indication.email);
    setFormValue('phone', indication.phone);
    setFormValue('product', indication.product);
    setFormValue('observations', indication.observations || '');
    setValue(indication.product);
    setConsentChecked(true);
    setEditingIndex(index);
  };

  const removeIndication = (index: number) => {
    setIndexToRemove(index);
    setIsRemoveModalVisible(true);
  };

  const confirmRemoveIndication = () => {
    if (indexToRemove !== null) {
      const updatedList = indicationsList.filter((_, i) => i !== indexToRemove);
      setIndicationsList(updatedList);
      setIndexToRemove(null);
    }
    setIsRemoveModalVisible(false);
  };

  const submitAllIndications = async () => {
    if (indicationsList.length === 0) {
      setModalMessage({
        title: 'Atenção',
        description: 'Adicione pelo menos um convite antes de enviar.',
      });
      setIsModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const indication of indicationsList) {
        try {
          const cleanedPhone = indication.phone.replace(/\D/g, '');

          // Estrutura de dados igual ao IndicateModal
          const consentRequestData = {
            indicator_id: userData?.uid,
            indicator_name: userData?.displayName,
            profilePicture: userData?.profilePicture,
            unitId: userData?.affiliated_to,
            unitName: userData?.unitName,
            indicated_name: indication.fullName,
            indicated_email: indication.email,
            indicated_phone: cleanedPhone,
            product: indication.product,
            observations: indication.observations || '',
          };

          // Chamar Cloud Function para enviar email de consentimento (mesma API do IndicateModal)
          const response = await fetch(
            'https://sendconsentemail-o2z256zv6a-uc.a.run.app',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(consentRequestData),
            },
          );

          if (!response.ok) {
            throw new Error(`Falha ao enviar para ${indication.fullName}`);
          }

          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(
            `${indication.fullName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          );
          console.error(
            `Erro ao enviar convite para ${indication.fullName}:`,
            error,
          );
        }
      }

      // Preparar mensagem baseada nos resultados
      if (successCount === indicationsList.length) {
        // Todos os envios foram bem-sucedidos
        setModalMessage({
          title: 'Convites enviados!',
          description: `${successCount} convite(s) enviado(s) com sucesso! E-mails foram enviados para os indicados com solicitações de consentimento.`,
        });
        setIndicationsList([]);
      } else if (successCount > 0) {
        // Alguns sucessos e alguns erros
        setModalMessage({
          title: 'Envio parcial',
          description: `${successCount} convite(s) enviado(s) com sucesso, mas ${errorCount} falharam. Verifique os dados e tente novamente para os que falharam.`,
        });
        // Manter apenas as indicações que falharam
        setIndicationsList(
          indicationsList.filter((_, index) => {
            const indicationName = indicationsList[index].fullName;
            return errors.some(error => error.includes(indicationName));
          }),
        );
      } else {
        // Todos os envios falharam
        setModalMessage({
          title: 'Erro no envio',
          description:
            'Não foi possível enviar nenhum convite. Verifique os dados e sua conexão, então tente novamente.',
        });
      }

      setIsModalVisible(true);
    } catch (error) {
      console.error('Erro geral ao enviar convites:', error);
      setModalMessage({
        title: 'Erro',
        description:
          'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.',
      });
      setIsModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    reset();
    setValue('');
    setConsentChecked(false);
  };

  // Verificação se o form foi inicializado corretamente
  if (!control) {
    console.log('IndicateScreen: Control não existe');
    return (
      <ImageBackground
        source={images.bg_home_purple}
        className="flex-1"
        resizeMode="cover">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">
            Erro ao carregar formulário
          </Text>
          <Text className="text-white text-sm mt-2">
            Verifique se todas as dependências estão instaladas
          </Text>
          <TouchableOpacity
            className="bg-blue px-4 py-2 rounded-lg mt-4"
            onPress={() => navigation.goBack()}>
            <Text className="text-white font-bold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={images.bg_home_purple}
      className="flex-1"
      resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: paddingBottom + 20,
            paddingHorizontal: horizontalPadding - 5,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Header aprimorado */}
          <View className={`${isSmallScreen ? 'mt-14' : 'mt-10'} mb-6`}>
            <View className="flex-row items-center justify-between mb-4">
              <BackButton onPress={() => navigation.goBack()} />
              <View className="flex-1 items-center">
                <Text className={`text-white font-bold ${fontSize.xlarge}`}>
                  Convites Múltiplos
                </Text>
                {indicationsList.length > 0 && (
                  <View className="bg-blue px-3 py-1 rounded-full mt-1 self-center">
                    <Text className="text-primary_purple font-bold text-sm">
                      {indicationsList.length}{' '}
                      {indicationsList.length === 1
                        ? 'convite'
                        : 'convites'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{width: 40}} />
            </View>

            {/* Feedback de sucesso animado */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {scale: scaleAnim},
                  {translateX: -50},
                  {translateY: -25},
                ],
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 1000,
              }}
              className="bg-green px-4 py-2 rounded-full">
              <Text className="text-white font-bold text-center">
                ✓ Convite adicionado!
              </Text>
            </Animated.View>
          </View>

          {/* Formulário aprimorado */}
          <View
            className="bg-tertiary_purple_opacity rounded-2xl p-6 mb-6"
            style={{
              shadowColor: colors.black,
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
            <View className="flex-row items-center mb-6">
              <View className="bg-blue/10 p-4 rounded-full mr-3">
                <FontAwesome6
                  name={editingIndex !== null ? 'edit' : 'user-plus'}
                  size={20}
                  color={colors.blue}
                />
              </View>
              <View className="flex-1">
                <Text className={`text-white font-bold ${fontSize.large}`}>
                  {editingIndex !== null
                    ? 'Editar Convite'
                    : 'Novo Convite'}
                </Text>
                <Text className="text-white_opacity text-sm">
                  {editingIndex !== null
                    ? 'Modifique os dados do convite'
                    : 'Preencha os dados para adicionar um novo convite'}
                </Text>
              </View>
            </View>

            <View className="flex-col gap-2">
              <FormInputOld
                name="fullName"
                placeholder="Nome Completo"
                control={control}
                errorMessage={errors.fullName?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white_opacity}
                height={55}
                color={colors.white}
              />

              <FormInputOld
                name="email"
                placeholder="E-mail"
                control={control}
                errorMessage={errors.email?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white_opacity}
                height={55}
                color={colors.white}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormInputOld
                name="phone"
                placeholder="Telefone"
                control={control}
                errorMessage={errors.phone?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white_opacity}
                height={55}
                color={colors.white}
                keyboardType="phone-pad"
                mask={[
                  '(',
                  /\d/,
                  /\d/,
                  ')',
                  ' ',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
              />

              <View>
                <Controller
                  control={control}
                  name="product"
                  render={({field: {onChange}}) => (
                    <Dropdown
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={setValue}
                      setItems={setItems}
                      onChangeValue={onChange}
                      placeholder="Selecione um produto"
                      style={{
                        backgroundColor: colors.tertiary_purple_opacity,
                        borderColor: errors.product ? colors.red : colors.blue,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                        height: 55,
                        marginBottom: 6,
                        ...withDefaultFont({}),
                      }}
                      dropDownContainerStyle={{
                        backgroundColor: colors.tertiary_purple,
                        borderColor: colors.blue,
                        borderWidth: 1,
                        borderRadius: 10,
                        ...withDefaultFont({}),
                      }}
                      textStyle={{
                        color: colors.white,
                        ...withDefaultFont({}),
                      }}
                      placeholderStyle={{
                        color: colors.white_opacity,
                        ...withDefaultFont({}),
                      }}
                    />
                  )}
                />
                {errors.product && (
                  <Text className="text-red text-sm mt-1">
                    {errors.product.message}
                  </Text>
                )}
              </View>

              <View className="mb-4">
                <Controller
                  control={control}
                  name="observations"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      placeholder="Observações (Opcional)"
                      value={value || ''}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={3}
                      placeholderTextColor={colors.white_opacity}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.blue,
                        backgroundColor: colors.tertiary_purple_opacity,
                        marginBottom: 6,
                        height: 80,
                        width: '100%',
                        padding: 15,
                        paddingLeft: 20,
                        borderRadius: 10,
                        color: colors.white,
                        textAlignVertical: 'top',
                        ...withDefaultFont({}),
                      }}
                    />
                  )}
                />
              </View>
            </View>

            {/* Checkbox de Consentimento */}
            <View className="mb-4 bg-blue/10 border border-blue p-3 rounded-lg">
              <Text className="text-xs text-center text-white_opacity leading-4 mb-2">
                <Text className="font-bold text-blue">ℹ️ PROCESSO B2B:</Text> Você deve ter autorização verbal prévia do cliente. Um e-mail será enviado para confirmação eletrônica do consentimento.
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-start mb-6 bg-fifth_purple/30 p-3 rounded-lg"
              onPress={() => setConsentChecked(!consentChecked)}>
              <View
                className={`w-5 h-5 mr-3 justify-center items-center rounded border-2 ${
                  consentChecked
                    ? 'bg-blue border-blue'
                    : 'bg-transparent border-blue'
                } items-center justify-center`}
                style={{marginTop: 2}}>
                {consentChecked && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={colors.primary_purple}
                  />
                )}
              </View>
              <Text className="text-white text-xs flex-1 leading-4">
                <Text className="font-bold">DECLARO que obtive autorização verbal prévia</Text> do cliente para compartilhar seus dados, e que ele está ciente de que receberá um e-mail de confirmação.
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-3">
              {editingIndex !== null && (
                <View className="flex-1">
                  <Button
                    text="CANCELAR"
                    backgroundColor="gray"
                    textColor="white"
                    fontWeight="bold"
                    fontSize={16}
                    height={50}
                    onPress={cancelEdit}
                  />
                </View>
              )}
              <View className="flex-1">
                <Button
                  text={editingIndex !== null ? 'SALVAR' : 'ADICIONAR'}
                  backgroundColor="blue"
                  textColor="primary_purple"
                  fontWeight="bold"
                  fontSize={16}
                  height={50}
                  onPress={handleSubmit(addToList)}
                  disabled={!consentChecked}
                />
              </View>
            </View>
          </View>

          {/* Lista de Indicações Aprimorada */}
          {indicationsList.length > 0 && (
            <View
              className="bg-tertiary_purple_opacity rounded-2xl p-6 mb-6"
            >
              {/* Header da lista */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="bg-blue/20 p-3 rounded-full mr-3">
                    <FontAwesome6
                      name="list-check"
                      size={20}
                      color={colors.blue}
                    />
                  </View>
                  <View>
                    <Text
                      className={`text-white font-bold ${fontSize.large}`}>
                      Convites Preparados
                    </Text>
                    <Text className="text-white_opacity text-sm">
                      {indicationsList.length}{' '}
                      {indicationsList.length === 1
                        ? 'Convite pronto'
                        : 'Convites prontos'}{' '}
                      para envio
                    </Text>
                  </View>
                </View>
                <View className="bg-blue/20 px-4 py-2 rounded-full">
                  <Text className="text-blue font-bold text-sm">
                    {indicationsList.length}
                  </Text>
                </View>
              </View>

              {/* Lista de indicações */}
              <View className="mb-6">
                {indicationsList.map((indication, index) => (
                  <View
                    key={indication.id}
                    className="border border-white/20 rounded-xl p-4 mb-3"
                    >
                    {/* Header do card */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-row items-center flex-1">
                        <View className="bg-white/20 p-3 rounded-full mr-3">
                          <FontAwesome6
                            name="user"
                            size={14}
                            color={colors.white}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-bold text-lg">
                            {indication.fullName}
                          </Text>
                          <View className="bg-blue/30 px-2 py-1 rounded-full self-start mt-1">
                            <Text className="text-white text-xs font-medium">
                              #{index + 1}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Botões de ação */}
                      <View className="flex-row gap-1">
                        <TouchableOpacity
                          onPress={() => editIndication(index)}
                          className="bg-white/20 p-2 rounded-lg"
                          activeOpacity={0.7}>
                          <FontAwesome6
                            name="edit"
                            size={14}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeIndication(index)}
                          className="bg-red/20 p-2 rounded-lg"
                          activeOpacity={0.7}>
                          <FontAwesome6
                            name="trash"
                            size={14}
                            color={colors.red}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Informações detalhadas */}
                    <View className="space-y-2">
                      <View className="flex-row items-center">
                        <FontAwesome6
                          name="envelope"
                          size={12}
                          color={colors.white_opacity}
                        />
                        <Text className="text-white_opacity text-sm ml-2 flex-1">
                          {indication.email}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <FontAwesome6
                          name="phone"
                          size={12}
                          color={colors.white_opacity}
                        />
                        <Text className="text-white_opacity text-sm ml-2 flex-1">
                          {indication.phone}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <FontAwesome6
                          name="tag"
                          size={12}
                          color={colors.blue}
                        />
                        <Text className="text-blue text-sm ml-2 font-medium flex-1">
                          {indication.product}
                        </Text>
                      </View>

                      {indication.observations && (
                        <View className="flex-row items-start mt-2">
                          <FontAwesome6
                            name="comment"
                            size={12}
                            color={colors.white_opacity}
                          />
                          <Text className="text-white_opacity text-sm ml-2 flex-1" numberOfLines={2}>
                            {indication.observations.length > 60 
                              ? `${indication.observations.substring(0, 60)}...` 
                              : indication.observations
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Botão de envio aprimorado */}
              <View className=" p-4">
                <View className="flex-row items-center justify-center mb-3">
                  <FontAwesome6
                    name="paper-plane"
                    size={16}
                    color={colors.white}
                  />
                  <Text className="text-white font-medium ml-2">
                    Pronto para enviar seus convites?
                  </Text>
                </View>
                <Button
                  text={`ENVIAR ${indicationsList.length} CONVITE${indicationsList.length > 1 ? 'S' : ''}`}
                  backgroundColor="blue"
                  textColor="primary_purple"
                  fontWeight="bold"
                  fontSize={16}
                  height={60}
                  onPress={submitAllIndications}
                  isLoading={isLoading}
                />
              </View>
            </View>
          )}

          {/* Estado vazio quando não há indicações */}
          {indicationsList.length === 0 && (
            <View
              className="bg-tertiary_purple_opacity rounded-2xl p-8 mb-6 items-center"
              style={{
                shadowColor: colors.black,
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}>
              <View className="bg-blue/10 p-6 rounded-full mb-4">
                <FontAwesome6 name="users" size={32} color={colors.blue} />
              </View>
              <Text
                className={`text-white font-bold ${fontSize.large} text-center mb-2`}>
                Nenhum convite adicionado
              </Text>
              <Text className="text-gray text-center text-sm">
                Preencha o formulário acima para adicionar seus primeiros
                convites. Você pode adicionar quantas quiser antes de enviar!
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          if (modalMessage.title === 'Convites enviados!') {
            navigation.goBack();
          }
        }}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="OK"
        onPress={() => {
          setIsModalVisible(false);
          if (modalMessage.title === 'Convites enviados!') {
            navigation.goBack();
          }
        }}
      />

      <CustomModal
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        title="Remover Convite"
        description="Tem certeza que deseja remover este convite?"
        buttonText="REMOVER"
        cancelButtonText="CANCELAR"
        onPress={confirmRemoveIndication}
        onCancelButtonPress={() => setIsRemoveModalVisible(false)}
      />
    </ImageBackground>
  );
}
