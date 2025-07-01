import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export async function fetchSellersService() {
  const q = firestore().collection('users').where('rule', '==', 'seller');
  const querySnapshot = await q.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createSellerService({ fullName, email, phone, password }: { fullName: string, email: string, phone: string, password: string }) {
  // Cria usuário no Auth
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;
  // Salva no Firestore
  await firestore().collection('users').doc(user.uid).set({
    fullName,
    email,
    phone: phone.replace(/\D/g, ''),
    affiliated_to: '',
    unitName: '',
    rule: 'seller',
    registration_status: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
    uid: user.uid,
    isFirstLogin: true,
    profilePicture: '',
    pixKey: null,
    disabled: false,
  });
  return user.uid;
}

export async function toggleSellerActiveService(sellerId: string, disabled: boolean) {
  await firestore().collection('users').doc(sellerId).update({ disabled: !disabled });
}

export async function updateSellerService(sellerId: string, data: { fullName: string, email: string, phone: string }) {
  await firestore().collection('users').doc(sellerId).update({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone.replace(/\D/g, ''),
  });
}
