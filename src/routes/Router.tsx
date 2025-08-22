import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

import {AuthStack} from './AuthStack';
import {AppStack} from './AppStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated, isLoading} = useAuth();
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    const hideSplash = async () => {
      // Só esconder o splash se ainda não foi escondido
      if (!splashHidden) {
        try {
          
          await BootSplash.hide({fade: true});
         
          setSplashHidden(true);
        } catch (error) {
          console.warn('Error hiding bootsplash:', error);
          setSplashHidden(true); // Marcar como escondido mesmo com erro
        }
      }
    };

    // Esconder splash quando não estiver carregando
    if (!isLoading) {
      hideSplash();
    }
  }, [isLoading, splashHidden]);


  // Renderizar sempre, mas só esconder splash quando não estiver carregando
  return (
    <NavigationContainer>
      {userAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}