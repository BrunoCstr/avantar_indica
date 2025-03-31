import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplapsh from 'react-native-bootsplash'

import {WaitingStack} from './WaitingStack';
import {AuthStack} from './AuthStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated, isLoading} = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        BootSplapsh.hide({fade: true})
        setAppReady(true);
      }, 500);
    }
  }, [isLoading]);

  if(!appReady) return null

  return (
    <NavigationContainer>
      {userAuthenticated ? <WaitingStack /> : <AuthStack />}
    </NavigationContainer>
  );
}