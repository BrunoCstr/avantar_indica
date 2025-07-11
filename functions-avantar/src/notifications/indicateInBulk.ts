import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import {defineSecret} from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');
const WEBHOOK_BOTCONVERSA = defineSecret('WEBHOOK_BOTCONVERSA_EM_MASSA');

export const indicatedInBulk = functions.firestore.onDocumentCreated(
  {
    document: 'packagedIndications/{packagedIndicationId}',
    secrets: [EMAIL_USER, EMAIL_PASS, WEBHOOK_BOTCONVERSA],
  },
  async event => {
    // Pegando os dados da indicação
    const newPackagedIndication = event.data?.data();

    if (!newPackagedIndication) {
      console.error('Dados do documento não encontrados');
      return;
    }

    // Pegando os dados da unidade que recebeu a indicação
    const docRef = admin
      .firestore()
      .collection('units')
      .doc(newPackagedIndication.unitId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error('Unidade não encontrada');
      return;
    }

    const unitData = doc.data();

    // Buscando usuários admin_unidade da unidade que recebeu a indicação
    try {
      const usersQuery = admin
        .firestore()
        .collection('users')
        .where('affiliated_to', '==', newPackagedIndication.unitId)
        .where('rule', 'in', ['admin_unidade', 'admin_franqueadora']);

      const usersSnapshot = await usersQuery.get();

      // Criando notificações para cada admin_unidade encontrado
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Verificar se o usuário tem preferências de notificação habilitadas para novas indicações
        const newIndicationsEnabled = userData?.notificationsPreferences?.newIndications !== false;
        
        if (!newIndicationsEnabled) {
          console.log(`Usuário ${userId} tem notificações de novas indicações desabilitadas, pulando notificação`);
          continue;
        }

        // Criando notificação na subcoleção notifications
        try {
          const notificationRef = admin
            .firestore()
            .collection(`users/${userId}/notifications`)
            .doc();

          await notificationRef.set({
            title: '📦 Nova indicação em massa recebida!',
            body: `Você acabou de receber ${newPackagedIndication.indications.length} novas indicações. Acesse o painel para ver os detalhes e entrar em contato com os clientes.`,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            documentId: notificationRef.id,
            type: 'mass_indication_received',
          });

          // Enviando push notification se o usuário tem fcmToken
          if (userData.fcmToken) {
            const payload = {
              token: userData.fcmToken,
              notification: {
                title: '📦 Nova indicação em massa recebida!',
                body: `Você acabou de receber ${newPackagedIndication.indications.length} novas indicações. Acesse o painel para ver os detalhes e entrar em contato com os clientes.`,
              },
              android: {
                notification: {
                  icon: 'ic_notification',
                  color: '#6600CC',
                },
              },
              apns: {
                payload: {
                  aps: {
                    badge: 1,
                    sound: 'default',
                  },
                },
              },
            };

            try {
              await admin.messaging().send(payload);
            } catch (error) {
              console.error('Erro ao enviar push notification:', error);
            }
          }
        } catch (error) {
          console.error(
            'Erro ao criar notificação para usuário:',
            userId,
            error,
          );
        }
      }
    } catch (error) {
      console.error('Erro ao buscar usuários admin_unidade:', error);
    }

    // Verificar se pelo menos um admin tem email habilitado antes de enviar
    const usersQuery = admin
      .firestore()
      .collection('users')
      .where('affiliated_to', '==', newPackagedIndication.unitId)
      .where('rule', 'in', ['admin_unidade', 'admin_franqueadora']);

    const usersSnapshot = await usersQuery.get();
    const hasEmailEnabled = usersSnapshot.docs.some(userDoc => {
      const userData = userDoc.data();
      return userData?.notificationsPreferences?.email !== false;
    });

    // Mandando o email para a unidade que recebeu a indicação (apenas se algum admin tem email habilitado)
    if (hasEmailEnabled) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.dreamhost.com',
        port: 465,
        secure: true,
        auth: {
          user: EMAIL_USER.value(),
          pass: EMAIL_PASS.value(),
        },
      });

      const mailOptions = {
        from: 'noreply@indica.avantar.com.br',
        to: unitData?.email,
        subject: '📦 Você recebeu uma nova indicação em massa!',
        html: `
        <br>
           <div style="text-align: center;">
            <img src="https://dashboard.avantar.com.br/images/1.png" style="width:300px; margin: 0 auto;">
           </div>
          <br>
          <br>
          <style>
          .container {
          display: flex;
          justify-content: center;
          align-items: center;
          }
    
          .div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background-color: #F6F3FF;
          width: 80%;
          border-radius: 12px;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-bottom: 4rem;
          padding-top: 2rem;
          }

          .indication {
            display: flex;
            flex-direction: column;
          }

          .anchorLink {
            cursor: pointer;
          }
          </style>
          <div class='container'>
            <div style="font-family: familjen grotesk;" class="div">
              <h1 style='color:#6600CC; font-size: 24px'>Você recebeu uma nova indicação em massa!</h1>
              <p>Olá! Acabamos de receber uma nova indicação em massa atribuída à sua unidade.</p>
              <p>Segue os dados:</p>
              <div class='indication'>
                <span>Indicador: ${newPackagedIndication.indicator_name}</span>
                <span>Quantidade de Indicações enviadas: ${newPackagedIndication.indications.length}</span>
              </div>
              <p></p>
              <a class='anchorLink' href="indica.avantar.com.br">👉 Acesse agora o painel para conferir os detalhes...</a>
              <br>
              <span>Boas vendas! 🚀</span>
              <span style='color:#6600CC'>Equipe de Desenvolvimento Avantar</span>
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }

    // Verificar se pelo menos um admin tem WhatsApp habilitado antes de enviar
    const hasWhatsAppEnabled = usersSnapshot.docs.some(userDoc => {
      const userData = userDoc.data();
      return userData?.notificationsPreferences?.whatsapp !== false;
    });

    // Mandando as infos pro webhook do BotConversa (apenas se algum admin tem WhatsApp habilitado)
    if (hasWhatsAppEnabled) {
      const webhookUrl = WEBHOOK_BOTCONVERSA.value();
      const unitPhone = unitData?.phone;
      const unitName = unitData?.name;

      const payload = {
        indicator_name: newPackagedIndication.indicator_name,
        quantity_of_indications: newPackagedIndication.indications.length,
        unit_name: unitName,
        unit_phone: unitPhone,
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error('Erro ao enviar Whatsapp:', error);
      }
    }
  },
);
