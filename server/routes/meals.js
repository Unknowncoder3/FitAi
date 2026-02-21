import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

const router = Router();

// Log a meal
router.post("/log", (req, res) => {
    try {
        const { userId, mealType, foodName, calories, protein, carbs, fats } = req.body;

        const id = uuidv4();
        db.prepare(`
      INSERT INTO meals (id, user_id, meal_type, food_name, calories, protein, carbs, fats)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, mealType || "Snacks", foodName, calories || 0, protein || 0, carbs || 0, fats || 0);

        res.json({ id, message: "Meal logged" });
    } catch (error) {
        console.error("Error logging meal:", error);
        res.status(500).json({ error: "Failed to log meal" });
    }
});

// Get today's meals (grouped by meal type with totals)
router.get("/today/:userId", (req, res) => {
    try {
        const meals = db
            .prepare(`
        SELECT * FROM meals 
        WHERE user_id = ? AND date(logged_at) = date('now')
        ORDER BY logged_at ASC
      `)
            .all(req.params.userId);

        // Group by meal_type
        const groups = {
            Breakfast: { type: "Breakfast", icon: "🌅", items: [] },
            Lunch: { type: "Lunch", icon: "☀️", items: [] },
            Dinner: { type: "Dinner", icon: "🌙", items: [] },
            Snacks: { type: "Snacks", icon: "🍎", items: [] },
        };

        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0;

        for (const meal of meals) {
            const type = meal.meal_type || "Snacks";
            const group = groups[type] || groups["Snacks"];
            group.items.push({
                id: meal.id,
                name: meal.food_name,
                cal: meal.calories || 0,
                protein: meal.protein || 0,
                carbs: meal.carbs || 0,
                fats: meal.fats || 0,
            });
            totalCalories += meal.calories || 0;
            totalProtein += meal.protein || 0;
            totalCarbs += meal.carbs || 0;
            totalFats += meal.fats || 0;
        }

        res.json({
            meals: Object.values(groups),
            totals: {
                calories: totalCalories,
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fats: Math.round(totalFats),
            },
        });
    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({ error: "Failed to fetch meals" });
    }
});

export default router;
