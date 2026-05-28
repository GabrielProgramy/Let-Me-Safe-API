# 🛡️ Let Me Safe — API

API REST do aplicativo **Let Me Safe**, um sistema de mobilidade e segurança urbana desenvolvido como Trabalho de Conclusão de Curso (TCC) em Análise e Desenvolvimento de Sistemas.

O app permite que usuários visualizem ocorrências de crimes em um mapa, registrem incidentes, tracem rotas seguras e gerenciem contatos de emergência.

---

## 🧱 Arquitetura e Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Linguagem | TypeScript |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT (Bearer Token) |
| Notificações / Auth Social | Firebase |
| Integração de Endereços | ViaCEP API |
| Containerização | Docker + Docker Compose |
| Qualidade de Código | ESLint + Prettier |

A API segue arquitetura REST com separação em camadas bem definidas: banco de dados (entities, migrations, repositories), serviços de negócio, camada HTTP e utilitários. A autenticação é stateless via JWT — o cliente recebe um token único no login e o envia no header `Authorization: Bearer <token>` em todas as rotas protegidas.

---

## 📁 Estrutura do Projeto

```
src/
├── database/
│   ├── entities/       # Modelos de dados (TypeORM ou similar)
│   ├── migrations/     # Versionamento do schema do banco
│   └── repositories/   # Acesso a dados por entidade
│   └── connection.ts   # Configuração da conexão com PostgreSQL
├── http/               # Rotas, controllers e middlewares
├── service/
│   ├── AddressService.ts      # Integração com ViaCEP
│   ├── ContactsService.ts     # Lógica de contatos de emergência
│   ├── EmailService.ts        # Envio de e-mails (recuperação de senha)
│   ├── OcurrencesService.ts   # Lógica de ocorrências e rotas seguras
│   └── UsersService.ts        # Lógica de usuários e autenticação
└── utils/
    ├── templates/      # Templates HTML de e-mail
    ├── firebase.ts     # Configuração do Firebase
    └── viaCepAPI.ts    # Client da API ViaCEP
```

---

## 🔐 Autenticação

A API utiliza autenticação via **JWT**. Após o login, o cliente recebe um token único que deve ser enviado em todas as requisições protegidas.

- Token enviado no header: `Authorization: Bearer <token>`
- Suporte a login social via **Google OAuth** (integrado com Firebase)
- Fluxo de recuperação de senha por e-mail com templates HTML

---

## 📡 Endpoints

### 👤 Usuário (`/user`)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/user/:userId` | Busca dados de um usuário pelo ID | ✅ |
| `POST` | `/user/` | Criação de conta | ❌ |
| `POST` | `/user/auth` | Login com e-mail e senha | ❌ |
| `POST` | `/user/auth/google` | Login via Google OAuth | ❌ |
| `POST` | `/user/auth/refresh` | Renova o token de sessão | ✅ |
| `PUT` | `/user/me` | Atualiza dados do próprio perfil | ✅ |
| `POST` | `/user/forgot` | Solicita redefinição de senha | ❌ |
| `PATCH` | `/user/reset-password` | Redefine a senha | ❌ |

---

### 📍 Ocorrências (`/ocurrences`)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/ocurrences/` | Lista ocorrências com filtros | ✅ |
| `GET` | `/ocurrences/all` | Lista todas as ocorrências | ✅ |
| `GET` | `/ocurrences/nearby` | Ocorrências próximas à localização do usuário | ✅ |
| `GET` | `/ocurrences/dangerous-neighborhoods` | Bairros com maior índice de ocorrências | ✅ |
| `GET` | `/ocurrences/frequent` | Tipos de ocorrências mais frequentes | ✅ |
| `GET` | `/ocurrences/safe-route` | Traça rota segura entre dois pontos | ✅ |
| `POST` | `/ocurrences/` | Registra uma nova ocorrência | ✅ |

---

### 🆘 Contatos de Emergência (`/users`)

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `GET` | `/users/me` | Lista contatos de emergência do usuário | ✅ |
| `GET` | `/users/me/:contactId` | Busca um contato específico | ✅ |
| `POST` | `/users/` | Adiciona um contato de emergência | ✅ |
| `PUT` | `/users/:contactId` | Atualiza um contato | ✅ |
| `DELETE` | `/users/:contactId` | Remove um contato | ✅ |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/gabrielprogramy/let-me-safe-api.git
cd let-me-safe-api
```

### 2. Configure as variáveis de ambiente

```bash
cp .envrc-sample .env
# Edite o .env com suas configurações (banco, JWT secret, etc.)
```

### 3. Suba o banco com Docker

```bash
docker-compose up -d
```

### 4. Instale as dependências e rode a API

```bash
npm install
npm run dev
```

A API estará disponível em `http://localhost:3000`.

---

## 👥 Equipe

Desenvolvido como TCC do curso de **Análise e Desenvolvimento de Sistemas**.

| Dev | Papel |
|---|---|
| [@gabrielprogramy](https://github.com/gabrielprogramy) | Backend — Arquitetura da API, banco de dados, autenticação |
| [@marclipe](https://github.com/marclipe) | Desenvolvimento mobile |
