import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Trophy } from "lucide-react"

interface Scenario {
  title: string
  description: string
  options: string[]
  consequences: Record<string, { shortTerm: string; longTerm: string }>
  learningTip: string
}

export default function Game() {
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [result, setResult] = useState<any>(null)
  const [achievements, setAchievements] = useState<string[]>([])
  const [_loadingChoice, setLoadingChoice] = useState(false)

  const loadScenario = async () => {
    setLoading(true)
    setSelectedChoice(null)
    setResult(null)

    try {
      const res = await fetch("http://localhost:3000/api/game/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: {
            income: 2500,
            savings: 300,
            riskTolerance: "low"
          }
        })
      })

      const data = await res.json()
      setScenario(data.scenario)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadScenario()
  }, [])

  // 🔥 Handle option click
  const handleChoice = async (index: number) => {
    setSelectedChoice(index)
    setLoadingChoice(true)

    try {
      const res = await fetch("http://localhost:3000/api/game/choose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, choiceIndex: index })
      })

      const data = await res.json()
      setResult(data)
      setAchievements(data.unlocked || [])
    } catch (err) {
      console.error(err)
    }

    setLoadingChoice(false)
  }

  if (loading || !scenario) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-500" />{scenario.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Scenario Description */}
          <p className="text-gray-700 text-lg">{scenario.description}</p>

          {/* Options */}
          {!result && (
            <div className="space-y-3">
              {scenario.options.map((option, index) => (
                <div
                  onClick={() => handleChoice(index)}
                  className={`
                    w-full cursor-pointer rounded-md border p-4 text-left text-base
                    whitespace-normal break-words leading-relaxed
                    hover:bg-gray-100 transition
                    ${
                      selectedChoice === index
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }
                  `}
                >
                  {option}
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Consequences */}
              <div className="p-4 bg-gray-50 rounded-lg border break-words space-y-2 leading-relaxed">
                <h3 className="font-semibold text-lg mb-2">Consequences</h3>

                <p className="text-gray-700">
                  {result.consequences.shortTerm}
                </p>
              </div>

              {/* Learning Tip */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Learning Tip</h3>
                <p>{result.learningTip}</p>
              </div>

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Trophy className="text-green-600" /> Achievements Unlocked
                  </h3>
                  <ul className="list-disc list-inside">
                    {achievements.map((a, i) => (
                      <li key={i} className="font-medium">{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={loadScenario} className="w-full mt-4">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
