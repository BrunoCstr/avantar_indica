import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ExpandableSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="rounded-lg mb-4 overflow-hidden">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="flex-row justify-between items-center px-4 py-3 bg-white">
        <Text className="text-black font-bold text-2xl">{title}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setExpanded(!expanded)}>
          <View className="bg-tertiary_purple rounded-full p-1">
            <AntDesign
              name={expanded ? 'minus' : 'plus'}
              size={20}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </Pressable>

      {expanded && (
        <View className="bg-transparent border-2 border-pink rounded-br-lg border-t-0 rounded-bl-lg px-4 py-3">
          {children}
        </View>
      )}
    </View>
  );
};

export interface CommissioningParameters {
  cashbackPerProduct: {
    auto: number;
    consorcio: number;
    empresarial: number;
    vida: number;
  };
  commissionPerProduct: {
    auto: number;
    consorcio: number;
    empresarial: number;
    vida: number;
  };
  defaultCashback: number;
  defaultCommission: number;
}

interface RulesComponentProps {
  title: string;
  titleDescription: string;
  description: string;
  titleDescription2: string;
  description2: string;
  rewards: string;
  titleDescription3: string;
  description3: string; 
  bonusParameters?: CommissioningParameters;
  unitName: string;
  updatedAt: string;
}

export function RulesComponent({
  title,
  titleDescription,
  description,
  titleDescription2,
  description2  ,
  titleDescription3,
  description3,
  rewards,
  bonusParameters,
  unitName,
  updatedAt,
}: RulesComponentProps) {

  // Função para formatar datas do Firestore ou objeto Timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp.toDate) {
      // Firestore Timestamp
      return timestamp.toDate().toLocaleDateString('pt-BR');
    }
    if (timestamp._seconds) {
      // Objeto bruto
      return new Date(timestamp._seconds * 1000).toLocaleDateString('pt-BR');
    }
    return String(timestamp);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 w-full">
      <ExpandableSection title={title}>
        {description2 ? (
          <>
            <Text className="text-white font-bold text-base">
              {titleDescription}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description}
            </Text>
            <Text className="text-white font-bold text-base">
              {titleDescription2}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description2}
            </Text>
            <Text className="text-blue font-bold text-base mt-3">
              {titleDescription3}
            </Text>
            <Text className="text-white font-regular text-sm">
              {description3}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-white font-bold text-base">
              {titleDescription}
            </Text>
            <Text className="text-white font-regular mt-1 text-sm">
              {description}
            </Text>
          </>
        )}
      </ExpandableSection>

      <ExpandableSection title="RECOMPENSAS">
        <Text className="text-white font-regular text-sm">
        {rewards}
        </Text>
      </ExpandableSection>

      <ExpandableSection title="BONIFICAÇÃO">
        <View>
          <Text className="text-white font-bold text-lg">
            Parâmetros de bonificação
          </Text>
          <Text className="text-blue font-bold">
            {unitName}
          </Text>
          <Text className="text-blue font-bold text-base mt-2">
            Cashback por produto:
          </Text>
          {bonusParameters?.cashbackPerProduct && (
            <View className='flex-col'>
              <Text className='text-white font-regular text-sm'>Auto: {bonusParameters?.cashbackPerProduct?.auto}</Text>
              <Text className='text-white font-regular text-sm'>Consórcio: {bonusParameters?.cashbackPerProduct?.consorcio}</Text>
              <Text className='text-white font-regular text-sm'>Empresarial: {bonusParameters?.cashbackPerProduct?.empresarial}</Text>
              <Text className='text-white font-regular text-sm'>Vida: {bonusParameters?.cashbackPerProduct?.vida}</Text>
            </View>
          )}
          <Text className="text-blue font-bold text-base mt-2">
            Comissão por produto:
          </Text>
          {bonusParameters?.commissionPerProduct && (
            <View className='flex-col'>
              <Text className='text-white font-regular text-sm'>Auto: {bonusParameters?.commissionPerProduct?.auto}%</Text>
              <Text className='text-white font-regular text-sm'>Consórcio: {bonusParameters?.commissionPerProduct?.consorcio}%</Text>
              <Text className='text-white font-regular text-sm'>Empresarial: {bonusParameters?.commissionPerProduct?.empresarial}%</Text>
              <Text className='text-white font-regular text-sm'>Vida: {bonusParameters?.commissionPerProduct?.vida}%</Text>
            </View>
          )}

          <Text className="text-white font-regular text-base mt-2">
            <Text className='text-blue font-bold'>Demais ramos (comissão):</Text> {bonusParameters?.defaultCommission}%
          </Text>
        

          <Text className="text-white font-regular text-base mt-2">
            <Text className='text-blue font-bold'>Demais ramos (cashback):</Text> {bonusParameters?.defaultCashback}
          </Text>

          <Text className="text-white font-bold text-base mt-2">
            Última atualização: {formatDate(updatedAt)}
          </Text>
        </View>
      </ExpandableSection>
    </ScrollView>
  );
}
