import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  PermissionsAndroid,
  Platform,
  ImageBackground,
  Linking,
} from 'react-native';
import {indicationSchema, IndicationSchema} from '../schemas/validationSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import Contacts from 'react-native-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {Button} from '../components/Button';
import {useAuth} from '../contexts/Auth';
import {ConctactItem} from '../components/ContactItem';
import {cleanPhoneForBackend} from '../utils/formatPhoneNumber';
import {BackButton} from '../components/BackButton';
import {IndicateInBulkSkeleton} from '../components/skeletons/IndicateInBulkSkeleton';
import {CustomModal} from '../components/CustomModal';
import {sendBulkIndications} from '../services/bulkIndications/bulkIndications';
import {Spinner} from '../components/Spinner';

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
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const askForPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        return 'never_ask_again';
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === 'ios') {
      try {
        // Verificar se o módulo Contacts está disponível
        if (!Contacts || typeof Contacts.requestPermission !== 'function') {
          console.error('Módulo react-native-contacts não está disponível');
          return false;
        }
        const permission = await Contacts.requestPermission();
        return permission === 'authorized';
      } catch (error) {
        console.error('Erro ao solicitar permissão no iOS:', error);
        return false;
      }
    }
    return true;
  };

  const handlePermissionButton = async () => {
    const result = await askForPermission();
    if (result === true) {
      loadContacts();
    } else if (result === 'never_ask_again') {
      Linking.openSettings();
    } else {
      // No iOS, se a permissão for negada, abrir configurações
      if (Platform.OS === 'ios') {
        Linking.openSettings();
      } else {
        setPermissionDenied(true);
      }
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    setPermissionDenied(false);
    
    // Verificar se o módulo está disponível antes de prosseguir
    if (Platform.OS === 'ios' && (!Contacts || typeof Contacts.getAll !== 'function')) {
      console.error('Módulo react-native-contacts não está disponível no iOS');
      setLeads([]);
      setIsLoading(false);
      return;
    }
    
    const allowed = await askForPermission();
    if (allowed === true) {
      try {
        const all = await Contacts.getAll();
        const withTelephone: any = all.filter(c => 
          c.phoneNumbers && 
          Array.isArray(c.phoneNumbers) && 
          c.phoneNumbers.length > 0 &&
          c.displayName
        );
        setLeads(withTelephone);
      } catch (e) {
        console.error('Erro ao carregar contatos:', e);
        setLeads([]);
      }
      setIsLoading(false);
    } else {
      if (Platform.OS === 'ios') {
        // No iOS, se a permissão for negada, não mostrar a tela de permissão negada
        // pois o usuário pode ter negado temporariamente
        setLeads([]);
      } else {
        setPermissionDenied(true);
        setLeads([]);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const toggleContact = (id: string) => {
    if (id) {
      setSelecteds(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const selectAllContacts = () => {
    const maxContacts = 1000;
    const contactsToSelect = filteredData.slice(0, maxContacts);

    const newSelecteds: {[key: string]: boolean} = {};
    contactsToSelect.forEach(contact => {
      if (contact.recordID) {
        newSelecteds[contact.recordID] = true;
      }
    });

    setSelecteds(newSelecteds);

    if (filteredData.length > maxContacts) {
      setModalMessage({
        title: 'Limite atingido',
        description: `Foram selecionados os primeiros ${maxContacts} contatos. O limite máximo é de ${maxContacts} contatos por vez.`,
      });
      setIsModalVisible(true);
    }
  };

  const clearAllSelections = () => {
    setSelecteds({});
  };

  const selectedCount = Object.values(selecteds).filter(Boolean).length;

  const submitSelecteds = async () => {
    const arrSelecteds = leads.filter(c => c.recordID && selecteds[c.recordID]);

    if (arrSelecteds.length === 0) {
      setModalMessage({
        title: 'Nenhum contato selecionado',
        description:
          'Selecione pelo menos um contato para enviar as indicações.',
      });
      setIsModalVisible(true);
      return;
    }

    setIsSubmitting(true);

    const indications = arrSelecteds
      .filter(c => c.displayName && c.phoneNumbers?.[0]?.number)
      .map(c => ({
        name: c.displayName || 'Sem nome',
        phone: cleanPhoneForBackend(c.phoneNumbers?.[0]?.number || ''),
      }));

    try {
      const unitId = userData?.affiliated_to || '';

      const packagedIndicationId = await sendBulkIndications(
        indications,
        userData?.displayName || '',
        userData?.uid || '',
        unitId,
        userData?.unitName || '',
        userData?.profilePicture || '',
      );

      if (packagedIndicationId) {
        setModalMessage({
          title: 'Enviado!',
          description: `${indications.length} indicações enviadas para a unidade: ${userData?.unitName}.`,
        });
        // Limpar seleções após envio bem-sucedido
        setSelecteds({});
      } else {
        setModalMessage({
          title: 'Erro',
          description: 'Erro ao enviar as indicações. Tente novamente.',
        });
      }
      setIsModalVisible(true);
    } catch (error) {
      console.error('Erro ao enviar indicações:', error);
      setModalMessage({
        title: 'Erro',
        description: 'Erro ao enviar as indicações. Tente novamente.',
      });
      setIsModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
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
    },
  });

  const filteredData = leads.filter(item => {
    if (!item.displayName || !item.phoneNumbers || !Array.isArray(item.phoneNumbers)) {
      return false;
    }

    const matchSearchName = item.displayName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchSearchTel = item.phoneNumbers?.[0]?.number?.includes(search) || false;

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

          <View className="flex-1 mt-3">
            <Text className="text-lg font-bold text-center text-primary_purple">
              Selecione os contatos:
            </Text>

            <View className="flex-row items-center mt-5 w-full h-16 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4">
              <Ionicons
                name="search"
                size={24}
                color={colors.white}
                className="absolute left-5"
              />

              <TextInput
                className="pl-16 pr-5 flex-1 text-white font-regular text-lg"
                placeholderTextColor={colors.white}
                onChangeText={setSearch}
                value={search}
                placeholder="Buscar..."
              />
            </View>

            {filteredData.length > 0 && (
              <View className="flex-row justify-between items-center mt-3 mb-2">
                <Text className="text-sm text-primary_purple font-medium">
                  {selectedCount} de {Math.min(filteredData.length, 1000)}{' '}
                  selecionados
                </Text>
                <View className="flex-row gap-2">
                  <Button
                    text="Selecionar Todos"
                    backgroundColor={
                      selectedCount === Math.min(filteredData.length, 1000)
                        ? 'gray'
                        : 'secondary_purple'
                    }
                    textColor="white"
                    fontWeight="bold"
                    fontSize={12}
                    onPress={selectAllContacts}
                    width={120}
                    height={35}
                    disabled={
                      selectedCount === Math.min(filteredData.length, 1000) ||
                      filteredData.length === 0
                    }
                  />
                  <Button
                    text="Limpar"
                    backgroundColor="primary_purple"
                    textColor="white"
                    fontWeight="bold"
                    fontSize={14}
                    onPress={clearAllSelections}
                    width={80}
                    height={35}
                    disabled={selectedCount === 0 || filteredData.length === 0}
                  />
                </View>
              </View>
            )}

            {permissionDenied ? (
              <View className="flex-1 justify-center items-center p-10">
                <Text
                  style={{
                    fontSize: 30,
                    color: colors.secondary_purple,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 16,
                  }}>
                  Permissão necessária
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.black,
                    textAlign: 'center',
                    marginBottom: 24,
                  }}>
                  O app precisa de permissão para acessar seus contatos. Ative a
                  permissão para continuar.
                </Text>
                <Button
                  text={Platform.OS === 'ios' ? 'Abrir Configurações' : 'Ativar permissão de contatos'}
                  backgroundColor="primary_purple"
                  textColor="white"
                  fontWeight="bold"
                  fontSize={18}
                  onPress={handlePermissionButton}
                  width={300}
                />
              </View>
            ) : leads.length === 0 ? (
              <View className="flex-1 justify-center items-center p-10">
                <Text
                  style={{
                    fontSize: 30,
                    color: colors.secondary_purple,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: 16,
                  }}>
                  Nenhum contato encontrado
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.black,
                    textAlign: 'center',
                    marginBottom: 24,
                  }}>
                  {Platform.OS === 'ios' 
                    ? 'Não encontramos contatos com telefone na sua agenda. Verifique se você concedeu permissão para acessar contatos nas configurações do app.'
                    : 'Não encontramos contatos com telefone na sua agenda. Adicione contatos no seu aparelho para usar esta funcionalidade.'
                  }
                </Text>
                {Platform.OS === 'ios' && (
                  <Button
                    text="Abrir Configurações"
                    backgroundColor="primary_purple"
                    textColor="white"
                    fontWeight="bold"
                    fontSize={16}
                    onPress={() => Linking.openSettings()}
                    width={250}
                  />
                )}
              </View>
            ) : (
              <FlatList
                className="mb-5"
                data={filteredData}
                keyExtractor={item => item.recordID || item.displayName || 'unknown'}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <ConctactItem
                    contact={item}
                    selected={!!selecteds[item.recordID]}
                    onToggle={() => toggleContact(item.recordID)}
                  />
                )}
              />
            )}
          </View>

          <View className="mt-auto mb-10">
            <Button
              text={
                isSubmitting ? <Spinner size={32} variant="purple" /> : 'ENVIAR'
              }
              backgroundColor="blue"
              onPress={submitSelecteds}
              textColor="tertiary_purple"
              fontSize={25}
              fontWeight="bold"
              disabled={isSubmitting || selectedCount === 0}
            />
          </View>
        </View>
      )}

      <CustomModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          // Se o envio foi bem-sucedido, recarregar contatos
          if (modalMessage.title === 'Enviado!') {
            loadContacts();
          }
        }}
        title={modalMessage.title}
        description={modalMessage.description}
        buttonText="FECHAR"
      />
    </ImageBackground>
  );
}
