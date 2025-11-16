import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { useTimeframe } from "@/context/timeframe-context"

const PRESETS = [
  { label: "Day", value: "day" as const },
  { label: "Week", value: "week" as const },
  { label: "Month", value: "month" as const },
  { label: "All", value: "all" as const },
]

export function TimeframeToolbar() {
  const { timeframe, setPreset, range, setCustomRange } = useTimeframe()
  const activeLabel = useMemo(() => {
    const preset = PRESETS.find((option) => option.value === timeframe.preset)
    if (preset) {
      return preset.label
    }
    if (timeframe.preset === "custom") {
      return "Custom"
    }
    return "All"
  }, [timeframe.preset])

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-200/70 bg-white px-6 py-4 shadow-sm">
      <div className="min-w-[120px] text-sm font-semibold text-slate-600">
        Time range: <span className="text-slate-900">{activeLabel}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.value}
            size="sm"
            variant={timeframe.preset === preset.value ? "default" : "outline"}
            onClick={() => setPreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DateRangePicker date={range} onDateChange={setCustomRange} />
      </div>
    </div>
  )
}
