import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

const router = Router();

// Create or update user profile
router.post("/", (req, res) => {
    try {
        const { name, height, weight, age, gender, activityLevel, goal, timeline, fasting } = req.body;

        const existing = db.prepare("SELECT id FROM users WHERE name = ?").get(name);

        if (existing) {
            db.prepare(`
        UPDATE users SET height = ?, weight = ?, age = ?, gender = ?, 
        activity_level = ?, goal = ?, timeline = ?, fasting = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(height, weight, age, gender, activityLevel, goal, timeline, fasting, existing.id);

            res.json({ id: existing.id, message: "User updated" });
        } else {
            const id = uuidv4();
            db.prepare(`
        INSERT INTO users (id, name, height, weight, age, gender, activity_level, goal, timeline, fasting)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, name, height, weight, age, gender, activityLevel, goal, timeline, fasting);

            res.json({ id, message: "User created" });
        }
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Failed to save user" });
    }
});

// Get user profile
router.get("/:id", (req, res) => {
    try {
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Get user summary stats
router.get("/summary/:id", (req, res) => {
    try {
        const userId = req.params.id;
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Total workouts
        const workoutCount = db.prepare("SELECT COUNT(*) as count FROM workouts WHERE user_id = ?").get(userId);

        // Streak: count consecutive days with workouts ending today
        const workoutDays = db.prepare(`
            SELECT DISTINCT date(completed_at) as d FROM workouts 
            WHERE user_id = ? ORDER BY d DESC
        `).all(userId);
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < workoutDays.length; i++) {
            const expected = new Date(today);
            expected.setDate(expected.getDate() - i);
            const expectedStr = expected.toISOString().split("T")[0];
            if (workoutDays[i].d === expectedStr) {
                streak++;
            } else {
                break;
            }
        }

        // Weight change from progress table
        const firstWeight = db.prepare("SELECT weight FROM progress WHERE user_id = ? ORDER BY recorded_at ASC LIMIT 1").get(userId);
        const latestWeight = db.prepare("SELECT weight FROM progress WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 1").get(userId);
        const weightChange = firstWeight && latestWeight ? +(latestWeight.weight - firstWeight.weight).toFixed(1) : 0;

        // Best streak
        let bestStreak = streak;
        let tempStreak = 0;
        for (let i = 0; i < workoutDays.length; i++) {
            if (i === 0) { tempStreak = 1; continue; }
            const prev = new Date(workoutDays[i - 1].d);
            const curr = new Date(workoutDays[i].d);
            const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                tempStreak++;
            } else {
                if (tempStreak > bestStreak) bestStreak = tempStreak;
                tempStreak = 1;
            }
        }
        if (tempStreak > bestStreak) bestStreak = tempStreak;

        // Today's macros
        const todayMacros = db.prepare(`
            SELECT COALESCE(SUM(calories), 0) as calories, 
                   COALESCE(SUM(protein), 0) as protein,
                   COALESCE(SUM(carbs), 0) as carbs, 
                   COALESCE(SUM(fats), 0) as fats
            FROM meals WHERE user_id = ? AND date(logged_at) = date('now')
        `).get(userId);

        // Today's calories burned from workouts
        const todayBurned = db.prepare(`
            SELECT COALESCE(SUM(calories_burned), 0) as burned
            FROM workouts WHERE user_id = ? AND date(completed_at) = date('now')
        `).get(userId);

        // Weekly calorie data (last 7 days)
        const weeklyCalories = [];
        for (let i = 6; i >= 0; i--) {
            const dayData = db.prepare(`
                SELECT COALESCE(SUM(calories), 0) as cal
                FROM meals WHERE user_id = ? AND date(logged_at) = date('now', '-${i} days')
            `).get(userId);
            weeklyCalories.push(dayData?.cal || 0);
        }

        // Today's workout info
        const todayWorkout = db.prepare(`
            SELECT muscle_group, duration_min FROM workouts 
            WHERE user_id = ? AND date(completed_at) = date('now') 
            ORDER BY completed_at DESC LIMIT 1
        `).get(userId);

        // User plan
        const plan = db.prepare("SELECT * FROM user_plans WHERE user_id = ?").get(userId);

        // Days since registration
        const daysSinceJoined = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

        res.json({
            totalWorkouts: workoutCount?.count || 0,
            streak,
            bestStreak,
            weightChange,
            currentWeight: latestWeight?.weight || user.weight,
            todayMacros: {
                calories: todayMacros?.calories || 0,
                protein: Math.round(todayMacros?.protein || 0),
                carbs: Math.round(todayMacros?.carbs || 0),
                fats: Math.round(todayMacros?.fats || 0),
            },
            todayBurned: todayBurned?.burned || 0,
            weeklyCalories,
            todayWorkout: todayWorkout ? { muscleGroup: todayWorkout.muscle_group, durationMin: todayWorkout.duration_min } : null,
            plan: plan ? {
                roadmap: JSON.parse(plan.roadmap || "[]"),
                dietRecommendations: JSON.parse(plan.diet_recommendations || "{}"),
                dailyCalorieTarget: plan.daily_calorie_target,
                proteinTarget: plan.protein_target,
                carbsTarget: plan.carbs_target,
                fatsTarget: plan.fats_target,
            } : null,
            daysSinceJoined,
        });
    } catch (error) {
        console.error("Error fetching user summary:", error);
        res.status(500).json({ error: "Failed to fetch user summary" });
    }
});

export default router;
