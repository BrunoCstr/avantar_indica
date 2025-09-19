import {onRequest} from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto-js';
import {defineSecret, defineString} from 'firebase-functions/params';

const EMAIL_USER = defineSecret('EMAIL_USER');
const EMAIL_PASS = defineSecret('EMAIL_PASS');
const CRYPTO_SECRET = defineSecret('CRYPTO_SECRET');
const EMAIL_FROM = defineString('EMAIL_FROM', {
  default: 'noreply@avantar.com.br',
});

const db = admin.firestore();

interface ConsentRequestData {
  indicator_id: string;
  indicator_name: string;
  profilePicture?: string;
  unitId: string;
  unitName: string;
  indicated_name: string;
  indicated_email: string;
  indicated_phone: string;
  product: string;
  observations?: string;
}

export const sendConsentEmail = onRequest(
  {
    secrets: [EMAIL_USER, EMAIL_PASS, CRYPTO_SECRET],
  },
  async (req, res) => {
    // Configuração do transporte de email (movido para dentro da função)
    const transporter = nodemailer.createTransport({
      host: 'smtp.dreamhost.com',
      port: 587,
      secure: false, // false para porta 587, true para porta 465
      auth: {
        user: EMAIL_USER.value(),
        pass: EMAIL_PASS.value(),
      },
      tls: {
        rejectUnauthorized: false, // Para evitar problemas com certificados
      },
    });
    // Configurar CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({error: 'Método não permitido'});
      return;
    }

    try {
      const data: ConsentRequestData = req.body;

      // Validar dados obrigatórios
      if (!data.indicator_id || !data.indicated_email || !data.indicated_name) {
        res.status(400).json({error: 'Dados obrigatórios não fornecidos'});
        return;
      }

      // Gerar token único criptografado
      const tokenData = {
        indicated_email: data.indicated_email,
        timestamp: Date.now(),
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
      };

      const secretKey = 'D5T1ToZUeaOpb50PLznFkLZSz90IvyOEt4ClQYN';
      const token = crypto.AES.encrypt(
        JSON.stringify(tokenData),
        secretKey,
      ).toString();
      const encodedToken = encodeURIComponent(token);

      // Armazenar dados temporariamente no Firestore com TTL
      const tempDocRef = db.collection('temp_indications').doc();
      await tempDocRef.set({
        ...data,
        token: token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        status: 'PENDING_CONSENT',
      });

      // Criar link de consentimento
      const consentLink = `https://indica.avantar.com.br/consent?token=${encodedToken}`;

      // Configurar e-mail
      const mailOptions = {
        from: EMAIL_FROM.value(),
        to: data.indicated_email,
        subject: `${data.indicator_name} indicou você para a Avantar`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;700&display=swap" rel="stylesheet">
          <title>Solicitação de Consentimento - Avantar</title>
          <style>
            body { font-family: 'Familjen Grotesk', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6600CC; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { 
            display: inline-flex;
  justify-content: center;
  align-items: center;
  background: #6600CC;
  color: #F6F3FF;
  padding: 5px 30px;
  text-decoration: none;
  border-radius: 10px;
  margin: 20px 0;
  font-weight: bold;
  min-height: 50px;
  width: auto;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  opacity: 1;
  position: relative;
  overflow: hidden;
            }
            .info-box { background: #e8f2ff; border-left: 4px solid #29F3DF; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Você foi indicado!</h1>
              <p>Solicitação de Consentimento</p>
            </div>
            
            <div class="content">
              <p><strong>Olá, ${data.indicated_name}!</strong></p>
              
              <p><strong>${data.indicator_name}</strong> da unidade <strong>${data.unitName}</strong> indicou você para conhecer nossos produtos e serviços da Avantar.</p>
              
              <div class="info-box">
                <h3>📋 Detalhes da Indicação:</h3>
                <p><strong>Produto de interesse:</strong> ${data.product}</p>
                ${data.observations ? `<p><strong>Observações:</strong> ${data.observations}</p>` : ''}
                <p><strong>Indicado por:</strong> ${data.indicator_name} (${data.unitName})</p>
              </div>
              
              <p><strong>🔒 Sobre seus dados:</strong></p>
              <p>Para prosseguir com esta indicação, precisamos do seu consentimento para compartilhar seus dados de contato com nossa equipe comercial. Seus dados serão utilizados exclusivamente para:</p>
              <ul>
                <li>Entrar em contato sobre o produto de seu interesse</li>
                <li>Apresentar nossas soluções</li>
                <li>Acompanhar o processo comercial</li>
              </ul>
              
              <p><strong>⏰ Importante:</strong> Este link é válido por 24 horas. Após esse período, será necessário solicitar uma nova indicação.</p>
              
              <div style="text-align: center;">
                <a href="${consentLink}" class="button">AUTORIZAR COMPARTILHAMENTO</a>
              </div>
              
              <p><small>Ao clicar no botão acima, você autoriza o compartilhamento dos seus dados (nome, e-mail e telefone) com a equipe comercial da Avantar para fins de contato comercial relacionado ao produto indicado.</small></p>
            </div>
            
            <div class="footer">
              <p>Este e-mail foi enviado automaticamente. Se você não esperava receber esta mensagem, pode ignorá-la com segurança.</p>
              <p>&copy; ${new Date().getFullYear()} Equipe de desenvolvimento Rede Avantar. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      };

      // Enviar e-mail
      await transporter.sendMail(mailOptions);

      console.log(
        `E-mail de consentimento enviado para: ${data.indicated_email}`,
      );
      console.log(`Token gerado: ${token}`);
      console.log(`Link de consentimento: ${consentLink}`);

      res.status(200).json({
        success: true,
        message: 'E-mail de consentimento enviado com sucesso',
        tempDocId: tempDocRef.id,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de consentimento:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  },
);
