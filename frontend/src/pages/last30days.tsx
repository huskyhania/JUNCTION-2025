import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
  } from "recharts";

//hardcoded values from backend - should be replaced by a call to backend/database
export default function Last30DaysChart() {
    const data = [
        { day: "1",  deposits: 200, expenses: 120, balance: 1080 },
        { day: "2",  deposits: 0,   expenses: 60,  balance: 1020 },
        { day: "3",  deposits: 150, expenses: 20,  balance: 1150 },
        { day: "4",  deposits: 0,   expenses: 80,  balance: 1070 },
        { day: "5",  deposits: 0,   expenses: 40,  balance: 1030 },
        { day: "6",  deposits: 220, expenses: 0,   balance: 1250 },
        { day: "7",  deposits: 0,   expenses: 100, balance: 1150 },
        { day: "8",  deposits: 0,   expenses: 45,  balance: 1105 },
        { day: "9",  deposits: 90,  expenses: 0,   balance: 1195 },
        { day: "10", deposits: 0,   expenses: 70,  balance: 1125 },
        { day: "11", deposits: 0,   expenses: 55,  balance: 1070 },
        { day: "12", deposits: 300, expenses: 0,   balance: 1370 },
        { day: "13", deposits: 0,   expenses: 85,  balance: 1285 },
        { day: "14", deposits: 0,   expenses: 60,  balance: 1225 },
        { day: "15", deposits: 500, expenses: 0,   balance: 1725 },
        { day: "16", deposits: 0,   expenses: 150, balance: 1575 },
        { day: "17", deposits: 0,   expenses: 75,  balance: 1500 },
        { day: "18", deposits: 100, expenses: 40,  balance: 1560 },
        { day: "19", deposits: 0,   expenses: 65,  balance: 1495 },
        { day: "20", deposits: 0,   expenses: 110, balance: 1385 },
        { day: "21", deposits: 250, expenses: 0,   balance: 1635 },
        { day: "22", deposits: 0,   expenses: 95,  balance: 1540 },
        { day: "23", deposits: 0,   expenses: 40,  balance: 1500 },
        { day: "24", deposits: 0,   expenses: 70,  balance: 1430 },
        { day: "25", deposits: 180, expenses: 0,   balance: 1610 },
        { day: "26", deposits: 0,   expenses: 50,  balance: 1560 },
        { day: "27", deposits: 0,   expenses: 120, balance: 1440 },
        { day: "28", deposits: 100, expenses: 30,  balance: 1510 },
        { day: "29", deposits: 0,   expenses: 55,  balance: 1455 },
        { day: "30", deposits: 0,   expenses: 90,  balance: 1365 }
      ];

      return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Last 30 Days Cashflow</h2>
    
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
    
                <XAxis dataKey="day" />
                <YAxis />
    
                <Tooltip />
    
                {/* Expenses (red bars) */}
                <Bar dataKey="expenses" barSize={20} fill="#ef4444" radius={[4, 4, 0, 0]} />
    
                {/* Deposits (green bars) */}
                <Bar dataKey="deposits" barSize={20} fill="#22c55e" radius={[4, 4, 0, 0]} />
    
                {/* Balance (blue line) */}
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }