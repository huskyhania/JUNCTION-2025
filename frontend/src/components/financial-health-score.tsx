import { Heart, TrendingUp } from "lucide-react"

export function FinancialHealthScore() {
  const score = 78 // Out of 100
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
  const scoreBg = score >= 80 ? "bg-green-100" : score >= 60 ? "bg-yellow-100" : "bg-red-100"

  const factors = [
    { label: "Savings Rate", value: "25%", status: "good" },
    { label: "Debt Ratio", value: "12%", status: "good" },
    { label: "Spending Control", value: "85%", status: "warning" },
  ]

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-foreground">Financial Health</h2>
      </div>
      
      <div className="flex flex-col items-center justify-center py-4">
        <div className={`relative w-32 h-32 rounded-full ${scoreBg} flex items-center justify-center mb-4`}>
          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-500"
            style={{
              borderTopColor: score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444",
              borderRightColor: score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444",
              transform: `rotate(${(score / 100) * 360 - 90}deg)`,
              clipPath: score < 50 ? "none" : "inset(0)",
            }}
          />
          <div className="relative z-10 text-center">
            <div className={`text-3xl font-bold ${scoreColor}`}>{score}</div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
        
        <div className="w-full space-y-2">
          {factors.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{factor.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{factor.value}</span>
                {factor.status === "good" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

