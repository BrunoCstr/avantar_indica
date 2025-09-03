import {getFirestore, collection, query, where, getDocs, orderBy} from '@react-native-firebase/firestore';
import {formatTimeAgo} from '../../utils/formatTimeToDistance';
import { getPackagedIndicationsByUserId } from '../bulkIndications/bulkIndications';

const db = getFirestore();

// Nova função para formatar o tempo com texto apropriado
const formatStatusTime = (updatedAt: any, createdAt: any) => {
  try {
    
    // Se não há updatedAt, usar createdAt
    if (!updatedAt) {
      const time = formatTimeAgo(createdAt);
      return `Enviado ${time}`;
    }

    // Converter timestamps para números
    let updatedTime: number;
    let createdTime: number;
    
    if (updatedAt.toDate) {
      updatedTime = updatedAt.toDate().getTime();
    } else if (updatedAt.seconds) {
      updatedTime = updatedAt.seconds * 1000;
    } else if (updatedAt._seconds) {
      updatedTime = updatedAt._seconds * 1000;
    } else {
      updatedTime = new Date(updatedAt).getTime();
    }
    
    if (createdAt.toDate) {
      createdTime = createdAt.toDate().getTime();
    } else if (createdAt.seconds) {
      createdTime = createdAt.seconds * 1000;
    } else if (createdAt._seconds) {
      createdTime = createdAt._seconds * 1000;
    } else {
      createdTime = new Date(createdAt).getTime();
    }
    
    // Se updatedAt é mais recente que createdAt, mostrar "Atualizado"
    if (updatedTime > createdTime) {
      const time = formatTimeAgo(updatedAt);
      return `Atualizado ${time}`;
    } else {
      const time = formatTimeAgo(createdAt);
      return `Enviado ${time}`;
    }
  } catch (error) {
    console.error('Erro ao formatar tempo do status:', error);
    return 'Data não disponível';
  }
};

export interface Opportunity {
  id: string;
  name: string;
  status: string;
  product: string;
  updatedAt: string;
  indicator_id: string;
  createdAt: any;
  updatedAtOriginal?: any; // Timestamp original para ordenação
}

export interface Indication {
  id: string;
  name: string;
  status: string;
  product: string;
  updatedAt: string;
  indicator_id: string;
  createdAt: any;
  updatedAtOriginal?: any; // Timestamp original para ordenação
}

// Interface unificada para exibir tanto oportunidades quanto indicações
export interface StatusItem {
  id: string;
  name: string;
  status: string;
  product: string;
  updatedAt: string;
  indicator_id: string;
  createdAt: any;
  type: 'opportunity' | 'indication'; // Campo para identificar o tipo
  updatedAtOriginal?: any; // Timestamp original para ordenação
}

export interface BulkStatusItem {
  id: string;
  name: string; // 'Lote em massa'
  status: string; // 'Em Andamento' ou 'Concluído'
  product: string; // Ex: '10 indicações'
  updatedAt: any;
  indicator_id: string;
  createdAt: any;
  updatedAtOriginal?: any;
  type: 'bulk';
  indications: any[];
  progress: number;
  total: number;
  processed: number;
  packagedIndicationId: string;
  unitName?: string;
}

export type UnifiedStatusItem = StatusItem | BulkStatusItem;

export interface StatusStats {
  [key: string]: number;
}

export const getOpportunitiesByUserId = async (userId: string): Promise<Opportunity[]> => {
  try {
    const opportunitiesRef = collection(db, 'opportunities');
    
    // Buscar por indicator_id OU userId
    const q1 = query(
      opportunitiesRef,
      where('indicator_id', '==', userId)
    );
    
    const q2 = query(
      opportunitiesRef,
      where('userId', '==', userId)
    );

    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);
    
    const opportunities: Opportunity[] = [];
    const processedIds = new Set<string>();

    // Processar resultados da primeira query (indicator_id)
    querySnapshot1.forEach((doc) => {
      if (!processedIds.has(doc.id)) {
        processedIds.add(doc.id);
        const data = doc.data();
        try {
          opportunities.push({
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatStatusTime(data.updatedAt || data.updateAt, data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt || data.updateAt, // Armazenar timestamp original
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
            updatedAtOriginal: data.updatedAt || data.updateAt, // Armazenar timestamp original
          });
        }
      }
    });

    // Processar resultados da segunda query (userId)
    querySnapshot2.forEach((doc) => {
      if (!processedIds.has(doc.id)) {
        processedIds.add(doc.id);
        const data = doc.data();
        try {
          opportunities.push({
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatStatusTime(data.updatedAt || data.updateAt, data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt || data.updateAt, // Armazenar timestamp original
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
            updatedAtOriginal: data.updatedAt || data.updateAt, // Armazenar timestamp original
          });
        }
      }
    });

    return opportunities;
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    throw error;
  }
};

export const getIndicationsByUserId = async (userId: string): Promise<Indication[]> => {
  try {
    const indicationsRef = collection(db, 'indications');
    
    // Buscar por indicator_id OU userId
    const q1 = query(
      indicationsRef,
      where('indicator_id', '==', userId)
    );
    
    const q2 = query(
      indicationsRef,
      where('userId', '==', userId)
    );

    const [querySnapshot1, querySnapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);
    
    const indications: Indication[] = [];
    const processedIds = new Set<string>();

    // Processar resultados da primeira query (indicator_id)
    querySnapshot1.forEach((doc) => {
      if (!processedIds.has(doc.id)) {
        processedIds.add(doc.id);
        const data = doc.data();
        try {
          // Usar createdAt se updatedAt não existir
          const updateTime = data.updatedAt || data.createdAt;
          indications.push({
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatStatusTime(data.updatedAt, data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt, // Armazenar timestamp original
          });
        } catch (error) {
          console.error('Erro ao processar documento:', doc.id, error);
          // Adiciona o documento mesmo com erro, mas com valores padrão
          indications.push({
            id: doc.id,
            name: data.name || 'Nome não disponível',
            status: data.status || 'Status não disponível',
            product: data.product || 'Produto não disponível',
            updatedAt: 'Data não disponível',
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt, // Armazenar timestamp original
          });
        }
      }
    });

    // Processar resultados da segunda query (userId)
    querySnapshot2.forEach((doc) => {
      if (!processedIds.has(doc.id)) {
        processedIds.add(doc.id);
        const data = doc.data();
        try {
          // Usar createdAt se updatedAt não existir
          const updateTime = data.updatedAt || data.createdAt;
          indications.push({
            id: doc.id,
            name: data.name || '',
            status: data.status || '',
            product: data.product || '',
            updatedAt: formatStatusTime(data.updatedAt, data.createdAt),
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt, // Armazenar timestamp original
          });
        } catch (error) {
          console.error('Erro ao processar documento:', doc.id, error);
          // Adiciona o documento mesmo com erro, mas com valores padrão
          indications.push({
            id: doc.id,
            name: data.name || 'Nome não disponível',
            status: data.status || 'Status não disponível',
            product: data.product || 'Produto não disponível',
            updatedAt: 'Data não disponível',
            indicator_id: data.indicator_id || '',
            createdAt: data.createdAt,
            updatedAtOriginal: data.updatedAt, // Armazenar timestamp original
          });
        }
      }
    });

    return indications;
  } catch (error) {
    console.error('Erro ao buscar indicações:', error);
    throw error;
  }
};

// Função principal que combina oportunidades e indicações
export const getAllStatusItemsByUserId = async (userId: string): Promise<UnifiedStatusItem[]> => {
  try {
    const [opportunities, indications, bulkIndications] = await Promise.all([
      getOpportunitiesByUserId(userId),
      getIndicationsByUserId(userId),
      getPackagedIndicationsByUserId(userId),
    ]);

    // Converter oportunidades para StatusItem
    const opportunityItems: StatusItem[] = opportunities.map(opportunity => ({
      ...opportunity,
      type: 'opportunity' as const
    }));

    // Converter indicações para StatusItem
    const indicationItems: StatusItem[] = indications.map(indication => ({
      ...indication,
      type: 'indication' as const
    }));

    // bulkIndications já está no formato BulkStatusItem

    // Combinar e ordenar por data de atualização (mais recente primeiro)
    const allItems: UnifiedStatusItem[] = [
      ...opportunityItems,
      ...indicationItems,
      ...bulkIndications,
    ];
    
    // Ordenar por timestamp do updatedAt (mais recente primeiro)
    allItems.sort((a, b) => {
      const aTime = a.updatedAtOriginal?.seconds || a.updatedAtOriginal?.toDate?.() || a.createdAt?.seconds || a.createdAt?.toDate?.() || 0;
      const bTime = b.updatedAtOriginal?.seconds || b.updatedAtOriginal?.toDate?.() || b.createdAt?.seconds || b.createdAt?.toDate?.() || 0;
      return bTime - aTime;
    });

    return allItems;
  } catch (error) {
    console.error('Erro ao buscar dados de status:', error);
    throw error;
  }
};

export const getStatusStats = (items: UnifiedStatusItem[]): StatusStats => {
  const stats: StatusStats = {};
  items.forEach(item => {
    stats[item.status] = (stats[item.status] || 0) + 1;
  });
  return stats;
};

export const filterStatusItems = (
  items: UnifiedStatusItem[],
  search: string,
  selectedFilters: string[]
): UnifiedStatusItem[] => {
  let filtered = items;

  // Filtro por texto de busca
  if (search.trim()) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filtro por tipo
  const typeFilters = selectedFilters.filter(filter => 
    filter === 'APENAS OPORTUNIDADES' || filter === 'APENAS INDICAÇÕES' || filter === 'APENAS LOTES EM MASSA'
  );
  
  if (typeFilters.length > 0) {
    filtered = filtered.filter(item => {
      if (typeFilters.includes('APENAS OPORTUNIDADES') && item.type === 'opportunity') {
        return true;
      }
      if (typeFilters.includes('APENAS INDICAÇÕES') && item.type === 'indication') {
        return true;
      }
      if (typeFilters.includes('APENAS LOTES EM MASSA') && item.type === 'bulk') {
        return true;
      }
      return false;
    });
  }

  // Filtro por status
  const statusFilters = selectedFilters.filter(filter => 
    filter !== 'APENAS OPORTUNIDADES' && filter !== 'APENAS INDICAÇÕES' && filter !== 'APENAS LOTES EM MASSA' && filter !== '---'
  );
  
  if (statusFilters.length > 0) {
    filtered = filtered.filter(item =>
      statusFilters.includes(item.status)
    );
  }

  return filtered;
};

// Manter funções antigas para compatibilidade
export const filterOpportunities = filterStatusItems;