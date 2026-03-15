# DevRoast - Especificação Técnica

## 1. Visão Geral

**DevRoast** é uma plataforma para publicar e avaliar código com feedback automático (roast) gerado por IA. Desenvolvida durante a NLW da Rocketseat.

## 2. Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI**: Radix UI (acessibilidade), Shiki (syntax highlighting)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL com Drizzle ORM
- **IA**: Vercel AI SDK (provider agnóstico)
- **DevOps**: Docker Compose

## 3. Arquitetura de Dados

### 3.1 Schema do Banco

```typescript
// Submissões anónimas - sem tabela de utilizadores
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  language: varchar('language', { length: 50 }).notNull(),
  roast: text('roast').notNull(), // Feedback gerado pela IA
  score: integer('score').notNull().default(0), // Votos positivos
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .references(() => submissions.id, { onDelete: 'cascade' })
    .notNull(),
  // Sem user_id - anonimo
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### 3.2 Decisões de Design

| Decisão | Justificativa |
|---------|----------------|
| Submissões anónimas | Simplicidade, sem necessidade de auth |
| Sem tabela de users | Decisão de produto:匿名 submissions |
| Leaderboard automático | Todos os entries visíveis sem opt-in |

## 4. Integração com IA

### 4.1 Vercel AI SDK

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

type ModelProvider = 'openai' | 'anthropic' | 'google';

interface RoastConfig {
  provider: ModelProvider;
  model: string;
  systemPrompt: string;
}

const roastConfig: RoastConfig = {
  provider: 'anthropic', // configurável
  model: 'claude-3-5-sonnet-20241022',
  systemPrompt: `You are a code reviewer with a humorous personality. 
  Roast this code constructively but with wit. Keep it under 280 characters.`,
};

async function generateRoast(code: string, language: string) {
  const result = await generateText({
    model: openai('gpt-4o-mini'), // pode ser substituido
    prompt: `${roastConfig.systemPrompt}\n\nLanguage: ${language}\nCode:\n${code}`,
  });
  
  return result.text;
}
```

### 4.2 Provider Support

| Provider | Modelo Recomendado | Status |
|----------|-------------------|--------|
| OpenAI | gpt-4o-mini | ✓ Suportado |
| Anthropic | claude-3-5-sonnet | ✓ Suportado |
| Google | gemini-1.5-flash | ✓ Suportado |

Configuração via variáveis de ambiente:
```env
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AI_API_KEY=sk-...
```

## 5. API Endpoints

### 5.1 Submissões

```
POST /api/submissions
Body: { code: string, language: string }
Response: { id: string, roast: string, score: number }

GET /api/submissions
Response: { submissions: Submission[] }

GET /api/submissions/[id]
Response: { submission: Submission }
```

### 5.2 Votação

```
POST /api/votes
Body: { submissionId: string }
Response: { success: true }

DELETE /api/votes
Body: { submissionId: string }
Response: { success: true }
```

### 5.3 Leaderboard

```
GET /api/leaderboard
Query: ?limit=10&offset=0
Response: { entries: LeaderboardEntry[] }

GET /api/leaderboard/top
Response: { top: LeaderboardEntry[] }
```

## 6. Docker Compose

### 6.1 docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

  studio:
    image: drizzle0171/drizzle-studio:latest
    container_name: devroast-studio
    environment:
      DATABASE_URL: postgresql://devroast:devroast@postgres:5432/devroast
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### 6.2 Setup Drizzle

```bash
# Install Drizzle Kit
npm install drizzle-kit

# Configuração drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 6.3 Scripts npm

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:migrate": "drizzle-kit migrate",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:reset": "docker-compose down -v && docker-compose up -d"
  }
}
```

### 6.4 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast

# IA
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AI_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 7. Fluxo do Utilizador

```
1. Homepage
   └── Editor de código (com syntax highlighting)
       └── Botão "Roast!"

2. Submissão
   └── Código enviado para API
       └── IA gera roast
           └── Guardado na BD
               └── Redirect para página de resultado

3. Página de Resultado
   └── Código + Roast + Score
       └── Votar (upvote)
           └── Atualizar leaderboard

4. Leaderboard
   └── Top submissions
       └── Ordenado por score
```

## 8. Componentes UI

### 8.1 Estrutura

```
src/components/
├── ui/                    # Componentes base
│   ├── button.tsx
│   ├── card.tsx
│   ├── code-editor.tsx    # Com Shiki
│   └── language-selector.tsx
├── submission/
│   ├── submission-form.tsx
│   └── submission-card.tsx
├── leaderboard/
│   ├── leaderboard.tsx
│   └── leaderboard-row.tsx
└── roast/
    └── roast-display.tsx
```

## 9. Deploy

### 9.1 Produção

```bash
# Build
npm run build

# Docker image
docker build -t devroast .
docker run -p 3000:3000 --env-file .env.production devroast
```

### 9.2 Variáveis Production

```env
DATABASE_URL=postgresql://user:pass@host:5432/devroast
AI_PROVIDER=anthropic
AI_API_KEY=sk-ant-...
```

---

**Última atualização:** Mars 2026
