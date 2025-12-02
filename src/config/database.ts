import { Pool } from "pg";
import { config } from "dotenv";

config();

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL database connected");
  } catch (error) {
    console.log("Error connecting to PostgreSQL database");
  }
};
