import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onProfilePictureUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const oldData = change.before.data();
    const newData = change.after.data();

    // Se o nome mudou, atualizar todos os documentos relacionados
    if (oldData.profilePicture !== newData.profilePicture) {
      const batch = admin.firestore().batch();

      // Buscar todas as indicações deste usuário
      const indicacoesSnapshot = await admin
        .firestore()
        .collection('indications')
        .where('indicator_id', '==', userId)
        .get();

      indicacoesSnapshot.forEach(doc => {
        batch.update(doc.ref, {profilePicture: newData.profilePicture});
      });

      // Buscar todas as oportunidades deste usuário
      const opportunitiesSnapshot = await admin
        .firestore()
        .collection('opportunities')
        .where('indicator_id', '==', userId)
        .get();

      opportunitiesSnapshot.forEach(doc => {
        batch.update(doc.ref, {profilePicture: newData.profilePicture});
      });

      // Buscar todas as indicações empacotadas deste usuário
      const packagedIndicationsSnapshot = await admin
        .firestore()
        .collection('packagedIndications')
        .where('indicator_id', '==', userId)
        .get();

      packagedIndicationsSnapshot.forEach(doc => {
        batch.update(doc.ref, {profilePicture: newData.profilePicture});
      });

      // Buscar todos os saques deste usuário
      const withdrawalsSnapshot = await admin
        .firestore()
        .collection('withdrawals')
        .where('userId', '==', userId)
        .get();

      withdrawalsSnapshot.forEach(doc => {
        batch.update(doc.ref, {profilePicture: newData.profilePicture});
      });

      // Buscar todas as campanhas enviadas por este usuário
      const campaignsSnapshot = await admin
        .firestore()
        .collection('campaigns')
        .where('sentByUserId', '==', userId)
        .get();

      campaignsSnapshot.forEach(doc => {
        batch.update(doc.ref, {profilePicture: newData.profilePicture});
      });

      await batch.commit();
    }
  });
