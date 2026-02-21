import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";
import workoutRoutes from "./routes/workout.js";
import mealsRoutes from "./routes/meals.js";
import progressRoutes from "./routes/progress.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/progress", progressRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`\n🏋️  FitAI Backend running at http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Groq API Key: ${process.env.GROQ_API_KEY ? "✅ Configured" : "❌ Missing — set GROQ_API_KEY in server/.env"}\n`);
});
