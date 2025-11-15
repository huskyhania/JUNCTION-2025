import { useState, useEffect } from "react"
import { Lightbulb, TrendingUp, AlertCircle, Target, Sparkles, Loader2 } from "lucide-react"
import { paymentsData } from "./payments-data"

interface Insight {
  id?: string
  type: "tip" | "warning" | "achievement" | "opportunity"
  title: string
  description: string
  priority?: number
  icon?: any
  color?: string
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const iconMap = {
  tip: Lightbulb,
  warning: AlertCircle,
  achievement: Target,
  opportunity: TrendingUp,
}

const colorMap = {
  tip: "bg-yellow-100 text-yellow-700 border-yellow-500",
  warning: "bg-orange-100 text-orange-700 border-orange-500",
  achievement: "bg-green-100 text-green-700 border-green-500",
  opportunity: "bg-blue-100 text-blue-700 border-blue-500",
}

export default function Insight() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [featuredInsight, setFeaturedInsight] = useState<Insight | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/api/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactions: paymentsData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch insights")
      }

      const data = await response.json()
      
      // Process insights and add icons/colors
      const processedInsights = (data.insights || []).map((insight: Insight, index: number) => ({
        ...insight,
        id: insight.id || `insight-${index}`,
        icon: iconMap[insight.type] || Sparkles,
        color: colorMap[insight.type] || "bg-gray-100 text-gray-700 border-gray-500",
      }))

      // Sort by priority (lower number = higher priority)
      processedInsights.sort((a: Insight, b: Insight) => (a.priority || 5) - (b.priority || 5))

      setInsights(processedInsights)
      
      // Set featured insight (highest priority or first opportunity/achievement)
      const featured = processedInsights.find(
        (i: Insight) => i.type === "opportunity" || i.type === "achievement"
      ) || processedInsights[0] || null
      setFeaturedInsight(featured)
      
      setAnalysis(data.analysis)
    } catch (err) {
      console.error("Error fetching insights:", err)
      setError(err instanceof Error ? err.message : "Failed to load insights")
      // Fallback to empty state
      setInsights([])
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">AI Insights</h1>
          <p className="text-muted-foreground">
            Personalized financial insights and recommendations powered by AI
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing your financial data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">AI Insights</h1>
          <p className="text-muted-foreground">
            Personalized financial insights and recommendations powered by AI
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchInsights}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const calculatePotentialSavings = () => {
    if (!analysis) return 0
    // Estimate potential savings based on insights
    const savingsInsights = insights.filter(i => i.type === "opportunity" || i.type === "tip")
    return savingsInsights.length * 50 // Rough estimate
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">AI Insights</h1>
          <p className="text-muted-foreground">
            Personalized financial insights and recommendations powered by AI
          </p>
        </div>
        <button
          onClick={fetchInsights}
          className="text-sm text-blue-600 hover:underline"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* Featured Insight */}
      {featuredInsight && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {featuredInsight.icon && (
                <featuredInsight.icon className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-200 text-blue-700 text-xs rounded-full">
                  Featured
                </span>
                <h2 className="text-xl font-semibold text-foreground">{featuredInsight.title}</h2>
              </div>
              <p className="text-muted-foreground mb-4">{featuredInsight.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Insights Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Insights</h2>
        {insights.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-muted-foreground">No insights available at this time.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {insights.map((insight) => {
              const Icon = insight.icon || Sparkles
              return (
                <div
                  key={insight.id}
                  className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${insight.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${insight.color?.split(' ')[0] || 'bg-gray-100'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Active Insights</div>
            <div className="text-2xl font-bold text-foreground">{insights.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Net Balance</div>
            <div className={`text-2xl font-bold ${analysis.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{analysis.netBalance.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
            <div className="text-2xl font-bold text-blue-600">{analysis.totalTransactions}</div>
          </div>
        </div>
      )}
    </div>
  )
}
