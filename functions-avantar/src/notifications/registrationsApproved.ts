import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import {defineSecret} from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');

export const registrationsApproved = functions.firestore.onDocumentUpdated(
  {document: 'users/{userId}', secrets: [EMAIL_USER, EMAIL_PASS]},
  async event => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      console.error('Dados do documento não encontrados');
      return;
    }

    if (!beforeData.registration_status && afterData.registration_status) {
      console.log('>>> Cadastro aprovado, executando notificações e e-mail...');
      const fcmToken = afterData.fcmToken;
      const userEmail = afterData.email;
      const userName = afterData.fullName;
      const userUnit = afterData.affiliated_to;

      //Enviando Notificação
      const payload = {
        token: fcmToken,
        notification: {
          title: 'Seu cadastro foi aprovado! ✅',
          body: 'A partir de agora, você já pode utilizar nosso aplicativo para realizar suas indicações de forma rápida e prática.',
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

        try {
          await admin
            .firestore()
            .collection(`users/${event.params.userId}/notificacoes`)
            .add({
              title: 'Seu cadastro foi aprovado! ✅',
              body: 'A partir de agora, você já pode utilizar nosso aplicativo para realizar suas indicações de forma rápida e prática.',
              read: false,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        } catch (error) {
          console.error('Erro ao gravar a notificação no Firestore:', error);
        }
      } catch (error) {
        console.error('Erro ao enviar notificação:', error);
      }

      //Enviando Email
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
        to: userEmail,
        subject: 'Seu cadastro foi aprovado! ✅',
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
        </style>
        <div class='container'>
          <div style="font-family: familjen grotesk;" class="div">
            <h1 style='color:#6600CC; font-size: 24px'>Olá ${userName},</h1>
            <p>Temos uma ótima notícia pra você!</p>
            <p>Seu cadastro no Avantar Indica foi aprovado pela ${userUnit}. Agora, você já pode acessar o aplicativo e começar a fazer suas indicações.</p>
            <p>Cada indicação pode render recompensas exclusivas — e o melhor: de forma simples e prática, direto pelo app!</p>
            <p>👉 Acesse agora o Avantar Indica e comece a aproveitar todos os benefícios.</p>
            <br>
            <span>Boas indicações! 🚀</span>
            <span style='color:#6600CC'>Equipe de Desenvolvimento Avantar</span>
          </div>
        </div>`,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }

    return null;
  },
);
