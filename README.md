# 📝 Notes App

> **Live Demo**: [https://notes-app-flax-eight.vercel.app/](https://notes-app-flax-eight.vercel.app/)

A modern, full-stack notes application built with React, TypeScript, Prisma, and deployed on Vercel. Create, organize, and manage your notes with advanced tagging, search, and filtering capabilities.

## 🚀 Features

- ✅ **Create, edit, and delete notes** with rich markdown support
- ✅ **Archive/unarchive notes** for better organization
- ✅ **Advanced tagging system** with multi-tag filtering
- ✅ **Real-time search** across titles and content
- ✅ **Responsive design** - works on desktop and mobile
- ✅ **Dark theme** with modern UI/UX
- ✅ **Google OAuth authentication** via Supabase
- ✅ **Serverless architecture** for optimal performance

## 🏗️ Architecture

This is a unified full-stack project with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Serverless API routes in `/api` folder  
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth + Google OAuth
- **Deployment**: Vercel

## 📁 Project Structure

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
│   └── services/          # API client
├── .env                   # Environment variables
├── package.json
├── vite.config.ts         # Vite configuration
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

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 Deployment

This app is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

The app will automatically build and deploy with serverless functions.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_direct_postgresql_connection_string"

# Supabase (for authentication)
SUPABASE_URL="your_supabase_project_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"

# Frontend Supabase
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

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
