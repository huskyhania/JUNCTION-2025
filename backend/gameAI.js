const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

// Memory to avoid repetition
let recentScenarios = [];

async function generateScenario(userProfile) {
let raw = "";
const prompt = `
Generate a JSON-only financial scenario.
DO NOT return markdown, code blocks, or explanations.

AVOID generating ANY scenario similar to these recent ones:
${recentScenarios.map(t => `- ${t}`).join("\n")}

If any of the recent scenarios involved:
- car repairs
- medical bills
- borrowing money
- emergency expenses

Do NOT generate a new scenario with those themes.

Randomly choose ONE scenario type:
- Unexpected expense
- Positive financial event
- Social obligation
- Temptation purchase
- Debt or credit situation
- Work-related change
- Long-term planning
- Ethical financial dilemma
- Windfall opportunity
- Financial mistake recovery

Be creative, unpredictable, and vary tone and stakes.

Return EXACTLY in this JSON structure:
{
  "title": "string",
  "description": "string",
  "options": ["string", "string", "string"],
  "consequences": {
    "0": "string",
    "1": "string",
    "2": "string"
  },
  "learningTip": "string"
}

User profile:
${JSON.stringify(userProfile)}
`;

  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const raw = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("🧠 RAW GEMINI OUTPUT:\n", raw);

    let cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];

    console.log("CLEANED OUTPUT:\n", cleaned);

    const json = JSON.parse(cleaned);

    for (const key of ["0", "1", "2"]) {
        if (typeof json.consequences[key] === "string") {
          json.consequences[key] = {
            shortTerm: json.consequences[key]
          };
        }
    }

    // Store scenario memory
    recentScenarios.push(json.title);
    if (recentScenarios.length > 5) recentScenarios.shift();

    return json;

    } catch (error) {
    console.error("GEMINI SCENARIO ERROR:", error);
    console.error("RAW TEXT BEFORE PARSE FAILED:\n", raw);
    throw new Error("Failed to generate scenario");
  }
}

module.exports = { generateScenario };
