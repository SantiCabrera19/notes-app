# 📝 Notes App

> **Live Demo**: [https://notes-app-flax-eight.vercel.app/](https://notes-app-flax-eight.vercel.app/)

A modern, full-stack notes application built with React, TypeScript, Prisma, and deployed on Vercel. Create, organize, and manage your notes with advanced tagging, search, and filtering capabilities.

## 🚀 Features

- ✅ **Create, edit, delete** notes with Markdown-ready content
- ✅ **Archive / Unarchive** notes with 1-click toggle
- ✅ **Tags** with multi-select filtering and popular tags widget
- ✅ **Search** across titles and content with archived filter
- ✅ **Dashboard** with stats, recent notes and popular tags
- ✅ **Authentication (Google OAuth)** via Supabase
- ✅ **User isolation**: cada usuario ve y opera solo sus notas
- ✅ **Modern UI/UX**: dark theme, responsive, animaciones
- ✅ **Serverless-friendly** APIs listas para Vercel

## 🏗️ Architecture

Unified full‑stack design:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: API handlers TypeScript en `api/` ejecutados directamente en dev mediante un **Vite plugin** que intercepta `/api/*` y expone `res.json`/`res.status`.
- **Database**: PostgreSQL (Supabase) con Prisma ORM
- **Auth**: Supabase Auth (Google OAuth)
- **Deploy**: Vercel (static frontend + serverless functions)

## 📁 Project Structure

```
notes-app/
├── api/                        # API handlers (serverless-ready)
│   ├── health.ts               # Health check
│   ├── notes.ts                # Colección de notas
│   └── notes/[id].ts           # Recurso individual (GET/PUT/PATCH/DELETE)
│
├── lib/                        # Backend domain
│   ├── middleware/
│   │   └── auth.ts             # authenticateUser / requireAuth
│   ├── models/                 # Tipos y contratos
│   ├── repositories/           # Acceso a datos (Prisma)
│   └── services/               # Lógica de negocio
│
├── prisma/                     # Esquema y migraciones
│   ├── schema.prisma
│   └── migrations/
│
├── src/                        # Frontend React
│   ├── components/
│   │   └── ui/Footer.tsx       # Footer con enlaces productivos
│   ├── hooks/
│   └── services/api.ts         # API client con headers de auth
│
├── vite.config.ts              # Vite + plugin para enrutar /api/* en dev
├── vercel.json                 # Configuración de despliegue
├── .env.example                # Variables de entorno de referencia
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your database URL and other required variables.

4. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

5. Push database schema:
   ```bash
   npm run db:push
   ```

6. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` — Health check

- `GET /api/notes` — Notas activas del usuario autenticado
- `GET /api/notes?archived=true` — Notas archivadas
- `GET /api/notes?q=search&archived=false` — Búsqueda por texto + filtro de archivado
- `GET /api/notes?tagIds=id1,id2&archived=false` — Filtrado por múltiples tags
- `POST /api/notes` — Crear nota (requiere auth)

- `GET /api/notes/:id` — Obtener una nota (auth + ownership)
- `PUT /api/notes/:id` — Actualizar una nota (auth + ownership)
- `PATCH /api/notes/:id?action=toggle-archive` — Alternar archivado (auth + ownership)
- `DELETE /api/notes/:id` — Borrar una nota (auth + ownership)

- `GET /api/tags` — Listado de tags del usuario

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔐 Authentication & Authorization

- Autenticación con **Supabase Auth** (Google OAuth).
- En cada request, el backend intenta validar `Authorization: Bearer <token>` con Supabase (`authenticateUser`).
- Las operaciones de escritura y lectura de recursos individuales verifican propiedad por `userId` (`requireAuth`).
- En frontend, `AuthGuard` y `useAuth` protegen las acciones sensibles.

## 🌐 Deployment

Optimizada para **Vercel**:
- Conectá el repo a Vercel
- Configurá Variables de Entorno (Production/Preview)
- Cada push a la rama principal dispara un deployment

## 🔧 Environment Variables

Creá tu `.env` local a partir de `.env.example` y configurá lo mismo en Vercel:

```env
# Frontend base URL (usada para redirects de OAuth)
VITE_APP_URL="https://notes-app-<your-subdomain>.vercel.app"

# Supabase (Auth)
VITE_SUPABASE_URL="https://<project>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key>"

# Database (Prisma)
DATABASE_URL="postgresql://user:pass@host:5432/db"
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

Supabase OAuth Redirects recomendados:
- `https://<your-domain>/api/auth/callback`
- `https://<your-domain>`

## 👨‍💻 Author

**Santiago Cabrera** - Full Stack Developer

- **Portfolio**: [https://portfolio-santiago-ten.vercel.app/](https://portfolio-santiago-ten.vercel.app/)
- **GitHub**: [@SantiCabrera19](https://github.com/SantiCabrera19)
- **LinkedIn**: [Santiago Emanuel Cabrera](https://www.linkedin.com/in/santiago-emanuel-cabrera-0a1120238/)
- **Email**: santiagocabrera.dev@gmail.com

## 📄 License

MIT License - Feel free to use this project as inspiration for your own notes app!

---

⭐ **Star this repo if you found it helpful!**
