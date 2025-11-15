import { CreditCard, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BNPLItem {
  id: string
  merchant: string
  item: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  installments: number
  currentInstallment: number
  nextPayment: string
  status: "active" | "completed" | "overdue"
}

const bnplItems: BNPLItem[] = [
  {
    id: "1",
    merchant: "Klarna",
    item: "iPhone 15 Pro",
    totalAmount: 1200,
    paidAmount: 400,
    remainingAmount: 800,
    installments: 4,
    currentInstallment: 2,
    nextPayment: "2024-02-15",
    status: "active",
  },
  {
    id: "2",
    merchant: "Afterpay",
    item: "Designer Shoes",
    totalAmount: 350,
    paidAmount: 175,
    remainingAmount: 175,
    installments: 4,
    currentInstallment: 3,
    nextPayment: "2024-02-10",
    status: "active",
  },
  {
    id: "3",
    merchant: "Klarna",
    item: "Laptop",
    totalAmount: 1500,
    paidAmount: 1500,
    remainingAmount: 0,
    installments: 6,
    currentInstallment: 6,
    nextPayment: "2024-01-20",
    status: "completed",
  },
  {
    id: "4",
    merchant: "PayPal Pay in 4",
    item: "Furniture Set",
    totalAmount: 800,
    paidAmount: 200,
    remainingAmount: 600,
    installments: 4,
    currentInstallment: 1,
    nextPayment: "2024-02-05",
    status: "overdue",
  },
]

export default function BNPL() {
  const totalOwed = bnplItems
    .filter((item) => item.status === "active" || item.status === "overdue")
    .reduce((sum, item) => sum + item.remainingAmount, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <CreditCard className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500"
      case "overdue":
        return "border-red-500"
      default:
        return "border-blue-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">BNPL / Klarna Overview</h1>
        <p className="text-muted-foreground">Track your Buy Now Pay Later purchases and payment schedules</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Amount Owed</div>
            <div className="text-3xl font-bold text-foreground">€{totalOwed.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {bnplItems.filter((i) => i.status === "active" || i.status === "overdue").length} active plans
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Completed Plans</div>
            <div className="text-2xl font-bold text-green-600">
              {bnplItems.filter((i) => i.status === "completed").length}
            </div>
          </div>
        </div>
      </div>

      {/* BNPL Items List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Payment Plans</h2>
        <div className="grid gap-4">
          {bnplItems.map((item) => {
            const progress = (item.paidAmount / item.totalAmount) * 100

            return (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(item.status)}
                      <h3 className="font-semibold text-foreground">{item.item}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs rounded">{item.merchant}</span>
                      {item.status === "overdue" && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Installment {item.currentInstallment} of {item.installments}
                      </span>
                      {item.status !== "completed" && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Next: {formatDate(item.nextPayment)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      €{item.remainingAmount > 0 ? item.remainingAmount.toFixed(2) : "0.00"}
                    </div>
                    <div className="text-xs text-muted-foreground">remaining</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.status === "completed" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Paid: €{item.paidAmount.toFixed(2)}</span>
                    <span>Total: €{item.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {item.status !== "completed" && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      Make Payment
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Payment Reminder</h3>
            <p className="text-sm text-muted-foreground">
              Make sure to pay your BNPL installments on time to avoid late fees and impact on your credit score.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
