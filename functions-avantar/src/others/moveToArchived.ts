import * as functions from 'firebase-functions/v1';

const STATUS_QUE_ARQUIVAM_AUTOMATICAMENTE = [
  'NÃO INTERESSOU',
  'NÃO FECHADO',
  'SEGURO RECUSADO',
];

export const moveToArchived = functions.firestore
  .document('opportunities/{opportunityId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    const novoStatus = after.status;
    const statusAntigo = before.status;

    // Só executa se o status foi alterado
    if (novoStatus !== statusAntigo) {
      if (STATUS_QUE_ARQUIVAM_AUTOMATICAMENTE.includes(novoStatus)) {
        const docRef = change.after.ref;

        // Se já está arquivado, não faz nada
        if (!after.archived) {
          await docRef.update({archived: true});
        }
      }
    }

    return null;
  });
