
import React, {useEffect, useState} from 'react';
import {Alert, Modal, View, Text, TextInput} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => doc.data());

        setProducts(productsList.map(product => product.name));
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
      const cleanedPhone = data.phone.replace(/\D/g, '');

      // Sempre quando algum arquivo for criado aqui, mandar um e-mail e uma notificação para a unidade. (Cloud Functions)
      const indicationRef = doc(collection(db, 'indications'));

      await setDoc(indicationRef, {
        indicator_id: userData?.uid,
        indicator_name: userData?.displayName,
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
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} transparent={true}>
      <BlurView
        style={{flex: 1, backgroundColor: 'transparent'}}
        blurType="dark"
        blurAmount={5}
        reducedTransparencyFallbackColor="transparent">
        <View className="flex-1 justify-center items-center">
          <View className="w-[80%] bg-fifth_purple rounded-2xl border-2 border-blue px-7 py-7">
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
                render={({field: {onChange, value}}) => (
                  <View
                    className={'px-2 justify-center'}
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: errors.product ? 'red' : colors.blue,
                      backgroundColor: colors.tertiary_purple_opacity,
                    }}>
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{
                        height: 50,
                        width: '100%',
                      }}>
                      <Picker.Item
                        label="Produto desejado"
                        value=""
                        style={{
                          color: errors.product ? 'red' : colors.white_opacity,
                          fontSize: 13,
                          fontFamily: 'FamiljenGrotesk-regular',
                        }}
                      />
                      {products.map(product => (
                        <Picker.Item
                          key={product}
                          label={product}
                          value={product}
                        />
                      ))}
                    </Picker>
                  </View>
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
  );
}
