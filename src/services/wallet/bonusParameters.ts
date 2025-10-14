import { db } from '../../../firebaseConfig';

export async function getBonusParameter(unitId: string): Promise<any | null> {
  try {
    const unitDoc = await db.collection("units").doc(unitId).get();
    
    if (!unitDoc.exists) {
      return null;
    }

    const data = unitDoc.data();
    return data?.bonusParameters || null;
  } catch (error) {
    console.error("Erro ao buscar parâmetros de comissão:", error);
    return null;
  }
}