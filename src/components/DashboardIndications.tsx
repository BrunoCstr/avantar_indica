import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import IndicationsEmpty from '../assets/images/indications_empty.svg';
import {Spinner} from './Spinner';
import {useResponsive} from '../hooks/useResponsive';
import { BanknoteArrowDown, HeartPulse, Shield } from 'lucide-react-native';

type indicationsData = {
  product: string;
  count: number;
  percentage: number;
  totalIndications: number; // Agora representa o total de indicações + oportunidades
};

export type indicationsDataArray = indicationsData[];

interface DashboardIndicacoesProps {
  data: indicationsDataArray;
  isLoading?: boolean;
}

const DashboardIndicacoes = ({data, isLoading = false}: DashboardIndicacoesProps) => {
  const { isSmallScreen } = useResponsive();
  const indications = data;

  const getIconNameByProduct = (product: string) => {
    switch (product) {
      case 'Seguro':
        return <Shield width={22} height={22} color="#4A04A5" />;
      case 'Consórcio':
        return <BanknoteArrowDown width={22} height={22} color="#4A04A5" />;
      case 'Plano de Saúde':
        return <HeartPulse width={22} height={22} color="#4A04A5" />;
      case "":
        return <Shield width={22} height={22} color="#4A04A5" />;
      default:
        return <Shield width={22} height={22} color="#4A04A5" />;
    }
  };

  const renderIndicacaoItem = (item: any, index: number) => (
    <View key={index} className="flex-row items-center">
      <View className={`bg-[#E3E3E3] h-10 w-10 rounded-md justify-center items-center mr-4`}>
        {getIconNameByProduct(item.product)}
      </View>

      <View className="flex-1 mr-4">
        <Text className="text-base font-semibold text-black mb-2">
          {item.product}
        </Text>

        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-1.5 bg-gray rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: '#4A04A5',
              }}
            />
          </View>
          <Text className="text-xs text-black font-medium min-w-8">
            {item.percentage}%
          </Text>
        </View>
      </View>

      <Text className="text-2xl font-bold text-black min-w-10 text-right">
        {item.count}
      </Text>
    </View>
  );

  return (
    <View>
      {isLoading ? (
        <View className="items-center justify-center py-12">
          <Spinner size={32} variant="purple" />
          <Text className="text-sm text-black text-center mt-4">
            Carregando indicações...
          </Text>
        </View>
      ) : indications.length === 0 ? (
        <View className="items-center justify-center py-12">
          <IndicationsEmpty
            width={isSmallScreen ? 40 : 48}
            height={isSmallScreen ? 40 : 48}
            style={{marginBottom: 12, opacity: 0.7}}
          />
          <Text className="text-lg font-bold text-fifth_purple mb-1 text-center">
            Nenhuma indicação ou oportunidade encontrada
          </Text>
          <Text className="text-sm text-black text-center">
            Você ainda não possui indicações registradas. Quando você indicar
            alguém, elas aparecerão aqui!
          </Text>
        </View>
      ) : (
        <View className="gap-4">{indications.map(renderIndicacaoItem)}</View>
      )}
    </View>
  );
};

export default DashboardIndicacoes;
