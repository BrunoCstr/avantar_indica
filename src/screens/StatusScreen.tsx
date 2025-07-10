import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {BackButton} from '../components/BackButton';
import {FilterDropdown} from '../components/FilterDropdown';
import {StatusScreenSkeleton} from '../components/skeletons/StatusScreenSkeleton';
import {useAuth} from '../contexts/Auth';
import {
  getAllStatusItemsByUserId,
  filterStatusItems,
  getStatusStats,
  StatusItem,
} from '../services/status/status';
import {useBottomNavigationPadding} from '../hooks/useBottomNavigationPadding';

export function StatusScreen() {
  const {userData} = useAuth();
  const {paddingBottom} = useBottomNavigationPadding();
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);

  const filterOptions = [
    // Filtros por tipo
    'APENAS OPORTUNIDADES',
    'APENAS INDICAÇÕES',
    // Separador visual (não será usado como filtro real)
    '---',
    // Filtros por status
    'FECHADO',
    'NÃO FECHADO',
    'AGUARDANDO CLIENTE',
    'CONTATO REALIZADO',
    'PENDENTE CONTATO',
    'NÃO INTERESSOU',
    'INICIO DE PROPOSTA',
    'PROPOSTA APRESENTADA',
    'SEGURO RECUSADO',
  ];

  // Carregar oportunidades e indicações do usuário
  useEffect(() => {
    const loadStatusItems = async () => {
      if (!userData?.uid) return;
      
      try {
        setIsLoading(true);
        const allStatusItems = await getAllStatusItemsByUserId(userData.uid);
        setStatusItems(allStatusItems);
      } catch (error) {
        console.error('Erro ao carregar dados de status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatusItems();
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

  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      {isLoading ? (
        <StatusScreenSkeleton />
      ) : (
        <View 
          className="flex-1 px-5 pt-4"
          style={{paddingBottom}}>
          {/* Header */}
          <View className="items-center flex-row justify-between w-full mt-12">
            <BackButton
              color={colors.tertiary_purple}
              borderColor={colors.tertiary_purple}
            />
            <Text className="text-tertiary_purple font-bold text-3xl mr-6">
              Status
            </Text>
            <View>
              <Text></Text>
            </View>
          </View>

          {/* Barra de Pesquisa */}
          <View className="flex-row items-center w-full h-16 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4 mt-8">
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

            <TouchableOpacity
              onPress={() => setShowFilter(!showFilter)}
              className="pr-4">
              <FontAwesome6
                name={showFilter ? 'xmark' : 'sliders'}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>

            <FilterDropdown
              visible={showFilter}
              onClose={() => setShowFilter(false)}
              options={filterOptions}
              selectedOptions={selectedFilters}
              onSelectOption={handleSelectFilter}
              position={{ top: 180, right: 20 }}
            />
          </View>

          <View className="mt-4 mb-1 w-full h-20">
            <View className="flex-row justify-between gap-3 px-1 w-full space-x-2">
              {[
                {label: 'Pendente', value: stats['PENDENTE CONTATO'] || 0},
                {
                  label: 'Em contato',
                  value:
                    (stats['PROPOSTA APRESENTADA'] || 0) +
                    (stats['CONTATO REALIZADO'] || 0) +
                    (stats['AGUARDANDO CLIENTE'] || 0) +
                    (stats['INICIO DE PROPOSTA'] || 0),
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
                  className="bg-white rounded-xl p-3 shadow-lg flex-1"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <Text className="text-2xl font-bold text-tertiary_purple text-center">
                    {item.value}
                  </Text>
                  <Text className="text-xs text-black text-center mt-1">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Lista de Status */}
          <View className="rounded-2xl flex-1 overflow-hidden" style={{}}>
            {filteredData.length === 0 ? (
              <View className="flex-1 justify-center items-center p-10">
                <FontAwesome6
                  name="clipboard-list"
                  size={60}
                  color={colors.tertiary_purple}
                  style={{marginBottom: 16, opacity: 0.7}}
                />
                <Text className="text-lg font-bold text-tertiary_purple mb-2 text-center">
                  Nenhum resultado encontrado
                </Text>
                <Text className="text-sm text-black text-center">
                  {search || selectedFilters.length > 0 
                    ? 'Nenhum item corresponde aos filtros aplicados. Tente ajustar sua busca.'
                    : 'Você ainda não possui oportunidades ou indicações registradas. Quando você indicar alguém, elas aparecerão aqui!'
                  }
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredData}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{paddingVertical: 8, paddingBottom: 20}}
                renderItem={({item}) => (
                  <TouchableOpacity
                    className="bg-white rounded-xl mb-2 mx-2"
                    activeOpacity={0.7}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 2, height: 2},
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 5, // necessário para Android
                    }}>
                    <View className="flex-row items-center p-4">
                      {/* Avatar */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{backgroundColor: colors.tertiary_purple}}>
                        <Text className="text-white font-bold text-sm">
                          {getInitials(item.name)}
                        </Text>
                      </View>

                      {/* Informações */}
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-black font-bold text-base flex-1">
                            {limitText(item.name)}
                          </Text>
                          <Text className="text-xs text-black ml-2">
                            {item.updatedAt}
                          </Text>
                        </View>
                        <Text className="text-black text-sm mb-2">
                          {item.product}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <View
                            className="self-start px-3 py-1 w-auto rounded-full"
                            style={{
                              backgroundColor: getStatusBgColor(item.status),
                            }}>
                            <Text
                              className="text-xs font-semibold"
                              style={{color: getStatusColor(item.status)}}>
                              {item.status}
                            </Text>
                          </View>
                          {/* Badge para identificar o tipo */}
                          <View
                            className="px-2 py-1 rounded-md"
                            style={{
                              backgroundColor: item.type === 'opportunity' ? '#dcfce7' : '#dbeafe',
                            }}>
                            <Text
                              className="text-xs font-medium"
                              style={{
                                color: item.type === 'opportunity' ? '#16a34a' : '#2563eb',
                              }}>
                              {item.type === 'opportunity' ? 'Oportunidade' : 'Indicação'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View className="h-1" />}
              />
            )}
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
