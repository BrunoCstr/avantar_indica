import firestore from '@react-native-firebase/firestore';

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
): Promise<string | null> {
  try {
    const docRef = firestore().collection('packagedIndications').doc();

    const generatedId = docRef.id;

    await docRef.set({
      indications,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      indicator_name,
      indicator_id,
      unitId,
      unitName,
      packagedIndicationId: generatedId,
    });

    return generatedId;
  } catch (error) {
    console.error('Erro ao enviar indicações em massa:', error);
    return null;
  }
}
