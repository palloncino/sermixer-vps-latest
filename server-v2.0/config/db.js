import dotenv from "dotenv";
import { dirname, resolve } from 'path';
import { Sequelize } from "sequelize";
import { fileURLToPath } from 'url';

// Resolve the current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjust the path for .env files, ensuring it's pointing correctly to the root folder
const envPath = process.env.NODE_ENV === "production" 
  ? resolve(__dirname, '../.env.remote')  // Go one directory up
  : resolve(__dirname, '../.env.local');  // Go one directory up

dotenv.config({ path: envPath });

console.log({envPath});

// Dynamically adjust the database connection details based on environment
export const sequelize = new Sequelize(process.env.DB_BASE_URL, {
  dialect: "mysql",
  logging: (msg) => console.log(`Sequelize: ${msg}`), // Log each SQL query
  pool: {
    max: 5, // Maximum number of connections in pool
    min: 0, // Minimum number of connections in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  },
  define: {
    freezeTableName: true, // Prevents sequelize from renaming tables
  },
});

// Function to set max_allowed_packet globally
const setGlobalMaxAllowedPacket = async () => {
  try {
    await sequelize.query("SET GLOBAL max_allowed_packet = 64 * 1024 * 1024"); // Set to 64MB
    console.log("max_allowed_packet set globally to 64MB");
  } catch (error) {
    console.error("Error setting max_allowed_packet globally:", error);
  }
};

// Function to test the connection and sync the models
export const connectDB = async () => {
  try {
    console.log("Attempting to connect to the database...");

    // Check if required environment variables are available
    if (!process.env.DB_BASE_URL) {
      console.error("Error: DB_BASE_URL is not set in the environment variables.");
      return;
    }

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await setGlobalMaxAllowedPacket(); // Attempt to set max_allowed_packet globally

  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    console.error("Stack Trace:", error.stack);
  }
};

export default sequelize;
