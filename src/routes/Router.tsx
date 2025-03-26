import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@shopify/restyle';
import SplashScreen from 'react-native-splash-screen';

import {theme} from '../theme';
import {WaitingStack} from './WaitingStack';
import {AuthStack} from './AuthStack';
import {useAuth} from '../contexts/Auth';

export function Router() {
  const {userAuthenticated} = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer onReady={() => SplashScreen.hide()}>
        {userAuthenticated ? <WaitingStack /> : <AuthStack />}
      </NavigationContainer>
    </ThemeProvider>
  );
}