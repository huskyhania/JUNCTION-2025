'use strict';

const fastify = require('fastify')();
const OpenAI = require("openai");
require("dotenv").config();

fastify.register(require('@fastify/websocket'));

fastify.register(async function (fastify) {

  fastify.get('/', { websocket: true }, (socket, req) => {
    console.log("New connection!");

    socket.on('close', () => {
      console.log("Client disconnected.");
    });

    socket.on('message', async (rawMsg) => {
      try {
        console.log("Sending api call to ai");
        const userMessage = rawMsg.toString();

        const client = new OpenAI({
          apiKey: process.env.API_KEY,
          baseURL: "https://api.featherless.ai/v1"   // Example Featherless URL — change if needed
        });

        const response = await client.chat.completions.create({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
          messages: [
            { role: "teach for a child", content: userMessage }
          ]
        });

        const aiReply = response.choices[0].message?.content || "No response";

        console.log("AI Reply:");
        console.log(aiReply);

        socket.send(aiReply);

      } catch (err) {
        console.error("Error:", err);
        socket.send("Server error: " + err.message);
      }
    });

  });

});

fastify.listen({ port: 3000 }, err => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log("WebSocket server running on ws://localhost:3000/");
});

