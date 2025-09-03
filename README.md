# 📝 Notes App - Full Stack Implementation

A modern, full-stack web application for taking notes, tagging, and filtering them. Built with React, Node.js, TypeScript, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17.0 or higher
- **npm** 9.6.0 or higher
- **Git** for version control
- **PostgreSQL** database (or Supabase for cloud hosting)

### One-Command Setup
```bash
# Make the script executable (Linux/macOS)
chmod +x run.sh

# Run the application
./run.sh
```

The script will:
- ✅ Check system requirements
- ✅ Install dependencies for both frontend and backend
- ✅ Set up the database schema
- ✅ Start both servers automatically

### Manual Setup
If you prefer to set up manually:

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your database URL
npx prisma generate
npx prisma db push
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication

This application uses **Google OAuth** for authentication via Supabase Auth.

### Login Information
- **Provider**: Google OAuth
- **Method**: Single Sign-On (SSO)
- **Account Selection**: Users must always select an account (no auto-login)
- **No Default Credentials**: Authentication is handled entirely through Google

### Setup Authentication
1. Create a Supabase project at https://supabase.com
2. Enable Google OAuth in Authentication > Providers
3. Configure Google Cloud Console OAuth credentials
4. Add your Supabase credentials to the backend `.env` file

## 🏗️ Architecture

### Frontend (SPA)
- **Framework**: React 18.2.0 + TypeScript 5.0.2
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.2
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Authentication**: Supabase Auth + Google OAuth

### Backend (REST API)
- **Runtime**: Node.js 18.17.0
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.0.2
- **ORM**: Prisma 5.0.0
- **Database**: PostgreSQL 15.0

### Database
- **Provider**: PostgreSQL
- **Hosting**: Supabase (recommended) or local PostgreSQL
- **Schema**: Notes and Tags with many-to-many relationship

## 📋 Features

### Phase 1 (Core Features) ✅
- ✅ **Create, edit, and delete notes**
- ✅ **Archive/unarchive notes**
- ✅ **List active notes**
- ✅ **List archived notes**
- ✅ **Real-time search**
- ✅ **Character count and timestamps**

### Phase 2 (Advanced Features) ✅
- ✅ **Add/remove tags to notes**
- ✅ **Filter notes by tags**
- ✅ **Tag management (create, edit, delete)**
- ✅ **Multi-tag filtering**
- ✅ **Tag-based search**

### UX/UI Features
- 🎨 **Dark theme** with modern design
- 📱 **Responsive layout** for all devices
- ⚡ **Real-time updates** and feedback
- ⌨️ **Keyboard shortcuts** (Ctrl+S, Esc)
- 🔍 **Advanced search** with filters
- 📊 **Visual indicators** for note status
- 🎭 **Smooth animations** with Framer Motion
- 🖱️ **Drag & drop** for note reordering
- 📝 **Markdown editor** with live preview

## 🗄️ Database Schema

```sql
-- Notes table
CREATE TABLE "Note" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isArchived" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  PRIMARY KEY ("id")
);

-- Tags table
CREATE TABLE "Tag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

-- Many-to-many relationship
CREATE TABLE "_NoteTags" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE,
  FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE
);
```

## 🔧 API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/active` - Get active notes
- `GET /api/notes/archived` - Get archived notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PATCH /api/notes/:id/toggle-archive` - Toggle archive status
- `GET /api/notes/search?q=query` - Search notes
- `GET /api/notes/by-tags?tagIds=id1,id2` - Filter by tags

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get tag by ID
- `POST /api/tags` - Create new tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 🛠️ Development

### Project Structure
```
hirelens-project/
├── backend/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── models/          # TypeScript interfaces
│   │   ├── routes/          # API route definitions
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   └── App.tsx          # Main app component
│   └── package.json
├── run.sh                   # One-command runner
└── README.md
```

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌐 Deployment

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Supabase Auth
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Server
PORT=3001
NODE_ENV=production
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve dist/ folder with your preferred web server
```

### Recommended Deployment Platforms
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Railway, Heroku, or DigitalOcean
- **Database**: Supabase (recommended) or AWS RDS

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Dependencies

### Backend Dependencies
- **express**: 4.18.2 - Web framework
- **cors**: 2.8.5 - CORS middleware
- **prisma**: 5.0.0 - Database ORM
- **@prisma/client**: 5.0.0 - Prisma client
- **typescript**: 5.0.2 - TypeScript compiler
- **ts-node**: 10.9.1 - TypeScript execution
- **nodemon**: 3.0.1 - Development server

### Frontend Dependencies
- **react**: 18.2.0 - UI library
- **react-dom**: 18.2.0 - React DOM
- **typescript**: 5.0.2 - TypeScript
- **vite**: 4.4.5 - Build tool
- **tailwindcss**: 3.3.2 - CSS framework
- **framer-motion**: 10.16.4 - Animations
- **lucide-react**: 0.263.1 - Icons
- **react-markdown**: 8.0.7 - Markdown rendering
- **@types/react**: 18.2.15 - React types
- **@types/react-dom**: 18.2.7 - React DOM types


## 📄 License

MIT License - Feel free to use this project as inspiration for your own notes app!

## 👨‍💻 Author

**Santiago Cabrera** - Full Stack Developer

**Portfolio**: [https://portfolio-santiago-ten.vercel.app/](https://portfolio-santiago-ten.vercel.app/)

**GitHub**: [@SantiCabrera19](https://github.com/SantiCabrera19)

---

**Note**: A personal notes application built with modern full-stack technologies. Perfect for organizing thoughts, ideas, and tasks with advanced tagging and search capabilities.