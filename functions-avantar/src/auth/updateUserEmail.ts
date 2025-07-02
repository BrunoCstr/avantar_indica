import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();

export const updateUserEmail = functions.https.onCall(
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
        'Apenas administradores e demais usuários autorizados podem atualizar e-mails.',
      );
    }

    const {oldEmail, newEmail} = data;
    if (!oldEmail || !newEmail) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'E-mail antigo e novo e-mail são obrigatórios.',
      );
    }

    try {
      // Busca o usuário pelo e-mail antigo
      const userRecord = await auth.getUserByEmail(oldEmail);
      // Atualiza o e-mail
      await auth.updateUser(userRecord.uid, {email: newEmail});
      return {success: true};
    } catch (error: any) {
      console.error('Erro ao atualizar e-mail:', error);
      if (error.code === 'auth/user-not-found') {
        throw new functions.https.HttpsError(
          'not-found',
          'Usuário não encontrado.',
        );
      }
      if (error.code === 'auth/email-already-exists') {
        throw new functions.https.HttpsError(
          'already-exists',
          'O novo e-mail já está em uso.',
        );
      }
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao atualizar e-mail.',
      );
    }
  },
); 