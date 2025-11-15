import Masonry from "react-masonry-css";
import MonthSummary from "./month_summary";
import Last30DaysChart from "./last30days";

const breakpointColumns = {
  default: 2,
  1100: 2,
  700: 1
};


//three exemplary widgets for demo of dashboard
export default function Dashboard() {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-6"
      columnClassName="bg-transparent space-y-6"
    >
      <MonthSummary />
      <Last30DaysChart /> 
    </Masonry>
  );
}

//<SpendingCategories />
//<UpcomingPayments />
