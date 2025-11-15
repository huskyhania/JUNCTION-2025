import { DollarSign, Calendar, TrendingDown, CreditCard } from "lucide-react"

const stats = [
  {
    label: "Avg Daily Spending",
    value: "€95",
    icon: DollarSign,
    change: "+5%",
    changeType: "negative" as const,
  },
  {
    label: "Days to Payday",
    value: "12",
    icon: Calendar,
    change: null,
    changeType: null,
  },
  {
    label: "Biggest Expense",
    value: "€450",
    icon: TrendingDown,
    change: "Entertainment",
    changeType: null,
  },
  {
    label: "Active Cards",
    value: "2",
    icon: CreditCard,
    change: null,
    changeType: null,
  },
]

export function QuickStats() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-full">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.change && (
              <div className={`text-xs ${stat.changeType === "negative" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

