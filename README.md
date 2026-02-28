# Smile Note

A production-ready field operations control system for rental property managers.

## Features
- **Smart Daily Route**: Automatically grouped and sorted by building and floor.
- **Task Engine**: Specialized flows for maintenance, inspections, and collections.
- **Photo-First Execution**: Mandatory before/after photos for accountability.
- **One-Handed UX**: Large touch targets and high-contrast dark mode.
- **Live Injection**: Priority alerts for nearby issues.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS, PostgreSQL, Prisma ORM.
- **DevOps**: PWA-ready, monorepo structure.

## Setup Instructions

### Backend (API)
1. `cd api`
2. `npm install`
3. Set `DATABASE_URL` in `.env`.
4. `npx prisma migrate dev`
5. `npm run seed` (using `npx ts-node prisma/seed.ts`)
6. `npm run start:dev`

### Frontend (Web)
1. `cd web`
2. `npm install`
3. `npm run dev`

## Route Optimization Logic
The system sorts tasks primarily by:
1. **Building Grouping**: Minimizes travel between sites.
2. **Floor Level (Ascending)**: Optimized for elevator or stair movement (bottom-to-top).
3. **Priority**: Urgent tasks are flagged and bubbled up within their location context.
