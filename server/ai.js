import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

/**
 * Build a system prompt for the fitness AI coach
 */
export function buildSystemPrompt(userProfile) {
    const profile = userProfile || {};
    return `You are FitAI Coach, an expert AI fitness and nutrition coach. You are friendly, motivating, and knowledgeable.

USER PROFILE:
- Name: ${profile.name || "User"}
- Height: ${profile.height || "unknown"} cm
- Weight: ${profile.weight || "unknown"} kg
- Age: ${profile.age || "unknown"}
- Gender: ${profile.gender || "unknown"}
- Activity Level: ${profile.activityLevel || profile.activity_level || "moderate"}
- Fitness Goal: ${profile.goal || "general fitness"}
- Timeline: ${profile.timeline || 3} months
- Fasting: ${profile.fasting || "none"}
- BMI: ${profile.weight && profile.height ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : "unknown"}

GUIDELINES:
- Keep responses concise (2-4 sentences max) and conversational
- Use 1-2 relevant emojis per response
- Personalize advice based on the user's profile above
- Be encouraging but honest
- If asked about medical conditions, recommend consulting a doctor
- Base nutrition advice on their goal (muscle building = high protein, fat loss = caloric deficit, etc.)`;
}

/**
 * Generate a chat response from the AI coach
 */
export async function chatWithCoach(message, userProfile, chatHistory = []) {
    const systemPrompt = buildSystemPrompt(userProfile);

    const messages = [
        { role: "system", content: systemPrompt },
    ];

    // Add chat history (last 6 messages for context)
    for (const msg of chatHistory.slice(-6)) {
        messages.push({
            role: msg.from === "user" ? "user" : "assistant",
            content: msg.text,
        });
    }

    // Add the new user message
    messages.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "I'm here to help! Could you rephrase that? 💪";
}

/**
 * Generate a workout plan for a muscle group
 */
export async function generateWorkoutPlan(muscleGroup, userProfile) {
    const profile = userProfile || {};

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are a fitness expert. Return ONLY valid JSON with no markdown formatting, no code fences, and no extra text.",
            },
            {
                role: "user",
                content: `Generate a workout plan for "${muscleGroup}" for a user with:
- Goal: ${profile.goal || "general fitness"}
- Activity Level: ${profile.activityLevel || profile.activity_level || "moderate"}
- Age: ${profile.age || 25}
- Weight: ${profile.weight || 75} kg

Return ONLY a JSON array with 3-5 exercises. Each object must have:
- "name": string (exercise name)
- "sets": string (e.g. "4×10")
- "icon": string (one relevant emoji)
- "rest": string (e.g. "90s")
- "tips": string (one sentence form tip)

Example: [{"name":"Bench Press","sets":"4×8","icon":"🏋️","rest":"120s","tips":"Keep your shoulder blades pinched together."}]`,
            },
        ],
        temperature: 0.6,
        max_tokens: 600,
    });

    const text = (completion.choices[0]?.message?.content || "[]").trim();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}

/**
 * Get AI-estimated nutrition info for a food item
 */
export async function estimateNutrition(foodName) {
    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are a nutrition expert. Return ONLY valid JSON with no markdown formatting, no code fences, and no extra text.",
            },
            {
                role: "user",
                content: `Estimate the nutritional content per typical serving of "${foodName}".
Return ONLY a JSON object with:
- "calories": number (kcal)
- "protein": number (grams)
- "carbs": number (grams)
- "fats": number (grams)
- "servingSize": string (e.g. "1 medium bowl", "100g")

Example: {"calories":350,"protein":25,"carbs":40,"fats":8,"servingSize":"1 plate"}`,
            },
        ],
        temperature: 0.3,
        max_tokens: 200,
    });

    const text = (completion.choices[0]?.message?.content || "{}").trim();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}

/**
 * Generate a diet insight based on today's meals
 */
export async function generateDietInsight(meals, userProfile) {
    const systemPrompt = buildSystemPrompt(userProfile);

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Here are my meals logged today:\n${JSON.stringify(meals, null, 2)}\n\nGive me a brief (2-3 sentences) personalized nutrition insight/feedback. Include what I should eat next and any adjustments.`,
            },
        ],
        temperature: 0.7,
        max_tokens: 250,
    });

    return completion.choices[0]?.message?.content || "Keep tracking your meals for better insights! 🥗";
}

/**
 * Generate a daily dashboard insight
 */
export async function generateDailyInsight(userProfile, recentActivity = {}) {
    const systemPrompt = buildSystemPrompt(userProfile);

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: `Recent activity summary:\n${JSON.stringify(recentActivity, null, 2)}\n\nGenerate ONE brief, personalized daily fitness insight (1-2 sentences). Be specific and actionable.`,
            },
        ],
        temperature: 0.7,
        max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "Stay consistent with your workouts today! 💪";
}

/**
 * Generate a personalized initial plan after onboarding
 */
export async function generateInitialPlan(userProfile) {
    const profile = userProfile || {};
    const bmi = profile.weight && profile.height
        ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
        : "unknown";

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are a fitness expert. Return ONLY valid JSON with no markdown formatting, no code fences, and no extra text.",
            },
            {
                role: "user",
                content: `Create a personalized fitness plan for:
- Name: ${profile.name || "User"}
- Height: ${profile.height || 175} cm, Weight: ${profile.weight || 75} kg, BMI: ${bmi}
- Age: ${profile.age || 25}, Gender: ${profile.gender || "male"}
- Activity Level: ${profile.activityLevel || profile.activity_level || "moderate"}
- Goal: ${profile.goal || "general fitness"}
- Timeline: ${profile.timeline || 3} months

Return ONLY a JSON object with:
- "roadmap": array of 3-4 phases, each with: "label" (phase name), "weeks" (e.g. "W1-3"), "description" (one sentence)
- "dailyCalorieTarget": number (kcal per day)
- "proteinTarget": number (grams per day)
- "carbsTarget": number (grams per day)
- "fatsTarget": number (grams per day)
- "eatMore": array of 4-5 food suggestions strings
- "limit": array of 4-5 foods to limit strings

Example: {"roadmap":[{"label":"Foundation","weeks":"W1-3","description":"Build base fitness"}],"dailyCalorieTarget":2200,"proteinTarget":140,"carbsTarget":200,"fatsTarget":65,"eatMore":["Lean protein","Vegetables"],"limit":["Sugary drinks","Fried foods"]}`,
            },
        ],
        temperature: 0.6,
        max_tokens: 800,
    });

    const text = (completion.choices[0]?.message?.content || "{}").trim();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}

/**
 * Generate personalized diet recommendations based on goal
 */
export async function generateDietRecommendations(userProfile) {
    const profile = userProfile || {};

    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: "You are a nutrition expert. Return ONLY valid JSON with no markdown formatting, no code fences, and no extra text.",
            },
            {
                role: "user",
                content: `Suggest personalized diet recommendations for someone with goal: "${profile.goal || "general fitness"}", activity level: "${profile.activityLevel || profile.activity_level || "moderate"}", weight: ${profile.weight || 75}kg.

Return ONLY a JSON object with:
- "eatMore": array of 4-5 specific food recommendation strings
- "limit": array of 4-5 specific foods to limit strings

Example: {"eatMore":["Chicken breast","Greek yogurt","Sweet potatoes","Spinach"],"limit":["Soda","Candy","White bread","Alcohol"]}`,
            },
        ],
        temperature: 0.5,
        max_tokens: 300,
    });

    const text = (completion.choices[0]?.message?.content || "{}").trim();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}
