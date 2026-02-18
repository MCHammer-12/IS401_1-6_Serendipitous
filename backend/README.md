# Serendipitous Backend

Express.js backend server for the Serendipitous application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/serendipitous
```

## Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api` - Welcome message

## Project Structure

```
backend/
├── src/
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
└── .gitignore           # Git ignore rules
```
