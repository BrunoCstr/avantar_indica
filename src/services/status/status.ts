import {getFirestore, collection, query, where, getDocs, orderBy} from '@react-native-firebase/firestore';
import {formatTimeAgo} from '../../utils/formatTimeToDistance';

const db = getFirestore();

export interface Opportunity {
  id: string;
  name: string;
  status: string;
  product: string;
  updatedAt: string;
  indicator_id: string;
  createdAt: any;
}

export interface StatusStats {
  [key: string]: number;
}

export const getOpportunitiesByUserId = async (userId: string): Promise<Opportunity[]> => {
  try {
    const opportunitiesRef = collection(db, 'opportunities');
    const q = query(
      opportunitiesRef,
      where('indicator_id', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const opportunities: Opportunity[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      try {
        opportunities.push({
          id: doc.id,
          name: data.name || '',
          status: data.status || '',
          product: data.product || '',
          updatedAt: formatTimeAgo(data.updatedAt),
          indicator_id: data.indicator_id || '',
          createdAt: data.createdAt,
        });
      } catch (error) {
        console.error('Erro ao processar documento:', doc.id, error);
        // Adiciona o documento mesmo com erro, mas com valores padrão
        opportunities.push({
          id: doc.id,
          name: data.name || 'Nome não disponível',
          status: data.status || 'Status não disponível',
          product: data.product || 'Produto não disponível',
          updatedAt: 'Data não disponível',
          indicator_id: data.indicator_id || '',
          createdAt: data.createdAt,
        });
      }
    });

    return opportunities;
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    throw error;
  }
};

export const getStatusStats = (opportunities: Opportunity[]): StatusStats => {
  const stats: StatusStats = {};
  opportunities.forEach(item => {
    stats[item.status] = (stats[item.status] || 0) + 1;
  });
  return stats;
};

export const filterOpportunities = (
  opportunities: Opportunity[],
  search: string,
  selectedFilters: string[]
): Opportunity[] => {
  let filtered = opportunities;

  // Filtro por texto de busca
  if (search.trim()) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filtro por status
  if (selectedFilters.length > 0) {
    filtered = filtered.filter(item =>
      selectedFilters.includes(item.status)
    );
  }

  return filtered;
};