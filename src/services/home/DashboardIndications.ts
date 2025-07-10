import firestore from '@react-native-firebase/firestore';

export async function getTop4ProductsByUser(userId: string) {
  let knownProducts: string[] = [];

  try {
    // Buscar total de indicações
    const totalIndicationsSnapshot = await firestore()
      .collection('indications')
      .where('indicator_id', '==', userId)
      .count()
      .get();

    const totalIndications = totalIndicationsSnapshot.data().count;

    // Buscar total de oportunidades
    const totalOpportunitiesSnapshot = await firestore()
      .collection('opportunities')
      .where('indicator_id', '==', userId)
      .count()
      .get();

    const totalOpportunities = totalOpportunitiesSnapshot.data().count;

    // Total combinado
    const totalCombined = totalIndications + totalOpportunities;

    if (totalCombined === 0) {
      return [];
    }

    const productsSnapshot = await firestore().collection('products').get();

    productsSnapshot.docs.forEach(doc => {
      knownProducts.push(doc.data().name);
    });

    const productCounts = await Promise.all(
      knownProducts.map(async product => {
        // Contar indicações por produto
        const indicationsCountSnapshot = await firestore()
          .collection('indications')
          .where('indicator_id', '==', userId)
          .where('product', '==', product)
          .count()
          .get();

        const indicationsCount = indicationsCountSnapshot.data().count;

        // Contar oportunidades por produto
        const opportunitiesCountSnapshot = await firestore()
          .collection('opportunities')
          .where('indicator_id', '==', userId)
          .where('product', '==', product)
          .count()
          .get();

        const opportunitiesCount = opportunitiesCountSnapshot.data().count;

        // Total combinado para este produto
        const count = indicationsCount + opportunitiesCount;
        const percentage =
          count > 0 ? Math.round((count / totalCombined) * 100) : 0;

        return {
          product,
          count,
          percentage,
          totalIndications: totalCombined, // Renomeado para refletir que agora inclui oportunidades
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
