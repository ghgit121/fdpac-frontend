# FDPAC Frontend

A Next.js-based frontend application for the Financial Document Processing and Analysis System (FDPAC).

## Prerequisites

- Node.js 16+ 
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Build for production:
```bash
npm run build
npm start
```

## Pages

- `/` - Home/Login page
- `/login` - User login
- `/dashboard` - Dashboard with analytics and summaries
- `/records` - Financial records management
- `/users` - User management (admin only)

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PostCSS

## Docker

Build and run with Docker:
```bash
docker build -t fdpac-frontend .
docker run -p 3000:3000 fdpac-frontend
```