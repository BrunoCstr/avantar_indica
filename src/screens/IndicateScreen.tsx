import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {getFirestore, collection, getDocs, doc, setDoc, serverTimestamp} from '@react-native-firebase/firestore';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import { useAuth } from '../contexts/Auth';
import app from '../../firebaseConfig';

const db = getFirestore(app);

export function IndicateScreen() {
  const navigation = useNavigation();
  const {userData} = useAuth();
  const [products, setProducts] = useState<string[]>([]);

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
      const referralRef = doc(collection(db, 'referrals'));

      await setDoc(referralRef, {
        indicator_name: userData?.displayName,
        referralId: referralRef.id,
        unitId: userData?.affiliated_to,
        name: data.fullName,
        phone: cleanedPhone,
        product: data.product,
        observations: data.observations,
        createdAt: serverTimestamp(),
        status: "PENDENTE CONTATO"
      });

      reset();
      Alert.alert('Indicação enviada!', 'Agradecemos sua indicação. Você pode acompanhar sua indicação no menu de status.');
    } catch (error) {
      Alert.alert('Erro ao enviar a indicação!', 'Por favor, tente novamente mais tarde.');
      console.error('Erro ao enviar a indicação:', error);
    }
  };


  return (
    <View className="flex-1">
      <Image source={images.bg_home_white} resizeMode="contain" />

      <View className="flex-1 ml-5 mr-5">
        <View className="justify-between items-center flex-row">
          <TouchableOpacity
            className="border-[1px] rounded-md border-primary_purple h-15 w-15 p-2"
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}>
            <Entypo
              name="arrow-long-left"
              size={21}
              color={colors.primary_purple}
            />
          </TouchableOpacity>
          <Text className="text-primary_purple font-bold text-3xl absolute left-1/2 -translate-x-1/2">
            Indicar
          </Text>
        </View>

        <View className="flex-col mt-10">
          <FormInput
            name="fullName"
            placeholder="Nome"
            control={control}
            errorMessage={errors.fullName?.message}
            borderColor={colors.primary_purple}
            backgroundColor={colors.transparent}
            placeholderColor={colors.primary_purple}
            height={49}
            color={colors.black}
          />
          <FormInput
            name="phone"
            placeholder="Telefone"
            control={control}
            errorMessage={errors.phone?.message}
            borderColor={colors.primary_purple}
            backgroundColor={colors.transparent}
            placeholderColor={colors.primary_purple}
            height={49}
            color={colors.black}
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

          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <View
                className={'px-2 justify-center'}
                style={{
                  borderWidth: 2,
                  borderRadius: 50,
                  borderColor: errors.product ? 'red' : colors.primary_purple,
                }}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={{
                    height: 45,
                    width: '100%',
                  }}>
                  <Picker.Item
                    label="Produto desejado"
                    value=""
                    style={{
                      color: errors.product ? 'red' : colors.primary_purple,
                      fontSize: 14,
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
                className="border-2 border-primary_purple text-[0.875.rem] font-regular p-5 rounded-3xl h-28 w-full mb-2 mt-2"
                placeholder="Observações..."
                placeholderTextColor={
                  errors.observations ? 'red' : colors.primary_purple
                }
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={onChange}
                value={value}
                style={{
                  borderColor: errors.observations
                    ? 'red'
                    : colors.primary_purple,
                }}
              />
            )}
            name="observations"
          />

          <Button
            text="ENVIAR"
            backgroundColor="tertiary_purple"
            onPress={handleSubmit(onSubmit)}
            textColor="white"
          />
        </View>
      </View>
    </View>
  );
}
