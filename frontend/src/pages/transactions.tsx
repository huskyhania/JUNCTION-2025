import { useMemo } from "react"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { paymentsData as allPaymentsData, filterPaymentsByDateRange } from "./payments-data"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTimeframe, type TimeframePreset } from "@/context/timeframe-context"

export default function Transactions() {
  const { range, timeframe, setPreset, setCustomRange } = useTimeframe()

  const filteredData = useMemo(
    () => filterPaymentsByDateRange(allPaymentsData, range),
    [range]
  )

  const handleQuickFilter = (filterType: Extract<TimeframePreset, "day" | "week" | "month">) => {
    setPreset(filterType)
  }

  const handleDownload = () => {
    const headers = ["ID", "Amount", "Status", "Description", "Date", "Category"]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((payment) =>
        [
          payment.id,
          payment.amount,
          payment.status,
          payment.description,
          payment.date,
          payment.category || "",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    const formatBound = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : "all")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `transactions-${formatBound(range?.from)}-${formatBound(range?.to)}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Transactions Feed</h1>
        <p className="text-muted-foreground">View and manage all your financial transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <DateRangePicker
            date={range}
            onDateChange={(range) => {
              setCustomRange(range)
            }}
          />
          <div className="flex items-center gap-2 border-l pl-3">
            <Button
              variant={timeframe.preset === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("day")}
              className={cn(timeframe.preset === "day" && "bg-blue-600 hover:bg-blue-700")}
            >
              Day
            </Button>
            <Button
              variant={timeframe.preset === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("week")}
              className={cn(timeframe.preset === "week" && "bg-blue-600 hover:bg-blue-700")}
            >
              Week
            </Button>
            <Button
              variant={timeframe.preset === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("month")}
              className={cn(timeframe.preset === "month" && "bg-blue-600 hover:bg-blue-700")}
            >
              Month
            </Button>
          </div>
        </div>
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}
