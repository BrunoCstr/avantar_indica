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

const products = [
  'AERONÁUTICO',
  'AGRO - RURAL',
  'AUTO',
  'CAMINHÃO',
  'CONDOMÍNIO',
  'DEMAIS RAMOS',
  'EQUIPAMENTOS E OUTROS BENS',
  'EVENTOS',
  'FROTA',
  'GARANTIAS E RESPONSABILIDADES',
  'MOTO',
  'NÁUTICO',
  'PATRIMONIAIS, EMPRESA E IMOVEIS',
  'PLANOS DE SAÚDE',
  'PLANOS ODONTOLÓGICOS',
  'PREVIDÊNCIA',
  'PRODUTOS FINANCEIROS',
  'RESIDENCIAL',
  'RESPONSABILIDADE CIVIL PROFISSIONAL',
  'RISCOS FINANCEIROS',
  'RURAL',
  'SERVIÇOS FINANCEIROS',
  'TRANSPORTE',
  'VIAGEM',
  'VIDA EM GRUPO',
  'VIDA INDIVIDUAL',
];

export function IndicateScreen() {
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

    console.log(data.fullName, data.telephone, data.observations, data.product);

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
            name="telephone"
            placeholder="Telefone"
            control={control}
            errorMessage={errors.telephone?.message}
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
