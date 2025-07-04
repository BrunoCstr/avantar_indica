import React, {useState} from 'react';
import {ImageBackground, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {BackButton} from '../components/BackButton';
import {FilterDropdown} from '../components/FilterDropdown';
import {StatusScreenSkeleton} from '../components/skeletons/StatusScreenSkeleton';

export function StatusScreen() {
  const [search, setSearch] = useState('');

  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false); 

  // Temporario até integrar o Backend
  // setTimeout(() => {
  //   setIsLoading(false);
  // }, 1000)

  const filterOptions = [
    'FECHADO',
    'NÃO FECHADO',
    'AGUARDANDO CLIENTE',
    'CONTATO REALIZADO',
    'PENDENTE CONTATO',
    'NÃO INTERESSOU',
    'INICIO DE PROPOSTA',
    'PROPOSTA APRESENTADA',
  ];

  const dataSimulation = [
    {id: 1, indication_name: 'Bruno de Castro', status: 'FECHADO'},
    {id: 2, indication_name: 'Alan Turing', status: 'FECHADO'},
    {id: 3, indication_name: 'Neymar da Silva', status: 'FECHADO'},
    {id: 4, indication_name: 'Romário Silva', status: 'PROPOSTA APRESENTADA'},
    {id: 5, indication_name: 'Edmundo Santos', status: 'PROPOSTA APRESENTADA'},
    {id: 6, indication_name: 'Pablo Vegetti', status: 'PROPOSTA APRESENTADA'},
    {id: 7, indication_name: 'Ada Lovelace', status: 'AGUARDANDO CLIENTE'},
    {id: 8, indication_name: 'Bill Gates', status: 'INICIO DE PROPOSTA'},
    {id: 10, indication_name: 'Vasco da Gama', status: 'INICIO DE PROPOSTA'},
    {id: 11, indication_name: 'Elon Musk', status: 'INICIO DE PROPOSTA'},
    {id: 12, indication_name: 'Mark Zuckerberg', status: 'AGUARDANDO CLIENTE'},
    {id: 13, indication_name: 'Maradona', status: 'NÃO FECHADO'},
    {id: 14, indication_name: 'Pelé', status: 'NÃO FECHADO'},
    {id: 15, indication_name: 'Kauan Martins', status: 'NÃO INTERESSOU'},
    {id: 16, indication_name: 'Lucas Neves', status: 'NÃO INTERESSOU'},
    {id: 17, indication_name: 'Davi Teixeira', status: 'NÃO INTERESSOU'},
    {id: 18, indication_name: 'Fagundes Geraldo', status: 'NÃO FECHADO'},
    {id: 19, indication_name: 'Antônio Fagundes', status: 'PENDENTE CONTATO'},
    {id: 20, indication_name: 'Machado de Assis', status: 'PENDENTE CONTATO'},
    {id: 21, indication_name: 'Patrick Bateman', status: 'PENDENTE CONTATO'},
    {id: 22, indication_name: 'Thomas Shelby', status: 'PENDENTE CONTATO'},
    {id: 23, indication_name: 'Arthur Shelby', status: 'CONTATO REALIZADO'},
    {id: 24, indication_name: 'Rick Grimes', status: 'CONTATO REALIZADO'},
    {id: 25, indication_name: 'Negan', status: 'CONTATO REALIZADO'},
    {id: 26, indication_name: 'Maggie Rhe', status: 'CONTATO REALIZADO'},
    {id: 27, indication_name: 'Josaci Oliveira', status: 'CONTATO REALIZADO'},
  ];

  const handleSelectFilter = (option: string) => {
    if (selectedFilters.includes(option)) {
      setSelectedFilters(selectedFilters.filter(item => item !== option));
    } else {
      setSelectedFilters([...selectedFilters, option]);
    }
  };

  const filteredData = dataSimulation.filter(item => {
    const matchStatus =
      selectedFilters.length > 0 ? selectedFilters.includes(item.status) : true;

    const matchSearch = item.indication_name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <ImageBackground
      source={images.bg_white}
      className="flex-1"
      resizeMode="cover">
      {isLoading ? (
        <StatusScreenSkeleton />
      ) : (
        <View className="flex-1 ml-5 mr-5 mb-10 justify-center items-center">
          <View className="items-center flex-row justify-between w-full">
            <BackButton
              color={colors.tertiary_purple}
              borderColor={colors.tertiary_purple}
            />
            <Text className="text-tertiary_purple font-bold text-3xl mr-6">
              Status
            </Text>
            <View>
              <Text></Text>
            </View>{' '}
            {/* Para o texto ficar no centro com o justify-between */}
          </View>

          <View className="flex-row items-center mt-10 w-full h-16 bg-tertiary_purple rounded-xl border-b-4 border-l-2 border-pink px-4">
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
            />
          </View>

          <View className="bg-transparent border-2 border-tertiary_purple items-center w-full rounded-2xl mt-4 h-[60%]">
            <View className="flex-row justify-between p-3 pl-10 pr-10 rounded-t-2xl w-full">
              <Text className="text-2xl font-bold text-tertiary_purple">
                Nome
              </Text>
              <Text className="text-2xl font-bold text-tertiary_purple">
                Status
              </Text>
            </View>

            <FlatList
              data={filteredData}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.indication_name}
              renderItem={({item}) => (
                <View className="justify-center items-center">
                  <View className="flex-row justify-between bg-transparent w-[93%] px-2 py-3 border-b-2 items-center border-tertiary_purple">
                    <Text className="text-black text-lg font-bold">
                      {item.indication_name}
                    </Text>
                    <Text
                      className="font-bold text-sm"
                      style={{
                        color:
                          item.status === 'FECHADO'
                            ? colors.green
                            : item.status === 'NÃO FECHADO'
                              ? colors.red
                              : colors.black,
                      }}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </ImageBackground>
  );
}
