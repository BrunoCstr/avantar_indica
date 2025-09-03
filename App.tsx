import React, { useEffect } from 'react';
import {LogBox, Platform} from 'react-native';
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
