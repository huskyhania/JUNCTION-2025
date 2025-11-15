const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

let recentScenarios = [];

let scenarioQueue = [];

function extractJsonBlock(text) {
  if (!text) return null;

  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const arrayMatch = cleaned.match(/\[[\s\S]*\]$/);
  if (arrayMatch) return arrayMatch[0];

  const objMatch = cleaned.match(/\{[\s\S]*\}$/);
  return objMatch ? objMatch[0] : cleaned;
}

async function generateScenarioBatch(userProfile) {
  console.log("Generating new batch of 5 scenarios from Gemini...");

  const prompt = `
Generate **5 different financial scenarios**.
Return ONLY a JSON array of 5 objects. No markdown. No explanations.

AVOID repeating themes from these recent scenarios:
${recentScenarios.map(t => `- ${t}`).join("\n")}

The scenarios SHOULD be aimed at teenagers and young adults. 
The scenarios CAN be related to topics of consumer decision making, earning income, money management and situational awareness of household practises.

Each scenario must follow EXACTLY this structure:
{
  "title": "short string",
  "description": "1-2 sentence description",
  "options": ["short option", "short option", "short option"],
  "consequences": {
    "0": "short single-sentence consequence",
    "1": "short single-sentence consequence",
    "2": "short single-sentence consequence"
  },
  "learningTip": "short sentence"
}

ALL text must be concise (no more than 2 sentences).
Return exactly 5 scenarios inside an array.

User profile:
${JSON.stringify(userProfile)}
`;

  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const raw = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("RAW BATCH OUTPUT:\n", raw);

    let cleaned = extractJsonBlock(raw);
    console.log("CLEANED ARRAY:\n", cleaned);

    const scenarios = JSON.parse(cleaned);

    // Normalize consequences to shortTerm/longTerm format
    scenarios.forEach(s => {
      for (const key of ["0", "1", "2"]) {
        if (typeof s.consequences[key] === "string") {
          s.consequences[key] = {
            shortTerm: s.consequences[key],
            longTerm: ""
          };
        }
      }
      recentScenarios.push(s.title);
    });

    // Keep recent memory short
    if (recentScenarios.length > 15)
      recentScenarios = recentScenarios.slice(-15);

    // Push batch into queue
    scenarioQueue.push(...scenarios);

    console.log("Batch loaded. Queue length:", scenarioQueue.length);

  } catch (error) {
    console.error("GEMINI BATCH ERROR:", error);
    throw new Error("Failed to generate scenario batch");
  }
}

// --- Get 1 scenario (frontend calls this) ---
async function generateScenario(userProfile) {
  if (scenarioQueue.length === 0) {
    await generateScenarioBatch(userProfile);
  }

  const nextScenario = scenarioQueue.shift();
  return nextScenario;
}

module.exports = { generateScenario };
