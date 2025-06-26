import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import todoRoutes from "./routes/todo";

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://allan-abok.github.io",
          "https://todo-backend-1xzvyrxrt-allan-aboks-projects.vercel.app",
        ]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (available even if DB fails)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    dbConnected: AppDataSource.isInitialized,
  });
});

// Initialize database and setup routes
let dbInitialized = false;

const initializeDatabase = async () => {
  if (!dbInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      dbInitialized = true;
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err;
    }
  }
};

// Middleware to ensure DB is initialized
app.use("/api/todos", async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.use("/api/todos", todoRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
    });
}

// Export the Express app for Vercel
export default app;
