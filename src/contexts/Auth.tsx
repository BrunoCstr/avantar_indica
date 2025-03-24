import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export interface AuthData {
  uid: string;
  email: string | null;
  token: string;
}

interface AuthContextData {
  authData?: AuthData;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    cpf: string,
    affiliated_to: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}


export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);


export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      // Tenta pegar dado de auth pra manter o usuário autenticado
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        // Converte de volta pra objeto, para armazenar no estado
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(
    fullName: string,
    email: string,
    password: string,
    cpf: string,
    affiliated_to: string,
  ) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await userCredential.user.updateProfile({displayName: fullName});

      await firestore().collection('users').doc(userCredential.user.uid).set({
        fullName,
        email,
        cpf,
        affiliated_to,
        registration_status: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Mandar pra tela de aguardando aprovação e notificar a unidade e mandar os dados para o CRUD dela.
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          Alert.alert('E-mail já cadastrado.');
          break;
        case 'auth/invalid-email':
          Alert.alert('E-mail inválido.');
          break;
        case 'auth/weak-password':
          Alert.alert('Senha muito fraca.');
          break;
        case 'auth/operation-not-allowed':
          Alert.alert(
            'Criação de conta com e-mail e senha não está habilitada.',
          );
          break;
        case 'auth/network-request-failed':
          Alert.alert('Falha de conexão com a rede.');
          break;
        default:
          Alert.alert('Erro desconhecido, entre em contato com o suporte!');
      }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const authData = await auth().signInWithEmailAndPassword(email, password);

      const userAuthData: AuthData = {
        uid: authData.user.uid,
        email: authData.user.email ?? '',
        token: await authData.user.getIdToken(),
      };

      setAuthData(userAuthData);
      AsyncStorage.setItem('@AuthData', JSON.stringify(authData));
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          Alert.alert('E-mail inválido!');
          break;
        case 'auth/user-disabled':
          Alert.alert('Conta desativada.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Senha incorreta.');
          break;
        case 'auth/too-many-requests':
          Alert.alert('Muitas tentativas. Tente novamente mais tarde.');
          break;
        case 'auth/network-request-failed':
          Alert.alert('Falha de conexão com a rede.');
          break;
        case 'auth/invalid-credential':
          Alert.alert('Credenciais inválidas.');
          break;
        default:
          Alert.alert('Erro desconhecido, entre em contato com o suporte!');
      }
    }
  }

  async function signOut() {
    try {
      await auth().signOut();

      setAuthData(undefined);
      AsyncStorage.removeItem('@AuthData');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/no-current-user':
          Alert.alert('Nenhum usuário autenticado no momento.');
          break;
        case 'auth/network-request-failed':
          Alert.alert('Falha de conexão com a rede.');
          break;
        default:
          Alert.alert(
            'Erro desconhecido ao deslogar, entre em contato com o suporte!',
          );
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{authData, signUp, signIn, signOut, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}