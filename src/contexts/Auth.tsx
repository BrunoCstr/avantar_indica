import app from '../../firebaseConfig';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from '@react-native-firebase/auth';
import {
  collection,
  setDoc,
  query,
  where,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
  doc,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {getDefaultProfilePicture} from '../utils/getDefaultProfilePicture';
import messaging from '@react-native-firebase/messaging';

const auth = getAuth(app);
const db = getFirestore(app);

interface UserData {
  displayName: string;
  email: string;
  affiliated_to: string;
  isFirstLogin: boolean;
  uid: string;
  profilePicture: string;
  phone: string;
  pixKey: string;
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
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registrationStatus: boolean;
  forgotPassword: (email: string) => Promise<string | null>;
  isLoading: boolean;
  userData: UserData | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      setIsLoading(true);

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        try {
          await user.reload(); // Recarrega pq pode ser que o token esteja armazenado no cache.
          const idTokenResult = await user.getIdTokenResult();

          if (idTokenResult.claims.disabled) {
            await signOut(auth);
          }

          if (!idTokenResult) {
            throw new Error('Usuário inválido!');
          }

          setIsUserAuthenticated(true);

          const userRef = doc(db, 'users', user.uid);
          unsubscribeSnapshot = onSnapshot(
            userRef,
            snapshot => {
              if (snapshot.exists) {
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
                });
              }
              setIsLoading(false);
            },
            error => {
              console.error('Erro no snapshot:', error);
              setIsLoading(false);
            },
          );
        } catch (err) {
          await signOut(auth);
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            fcmToken: null,
          });
          setIsUserAuthenticated(false);
          setregistrationStatus(false);
          setUserData(null);
        }
      } else {
        setIsUserAuthenticated(false);
        setregistrationStatus(false);
        setUserData(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signUp(
    fullName: string,
    email: string,
    password: string,
    affiliated_to: string,
    phone: string,
    unitName: string,
  ) {
    console.log('🔄 Iniciando cadastro...');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('✅ Usuário criado no Auth:', userCredential.user.uid);

      const user = userCredential.user;
      const phoneCleaned = phone.replace(/\D/g, '');
      const profilePictureUrl = await getDefaultProfilePicture();
      const fcmToken = await messaging().getToken();
      console.log('🔄 Preparando dados do usuário...', {
        uid: user.uid,
        phoneCleaned,
      });

      console.log('parâmetros do usuário:', {
        profilePicture: profilePictureUrl,
      });

      await setDoc(
        doc(db, 'users', user.uid),
        {
          fullName,
          email,
          affiliated_to,
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
        },
        {merge: true},
      );

      await updateProfile(user, {displayName: fullName});
    } catch (err: any) {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      console.error('Erro ao criar usuário:', err);
      return err.code;
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async docSnap => {
        await updateDoc(doc(db, 'users', docSnap.id), {isFirstLogin: false});
      });
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          Alert.alert('Falha ao realizar o login', 'E-mail inválido!');
          break;
        case 'auth/user-disabled':
          Alert.alert('Falha ao realizar o login', 'Conta desativada.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Falha ao realizar o login', 'Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Falha ao realizar o login', 'Senha incorreta.');
          break;
        case 'auth/too-many-requests':
          Alert.alert(
            'Falha ao realizar o login',
            'Muitas tentativas. Tente novamente mais tarde.',
          );
          break;
        case 'auth/network-request-failed':
          Alert.alert(
            'Falha ao realizar o login',
            'Falha de conexão com a rede.',
          );
          break;
        case 'auth/invalid-credential':
          Alert.alert('Falha ao realizar o login', 'Credenciais inválidas.');
          break;
        default:
          Alert.alert('Erro desconhecido', 'entre em contato com o suporte!');
          console.error(err);
      }
    }
  }

  async function handleSignOut() {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('Nenhum usuário autenticado no momento.');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        fcmToken: null,
      });

      await signOut(auth);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/no-current-user':
          Alert.alert(
            'Falha ao sair',
            'Nenhum usuário autenticado no momento.',
          );
          break;
        case 'auth/network-request-failed':
          Alert.alert('Falha ao sair', 'Falha de conexão com a rede.');
          break;
        default:
          Alert.alert(
            'Erro desconhecido ao deslogar, entre em contato com o suporte!',
          );
      }
    }
  }

  async function forgotPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
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
