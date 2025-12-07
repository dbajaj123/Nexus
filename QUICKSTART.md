# Quick Start - Nexus School Operating System

This guide will help you get Nexus up and running in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- OpenAI API key (for AI features)

## Quick Setup (Windows)

### 1. Setup Backend

```bash
cd backend
setup.bat
```

This will:
- Install all dependencies
- Create .env file (you'll need to fill in your database credentials)
- Generate Prisma client
- Run database migrations

**Important:** Update the `.env` file with:
- Your PostgreSQL connection string
- JWT secrets (at least 32 characters)
- OpenAI API key

Then start the server:
```bash
npm run start:dev
```

### 2. Setup Frontend (in a new terminal)

```bash
cd frontend
setup.bat
```

This will:
- Install all dependencies
- Create .env.local file

Then start the server:
```bash
npm run dev
```

## Quick Setup (Mac/Linux)

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Access the Application

1. Frontend: http://localhost:3000
2. Backend API: http://localhost:3001
3. API Documentation: http://localhost:3001/api/docs
4. Database UI: Run `npm run prisma:studio` in backend folder

## Create Your First Account

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in the registration form:
   - Email: your@email.com
   - Password: minimum 8 characters
   - First Name & Last Name
   - Role: Student (or Teacher/Parent)
4. Click "Create account"
5. You'll be automatically logged in to the dashboard

## Test Features

### As a Student:
- View enrolled courses
- Check upcoming assignments
- Log wellness entries
- View your XP and level
- Check the leaderboard

### As a Teacher:
- Create courses
- Create assignments
- Grade submissions (with AI assistance)
- Record attendance
- Award badges

### As a Parent:
- View child's progress
- Monitor wellness
- View transactions

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexus"
JWT_SECRET="your-secret-min-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-characters"
OPENAI_API_KEY="sk-your-openai-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Common Issues

### Backend won't start
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure the database exists: `CREATE DATABASE nexus;`

### Frontend can't connect to API
- Make sure backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in .env.local

### Database migration errors
```bash
cd backend
npm run prisma:migrate reset  # WARNING: Deletes all data
npm run prisma:migrate dev
```

## Key Technologies

- **Backend**: NestJS, Prisma, PostgreSQL, OpenAI
- **Frontend**: Next.js 15, React, Tailwind CSS, Zustand
- **Auth**: JWT with refresh tokens
- **API**: RESTful with Swagger documentation

## Next Steps

1. Explore the API documentation at `/api/docs`
2. Review the complete SETUP_GUIDE.md for detailed information
3. Check README.md for architecture details
4. Customize the system for your needs

## Need Help?

- Check SETUP_GUIDE.md for detailed setup instructions
- Review backend/README.md for API details
- Check frontend/README.md for UI component info
- Open Prisma Studio to view/edit database: `npm run prisma:studio`

---

Happy coding! 🚀
