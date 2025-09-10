import React, {createContext, useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore, {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import {getDefaultProfilePicture} from '../utils/getDefaultProfilePicture';
import {getUserLocation, getDeviceInfo} from '../utils/getUserLocation';
import messaging from '@react-native-firebase/messaging';
import {validatePassword} from '../services/settings/settings';

const db = firestore();

interface UserData {
  displayName: string;
  email: string;
  affiliated_to: string;
  isFirstLogin: boolean;
  uid: string;
  profilePicture: string;
  phone: string;
  pixKey: string;
  unitName: string;
  rule: string;
}

interface AuthContextData {
  userAuthenticated: boolean;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    affiliated_to: string,
    phone: string,
    unitName: string,
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  registrationStatus: boolean;
  forgotPassword: (email: string) => Promise<string | null>;
  isLoading: boolean;
  userData: UserData | null;
  isFirebaseInitialized: boolean;
  loadingProgress: number;
  loadingMessage: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [userAuthenticated, setIsUserAuthenticated] = useState(false);
  const [registrationStatus, setregistrationStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Inicializando...');

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    const unsubscribe = auth().onAuthStateChanged(async (user: any) => {
      try {
        setIsLoading(true);
        setLoadingProgress(10);
        setLoadingMessage('Verificando autenticação...');

        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
          unsubscribeSnapshot = null;
        }

        if (user) {
          try {
            setLoadingProgress(30);
            setLoadingMessage('Validando token...');
            await user.reload(); // Recarrega pq pode ser que o token esteja armazenado no cache.
            const idTokenResult = await user.getIdTokenResult();

            if (idTokenResult.claims.disabled) {
              await auth().signOut();
              return;
            }

            if (!idTokenResult) {
              throw new Error('Usuário inválido!');
            }

            setLoadingProgress(50);
            setLoadingMessage('Carregando dados do usuário...');
            setIsUserAuthenticated(true);

            const userRef = doc(db, 'users', user.uid);
            unsubscribeSnapshot = onSnapshot(
              userRef,
              snapshot => {
                try {
                  if (snapshot.exists) {
                    setLoadingProgress(80);
                    setLoadingMessage('Processando informações...');
                    const data = snapshot.data()!;
                    setregistrationStatus(data.registration_status);
                    setUserData({
                      displayName: data.fullName,
                      email: data.email,
                      isFirstLogin: data.isFirstLogin,
                      affiliated_to: data.affiliated_to,
                      uid: data.uid,
                      profilePicture: data.profilePicture,
                      phone: data.phone,
                      pixKey: data.pixKey,
                      unitName: data.unitName,
                      rule: data.rule,
                    });
                  }
                  setLoadingProgress(100);
                  setLoadingMessage('Concluído!');
                } catch (error) {
                  console.error('Erro ao processar dados do usuário:', error);
                } finally {
                  setTimeout(() => {
                    setIsLoading(false);
                    setIsFirebaseInitialized(true);
                  }, 500);
                }
              },
              error => {
                console.error('Erro no snapshot:', error);
                setIsLoading(false);
                setIsFirebaseInitialized(true);
              },
            );
          } catch (err) {
            console.error('Erro ao processar usuário autenticado:', err);
            await auth().signOut();
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              fcmToken: null,
            });
            setIsUserAuthenticated(false);
            setregistrationStatus(false);
            setUserData(null);
            setIsLoading(false);
            setIsFirebaseInitialized(true);
          }
        } else {
          setLoadingProgress(100);
          setLoadingMessage('Usuário não autenticado');
          setIsUserAuthenticated(false);
          setregistrationStatus(false);
          setUserData(null);
          setTimeout(() => {
            setIsLoading(false);
            setIsFirebaseInitialized(true);
          }, 500);
        }
      } catch (error) {
        console.error('Erro geral no contexto de autenticação:', error);
        setIsUserAuthenticated(false);
        setregistrationStatus(false);
        setUserData(null);
        setIsLoading(false);
        setIsFirebaseInitialized(true);
      }
    });

    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      unsubscribe();
    };
  }, []);

  async function signUp(
    fullName: string,
    email: string,
    password: string,
    affiliated_to: string,
    phone: string,
    unitName: string,
  ) {
    try {
      // Validar força da senha antes de criar o usuário
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const user = userCredential.user;
      const phoneCleaned = phone.replace(/\D/g, '');
      const profilePictureUrl = await getDefaultProfilePicture();
      const fcmToken = await messaging().getToken();

      // Obter localização do usuário
      const userLocation = await getUserLocation();
      const deviceInfo = getDeviceInfo();

      await setDoc(
        doc(db, 'users', user.uid),
        {
          fullName,
          email,
          affiliated_to,
          unitId: affiliated_to,
          registration_status: false,
          createdAt: serverTimestamp(),
          uid: user.uid,
          isFirstLogin: true,
          fcmToken: fcmToken,
          profilePicture: profilePictureUrl,
          phone: phoneCleaned,
          pixKey: null,
          unitName: unitName,
          disabled: false,
          notificationsPreferences: {
            campaigns: true,
            withdraw: true,
            status: true,
            email: true,
            whatsapp: true,
            newIndications: true,
            newWithdraw: true,
          },
          balance: 0,
        },
        {merge: true},
      );

      // Registrar aceite dos termos usando Cloud Function
      try {
        await functions().httpsCallable('registerTermsAcceptance')({
          uid: user.uid,
          email: email,
          fullName: fullName,
          userLocation: userLocation,
          deviceInfo: deviceInfo,
        });
      } catch (termsError) {
        console.warn('Erro ao registrar aceite dos termos:', termsError);
        // Não falha o cadastro se o registro dos termos falhar
      }

      await user.updateProfile({displayName: fullName});
    } catch (err: any) {
      if (auth().currentUser) {
        await auth().currentUser?.delete();
      }
      console.error('Erro ao criar usuário:', err);

      // Se for erro de validação de senha, retornar código específico
      if (err.message && err.message.includes('A senha deve conter:')) {
        return 'auth/weak-password';
      }

      return err.code;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Atualizar o documento do usuário diretamente
      const userRef = doc(db, 'users', user.uid);

      // Solicitar permissões de notificação e obter FCM token
      let fcmToken = null;
      try {
        await messaging().requestPermission();
        fcmToken = await messaging().getToken();
      } catch (fcmError) {
        console.warn('Erro ao obter FCM token durante login:', fcmError);
      }

      // Atualizar o documento do usuário
      await updateDoc(userRef, {
        isFirstLogin: false,
        fcmToken: fcmToken,
      });
    } catch (err: any) {
      console.error('Erro ao logar o usuário:', err);

      // Se for erro de validação de senha, retornar código específico
      if (err.message && err.message.includes('A senha deve conter:')) {
        return 'auth/weak-password';
      }

      return err.code;
    }
  }

  async function handleSignOut() {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        throw new Error('Nenhum usuário autenticado no momento.');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        fcmToken: null,
      });

      await auth().signOut();
    } catch (err: any) {
      return err.code;
    }
  }

  async function forgotPassword(email: string) {
    try {
      await auth().sendPasswordResetEmail(email);
      return null;
    } catch (err: any) {
      return err.code;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userAuthenticated,
        signUp,
        signIn,
        signOut: handleSignOut,
        registrationStatus,
        forgotPassword,
        isLoading,
        userData,
        isFirebaseInitialized,
        loadingProgress,
        loadingMessage,
      }}>
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
