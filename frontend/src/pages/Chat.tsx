"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Fastify WebSocket server
    const ws = new WebSocket("ws://localhost:3000/");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const reply = event.data;

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply },
      ]);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return alert("WebSocket is not connected");

    socketRef.current.send(input);

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">AI Chat</h1>

      <div className="w-full max-w-xl bg-white shadow rounded-xl p-4 flex flex-col">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto mb-4 h-96 border p-3 rounded bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded ${
                m.role === "user"
                  ? "bg-blue-200 text-left"
                  : "bg-green-200 text-left"
              }`}
            >
              <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
