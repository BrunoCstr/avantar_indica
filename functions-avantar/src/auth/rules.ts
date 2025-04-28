import { user } from 'firebase-functions/v1/auth';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const rules = user().onCreate(async (user) => {
  const defaultRule = 'nao_definida';
  try {
    await admin.auth().setCustomUserClaims(user.uid, { rule: defaultRule });
    await db.collection('users').doc(user.uid).set(
      { rule: defaultRule },
      { merge: true }
    );
    console.log(user.uid)
  } catch (error) {
    console.error('Erro ao definir regra para o usuário:', error);
  }
});
