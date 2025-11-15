import { CreditCard, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Subscription {
  id: string
  name: string
  amount: number
  billingCycle: "monthly" | "yearly"
  nextBilling: string
  category: string
  status: "active" | "cancelled" | "trial"
}

const subscriptions: Subscription[] = [
  { id: "1", name: "Netflix", amount: 15.99, billingCycle: "monthly", nextBilling: "2024-02-15", category: "Entertainment", status: "active" },
  { id: "2", name: "Spotify Premium", amount: 9.99, billingCycle: "monthly", nextBilling: "2024-02-10", category: "Entertainment", status: "active" },
  { id: "3", name: "Adobe Creative Cloud", amount: 52.99, billingCycle: "monthly", nextBilling: "2024-02-20", category: "Software", status: "active" },
  { id: "4", name: "Gym Membership", amount: 30, billingCycle: "monthly", nextBilling: "2024-02-01", category: "Health", status: "active" },
  { id: "5", name: "Amazon Prime", amount: 8.99, billingCycle: "monthly", nextBilling: "2024-02-12", category: "Shopping", status: "active" },
  { id: "6", name: "Microsoft 365", amount: 99, billingCycle: "yearly", nextBilling: "2024-06-01", category: "Software", status: "active" },
]

export default function Subscriptions() {
  const totalMonthly = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, sub) => {
      return sum + (sub.billingCycle === "monthly" ? sub.amount : sub.amount / 12)
    }, 0)

  const totalYearly = totalMonthly * 12

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Subscriptions Overview</h1>
        <p className="text-muted-foreground">Manage and track all your active subscriptions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">Total Monthly</span>
          </div>
          <div className="text-2xl font-bold text-foreground">€{totalMonthly.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span className="text-sm text-muted-foreground">Yearly Cost</span>
          </div>
          <div className="text-2xl font-bold text-foreground">€{totalYearly.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">Active Subscriptions</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {subscriptions.filter((s) => s.status === "active").length}
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Active Subscriptions</h2>
        <div className="grid gap-4">
          {subscriptions
            .filter((s) => s.status === "active")
            .map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{subscription.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {subscription.billingCycle}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{subscription.category}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Next billing: {formatDate(subscription.nextBilling)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">
                        €{subscription.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        /{subscription.billingCycle === "monthly" ? "mo" : "yr"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Savings Tip */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Savings Tip</h3>
            <p className="text-sm text-muted-foreground">
              You're spending €{totalMonthly.toFixed(2)}/month on subscriptions. Consider reviewing unused services to save money.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
