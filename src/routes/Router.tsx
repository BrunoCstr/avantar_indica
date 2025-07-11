import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash'

import {AuthStack} from './AuthStack';
import {AppStack} from './AppStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated, isLoading} = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (!isLoading) {
        try {
          // Aguardar um tempo mínimo para uma transição mais suave
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Esconder splash screen com fade
          await BootSplash.hide({fade: true, duration: 300});
        } catch (error) {
          console.warn('Error hiding bootsplash:', error);
        }
        setAppReady(true);
      }
    };

    initializeApp();
  }, [isLoading]);

  if(!appReady) return null

  return (
    <NavigationContainer>
      {userAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}