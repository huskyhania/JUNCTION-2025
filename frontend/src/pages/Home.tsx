import { useState } from "react";
import { format } from "date-fns";
import { Download, LayoutGrid, List } from "lucide-react";
import Dashboard from "./dashboard";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { paymentsData } from "./payments-data";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paymentsData as allPaymentsData } from "./payments-data";

export default function Home() {
  const user = { name: "John Doe" };
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const handleDownload = () => {
    // Filter data based on date range if selected
    let dataToExport = allPaymentsData;
    
    if (dateRange.from && dateRange.to) {
      // In a real app, you'd filter by actual date fields
      // For now, we'll just export all data
      dataToExport = allPaymentsData;
    }

    // Convert to CSV
    const headers = ["ID", "Amount", "Status", "Description", "Date", "Category"];
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
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payments-${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "all"}-${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "all"}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Yo 🤟🏻 {user.name}, welcome!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your finances this month
          </p>
          <div className="mt-4">
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "overview" | "detailed")}
              className="w-auto"
              >
              <TabsList>
                <TabsTrigger value="overview" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="detailed" className="gap-2">
                  <List className="h-4 w-4" />
                  AI Insights
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />

          {/* Download Button */}
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <Dashboard />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Payments</h2>
          <DataTable columns={columns} data={paymentsData} />
        </div>
      </div>
    </div>
  );
}