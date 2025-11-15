import { TrendingUp, TrendingDown } from "lucide-react"

interface BudgetItem {
  category: string
  budget: number
  spent: number
  color: string
}

const budgetData: BudgetItem[] = [
  { category: "Food", budget: 500, spent: 320, color: "bg-green-500" },
  { category: "Transport", budget: 200, spent: 180, color: "bg-blue-500" },
  { category: "Entertainment", budget: 300, spent: 450, color: "bg-red-500" },
  { category: "Utilities", budget: 150, spent: 145, color: "bg-yellow-500" },
]

export function BudgetProgress() {
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
                <span className="font-medium text-foreground">{item.category}</span>
                <div className="flex items-center gap-2">
                  {isOverBudget ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={isOverBudget ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
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
                <span className={`text-xs min-w-[3rem] text-right ${isAt100 ? "text-yellow-600 dark:text-yellow-400 font-semibold" : "text-muted-foreground"}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>€{item.spent.toFixed(0)} / €{item.budget.toFixed(0)}</span>
                {isAt100 && (
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">⚠️ Budget reached!</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

