import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {
  getFirestore,
  collection,
  getDocs,
} from '@react-native-firebase/firestore';

import {Button} from './Button';
import {colors} from '../styles/colors';
import {FormInputOld} from '../components/FormInputOld';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import {useAuth} from '../contexts/Auth';
import Dropdown from 'react-native-dropdown-picker';
import {withDefaultFont} from '../config/fontConfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const db = getFirestore();

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export function IndicateModal({visible, onClose}: ModalProps) {
  const {userData} = useAuth();
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

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IndicationSchema>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      product: '',
      observations: '',
    },
  });

  const onSubmit = async (data: IndicationSchema) => {
    try {
      setIsLoading(true);
      const cleanedPhone = data.phone.replace(/\D/g, '');

      // Novo fluxo: enviar dados para API de consentimento
      const consentRequestData = {
        indicator_id: userData?.uid,
        indicator_name: userData?.displayName,
        profilePicture: userData?.profilePicture,
        unitId: userData?.affiliated_to,
        unitName: userData?.unitName,
        indicated_name: data.fullName,
        indicated_email: data.email,
        indicated_phone: cleanedPhone,
        product: data.product,
        observations: data.observations,
      };

      // Chamar Cloud Function para enviar email de consentimento
      const response = await fetch('https://sendconsentemail-o2z256zv6a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consentRequestData),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar solicitação de consentimento');
      }

      reset();
      setIsConfirmationModalVisible(false);
      setConsentChecked(false);

      setModalMessage({
        title: 'Convite enviado!',
        description: 'Um e-mail foi enviado para o indicado com uma solicitação de consentimento. A indicação será registrada após a confirmação.',
      });
      setIsModalVisible(true);
    } catch (error) {
      setModalMessage({
        title: 'Erro ao enviar o convite!',
        description: 'Por favor, verifique os dados e tente novamente.',
      });
      setIsModalVisible(true);

      console.error('Erro ao enviar solicitação de consentimento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSubmit = () => {
    if (consentChecked) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <KeyboardAvoidingView
          className="flex-1 justify-center items-center px-5"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            className="w-full max-w-sm bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7"
            style={{zIndex: 999}}>
            <View className="justify-between items-center flex-row" style={{zIndex: 1001}}>
              <BackButton onPress={onClose} />
              <Text className="text-blue font-bold text-3xl absolute left-1/2 -translate-x-1/2">
                Indicar
              </Text>
            </View>

            <View className="flex-col mt-5 gap-2">
              <FormInputOld
                name="fullName"
                placeholder="Nome e sobrenome"
                control={control}
                errorMessage={errors.fullName?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white_opacity}
                height={49}
                color={colors.white_opacity}
                fontSize={13}
              />
              <FormInputOld
                name="email"
                placeholder="E-mail"
                control={control}
                errorMessage={errors.email?.message}
                borderColor={colors.blue}
                backgroundColor={colors.tertiary_purple_opacity}
                placeholderColor={colors.white_opacity}
                height={49}
                color={colors.white_opacity}
                fontSize={13}
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
                height={49}
                color={colors.white_opacity}
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
                fontSize={13}
              />

              <Controller
                control={control}
                render={({field: {onChange, value: fieldValue}}) => (
                  <Dropdown
                    listItemLabelStyle={{
                      color: colors.white,
                    }}
                    searchPlaceholderTextColor={colors.white_opacity}
                    dropDownContainerStyle={{
                      backgroundColor: colors.fifth_purple,
                      borderColor: colors.blue,
                    }}
                    searchContainerStyle={{
                      backgroundColor: colors.fifth_purple,
                      borderColor: colors.blue,
                    }}
                    searchTextInputStyle={{
                      borderColor: colors.blue,
                    }}
                    open={open}
                    value={fieldValue}
                    items={items}
                    setOpen={setOpen}
                    setValue={callback => {
                      const newValue = callback(fieldValue);
                      onChange(newValue);
                    }}
                    onChangeValue={val => {
                      onChange(val);
                    }}
                    setItems={setItems}
                    style={{
                      borderWidth: 1,
                      borderColor: errors.product ? 'red' : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      marginBottom: 6,
                      height: 50,
                      width: '100%',
                      padding: 15,
                      paddingLeft: 20,
                      borderRadius: 10,
                      zIndex: 1000,
                    }}
                    placeholderStyle={{
                      color: errors.product ? 'red' : colors.white_opacity,
                    }}
                    textStyle={withDefaultFont({
                      color: colors.white,
                      fontSize: 14,
                    })}
                    searchable
                    maxHeight={300}
                    placeholder="Produto desejado"
                    searchPlaceholder="Pesquisar..."
                  />
                )}
                name="product"
              />

              <Controller
                control={control}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    className="border-[1px] border-primary_purple text-[1rem] font-regular p-5 rounded-xl h-28 w-full mb-2 mt-2"
                    placeholder="Observações..."
                    placeholderTextColor={
                      errors.observations ? 'red' : colors.white_opacity
                    }
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    onChangeText={onChange}
                    value={value}
                    style={{
                      borderColor: errors.observations ? 'red' : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                      color: colors.white_opacity,
                    }}
                  />
                )}
                name="observations"
              />

              <View className="pt-2 justify-center items-center w-full">
                <Button
                  onPress={() => {
                    handleSubmit(data => {
                      setIsConfirmationModalVisible(true);
                    })();
                  }}
                  text="ENVIAR"
                  backgroundColor="blue"
                  textColor="tertiary_purple"
                  fontWeight="bold"
                  fontSize={22}
                  width="100%"
                  isLoading={isLoading}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Modal de Confirmação de Consentimento */}
      <Modal
        visible={isConfirmationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsConfirmationModalVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View className="flex-1 justify-center items-center px-5">
            <View
              className="w-full max-w-sm bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7"
              style={{zIndex: 999}}>
              <Text className="text-blue font-bold text-2xl text-center mb-4">
                Solicitar Consentimento
              </Text>

              <Text className="text-white_opacity text-sm text-center mb-4 leading-5">
                Você está prestes a solicitar consentimento do indicado.
              </Text>

              {/* Texto de consentimento */}
              <View className="mb-4">
                <Text className="text-xs text-center text-white_opacity leading-4 mb-3">
                  Será enviado um e-mail para <Text className="font-bold text-white">o indicado</Text> com
                  um link de consentimento. Apenas após ele autorizar o
                  compartilhamento dos dados, a indicação será registrada.
                </Text>
                <Text className="text-xs text-center text-white_opacity leading-4 mb-3">
                  <Text className="font-bold text-blue">Importante:</Text> Os dados não serão armazenados
                  até que o consentimento seja dado pelo indicado.
                </Text>
              </View>

              {/* Checkbox de consentimento */}
              <TouchableOpacity
                onPress={() => setConsentChecked(!consentChecked)}
                className="flex-row items-center mb-4"
                activeOpacity={0.8}>
                <MaterialCommunityIcons
                  name={
                    consentChecked
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={20}
                  color={colors.white}
                />
                <Text className="text-[9px] flex-1 ml-2 text-white_opacity">
                  Confirmo que tenho autorização do indicado para enviar esta solicitação de consentimento.
                </Text>
              </TouchableOpacity>

              <View className="flex-row gap-3 justify-center">
                <Button
                  text="CANCELAR"
                  backgroundColor="white"
                  textColor="primary_purple"
                  fontWeight="bold"
                  fontSize={16}
                  onPress={() => {
                    setIsConfirmationModalVisible(false);
                    setConsentChecked(false);
                  }}
                  width={120}
                />
                <Button
                  text={'ENVIAR'}
                  backgroundColor="blue"
                  textColor="tertiary_purple"
                  fontWeight="bold"
                  fontSize={16}
                  onPress={confirmSubmit}
                  width={120}
                  disabled={!consentChecked}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <CustomModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          // Se for modal de sucesso, fechar o modal principal também
          if (modalMessage.title === 'Convite enviado!') {
            onClose();
          }
        }}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />
    </Modal>
  );
}
