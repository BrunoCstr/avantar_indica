import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@shopify/restyle';

// import {useAuth} from '../contexts/Auth';
import {theme} from '../theme';
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';

export function Router() {
  // Quando colocar a logica do Firebase no contexto, mudar aqui
  // const {authData} = useAuth()
  const auth = false;

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {auth ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </ThemeProvider>
  );
}