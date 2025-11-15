import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts"
import { paymentsData } from "@/pages/payments-data"

const categoryColors: Record<string, string> = {
  Food: "#22c55e",
  Utilities: "#eab308",
  Housing: "#3b82f6",
  Transportation: "#8b5cf6",
  Shopping: "#ec4899",
  Health: "#f59e0b",
  Entertainment: "#ef4444",
  Income: "#10b981",
  Education: "#06b6d4",
  Travel: "#f97316",
}

// Custom Tooltip (same as before, still good!)
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-200 p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-foreground">{data.category}</p>
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">€{data.totalAmount.toFixed(2)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Transactions: <span className="font-medium text-foreground">{data.transactionCount}</span>
        </p>
      </div>
    )
  }
  return null
}

// Custom Label component to display category name and percentage
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, fill, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  
  // --- CONTROLS LINE POSITION & LENGTH ---
  const lineStartRadius = outerRadius * 1.05; // 1. Start of line (gap from slice)
  const lineElbowRadius = outerRadius * 1.2;  // 2. "Elbow" of the line
  const lineEndRadius = outerRadius * 1.3;    // 3. End of the horizontal line
  
  const x1 = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const y1 = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);
  const x2 = cx + lineElbowRadius * Math.cos(-midAngle * RADIAN);
  const y2 = cy + lineElbowRadius * Math.sin(-midAngle * RADIAN);
  const x3 = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const y3 = y2; // This keeps the end line horizontal
  
  const textAnchor = x3 > cx ? 'start' : 'end';
  const textX = x3 + (x3 > cx ? 1 : -1) * 8; // Padding for text
  const textY = y3;

  return (
    <g>
      {/* This is the radial line (slice to elbow) */}
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={fill}    // <-- EDIT COLOR HERE (e.g., "#999")
        strokeWidth={2} // <-- EDIT THICKNESS HERE (e.g., 1)
      />
      
      {/* This is the horizontal line (elbow to text area) */}
      <line 
        x1={x2} 
        y1={y2} 
        x2={x3} 
        y2={y3} 
        stroke={fill}    // <-- EDIT COLOR HERE
        strokeWidth={2} // <-- EDIT THICKNESS HERE
      />
      
      {/* Category Name Text */}
      <text
        x={textX}
        y={textY}
        fill="#333"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {`${name}`}
      </text>
      
      {/* Percentage Text */}
      <text
        x={textX}
        y={textY + 16} // Position percentage below the name
        fill="#666"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="11px"
      >
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

// Custom Shape for the "3D" effect
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  // Slightly displace the active slice to give a "popping out" effect
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  // Apply a shadow/depth effect by drawing a slightly offset darker slice
  const shadowOffset = 5; // How much the shadow is offset
  const shadowFill = `${fill}B0`; // Make shadow slightly transparent

  return (
    <g>
      {/* "Shadow" slice for 3D effect */}
      <Sector
        cx={cx + shadowOffset * cos}
        cy={cy + shadowOffset * sin}
        innerRadius={innerRadius}
        outerRadius={outerRadius + shadowOffset}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={shadowFill}
        opacity={0.6}
      />
      
      {/* The actual, "popped out" active slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5} // Slightly larger for pop-out effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function SpendingDonutChart() {
  const categoryMap = new Map<string, { total: number; count: number }>()

  paymentsData.forEach((payment) => {
    if (payment.category && payment.status !== "failed") {
      const current = categoryMap.get(payment.category) || { total: 0, count: 0 }
      categoryMap.set(payment.category, {
        total: current.total + Math.abs(payment.amount),
        count: current.count + 1,
      })
    }
  })

  const categoryEntries = Array.from(categoryMap.entries())

  if (categoryEntries.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Spending by Category</h2>
        <div className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">No spending data available</p>
        </div>
      </div>
    )
  }

  const chartData = categoryEntries
    .map(([category, data]) => ({
      category,
      name: category, // 'name' for label rendering
      totalAmount: data.total,
      transactionCount: data.count,
    }))
    .filter(entry => entry.category !== "Income")
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Spending by Category</h2>
      <div className="w-full h-[350px] sm:h-[600px] md:h-[650px] lg:h-[700px]"> {/* Increased height for labels */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            
            <Pie
              data={chartData}
              dataKey="totalAmount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%" // Slightly smaller outer radius to make space for labels
              paddingAngle={0}
              fill="#8884d8"
              label={renderCustomizedLabel} // Use custom label component
              labelLine={false} // Disable default label line
              activeShape={renderActiveShape} // Use custom active shape for 3D effect
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.category}`}
                  fill={categoryColors[entry.category] || "#808080"}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* <div className="mt-4 text-xs text-muted-foreground text-center">
        Slice size represents total spending amount
      </div> */}
    </div>
  )
}