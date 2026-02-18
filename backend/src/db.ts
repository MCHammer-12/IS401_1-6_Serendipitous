import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const db = drizzle(pool);

export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
