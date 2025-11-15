import MonthSummary from "./month_summary";
import Last30DaysChart from "./last30days";
import { SavingsGoals } from "@/components/savings-goals";
import { FinancialHealthScore } from "@/components/financial-health-score";
import { QuickStats } from "@/components/quick-stats";
import { TrendIndicators } from "@/components/trend-indicators";
import { GoalBar } from "@/components/goal-bar";

//three exemplary widgets for demo of dashboard
export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* First Row - Full Width */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        <div className="flex flex-col gap-6 flex-1">
          <MonthSummary />
          <QuickStats />
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <Last30DaysChart />
          <div className="pt-4">
            <GoalBar current={3200} goal={5000} />
          </div>
        </div>
      </div>
      
      {/* Third Row - Equal Height Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-full">
          <TrendIndicators />
        </div>
        <div className="h-full">
          <SavingsGoals />
        </div>
        <div className="h-full">
          <FinancialHealthScore />
        </div>
      </div>
    </div>
  );
}

//<SpendingCategories />
//<UpcomingPayments />
