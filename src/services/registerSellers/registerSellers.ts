import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

export async function fetchSellersService(userId: string) {
  const q = firestore()
    .collection('users')
    .where('rule', '==', 'sub_indicador')
    .where('masterUid', '==', userId)
    .orderBy('createdAt', 'desc');
  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
}

export async function createSellerService({
  fullName,
  email,
  phone,
  password,
  affiliated_to,
  unitName,
  profilePicture,
  masterUid,
  commission,
}: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  affiliated_to?: string;
  unitName?: string;
  profilePicture?: string;
  masterUid?: string;
  commission?: number;
}) {
  try {
    // Usar Cloud Function para criar usuário sem fazer login
    const result = await functions().httpsCallable('createUserAsAdmin')({
      fullName,
      email,
      phone: phone.replace(/\D/g, ''),
      password,
      affiliated_to,
      unitName,
      rule: 'sub_indicador',
      profilePicture: profilePicture,
      masterUid: masterUid,
      commission,
    });

    return result.data;
  } catch (error: any) {
    console.error('Erro ao criar vendedor:', error);

    // Tratar erros específicos
    if (error.code === 'functions/unavailable') {
      throw new Error('Serviço temporariamente indisponível. Tente novamente.');
    } else if (error.message?.includes('email-already-in-use')) {
      throw new Error('Este e-mail já está sendo usado por outro usuário.');
    } else if (error.message?.includes('weak-password')) {
      throw new Error('A senha é muito fraca.');
    } else if (error.message?.includes('invalid-email')) {
      throw new Error('E-mail inválido.');
    } else {
      throw new Error('Erro ao criar vendedor. Tente novamente.');
    }
  }
}

export async function toggleSellerActiveService(
  sellerId: string,
  disabled: boolean,
  email: string,
) {
  // Atualiza no Auth
  try {
    await functions().httpsCallable('toggleUserActive')({
      email,
      disabled: !disabled,
    });
  } catch (error) {
    console.error('Erro ao ativar/desativar usuário no Auth:', error);
    throw new Error('Erro ao ativar/desativar usuário no Auth.');
  }
  // Atualiza no Firestore
  await firestore()
    .collection('users')
    .doc(sellerId)
    .update({disabled: !disabled});
}

export async function updateSellerService(
  sellerId: string,
  data: {fullName: string; email: string; phone: string; password?: string; oldEmail?: string; commission?: number},
) {
  // Atualizar e-mail no Auth se mudou
  if (data.oldEmail && data.oldEmail !== data.email) {
    try {
      await functions().httpsCallable('updateUserEmail')({
        oldEmail: data.oldEmail,
        newEmail: data.email,
      });
    } catch (error) {
      console.error('Erro ao atualizar e-mail no Auth:', error);
      throw new Error('Erro ao atualizar e-mail. Tente novamente.');
    }
  }

  // Atualizar dados no Firestore
  await firestore()
    .collection('users')
    .doc(sellerId)
    .update({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone.replace(/\D/g, ''),
      commission: data.commission,
    });

  // Se uma nova senha foi fornecida, atualizar no Auth via Cloud Function
  if (data.password && data.password !== '') {
    try {
      await functions().httpsCallable('updateUserPassword')({
        email: data.email,
        newPassword: data.password,
      });
    } catch (error) {
      console.error('Erro ao atualizar senha no Auth:', error);
      throw new Error('Erro ao atualizar senha. Tente novamente.');
    }
  }
}
