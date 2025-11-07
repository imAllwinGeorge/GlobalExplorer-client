"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../../ui/button"

interface MonthCalendarProps {
  onMonthChange: (startDate: Date, endDate: Date) => void
}

export function MonthCalendar({ onMonthChange }: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

//   const monthStart = startOfMonth(currentMonth)
//   const monthEnd = endOfMonth(currentMonth)

  // Notify parent of month change
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth)
    const start = startOfMonth(newMonth)
    const end = endOfMonth(newMonth)
    onMonthChange(start, end)
  }

  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1)
    handleMonthChange(newMonth)
  }

  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1)
    handleMonthChange(newMonth)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="outline" size="sm" onClick={prevMonth}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
      <Button variant="outline" size="sm" onClick={nextMonth}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
