import firestore from '@react-native-firebase/firestore';

export async function getTop4ProductsByUser(userId: string) {
  let knownProducts: string[] = [];

  try {
    const totalSnapshot = await firestore()
      .collection('indications')
      .where('indicator_id', '==', userId)
      .count()
      .get();

    const totalIndications = totalSnapshot.data().count;

    if (totalIndications === 0) {
      return [];
    }

    const productsSnapshot = await firestore().collection('products').get();

    productsSnapshot.docs.forEach(doc => {
      knownProducts.push(doc.data().name);
    });

    const productCounts = await Promise.all(
      knownProducts.map(async product => {
        const countSnapshot = await firestore()
          .collection('indications')
          .where('indicator_id', '==', userId)
          .where('product', '==', product)
          .count()
          .get();

        const count = countSnapshot.data().count;
        const percentage =
          count > 0 ? Math.round((count / totalIndications) * 100) : 0;

        return {
          product,
          count,
          percentage,
          totalIndications,
        };
      }),
    );

    const topProducts = productCounts
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return topProducts;
  } catch (error) {
    console.error('Erro ao buscar top produtos:', error);
    throw error;
  }
}
