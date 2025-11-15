import Dashboard from "./dashboard";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { paymentsData } from "./payments-data";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Payments</h2>
        <DataTable columns={columns} data={paymentsData} />
      </div>
    </div>
  );
}