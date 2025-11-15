import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User } from "lucide-react"

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Connect to Fastify WebSocket server
    const ws = new WebSocket("ws://localhost:3000/")
    socketRef.current = ws

    ws.onopen = () => {
      console.log("Connected to WebSocket server")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const reply = event.data

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply },
      ])
    }

    ws.onclose = () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    }

    ws.onerror = () => {
      setIsConnected(false)
    }

    return () => ws.close()
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("WebSocket is not connected")
      return
    }

    socketRef.current.send(input)

    setMessages((prev) => [...prev, { role: "user", text: input }])
    setInput("")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">AI Chat Assistant</h1>
        <p className="text-muted-foreground">
          Get instant answers to your financial questions
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
        {/* Connection Status */}
        <div className={`p-3 border-b ${isConnected ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className={isConnected ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask me anything about your finances, budgeting, savings, or investments.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-foreground border"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                </div>
                {m.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground bg-white dark:bg-gray-800"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!isConnected}
            />
            <Button onClick={sendMessage} disabled={!isConnected || !input.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
