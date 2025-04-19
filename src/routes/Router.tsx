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
    if (!isLoading) {
      setTimeout(() => {
        BootSplash.hide({fade: true})
        setAppReady(true);
      }, 500);
    }
  }, [isLoading]);

  if(!appReady) return null

  return (
    <NavigationContainer>
      {userAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}