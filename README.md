# Short-Video Learning Platform

A full-stack, vertical short-video learning platform similar to Instagram Reels or YouTube Shorts, built as part of the Skillcase Intern Assessment.

## Architecture

This project is divided into a **Frontend** and a **Backend**.

### Tech Stack
- **Frontend**: React, Vite, Redux Toolkit, React Router, Axios, Framer Motion (for animations).
- **Backend**: Node.js, Express, PostgreSQL (via Supabase), JSON Web Tokens (JWT) for authentication, and bcrypt for password hashing.

### Structure
The project strictly follows a clean architecture pattern separating concerns:
- **Backend**: Divided into `routes`, `controllers`, `services`, `middlewares`, `config`, `utils`, and `models`. No business logic resides in routes.
- **Frontend**: Organized by `pages`, `components`, `redux` (state management), `api` (centralized Axios config), and `hooks`. UI updates optimistically for better UX.

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new PostgreSQL project on Supabase.
2. Navigate to the SQL Editor in Supabase and run the queries found in `backend/src/models/schema.sql`. This will create the `users`, `videos`, `likes`, `comments`, and `bookmarks` tables.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Rename `.env.example` to `.env` and fill in your Supabase connection string:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Download the 3 required videos and place them inside `backend/uploads/` (ensure the filenames match the database records you insert, e.g., `Introduction_German.mp4`).
5. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).
