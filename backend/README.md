# Nexus Backend

AI-Driven School Operating System - Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
copy .env.example .env
```

3. Set up your PostgreSQL database and update the `DATABASE_URL` in `.env`

4. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`
API Documentation (Swagger): `http://localhost:3001/api/docs`

## Features

- **Authentication**: JWT-based auth with refresh tokens
- **User Management**: Students, Teachers, Parents, Admins
- **Courses**: Course creation, enrollment, schedules
- **Assignments & Submissions**: Create assignments, submit work, AI grading
- **Attendance**: Bulk attendance recording and tracking
- **Wellness**: Mood tracking with flagging for low scores
- **Gamification**: XP, levels, badges, leaderboard
- **Wallet**: Digital payments and transactions
- **AI Services**: Auto-grading, study buddy chat
- **Messages**: Direct messaging between users
- **Notifications**: System notifications

## API Documentation

Visit `/api/docs` for interactive Swagger documentation.

## Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:studio` - Open Prisma Studio (Database GUI)
- `npm run test` - Run tests
