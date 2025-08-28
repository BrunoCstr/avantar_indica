import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {Button} from './Button';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {BackButton} from '../components/BackButton';
import {CustomModal} from '../components/CustomModal';
import {useAuth} from '../contexts/Auth';
import firestore from '@react-native-firebase/firestore';
import Dropdown from 'react-native-dropdown-picker';

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
      phone: '',
      product: '',
      observations: '',
    },
  });

  const onSubmit = async (data: IndicationSchema) => {
    try {
      setIsLoading(true);
      const cleanedPhone = data.phone.replace(/\D/g, '');

      // Sempre quando algum arquivo for criado aqui, mandar um e-mail e uma notificação para a unidade. (Cloud Functions)
      const indicationRef = doc(collection(db, 'indications'));

      await setDoc(indicationRef, {
        indicator_id: userData?.uid,
        indicator_name: userData?.displayName,
        profilePicture: userData?.profilePicture,
        indicationId: indicationRef.id,
        unitId: userData?.affiliated_to,
        unitName: userData?.unitName,
        name: data.fullName,
        phone: cleanedPhone,
        product: data.product,
        observations: data.observations,
        createdAt: serverTimestamp(),
        status: 'PENDENTE CONTATO',
        sgcorId: null,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      reset();

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

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <KeyboardAvoidingView
          className="flex-1 justify-center items-center px-5"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            className="w-full max-w-sm bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7"
            style={{zIndex: 999}}>
            <View className="justify-between items-center flex-row">
              <BackButton onPress={onClose} />
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

              <Controller
                control={control}
                render={({field: {onChange, value: fieldValue}}) => (
                  <Dropdown
                    arrowIconStyle={{
                      tintColor: colors.white,
                    }}
                    listItemLabelStyle={{
                      color: colors.white,
                    }}
                    searchPlaceholderTextColor={colors.white_opacity}
                    arrowIconColor={colors.white}
                    dropDownContainerStyle={{
                      backgroundColor: colors.tertiary_purple,
                      borderColor: colors.blue,
                    }}
                    searchContainerStyle={{
                      backgroundColor: colors.tertiary_purple,
                      borderColor: colors.blue,
                    }}
                    searchTextInputStyle={{
                      borderColor: colors.blue,
                    }}
                    open={open}
                    value={fieldValue}
                    items={items}
                    setOpen={setOpen}
                    setValue={val => {
                      setValue(val);
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
                    textStyle={{
                      color: colors.white,
                      fontFamily: 'FamiljenGrotesk-Regular',
                      fontSize: 14,
                    }}
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

              <View className="pt-5 justify-center items-center w-full">
                <Button
                  onPress={handleSubmit(onSubmit)}
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

      <CustomModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />
    </Modal>
  );
}
