import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@shopify/restyle';
import SplashScreen from 'react-native-splash-screen';

import {theme} from '../theme';
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';
import {useAuth} from '../contexts/Auth';
import {Text, View} from 'react-native';

export function Router() {
  const {authData, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer onReady={() => !isLoading && SplashScreen.hide()}>
        {authData ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </ThemeProvider>
  );
}
