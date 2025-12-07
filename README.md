# Nexus - AI-Driven School Operating System

A revolutionary school management platform with AI, gamification, and wellness tracking.

## 🚀 Project Overview

Nexus is a comprehensive school operating system that combines modern education management with cutting-edge AI technology, gamification elements, and student wellness monitoring.

## 📁 Project Structure

```
nexus/
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── auth/            # Authentication & JWT
│   │   ├── users/           # User management
│   │   ├── courses/         # Course management
│   │   ├── assignments/     # Assignment creation
│   │   ├── submissions/     # Student submissions
│   │   ├── attendance/      # Attendance tracking
│   │   ├── wellness/        # Wellness logging
│   │   ├── wallet/          # Digital wallet
│   │   ├── gamification/    # XP, badges, leaderboard
│   │   ├── ai/              # OpenAI integration
│   │   ├── messages/        # Direct messaging
│   │   └── notifications/   # System notifications
│   └── prisma/
│       └── schema.prisma    # Database schema
│
└── frontend/         # Next.js 15 Application
    └── src/
        ├── app/            # App Router pages
        ├── components/     # React components
        ├── lib/            # Utilities & API client
        └── store/          # Zustand state management
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js 20)
- **Language**: TypeScript (Strict)
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: JWT with Passport
- **AI**: OpenAI GPT-4o-mini
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand + Tanstack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 🎯 Key Features

### 1. Authentication & User Management
- Multi-role system (Student, Teacher, Parent, Admin)
- JWT-based auth with refresh tokens
- Secure password hashing with bcrypt

### 2. Academic Management
- Course creation and enrollment
- Assignment creation and submission
- AI-powered auto-grading
- Resource management
- Schedule tracking

### 3. Attendance System
- Bulk attendance recording
- Attendance statistics
- Automated reporting

### 4. Wellness Tracking
- Daily mood logging (1-10 scale)
- Automatic flagging for low mood scores
- Trend analysis
- Counselor alerts

### 5. Gamification
- XP and leveling system
- Badge achievements
- School-wide leaderboard
- Progress tracking

### 6. Digital Wallet
- Balance management
- Transaction history
- Payment processing
- Deposits and refunds

### 7. AI Features
- Auto-grading with detailed feedback
- AI Study Buddy (Socratic learning)
- Content summarization
- Sentiment analysis

### 8. Communication
- Direct messaging between users
- System notifications
- Real-time updates (Socket.io ready)

### 9. Focus Mode
- Distraction-free UI
- Hide gamification elements
- Improved concentration

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
copy .env.example .env
```

Update `.env` with your database URL, JWT secrets, and OpenAI API key.

4. Run database migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the server:
```bash
npm run start:dev
```

Backend runs on `http://localhost:3001`
API Docs: `http://localhost:3001/api/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
copy .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📊 Database Schema

The system uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and profile data
- **Profile**: User details, XP, level, badges
- **Course**: Course information and teacher assignments
- **Enrollment**: Student-course relationships
- **Assignment**: Homework, exams, projects
- **Submission**: Student work and grading
- **AttendanceRecord**: Daily attendance tracking
- **WellnessLog**: Mood and wellness tracking
- **Wallet**: Financial management
- **Transaction**: Payment history
- **Badge**: Achievement definitions
- **Message**: Direct messaging
- **Notification**: System alerts

## 🔐 Security Features

- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- SQL injection prevention (Prisma)

## 🎨 UI/UX Features

- Responsive design (mobile-ready)
- Dark mode support (via Tailwind)
- Atomic design pattern
- Accessible components (Radix UI)
- Loading states
- Error boundaries
- Optimistic UI updates

## 📈 Performance Optimizations

- React Query caching
- Optimistic mutations
- Code splitting (Next.js)
- Image optimization
- Database indexing
- Connection pooling

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm run test
```

Run frontend lint:
```bash
cd frontend
npm run lint
```

## Deployment

### Backend (Google Cloud Run)
```bash
cd backend
# Build and deploy to Cloud Run
gcloud run deploy nexus-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend (Vercel)
```bash
cd frontend
# Deploy to Vercel
vercel --prod
```

### Environment Variables
**Backend (Google Cloud Run):**
- Set via: `gcloud run services update nexus-backend --set-env-vars KEY=value`
- Required: `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`

**Frontend (Vercel):**
- Set via Vercel Dashboard or CLI
- Required: `NEXT_PUBLIC_API_URL`

## 📝 API Documentation

Full API documentation is available at `/api/docs` when running the backend server.

Key endpoints:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /courses/my-courses` - Get enrolled courses
- `GET /assignments/upcoming` - Get upcoming assignments
- `POST /submissions` - Submit assignment
- `POST /wellness/log` - Log wellness entry
- `GET /gamification/leaderboard` - Get leaderboard

## 🤝 Contributing

This is a demonstration project showcasing a full-stack TypeScript application with modern best practices.

## 📄 License

Private project for educational purposes.

## 👥 Roles & Permissions

### Student
- View courses and assignments
- Submit assignments
- Track wellness
- View leaderboard
- Use AI study buddy
- Manage wallet

### Teacher
- Create courses and assignments
- Grade submissions
- Record attendance
- View flagged wellness logs
- Award badges

### Parent
- View child's progress
- Monitor wellness
- View transactions
- Communicate with teachers

### Admin
- Full system access
- User management
- System configuration
- Analytics dashboard

## 🎯 Future Enhancements (Mobile App)

The architecture is designed to support a future mobile application using:
- React Native or Flutter
- Same backend API
- Real-time notifications
- Offline support
- Native mobile features

---

Built with ❤️ using TypeScript, NestJS, Next.js, and PostgreSQL
