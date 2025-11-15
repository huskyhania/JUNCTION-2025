import { Calendar, DollarSign, AlertCircle } from "lucide-react"

interface UpcomingPayment {
  id: string
  description: string
  amount: number
  dueDate: string
  category: string
  isOverdue: boolean
}

const upcomingPayments: UpcomingPayment[] = [
  { id: "1", description: "Rent Payment", amount: 1200, dueDate: "2024-02-01", category: "Housing", isOverdue: false },
  { id: "2", description: "Electricity Bill", amount: 85, dueDate: "2024-02-05", category: "Utilities", isOverdue: false },
  { id: "3", description: "Internet Subscription", amount: 45, dueDate: "2024-02-10", category: "Utilities", isOverdue: false },
  { id: "4", description: "Credit Card Payment", amount: 350, dueDate: "2024-02-15", category: "Debt", isOverdue: false },
  { id: "5", description: "Gym Membership", amount: 30, dueDate: "2024-01-28", category: "Health", isOverdue: true },
]

export default function UpcomingPayments() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const daysUntilDue = (dateString: string) => {
    const today = new Date()
    const dueDate = new Date(dateString)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Upcoming Payments</h1>
        <p className="text-muted-foreground">Track your scheduled payments and avoid missed deadlines</p>
      </div>

      <div className="grid gap-4">
        {upcomingPayments.map((payment) => {
          const days = daysUntilDue(payment.dueDate)
          const isOverdue = payment.isOverdue || days < 0

          return (
            <div
              key={payment.id}
              className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${
                isOverdue ? "border-red-500" : days <= 3 ? "border-yellow-500" : "border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{payment.description}</h3>
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        <AlertCircle className="h-3 w-3" />
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(payment.dueDate)}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{payment.category}</span>
                    {!isOverdue && (
                      <span className={days <= 3 ? "text-yellow-600 font-medium" : "text-muted-foreground"}>
                        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days} days left`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">
                    €{payment.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Payment Reminder</h3>
            <p className="text-sm text-muted-foreground">
              You have {upcomingPayments.filter((p) => !p.isOverdue && daysUntilDue(p.dueDate) <= 3).length} payment(s) due within 3 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
