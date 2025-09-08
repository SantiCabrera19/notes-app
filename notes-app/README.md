# Notes App

A full-stack notes application built with React, TypeScript, Prisma, and deployed on Vercel.

## Architecture

This is a single-app fullstack project with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Serverless API routes in `/api` folder
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Project Structure

```
notes-app/
├── api/                    # Serverless API endpoints
│   ├── health.ts          # Health check endpoint
│   ├── notes.ts           # Notes CRUD operations
│   └── tags.ts            # Tags CRUD operations
├── lib/                   # Backend business logic
│   ├── models/            # TypeScript interfaces
│   ├── repositories/      # Data access layer
│   └── services/          # Business logic layer
├── prisma/                # Database schema and migrations
│   └── schema.prisma
├── public/                # Static assets
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   └── services/          # API client
├── .env                   # Environment variables
├── package.json
└── vercel.json            # Vercel deployment config
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

- `GET /api/health` - Health check
- `GET /api/notes` - Get all active notes
- `GET /api/notes?archived=true` - Get archived notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Deployment

This app is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

The app will automatically build and deploy with serverless functions.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
