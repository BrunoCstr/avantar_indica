import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const auth = admin.auth();

export const setUserClaims = functions.https.onCall(async (data, context) => {
  // Verifica se o usuário está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { uid, rule } = data;

  if (!uid || !rule) {
    throw new functions.https.HttpsError('invalid-argument', 'UID e rule são obrigatórios');
  }

  try {
    // Configura a claim do usuário
    await auth.setCustomUserClaims(uid, { rule });
    
    return { success: true, message: 'Claim configurada com sucesso' };
  } catch (error) {
    console.error('Erro ao configurar claim:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao configurar claim do usuário');
  }
}); 