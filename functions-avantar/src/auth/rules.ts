import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const onUserSignUp = functions.auth
  .user()
  .onCreate(async (user: any) => {
    const defaultRole = 'nao_definida';

    try {
      await admin.auth().setCustomUserClaims(user.uid, {role: defaultRole});

      await db.collection('users').doc(user.uid).set({
        role: defaultRole,
      });
    } catch (error) {
      console.error('Erro ao definir regra para o usuário: ', error);
    }
  });
