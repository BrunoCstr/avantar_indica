/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Configuração para evitar conflitos do React Native SVG
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Tried to register two views with the same name')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

AppRegistry.registerComponent(appName, () => App);
