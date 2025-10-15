import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useAuth} from '../contexts/Auth';
import firestore from '@react-native-firebase/firestore';

export function useFCM() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {userData} = useAuth();

  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        announcement: false,
        carPlay: false,
        criticalAlert: false,
        provisional: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  };

  const getToken = async () => {
    try {
      // iOS precisa estar registrado para notificações remotas antes de pegar o token
      if (Platform.OS === 'ios') {
        await messaging().setAutoInitEnabled(true);
        const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
        if (!isRegistered) {
          await messaging().registerDeviceForRemoteMessages();
        }
      }

      const token = await messaging().getToken();
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error('Erro ao obter FCM token:', error);
      return null;
    }
  };

  const updateTokenInFirestore = async (token: string | null) => {
    if (!userData?.uid || !token) {
      console.warn('Usuário não autenticado ou token inválido para atualizar FCM');
      return false;
    }

    try {
      const userRef = firestore().collection('users').doc(userData.uid);
      await userRef.set({ fcmToken: token }, { merge: true });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar FCM token no Firestore:', error);
      return false;
    }
  };

  const setupFCM = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        const token = await getToken();
        if (token && userData?.uid) {
          await updateTokenInFirestore(token);
        }
      }
    } catch (error) {
      console.error('Erro ao configurar FCM:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setupFCM();

    // Configurar listener para mudanças no token
    const unsubscribe = messaging().onTokenRefresh(async token => {
      setFcmToken(token);
      if (userData?.uid) {
        await updateTokenInFirestore(token);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userData?.uid]);

  return {
    fcmToken,
    isLoading,
    requestPermission,
    getToken,
    updateTokenInFirestore,
    setupFCM,
  };
} 