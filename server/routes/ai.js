import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
    chatWithCoach,
    generateWorkoutPlan,
    estimateNutrition,
    generateDietInsight,
    generateDailyInsight,
    generateInitialPlan,
    generateDietRecommendations,
} from "../ai.js";
import db from "../db.js";

const router = Router();

// AI Coach chat
router.post("/chat", async (req, res) => {
    try {
        const { message, userProfile, chatHistory } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await chatWithCoach(message, userProfile, chatHistory || []);
        res.json({ response });
    } catch (error) {
        console.error("AI Chat error:", error);
        res.status(500).json({
            error: "AI service error",
            response: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
        });
    }
});

// Generate workout plan
router.post("/workout-plan", async (req, res) => {
    try {
        const { muscleGroup, userProfile } = req.body;
        if (!muscleGroup) return res.status(400).json({ error: "Muscle group is required" });

        const exercises = await generateWorkoutPlan(muscleGroup, userProfile);
        res.json({ exercises });
    } catch (error) {
        console.error("Workout plan error:", error);
        res.status(500).json({ error: "Failed to generate workout plan" });
    }
});

// Estimate nutrition for a food item
router.post("/estimate-nutrition", async (req, res) => {
    try {
        const { foodName } = req.body;
        if (!foodName) return res.status(400).json({ error: "Food name is required" });

        const nutrition = await estimateNutrition(foodName);
        res.json(nutrition);
    } catch (error) {
        console.error("Nutrition estimation error:", error);
        res.status(500).json({ error: "Failed to estimate nutrition" });
    }
});

// Diet insight based on meals
router.post("/diet-insight", async (req, res) => {
    try {
        const { meals, userProfile } = req.body;
        const insight = await generateDietInsight(meals || [], userProfile);
        res.json({ insight });
    } catch (error) {
        console.error("Diet insight error:", error);
        res.status(500).json({ error: "Failed to generate diet insight" });
    }
});

// Daily dashboard insight
router.post("/daily-insight", async (req, res) => {
    try {
        const { userProfile, recentActivity } = req.body;
        const insight = await generateDailyInsight(userProfile, recentActivity);
        res.json({ insight });
    } catch (error) {
        console.error("Daily insight error:", error);
        res.status(500).json({ error: "Failed to generate daily insight" });
    }
});

// Generate initial personalized plan after onboarding
router.post("/initial-plan", async (req, res) => {
    try {
        const { userId, userProfile } = req.body;
        if (!userId) return res.status(400).json({ error: "userId is required" });

        // Check if plan already exists
        const existing = db.prepare("SELECT id FROM user_plans WHERE user_id = ?").get(userId);
        if (existing) {
            const plan = db.prepare("SELECT * FROM user_plans WHERE user_id = ?").get(userId);
            return res.json({
                roadmap: JSON.parse(plan.roadmap || "[]"),
                dietRecommendations: JSON.parse(plan.diet_recommendations || "{}"),
                dailyCalorieTarget: plan.daily_calorie_target,
                proteinTarget: plan.protein_target,
                carbsTarget: plan.carbs_target,
                fatsTarget: plan.fats_target,
            });
        }

        const plan = await generateInitialPlan(userProfile);

        const id = uuidv4();
        db.prepare(`
            INSERT INTO user_plans (id, user_id, roadmap, diet_recommendations, daily_calorie_target, protein_target, carbs_target, fats_target)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id, userId,
            JSON.stringify(plan.roadmap || []),
            JSON.stringify({ eatMore: plan.eatMore || [], limit: plan.limit || [] }),
            plan.dailyCalorieTarget || Math.round((userProfile?.weight || 75) * 30),
            plan.proteinTarget || 0,
            plan.carbsTarget || 0,
            plan.fatsTarget || 0,
        );

        res.json({
            roadmap: plan.roadmap || [],
            dietRecommendations: { eatMore: plan.eatMore || [], limit: plan.limit || [] },
            dailyCalorieTarget: plan.dailyCalorieTarget,
            proteinTarget: plan.proteinTarget,
            carbsTarget: plan.carbsTarget,
            fatsTarget: plan.fatsTarget,
        });
    } catch (error) {
        console.error("Initial plan error:", error);
        res.status(500).json({ error: "Failed to generate initial plan" });
    }
});

// Get diet recommendations
router.post("/diet-recommendations", async (req, res) => {
    try {
        const { userProfile } = req.body;
        const recs = await generateDietRecommendations(userProfile);
        res.json(recs);
    } catch (error) {
        console.error("Diet recommendations error:", error);
        res.status(500).json({ error: "Failed to generate diet recommendations" });
    }
});

export default router;
