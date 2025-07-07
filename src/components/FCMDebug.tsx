import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useAuth} from '../contexts/Auth';
import firestore, {doc, getDoc} from '@react-native-firebase/firestore';

export function FCMDebug() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const {userData} = useAuth();

  const checkPermission = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      setPermissionStatus(authStatus.toString());
      return authStatus;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setPermissionStatus('error');
      return null;
    }
  };

  const requestPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      setPermissionStatus(authStatus.toString());
      Alert.alert('Permissão', `Status: ${authStatus}`);
      return authStatus;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      Alert.alert('Erro', 'Erro ao solicitar permissão');
      return null;
    }
  };

  const getCurrentToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      Alert.alert('FCM Token', token || 'Token não disponível');
      return token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      Alert.alert('Erro', 'Erro ao obter FCM token');
      return null;
    }
  };

  const getStoredToken = async () => {
    if (!userData?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      const userRef = doc(firestore(), 'users', userData.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const token = data.fcmToken;
        setStoredToken(token);
        Alert.alert('Token Armazenado', token || 'Token não encontrado no Firestore');
      } else {
        Alert.alert('Erro', 'Documento do usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter token armazenado:', error);
      Alert.alert('Erro', 'Erro ao obter token do Firestore');
    }
  };

  const compareTokens = () => {
    if (fcmToken === storedToken) {
      Alert.alert('Comparação', 'Tokens são iguais! ✅');
    } else {
      Alert.alert('Comparação', 'Tokens são diferentes! ❌');
    }
  };

  useEffect(() => {
    checkPermission();
    getCurrentToken();
    getStoredToken();
  }, [userData?.uid]);

  return (
    <View style={{padding: 16, backgroundColor: '#f0f0f0'}}>
      <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
        Debug FCM
      </Text>
      
      <Text>Status da Permissão: {permissionStatus}</Text>
      <Text>FCM Token Atual: {fcmToken ? 'Disponível' : 'Não disponível'}</Text>
      <Text>Token Armazenado: {storedToken ? 'Disponível' : 'Não disponível'}</Text>
      
      <View style={{marginTop: 16, gap: 8}}>
        <TouchableOpacity
          style={{backgroundColor: '#007AFF', padding: 8, borderRadius: 4}}
          onPress={requestPermission}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Solicitar Permissão
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{backgroundColor: '#34C759', padding: 8, borderRadius: 4}}
          onPress={getCurrentToken}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Obter Token Atual
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{backgroundColor: '#FF9500', padding: 8, borderRadius: 4}}
          onPress={getStoredToken}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Obter Token Armazenado
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{backgroundColor: '#AF52DE', padding: 8, borderRadius: 4}}
          onPress={compareTokens}>
          <Text style={{color: 'white', textAlign: 'center'}}>
            Comparar Tokens
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 