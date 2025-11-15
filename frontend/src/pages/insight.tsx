import { Lightbulb, TrendingUp, AlertCircle, Target, Sparkles } from "lucide-react"

interface Insight {
  id: string
  type: "tip" | "warning" | "achievement" | "opportunity"
  title: string
  description: string
  action?: string
  icon: any
  color: string
}

const insights: Insight[] = [
  {
    id: "1",
    type: "tip",
    title: "Spending Pattern Detected",
    description: "You're spending 35% more on dining out this month compared to last month. Consider meal planning to save money.",
    action: "View Spending Breakdown",
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-500",
  },
  {
    id: "2",
    type: "achievement",
    title: "Savings Goal Progress",
    description: "You're 64% towards your emergency fund goal! Keep up the great work.",
    action: "View Goals",
    icon: Target,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-500",
  },
  {
    id: "3",
    type: "warning",
    title: "Subscription Alert",
    description: "You have 3 subscriptions you haven't used in the last 30 days. Consider canceling to save €45/month.",
    action: "Review Subscriptions",
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-500",
  },
  {
    id: "4",
    type: "opportunity",
    title: "Investment Opportunity",
    description: "Based on your spending patterns, you could invest €200/month and reach your retirement goal 3 years earlier.",
    action: "Learn More",
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-500",
  },
  {
    id: "5",
    type: "tip",
    title: "Budget Optimization",
    description: "Your entertainment budget is 20% under this month. You could reallocate €60 to your savings goal.",
    action: "Adjust Budget",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-500",
  },
]

export default function Insight() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">AI Insights</h1>
        <p className="text-muted-foreground">
          Personalized financial insights and recommendations powered by AI
        </p>
      </div>

      {/* Featured Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border-l-4 border-blue-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                Featured
              </span>
              <h2 className="text-xl font-semibold text-foreground">Smart Savings Opportunity</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Based on your spending patterns, we've identified that you could save an additional €150/month 
              by optimizing your subscription services and reducing impulse purchases.
            </p>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              View Detailed Analysis →
            </button>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Insights</h2>
        <div className="grid gap-4">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div
                key={insight.id}
                className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${insight.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${insight.color.split(' ')[0]} ${insight.color.split(' ')[1]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    {insight.action && (
                      <button className="text-sm font-medium text-foreground hover:underline">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Active Insights</div>
          <div className="text-2xl font-bold text-foreground">{insights.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Potential Savings</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">€195/mo</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Recommendations</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</div>
        </div>
      </div>
    </div>
  )
}
