import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

const router = Router();

// Log weight/progress entry
router.post("/", (req, res) => {
    try {
        const { userId, weight, bodyFat, notes } = req.body;
        if (!userId) return res.status(400).json({ error: "userId is required" });

        const id = uuidv4();
        db.prepare(`
            INSERT INTO progress (id, user_id, weight, body_fat, notes)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, userId, weight || null, bodyFat || null, notes || null);

        res.json({ id, message: "Progress logged" });
    } catch (error) {
        console.error("Error logging progress:", error);
        res.status(500).json({ error: "Failed to log progress" });
    }
});

// Get progress history
router.get("/:userId", (req, res) => {
    try {
        const entries = db
            .prepare(`
                SELECT * FROM progress 
                WHERE user_id = ? 
                ORDER BY recorded_at DESC
            `)
            .all(req.params.userId);

        res.json(entries);
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ error: "Failed to fetch progress" });
    }
});

export default router;
