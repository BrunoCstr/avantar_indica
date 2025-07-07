import React, { useEffect } from 'react';
import {Text, TextInput, LogBox} from 'react-native';
import './firebaseConfig';
import {Router} from './src/routes/Router';
import {AuthProvider} from './src/contexts/Auth';
import './global.css';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from './src/styles/globalStyles';
import RNBootSplash from 'react-native-bootsplash';

// Ignorar warnings específicos que podem estar causando problemas
LogBox.ignoreLogs([
  'Require cycle:',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

// Configurar fonte padrão para todos os componentes Text e TextInput
Text.defaultProps = {
  ...Text.defaultProps,
  style: [globalStyles.defaultText, Text.defaultProps?.style],
};

TextInput.defaultProps = {
  ...TextInput.defaultProps,
  style: [globalStyles.defaultInput, TextInput.defaultProps?.style],
};

export default function App() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await RNBootSplash.hide({ fade: true });
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };
    
    hideSplash();
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
