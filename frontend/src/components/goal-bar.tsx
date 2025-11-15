import { cn } from "@/lib/utils"

interface GoalBarProps {
  current: number
  goal: number
  label?: string
  unit?: string
  showPercentage?: boolean
  showRemaining?: boolean
  className?: string
  barColor?: string
  size?: "sm" | "md" | "lg"
}

export function GoalBar({
  current,
  goal,
  label,
  unit = "€",
  showPercentage = true,
  showRemaining = true,
  className,
  barColor,
  size = "md",
}: GoalBarProps) {
  const percentage = Math.min(Math.max((current / goal) * 100, 0), 100)
  const remaining = Math.max(goal - current, 0)
  const isComplete = current >= goal

  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const defaultBarColor = isComplete
    ? "bg-gradient-to-r from-green-500 to-emerald-600"
    : "bg-gradient-to-r from-blue-500 to-indigo-600"

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex-1 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700",
            heightClasses[size]
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-300",
              barColor || defaultBarColor
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      {showRemaining && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            {unit}
            {current.toLocaleString()} / {unit}
            {goal.toLocaleString()}
          </span>
          {!isComplete && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {unit}
              {remaining.toLocaleString()} to go
            </span>
          )}
          {isComplete && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              Goal reached! 🎉
            </span>
          )}
        </div>
      )}
    </div>
  )
}

