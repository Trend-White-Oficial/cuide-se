# Cuide-Se - Plataforma de Agendamento de Serviços

## 🚀 Sobre o Projeto

Cuide-Se é uma plataforma moderna e segura para agendamento de serviços de beleza e bem-estar. Conecta clientes com profissionais qualificados, oferecendo uma experiência intuitiva e confiável.

## ⚠️ Aviso Legal

- Este código é propriedade exclusiva da Cuide-Se.
- Nenhuma parte deste código pode ser usada, copiada, modificada ou distribuída sem autorização expressa.
- O uso comercial deste código é exclusivo da Cuide-Se.
- Qualquer uso não autorizado será considerado violação de direitos autorais.

## 📋 Requisitos

- Node.js 18.x ou superior
- NPM 8.x ou superior
- Supabase para banco de dados
- Firebase para autenticação e notificações

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=seu_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon

# Firebase
VITE_FIREBASE_API_KEY=sua_chave_api
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=su_id
VITE_FIREBASE_APP_ID=su_id
VITE_FIREBASE_MEASUREMENT_ID=su_id

# API
VITE_API_URL=http://localhost:8000

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=sua_chave

# Analytics
VITE_GOOGLE_ANALYTICS_ID=sua_id
VITE_MIXPANEL_TOKEN=sua_token
VITE_SENTRY_DSN=sua_dsn

# Configurações de Segurança
VITE_RATE_LIMIT_MAX_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=60000
VITE_XSS_PROTECTION_ENABLED=true
VITE_CORS_ENABLED=true
VITE_CORS_ORIGINS="*"
VITE_CORS_METHODS="GET,HEAD,PUT,PATCH,POST,DELETE"
VITE_CORS_HEADERS="Content-Type,Authorization"
VITE_CORS_CREDENTIALS=true
VITE_HSTS_ENABLED=true
VITE_HSTS_MAX_AGE=31536000
VITE_HSTS_INCLUDE_SUBDOMAINS=true
VITE_HSTS_PRELOAD=true
VITE_REFERRER_POLICY="strict-origin-when-cross-origin"
VITE_CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'self';"
VITE_TRUST_PROXY=true
VITE_PROXY_TARGET=http://localhost:8000
VITE_PROXY_CHANGE_ORIGIN=true
VITE_PROXY_PATH=/api
```

## 📚 Documentação da API

### Endpoints

#### Autenticação

- POST `/auth/register` - Registrar novo usuário
  - **Headers**: `Content-Type: application/json`
  - **Body**: 
    ```json
    {
        "nome": "string",
        "email": "string",
        "senha": "string",
        "tipo_usuario": "cliente|profissional"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "token": "string",
        "usuario": {
            "id": "string",
            "nome": "string",
            "email": "string",
            "tipo_usuario": "cliente|profissional"
        }
    }
    ```

- POST `/auth/login` - Fazer login
  - **Headers**: `Content-Type: application/json`
  - **Body**: 
    ```json
    {
        "email": "string",
        "senha": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "token": "string",
        "usuario": {
            "id": "string",
            "nome": "string",
            "email": "string",
            "tipo_usuario": "cliente|profissional"
        }
    }
    ```

- POST `/auth/logout` - Fazer logout
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: 
    ```json
    {
        "message": "Logout realizado com sucesso"
    }
    ```

- GET `/auth/profile` - Obter perfil do usuário
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: 
    ```json
    {
        "usuario": {
            "id": "string",
            "nome": "string",
            "email": "string",
            "tipo_usuario": "cliente|profissional",
            "foto_perfil_url": "string",
            "especialidade": "string"
        }
    }
    ```

#### Profissionais

- GET `/profissionais` - Listar profissionais
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?especialidade=string
    &cidade=string
    &pagina=number
    &limite=number
    ```
  - **Resposta**: 
    ```json
    {
        "profissionais": [
            {
                "id": "string",
                "nome": "string",
                "especialidade": "string",
                "cidade": "string",
                "foto_perfil_url": "string",
                "avaliacao_media": number,
                "quantidade_avaliacoes": number
            }
        ],
        "total": number,
        "pagina": number,
        "limite": number
    }
    ```

- GET `/profissionais/:id` - Obter detalhes de um profissional
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: 
    ```json
    {
        "profissional": {
            "id": "string",
            "nome": "string",
            "especialidade": "string",
            "cidade": "string",
            "foto_perfil_url": "string",
            "descricao": "string",
            "servicos": [
                {
                    "id": "string",
                    "nome": "string",
                    "descricao": "string",
                    "preco": number
                }
            ],
            "avaliacoes": [
                {
                    "id": "string",
                    "cliente": {
                        "nome": "string",
                        "foto_perfil_url": "string"
                    },
                    "avaliacao": number,
                    "comentario": "string",
                    "data": "string"
                }
            ]
        }
    }
    ```

#### Agendamentos

- GET `/agendamentos` - Listar agendamentos
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?data_inicio=string
    &data_fim=string
    &pagina=number
    &limite=number
    ```
  - **Resposta**: 
    ```json
    {
        "agendamentos": [
            {
                "id": "string",
                "cliente": {
                    "nome": "string",
                    "foto_perfil_url": "string"
                },
                "profissional": {
                    "nome": "string",
                    "foto_perfil_url": "string"
                },
                "servico": {
                    "nome": "string",
                    "preco": number
                },
                "data_hora": "string",
                "status": "agendado|confirmado|concluido|cancelado"
            }
        ],
        "total": number,
        "pagina": number,
        "limite": number
    }
    ```

- POST `/agendamentos` - Criar novo agendamento
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: 
    ```json
    {
        "profissional_id": "string",
        "servico_id": "string",
        "data_hora": "string",
        "observacoes": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "agendamento": {
            "id": "string",
            "data_hora": "string",
            "status": "agendado"
        }
    }
    ```

#### Avaliações

- POST `/avaliacoes` - Criar nova avaliação
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: 
    ```json
    {
        "profissional_id": "string",
        "avaliacao": number,
        "comentario": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "avaliacao": {
            "id": "string",
            "avaliacao": number,
            "comentario": "string",
            "data": "string"
        }
    }
    ```

#### Serviços

- GET `/servicos` - Listar serviços
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?categoria=string
    &pagina=number
    &limite=number
    ```
  - **Resposta**: 
    ```json
    {
        "servicos": [
            {
                "id": "string",
                "nome": "string",
                "descricao": "string",
                "preco": number,
                "categoria": "string"
            }
        ],
        "total": number,
        "pagina": number,
        "limite": number
    }
    ```

#### Notificações

- GET `/notifications` - Listar notificações
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?lida=boolean
    &pagina=number
    &limite=number
    ```
  - **Resposta**: 
    ```json
    {
        "notifications": [
            {
                "id": "string",
                "titulo": "string",
                "mensagem": "string",
                "lida": boolean,
                "data": "string"
            }
        ],
        "total": number,
        "pagina": number,
        "limite": number
    }
    ```

- PUT `/notifications/:id/read` - Marcar notificação como lida
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: 
    ```json
    {
        "message": "Notificação marcada como lida"
    }
    ```

#### Calendário

- GET `/calendar/events` - Listar eventos
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?data_inicio=string
    &data_fim=string
    ```
  - **Resposta**: 
    ```json
    {
        "events": [
            {
                "id": "string",
                "titulo": "string",
                "descricao": "string",
                "data_inicio": "string",
                "data_fim": "string"
            }
        ]
    }
    ```

- POST `/calendar/events` - Criar evento
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: 
    ```json
    {
        "titulo": "string",
        "descricao": "string",
        "data_inicio": "string",
        "data_fim": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "event": {
            "id": "string",
            "titulo": "string",
            "data_inicio": "string"
        }
    }
    ```

#### Seguimentos

- POST `/follow` - Seguir profissional
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: 
    ```json
    {
        "profissional_id": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "message": "Profissional seguido com sucesso"
    }
    ```

- DELETE `/follow/:profissional_id` - Deixar de seguir profissional
  - **Headers**: `Authorization: Bearer <token>`
  - **Resposta**: 
    ```json
    {
        "message": "Profissional removido dos seguimentos"
    }
    ```

#### Promoções

- GET `/promotions` - Listar promoções
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Params**: 
    ```bash
    ?data_inicio=string
    &data_fim=string
    ```
  - **Resposta**: 
    ```json
    {
        "promotions": [
            {
                "id": "string",
                "titulo": "string",
                "descricao": "string",
                "desconto": number,
                "data_inicio": "string",
                "data_fim": "string"
            }
        ]
    }
    ```

- POST `/promotions` - Criar promoção
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: 
    ```json
    {
        "titulo": "string",
        "descricao": "string",
        "desconto": number,
        "data_inicio": "string",
        "data_fim": "string"
    }
    ```
  - **Resposta**: 
    ```json
    {
        "promotion": {
            "id": "string",
            "titulo": "string",
            "data_inicio": "string"
        }
    }
    ```

## 📱 Páginas

- `/`: Página inicial
- `/search`: Busca de profissionais
- `/professional/:id`: Perfil do profissional
- `/login`: Login
- `/register`: Registro
- `/profile`: Perfil do usuário
- `/calendar`: Calendário
- `/promotions`: Promoções
- `/notifications`: Notificações
- `/admin/dashboard`: Painel administrativo
- `/admin/reports`: Relatórios
- `/admin/users`: Gerenciamento de usuários
- `/admin/analytics`: Análise de dados

## 📦 Contextos React

### CartContext

Contexto para gerenciamento de carrinho de agendamentos:

- **Estado Gerenciado**:
  - `items`: Array de itens no carrinho
  - `total`: Valor total do carrinho
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchCart`: Busca itens do carrinho do usuário
  - `addToCart`: Adiciona um serviço ao carrinho
  - `removeFromCart`: Remove um item do carrinho
  - `clearCart`: Limpa o carrinho
  - `checkout`: Finaliza o agendamento

### PaymentContext

Contexto para gerenciamento de pagamentos:

- **Estado Gerenciado**:
  - `transactions`: Array de transações do usuário
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchTransactions`: Busca transações do usuário
  - `createTransaction`: Inicia uma nova transação
  - `cancelTransaction`: Cancela uma transação
  - `refundTransaction`: Refunde uma transação

### UserSettingsContext

Contexto para gerenciamento de configurações do usuário:

- **Estado Gerenciado**:
  - `settings`: Configurações do usuário
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchSettings`: Busca configurações do usuário
  - `updateSettings`: Atualiza configurações
  - `updateTheme`: Atualiza tema
  - `updateNotificationSettings`: Atualiza configurações de notificações
  - `updateLanguage`: Atualiza idioma
  - `updateTimezone`: Atualiza fuso horário
  - `updateCurrency`: Atualiza moeda
  - `updateDistanceUnit`: Atualiza unidade de distância

### NotificationsContext

Contexto para gerenciamento de notificações do usuário:

- **Estado Gerenciado**:
  - `notifications`: Array de notificações não lidas
  - `unreadCount`: Contador de notificações não lidas
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchNotifications`: Busca notificações não lidas do usuário
  - `markAsRead`: Marca uma notificação como lida
  - `markAllAsRead`: Marca todas as notificações como lidas

### CalendarContext

Contexto para gerenciamento de eventos do calendário:

- **Estado Gerenciado**:
  - `events`: Array de eventos do usuário
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchEvents`: Busca eventos futuros do usuário
  - `createEvent`: Cria um novo evento
  - `updateEvent`: Atualiza um evento existente
  - `deleteEvent`: Remove um evento

### FollowContext

Contexto para gerenciamento de seguimentos:

- **Estado Gerenciado**:
  - `following`: Array de profissionais seguidos
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchFollowing`: Busca profissionais seguidos pelo usuário
  - `followProfessional`: Segue um novo profissional
  - `unfollowProfessional`: Deixa de seguir um profissional

### PromotionsContext

Contexto para gerenciamento de promoções:

- **Estado Gerenciado**:
  - `promotions`: Array de promoções do usuário
  - `loading`: Estado de carregamento
  - `error`: Estado de erro

- **Funções**:
  - `fetchPromotions`: Busca promoções ativas do usuário
  - `createPromotion`: Cria uma nova promoção
  - `updatePromotion`: Atualiza uma promoção existente
  - `deletePromotion`: Remove uma promoção

## 🎨 Tema e Estilos

O projeto utiliza Tailwind CSS com um tema personalizado. As cores principais são:

- Rosa (Primary): #FF69B4
- Rosa Claro (Primary Light): #FFB6C1
- Rosa Escuro (Primary Dark): #DB7093

## 🔒 Autenticação

O sistema utiliza múltiplos métodos de autenticação:

- JWT para autenticação de API
- Firebase Authentication para login e 2FA
- Session-based auth para sessões ativas
- OAuth2 para integração com redes sociais

## 📊 Estado da Aplicação

O gerenciamento de estado é feito através:

- React Query para dados do servidor
- Context API para estado global
- Redux Toolkit para estado complexo
- Zustand para estado local

## 🛡️ Segurança

- Rate limiting em todas as rotas
- Proteção contra XSS e CSRF
- Autenticação 2FA
- Encriptação de dados sensíveis
- Logs de auditoria
- Monitoramento de segurança

## 📊 Analytics

- Google Analytics
- Firebase Analytics
- Mixpanel
- Sentry para monitoramento de erros

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📦 Build

Para gerar o build de produção:

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## 🤝 Como Contribuir
1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## 📄 Licença
Este projeto é estritamente comercial e proprietário. O uso, cópia, modificação ou distribuição do software sem autorização expressa e por escrito da Cuide-Se é estritamente proibido. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- Desenvolvedor 1 - [@Trend-White](https://github.com/Trend-White-Oficial)

## 📞 Suporte

Para suporte, envie um email para cuide.se.ame@gmail.com ou abra uma issue no GitHub.

## 🌍 Internacionalização

O aplicativo suporta múltiplos idiomas através do i18next. Atualmente disponível em:
- Português (pt-BR)
- Inglês (en-US)
- Espanhol (es-ES)

### Como usar

1. **Importar o hook useTranslation**:
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('common.loading')}</Text>;
}
```

2. **Mudar o idioma**:
```typescript
import { useLanguage } from '../hooks/useLanguage';

function LanguageSwitcher() {
  const { changeLanguage } = useLanguage();
  return (
    <Button 
      onPress={() => changeLanguage('en-US')} 
      title="Switch to English" 
    />
  );
}
```

3. **Adicionar novas traduções**:
- Adicione as chaves em `src/i18n/locales/pt-BR.json`
- Adicione as traduções correspondentes em `en-US.json` e `es-ES.json`

### Estrutura de Arquivos

```
src/
  ├── i18n/
  │   ├── index.ts           # Configuração do i18next
  │   └── locales/           # Arquivos de tradução
  │       ├── pt-BR.json
  │       ├── en-US.json
  │       └── es-ES.json
  ├── hooks/
  │   └── useLanguage.ts     # Hook para gerenciar idioma
  └── components/
      └── LanguageSelector.tsx # Componente de seleção de idioma
```

### Boas Práticas

1. **Organização de Chaves**:
   - Use namespaces para organizar traduções
   - Exemplo: `common.loading`, `auth.login`, `appointments.title`

2. **Interpolação**:
```typescript
// No arquivo de tradução
{
  "welcome": "Olá, {{name}}!"
}

// No componente
t('welcome', { name: 'João' })
```

3. **Pluralização**:
```typescript
// No arquivo de tradução
{
  "items": {
    "one": "{{count}} item",
    "other": "{{count}} itens"
  }
}

// No componente
t('items', { count: 2 })
```

4. **Formatação de Datas**:
```typescript
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';

const locales = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': es,
};

const formatDate = (date: Date, language: string) => {
  return format(date, 'PPP', { locale: locales[language] });
};
```

### Testes

Para testar componentes que usam traduções:

```typescript
import { render } from '@testing-library/react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};
```

## 📱 Instalação

```bash
# Instalar dependências
npm install

# Iniciar o app
npm start
```

## 🧪 Testes

```bash
# Rodar testes
npm test

# Rodar testes com cobertura
npm test -- --coverage
```

## 📝 Linting e Formatação

```bash
# Rodar lint
npm run lint

# Formatar código
npm run format
```
