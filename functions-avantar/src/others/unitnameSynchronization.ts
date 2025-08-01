import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onUnitUpdate = functions.firestore
  .document('units/{unitId}')
  .onUpdate(async (change, context) => {
    const unitId = context.params.unitId;
    const oldData = change.before.data();
    const newData = change.after.data();

    // Se o nome da unidade mudou, atualizar todos os documentos relacionados
    if (oldData.unitName !== newData.unitName) {
      const batch = admin.firestore().batch();

      // Buscar todas as indicações deste usuário
      const indicacoesSnapshot = await admin
        .firestore()
        .collection('indications')
        .where('unitId', '==', unitId)
        .get();

      indicacoesSnapshot.forEach(doc => {
        batch.update(doc.ref, {unitName: newData.unitName});
      });

      // Buscar todas as oportunidades deste usuário
      const opportunitiesSnapshot = await admin
        .firestore()
        .collection('opportunities')
        .where('unitId', '==', unitId)
        .get();

      opportunitiesSnapshot.forEach(doc => {
        batch.update(doc.ref, {unitId: newData.unitId});
      });

      // Buscar todas as indicações empacotadas deste usuário
      const packagedIndicationsSnapshot = await admin
        .firestore()
        .collection('packagedIndications')
        .where('unitId', '==', unitId)
        .get();

      packagedIndicationsSnapshot.forEach(doc => {
        batch.update(doc.ref, {unitName: newData.unitName});
      });

      // Buscar todos os saques deste usuário
      const withdrawalsSnapshot = await admin
        .firestore()
        .collection('withdrawals')
        .where('unitId', '==', unitId)
        .get();

      withdrawalsSnapshot.forEach(doc => {
        batch.update(doc.ref, {unitName: newData.unitName});
      });

      // Buscar todas as campanhas enviadas por este usuário
      const campaignsSnapshot = await admin
        .firestore()
        .collection('campaigns')
        .where('unitId', '==', unitId)
        .get();

      campaignsSnapshot.forEach(doc => {
        batch.update(doc.ref, {unitName: newData.unitName});
      });

      await batch.commit();
    }
  });
