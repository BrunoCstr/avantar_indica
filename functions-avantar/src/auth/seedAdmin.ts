import admin from 'firebase-admin';
import servicesAccountJSON from './../../../avantar-indica-firebase-adminsdk-a0cev-005b2a5df5.json';

const serviceAccount = {
  projectId: servicesAccountJSON.project_id,
  clientEmail: servicesAccountJSON.client_email,
  privateKey: servicesAccountJSON.private_key,
} as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function seed() {
  try {
    const user = await admin
      .auth()
      .getUserByEmail('tecnologia@avantar.com.br');

    await admin
      .auth()
      .setCustomUserClaims(user.uid, {rule: 'admin_unidade'});

    await db.collection('users').doc(user.uid).update({
      rule: 'admin_unidade',
    });

    console.log('Claim atribuída!');
  } catch (error) {
    console.error('Claim não atribuída: ', error);
  }
}

seed();
