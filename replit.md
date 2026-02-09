# Serendipitous

## Overview

Serendipitous is a social discovery mobile application built with Expo (React Native) and an Express backend. The app helps users find and connect with nearby people based on shared interests, school, major, and location — computing a "serendipity score" to surface the most compatible connections. The app features a map view showing nearby users, a friends/connections list, user profiles with editable interests, and modal screens for viewing connection details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`).
- **Routing**: File-based routing via `expo-router` with typed routes enabled. The app uses a tab layout (`app/(tabs)/`) with three tabs: Map (`index`), Friends (`friends`), and Profile (`profile`). Additional screens include `settings`, `connection/[id]` (modal), and `about/[id]` (modal).
- **State Management**: React Context (`UserProvider` in `lib/user-context.tsx`) manages user profile, interests, serendipity scoring logic, and match threshold. `DiscoveryProvider` in `lib/discovery-context.tsx` manages simulated Bluetooth proximity detection, notification scheduling, and highlight state. Profile data persists locally via `@react-native-async-storage/async-storage`.
- **Discovery System**: Simulated Bluetooth LE scanning via `DiscoveryProvider`. Discovers a random nearby person every 15 seconds. After 60 seconds of proximity, fires a local notification via `expo-notifications`. Tapping the notification navigates to the connection screen and highlights the person on the map for 10 seconds.
- **Data Fetching**: `@tanstack/react-query` is configured with a custom `apiRequest` helper in `lib/query-client.ts` that builds URLs from `EXPO_PUBLIC_DOMAIN`. Currently, the app primarily uses mock data from `lib/mock-data.ts`.
- **UI & Styling**: Dark theme exclusively (`userInterfaceStyle: "dark"`). Custom color system defined in `constants/colors.ts`. Uses glassmorphism effects (`expo-blur`, `expo-glass-effect`), `expo-linear-gradient`, and `react-native-reanimated` for animations (particles, pulsing dots, fade-ins). Typography uses the Outfit font family via `@expo-google-fonts/outfit`.
- **Platform Handling**: Components account for iOS, Android, and web differences. Haptic feedback (`expo-haptics`) is conditionally applied (skipped on web). Keyboard handling uses `react-native-keyboard-controller` with a web-compatible fallback. Tab bar uses native liquid glass tabs on supported iOS versions, falling back to classic blur-based tabs.

### Backend (Express)

- **Runtime**: Node.js with Express 5. TypeScript compiled via `tsx` (dev) or `esbuild` (prod).
- **Server Structure**: Entry point is `server/index.ts`. Routes registered in `server/routes.ts` (currently minimal — just creates an HTTP server). All API routes should be prefixed with `/api`.
- **CORS**: Dynamically configured based on Replit environment variables (`REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`) and allows localhost origins for Expo web development.
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface with user CRUD methods. Currently uses `MemStorage` (in-memory Map). This is designed to be swapped for a database-backed implementation.
- **Static Serving**: In production, the server serves a statically exported Expo web build. A build script (`scripts/build.js`) handles the static export process.

### Database Schema

- **ORM**: Drizzle ORM with PostgreSQL dialect. Config in `drizzle.config.ts` reads `DATABASE_URL` environment variable.
- **Schema** (`shared/schema.ts`): Currently has a single `users` table with `id` (UUID, auto-generated), `username` (unique text), and `password` (text). Insert schema validation via `drizzle-zod`.
- **Migrations**: Output to `./migrations` directory. Push schema with `npm run db:push`.
- **Current State**: The database schema exists but isn't actively wired into the storage layer — `MemStorage` is used instead. The schema should be expanded as features move from mock data to real persistence.

### Key Design Decisions

1. **Mock data first, API later**: The app currently runs with hardcoded mock data (`lib/mock-data.ts`) for user profiles, nearby people, and friends. The architecture (query client, storage interface, API helpers) is in place to transition to real API calls.
2. **Shared schema directory**: The `shared/` folder contains types and schemas used by both frontend and backend, ensuring type safety across the stack.
3. **Serendipity scoring**: Computed client-side in the user context based on shared interests, school, major, and hometown between the current user and nearby people. This could be moved server-side for production use.

## External Dependencies

- **Database**: PostgreSQL via Drizzle ORM. Requires `DATABASE_URL` environment variable. Used for persistent data storage (currently schema-only, not actively connected to the app logic).
- **Expo Services**: Standard Expo ecosystem — no EAS Build or push notification services currently configured.
- **Fonts**: Google Fonts loaded via `@expo-google-fonts/outfit` and `@expo-google-fonts/space-grotesk`.
- **Image CDN**: Mock avatar images served from Unsplash (`images.unsplash.com`).
- **No external auth**: No third-party authentication service integrated. The schema has username/password fields suggesting planned local auth.
- **No external APIs**: No third-party social, messaging, or location APIs. Location features use `expo-location` for device GPS. Maps use `react-native-maps`.