import { useState, useMemo } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, startOfDay, endOfDay } from "date-fns"
import { Download, Filter } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { paymentsData as allPaymentsData } from "./payments-data"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Transactions() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [activeFilter, setActiveFilter] = useState<"day" | "week" | "month" | null>(null)

  const today = new Date(2025, 10, 15) // November 15, 2025

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return allPaymentsData
    }

    return allPaymentsData.filter((payment) => {
      const paymentDate = new Date(payment.date)
      paymentDate.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999) // End of day
        
        return paymentDate >= fromDate && paymentDate <= toDate
      } else if (dateRange.from) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)
        return paymentDate >= fromDate
      } else if (dateRange.to) {
        const toDate = new Date(dateRange.to)
        toDate.setHours(23, 59, 59, 999)
        return paymentDate <= toDate
      }

      return true
    })
  }, [dateRange])

  const handleQuickFilter = (filterType: "day" | "week" | "month") => {
    setActiveFilter(filterType)
    
    if (filterType === "day") {
      const dayStart = startOfDay(today)
      const dayEnd = endOfDay(today)
      setDateRange({ from: dayStart, to: dayEnd })
    } else if (filterType === "week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
      setDateRange({ from: weekStart, to: weekEnd })
    } else if (filterType === "month") {
      const monthStart = startOfMonth(today)
      const monthEnd = endOfDay(today) // Today since we're in the middle of the month
      setDateRange({ from: monthStart, to: monthEnd })
    }
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
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `transactions-${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "all"}-${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "all"}.csv`
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
            date={dateRange}
            onDateChange={(range) => {
              setDateRange(range)
              setActiveFilter(null) // Clear active filter when manually selecting dates
            }}
          />
          <div className="flex items-center gap-2 border-l pl-3">
            <Button
              variant={activeFilter === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("day")}
              className={cn(activeFilter === "day" && "bg-blue-600 hover:bg-blue-700")}
            >
              Day
            </Button>
            <Button
              variant={activeFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("week")}
              className={cn(activeFilter === "week" && "bg-blue-600 hover:bg-blue-700")}
            >
              Week
            </Button>
            <Button
              variant={activeFilter === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleQuickFilter("month")}
              className={cn(activeFilter === "month" && "bg-blue-600 hover:bg-blue-700")}
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
