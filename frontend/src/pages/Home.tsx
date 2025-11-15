import Dashboard from "./dashboard";
import { useUser } from "@/contexts/UserContext";
import { Coins, Award } from "lucide-react";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Yo 🤟🏻 {user?.name || "User"}, welcome!</h1>
            {user?.currentBadge && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                  {user.currentBadge}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-lg font-semibold text-foreground">
              {user?.coin?.toLocaleString() || 0} coins
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