import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import Contacts from 'react-native-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FormInput} from '../components/FormInput';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {ConctactItem} from '../components/ContactItem';
import {applyMaskTelephone} from '../utils/applyMaskTelephone';

type Lead = {
  recordID: string;
  displayName: string;
  phoneNumbers: {number: string}[];
};

export function IndicateInBulkScreen() {
  const navigation = useNavigation();
  const {userData} = useAuth();

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
      telephone: applyMaskTelephone(c.phoneNumbers[0].number) ?? 'Sem número',
    }));

    console.log(arrSelecteds)

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
      telephone: '',
      product: '',
      observations: '',
    },
  });

  const onSubmit = (data: IndicationSchema) => {
    const {telephone, ...dataFiltred} = data;

    const cleanedTelephone = telephone.replace(/\D/g, '');

    console.log(
      telephone,
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

    const matchSearchTel = item.phoneNumbers?.[0]?.number
    .includes(search);

    return matchSearchName || matchSearchTel;
  });

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
            Indicar em Massa
          </Text>
        </View>

        <View className="flex-1 mt-5">
          <Text className="text-lg font-bold text-center text-primary_purple">
            Selecione os contatos:
          </Text>

          <View className="flex-row mt-2 items-center w-full h-16 bg-primary_purple rounded-lg">
            <Ionicons
              name="search"
              size={24}
              color={colors.white}
              className="absolute left-5"
            />
            <TextInput
              className="pl-16 pr-5 flex-1"
              onChangeText={setSearch}
              value={search}
              placeholder="Buscar..."
              placeholderTextColor={colors.white}
            />
          </View>

          <FlatList
            className="mb-4"
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

        <View className="mt-auto mb-5">
          <Button
            text="ENVIAR"
            backgroundColor="tertiary_purple"
            onPress={submitSelecteds}
            textColor="white"
          />
        </View>
      </View>
    </View>
  );
}
