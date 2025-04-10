import React from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../styles/colors';
import images from '../data/images';
import {ScrollView} from 'react-native-gesture-handler';

const clienteIndicadorRules = [
  '• Pode indicar amigos e familiares para contratação de seguros.',
  '• Recebe cashback em forma de desconto na renovação ou contratação de novos seguros.',
  '• Não é possível sacar dinheiro, apenas trocar por benefícios.',
  '• Cadastro simples, com vinculação a uma unidade.',
];

const parceiroIndicadorRules = [
  '• Indicadores profissionais autorizados por uma unidade franqueada.',
  '• Pode indicar normalmente e resgatar valores em dinheiro, com valor mínimo de saque equivalente a meio salário mínimo.',
  '• Pode cadastrar sub-indicadores (ex: equipe de vendas) com permissões específicas.',
];

const Recompensas = [
  '• As recompensas variam de acordo com o produto indicado.',
  '• Cada produto possui um valor de recompensa diferente.',
  '• Franqueados podem personalizar os valores de cashback para campanhas específicas.',
  '• O sistema aceita personalização de recompensas tanto para clientes quanto para parceiros.',
];

export function Rules() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={images.bg_status}
      className="flex-1"
      resizeMode="cover">
      <ScrollView contentContainerStyle={{paddingBottom: 30}}>
        <View className="flex-1 ml-8 mr-8 mt-20 justify-start items-center">
          <View className="items-center flex-row relative w-full">
            <TouchableOpacity
              className="border-[1px] rounded-md border-white h-15 w-15 p-2 absolute "
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}>
              <Entypo name="arrow-long-left" size={21} color={colors.white} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-3xl mx-auto">
              Regras
            </Text>
          </View>

          <View className="flex-1 mt-8">
            <View className="flex-row items-center justify-center gap-3">
              <Entypo name="text-document" size={21} color={colors.white} />
              <Text className="text-white font-bold text-2xl">
                Regras do Aplicativo
              </Text>
            </View>

            <View>
              <Text className="text-white text-base font-regular mt-5 text-center">
                Bem-vindo(a) ao nosso sistema de indicações! Aqui estão as
                principais regras e informações para você entender como tudo
                funciona:
              </Text>
            </View>

            <View>
              <Text className="text-blue text-base font-bold mt-5 text-start">
                Tipos de Usuários
              </Text>
              <Text className="text-white text-base font-regular text-start">
                Nosso app possui dois tipos de usuários:
              </Text>

              <Text className="text-blue text-base font-bold mt-5 text-start">
                Cliente Indicador
              </Text>
              {clienteIndicadorRules.map((rule, index) => (
                <Text
                  key={index}
                  className="text-white text-base font-regular text-start">
                  {rule}
                </Text>
              ))}

              <Text className="text-blue text-base font-bold mt-5 text-start">
                Parceiro Indicador
              </Text>
              {parceiroIndicadorRules.map((rule, index) => (
                <Text
                  key={index}
                  className="text-white text-base font-regular text-start">
                  {rule}
                </Text>
              ))}

              <Text className="text-blue text-base font-bold mt-5 text-start">
                Recompensas
              </Text>
              {Recompensas.map((rule, index) => (
                <Text
                  key={index}
                  className="text-white text-base font-regular text-start">
                  {rule}
                </Text>
              ))}
            </View>

            <View>
              <View className="flex-row items-center gap-3 mt-10">
                <Entypo
                  name="info-with-circle"
                  size={21}
                  color={colors.white}
                />
                <Text className="text-blue text-base font-bold text-start">
                  Minhas Informações
                </Text>
              </View>

              <View>
                <Text className="text-white text-base font-regular text-start">Quer saber seu tipo de cadastro?</Text>
                <Text className="text-white text-base font-regular text-start">Acesse o menu Perfil → Minhas Informações</Text>
                <Text className="text-white text-base font-regular text-start">Lá você confere se é um Cliente Indicador ou um Parceiro Indicador, além de outros dados importantes.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
