import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export interface NotificationPreferences {
  campaigns: boolean;
  status: boolean;
  withdraw: boolean;
}

/**
 * Busca as preferências de notificação do usuário no Firestore.
 * @param userId ID do usuário
 * @returns Promise<NotificationPreferences> Preferências de notificação
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  try {
    const userDoc = await firestore()
      .collection('users')
      .doc(userId)
      .get();
    
    const userData = userDoc.data();
    
    // Valores padrão caso não existam no banco
    const defaultPreferences: NotificationPreferences = {
      campaigns: true,
      status: true,
      withdraw: true,
    };
    
    return userData?.notificationPreferences || defaultPreferences;
  } catch (error) {
    console.error('Erro ao buscar preferências de notificação:', error);
    // Retorna valores padrão em caso de erro
    return {
      campaigns: true,
      status: true,
      withdraw: true,
    };
  }
}

/**
 * Valida se a senha é forte o suficiente
 * @param password Senha a ser validada
 * @returns Objeto com isValid (boolean) e message (string)
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)');
  }
  
  // Verificar senhas comuns/fáceis
  const commonPasswords = [
    '12345678', 'password', 'qwerty123', 'abc12345', 'senha123',
    'admin123', 'user123', 'test123', '123456789', 'password123'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Não pode ser uma senha comum');
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      message: `A senha deve conter:\n• ${errors.join('\n• ')}` 
    };
  }
  
  return { isValid: true, message: 'Senha válida' };
}

/**
 * Atualiza as preferências de notificação do usuário no Firestore.
 * @param userId ID do usuário
 * @param preferences Objeto com as preferências de notificação
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreferences
): Promise<void> {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .set({ notificationPreferences: preferences }, { merge: true });
  } catch (error) {
    console.error('Erro ao atualizar preferências de notificação:', error);
    throw error;
  }
}

/**
 * Altera a senha do usuário no Firebase Auth
 * @param currentPassword Senha atual
 * @param newPassword Nova senha
 * @returns Promise<void>
 */
export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const user = auth().currentUser;
    
    if (!user || !user.email) {
      throw new Error('Usuário não autenticado');
    }
    
    // Reautenticar o usuário antes de alterar a senha
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    
    await user.reauthenticateWithCredential(credential);
    
    // Alterar a senha
    await user.updatePassword(newPassword);
    
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    
    switch (error.code) {
      case 'auth/wrong-password':
        throw new Error('Senha atual incorreta');
      case 'auth/weak-password':
        throw new Error('A nova senha é muito fraca');
      case 'auth/requires-recent-login':
        throw new Error('É necessário fazer login novamente para alterar a senha');
      case 'auth/network-request-failed':
        throw new Error('Erro de conexão. Verifique sua internet');
      default:
        throw new Error('Erro ao alterar senha. Tente novamente');
    }
  }
}

/**
 * Desativa a conta do usuário: marca disabled: true no Firestore e faz signOut no Auth
 * @param userId ID do usuário
 */
export async function deactivateAccount(userId: string): Promise<void> {
  try {
    // Atualiza o campo disabled no Firestore
    await firestore().collection('users').doc(userId).set({ disabled: true }, { merge: true });
    // Faz signOut do usuário
    await auth().signOut();
  } catch (error) {
    console.error('Erro ao desativar conta:', error);
    throw error;
  }
}
