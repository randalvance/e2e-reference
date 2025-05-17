import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Get the database connection string from environment variables
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    console.error("DATABASE_URL environment variable is not set")
    process.exit(1)
}

// Create a connection pool
const pool = new Pool({
    connectionString,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
})

// Log connection errors
pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err)
    process.exit(-1)
})

// Create the Drizzle client with the full schema
export const db = drizzle(pool, { schema })

// For use in development to test the connection
export async function testConnection() {
    try {
        const client = await pool.connect()
        console.log("Database connection successful")
        client.release()
        return true
    } catch (error) {
        console.error("Database connection failed:", error)
        return false
    }
}
