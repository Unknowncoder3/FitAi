import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

const router = Router();

// Log a workout
router.post("/log", (req, res) => {
    try {
        const { userId, muscleGroup, exercises, durationMin, caloriesBurned, notes } = req.body;

        const id = uuidv4();
        db.prepare(`
      INSERT INTO workouts (id, user_id, muscle_group, exercises, duration_min, calories_burned, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, muscleGroup, JSON.stringify(exercises || []), durationMin || 0, caloriesBurned || 0, notes || "");

        res.json({ id, message: "Workout logged" });
    } catch (error) {
        console.error("Error logging workout:", error);
        res.status(500).json({ error: "Failed to log workout" });
    }
});

// Get workout history
router.get("/history/:userId", (req, res) => {
    try {
        const workouts = db
            .prepare("SELECT * FROM workouts WHERE user_id = ? ORDER BY completed_at DESC LIMIT 30")
            .all(req.params.userId);

        const parsed = workouts.map((w) => ({
            ...w,
            exercises: JSON.parse(w.exercises || "[]"),
        }));

        res.json(parsed);
    } catch (error) {
        console.error("Error fetching workouts:", error);
        res.status(500).json({ error: "Failed to fetch workout history" });
    }
});

export default router;
