# Nexus - Complete Setup Guide

This guide will walk you through setting up the complete Nexus School Operating System.

## Prerequisites

Before starting, ensure you have:

- **Node.js 20+** installed
- **PostgreSQL 15+** - See installation below
- **npm** or **yarn** package manager
- **Git** (optional)
- **OpenAI API Key** (for AI features)

## Step 0: Install PostgreSQL Locally (Windows)

### Quick Install (Recommended)
```powershell
# Using winget (Windows Package Manager)
winget install PostgreSQL.PostgreSQL.15

# The installer will prompt you to set a password for the 'postgres' user
# Remember this password - you'll need it!
```

### Post-Installation
1. **Add PostgreSQL to PATH** (if not done automatically):
   - Search for "Environment Variables" in Windows
   - Add `C:\Program Files\PostgreSQL\15\bin` to your PATH

2. **Verify Installation**:
```powershell
psql --version
# Should show: psql (PostgreSQL) 15.x
```

3. **Start PostgreSQL Service** (usually starts automatically):
```powershell
# Check if running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15
```

### Alternative: Using Docker
```powershell
# If you prefer Docker
docker run -d `
  --name nexus-postgres `
  -e POSTGRES_PASSWORD=your_password `
  -e POSTGRES_DB=nexus `
  -p 5432:5432 `
  postgres:15
```

## Step 1: Database Setup

### Connect to PostgreSQL
```powershell
# Connect as postgres superuser
psql -U postgres

# You'll be prompted for the password you set during installation
```

### Create Database and User
```sql
-- Create the database
CREATE DATABASE nexus;

-- Create a user for the application
CREATE USER nexus_user WITH PASSWORD 'your_secure_password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE nexus TO nexus_user;

-- Exit psql
\q
```

### Your Connection String
Your `DATABASE_URL` will be:
```
postgresql://nexus_user:your_secure_password@localhost:5432/nexus
```

## Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://nexus_user:your_password@localhost:5432/nexus?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
OPENAI_API_KEY="sk-your-openai-api-key"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

7. (Optional) Open Prisma Studio to view/edit data:
```bash
npm run prisma:studio
```

8. Start the backend server:
```bash
npm run start:dev
```

The backend should now be running at `http://localhost:3001`
API Documentation: `http://localhost:3001/api/docs`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
# Windows
copy .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running at `http://localhost:3000`

## Step 4: Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. Click "Get Started" or "Sign up"
3. Create a test account with:
   - Email: student@test.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Role: Student

4. After registration, you'll be logged in automatically
5. Explore the dashboard and features

## Step 5: Create Sample Data (Optional)

You can use Prisma Studio to create sample data:

```bash
cd backend
npm run prisma:studio
```

Or create data via the API:

### Create a Teacher Account:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@test.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "TEACHER",
    "schoolId": "school-001"
  }'
```

### Create a Course (as Teacher):
1. Login as teacher
2. Get the access token
3. Create a course:

```bash
curl -X POST http://localhost:3001/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Mathematics 101",
    "code": "MATH-101",
    "description": "Introduction to Algebra"
  }'
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change PORT in backend/.env
PORT=3002
```

**Database connection error:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists
- Verify user permissions

**Prisma errors:**
```bash
# Reset database (WARNING: This will delete all data)
npm run prisma:migrate reset

# Or manually delete migrations and start fresh
# Delete prisma/migrations folder
npm run prisma:migrate dev --name init
```

### Frontend Issues

**API connection error:**
- Ensure backend is running
- Check NEXT_PUBLIC_API_URL in .env.local
- Clear browser cache

**Build errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Port 3000 in use:**
```bash
# Next.js will automatically use the next available port
# Or specify a different port:
npm run dev -- -p 3001
```

## Development Workflow

### Making Changes to Database Schema

1. Update `backend/prisma/schema.prisma`
2. Create and apply migration:
```bash
cd backend
npm run prisma:migrate dev --name your_migration_name
```
3. Restart backend server

### Adding New API Endpoints

1. Create/update controller in `backend/src/[module]/`
2. Update service logic
3. Add DTOs for validation
4. Test with Swagger at `/api/docs`

### Adding New Frontend Pages

1. Create page in `frontend/src/app/[route]/page.tsx`
2. Add navigation link in dashboard layout
3. Create necessary components
4. Add API queries with React Query

## API Testing

### Using Swagger UI
Visit `http://localhost:3001/api/docs` for interactive API testing

### Using curl

**Register:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123","firstName":"Test","lastName":"User","role":"STUDENT","schoolId":"school-001"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

**Get Profile (authenticated):**
```bash
curl http://localhost:3001/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Production Deployment

### Backend (Google App Engine)

1. Install Google Cloud SDK
2. Create a Google Cloud Project
3. Set up Cloud SQL (PostgreSQL)
4. Update `backend/app.yaml` with environment variables
5. Deploy:
```bash
cd backend
gcloud app deploy
```

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - NEXT_PUBLIC_API_URL = your backend URL

## Next Steps

1. **Customize the system** for your school's needs
2. **Add more features** based on requirements
3. **Set up CI/CD** with GitHub Actions
4. **Add monitoring** with services like Sentry
5. **Implement analytics** with Google Analytics
6. **Create mobile app** using React Native (future)

## Support

For issues or questions:
- Check the README.md files in backend and frontend directories
- Review API documentation at `/api/docs`
- Check database schema in `backend/prisma/schema.prisma`

## Security Checklist

Before deploying to production:

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS policies
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Review and restrict API permissions
- [ ] Set up Google Cloud Secret Manager (for production)
- [ ] Configure firewall rules
- [ ] Set up proper authentication flows
- [ ] Test security vulnerabilities

---

🎉 Congratulations! Your Nexus system is now set up and ready to use!
