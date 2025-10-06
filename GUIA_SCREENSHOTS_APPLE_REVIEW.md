# 📸 Guia de Screenshots para Apple Review

## Instruções para Tirar os Prints Corretos

A Apple precisa **VER VISUALMENTE** as melhorias implementadas. Siga este guia para tirar os screenshots corretos:

---

## 🎯 **Screenshot 1: Tela de Indicação com Aviso B2B**

### O que capturar:
- Tela principal de indicação
- **Campo de email visível** (mostrando que você coleta o email)
- **Aviso azul com "ℹ️ PROCESSO B2B"** acima do checkbox
- **Checkbox de declaração** com texto completo visível

### Como tirar:
1. Abra o app no iPhone/Simulator
2. Navegue até a tela de indicação individual (`IndicateModal`)
3. Preencha os campos (Nome, Email, Telefone, Produto)
4. Role até o final onde aparece o aviso e checkbox
5. **Tire o screenshot completo** mostrando o aviso e a declaração

### Arquivo a enviar:
`screenshot_1_tela_indicacao_aviso.png`

---

## 🎯 **Screenshot 2: Modal de Confirmação (Mais Importante!)**

### O que capturar:
- O **modal de confirmação** que aparece ANTES de enviar
- Título: **"Confirmar Autorização Prévia"**
- Box roxo com **"PROCESSO DE DUPLO CONSENTIMENTO"**
- Box vermelho com **"⚠️ ATENÇÃO"**
- **Checkbox grande** com a declaração completa: "DECLARO que obtive autorização verbal prévia..."

### Como tirar:
1. Na tela de indicação, preencha todos os campos
2. Clique no botão de enviar/indicar
3. O modal de confirmação irá aparecer
4. **Tire o screenshot deste modal completo**

### Arquivo a enviar:
`screenshot_2_modal_confirmacao_duplo_consentimento.png`

---

## 🎯 **Screenshot 3: Email de Consentimento Recebido**

### O que capturar:
- Email recebido pelo cliente indicado
- **Assunto do email** claramente visível
- Explicação sobre o que está sendo compartilhado
- **Botões de "Aceitar" e "Recusar"** visíveis

### Como tirar:
1. Faça uma indicação de teste usando seu próprio email
2. Abra o email recebido no Gmail/Outlook/Apple Mail
3. **Tire screenshot do email completo** mostrando:
   - Cabeçalho/Remetente
   - Texto explicativo
   - Botões de ação (Aceitar/Recusar)

### Arquivo a enviar:
`screenshot_3_email_confirmacao_cliente.png`

---

## 🎯 **Screenshot 4: Página de Confirmação Web (Se disponível)**

### O que capturar:
- A página que abre quando o cliente clica em "Aceitar" ou "Recusar"
- Mensagem de sucesso/rejeição

### Como tirar:
1. No email de teste, clique no botão "Aceitar"
2. A página web irá abrir (indica.avantar.com.br/consent)
3. **Tire screenshot da mensagem de confirmação**

### Arquivo a enviar:
`screenshot_4_pagina_confirmacao.png`

---

## 🎯 **Screenshot 5: Info.plist com Declarações de Privacidade**

### O que capturar:
- Arquivo `Info.plist` aberto no Xcode
- Seção **"Privacy - User Tracking Usage Description"** expandida
- Texto completo da descrição visível

### Como tirar:
1. Abra o projeto no Xcode
2. Navegue até `ios/avantar_indica/Info.plist`
3. Procure pela chave `NSUserTrackingUsageDescription`
4. Expanda para mostrar o valor completo
5. **Tire screenshot mostrando a chave e o valor**

### Arquivo a enviar:
`screenshot_5_info_plist_privacy.png`

---

## 📋 **Checklist Final**

Antes de enviar para a Apple, verifique que você tem:

- [ ] ✅ Screenshot 1: Tela de indicação com aviso B2B
- [ ] ✅ Screenshot 2: Modal de confirmação com duplo consentimento (MAIS IMPORTANTE)
- [ ] ✅ Screenshot 3: Email de consentimento recebido
- [ ] ✅ Screenshot 4: Página de confirmação web
- [ ] ✅ Screenshot 5: Info.plist com declarações de privacidade
- [ ] ✅ Documento de resposta (APPLE_REVIEW_RESPONSE.md ou versão PT)

---

## 💡 **Dicas Importantes**

1. **Use um dispositivo real ou simulator iOS atualizado** (iOS 15+)
2. **Screenshots devem ser nítidos** e em alta resolução
3. **Não edite ou corte informações importantes** dos screenshots
4. **Mostre o fluxo completo** de ponta a ponta
5. **Destaque visualmente** (com setas ou marcações) as partes importantes se necessário

---

## 📝 **Texto Sugerido para Resposta à Apple**

Copie e cole este texto na sua resposta ao App Review:

```
Dear App Review Team,

Thank you for your continued review. We have made significant updates to address Guideline 5.1.2:

UPDATES IMPLEMENTED:
✅ Added NSUserTrackingUsageDescription explaining our B2B dual-consent process
✅ Added explicit in-app warnings requiring verbal consent BEFORE data entry
✅ Added declaration checkbox: "I DECLARE that I have obtained prior verbal authorization..."
✅ Implemented dual-consent system: verbal (pre-collection) + electronic (email confirmation)
✅ Temporary storage (24h TTL) with auto-deletion if consent not confirmed
✅ Customer can reject data sharing via email - data is immediately deleted

Please see attached screenshots showing:
1. In-app warnings about verbal consent requirement
2. Explicit declaration checkbox
3. Email confirmation sent to customer with Accept/Reject options
4. Info.plist privacy declarations

This is a B2B tool for authorized sales representatives who must obtain in-person consent before using the app. The email confirmation provides an additional layer of protection, ensuring no data is permanently stored without electronic confirmation.

Similar B2B referral apps in the App Store:
- Indique (ID: 6446994759)
- Indique Educ Adventista (ID: 6744768127)

We are committed to user privacy and have designed our system to exceed industry standards. We respectfully request approval for distribution.

Best regards,
[Seu Nome]
Avantar Indica Development Team
```

---

## 🚀 **Próximos Passos**

1. Tire todos os 5 screenshots seguindo este guia
2. Anexe os screenshots na resposta ao App Review
3. Copie o texto de resposta acima (ou use a versão em inglês do arquivo APPLE_REVIEW_RESPONSE.md)
4. Envie através do App Store Connect > Resolution Center
5. Aguarde a resposta da Apple (geralmente 1-3 dias úteis)

---

## ❓ **Dúvidas Comuns**

**P: E se a Apple continuar rejeitando?**
R: Se ainda assim rejeitarem, podemos implementar a "Solução 2" que é criar um fluxo onde o vendedor envia um LINK para o cliente preencher seus próprios dados (similar a um Google Forms).

**P: Preciso atualizar o build?**
R: SIM! Você precisa fazer um novo build e enviar uma nova versão com estas atualizações implementadas.

**P: Como faço o novo build?**
R: Execute:
```bash
cd ios
pod install
cd ..
npx react-native run-ios --configuration Release
# Depois faça o archive no Xcode e envie via App Store Connect
```

**P: Preciso atualizar a versão do app?**
R: Sim, aumente o número da versão no `package.json`, `app.json` e no Xcode (CFBundleShortVersionString).

---

Boa sorte! 🍀

