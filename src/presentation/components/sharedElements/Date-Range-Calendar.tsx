"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "../ui/button"

interface SharedCalendarDatePickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onClose?: () => void
  recurrenceDays?: string[]
  title?: string
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  onClose,
  recurrenceDays = [],
  title = "Select Date",
}: SharedCalendarDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth()))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = getDay(monthStart)
  const emptyCells = Array.from({ length: startDay }, (_, i) => i)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const isActivityDay = (date: Date) => {
    const dayName = format(date, "EEEE")
    return recurrenceDays.some((day) => day.toLowerCase() === dayName.toLowerCase())
  }

  const handleDateClick = (date: Date) => {
    onDateSelect(date)
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h4 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h4>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-16 border-r border-b last:border-r-0"></div>
          ))}

          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd")
            const isSelected = isSameDay(date, selectedDate)
            const isToday = isSameDay(date, new Date())
            const hasActivity = isActivityDay(date)

            return (
              <div
                key={dateStr}
                className={`
                  h-16 border-r border-b last:border-r-0 p-1 cursor-pointer transition-colors relative
                  ${isSelected ? "bg-blue-500 text-white" : ""}
                  ${!isSelected && hasActivity ? "bg-blue-50 hover:bg-blue-100" : ""}
                  ${!isSelected && !hasActivity ? "hover:bg-gray-50" : ""}
                  ${isToday && !isSelected ? "ring-2 ring-blue-300" : ""}
                `}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span
                    className={`text-sm font-medium ${
                      isSelected
                        ? "text-white"
                        : isToday
                          ? "text-blue-600 font-semibold"
                          : hasActivity
                            ? "text-blue-700 font-semibold"
                            : ""
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                  {hasActivity && <span className="text-xs text-blue-600 font-medium">Activity</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-50 border-2 border-blue-300"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-50 border border-blue-400"></div>
          <span>Activity Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  )
}
