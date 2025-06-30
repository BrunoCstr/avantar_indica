import firestore from '@react-native-firebase/firestore';

export interface WithdrawalRequest {
  withdrawId: string;
  userId: string;
  amount: number;
  status: 'PAGO' | 'RECUSADO' | 'SOLICITADO';
  createdAt: any;
  updatedAt: any;
  pixKey: string;
}

// Função para obter todas as solicitações de saque do usuário
export const getUserWithdrawals = async (userId: string): Promise<WithdrawalRequest[]> => {
  try {
    const querySnapshot = await firestore()
      .collection('withdrawals')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const withdrawals: WithdrawalRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      withdrawals.push({
        withdrawId: data.withdrawId,
        userId: data.userId,
        amount: data.amount,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        pixKey: data.pixKey,
      });
    });

    return withdrawals;
  } catch (error) {
    console.error('Erro ao buscar solicitações de saque:', error);
    throw new Error('Falha ao buscar solicitações de saque');
  }
};

// Função para formatar valores monetários
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Interface para criar uma nova solicitação de saque
export interface CreateWithdrawalRequest {
  amount: number;
  fullName: string;
  pixKey: string;
  rule: string;
  unitId: string;
  unitName: string;
  userId: string;
}

// Função para criar uma solicitação de saque
export const createWithdrawalRequest = async (
  withdrawalData: CreateWithdrawalRequest,
): Promise<string> => {
  try {
    const now = firestore.Timestamp.now();

    const withdrawalDoc = {
      amount: withdrawalData.amount,
      createdAt: now,
      updatedAt: now,
      fullName: withdrawalData.fullName,
      pixKey: withdrawalData.pixKey,
      rule: withdrawalData.rule,
      status: 'SOLICITADO' as const,
      unitId: withdrawalData.unitId,
      unitName: withdrawalData.unitName,
      userId: withdrawalData.userId,
      withdrawId: '',
    };

    // Criar o documento na coleção withdrawals
    const docRef = await firestore()
      .collection('withdrawals')
      .add(withdrawalDoc);

    // Atualizar o documento com o withdrawId
    await firestore().collection('withdrawals').doc(docRef.id).update({
      withdrawId: docRef.id,
      updatedAt: firestore.Timestamp.now(),
    });

    console.log('Solicitação de saque criada com sucesso:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar solicitação de saque:', error);
    throw new Error('Falha ao criar solicitação de saque');
  }
};
