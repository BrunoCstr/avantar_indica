import React from 'react';
import {Router} from './src/routes/Router';
import {AuthProvider} from './src/contexts/Auth';
import './global.css';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

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
