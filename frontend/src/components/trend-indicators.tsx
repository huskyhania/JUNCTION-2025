import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react"

interface Trend {
  label: string
  value: string
  change: number
  isPositive: boolean
}

const trends: Trend[] = [
  { label: "Spending", value: "€2,850", change: -15, isPositive: true },
  { label: "Income", value: "€4,200", change: +8, isPositive: true },
  { label: "Savings", value: "€1,350", change: +25, isPositive: true },
  { label: "Transactions", value: "142", change: -5, isPositive: true },
]

export function TrendIndicators() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Trends</h2>
      <div className="space-y-3">
        {trends.map((trend) => (
          <div key={trend.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              {trend.isPositive ? (
                <TrendingDown className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-500" />
              )}
              <div>
                <div className="text-sm font-medium text-foreground">{trend.label}</div>
                <div className="text-xs text-muted-foreground">{trend.value}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {trend.isPositive ? "↓" : "↑"} {Math.abs(trend.change)}%
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

