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

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.json({ status: "OK", message: "Server is running" });
    });

    app.use("/api/todos", todoRoutes);

    // For local development
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Export the Express app for Vercel
export default app;
