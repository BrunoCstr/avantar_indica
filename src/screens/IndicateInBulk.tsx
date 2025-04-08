import React from 'react';
import {Text, View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import { useAuth } from '../contexts/Auth';

export function IndicateInBulkScreen() {
  const navigation = useNavigation();
  const {userData} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IndicationSchema>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      fullName: '',
      telephone: '',
      product: '',
      observations: '',
    },
  });

  const onSubmit = (data: IndicationSchema) => {
    const {telephone, ...dataFiltred} = data;

    const cleanedTelephone = telephone.replace(/\D/g, '');

    console.log(telephone, cleanedTelephone, dataFiltred.fullName, dataFiltred.observations, dataFiltred.product);

    Alert.alert('Enviado!', `Indicação enviada para a unidade: ${userData?.affiliated_to}.`);
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
