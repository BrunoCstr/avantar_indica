import firestore from '@react-native-firebase/firestore';
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';

export interface CommissionData {
  period: string;
  totalCommission: number;
  opportunitiesCount: number;
  startDate: any;
  endDate: any;
}

export interface DetailedCommissionData {
  label: string;
  value: number;
  count: number;
  startDate: any;
  endDate: any;
}

export interface DashboardData {
  week: DetailedCommissionData[];
  month: DetailedCommissionData[];
  year: DetailedCommissionData[];
}

// Função auxiliar para buscar comissões em um período específico
const getCommissionForDateRange = async (
  userId: string,
  startDate: any,
  endDate: any,
): Promise<{totalCommission: number; opportunitiesCount: number}> => {
  try {
    const opportunitiesRef = firestore()
      .collection('opportunities')
      .where('indicator_id', '==', userId)
      .where('status', '==', 'FECHADO')
      .where('createdAt', '>=', startDate)
      .where('createdAt', '<', endDate);

    const snapshot = await opportunitiesRef.get();
    
    let totalCommission = 0;
    let opportunitiesCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.commission && typeof data.commission === 'number') {
        totalCommission += data.commission;
        opportunitiesCount++;
      }
    });

    return {totalCommission, opportunitiesCount};
  } catch (error) {
    console.error('Erro ao buscar comissões para período:', error);
    return {totalCommission: 0, opportunitiesCount: 0};
  }
};

// Função para obter dados da semana (por dia)
const getWeekData = async (userId: string): Promise<DetailedCommissionData[]> => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Início da semana (domingo às 00:00)
  const weekStartDate = new Date(now);
  weekStartDate.setDate(now.getDate() - dayOfWeek);
  weekStartDate.setHours(0, 0, 0, 0);

  // Fim da semana (sábado às 23:59:59.999)
  const weekEndDate = new Date(now);
  weekEndDate.setDate(now.getDate() + (6 - dayOfWeek));
  weekEndDate.setHours(23, 59, 59, 999);

  const daysOfWeek = eachDayOfInterval({
    start: weekStartDate,
    end: weekEndDate,
  });

  const weekData: DetailedCommissionData[] = [];
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  for (let i = 0; i < daysOfWeek.length; i++) {
    const day = daysOfWeek[i];
    const dayStart = firestore.Timestamp.fromDate(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0));
    const dayEnd = firestore.Timestamp.fromDate(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999));

    const {totalCommission, opportunitiesCount} = await getCommissionForDateRange(userId, dayStart, dayEnd);

    weekData.push({
      label: dayNames[i],
      value: totalCommission,
      count: opportunitiesCount,
      startDate: dayStart,
      endDate: dayEnd,
    });
  }

  return weekData;
};

// Função para obter dados do mês (por semana)
const getMonthData = async (userId: string): Promise<DetailedCommissionData[]> => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const weeksOfMonth = eachWeekOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  const monthData: DetailedCommissionData[] = [];

  for (let i = 0; i < weeksOfMonth.length; i++) {
    const weekStart = weeksOfMonth[i];
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStartTimestamp = firestore.Timestamp.fromDate(weekStart);
    const weekEndTimestamp = firestore.Timestamp.fromDate(weekEnd);

    const {totalCommission, opportunitiesCount} = await getCommissionForDateRange(userId, weekStartTimestamp, weekEndTimestamp);

    monthData.push({
      label: `Semana ${i + 1}`,
      value: totalCommission,
      count: opportunitiesCount,
      startDate: weekStartTimestamp,
      endDate: weekEndTimestamp,
    });
  }

  return monthData;
};

// Função para obter dados do ano (por mês)
const getYearData = async (userId: string): Promise<DetailedCommissionData[]> => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const monthsOfYear = eachMonthOfInterval({
    start: yearStart,
    end: yearEnd,
  });

  const yearData: DetailedCommissionData[] = [];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  for (let i = 0; i < monthsOfYear.length; i++) {
    const monthStart = monthsOfYear[i];
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthStartTimestamp = firestore.Timestamp.fromDate(monthStart);
    const monthEndTimestamp = firestore.Timestamp.fromDate(monthEnd);

    const {totalCommission, opportunitiesCount} = await getCommissionForDateRange(userId, monthStartTimestamp, monthEndTimestamp);

    yearData.push({
      label: monthNames[i],
      value: totalCommission,
      count: opportunitiesCount,
      startDate: monthStartTimestamp,
      endDate: monthEndTimestamp,
    });
  }

  return yearData;
};

export const getCommissionsByPeriod = async (
  userId: string,
): Promise<DashboardData> => {
  try {
    // Buscar dados para todos os períodos
    const [weekData, monthData, yearData] = await Promise.all([
      getWeekData(userId),
      getMonthData(userId),
      getYearData(userId),
    ]);

    return {
      week: weekData,
      month: monthData,
      year: yearData,
    };
  } catch (error) {
    console.error('Erro ao buscar comissões por período:', error);
    throw new Error('Falha ao carregar dados de comissão');
  }
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função para obter dados de comissão para um período específico
export const getCommissionForSpecificPeriod = async (
  userId: string,
  period: 'week' | 'month' | 'year',
): Promise<DetailedCommissionData[]> => {
  const allData = await getCommissionsByPeriod(userId);
  
  switch (period) {
    case 'week':
      return allData.week;
    case 'month':
      return allData.month;
    case 'year':
      return allData.year;
    default:
      throw new Error('Período inválido');
  }
};

// Função para obter o balance do usuário
export const getUserBalance = async (userId: string): Promise<number> => {
  try {
    const userDoc = await firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      console.warn('Usuário não encontrado:', userId);
      return 0;
    }

    const userData = userDoc.data();
    const balance = userData?.balance;

    // Verificar se o balance é um número válido
    if (typeof balance === 'number' && !isNaN(balance)) {
      return balance;
    }

    // Se não for um número válido, retornar 0
    console.warn('Balance inválido para usuário:', userId, 'Balance:', balance);
    return 0;
  } catch (error) {
    console.error('Erro ao buscar balance do usuário:', error);
    throw new Error('Falha ao carregar balance do usuário');
  }
};
