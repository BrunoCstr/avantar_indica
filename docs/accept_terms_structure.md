# Subcoleção accept_terms

Esta subcoleção registra o aceite dos termos e condições pelos usuários, incluindo informações de localização, IP e dispositivo.

## Estrutura no Firestore

```
users/
  {userId}/
    accept_terms/
      terms_acceptance/
        {
          uid: string,
          email: string,
          fullName: string,
          ip: string|null,
          location: {
            city: string|null,
            region: string|null,
            country: string|null,
            latitude: number|null,
            longitude: number|null,
            timezone: string|null
          },
          acceptedAt: timestamp,
          userAgent: string,
          deviceInfo: {
            platform: string,
            versionApp: string|null,
            dateVersionApp: string|null,
            timestamp: string
          },
          acceptedByAdmin?: boolean,
          adminUid?: string
        }
    }
```

## Campos do Documento

### Campos Obrigatórios
- `uid` (string): ID único do usuário
- `email` (string): Email do usuário
- `fullName` (string): Nome completo do usuário
- `acceptedAt` (timestamp): Data e hora do aceite

### Campos de Localização
- `ip` (string|null): Endereço IP do usuário
- `location` (object):
  - `city` (string|null): Cidade
  - `region` (string|null): Estado/Região
  - `country` (string|null): País
  - `latitude` (number|null): Latitude
  - `longitude` (number|null): Longitude
  - `timezone` (string|null): Fuso horário

### Campos do Dispositivo
- `userAgent` (string): Identificação do dispositivo/app
- `deviceInfo` (object):
  - `platform` (string): Plataforma (ios/android/admin)
  - `versionApp` (string|null): Versão do app
  - `dateVersionApp` (string|null): Data da versão do app
  - `timestamp` (string): Timestamp ISO

### Campos Especiais (Criação por Admin)
- `acceptedByAdmin` (boolean): Se foi aceito por admin
- `adminUid` (string): ID do admin que criou o usuário

## Exemplo de Documento

```json
{
  "uid": "user123",
  "email": "usuario@exemplo.com",
  "fullName": "João Silva",
  "ip": "192.168.1.1",
  "location": {
    "city": "São Paulo",
    "region": "SP",
    "country": "BR",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "timezone": "America/Sao_Paulo"
  },
  "acceptedAt": "2024-01-15T10:30:00Z",
  "userAgent": "React Native ios",
  "deviceInfo": {
    "platform": "ios",
    "versionApp": "1.0.0",
    "dateVersionApp": "2025-08-19",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Regras de Segurança

Como é uma subcoleção de `users`, as regras de segurança herdam da coleção pai. O usuário só pode acessar seus próprios dados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Usuário pode ler/escrever seus próprios dados
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcoleções herdam as regras do documento pai
      match /accept_terms/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Uso

Esta subcoleção é automaticamente populada quando:
1. Um usuário se cadastra através do app (função `signUp`)
2. Um administrador cria um usuário (função `createUserAsAdmin`)

O documento é sempre criado com o ID `terms_acceptance` dentro da subcoleção `accept_terms` do usuário.

## Vantagens da Subcoleção

1. **Organização**: Dados relacionados ficam agrupados
2. **Segurança**: Herda as regras de segurança da coleção pai
3. **Escalabilidade**: Permite adicionar mais documentos relacionados no futuro
4. **Consultas**: Facilita consultas por usuário específico
