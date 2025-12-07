# Nexus Frontend

Modern Next.js 15 application for the Nexus School Operating System.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: 
  - Zustand (UI state)
  - Tanstack Query (Server state)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure:
```bash
copy .env.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

- **Authentication**: Login/Register with JWT
- **Dashboard**: Overview of courses, assignments, wellness
- **Courses**: View enrolled courses and course details
- **Assignments**: Submit assignments, view grades
- **Wellness**: Mood tracking and statistics
- **Gamification**: XP, levels, badges, leaderboard
- **Wallet**: Digital payments and transactions
- **Messages**: Direct messaging between users
- **Notifications**: Real-time notifications
- **Focus Mode**: Distraction-free learning environment

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   ├── ui/          # Base UI components (Shadcn)
│   ├── atoms/       # Small, reusable components
│   ├── molecules/   # Composite components
│   └── organisms/   # Complex components
├── lib/             # Utilities and API client
├── store/           # Zustand stores
└── hooks/           # Custom React hooks
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the NestJS backend via Axios. The API client (`lib/api.ts`) handles:
- Authentication token injection
- Automatic token refresh
- Error handling
- Request/response interceptors
