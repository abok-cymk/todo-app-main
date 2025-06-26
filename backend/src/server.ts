import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import todoRoutes from "./routes/todo";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

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
