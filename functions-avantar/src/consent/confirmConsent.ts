import {onRequest} from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto-js';
import {defineSecret} from 'firebase-functions/params';

const CRYPTO_SECRET = defineSecret('CRYPTO_SECRET');

const db = admin.firestore();

interface TokenData {
  indicated_email: string;
  timestamp: number;
  expires: number;
}

export const confirmConsent = onRequest({
  secrets: [CRYPTO_SECRET]
}, async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  try {
    const token = req.query.token || req.body.token;
    const action = req.query.action || req.body.action || 'confirm'; // confirm ou reject

    if (!token) {
      res.status(400).json({ error: 'Token não fornecido' });
      return;
    }

    // Descriptografar e validar token
    const secretKey = "D5T1ToZUeaOpb50PLznFkLZSz90IvyOEt4ClQYN";
    
    let tokenData: TokenData;
    try {
      const decryptedBytes = crypto.AES.decrypt(decodeURIComponent(token as string), secretKey);
      const decryptedData = decryptedBytes.toString(crypto.enc.Utf8);
      tokenData = JSON.parse(decryptedData);
    } catch (error) {
      res.status(400).json({ error: 'Token inválido' });
      return;
    }

    // Verificar se o token expirou
    if (Date.now() > tokenData.expires) {
      res.status(400).json({ error: 'Token expirado' });
      return;
    }

    // Buscar dados temporários no Firestore
    const tempQuery = await db.collection('temp_indications')
      .where('indicated_email', '==', tokenData.indicated_email)
      .where('token', '==', decodeURIComponent(token as string))
      .limit(1)
      .get();

    if (tempQuery.empty) {
      res.status(404).json({ error: 'Indicação não encontrada ou já processada' });
      return;
    }

    const tempDoc = tempQuery.docs[0];
    const tempData = tempDoc.data();

    if (action === 'reject') {
      // Marcar como rejeitado e não criar indicação
      await tempDoc.ref.update({
        status: 'REJECTED',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        consentGiven: false,
      });

      res.status(200).json({ 
        success: true, 
        message: 'Consentimento rejeitado. Seus dados não foram compartilhados.',
        action: 'rejected'
      });
      return;
    }

    // Confirmar consentimento - mover dados para coleção definitiva
    const indicationRef = db.collection('indications').doc();
    const cleanedPhone = tempData.indicated_phone.replace(/\D/g, '');

    // Criar indicação com a estrutura EXATA solicitada
    await indicationRef.set({
      indicator_id: tempData.indicator_id,
      indicator_name: tempData.indicator_name,
      profilePicture: tempData.profilePicture || null,
      indicationId: indicationRef.id,
      unitId: tempData.unitId,
      unitName: tempData.unitName,
      name: tempData.indicated_name,
      phone: cleanedPhone,
      product: tempData.product,
      observations: tempData.observations || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'PENDENTE CONTATO',
      sgcorId: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Campos adicionais para rastreamento de consentimento
      consentGiven: true,
      consentTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      consentToken: token,
      indicatedEmail: tempData.indicated_email, // Manter email para referência
    });

    // Marcar dados temporários como processados
    await tempDoc.ref.update({
      status: 'PROCESSED',
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      finalIndicationId: indicationRef.id,
      consentGiven: true,
    });

    // Log para auditoria
    console.log(`Consentimento confirmado para: ${tempData.indicated_email}`);
    console.log(`Indicação criada com ID: ${indicationRef.id}`);
    console.log(`Dados movidos de temp para definitivo`);

    res.status(200).json({ 
      success: true, 
      message: 'Consentimento confirmado! Sua indicação foi registrada com sucesso.',
      indicationId: indicationRef.id,
      action: 'confirmed'
    });

  } catch (error) {
    console.error('Erro ao processar consentimento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Função auxiliar para validar token (pode ser chamada pela página de confirmação)
export const validateConsentToken = onRequest({
  secrets: [CRYPTO_SECRET]
}, async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  try {
    const token = req.query.token;

    if (!token) {
      res.status(400).json({ error: 'Token não fornecido' });
      return;
    }

    // Descriptografar token
    const secretKey = "D5T1ToZUeaOpb50PLznFkLZSz90IvyOEt4ClQYN";
    
    let tokenData: TokenData;
    try {
      const decryptedBytes = crypto.AES.decrypt(decodeURIComponent(token as string), secretKey);
      const decryptedData = decryptedBytes.toString(crypto.enc.Utf8);
      tokenData = JSON.parse(decryptedData);
    } catch (error) {
      res.status(400).json({ error: 'Token inválido', valid: false });
      return;
    }

    // Verificar se o token expirou
    if (Date.now() > tokenData.expires) {
      res.status(400).json({ error: 'Token expirado', valid: false, expired: true });
      return;
    }

    // Buscar dados temporários
    const tempQuery = await db.collection('temp_indications')
      .where('indicated_email', '==', tokenData.indicated_email)
      .where('token', '==', decodeURIComponent(token as string))
      .limit(1)
      .get();

    if (tempQuery.empty) {
      res.status(404).json({ error: 'Indicação não encontrada ou já processada', valid: false });
      return;
    }

    const tempData = tempQuery.docs[0].data();

    res.status(200).json({
      valid: true,
      data: {
        indicated_name: tempData.indicated_name,
        indicated_email: tempData.indicated_email,
        indicator_name: tempData.indicator_name,
        unitName: tempData.unitName,
        product: tempData.product,
        observations: tempData.observations,
      }
    });

  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      valid: false,
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

