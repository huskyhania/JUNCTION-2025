import { useState } from "react"
import { format } from "date-fns"
import { Download, Filter } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { paymentsData } from "./payments-data"
import { paymentsData as allPaymentsData } from "./payments-data"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"

export default function Transactions() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  const handleDownload = () => {
    let dataToExport = allPaymentsData
    
    if (dateRange.from && dateRange.to) {
      dataToExport = allPaymentsData
    }

    const headers = ["ID", "Amount", "Status", "Description", "Date", "Category"]
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((payment) =>
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
        <div className="flex items-center gap-3">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <DataTable columns={columns} data={paymentsData} />
    </div>
  )
}
