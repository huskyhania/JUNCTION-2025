import { useMemo } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { paymentsData, filterPaymentsByDateRange } from "@/pages/payments-data"
import { useTimeframe } from "@/context/timeframe-context"

interface BudgetItem {
  category: string
  budget: number
  spent: number
  color: string
}

// Define budget targets for each category
const categoryBudgets: Record<string, number> = {
  Food: 500,
  Transportation: 200,
  Entertainment: 300,
  Utilities: 150,
  Housing: 1500,
  Shopping: 400,
  Health: 300,
  Education: 500,
  Travel: 1000,
}

// Map categories to colors
const categoryColors: Record<string, string> = {
  Food: "bg-green-500",
  Transportation: "bg-blue-500",
  Entertainment: "bg-red-500",
  Utilities: "bg-yellow-500",
  Housing: "bg-purple-500",
  Shopping: "bg-pink-500",
  Health: "bg-orange-500",
  Education: "bg-indigo-500",
  Travel: "bg-cyan-500",
}

export function BudgetProgress() {
  const { range } = useTimeframe()
  const scopedPayments = useMemo(
    () => filterPaymentsByDateRange(paymentsData, range),
    [range]
  )

  // Calculate spent amounts per category from paymentsData
  // Only count successful and processing transactions (exclude failed and Income)
  const categorySpent = new Map<string, number>()
  
  scopedPayments.forEach((payment) => {
    if (
      payment.category &&
      payment.category !== "Income" &&
      (payment.status === "success" || payment.status === "processing")
    ) {
      const current = categorySpent.get(payment.category) || 0
      categorySpent.set(payment.category, current + Math.abs(payment.amount))
    }
  })

  // Build budget data from actual spending
  const budgetData: BudgetItem[] = Array.from(categorySpent.entries())
    .map(([category, spent]) => ({
      category,
      budget: categoryBudgets[category] || 500, // Default budget if not defined
      spent,
      color: categoryColors[category] || "bg-gray-500",
    }))
    .sort((a, b) => b.spent - a.spent) // Sort by spent amount descending

  // If no data, show empty state
  if (budgetData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Budget Progress</h2>
        <p className="text-sm text-muted-foreground">No spending data available</p>
      </div>
    )
  }
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Budget Progress</h2>
      <div className="space-y-4">
        {budgetData.map((item) => {
          const percentage = (item.spent / item.budget) * 100
          const isOverBudget = item.spent > item.budget
          const isAt100 = percentage >= 100 && !isOverBudget
          const remaining = item.budget - item.spent

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={isOverBudget ? "text-red-500 font-medium text-foreground" : "text-green-500 font-medium text-foreground"}>{item.category}</span>
                <div className="flex items-center gap-2">
                  {isOverBudget ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
                    {isOverBudget ? `€${Math.abs(remaining).toFixed(0)} over` : `€${remaining.toFixed(0)} left`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative ${isAt100 ? "animate-pulse" : ""}`}>
                  <div
                    className={`h-full transition-all duration-300 ${isAt100 ? "bg-yellow-500 animate-pulse" : isOverBudget ? "bg-red-500" : item.color}`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOverBudget ? "#ef4444" : isAt100 ? "#eab308" : undefined,
                    }}
                  />
                  {isAt100 && (
                    <div className="absolute inset-0 bg-yellow-400 opacity-50 animate-ping" />
                  )}
                </div>
                <span className={`text-xs min-w-[3rem] text-right ${isAt100 ? "text-yellow-600 font-semibold" : "text-muted-foreground"}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>€{item.spent.toFixed(0)} / €{item.budget.toFixed(0)}</span>
                {isAt100 && (
                  <span className="text-yellow-600 font-medium">⚠️ Budget reached!</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

