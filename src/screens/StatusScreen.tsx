import React, {useState, useEffect, useCallback} from 'react';
import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  FlatList,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firestore, {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';

import images from '../data/images';
import {colors} from '../styles/colors';
import {TextInput} from 'react-native-gesture-handler';
import {BackButton} from '../components/BackButton';
import {FilterDropdown} from '../components/FilterDropdown';
import {StatusScreenSkeleton} from '../components/skeletons/StatusScreenSkeleton';
import {useAuth} from '../contexts/Auth';
import {
  filterStatusItems,
  getStatusStats,
  UnifiedStatusItem,
} from '../services/status/status';
import {useBottomNavigationPadding} from '../hooks/useBottomNavigationPadding';
import {useResponsive} from '../hooks/useResponsive';
import {formatTimeAgo} from '../utils/formatTimeToDistance';

export function StatusScreen() {
  const {userData} = useAuth();
  const {paddingBottom} = useBottomNavigationPadding();
  const {isSmallScreen, horizontalPadding, spacing} = useResponsive();
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusItems, setStatusItems] = useState<UnifiedStatusItem[]>([]);
  const [selectedBulk, setSelectedBulk] = useState<any | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterOptions = [
    // Filtros por tipo
    'APENAS OPORTUNIDADES',
    'APENAS INDICAÇÕES',
    'APENAS LOTES EM MASSA',
    // Separador visual (não será usado como filtro real)
    '---',
    // Filtros por status
    'PENDENTE CONTATO',
    'CONTATO REALIZADO',
    'INICIO DE PROPOSTA',
    'PROPOSTA APRESENTADA',
    'AGUARDANDO CLIENTE',
    'AGUARDANDO PAGAMENTO',
    'FECHADO',
    'NÃO FECHADO',
    'NÃO INTERESSOU',
    'SEGURO RECUSADO',
  ];

  // Atualizar os listeners para já formatar o campo updatedAt e ordenar os itens
  useEffect(() => {
    if (!userData?.uid) return;

    setIsLoading(true);

    const db = getFirestore();
    const indicationsRef = collection(db, 'indications');
    const opportunitiesRef = collection(db, 'opportunities');
    const packagedIndicationsRef = firestore().collection(
      'packagedIndications',
    );

    const indicationsQuery = query(
      indicationsRef,
      where('indicator_id', '==', userData.uid),
    );
    const opportunitiesQuery = query(
      opportunitiesRef,
      where('indicator_id', '==', userData.uid),
    );
    const packagedIndicationsQuery = packagedIndicationsRef.where(
      'indicator_id',
      '==',
      userData.uid,
    );

    let allIndications: any[] = [];
    let allOpportunities: any[] = [];
    let allBulk: any[] = [];

    const updateAndSort = () => {
      // Junta tudo e ordena pelo updatedAtOriginal (timestamp)
      const all = [...allIndications, ...allOpportunities, ...allBulk];
      all.sort((a, b) => {
        const aTime = a.updatedAtOriginal?.seconds
          ? a.updatedAtOriginal.seconds * 1000
          : a.updatedAtOriginal?.toDate?.()?.getTime?.() ||
            a.createdAt?.seconds * 1000 ||
            a.createdAt?.toDate?.()?.getTime?.() ||
            0;
        const bTime = b.updatedAtOriginal?.seconds
          ? b.updatedAtOriginal.seconds * 1000
          : b.updatedAtOriginal?.toDate?.()?.getTime?.() ||
            b.createdAt?.seconds * 1000 ||
            b.createdAt?.toDate?.()?.getTime?.() ||
            0;
        return bTime - aTime;
      });
      setStatusItems(all);
      setIsLoading(false);
    };

    const unsubIndications = onSnapshot(indicationsQuery, snapshot => {
      allIndications = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatTimeAgo(data.updatedAt || data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt || data.createdAt,
            type: 'indication' as const,
            trash: data.trash,
            archived: data.archived,
          };
        })
        .filter(item => item.trash !== true && item.archived !== true);
      updateAndSort();
    });

    const unsubOpportunities = onSnapshot(opportunitiesQuery, snapshot => {
      allOpportunities = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatTimeAgo(data.updatedAt || data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt || data.createdAt,
            type: 'opportunity' as const,
            trash: data.trash,
            archived: data.archived,
          };
        })
        .filter(item => item.trash !== true && item.archived !== true);
      updateAndSort();
    });

    const unsubPackaged = packagedIndicationsQuery.onSnapshot(snapshot => {
      allBulk = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: 'Lote em massa',
            status:
              data.status ||
              (data.progress === 100 ? 'Concluído' : 'Em Andamento'),
            product: `${data.total || data.indications?.length || 0} indicações`,
            updatedAt: formatTimeAgo(data.updatedAt || data.createdAt),
            indicator_id: data.indicator_id,
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt || data.createdAt,
            type: 'bulk' as const,
            indications: data.indications || [],
            progress: data.progress || 0,
            total: data.total || data.indications?.length || 0,
            processed: data.processed || 0,
            packagedIndicationId: data.packagedIndicationId,
            unitName: data.unitName,
            archived: data.archived,
          };
        })
        .filter(item => item.archived !== true);
      updateAndSort();
    });

    return () => {
      unsubIndications();
      unsubOpportunities();
      unsubPackaged();
    };
  }, [userData?.uid]);

  // Função do Pull Refresh
  const onRefresh = useCallback(async () => {
    console.log('Pull refresh iniciado na StatusScreen');
    setRefreshing(true);
    try {
      // Força uma recarga dos dados do status
      if (userData?.uid) {
        // Força uma nova consulta para atualizar os dados
        const db = getFirestore();
        const indicationsRef = collection(db, 'indications');
        const opportunitiesRef = collection(db, 'opportunities');
        const packagedIndicationsRef = firestore().collection(
          'packagedIndications',
        );

        const indicationsQuery = query(
          indicationsRef,
          where('indicator_id', '==', userData.uid),
        );
        const opportunitiesQuery = query(
          opportunitiesRef,
          where('indicator_id', '==', userData.uid),
        );
        const packagedIndicationsQuery = packagedIndicationsRef.where(
          'indicator_id',
          '==',
          userData.uid,
        );

        // Executa as consultas para forçar atualização
        await Promise.all([
          indicationsQuery.get(),
          opportunitiesQuery.get(),
          packagedIndicationsQuery.get(),
        ]);

        console.log('Dados de status atualizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados de status:', error);
    } finally {
      setRefreshing(false);
      console.log('Pull refresh finalizado na StatusScreen');
    }
  }, [userData?.uid]);

  // Filtrar dados baseado na busca e filtros selecionados
  const filteredData = filterStatusItems(statusItems, search, selectedFilters);

  // Calcular estatísticas
  const stats = getStatusStats(statusItems);

  const handleSelectFilter = (option: string) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter(item => item !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
  };

  // Função para limitar texto com "..."
  const limitText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FECHADO':
        return colors.green;
      case 'NÃO FECHADO':
        return colors.red;
      case 'AGUARDANDO CLIENTE':
        return colors.primary_purple;
      case 'AGUARDANDO PAGAMENTO':
        return colors.orange;
      case 'CONTATO REALIZADO':
        return colors.primary_purple;
      case 'PENDENTE CONTATO':
        return colors.orange;
      case 'NÃO INTERESSOU':
        return colors.red;
      case 'INICIO DE PROPOSTA':
        return colors.primary_purple;
      case 'PROPOSTA APRESENTADA':
        return colors.primary_purple;
      case 'SEGURO RECUSADO':
        return colors.red;
      default:
        return colors.black;
    }
  };

  // Função para obter cor de fundo do status
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'FECHADO':
        return '#dcfce7';
      case 'NÃO FECHADO':
        return '#fee2e2';
      case 'AGUARDANDO PAGAMENTO':
        return '#fed7aa';
      case 'AGUARDANDO CLIENTE':
        return '#E6DBFF';
      case 'CONTATO REALIZADO':
        return '#E6DBFF';
      case 'PENDENTE CONTATO':
        return '#fed7aa';
      case 'NÃO INTERESSOU':
        return '#fee2e2';
      case 'INICIO DE PROPOSTA':
        return '#E6DBFF';
      case 'PROPOSTA APRESENTADA':
        return '#E6DBFF';
      case 'SEGURO RECUSADO':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  };

  const renderListHeader = () => (
    <>
      {/* Header */}
      <View
        className={`items-center flex-row justify-between w-full ${isSmallScreen ? 'mt-8' : 'mt-2'}`}>
        <BackButton
          color={colors.tertiary_purple}
          borderColor={colors.tertiary_purple}
        />
        <Text
          className={`text-tertiary_purple font-bold ${isSmallScreen ? 'text-2xl' : 'text-3xl'} mr-6`}>
          Status
        </Text>
        <View>
          <Text></Text>
        </View>
      </View>

      {/* Barra de Pesquisa */}
      <View
        className={`flex-row items-center w-full bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4 ${isSmallScreen ? 'h-14 mt-6' : 'h-16 mt-8'}`}>
        <Ionicons
          name="search"
          size={isSmallScreen ? 20 : 24}
          color={colors.white}
          className="absolute left-5"
        />

        <TextInput
          className={`pl-16 pr-5 flex-1 text-white font-regular ${isSmallScreen ? 'text-base' : 'text-lg'}`}
          placeholderTextColor={colors.white}
          onChangeText={setSearch}
          value={search}
          placeholder="Buscar..."
        />

        <TouchableOpacity
          onPress={() => setShowFilter(!showFilter)}
          className="pr-4">
          <FontAwesome6
            name={showFilter ? 'xmark' : 'sliders'}
            size={isSmallScreen ? 20 : 24}
            color={colors.white}
          />
        </TouchableOpacity>

        <FilterDropdown
          visible={showFilter}
          onClose={() => setShowFilter(false)}
          options={filterOptions}
          selectedOptions={selectedFilters}
          onSelectOption={handleSelectFilter}
          position={{
            top: isSmallScreen ? 140 : 160,
            right: isSmallScreen ? horizontalPadding : 20,
          }}
        />
      </View>

      {/* Cards de Estatísticas */}
      <View
        className={`${isSmallScreen ? 'mt-3 mb-1' : 'mt-4 mb-1'} w-full ${isSmallScreen ? 'h-16' : 'h-20'}`}
        style={{marginBottom: isSmallScreen ? 10 : 14}}>
        <View className="flex-row justify-between gap-2 px-1 w-full">
          {[
            {label: 'Pendente', value: stats['PENDENTE CONTATO'] || 0},
            {
              label: 'Em contato',
              value:
                (stats['PROPOSTA APRESENTADA'] || 0) +
                (stats['CONTATO REALIZADO'] || 0) +
                (stats['AGUARDANDO CLIENTE'] || 0) +
                (stats['INICIO DE PROPOSTA'] || 0) +
                (stats['AGUARDANDO PAGAMENTO'] || 0),
            },
            {label: 'Fechados', value: stats['FECHADO'] || 0},
            {
              label: 'Não fechado',
              value:
                (stats['NÃO FECHADO'] || 0) +
                (stats['SEGURO RECUSADO'] || 0) +
                (stats['NÃO INTERESSOU'] || 0),
            },
          ].map((item, index) => (
            <View
              key={index}
              className={`bg-white rounded-xl shadow-lg flex-1 ${isSmallScreen ? 'p-2' : 'p-3'}`}
              style={{
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <Text
                className={`${isSmallScreen ? 'text-lg' : 'text-2xl'} font-bold text-tertiary_purple text-center`}>
                {item.value}
              </Text>
              <Text
                className={`${isSmallScreen ? 'text-xs' : 'text-xs'} text-black text-center mt-1`}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderBulkModal = () => {
    if (!selectedBulk) return null;
    const sentDate = selectedBulk.createdAt;
    let relativeDate = '';
    if (sentDate) {
      relativeDate = formatTimeAgo(sentDate);
    }
    const progress = Math.min(Number(selectedBulk.progress) || 0, 100);
    return (
      <Modal
        visible={showBulkModal}
        onRequestClose={() => setShowBulkModal(false)}
        transparent={true}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <KeyboardAvoidingView
            className="flex-1 justify-center items-center px-2"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="w-full max-w-sm bg-white rounded-2xl border-2 border-blue px-4 py-6">
              <View className="justify-between items-center flex-row mb-2">
                <BackButton
                  onPress={() => setShowBulkModal(false)}
                  color={colors.tertiary_purple}
                  borderColor={colors.tertiary_purple}
                />
                <Text className="text-tertiary_purple font-bold text-2xl absolute left-1/2 -translate-x-1/2">
                  Detalhes do Lote
                </Text>
              </View>
              <ScrollView
                style={{maxHeight: 450}}
                contentContainerStyle={{
                  paddingBottom: 8,
                  paddingHorizontal: 2,
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 15,
                    marginBottom: 8,
                    fontWeight: 'bold',
                  }}>
                  {relativeDate ? `Enviado ${relativeDate}` : ''}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.tertiary_purple,
                    marginBottom: 6,
                  }}>
                  Status:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedBulk.status}
                  </Text>
                </Text>
                {/* Barra de progresso visual */}
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{
                      color: colors.tertiary_purple,
                      marginBottom: 2,
                      fontWeight: 'bold',
                    }}>
                    Progresso:
                  </Text>
                  <View
                    style={{
                      height: 14,
                      backgroundColor: '#E6DBFF',
                      borderRadius: 8,
                      overflow: 'hidden',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: colors.tertiary_purple,
                        borderRadius: 8,
                      }}
                    />
                  </View>
                  <Text
                    style={{color: colors.black, fontSize: 13, marginTop: 2}}>
                    {progress}%
                  </Text>
                </View>
                <Text
                  style={{color: colors.tertiary_purple, fontWeight: 'bold'}}>
                  Total de indicações:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedBulk.total}
                  </Text>
                </Text>
                <Text
                  style={{color: colors.tertiary_purple, fontWeight: 'bold'}}>
                  Processadas:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedBulk.processed}
                  </Text>
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    color: colors.tertiary_purple,
                  }}>
                  Indicações:
                </Text>
                {selectedBulk.indications &&
                selectedBulk.indications.length > 0 ? (
                  <ScrollView style={{maxHeight: 120}}>
                    {selectedBulk.indications.map((item: any, idx: number) => (
                      <Text
                        key={idx}
                        style={{fontSize: 13, color: colors.black}}>
                        - {item.name} {item.phone ? `(${item.phone})` : ''}
                      </Text>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={{color: colors.black}}>
                    Nenhuma indicação encontrada neste lote.
                  </Text>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  const renderDetailModal = () => {
    if (!selectedDetail) return null;
    const relativeDate = selectedDetail.updatedAt || '';
    return (
      <Modal
        visible={showDetailModal}
        onRequestClose={() => setShowDetailModal(false)}
        transparent={true}>
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <KeyboardAvoidingView
            className="flex-1 justify-center items-center px-2"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="w-full max-w-sm bg-white rounded-2xl border-2 border-blue px-4 py-6">
              <View className="justify-between items-center flex-row mb-2">
                <BackButton
                  onPress={() => setShowDetailModal(false)}
                  color={colors.tertiary_purple}
                  borderColor={colors.tertiary_purple}
                />
                <Text className="text-tertiary_purple font-bold text-2xl absolute left-1/2 -translate-x-1/2">
                  Detalhes
                </Text>
              </View>
              <ScrollView
                style={{maxHeight: 400}}
                contentContainerStyle={{
                  paddingBottom: 12,
                  paddingHorizontal: 2,
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: 15,
                    marginBottom: 8,
                    fontWeight: 'bold',
                  }}>
                  {relativeDate}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.tertiary_purple,
                    marginBottom: 6,
                  }}>
                  Nome:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedDetail.name}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.tertiary_purple,
                    marginBottom: 6,
                  }}>
                  Produto:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedDetail.product}
                  </Text>
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.tertiary_purple,
                    marginBottom: 6,
                  }}>
                  Status:{' '}
                  <Text style={{fontWeight: 'normal', color: colors.black}}>
                    {selectedDetail.status}
                  </Text>
                </Text>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      {isLoading ? (
        <StatusScreenSkeleton />
      ) : (
        <View style={{flex: 1, paddingHorizontal: horizontalPadding, paddingTop: isSmallScreen ? 16 : 20}}>
          {/* Header */}
          {renderListHeader()}

          {/* Lista de Status */}
          <View style={{flex: 1, marginBottom: isSmallScreen ? paddingBottom * 0.3 : paddingBottom * 0.5}}>
            {filteredData.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesome6
                  name="clipboard-list"
                  size={isSmallScreen ? 50 : 60}
                  color={colors.tertiary_purple}
                  style={{marginBottom: 16, opacity: 0.7}}
                />
                <Text
                  className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-bold text-tertiary_purple mb-2 text-center`}>
                  Nenhum resultado encontrado
                </Text>
                <Text
                  className={`${isSmallScreen ? 'text-xs' : 'text-sm'} text-black text-center`}>
                  {search || selectedFilters.length > 0
                    ? 'Nenhum item corresponde aos filtros aplicados. Tente ajustar sua busca.'
                    : 'Você ainda não possui oportunidades ou indicações registradas. Quando você indicar alguém, elas aparecerão aqui!'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                  if (item.type === 'bulk') {
                    // Card especial para indicação em massa
                    const sentDate = item.createdAt;
                    let relativeDate = '';
                    if (sentDate) {
                      relativeDate = formatTimeAgo(sentDate);
                    }
                    return (
                      <TouchableOpacity
                        className="bg-white rounded-xl mb-2"
                        activeOpacity={0.7}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: {width: 2, height: 2},
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 5,
                        }}
                        onPress={() => {
                          setSelectedBulk(item);
                          setShowBulkModal(true);
                        }}>
                        <View
                          className={`flex-row items-center ${isSmallScreen ? 'p-3' : 'p-4'}`}>
                          {/* Avatar */}
                          <View
                            className={`${isSmallScreen ? 'w-10 h-10' : 'w-12 h-12'} rounded-full items-center justify-center mr-4`}
                            style={{backgroundColor: colors.primary_purple}}>
                            <FontAwesome6
                              name="layer-group"
                              size={isSmallScreen ? 18 : 22}
                              color={colors.white}
                            />
                          </View>
                          {/* Informações */}
                          <View className="flex-1">
                            <View className="flex-row items-center justify-between mb-1">
                              <Text
                                className={`text-black font-bold ${isSmallScreen ? 'text-sm' : 'text-base'} flex-1`}>
                                Lote em massa
                              </Text>
                              <Text
                                className={`${isSmallScreen ? 'text-xs' : 'text-xs'} text-black ml-2`}>
                                {relativeDate}
                              </Text>
                            </View>
                            <Text
                              className={`text-black ${isSmallScreen ? 'text-xs' : 'text-sm'} mb-2`}>
                              {item.product}
                            </Text>
                            <View className="flex-row items-center justify-between">
                              <View
                                className="self-start px-3 py-1 w-auto rounded-full"
                                style={{
                                  backgroundColor:
                                    item.status === 'Concluído'
                                      ? '#dcfce7'
                                      : '#E6DBFF',
                                }}>
                                <Text
                                  className={`${isSmallScreen ? 'text-xs' : 'text-xs'} font-semibold`}
                                  style={{
                                    color:
                                      item.status === 'Concluído'
                                        ? colors.green
                                        : colors.primary_purple,
                                  }}>
                                  {item.status}
                                </Text>
                              </View>
                              {/* Badge para identificar o tipo */}
                              <View
                                className="px-2 py-1 rounded-md"
                                style={{backgroundColor: '#f3e8ff'}}>
                                <Text
                                  className={`${isSmallScreen ? 'text-xs' : 'text-xs'} font-medium`}
                                  style={{color: colors.primary_purple}}>
                                  Indicação em massa
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      className="bg-white rounded-xl mb-2"
                      activeOpacity={0.7}
                      style={{
                        shadowColor: '#000',
                        shadowOffset: {width: 2, height: 2},
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 5, // necessário para Android
                      }}
                      onPress={() => {
                        setSelectedDetail(item);
                        setShowDetailModal(true);
                      }}>
                      <View
                        className={`flex-row items-center ${isSmallScreen ? 'p-3' : 'p-4'}`}>
                        {/* Avatar */}
                        <View
                          className={`${isSmallScreen ? 'w-10 h-10' : 'w-12 h-12'} rounded-full items-center justify-center mr-4`}
                          style={{backgroundColor: colors.tertiary_purple}}>
                          <Text
                            className={`text-white font-bold ${isSmallScreen ? 'text-xs' : 'text-sm'}`}>
                            {getInitials(item.name)}
                          </Text>
                        </View>

                        {/* Informações */}
                        <View className="flex-1">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text
                              className={`text-black font-bold ${isSmallScreen ? 'text-sm' : 'text-base'} flex-1`}>
                              {limitText(item.name)}
                            </Text>
                            <Text
                              className={`${isSmallScreen ? 'text-xs' : 'text-xs'} text-black ml-2`}>
                              {item.updatedAt}
                            </Text>
                          </View>
                          <Text
                            className={`text-black ${isSmallScreen ? 'text-xs' : 'text-sm'} mb-2`}>
                            {item.product}
                          </Text>
                          <View className="flex-row items-center justify-between">
                            <View
                              className="self-start px-3 py-1 w-auto rounded-full"
                              style={{
                                backgroundColor: getStatusBgColor(item.status),
                              }}>
                              <Text
                                className={`${isSmallScreen ? 'text-xs' : 'text-xs'} font-semibold`}
                                style={{color: getStatusColor(item.status)}}>
                                {item.status}
                              </Text>
                            </View>
                            {/* Badge para identificar o tipo */}
                            <View
                              className="px-2 py-1 rounded-md"
                              style={{
                                backgroundColor:
                                  item.type === 'opportunity'
                                    ? '#dcfce7'
                                    : '#dbeafe',
                              }}>
                              <Text
                                className={`${isSmallScreen ? 'text-xs' : 'text-xs'} font-medium`}
                                style={{
                                  color:
                                    item.type === 'opportunity'
                                      ? '#16a34a'
                                      : '#2563eb',
                                }}>
                                {item.type === 'opportunity'
                                  ? 'Oportunidade'
                                  : 'Indicação'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#820AD1']}
                    tintColor="#820AD1"
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                  flexGrow: 1,
                }}
              />
            )}
          </View>
          {/* Modal de detalhes do lote em massa */}
          {renderBulkModal()}
          {/* Modal de detalhes de indicação/oportunidade */}
          {renderDetailModal()}
        </View>
      )}
    </ImageBackground>
  );
}
