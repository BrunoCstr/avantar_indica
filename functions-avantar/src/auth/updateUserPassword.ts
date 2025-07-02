import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();

export const updateUserPassword = functions.https.onCall(
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
        'Apenas administradores e demais usuários autorizados podem atualizar senhas.',
      );
    }

    const {email, newPassword} = data;
    if (!email || !newPassword) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'E-mail e nova senha são obrigatórios.',
      );
    }

    try {
      // Busca o usuário pelo e-mail
      const userRecord = await auth.getUserByEmail(email);
      // Atualiza a senha
      await auth.updateUser(userRecord.uid, {password: newPassword});
      return {success: true};
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      if (error.code === 'auth/user-not-found') {
        throw new functions.https.HttpsError(
          'not-found',
          'Usuário não encontrado.',
        );
      }
      if (error.code === 'auth/invalid-password') {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Senha inválida.',
        );
      }
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao atualizar senha.',
      );
    }
  },
);
