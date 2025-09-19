# ⚠️ Configuração Manual do TTL no Firestore

## Problema
O Firebase CLI não está aceitando a configuração TTL via arquivo. Isso precisa ser feito manualmente no console.

## ✅ Solução: Configurar TTL Manualmente

### Passo a Passo:

1. **Acesse o Console do Firebase:**
   - Vá para https://console.firebase.google.com
   - Selecione o projeto `avantar-indica`

2. **Navegue para Firestore:**
   - No menu lateral, clique em **Firestore Database**

3. **Acesse os Índices:**
   - Clique na aba **Índices** (no topo da página)

4. **Criar TTL:**
   - Clique em **+ Criar índice**
   - **Coleção:** `temp_indications`
   - **Campos:**
     - Campo: `expiresAt`
     - Modo: `Ascending`
   - **Configurações avançadas:**
     - Marque a opção **TTL (Time to Live)**
   - Clique em **Criar**

5. **Aguardar:**
   - O índice levará alguns minutos para ser criado
   - Status aparecerá como "Building" e depois "Enabled"

## 🔄 Alternativa: Pular TTL por Enquanto

Se quiser testar o sistema primeiro e configurar TTL depois:

1. **Continue com o deploy das functions:**
   ```bash
   firebase deploy --only functions
   ```

2. **Configure TTL depois** quando tiver dados para testar

## ⚠️ Importante

- **Sem TTL:** Os dados temporários não serão removidos automaticamente
- **Com TTL:** Os documentos em `temp_indications` serão removidos automaticamente após 24h
- **Para produção:** TTL é essencial para não acumular dados desnecessários

## 🚀 Próximo Passo

**Continue com o deploy das functions:**
```bash
firebase deploy --only functions
```

O sistema funcionará normalmente, apenas os dados temporários não serão removidos automaticamente até que o TTL seja configurado manualmente no console.
