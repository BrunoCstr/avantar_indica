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
  const [filter, setFilter] = useState<'approved' | 'refused'>('approved');
  const [dataApproved, setDataApproved] = useState([]);
  const [dataRefused, setDataRefused] = useState([]);
  const navigation = useNavigation();

  const approvedData = [
    {id:1 , indication_name: 'Bruno de Castro', status: 'Aprovado'},
    {id:2 ,indication_name: 'Alan Turing', status: 'Aprovado'},
    {id:3 ,indication_name: 'Neymar da Silva', status: 'Aprovado'},
    {id:4 ,indication_name: 'Romário Silva', status: 'Aprovado'},
    {id:5 ,indication_name: 'Edmundo Santos', status: 'Aprovado'},
    {id:6 ,indication_name: 'Pablo Vegetti', status: 'Aprovado'},
    {id:7 ,indication_name: 'Ada Lovelace', status: 'Aprovado'},
    {id:8 ,indication_name: 'Bill Gates', status: 'Aprovado'},
  ];

  const refusedData = [
    {id:10 ,indication_name: 'Vasco da Gama', status: 'Recusada'},
    {id:11 ,indication_name: 'Elon Musk', status: 'Recusada'},
    {id:12 ,indication_name: 'Mark Zuckerberg', status: 'Recusada'},
    {id:13 ,indication_name: 'Maradona', status: 'Recusada'},
    {id:14 ,indication_name: 'Pelé', status: 'Recusada'},
    {id:15 ,indication_name: 'Kauan Martins', status: 'Recusada'},
    {id:16 ,indication_name: 'Lucas Neves', status: 'Recusada'},
    {id:17 ,indication_name: 'Davi Teixeira', status: 'Recusada'},
    {id:18 ,indication_name: 'Fagundes Geraldo', status: 'Recusada'},
  ];

  const data = filter === 'approved' ? approvedData : refusedData;

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
            className="pl-16 pr-5"
            onChangeText={setSearch}
            value={search}
            placeholder="Buscar..."
          />
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
            onPress={() => setFilter('approved')}
          />
          <Button
            text="RECUSADAS"
            backgroundColor="tertiary_lillac"
            textColor="white"
            fontWeight="bold"
            fontSize={22}
            width={160}
            height={55}
            onPress={() => setFilter('refused')}
          />
        </View>

        <View className="bg-white w-full rounded-2xl shadow-md mt-2 h-[21.875rem]">
          <View className="flex-row justify-between bg-blue p-3 pl-10 pr-10 rounded-t-2xl w-full">
            <Text className="text-3xl font-bold text-black">Nome</Text>
            <Text className="text-3xl font-bold text-black">Status</Text>
          </View>

          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.indication_name}
            renderItem={({item}) => (
              <View className="flex-row justify-between pl-10 pr-14 pt-1">
                <Text className="text-black font-bold">
                  {item.indication_name}
                </Text>
                <Text
                  className="font-bold"
                  style={{
                    color:
                      item.status === 'Aprovado' ? colors.green : colors.red,
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
