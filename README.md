# Serendipitous

Social isolation is a well-documented issue in today's society. Serendipitous seeks to ease social isolation among college students by facilitating in-person interactions with peers using Bluetooth proximity detection, resulting in the cultivation of real friendships. Users can be notified when users with similar interests are nearby, then use the in-app messaging and profile sharing to locate the other user in-person. Users can then tap phones (similar to sharing contact info on iOS) to become friends in the Serendipitous app. In addition to the main function of facilitating these spontaneous in-person interactions, Serendipitous also provides a digital space to plan and advertise events. Currently, only users can post events, but this provides a potential source of future revenue. Users can see friends attending events and, after registering for the event, can see and message all users attending that event.

## Features

### 3D Solar System Map
- Nearby people appear as orbiting planets around your profile picture in a 3D sphere
- Higher compatibility = larger planets (50px to 120px)
- Drag to rotate the sphere in any direction with momentum physics — flick to spin
- Planets pass in front of and behind your profile for true depth
- Auto-rotation keeps the view alive
- Tap any planet to view their profile and connect

### Serendipity Scoring
- Compatibility scores are calculated based on shared interests, school, major, and hometown
- A configurable threshold lets you filter out low-match connections
- Scores are displayed as percentages on each planet

### Simulated Bluetooth Discovery
- Start scanning to detect nearby people in real time
- Discovers a new person every 15 seconds
- After 60 seconds of proximity, sends a local notification
- Tapping the notification highlights the person on the map

### Messaging
- Send messages to friends and connections directly from the app
- Dark glassmorphism chat interface with sent/received message bubbles
- Accessible from the Friends list, connection details, and profile screens

### Events
- Browse community events with interest-based tags
- Friends' events are shown first for easy discovery
- Tags that match your interests are highlighted
- Event cards show attendee counts and friend avatars

### Profile Management
- Customize your name, school, major, hometown, and bio
- Add up to 10 interests from a curated list or create your own
- Set your serendipity match threshold
- Profile data persists locally on your device

### Friends
- View your connections list with serendipity scores
- Quick-access message button on each friend
- Animated list with smooth entry transitions

## Tech Stack
- PERN-M (Mobile)
- Postgres
- Express
- React Native (via Expo)
- Node
- TypeScript

Basically, our tech stack is PERN adapted for mobile using Expo + React Native + TypeScript for rendering on the mobile frontend and Node + Typescript for the backend.

### Frontend
- **Expo SDK 54** with React Native 0.81 (new architecture enabled)
- **expo-router** for file-based routing with typed routes
- **react-native-reanimated** for smooth animations and particle effects
- **@tanstack/react-query** for data fetching
- **expo-blur / expo-glass-effect** for glassmorphism UI
- **expo-linear-gradient** for gradient backgrounds and buttons
- **@expo-google-fonts/outfit** for typography
- **expo-haptics** for tactile feedback on iOS/Android
- **expo-notifications** for proximity alerts
- **expo-location** for GPS positioning

### Backend
- **Express 5** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **esbuild** for production builds

### Database
- **PostgreSQL 12+** for data persistence
- **Drizzle ORM** for type-safe SQL queries
- **6 tables**: users, interests, user_interests, connections, messages, location_pings

## Architecture Diagram
<img width="1460" height="384" alt="ChatGPT Image Feb 18, 2026, 10_16_23 AM" src="https://github.com/user-attachments/assets/b3780aa6-a401-49f9-87f5-5c73d02d49fd" />

## Prerequisites

Install these before starting:

### 1. Node.js (Version 18+)
**Download/Install:**
- **Windows**: https://nodejs.org/en/download/
- **macOS**: https://nodejs.org/en/download/ or `brew install node`

**Verify:**
```bash
node --version && npm --version
```
Expected: `v18.0.0+` and `9.0.0+`

### 2. PostgreSQL (Version 12+)
**Download/Install:**
- **Windows**: https://www.postgresql.org/download/windows/
- **macOS**: https://www.postgresql.org/download/macosx/ or `brew install postgresql@15`

**Setup Notes:**
- **Windows**: Remember your postgres password; add PostgreSQL to PATH during installation
- **macOS**: If using Homebrew, start with `brew services start postgresql@15`

**Verify:**
```bash
psql --version
```
Expected: `psql (PostgreSQL) 12.0+`

### 3. Git
**Download/Install:**
- **Windows**: https://git-scm.com/download/win
- **macOS**: https://git-scm.com/download/mac or `brew install git`

**Verify:**
```bash
git --version
```
Expected: `git version 2.40.0+`

### Verify All Prerequisites
```bash
node --version && npm --version && psql --version && git --version
```
In addition to downloading the above tools, add the psql command to PATH.

## Installation and Setup

### Step 1: Clone & Create Database
```bash
git clone https://github.com/MCHammer-12/IS401_1-6_Serendipitous.git
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

Expected: The frontend is up and ready to visit when the QR code appears and it says "> Open in the web browser..."

**Access the App:**
- **Web Browser**: Press `w` in the frontend terminal. Alternatively, visit http://localhost:8081/
- **Mobile**: Scan the QR code with Expo Go app
- **Android**: Press `a` (requires Android Studio)

*Note: it takes quite a long time to load the first time you visit the web page. It may take several minutes to load. You can check the loading status on the frontend terminal*

## Verifying the Vertical Slice

### What We're Testing
Edit your profile → Click Save → Changes appear immediately → Changes persist after refresh → Changes are in the database.

### Steps

1. **Navigate to Profile**: Profile icon (bottom right on navbar)
2. **Navigate to Settings**: gear icon in the top right

3. **Change Your Profile** (pick one):
   - **Name**: "Alex Chen" → "Alex Smith"
   - **Age**: 21 → 22
   - **Quote**: "Chaos is a ladder" → "Hello World!"
   - **Hometown**: "San Francisco, CA" → "Los Angeles, CA"
   - **Connection Threshold**: Use +/- buttons to change from 1 → 2 (Note: this change is only visible in the settings tab)
  
***CHANGING INTERESTS IS NOT CURRENTLY SUPPORTED***

4. **Save Changes**: Click the green check mark in the top right

5. **Verify in App**: All changes should be visible on your profile page (except connection threshold is visible only in settings

6. **Verify in Database**:

   For name changes (using a third terminal):
   ```bash
   psql -U postgres -d serendipitous -c "SELECT name, age FROM \"user\" WHERE user_id = 1;"
   ```

   For threshold changes (using a third terminal):
   ```bash
   psql -U postgres -d serendipitous -c "SELECT name, interest_threshold FROM \"user\" WHERE user_id = 1;"
   ```

   You should see your updated values.

7. **Verify Persistence After Refresh**:
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
| `psql: command not found` | **Windows**: Search "Environment Variables" → Add `C:\Program Files\PostgreSQL\14\bin` to PATH. **macOS**: If using Homebrew, PATH should be set automatically. Otherwise add to ~/.zshrc: `export PATH="/usr/local/opt/postgresql@15/bin:$PATH"` |
| `Database connection failed` | **Windows**: Search "Services" → Find "postgresql-*" → Start. **macOS**: Run `brew services start postgresql@15` |
| `Cannot create database` | Verify PostgreSQL password in `.env` file is correct |
| `port 5000 already in use` | Change `PORT=5001` in `.env` file |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, run `npm install` again |

## What Gets Saved to the Database

When you save your profile:
- `name`, `age`, `university`, `major`, `hometown`, `quote`, `profile_photo`
- `interest_threshold` (the +/- buttons value)
- `updated_at` timestamp

## Next Steps

- Add more API endpoints for messaging, events, connections
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
