import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: { from: Date | undefined; to: Date | undefined }
  onDateChange?: (date: { from: Date | undefined; to: Date | undefined }) => void
}

export function DateRangePicker({ date, onDateChange }: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>(date || { from: undefined, to: undefined })

  React.useEffect(() => {
    if (date) {
      setDateRange(date)
    }
  }, [date])

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      const updatedRange = {
        from: range.from ?? undefined,
        to: range.to ?? undefined,
      }
      setDateRange(updatedRange)
      onDateChange?.(updatedRange)
    } else {
      // Handle clearing the selection
      const clearedRange = { from: undefined, to: undefined }
      setDateRange(clearedRange)
      onDateChange?.(clearedRange)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mr-2 overflow-hidden bg-white" align="start">
        <div className="bg-white">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
            className="bg-white"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

