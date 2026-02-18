import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db";
import userRoutes from "./routes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", userRoutes);

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
async function start() {
  // Test database connection
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.warn("⚠️  Warning: Database connection failed. Server starting anyway.");
  }

  app.listen(PORT, () => {
    console.log(`⚡ Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
