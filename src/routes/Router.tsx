import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash'

import {AuthStack} from './AuthStack';
import {AppStack} from './AppStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated, isLoading, userData} = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Aguardar o carregamento da autenticação E dos dados do usuário
      if (!isLoading) {
        // Se o usuário está autenticado, aguardar também os dados do usuário
        if (userAuthenticated && userData) {
          try {
            // Aguardar um tempo mínimo para uma transição mais suave
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Esconder splash screen com fade
            await BootSplash.hide({fade: true});
          } catch (error) {
            console.warn('Error hiding bootsplash:', error);
          } finally {
            setAppReady(true);
          }
        } else if (!userAuthenticated) {
          // Se não está autenticado, pode esconder o splash imediatamente
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await BootSplash.hide({fade: true});
          } catch (error) {
            console.warn('Error hiding bootsplash:', error);
          } finally {
            setAppReady(true);
          }
        }
      }
    };

    initializeApp();
  }, [isLoading, userAuthenticated, userData]);

  // Não renderizar nada até que o app esteja pronto e a autenticação tenha sido verificada
  if (!appReady || isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {userAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}