# Chatty Backend

TypeScript Express API with JWT auth, MongoDB (Mongoose), Zod validation, Winston logging, and global error handling. ES modules, MVC structure.

## Setup

1. Copy environment file:

```bash
cp .env.example .env
```

2. Start development server:

```bash
pnpm dev
```

## REST endpoints

- POST `/api/auth/register` { email, password, name }
- POST `/api/auth/login` { email, password }
- GET `/health`

## Scripts

- `pnpm dev` – run with nodemon + ts-node
- `pnpm build` – compile to `dist`
- `pnpm start` – run compiled server
