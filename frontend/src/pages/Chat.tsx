import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, User } from "lucide-react"

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const connectWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return // Already connected
    }

    setIsConnecting(true)
    setError(null)

    try {
      const ws = new WebSocket(WS_URL)
      socketRef.current = ws

      ws.onopen = () => {
        console.log("Connected to WebSocket server")
        setIsConnected(true)
        setIsConnecting(false)
        reconnectAttempts.current = 0
        setError(null)
        
        // Add welcome message if it's the first connection
        setMessages((prev) => {
          if (prev.length === 0) {
            return [{
              role: "system",
              text: "Connected to AI assistant. Ask me anything about your finances!"
            }]
          }
          return prev
        })
      }

      ws.onmessage = (event) => {
        const reply = event.data
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: reply },
        ])
      }

      ws.onclose = (event) => {
        console.log("Disconnected from server", event.code, event.reason)
        setIsConnected(false)
        setIsConnecting(false)

        // Attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
          setError(`Disconnected. Reconnecting in ${delay / 1000} seconds... (Attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError("Failed to connect after multiple attempts. Please refresh the page.")
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
        setIsConnecting(false)
        setError("Connection error. Please check if the backend server is running.")
      }
    } catch (err) {
      console.error("Failed to create WebSocket:", err)
      setIsConnecting(false)
      setError("Failed to connect to server. Please check the WebSocket URL.")
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting")
      }
    }
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError("Not connected to server. Attempting to reconnect...")
      connectWebSocket()
      return
    }

    const userMessage = input.trim()
    socketRef.current.send(userMessage)

    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setInput("")
    setError(null)
  }

  const handleReconnect = () => {
    reconnectAttempts.current = 0
    connectWebSocket()
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
        <div className={`p-3 border-b ${isConnected ? "bg-green-50" : isConnecting ? "bg-yellow-50" : "bg-red-50"}`}>
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : isConnecting ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
              <span className={isConnected ? "text-green-700" : isConnecting ? "text-yellow-700" : "text-red-700"}>
                {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
              </span>
            </div>
            {error && (
              <div className="flex items-center gap-2 flex-1 justify-end">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600 truncate">{error}</span>
                {!isConnecting && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReconnect}
                    className="h-6 px-2 text-xs"
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-foreground border"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                </div>
                {m.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2 items-end">
            <Textarea
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              disabled={!isConnected}
              rows={1}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!isConnected || !input.trim()} 
              className="h-[60px] px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
