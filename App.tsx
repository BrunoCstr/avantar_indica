import React from 'react';
import {Router} from './src/routes/Router';
import {AuthProvider} from './src/contexts/Auth';
import './global.css';

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
