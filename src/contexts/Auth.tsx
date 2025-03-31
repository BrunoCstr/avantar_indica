import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import app from '../../firebaseConfig';
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
  addDoc,
  query,
  where,
  getDocs,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

interface AuthContextData {
  userAuthenticated: boolean;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    cpf: string,
    affiliated_to: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registrationStatus: boolean;
  forgotPassword: (email: string) => Promise<void>;
  isLoading: boolean;
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
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          await user.reload(); // Recarrega pq pode ser que o token esteja armazenado no cache.
          const idTokenResult = await user.getIdTokenResult();
          if (!idTokenResult) {
            throw new Error('Usuário inválido!');
          }

          setIsUserAuthenticated(true);

          const q = query(
            collection(db, 'users'),
            where('uid', '==', user.uid),
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            if (doc.exists) {
              const data = doc.data();
              setregistrationStatus(data.registration_status);
            }
          });
        } catch (err) {
          await signOut(auth);
          setIsUserAuthenticated(false);
          setregistrationStatus(false);
        }
      } else {
        setIsUserAuthenticated(false);
        setregistrationStatus(false);
      }

      setIsLoading(false)
    });

    return () => unsubscribe();
  }, []);

  async function signUp(
    fullName: string,
    email: string,
    password: string,
    cpf: string,
    affiliated_to: string,
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        fullName,
        email,
        cpf,
        affiliated_to,
        registration_status: false,
        createdAt: serverTimestamp(),
        uid: user.uid,
      });

      await updateProfile(user, {displayName: fullName});
    } catch (err: any) {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      switch (err.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Falha ao cadastrar o usuário', 'E-mail já cadastrado.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Falha ao cadastrar o usuário', 'E-mail inválido.');
          break;
        case 'auth/weak-password':
          Alert.alert('Falha ao cadastrar o usuário', 'Senha muito fraca.');
          break;
        case 'auth/operation-not-allowed':
          Alert.alert(
            'Falha ao cadastrar o usuário',
            'Criação de conta com e-mail e senha não está habilitada.',
          );
          break;
        case 'auth/network-request-failed':
          Alert.alert(
            'Falha ao cadastrar o usuário',
            'Falha de conexão com a rede.',
          );
          break;
        default:
          Alert.alert(
            'Falha ao cadastrar o usuário',
            'Erro desconhecido, entre em contato com o suporte!',
          );
      }
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      }
    }
  }

  async function handleSignOut() {
    try {
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
      await sendPasswordResetEmail(auth, email)
      Alert.alert('Enviado!', `enviado o link de redefinição para ${email}`);
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          Alert.alert('Erro!', 'Usuário não encontrado.');
        break;
        case "auth/invalid-email":
          Alert.alert('Erro!', 'E-mail inválido.');
        break;
        case "auth/too-many-requests":
          Alert.alert('Erro!', 'Muitas tentativas, tente novamente mais tarde.');
        break;
        case "auth/internal-error":
          Alert.alert('Erro!', 'Ocorreu um erro, tente novamente mais tarde.');
        break;
        case "auth/user-disabled":
          Alert.alert('Erro!', 'Usuário desabilitado!');
        break;
      }
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
        isLoading
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
