import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();

export const rules = functions.firestore
  .document('users/{uid}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const uid = context.params.uid;

    // se veio createdBy, pule
    if (data?.createdBy) {
      console.log(`Ignorando regra padrão para ${uid}, createdBy encontrado.`);
      return null;
    }

    try {
      // seta a claim
      await auth.setCustomUserClaims(uid, {rule: 'nao_definida'});
      // grava o campo rule no Firestore
      await snap.ref.set({rule: 'nao_definida'}, {merge: true});
    } catch (error) {
      console.error('Erro ao definir claim/regra para o usuário:', error);
    }

    return null;
  });
