import React from 'react';
import {Text, TextInput} from 'react-native';
import './firebaseConfig';
import {Router} from './src/routes/Router';
import {AuthProvider} from './src/contexts/Auth';
import './global.css';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from './src/styles/globalStyles';

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
