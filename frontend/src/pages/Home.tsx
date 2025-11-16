import Dashboard from "./dashboard";
import { useUser } from "@/contexts/UserContext";
import { Coins, Award, Target } from "lucide-react";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Hi 🤟🏻 {user?.name || "User"}, welcome!</h1>
            {user?.currentBadge && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">
                  {user.currentBadge}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <Target className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="text-sm font-medium text-foreground">
              Save <span className="font-semibold text-blue-600">€70</span> this week to get{" "}
              <span className="inline-flex items-center gap-1">
                <Coins className="h-2.5 w-2.5 text-yellow-600" />
                <span className="font-semibold">10 coins</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <Dashboard />
      </div>
    </div>
  );
}