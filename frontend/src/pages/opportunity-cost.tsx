import { TrendingUp, Coffee, Plane, PiggyBank, Lightbulb } from "lucide-react"

interface Opportunity {
  id: string
  spentOn: string
  amount: number
  couldHaveBought: string
  icon: any
  color: string
}

const opportunities: Opportunity[] = [
  {
    id: "1",
    spentOn: "Daily Coffee (30 days)",
    amount: 150,
    couldHaveBought: "Emergency Fund Contribution",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "2",
    spentOn: "Impulse Purchases",
    amount: 320,
    couldHaveBought: "Weekend Getaway",
    icon: Plane,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    spentOn: "Unused Subscriptions",
    amount: 85,
    couldHaveBought: "Savings Goal Progress",
    icon: PiggyBank,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "4",
    spentOn: "Dining Out (Extra)",
    amount: 200,
    couldHaveBought: "Investment Contribution",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-700",
  },
]

export default function OpportunityCost() {
  const totalOpportunityCost = opportunities.reduce((sum, opp) => sum + opp.amount, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Opportunity Cost Highlights</h1>
        <p className="text-muted-foreground">
          See what you could have achieved with the money you spent
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Lightbulb className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Opportunity Cost</div>
            <div className="text-3xl font-bold text-foreground">€{totalOpportunityCost.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          This represents money that could have been saved, invested, or used for more meaningful purchases.
        </p>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Opportunities</h2>
        <div className="grid gap-4">
          {opportunities.map((opp) => {
            const Icon = opp.icon
            return (
              <div key={opp.id} className="bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${opp.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{opp.spentOn}</h3>
                      <span className="text-lg font-bold text-foreground">€{opp.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Could have been:</span>
                      <span className="font-medium text-foreground">{opp.couldHaveBought}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insight Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Insight</h3>
            <p className="text-sm text-muted-foreground mb-3">
              By reducing unnecessary spending by just 20%, you could save €{(totalOpportunityCost * 0.2).toFixed(2)} this month.
              That's €{(totalOpportunityCost * 0.2 * 12).toFixed(2)} per year!
            </p>
            <div className="text-xs text-muted-foreground">
              💡 Tip: Review your spending patterns and identify areas where you can make small adjustments.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
