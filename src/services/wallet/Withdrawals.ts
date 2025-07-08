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
export const getUserWithdrawals = async (
  userId: string,
): Promise<WithdrawalRequest[]> => {
  try {
    const querySnapshot = await firestore()
      .collection('withdrawals')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const withdrawals: WithdrawalRequest[] = [];

    querySnapshot.forEach(doc => {
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

    // Buscar o documento do usuário para obter o saldo atual
    const userDoc = await firestore()
      .collection('users')
      .doc(withdrawalData.userId)
      .get();

    if (!userDoc.exists) {
      throw new Error('Usuário não encontrado');
    }

    const userData = userDoc.data();
    const currentBalance = userData?.balance || 0;

    // Verificar se o usuário tem saldo suficiente
    if (currentBalance < withdrawalData.amount) {
      throw new Error('Saldo insuficiente para realizar o saque');
    }

    // Verificar se o usuário tem chave PIX cadastrada
    if (!withdrawalData.pixKey || withdrawalData.pixKey.trim() === '') {
      throw new Error('Chave PIX não cadastrada');
    }

    // Calcular o novo saldo
    const newBalance = currentBalance - withdrawalData.amount;

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

    // Usar uma transação para garantir consistência dos dados
    const result = await firestore().runTransaction(async transaction => {
      // Criar o documento na coleção withdrawals
      const docRef = firestore().collection('withdrawals').doc();
      transaction.set(docRef, withdrawalDoc);

      // Atualizar o saldo do usuário
      transaction.update(
        firestore().collection('users').doc(withdrawalData.userId),
        {
          balance: newBalance,
          updatedAt: now,
        },
      );

      return docRef.id;
    });

    // Atualizar o documento com o withdrawId
    await firestore().collection('withdrawals').doc(result).update({
      withdrawId: result,
      updatedAt: firestore.Timestamp.now(),
    });

    return result;
  } catch (error) {
    console.error('Erro ao criar solicitação de saque:', error);
    throw new Error('Falha ao criar solicitação de saque');
  }
};
