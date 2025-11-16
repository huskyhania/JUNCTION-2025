import { type ReactNode, createContext, useContext, useMemo, useState } from "react"
import { endOfDay, startOfDay, subDays } from "date-fns"

export type TimeframePreset = "day" | "week" | "month" | "all" | "custom"

export type TimeframeRange = {
  from?: Date
  to?: Date
}

type TimeframeState = {
  preset: TimeframePreset
  customRange?: TimeframeRange
}

type TimeframeContextValue = {
  timeframe: TimeframeState
  range: TimeframeRange
  setPreset: (preset: Exclude<TimeframePreset, "custom">) => void
  setCustomRange: (range: TimeframeRange) => void
}

const PRESET_DAY_MAP: Record<Exclude<TimeframePreset, "all" | "custom">, number> = {
  day: 1,
  week: 7,
  month: 30,
}

const computeRange = (state: TimeframeState): TimeframeRange => {
  if (state.preset === "custom") {
    return state.customRange ?? {}
  }

  if (state.preset === "all") {
    return {}
  }

  const days = PRESET_DAY_MAP[state.preset]
  const to = endOfDay(new Date())
  const from = startOfDay(subDays(to, days - 1))

  return { from, to }
}

const TimeframeContext = createContext<TimeframeContextValue | undefined>(undefined)

export function TimeframeProvider({ children }: { children: ReactNode }) {
  const [timeframe, setTimeframe] = useState<TimeframeState>({ preset: "month" })

  const range = useMemo(() => computeRange(timeframe), [timeframe])

  const setPreset = (preset: Exclude<TimeframePreset, "custom">) => {
    setTimeframe({ preset })
  }

  const setCustomRange = (customRange: TimeframeRange) => {
    if (!customRange.from && !customRange.to) {
      setTimeframe({ preset: "all" })
      return
    }
    setTimeframe({ preset: "custom", customRange })
  }

  return (
    <TimeframeContext.Provider
      value={{
        timeframe,
        range,
        setPreset,
        setCustomRange,
      }}
    >
      {children}
    </TimeframeContext.Provider>
  )
}

export function useTimeframe() {
  const context = useContext(TimeframeContext)
  if (!context) {
    throw new Error("useTimeframe must be used within a TimeframeProvider")
  }
  return context
}
