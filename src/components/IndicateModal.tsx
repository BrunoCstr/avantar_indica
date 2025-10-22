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
import firestore from '@react-native-firebase/firestore';

import {Button} from './Button';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import {useAuth} from '../contexts/Auth';
import Dropdown from 'react-native-dropdown-picker';
import {withDefaultFont} from '../config/fontConfig';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export function IndicateModal({visible, onClose}: ModalProps) {
  const {userData} = useAuth();
  const [products, setProducts] = useState<string[]>([
    'Seguro',
    'Consórcio',
    'Plano de Saúde',
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState<any[]>([
    {label: 'Seguro', value: 'Seguro'},
    {label: 'Consórcio', value: 'Consórcio'},
    {label: 'Plano de Saúde', value: 'Plano de Saúde'},
  ]);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IndicationSchema>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      product: '',
      observations: '',
    },
  });

  // Reset completo quando o modal é fechado
  useEffect(() => {
    if (!visible) {
      // Fechar dropdown se estiver aberto
      setOpen(false);
      // Resetar formulário
      reset();
      // Resetar estados
      setValue('');
      setConsentChecked(false);
      setIsConfirmationModalVisible(false);
      setIsModalVisible(false);
    }
  }, [visible, reset]);

  const onSubmit = async (data: IndicationSchema) => {
    try {
      setIsLoading(true);
      const cleanedPhone = data.phone.replace(/\D/g, '');

      // Sempre quando algum arquivo for criado aqui, mandar um e-mail e uma notificação para a unidade. (Cloud Functions)
      const indicationRef = firestore().collection('indications').doc();

      await indicationRef.set({
        indicator_id: userData?.uid,
        indicator_name: userData?.displayName,
        profilePicture: userData?.profilePicture,
        indicationId: indicationRef.id,
        unitId: userData?.affiliated_to,
        unitName: userData?.unitName,
        name: data.fullName,
        phone: cleanedPhone,
        email: data.email || '',
        product: data.product,
        observations: data.observations,
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: 'PENDENTE CONTATO',
        sgcorId: null,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Fechar modal de confirmação primeiro
      setIsConfirmationModalVisible(false);
      
      // Resetar estados
      reset();
      setValue('');
      setConsentChecked(false);
      setOpen(false);

      // Mostrar mensagem de sucesso
      setModalMessage({
        title: 'Indicação enviada!',
        description: 'Você pode acompanhar sua indicação no menu de status.',
      });
      setIsModalVisible(true);
    } catch (error) {
      setModalMessage({
        title: 'Erro ao enviar a indicação!',
        description: 'Por favor, tente novamente.',
      });
      setIsModalVisible(true);

      console.error('Erro ao enviar a indicação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSubmit = () => {
    if (consentChecked) {
      handleSubmit(onSubmit)();
    }
  };

  // Função para fechar o modal de sucesso e o modal principal
  const handleCloseSuccessModal = () => {
    setIsModalVisible(false);
    // Pequeno delay para garantir que o modal de sucesso fecha antes do principal
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Função para fechar o modal principal
  const handleClose = () => {
    setOpen(false); // Garantir que o dropdown está fechado
    onClose();
  };

  return (
    <Modal visible={visible} onRequestClose={handleClose} transparent={true} animationType="fade">
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <KeyboardAvoidingView
          className="flex-1 justify-center items-center px-5"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            className="w-full max-w-sm bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7">
            <View className="justify-between items-center flex-row">
              <BackButton onPress={handleClose} />
              <Text className="text-blue font-bold text-3xl absolute left-1/2 -translate-x-1/2">
                Indicar
              </Text>
            </View>

            <View className="flex-col mt-5 gap-2">
              <FormInput
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
              <FormInput
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
              <FormInput
                name="email"
                placeholder="E-mail (Opcional)"
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
                      color: colors.white
                    }}
                    open={open}
                    value={fieldValue || ''}
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
                    handleSubmit((data) => {
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
        onRequestClose={() => {
          setIsConfirmationModalVisible(false);
          setConsentChecked(false);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
          <View className="flex-1 justify-center items-center px-5">
            <View
              className="w-full max-w-sm bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7">
              <Text className="text-blue font-bold text-2xl text-center mb-4">
                Confirmar Envio
              </Text>

              <Text className="text-white_opacity text-sm text-center mb-4 leading-5">
                Você está prestes a enviar 1 indicação para a unidade {userData?.unitName}.
              </Text>

              {/* Texto de consentimento */}
              <View className="mb-4">
                <Text className="text-xs text-center text-white_opacity leading-4 mb-3">
                  Ao informar os dados de terceiros (nome, telefone, etc.), você confirma que possui o consentimento dessa pessoa para compartilhar essas informações com a Avantar.
                </Text>
              </View>

              {/* Checkbox de consentimento */}
              <TouchableOpacity
                onPress={() => setConsentChecked(!consentChecked)}
                className="flex-row items-center mb-4"
                activeOpacity={0.8}>
                <MaterialCommunityIcons
                  name={
                    consentChecked ? 'checkbox-marked' : 'checkbox-blank-outline'
                  }
                  size={20}
                  color={colors.white}
                />
                <Text className="text-[9px] flex-1 ml-2 text-white_opacity">
                  Confirmo que tenho autorização do terceiro para compartilhar seus dados.
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
                  text={"CONFIRMAR"}
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
        onClose={handleCloseSuccessModal}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
        onPress={handleCloseSuccessModal}
      />
    </Modal>
  );
}
