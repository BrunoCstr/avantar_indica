import React, {useState} from 'react';
import {ImageBackground, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../data/images';
import {colors} from '../styles/colors';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {Button} from '../components/Button';

export function StatusScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<null | string>(null);
  const [data, setData] = useState(null);
  const navigation = useNavigation();

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

  const filteredData = dataSimulation.filter(item => {
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const matchSearch = item.indication_name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <ImageBackground
      source={images.bg_status}
      className="flex-1"
      resizeMode="cover">
      <View className="flex-1 ml-5 mr-5 mb-10 justify-center items-center">
        <View className="items-center flex-row relative w-full">
          <TouchableOpacity
            className="border-[1px] rounded-md border-white h-15 w-15 p-2 absolute "
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Wallet')}>
            <Entypo name="arrow-long-left" size={21} color={colors.white} />
          </TouchableOpacity>
          <Text className="text-white font-bold text-3xl mx-auto">Status</Text>
        </View>

        <View className="flex-row items-center mt-10 w-full h-16 bg-white rounded-lg">
          <Ionicons
            name="search"
            size={24}
            color={colors.black}
            className="absolute left-5"
          />
          {/* Deixar para fazer a lógica de pesquisa por caractere quando tiver já integrado com o backend */}
          <TextInput
            className="pl-16 pr-5 flex-1"
            onChangeText={setSearch}
            value={search}
            placeholder="Buscar..."
          />
          <TouchableOpacity onPress={() => setStatusFilter(null)} className='pr-4'>
            <Ionicons name="reload" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-1 mt-2">
          <Button
            text="APROVADAS"
            backgroundColor="orange"
            textColor="white"
            fontWeight="bold"
            fontSize={22}
            width={160}
            height={55}
            onPress={() => setStatusFilter('FECHADO')}
          />
          <Button
            text="RECUSADAS"
            backgroundColor="tertiary_lillac"
            textColor="white"
            fontWeight="bold"
            fontSize={22}
            width={160}
            height={55}
            onPress={() => setStatusFilter('NÃO FECHADO')}
          />
        </View>

        <View className="bg-white w-full rounded-2xl shadow-md mt-2 h-[21.875rem]">
          <View className="flex-row justify-between bg-blue p-3 pl-10 pr-10 rounded-t-2xl w-full">
            <Text className="text-2xl font-bold text-black">Nome</Text>
            <Text className="text-2xl font-bold text-black">Status</Text>
          </View>

          <FlatList
            data={filteredData}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.indication_name}
            renderItem={({item}) => (
              <View className="flex-row justify-between pl-10 pr-10 pt-1">
                <Text className="text-black font-bold">
                  {item.indication_name}
                </Text>
                <Text
                  className="font-bold text-xs"
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
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
