import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import Dashboard from "./dashboard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const user = { name: "John Doe" };
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

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
      </div>
      <div className="space-y-6">
        <Dashboard />
      </div>
    </div>
  );
}