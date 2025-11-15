import { useState, useEffect } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid } from "recharts"
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

export function SpendingBubbleChart() {
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScaleFactor(0.6) // Mobile - scale down to 60%
      } else if (width < 768) {
        setScaleFactor(0.75) // Small - scale down to 75%
      } else if (width < 1024) {
        setScaleFactor(0.85) // Medium - scale down to 85%
      } else {
        setScaleFactor(1) // Large - full size
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Aggregate spending by category
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

  // Convert to array and calculate positions
  const categoryEntries = Array.from(categoryMap.entries())
  
  // Handle empty data
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
  
  const maxAmount = Math.max(...categoryEntries.map(([, data]) => data.total))
  
  // Sort by amount first, then assign natural scattered positions
  const categories = categoryEntries
    .map(([category, data]) => {
      // Size based on amount (normalized to 80-300 range for bigger bubbles)
      const size = 80 + (data.total / maxAmount) * 220

      return {
        category,
        totalAmount: data.total,
        transactionCount: data.count,
        z: size, // z property controls bubble size in ScatterChart
      }
    })
    .sort((a, b) => b.totalAmount - a.totalAmount)

  // Create natural scattered positions (like the reference image)
  // Use a seeded approach for consistent but natural-looking distribution
  // Dimensions will scale with ResponsiveContainer
  const chartWidth = 600
  const chartHeight = 400
  
  // Simple hash function for consistent pseudo-random positioning
  const hash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Assign natural scattered positions
  const chartData = categories.map((cat, index) => {
    // Use category name as seed for consistent positioning
    const seed = hash(cat.category + index.toString())
    const seed2 = hash(cat.category + (index * 7).toString())
    
    // Generate position with some randomness but avoid edges
    const padding = 100 // Padding from edges
    const x = padding + (seed % (chartWidth - padding * 2))
    const y = padding + (seed2 % (chartHeight - padding * 2))
    
    return {
      ...cat,
      x,
      y,
    }
  })

  // Set fixed domain for consistent chart area
  const maxX = chartWidth
  const maxY = chartHeight

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

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Spending by Category</h2>
      <div className="w-full h-[400px] sm:h-[450px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 40,
              left: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[0, maxX]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickCount={6}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[0, maxY]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickCount={5}
            />
            <ZAxis type="number" dataKey="z" range={[60, 200]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              content={() => (
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  {chartData.map((item) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColors[item.category] || "#gray" }}
                      />
                      <span className="text-xs text-foreground">
                        {item.category} (€{item.totalAmount.toFixed(0)})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Scatter 
              name="Categories" 
              data={chartData} 
              fill="#8884d8" 
              shape={(props: any) => {
                const { cx, cy, payload } = props
                const color = categoryColors[payload.category] || "#808080"
                const hex = color.replace('#', '')
                const r = parseInt(hex.substring(0, 2), 16)
                const g = parseInt(hex.substring(2, 4), 16)
                const b = parseInt(hex.substring(4, 6), 16)
                const colorWithOpacity = `rgba(${r}, ${g}, ${b}, 0.6)`
                // Scale radius based on viewport - smaller on mobile
                const scaleFactor = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 1
                const radius = (payload.z / 2) * scaleFactor
                
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={colorWithOpacity}
                      stroke={color}
                      strokeWidth={2 * scaleFactor}
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={Math.max(8, Math.min(12, radius / 6)) * scaleFactor}
                      fill="#1f2937"
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      {payload.category}
                    </text>
                  </g>
                )
              }}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Bubble size represents total spending amount
      </div>
    </div>
  )
}

