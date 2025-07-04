import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();
const db = admin.firestore();

export const createUserAsAdmin = functions.https.onCall(
  async (data, context) => {
    // Verifica se o usuário está autenticado e é admin
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado',
      );
    }
    const requesterUid = context.auth.uid;
    const requester = await db.collection('users').doc(requesterUid).get();
    const requesterRule = requester.data()?.rule;
    if (
      !['admin_franqueadora', 'admin_unidade', 'parceiro_indicador'].includes(
        requesterRule,
      )
    ) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Apenas administradores podem criar usuários.',
      );
    }

    const {
      fullName,
      email,
      phone,
      password,
      affiliated_to,
      unitName,
      rule,
      profilePicture,
      masterUid,
      commission,
    } = data;

    console.log('Comissão recebida na Cloud Function:', commission, typeof commission);

    if (!fullName || !email || !phone || !password || !rule || !masterUid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Dados obrigatórios ausentes.',
      );
    }

    try {
      // Cria o usuário no Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: false,
        disabled: false,
        photoURL: profilePicture,
      });

      // Seta claims customizadas
      await auth.setCustomUserClaims(userRecord.uid, {rule});

      // Salva no Firestore
      await db
        .collection('users')
        .doc(userRecord.uid)
        .set({
          fullName,
          email,
          phone,
          affiliated_to: affiliated_to || null,
          unitName: unitName || null,
          rule,
          registration_status: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          fcmToken: null,
          uid: userRecord.uid,
          isFirstLogin: true,
          profilePicture: profilePicture,
          pixKey: null,
          disabled: false,
          createdBy: requesterUid,
          masterUid: masterUid,
          commission: commission || null,
        });

      return userRecord.uid;
    } catch (error: any) {
      console.error('Erro ao criar usuário como admin:', error);
      if (error.code === 'auth/email-already-exists') {
        throw new functions.https.HttpsError(
          'already-exists',
          'E-mail já cadastrado.',
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
        'Erro ao criar usuário.',
      );
    }
  },
);
