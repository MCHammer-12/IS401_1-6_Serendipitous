# Serendipitous

A social discovery app for college students that helps you find and connect with nearby people who share your interests. Serendipitous uses Bluetooth proximity detection to facilitate real-life, in-person interactions to help college students make real friends. Users can be notified when users with similar users are nearby, then use the in-app messaging and profile sharing to locate the other user in-person. Users can then tap phones (similar to sharing contact info in iOS) to become friends in the Serendipitous app. In addition to the main function of facilitating these spontaneous in-person interactions, Serendipitous also provides a digital space to plan and advertise events. Currently, only users can post events, but this provides a potential source of future revenue. Users can see friends attending events and, after registering for the event, can see and message all users attending that event.

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
- PERN (PostgreSQL, Express, React, Node.js)

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

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run server:dev
   ```
4. Start the Expo dev server:
   ```bash
   npm run expo:dev
   ```

### Testing on Mobile
Scan the QR code from the dev server output using the **Expo Go** app on your iOS or Android device.

### Testing on Web
Open `http://localhost:8081` in your browser.

## Project Structure

```
app/
  (tabs)/
    _layout.tsx        # Tab navigation layout
    index.tsx          # Map tab (3D solar system view)
    events.tsx         # Events discovery tab
    friends.tsx        # Friends/connections list
    profile.tsx        # User profile management
  connection/[id].tsx  # Connection detail modal
  about/[id].tsx       # Full profile modal
  message/[id].tsx     # Chat/messaging screen
  settings.tsx         # App settings

lib/
  user-context.tsx     # User state, interests, scoring
  discovery-context.tsx # Bluetooth simulation, notifications
  mock-data.ts         # Sample profiles, friends, events
  query-client.ts      # API request helpers

server/
  index.ts             # Express server entry point
  routes.ts            # API route registration
  storage.ts           # Data storage interface

shared/
  schema.ts            # Database schema (Drizzle ORM)

constants/
  colors.ts            # Dark theme color system
```

## Design

Serendipitous uses a dark-only theme with glassmorphism effects throughout. The color palette centers on teal accents with purple secondary tones against deep dark backgrounds. The 3D map visualization uses perspective projection with depth-based opacity and scaling for a convincing spatial effect.

## License

MIT
