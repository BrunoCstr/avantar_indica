import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  ImageBackground,
} from 'react-native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import Contacts from 'react-native-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {ConctactItem} from '../components/ContactItem';
import {applyMaskTelephone} from '../utils/applyMaskTelephone';
import {BackButton} from '../components/BackButton';
import {IndicateInBulkSkeleton} from '../components/skeletons/IndicateInBulkSkeleton';

type Lead = {
  recordID: string;
  displayName: string;
  phoneNumbers: {number: string}[];
};

export function IndicateInBulkScreen() {
  const {userData} = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selecteds, setSelecteds] = useState<{[key: string]: boolean}>({});
  const [search, setSearch] = useState('');

  const askForPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const loadContacts = async () => {
    const allowed = await askForPermission();
    if (allowed) {
      const all = await Contacts.getAll();
      const withTelephone: any = all.filter(c => c.phoneNumbers.length > 0);
      setLeads(withTelephone);

      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const toggleContact = (id: string) => {
    setSelecteds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submitSelecteds = () => {
    const arrSelecteds = leads.filter(c => selecteds[c.recordID]);
    const leadsData = arrSelecteds.map(c => ({
      fullName: c.displayName,
      phone: applyMaskTelephone(c.phoneNumbers[0].number) ?? 'Sem número',
    }));

    console.log(arrSelecteds);

    console.log(leadsData);
  };

  // Envio do Formulário

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<IndicationSchema>({
    resolver: zodResolver(indicationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      product: '',
      observations: '',
    },
  });

  const onSubmit = (data: IndicationSchema) => {
    const {phone, ...dataFiltred} = data;

    const cleanedTelephone = phone.replace(/\D/g, '');

    console.log(
      phone,
      cleanedTelephone,
      dataFiltred.fullName,
      dataFiltred.observations,
      dataFiltred.product,
    );

    Alert.alert(
      'Enviado!',
      `Indicações enviadas para a unidade: ${userData?.affiliated_to}.`,
    );
  };

  const filteredData = leads.filter(item => {
    const matchSearchName = item.displayName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchSearchTel = item.phoneNumbers?.[0]?.number.includes(search);

    return matchSearchName || matchSearchTel;
  });

  return (
    <ImageBackground
      source={images.bg_white}
      resizeMode="cover"
      className="flex-1">
      {isLoading ? (
        <IndicateInBulkSkeleton />
      ) : (
        <View className="flex-1 ml-5 mr-5 mt-10">
          <View className="justify-between items-center flex-row">
            <BackButton
              color={colors.primary_purple}
              borderColor={colors.primary_purple}
            />
            <Text className="text-primary_purple font-bold text-3xl absolute left-1/2 -translate-x-1/2">
              Indicar em Massa
            </Text>
          </View>

          <View className="flex-1 mt-5">
            <Text className="text-lg font-bold text-center text-primary_purple">
              Selecione os contatos:
            </Text>

            <View className="flex-row mt-2 items-center w-full h-16 border-2 border-primary_purple rounded-lg">
              <Ionicons
                name="search"
                size={24}
                color={colors.primary_purple}
                className="absolute left-5"
              />
              <TextInput
                className="pl-16 pr-5 flex-1"
                onChangeText={setSearch}
                value={search}
                placeholder="Buscar..."
                placeholderTextColor={colors.primary_purple}
              />
            </View>

            <FlatList
              className="mb-5"
              data={filteredData}
              keyExtractor={item => item.recordID}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <ConctactItem
                  contact={item}
                  selected={!!selecteds[item.recordID]}
                  onToggle={() => toggleContact(item.recordID)}
                />
              )}
            />
          </View>

          <View className="mt-auto mb-10">
            <Button
              text="ENVIAR"
              backgroundColor="blue"
              onPress={submitSelecteds}
              textColor="tertiary_purple"
              fontSize={25}
              fontWeight="bold"
            />
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
