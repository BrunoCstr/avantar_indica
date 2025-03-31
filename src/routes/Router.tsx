import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import {WaitingStack} from './WaitingStack';
import {AuthStack} from './AuthStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated, isLoading} = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        SplashScreen.hide();
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