import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import {defineSecret} from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');

// Função para formatar valores monetários
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const withdrawalStatus = functions.firestore.onDocumentUpdated(
  {
    document: 'withdrawals/{withdrawalId}',
    secrets: [EMAIL_USER, EMAIL_PASS],
  },
  async event => {
    // Pegando os dados do saque antes e depois da atualização
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      console.error('Dados do documento não encontrados');
      return;
    }

    // Verificar se o status mudou para "PAGO" ou "RECUSADO"
    const statusChanged = beforeData.status !== afterData.status;
    const isPaidOrRejected = afterData.status === 'PAGO' || afterData.status === 'RECUSADO';

    if (statusChanged && isPaidOrRejected) {
      console.log(`Status mudou para ${afterData.status}, enviando notificações...`);

      // Buscar o usuário que fez a solicitação pelo userId
      if (!afterData.userId) {
        console.error('userId não encontrado na solicitação de saque');
        return;
      }

      const userRef = admin
        .firestore()
        .collection('users')
        .doc(afterData.userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error('Usuário não encontrado');
        return;
      }

      const userData = userDoc.data();
      const userId = userDoc.id;

      // Verificar se o usuário tem preferências de notificação habilitadas para saque
      const withdrawNotificationEnabled = userData?.notificationPreferences?.withdraw !== false;
      
      if (!withdrawNotificationEnabled) {
        console.log('Usuário tem notificações de saque desabilitadas, pulando envio');
        return;
      }

      // Definir mensagens baseadas no status
      const isPaid = afterData.status === 'PAGO';
      const title = isPaid 
        ? '✅ Seu saque foi aprovado!'
        : '❌ Seu saque foi recusado';
      
      const bodyMessage = isPaid
        ? `Ótima notícia! Seu saque de R$ ${formatCurrency(afterData.amount)} foi aprovado e será processado em breve.`
        : `Infelizmente, seu saque de R$ ${formatCurrency(afterData.amount)} foi recusado. Entre em contato com sua unidade para mais informações.`;

      // Criando notificação na subcoleção notifications
      try {
        const notificationRef = admin
          .firestore()
          .collection(`users/${userId}/notifications`)
          .doc();

        await notificationRef.set({
          title: title,
          body: bodyMessage,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          documentId: notificationRef.id,
          type: 'withdrawal_status',
          withdrawalId: event.params.withdrawalId,
          status: afterData.status,
        });

        // Enviando push notification se o usuário tem fcmToken
        if (userData?.fcmToken) {
          const payload = {
            token: userData.fcmToken,
            notification: {
              title: title,
              body: bodyMessage,
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

      // Enviando email para o usuário
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

        const emailSubject = isPaid 
          ? '✅ Seu saque foi aprovado!'
          : '❌ Seu saque foi recusado';

        const emailContent = isPaid 
          ? `
            <h1 style='color:#6600CC; font-size: 24px'>✅ Seu saque foi aprovado!</h1>
            <p>Olá, ${userData.fullName || 'Usuário'}!</p>
            <p>Temos uma ótima notícia! Seu saque foi aprovado com sucesso.</p>
            <p>Segue os dados do saque:</p>
            <div class='withdrawal-info'>
              <span><strong>Valor:</strong> R$ ${formatCurrency(afterData.amount)}</span><br>
              <span><strong>Chave PIX:</strong> ${afterData.pixKey}</span><br>
              <span><strong>Data da solicitação:</strong> ${afterData.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'N/A'}</span>
            </div>
            <p></p>
            <p>O valor será transferido para sua chave PIX em breve!</p>
            <a class='anchorLink' href="https://indica.avantar.com.br">👉 Acesse o app para acompanhar suas transações</a>
            <br>
            <span>Parabéns! Continue indicando e ganhe mais! 🚀</span>
          `
          : `
            <h1 style='color:#6600CC; font-size: 24px'>❌ Seu saque foi recusado</h1>
            <p>Olá, ${userData.displayName || userData.name || 'Usuário'}!</p>
            <p>Infelizmente, sua solicitação de saque foi recusada.</p>
            <p>Segue os dados da solicitação:</p>
            <div class='withdrawal-info'>
              <span><strong>Valor:</strong> R$ ${formatCurrency(afterData.amount)}</span><br>
              <span><strong>Data da solicitação:</strong> ${afterData.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || 'N/A'}</span>
            </div>
            <p></p>
            <p>Para mais informações sobre o motivo da recusa, entre em contato com sua unidade: ${afterData.unitName || 'unidade responsável'}.</p>
            <a class='anchorLink' href="https://indica.avantar.com.br">👉 Acesse o app para mais detalhes</a>
            <br>
            <span>Continue indicando e tente novamente! 💪</span>
          `;

        const mailOptions = {
          from: 'noreply@indica.avantar.com.br',
          to: userData.email,
          subject: emailSubject,
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

            .withdrawal-info {
              display: flex;
              flex-direction: column;
              margin: 1rem 0;
            }

            .anchorLink {
              cursor: pointer;
              color: #6600CC;
              text-decoration: none;
            }
            </style>
            <div class='container'>
              <div style="font-family: familjen grotesk;" class="div">
                ${emailContent}
                <span style='color:#6600CC'>Equipe Avantar Indica</span>
              </div>
            </div>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`E-mail de status de saque enviado com sucesso para ${userData.email}`);
        } catch (error) {
          console.error('Erro ao enviar email:', error);
        }
      }
    }
  },
);
