import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getCommissionsByPeriod} from '../services/wallet/Dashboard';
import {useAuth} from '../contexts/Auth';
import {Spinner} from './Spinner';

const {width: screenWidth} = Dimensions.get('window');

const DashboardChart = () => {
  const [data, setData] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [isLoading, setIsLoading] = useState(true);
  const {userData} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getCommissionsByPeriod(userData?.uid);
        setData(data);
      } catch (error) {
        console.log('error', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userData?.uid]);

  // Função para obter o período atual
  const getCurrentPeriod = () => {
    const now = new Date();

    switch (selectedPeriod) {
      case 'Semana':
        // Retorna o dia da semana (0 = Domingo, 1 = Segunda, etc.)
        return now.getDay();
      case 'Mês':
        // Retorna a semana atual do mês (1-5)
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfMonth = now.getDate();
        const weekOfMonth = Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
        return Math.min(weekOfMonth, 5); // Máximo 5 semanas
      case 'Ano':
        // Retorna o mês atual (0-11)
        return now.getMonth();
      default:
        return 0;
    }
  };

  // Função para obter os dados baseado no período selecionado
  const getChartData = () => {
    if (!data) return [];

    let periodData: any[] = [];

    switch (selectedPeriod) {
      case 'Semana':
        periodData = data.week || [];
        break;
      case 'Mês':
        periodData = data.month || [];
        break;
      case 'Ano':
        periodData = data.year || [];
        break;
      default:
        periodData = data.month || [];
    }

    // Obter o período atual
    const currentPeriod = getCurrentPeriod();

    // Filtrar dados até o período atual
    let filteredData = periodData;
    if (selectedPeriod === 'Semana') {
      // Para semana, mostrar até o dia atual da semana
      filteredData = periodData.slice(0, currentPeriod + 1);
    } else if (selectedPeriod === 'Mês') {
      // Para mês, mostrar até a semana atual do mês
      filteredData = periodData.slice(0, currentPeriod);
    } else if (selectedPeriod === 'Ano') {
      // Para ano, mostrar até o mês atual
      filteredData = periodData.slice(0, currentPeriod + 1);
    }

    // Calcular altura das barras baseado no valor máximo
    const maxValue = Math.max(
      ...filteredData.map((item: any) => item.value),
      1,
    );

    return filteredData.map((item: any) => ({
      label: item.label,
      value: item.value,
      count: item.count,
      height: item.value > 0 ? Math.max((item.value / maxValue) * 140, 20) : 20, // Altura mínima de 20
    }));
  };

  const chartData = getChartData();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
  };

  // Função para formatar labels baseado no período
  const formatLabel = (label: string) => {
    if (selectedPeriod === 'Semana') {
      // Para semana, mostrar apenas o dia da semana
      return label;
    } else if (selectedPeriod === 'Mês') {
      // Para mês, mostrar "Semana 1", "Semana 2", etc.
      return label;
    } else {
      // Para ano, mostrar apenas os 3 primeiros caracteres do mês
      return label.substring(0, 3);
    }
  };

  return (
    <View className="bg-transparent rounded-lg mx-4 shadow-sm">
      {/* Header com seletores de período */}
      <View className="flex-row justify-center mb-6">
        <View className="flex-row items-center justify-center bg-[#f4f0ff] rounded-lg p-1 w-full">
          {['Semana', 'Mês', 'Ano'].map(period => (
            <TouchableOpacity
              key={period}
              className={`flex-1 px-1 justify-center items-center rounded-lg ${
                selectedPeriod === period ? 'bg-orange' : ''
              }`}
              onPress={() => setSelectedPeriod(period)}>
              <View className={`w-24 h-6 items-center justify-center`}>
                <Text
                  className={`text-sm font-semiBold text-center ${
                    selectedPeriod === period ? 'text-white' : 'text-black'
                  }`}>
                  {period}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Área do gráfico */}
      <View className="relative">
        {/* Container das barras */}
        {isLoading ? (
          <View className="justify-center items-center" style={{height: 200}}>
            <Spinner size={34} variant="blue" />
          </View>
        ) : (
          <>
            <View
              className="flex-row items-end justify-between px-2"
              style={{height: 200}}>
              {chartData.map((item, index) => (
                <View key={index} className="items-center flex-1 mx-1">
                  {/* Valor acima da barra */}
                  <Text
                    className="text-black mb-2 text-center"
                    style={{
                      fontSize: 10,
                    }}>
                    {formatCurrency(item.value)}
                  </Text>

                  {/* Barra do gráfico */}
                  <LinearGradient
                    className="w-[100%] justify-center items-center rounded-xl"
                    colors={
                      item.value > 0
                        ? ['#31006A', '#4E00A7']
                        : ['#E5E7EB', '#E5E7EB']
                    }
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <View
                      className="rounded-xl"
                      style={{
                        height: item.height,
                        minWidth: 40,
                      }}
                    />
                  </LinearGradient>

                  {/* Label do período */}
                  <Text
                    className="font-regular text-black mt-3 text-center"
                    style={{
                      fontSize: 10,
                    }}>
                    {formatLabel(item.label)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default DashboardChart;
