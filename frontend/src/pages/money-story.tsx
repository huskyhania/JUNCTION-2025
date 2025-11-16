import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"

interface StoryEvent {
  id: string
  date: string
  title: string
  description: string
  amount?: number
  type: "income" | "expense" | "milestone"
  category?: string
}

const storyEvents: StoryEvent[] = [
  {
    id: "1",
    date: "2024-01-15",
    title: "Salary Payment",
    description: "Monthly salary received",
    amount: 4200,
    type: "income",
    category: "Salary",
  },
  {
    id: "2",
    date: "2024-01-20",
    title: "Emergency Fund Milestone",
    description: "Reached €5,000 emergency fund goal",
    type: "milestone",
  },
  {
    id: "3",
    date: "2024-01-25",
    title: "Major Purchase",
    description: "New laptop for work",
    amount: 1200,
    type: "expense",
    category: "Electronics",
  },
  {
    id: "4",
    date: "2024-02-01",
    title: "Investment Started",
    description: "Began monthly investment plan",
    amount: 500,
    type: "expense",
    category: "Investment",
  },
  {
    id: "5",
    date: "2024-02-05",
    title: "Freelance Income",
    description: "Side project payment",
    amount: 800,
    type: "income",
    category: "Freelance",
  },
]

export default function MoneyStory() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "expense":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <DollarSign className="h-5 w-5 text-blue-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "income":
        return "border-green-500 bg-green-50"
      case "expense":
        return "border-red-500 bg-red-50"
      default:
        return "border-blue-500 bg-blue-50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Money Story</h1>
        <p className="text-muted-foreground">Your financial journey and key milestones</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-6">
          {storyEvents.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-white ${
                event.type === "income" ? "border-green-500" : event.type === "expense" ? "border-red-500" : "border-blue-500"
              }`}>
                {getEventIcon(event.type)}
              </div>

              {/* Event Card */}
              <div className={`flex-1 p-4 rounded-xl shadow-sm border-l-4 ${getEventColor(event.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      {event.category && (
                        <span className="px-2 py-0.5 bg-gray-100 text-xs rounded">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                </div>
                {event.amount && (
                  <div className={`text-lg font-bold ${
                    event.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {event.type === "income" ? "+" : "-"}€{event.amount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Story Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Income</div>
            <div className="text-2xl font-bold text-green-600">
              €{storyEvents.filter((e) => e.type === "income").reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-red-600">
              €{storyEvents.filter((e) => e.type === "expense").reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Milestones</div>
            <div className="text-2xl font-bold text-blue-600">
              {storyEvents.filter((e) => e.type === "milestone").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
