'use strict';

const fastify = require('fastify')();
const OpenAI = require("openai");


require("dotenv").config();


let GoogleGenerativeAI;

try {
  const pkg = require("@google/generative-ai");
  GoogleGenerativeAI = pkg.GoogleGenerativeAI || pkg.default;
  console.log("Gemini loaded OK");
} catch (e) {
  console.error("Gemini load FAILED:", e);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

console.log('wtf: ', process.env.API_KEY);

fastify.register(require('@fastify/websocket'));

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

fastify.register(async function (fastify) {

  // REST endpoint for AI insights
  fastify.post('/api/insights', async (request, reply) => {
    try {
      const { transactions } = request.body;
      
      if (!transactions || !Array.isArray(transactions)) {
        return reply.status(400).send({ error: 'Transactions array is required' });
      }

      // Analyze transactions
      const analysis = analyzeTransactions(transactions);
      
      const client = new OpenAI({
        apiKey: process.env.API_KEY,
        baseURL: "https://api.featherless.ai/v1"
      });

      const prompt = `You are a financial advisor. Analyze this user's transaction data and provide personalized financial insights.

Transaction Summary:
${JSON.stringify(analysis, null, 2)}

Please provide 5-7 financial insights in JSON format. Each insight should have:
- type: "tip" | "warning" | "achievement" | "opportunity"
- title: A short, clear title
- description: A detailed, actionable description with specific amounts and recommendations
- priority: 1-5 (1 is highest priority)

Return ONLY a valid JSON array of insights, no other text. Example format:
[
  {
    "type": "warning",
    "title": "High Spending Alert",
    "description": "You're spending €X more on [category] this month. Consider [specific action] to save €Y.",
    "priority": 1
  }
]`;

      const response = await client.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: "You are a helpful financial advisor. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message?.content || "[]";
      
      // Try to parse JSON from the response
      let insights;
      try {
        // Remove markdown code blocks if present
        const cleaned = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        insights = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse AI response:", aiResponse);
        // Fallback to generated insights based on analysis
        insights = generateFallbackInsights(analysis);
      }

      return { insights, analysis };
    } catch (err) {
      console.error("Error generating insights:", err);
      return reply.status(500).send({ error: err.message });
    }
  });

  fastify.post('/api/gemini', async (request, reply) => {
    try {
      const { prompt } = request.body;
  
      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      });
  
      const aiReply =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";
  
      return { reply: aiReply };
  
    } catch (err) {
      console.error("Gemini Error:", err);
      return reply.status(500).send({ error: err.message });
    }
  });  

  const { generateScenario } = require("./gameAI");

  fastify.post("/api/game/new", async (req, reply) => {
    try {
      console.log("➡️ /api/game/new called");
      const userProfile = req.body.userProfile || {};
      console.log("User profile:", userProfile);
  
      const scenario = await generateScenario(userProfile);
  
      console.log("✅ Scenario generated");
      return { scenario };
    } catch (err) {
      console.error("Game Error:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post("/api/game/choose", async (req, reply) => {
    try {
      const { scenario, choiceIndex } = req.body;
  
      if (!scenario || choiceIndex === undefined) {
        return reply.status(400).send({ error: "scenario + choiceIndex required" });
      }
  
      const consequences = scenario.consequences[String(choiceIndex)];
  
      const unlocked = [];
  
      // Example: Unlock achievements
      if (choiceIndex === 0) unlocked.push("SMART_SAVER");
      if (choiceIndex === 1) unlocked.push("DEBT_RISK_TAKER");
  
      return {
        consequences,
        learningTip: scenario.learningTip,
        unlocked,
      };
    } catch (err) {
      console.error("Error choosing:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.get('/', { websocket: true }, (socket, req) => {
    console.log("New connection!");

    socket.on('close', () => {
      console.log("Client disconnected.");
    });

    socket.on('message', async (rawMsg) => {
      try {
        const message = rawMsg.toString();
    
        // SPECIAL TRIGGER: If message starts with "gemini:"
        if (message.startsWith("gemini:")) {
          const geminiPrompt = message.replace("gemini:", "").trim();
    
          const result = await geminiModel.generateContent({
            contents: [
              {
                role: "user",
                parts: [{ text: geminiPrompt }]
              }
            ]
          });
    
          const geminiReply =
            result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response from Gemini";
    
          socket.send("[Gemini] " + geminiReply);
          return;
        }
    
        // Otherwise: use your *existing* Featherless/OpenAI model
        const client = new OpenAI({
          apiKey: process.env.API_KEY,
          baseURL: "https://api.featherless.ai/v1"
        });
    
        const response = await client.chat.completions.create({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
          messages: [
            { role: "user", content: message }
          ]
        });
    
        socket.send("[Llama] " + (response.choices[0].message?.content || "No response"));
    
      } catch (err) {
        console.error("WS Error:", err);
        socket.send("Error: " + err.message);
      }
    });    
  });

});

// Helper function to analyze transactions
function analyzeTransactions(transactions) {
  const categoryTotals = {};
  const statusCounts = { success: 0, pending: 0, failed: 0, processing: 0 };
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryCounts = {};

  transactions.forEach(tx => {
    const category = tx.category || 'Other';
    const amount = Math.abs(tx.amount);
    
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
      categoryCounts[category] = 0;
    }
    
    categoryTotals[category] += amount;
    categoryCounts[category]++;
    statusCounts[tx.status] = (statusCounts[tx.status] || 0) + 1;
    
    if (category === 'Income') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
  });

  const topCategories = Object.entries(categoryTotals)
    .filter(([cat]) => cat !== 'Income')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, total]) => ({ category, total, count: categoryCounts[category] }));

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryTotals,
    topCategories,
    statusCounts,
    totalTransactions: transactions.length,
    averageTransaction: totalExpenses / (transactions.length - (categoryCounts['Income'] || 0))
  };
}

// Fallback insights if AI parsing fails
function generateFallbackInsights(analysis) {
  const insights = [];
  
  if (analysis.netBalance < 0) {
    insights.push({
      type: "warning",
      title: "Negative Cash Flow",
      description: `Your expenses (€${analysis.totalExpenses.toFixed(2)}) exceed your income (€${analysis.totalIncome.toFixed(2)}) by €${Math.abs(analysis.netBalance).toFixed(2)}. Consider reducing spending in your top categories.`,
      priority: 1
    });
  }
  
  if (analysis.topCategories.length > 0) {
    const topCategory = analysis.topCategories[0];
    insights.push({
      type: "tip",
      title: "Top Spending Category",
      description: `You've spent €${topCategory.total.toFixed(2)} on ${topCategory.category} (${topCategory.count} transactions). Review if all expenses are necessary.`,
      priority: 2
    });
  }
  
  if (analysis.statusCounts.pending > 0) {
    insights.push({
      type: "warning",
      title: "Pending Transactions",
      description: `You have ${analysis.statusCounts.pending} pending transactions. Monitor these to ensure you have sufficient funds.`,
      priority: 3
    });
  }
  
  if (analysis.netBalance > 0) {
    insights.push({
      type: "opportunity",
      title: "Savings Opportunity",
      description: `You have a positive balance of €${analysis.netBalance.toFixed(2)}. Consider setting aside 20% (€${(analysis.netBalance * 0.2).toFixed(2)}) for savings.`,
      priority: 2
    });
  }
  
  return insights;
}

fastify.listen({ port: 3000 }, err => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("Server running on http://localhost:3000/");
  console.log("WebSocket server running on ws://localhost:3000/");
});

