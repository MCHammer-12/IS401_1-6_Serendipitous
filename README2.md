# Serendipitous

## App Summary

Serendipitous is a social discovery app designed for college students to find and connect with nearby peers who share their interests. The application solves the problem of meeting like-minded individuals on campus by using proximity-based discovery and interest matching algorithms. Users can customize their profile with interests, education details, and personal information, then receive recommendations for compatible connections based on shared interests, school, major, and hometown. The app features a 3D solar system interface that visualizes nearby people as orbiting planets, with planet size reflecting compatibility scores. When users adjust their profile or change their connection threshold in the Settings page, these changes are immediately saved to the database and reflected in the app's matching algorithm. This milestone focuses on establishing the backend infrastructure to make the app fully functional, moving it from a static prototype to a data-persistent application.

## Tech Stack

### Frontend
- **Framework**: Expo SDK 54 + React Native 0.81 (cross-platform mobile app)
- **Language**: TypeScript
- **State Management**: React Context + AsyncStorage
- **API Client**: Fetch API

### Backend
- **Framework**: Express.js 5 with TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL

### Database
- **System**: PostgreSQL (version 12+)
- **Schema**: 6 tables (users, interests, user_interests, connections, messages, location_pings)

## Architecture Diagram

```
User's Browser/Phone
        ↓ HTTP Requests (PUT /api/users/me)
Express Backend (http://localhost:5000)
        ↓ SQL Queries
PostgreSQL Database (serendipitous)
```

## Prerequisites

Install these before starting:
1. **Node.js 18+**: https://nodejs.org/en/download/
2. **PostgreSQL 12+**: https://www.postgresql.org/download/windows/
3. **Git**: https://git-scm.com/download/win

Verify installation:
```bash
node --version && npm --version && psql --version && git --version
```

## Installation and Setup

### Step 1: Clone & Create Database
```bash
git clone https://github.com/yourusername/IS401_1-6_Serendipitous.git
cd IS401_1-6_Serendipitous
psql -U postgres -c "CREATE DATABASE serendipitous;"
```

### Step 2: Initialize Schema & Seed Data
```bash
cd db
psql -U postgres -d serendipitous -f schema.sql
psql -U postgres -d serendipitous -f seed.sql
cd ..
```

### Step 3: Configure Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env` and replace `YOUR_PASSWORD` with your PostgreSQL password:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/serendipitous
```

Install dependencies:
```bash
npm install
```

### Step 4: Install Frontend
```bash
cd ../frontend
npm install
```

**Done!** You're ready to run the app.

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected: `✅ Database connected successfully` and `⚡ Server is running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run expo:dev
```

**Access the App:**
- **Web Browser**: Press `w` in the frontend terminal
- **Mobile**: Scan the QR code with Expo Go app
- **Android**: Press `a` (requires Android Studio)

## Verifying the Vertical Slice

### What We're Testing
Edit your profile → Click Save → Changes appear immediately → Changes persist after refresh → Changes are in the database.

### Steps

1. **Navigate to Settings**: Settings tab → gear icon

2. **Change Your Profile** (pick one):
   - **Name**: "Alex Chen" → "Alex Smith"
   - **Age**: 21 → 22
   - **Quote**: "Chaos is a ladder" → "Hello World!"
   - **Hometown**: "San Francisco, CA" → "Los Angeles, CA"
   - **Connection Threshold**: Use +/- buttons to change from 1 → 2

3. **Save Changes**: Scroll down → Click "Save" button

4. **Verify in App**: Go back to Settings → Your change should still be there

5. **Verify in Database**:

   For name changes:
   ```bash
   psql -U postgres -d serendipitous -c "SELECT name, age FROM \"user\" WHERE user_id = 1;"
   ```

   For threshold changes:
   ```bash
   psql -U postgres -d serendipitous -c "SELECT name, interest_threshold FROM \"user\" WHERE user_id = 1;"
   ```

   You should see your updated values.

6. **Verify Persistence After Refresh**:
   - **Web**: Press F5 to refresh
   - **Mobile**: Close app completely and reopen
   - Navigate back to Settings
   - Your changes should still be there
   - Run the database query again - values should match

### Success Example

Before change:
```bash
psql -U postgres -d serendipitous -c "SELECT name FROM \"user\" WHERE user_id = 1;"
 name     
-----------
 Alex Chen
(1 row)
```

After change and save (check database):
```bash
psql -U postgres -d serendipitous -c "SELECT name FROM \"user\" WHERE user_id = 1;"
   name    
-----------
 Alex Smith
(1 row)
```

After refresh (app still shows "Alex Smith") and database still shows "Alex Smith" → ✅ **Vertical slice is working!**

## Troubleshooting

| Error | Solution |
|-------|----------|
| `DATABASE_URL is not defined` | Add `.env` file in backend folder with DATABASE_URL line |
| `psql: command not found` | Add PostgreSQL to PATH: Search "Environment Variables" → Add `C:\Program Files\PostgreSQL\14\bin` to PATH |
| `Database connection failed` | Check PostgreSQL is running. Windows: Search "Services" → Find "postgresql-*" → Start |
| `Cannot create database` | Verify PostgreSQL password in `.env` file is correct |
| `port 5000 already in use` | Change `PORT=5001` in `.env` file |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, run `npm install` again |

## What Gets Saved to the Database

When you save your profile:
- `name`, `age`, `university`, `major`, `hometown`, `quote`, `profile_photo`
- `interest_threshold` (the +/- buttons value)
- `updated_at` timestamp

Your interests are saved in the `user_interests` table linked by `user_id`.

## Next Steps

- Add more API endpoints for messaging, events, connections
- Implement user authentication
- Add real-time features with WebSockets
- Build proximity-based matching algorithm
- Add friend requests and social features

## Project Structure

```
backend/src/
  ├── index.ts          # Server entry point
  ├── db.ts             # Database connection
  ├── routes.ts         # API endpoints (GET/PUT /api/users)
  └── schema.ts         # Drizzle ORM schema

frontend/app/
  ├── settings.tsx      # Profile editor (Save button)
  ├── (tabs)/           # Main app pages
  └── lib/user-context.tsx  # State management

db/
  ├── schema.sql        # Creates 6 tables
  └── seed.sql          # Sample data (3 users)
```

Good luck with Serendipitous! 🚀
