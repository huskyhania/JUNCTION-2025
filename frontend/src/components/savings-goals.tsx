import { Target } from "lucide-react"

interface Goal {
  name: string
  target: number
  current: number
  deadline: string
}

const goals: Goal[] = [
  { name: "Emergency Fund", target: 5000, current: 3200, deadline: "2024-12-31" },
  { name: "Vacation", target: 2000, current: 850, deadline: "2024-06-30" },
  { name: "New Laptop", target: 1500, current: 1200, deadline: "2024-03-31" },
]

export function SavingsGoals() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-foreground">Savings Goals</h2>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100
          const remaining = goal.target - goal.current

          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{goal.name}</span>
                <span className="text-xs text-muted-foreground">{goal.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground min-w-[3rem] text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">€{goal.current.toLocaleString()} / €{goal.target.toLocaleString()}</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">€{remaining.toLocaleString()} to go</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

