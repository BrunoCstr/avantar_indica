import React, { useEffect } from 'react';
import {LogBox, Platform, Text} from 'react-native';
import './firebaseConfig';
import './global.css';
import {Router} from './src/routes/Router';
import {AuthProvider} from './src/contexts/Auth';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

// Ignorar warnings específicos que podem estar causando problemas
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

// Função para configurar FCM
async function setupFCM() {
  try {
    // REGISTRAR o dispositivo para mensagens remotas (obrigatório no iOS)
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    // Solicitar permissões de notificação
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permissões de notificação concedidas');
      
      // Obter o token inicial
      const token = await messaging().getToken();
      console.log('FCM Token inicial:', token);
      
      // Configurar listener para mudanças no token
      messaging().onTokenRefresh(token => {
        console.log('FCM Token renovado:', token);
      });
    } else {
      console.log('Permissões de notificação negadas');
    }
  } catch (error) {
    console.error('Erro ao configurar FCM:', error);
  }
}

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Configurar FCM
        await setupFCM();
      } catch (error) {
        console.warn('Error during app initialization:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
