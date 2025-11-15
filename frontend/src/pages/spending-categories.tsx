import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BudgetProgress } from "@/components/budget-progress";
import { SpendingDonutChart } from "@/components/spending-pie-chart";
import { Button } from "@/components/ui/button";

export default function SpendingCategories() {

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Spending Categories</h1>
        <p className="text-muted-foreground">Track your budget progress across different categories</p>
      </div>

      <SpendingDonutChart />
      
      <BudgetProgress />
      
      <div className="flex justify-center pt-4">
        <Link to="/transactions">
          <Button variant="outline" className="gap-2">
            Go to Transaction Feed
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

