export default function MonthSummary() {
    const summary = {
      income: 4200,
      spending: 2850.5,
      net: 4200 - 2850.5
    };
  
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Month Summary</h2>
  
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-xl font-bold text-green-600">€{summary.income}</p>
          </div>
  
          <div>
            <p className="text-sm text-gray-500">Spending</p>
            <p className="text-xl font-bold text-red-600">€{summary.spending}</p>
          </div>
  
          <div>
            <p className="text-sm text-gray-500">Net</p>
            <p className="text-xl font-bold">
              €{summary.net.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  }