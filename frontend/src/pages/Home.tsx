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
        </div>
      </div>
      <div className="space-y-6">
        <Dashboard />
      </div>
    </div>
  );
}