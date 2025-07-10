import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import {defineSecret} from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');

// EDITAR AQUI PRA VERSÃO DE PROPOSTA ACEITA

// Função para formatar valores monetários
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const closedProposal = functions.firestore.onDocumentUpdated(
  {
    document: 'opportunities/{opportunityId}',
    secrets: [EMAIL_USER, EMAIL_PASS],
  },
  async event => {
    // Pegando os dados da oportunidade antes e depois da atualização
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      console.error('Dados do documento não encontrados');
      return;
    }

    // Verificar se o status mudou para "FECHADO"
    if (beforeData.status !== 'FECHADO' && afterData.status === 'FECHADO') {
      console.log('Status mudou para FECHADO, enviando notificações...');

      // Buscar o usuário que fez a indicação pelo indicator_id
      if (!afterData.indicator_id) {
        console.error('indicator_id não encontrado na oportunidade');
        return;
      }

      const userRef = admin
        .firestore()
        .collection('users')
        .doc(afterData.indicator_id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error('Usuário indicador não encontrado');
        return;
      }

      const userData = userDoc.data();
      const userId = userDoc.id;

      // Verificar se o usuário tem preferências de notificação habilitadas para status
      const statusNotificationEnabled = userData?.notificationPreferences?.status !== false;
      
      if (!statusNotificationEnabled) {
        console.log('Usuário tem notificações de status desabilitadas, pulando envio');
        return;
      }

      // Criando notificação na subcoleção notifications
      try {
        const notificationRef = admin
          .firestore()
          .collection(`users/${userId}/notifications`)
          .doc();

        await notificationRef.set({
          title: '🎉 Sua indicação foi fechada!',
          body: `Parabéns! A indicação de ${afterData.fullName} foi fechada com sucesso. Você pode verificar sua comissão na carteira.`,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          documentId: notificationRef.id,
          type: 'closed_proposal',
          opportunityId: event.params.opportunityId,
        });

        // Enviando push notification se o usuário tem fcmToken
        if (userData?.fcmToken) {
          const payload = {
            token: userData.fcmToken,
            notification: {
              title: '🎉 Sua indicação foi fechada!',
              body: `Parabéns! A indicação de ${afterData.name} foi fechada com sucesso. Você pode verificar sua comissão na carteira.`,
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
            console.log('Push notification enviada com sucesso');
          } catch (error) {
            console.error('Erro ao enviar push notification:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao criar notificação para usuário:', userId, error);
      }

      // Enviando email para o usuário que fez a indicação
      if (userData?.email) {
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
          to: userData.email,
          subject: '🎉 Sua indicação foi fechada!',
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
                <h1 style='color:#6600CC; font-size: 24px'>🎉 Sua indicação foi fechada!</h1>
                <p>Olá, ${userData.displayName || userData.name || 'Indicador'}!</p>
                <p>Temos uma ótima notícia! Sua indicação foi fechada com sucesso.</p>
                <p>Segue os dados da indicação:</p>
                <div class='indication'>
                  <span><strong>Cliente indicado:</strong> ${afterData.name}</span>
                  <span><strong>Telefone:</strong> ${afterData.phone}</span>
                  ${afterData.commission ? `<span><strong>Sua comissão:</strong> R$ ${formatCurrency(afterData.commission)}</span>` : ''}
                </div>
                <p></p>
                <a class='anchorLink' href="https://indica.avantar.com.br">👉 Acesse agora o app para ver sua comissão na carteira!</a>
                <br>
                <span>Parabéns pela indicação! Continue indicando e ganhe mais! 🚀</span>
                <span style='color:#6600CC'>Equipe Avantar Indica</span>
              </div>
            </div>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('E-mail enviado com sucesso para o indicador');
        } catch (error) {
          console.error('Erro ao enviar email:', error);
        }
      }
    }
  },
);
