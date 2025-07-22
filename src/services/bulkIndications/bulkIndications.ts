import firestore from '@react-native-firebase/firestore';
import {useAuth} from '../../contexts/Auth';

interface Indication {
  name: string;
  phone: string;
}

interface BulkIndicationData {
  indications: Indication[];
  sentAt: any; // serverTimestamp, aqui no RN n tipa igual na web, ent prefiro deixar como any.
  indicator_name: string;
  indicator_id: string;
  unitId: string;
  unitName: string;
  packagedIndicationId: string;
}

export async function sendBulkIndications(
  indications: Indication[],
  indicator_name: string,
  indicator_id: string,
  unitId: string,
  unitName: string,
  profilePicture: string,
): Promise<string | null> {
  try {
    const docRef = firestore().collection('packagedIndications').doc();

    const docId = docRef.id;

    await docRef.set({
      indications,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      indicator_name,
      indicator_id,
      profilePicture,
      unitId,
      unitName,
      packagedIndicationId: docId,
      total: indications.length,
      processed: 0,
      pending: indications.length,
      progress: 0,
    });

    return docId;
  } catch (error) {
    console.error('Erro ao enviar indicações em massa:', error);
    return null;
  }
}

export async function getPackagedIndicationsByUserId(userId: string) {
  try {
    const packagedIndicationsRef = firestore().collection(
      'packagedIndications',
    );
    const q = packagedIndicationsRef.where('indicator_id', '==', userId);
    const querySnapshot = await q.get();
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: 'Lote em massa',
        status:
          data.status || (data.progress === 100 ? 'Concluído' : 'Em Andamento'),
        product: `${data.total || data.indications?.length || 0} indicações`,
        updatedAt: data.updatedAt,
        indicator_id: data.indicator_id,
        createdAt: data.createdAt,
        updatedAtOriginal: data.updatedAt,
        type: 'bulk' as const,
        indications: data.indications || [],
        progress: data.progress || 0,
        total: data.total || data.indications?.length || 0,
        processed: data.processed || 0,
        packagedIndicationId: data.packagedIndicationId,
        unitName: data.unitName,
        indicator_name: data.indicator_name,
        unitId: data.unitId,
      };
    });
    return results;
  } catch (error) {
    console.error('Erro ao buscar indicações em massa:', error);
    return [];
  }
}
