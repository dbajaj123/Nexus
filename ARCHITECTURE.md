# Nexus System Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXUS SYSTEM                             │
│                  School Operating System                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐
│   Frontend (Next.js) │          │   Backend (NestJS)   │
│   Port 3000          │◄────────►│   Port 3001          │
│                      │   HTTP   │                      │
│  - React 19          │   REST   │  - Node.js 20        │
│  - TypeScript        │   API    │  - TypeScript        │
│  - Tailwind CSS      │          │  - Prisma ORM        │
│  - Zustand           │          │  - JWT Auth          │
│  - React Query       │          │  - OpenAI SDK        │
└──────────────────────┘          └──────────────────────┘
                                           │
                                           │
                                           ▼
                                  ┌──────────────────────┐
                                  │  PostgreSQL Database │
                                  │  Port 5432           │
                                  │                      │
                                  │  - 15+ Tables        │
                                  │  - Indexed Queries   │
                                  │  - Relationships     │
                                  └──────────────────────┘
                                           │
                                           │
                                  ┌────────▼──────────────┐
                                  │   External Services   │
                                  │                       │
                                  │  - OpenAI API         │
                                  │  - GCS (Files)        │
                                  │  - Email (Future)     │
                                  └───────────────────────┘
```

## User Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Landing Page (/)                    │
│  - Hero Section                      │
│  - Feature Showcase                  │
│  - Call to Action                    │
└──────┬───────────────────────────────┘
       │
       ├─► Login (/login)
       │   └─► Dashboard
       │
       └─► Register (/register)
           └─► Dashboard

┌──────────────────────────────────────┐
│  Dashboard (/dashboard)              │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Header (Global Navigation)    │ │
│  │  - User Info, Notifications    │ │
│  │  - Focus Mode Toggle           │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌──────┐  ┌───────────────────┐   │
│  │Side- │  │  Main Content     │   │
│  │bar   │  │                   │   │
│  │      │  │  - Stats Cards    │   │
│  │Nav   │  │  - Courses        │   │
│  │Items │  │  - Assignments    │   │
│  │      │  │  - Activity Feed  │   │
│  └──────┘  └───────────────────┘   │
└──────────────────────────────────────┘
```

## Data Flow

```
1. AUTHENTICATION FLOW
═══════════════════════

User                Frontend            Backend             Database
 │                     │                  │                    │
 ├──Login Request─────►│                  │                    │
 │                     ├──POST /auth/────►│                    │
 │                     │     login        │                    │
 │                     │                  ├──Query User───────►│
 │                     │                  │                    │
 │                     │                  │◄───User Data───────┤
 │                     │                  │                    │
 │                     │                  ├──Verify Password───┤
 │                     │                  │                    │
 │                     │                  ├──Generate JWT──────┤
 │                     │                  │                    │
 │                     │◄─Tokens + User───┤                    │
 │                     │                  │                    │
 │◄───Store in─────────┤                  │                    │
 │     Zustand         │                  │                    │
 │                     │                  │                    │


2. ASSIGNMENT SUBMISSION FLOW
══════════════════════════════

Student             Frontend            Backend             AI Service
 │                     │                  │                    │
 ├──Submit Work───────►│                  │                    │
 │                     ├──POST /submit───►│                    │
 │                     │                  │                    │
 │                     │                  ├──Save to DB────────┤
 │                     │                  │                    │
 │                     │                  ├──AI Grade─────────►│
 │                     │                  │                    │
 │                     │                  │◄──Score + Feedback─┤
 │                     │                  │                    │
 │                     │◄─Submission Data─┤                    │
 │                     │                  │                    │
 │◄───Update UI────────┤                  │                    │
 │   (Optimistic)      │                  │                    │
 │                     │                  │                    │


3. GAMIFICATION FLOW
════════════════════

Action               Backend             Database           Frontend
 │                     │                    │                  │
 ├──Assignment Done───►│                    │                  │
 │                     │                    │                  │
 │                     ├──Calculate XP─────►│                  │
 │                     │                    │                  │
 │                     ├──Update Profile───►│                  │
 │                     │                    │                  │
 │                     ├──Check Badges─────►│                  │
 │                     │                    │                  │
 │                     ├──Award Badge──────►│                  │
 │                     │                    │                  │
 │                     ├──Notify User──────►│                  │
 │                     │                    │                  │
 │                     └────────────────────────────────Update UI
 │                                                             │
```

## Module Architecture

```
BACKEND MODULES
===============

┌─────────────────────────────────────────────────────────────┐
│                        App Module                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Core Modules                            │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Prisma  │  │   Auth   │  │  Config  │          │   │
│  │  │  Module  │  │  Module  │  │  Module  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Feature Modules                         │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Users   │  │ Courses  │  │Assignments│          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │Attendance│  │ Wellness │  │  Wallet  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │   AI     │  │ Messages │  │  Notify  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐                         │   │
│  │  │  Gamif.  │  │Submissions│                        │   │
│  │  └──────────┘  └──────────┘                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Each Module Contains:
├── Controller (HTTP Endpoints)
├── Service (Business Logic)
├── DTOs (Data Transfer Objects)
└── Module Definition
```

## Database Schema

```
CORE TABLES
===========

User ─────┬───── Profile (1:1)
          ├───── Wallet (1:1)
          ├───── Enrollments (1:N) ──► Course
          ├───── Messages (1:N)
          ├───── Notifications (1:N)
          ├───── Submissions (1:N) ──► Assignment
          └───── Attendance (1:N)

Course ───┬───── Enrollments (1:N)
          ├───── Assignments (1:N)
          ├───── Resources (1:N)
          └───── Schedule (1:N)

Assignment ─── Submissions (1:N)

Profile ──┬───── WellnessLogs (1:N)
          └───── BadgeOwnership (N:M) ──► Badge

Wallet ───── Transactions (1:N)


RELATIONSHIPS
=============

User (1) ───────────────── (N) Enrollment (N) ───────────────── (1) Course
User (1) ───────────────── (N) Submission (N) ───────────────── (1) Assignment
User (1) ───────────────── (1) Profile (1) ──────────────────── (N) WellnessLog
User (1) ───────────────── (1) Wallet (1) ───────────────────── (N) Transaction
Profile (N) ────────────── (N) Badge (via BadgeOwnership)
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│           Security Architecture              │
└─────────────────────────────────────────────┘

Layer 1: Network Security
├─ CORS (Whitelist origins)
├─ Helmet (Security headers)
└─ Rate Limiting (100 req/min)

Layer 2: Authentication
├─ JWT Access Token (15 min)
├─ JWT Refresh Token (7 days)
└─ Bcrypt Password Hashing (10 rounds)

Layer 3: Authorization
├─ Role-Based Access Control (RBAC)
├─ Guard-Protected Routes
└─ Owner Verification

Layer 4: Data Validation
├─ Class Validator (Backend)
├─ Zod Schemas (Frontend)
└─ Type Safety (TypeScript)

Layer 5: Database Security
├─ Prisma ORM (SQL Injection Prevention)
├─ Parameterized Queries
└─ Connection Pooling
```

## State Management

```
FRONTEND STATE
==============

┌─────────────────────────────────────────┐
│         Zustand (Client State)          │
├─────────────────────────────────────────┤
│  - Auth Store (user, tokens)            │
│  - UI Store (sidebar, focus mode)       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      React Query (Server State)         │
├─────────────────────────────────────────┤
│  - Caching (1 min stale time)           │
│  - Automatic refetch                    │
│  - Optimistic updates                   │
│  - Request deduplication                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Local Component State           │
├─────────────────────────────────────────┤
│  - Form inputs (React Hook Form)        │
│  - UI toggles                           │
│  - Temporary data                       │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
PRODUCTION SETUP
================

┌─────────────────────────────────────────┐
│           Vercel (Frontend)              │
│  - Auto-scaling                          │
│  - CDN Edge Network                      │
│  - SSL/TLS Automatic                     │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│    Google App Engine (Backend)           │
│  - Auto-scaling (1-10 instances)         │
│  - Load Balancing                        │
│  - Health Checks                         │
└─────────────────────────────────────────┘
              │
              ├──────────────────┐
              ▼                  ▼
┌───────────────────────┐  ┌──────────────┐
│  Cloud SQL (Postgres) │  │   OpenAI     │
│  - Automated backups  │  │   API        │
│  - High availability  │  │              │
└───────────────────────┘  └──────────────┘
```

This visual architecture provides a comprehensive overview of how Nexus is structured and how data flows through the system.
