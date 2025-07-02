import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();

export const toggleUserActive = functions.https.onCall(
  async (data, context) => {
    // Verifica se o usuário está autenticado e é admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado',
      );
    }
    const requesterUid = context.auth.uid;
    const requester = await admin
      .firestore()
      .collection('users')
      .doc(requesterUid)
      .get();
    const requesterRule = requester.data()?.rule;
    if (
      !['admin_franqueadora', 'admin_unidade', 'parceiro_indicador'].includes(
        requesterRule,
      )
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Apenas administradores e demais usuários autorizados podem ativar/desativar usuários.',
      );
    }

    const {email, disabled} = data;
    if (!email || typeof disabled !== 'boolean') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'E-mail e status (disabled) são obrigatórios.',
      );
    }

    try {
      // Busca o usuário pelo e-mail
      const userRecord = await auth.getUserByEmail(email);
      // Atualiza o status de ativação
      await auth.updateUser(userRecord.uid, {disabled});
      return {success: true};
    } catch (error: any) {
      console.error('Erro ao ativar/desativar usuário:', error);
      if (error.code === 'auth/user-not-found') {
        throw new functions.https.HttpsError(
          'not-found',
          'Usuário não encontrado.',
        );
      }
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao ativar/desativar usuário.',
      );
    }
  },
); 