# ⚡ Comandos Rápidos - Deploy e Build

## 📱 ATUALIZAR VERSÃO DO APP

### 1. Atualizar package.json
```bash
# Abra package.json e aumente a versão
# Exemplo: "version": "1.0.0" -> "version": "1.0.1"
```

### 2. Atualizar app.json (se existir)
```bash
# Aumente o versionCode e version
```

### 3. Atualizar versão no Xcode
```bash
# Abra Xcode > General > Identity
# Version: 1.0.1
# Build: incremente +1
```

---

## 🔥 DEPLOY CLOUD FUNCTIONS

```bash
# Navegue até a pasta de functions
cd functions-avantar

# Instale dependências (se necessário)
npm install

# Deploy de todas as functions
npm run deploy

# OU deploy apenas das functions de consentimento
firebase deploy --only functions:sendConsentEmail,functions:confirmConsent

# Volte para a raiz do projeto
cd ..
```

---

## 📦 BUILD iOS - VERSÃO RÁPIDA

```bash
# 1. Limpar cache e reinstalar pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# 2. Limpar build anterior
npx react-native clean

# 3. Fazer build de release
npx react-native run-ios --configuration Release --device
```

---

## 🏗️ ARCHIVE NO XCODE (Manual)

1. **Abra o Xcode:**
```bash
cd ios
open avantar_indica.xcworkspace
```

2. **Configure:**
   - Selecione "Any iOS Device (arm64)" no topo
   - Menu: Product > Scheme > Edit Scheme
   - Certifique-se de que Build Configuration está em "Release"

3. **Archive:**
   - Menu: Product > Archive
   - Aguarde o processo (pode demorar 5-10 min)

4. **Distribute:**
   - Janela Organizer abrirá automaticamente
   - Clique em "Distribute App"
   - Escolha "App Store Connect"
   - Siga o wizard

---

## 🧪 TESTAR LOCALMENTE ANTES DE ENVIAR

### Teste 1: Verificar modal de consentimento
```bash
# Rode no simulator
npx react-native run-ios

# Navegue até tela de indicação
# Verifique se o modal mostra os novos textos
```

### Teste 2: Verificar email de consentimento
```bash
# Faça uma indicação de teste usando seu próprio email
# Verifique se o email chegou com os botões Accept/Reject
```

### Teste 3: Testar fluxo completo
```bash
# 1. Faça indicação no app
# 2. Receba email
# 3. Clique em "Aceitar"
# 4. Verifique se dados foram salvos no Firestore
# 5. Teste também clicar em "Recusar"
```

---

## 🔍 COMANDOS DE DEBUG

### Ver logs do app
```bash
npx react-native log-ios
```

### Ver logs das Cloud Functions
```bash
firebase functions:log
```

### Verificar erros de TypeScript
```bash
npx tsc --noEmit
```

### Verificar erros de ESLint
```bash
npx eslint src/ --ext .ts,.tsx
```

---

## 📸 TIRAR SCREENSHOTS NO SIMULATOR

### 1. Iniciar simulator
```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### 2. Tirar screenshot
- **Atalho:** Cmd + S (salva na área de trabalho)
- **Ou:** Simulator menu > File > Save Screen

### 3. Screenshots necessários:
```bash
# Screenshot 1: Tela de indicação com aviso
# Screenshot 2: Modal de confirmação (MAIS IMPORTANTE!)
# Screenshot 3: Email recebido (abra no navegador)
# Screenshot 4: Página de confirmação
# Screenshot 5: Info.plist no Xcode
```

---

## 🚀 PROCESSO COMPLETO (PASSO A PASSO)

```bash
# PASSO 1: Atualizar versão
# Edite manualmente: package.json, app.json, Xcode

# PASSO 2: Deploy das functions
cd functions-avantar
npm run deploy
cd ..

# PASSO 3: Limpar e reinstalar
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# PASSO 4: Build de teste
npx react-native run-ios

# PASSO 5: Teste manual
# - Abra o app
# - Teste fluxo de indicação
# - Verifique email

# PASSO 6: Tirar screenshots
# - Use Cmd+S no simulator
# - Tire os 5 screenshots necessários

# PASSO 7: Archive
cd ios
open avantar_indica.xcworkspace
# No Xcode: Product > Archive

# PASSO 8: Distribute
# No Organizer: Distribute App > App Store Connect

# PASSO 9: Responder à Apple
# - Acesse App Store Connect
# - Resolution Center
# - Anexe screenshots
# - Copie texto de APPLE_REVIEW_RESPONSE.md
```

---

## 🐛 TROUBLESHOOTING

### Erro: "No podspec found for..."
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Erro: "Unable to boot device"
```bash
# Reinicie o simulator
xcrun simctl shutdown all
xcrun simctl erase all
```

### Erro: "Command PhaseScriptExecution failed"
```bash
cd ios
rm -rf ~/Library/Developer/Xcode/DerivedData
xcodebuild clean
cd ..
```

### Erro: Functions não atualizaram
```bash
# Force deploy
firebase deploy --only functions --force
```

### App não reflete mudanças
```bash
# Limpar tudo
npx react-native clean
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
watchman watch-del-all
rm -rf node_modules
npm install
npx react-native run-ios
```

---

## 📊 VERIFICAR STATUS

### Verificar se functions estão rodando
```bash
firebase functions:list
```

### Verificar logs em tempo real
```bash
firebase functions:log --only sendConsentEmail
```

### Verificar se build está correto
```bash
xcodebuild -workspace ios/avantar_indica.xcworkspace \
           -scheme avantar_indica \
           -configuration Release \
           -showBuildSettings | grep PRODUCT_BUNDLE_VERSION
```

---

## 💾 BACKUP ANTES DE COMEÇAR (RECOMENDADO)

```bash
# Criar branch de backup
git checkout -b backup-before-apple-review-fix
git add .
git commit -m "Backup before Apple Review compliance updates"

# Voltar para branch principal
git checkout iOS

# Se algo der errado, você pode voltar:
# git checkout backup-before-apple-review-fix
```

---

## ✅ CHECKLIST FINAL

Execute este checklist antes de enviar:

```bash
# [ ] Versão atualizada no package.json
# [ ] Versão atualizada no Xcode
# [ ] Cloud Functions deployadas
# [ ] App testado no simulator
# [ ] Email de consentimento testado
# [ ] 5 screenshots tirados
# [ ] Archive feito com sucesso
# [ ] Upload para App Store Connect concluído
# [ ] Texto de resposta preparado
# [ ] Screenshots anexados na resposta
# [ ] Resposta enviada à Apple
```

---

## 🎯 ORDEM DE PRIORIDADE

1. **CRÍTICO:** Deploy das Cloud Functions (email atualizado)
2. **CRÍTICO:** Archive e upload do app (mudanças no código)
3. **MUITO IMPORTANTE:** Screenshots do modal de consentimento
4. **IMPORTANTE:** Texto de resposta bem escrito
5. **COMPLEMENTAR:** Screenshots do Info.plist

---

Pronto! Com esses comandos você deve conseguir fazer todo o processo. 🚀

**Tempo estimado total:** 2-3 horas

