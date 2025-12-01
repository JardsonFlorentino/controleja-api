## 💰 ControleJá - API (Backend)
API RESTful para gerenciamento de finanças pessoais, responsável por todas as regras de negócio e persistência de dados do ControleJá.
Fornece endpoints para transações, categorias, resumos mensais e histórico financeiro.

## 🌐 Projeto
🔗 Frontend:[ https://github.com/JardsonFlorentino/devbills---interface](https://github.com/JardsonFlorentino/controleja-interface)
🔗 Backend: [https://github.com/JardsonFlorentino/devbills---api/](https://github.com/JardsonFlorentino/controleja-api)

A ControleJá API é o backend de uma aplicação full stack de controle financeiro, desenvolvida como parte do curso Full Stack do DevClub.
Ela foi construída com foco em boas práticas de API moderna:

- Servidor HTTP performático com Fastify
- Acesso a banco de dados com Prisma ORM
- Cálculo de saldo acumulado entre meses
- Resumo financeiro com agrupamento por categoria
- Autenticação via Firebase Admin (service account em variáveis de ambiente)
- Validação de entrada com Zod

## 🚀 Funcionalidades (Backend)

✅ CRUD de transações:

- Criação, listagem e exclusão de receitas e despesas
- Associação a categorias personalizadas

✅ Resumo mensal (/transactions/summary):

- Total de receitas e despesas do mês
- Saldo inicial do mês (acumulado dos meses anteriores)
- Resultado do mês (receitas − despesas)
- Saldo total até o fim do mês
- Despesas agrupadas por categoria com valor e percentual

✅ Histórico financeiro (/transactions/historical):

- Retorno de dados agregados por mês para gráficos

✅ Categorias:

- Listagem de categorias com nome e cor

✅ Autenticação:

- Identificação do usuário por userId derivado do Firebase (middleware de auth)

## 🛠️ Stack Tecnológica (Backend)

- Node.js – Runtime JavaScript
- TypeScript – Tipagem estática
- Fastify – Framework HTTP de alta performance
- Prisma ORM – Acesso ao banco relacional
- PostgreSQL (ou outro banco configurado via DATABASE_URL)
- Firebase Admin SDK – Autenticação de usuários
- Zod – Validação de schemas (query/body)
- Dayjs (+ UTC) – Manipulação de datas
- Dotenv – Variáveis de ambiente

## 📦 Instalação Local (Backend)

Pré-requisitos

- Node.js 18+
- Banco de dados (ex.: PostgreSQL)
- Conta Firebase (para gerar credenciais e usar no .env)

Passos

```bash

# Clonar o repositório da API
git clone https://github.com/SEU_USUARIO/controleja-api.git
cd controleja-api

# Instalar dependências
npm install
# ou
yarn install

# Gerar client do Prisma
npx prisma generate

# Criar arquivo de ambiente
cp .env.example .env
# Edite o .env com:
# DATABASE_URL=...
# FIREBASE_PROJECT_ID=...
# FIREBASE_CLIENT_EMAIL=...
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# PORT=3333 (se quiser)

# Rodar migrações do banco
npx prisma migrate dev
# ou, em produção:
# npx prisma migrate deploy

# Iniciar servidor em desenvolvimento
npm run dev
# ou
yarn dev
```

Por padrão, a API ficará disponível em algo como http://localhost:3001.


## 📁 Estrutura de Pastas (Backend)
Exemplo de organização:

```bash
src/
├── config/
│   ├── env.ts                 # Carregamento/validação de variáveis de ambiente
│   ├── prisma.ts              # Instância do Prisma Client
│   └── firebase.ts            # Inicialização do Firebase Admin
├── controllers/
│   ├── category.controller.ts
│   └── transactions/
│       ├── createTransaction.controller.ts
│       ├── deleteTransaction.controller.ts
│       ├── getTransactions.controller.ts
│       ├── getTransactionsSummary.controller.ts
│       └── getHistoricalTransactions.controller.ts
├── middlewares/
│   └── auth.middlewares.ts    # Middleware de autenticação (Firebase token → userId)
├── routes/
│   ├── category.routes.ts
│   ├── transaction.routes.ts
│   └── index.ts               # Registro das rotas no Fastify
├── schemas/
│   └── transaction.schema.ts  # Schemas Zod (query/body/params)
├── types/
│   ├── category.types.ts
│   └── transaction.types.ts
├── services/
│   └── globalCategories.service.ts
├── server.ts                  # Inicializa o Fastify
└── app.ts                     # Configurações principais da aplicação
```

## 🔐 Segurança e Segredos
As credenciais do Firebase (service account) são lidas via variáveis de ambiente e nunca devem ser commitadas no repositório.

O arquivo JSON original da service account deve ficar fora do versionamento git e ser referenciado apenas localmente ou convertido para env (FIREBASE_PRIVATE_KEY com quebras de linha \n).

Utilize .env e .env.example para documentar variáveis necessárias, mantendo o .env fora do controle de versão.

## 🙋‍♂️ Autor

Desenvolvido por Jardson

[Meu LinkedIn](https://www.linkedin.com/in/jardsonflorentino) | [Meu GitHub](https://github.com/JardsonFlorentino)
