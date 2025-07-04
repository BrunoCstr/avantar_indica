import {formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

export const formatTimeAgo = (timestamp: any) => {
  try {
    // Se for um timestamp do Firestore
    if (timestamp && typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR,
      });
    }
    
    // Se for uma string ou número
    if (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Data não disponível';
      }
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR,
      });
    }
    
    return 'Data não disponível';
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data não disponível';
  }
};