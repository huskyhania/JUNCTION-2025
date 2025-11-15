import MonthSummaryComponent from "./month_summary"

export default function MonthSummary() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Month Summary</h1>
        <p className="text-muted-foreground">
          Overview of your income, spending, and net balance
        </p>
      </div>
      <MonthSummaryComponent />
    </div>
  )
}

