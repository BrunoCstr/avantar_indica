import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const registerTermsAcceptance = functions.https.onCall(
  async (data, context) => {
    // Verifica se o usuário está autenticado
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuário não autenticado',
      );
    }

    const { uid, email, fullName, userLocation, deviceInfo } = data;

    // Verifica se o usuário está tentando registrar para si mesmo
    if (context.auth.uid !== uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Usuário só pode registrar aceite para si mesmo',
      );
    }

    try {
      const acceptTermsData = {
        uid: uid,
        email: email,
        fullName: fullName,
        ip: userLocation?.ip || null,
        location: {
          city: userLocation?.city || null,
          region: userLocation?.region || null,
          country: userLocation?.country || null,
          latitude: userLocation?.latitude || null,
          longitude: userLocation?.longitude || null,
          timezone: userLocation?.timezone || null,
        },
        acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
        userAgent: deviceInfo?.userAgent || 'React Native App',
        deviceInfo: {
          platform: deviceInfo?.platform || 'unknown',
          versionApp: deviceInfo?.versionApp || null,
          dateVersionApp: deviceInfo?.dateVersionApp || null,
          timestamp: deviceInfo?.timestamp || new Date().toISOString(),
        }
      };

      await db
        .collection('accept_terms')
        .doc(uid)
        .set(acceptTermsData);

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao registrar aceite dos termos:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Erro ao registrar aceite dos termos',
      );
    }
  },
);
