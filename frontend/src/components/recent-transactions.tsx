import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { paymentsData } from "@/pages/payments-data"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

export function RecentTransactions() {
  // Get the 5 most recent transactions
  const recentTransactions = paymentsData.slice(0, 5)

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Transactions</h2>
      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const isExpense = transaction.amount < 0 || transaction.status === "failed"
          const status = transaction.status as keyof typeof statusColors

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isExpense ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {isExpense ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      isExpense ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isExpense ? "-" : "+"}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(Math.abs(transaction.amount))}
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${
                      statusColors[status] || ""
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

