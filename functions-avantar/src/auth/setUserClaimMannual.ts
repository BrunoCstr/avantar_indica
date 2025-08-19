import * as admin from "firebase-admin";

import serviceAccount from "../../../avantar-indica-firebase-adminsdk-a0cev-97e511e554.json"; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

async function setClaimByEmail(email: string) {
  try {
    // 1. Busca o usuário pelo e-mail
    const user = await admin.auth().getUserByEmail(email);

    // 2. Define a claim personalizada
    await admin.auth().setCustomUserClaims(user.uid, { rule: "admin_franqueadora" });

    console.log(`Claim 'admin' setada para o usuário: ${email}`);
  } catch (error) {
    console.error("Erro ao setar claim:", error);
  }
}

// exemplo de uso
setClaimByEmail("brunocastro@avantar.com.br");
