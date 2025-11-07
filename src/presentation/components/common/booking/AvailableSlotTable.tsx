"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { AlertCircle, Loader2 } from "lucide-react";
import { MonthCalendar } from "./MonthCalendar";
import type { ActivityData } from "@/shared/types/global";

interface ActivitySlotDetailsProps {
  data?: ActivityData[];
  isLoading?: boolean;
  error?: string | null;
}

export default function ActivitySlotsTable({
  data = [],
  isLoading = false,
  error = null,
}: ActivitySlotDetailsProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateArray, setDateArray] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const dates = eachDayOfInterval({ start, end });
    setDateArray(dates);
  }, [currentMonth]);

  const handleMonthChange = (start: Date) => {
    setCurrentMonth(start);
  };

  const getSlotData = (activityId: string, dateStr: string) => {
    const activity = data.find((a) => a.activityId === activityId);
    if (!activity) return null;

    const slot = activity.availability.find((s) => s.date === dateStr);
    return slot || null;
  };

  const getSlotStatus = (slot: {
    date: string;
    availableSeats: number;
    // totalSeats: number;
    // bookedSeats: number;
} | undefined | null) => {
    if (!slot) return "no-data";
    if (slot.availableSeats === 0) return "full";
    if (slot.availableSeats < 3) return "limited";
    return "available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "limited":
        return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
      case "full":
        return "bg-red-50 border-red-200";
      case "no-data":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Slots</h2>
          <p className="text-sm text-gray-600 mt-1">
            View available slots for all your activities
          </p>
        </div>
      </div>

      <Card className="p-6">
        {/* Month Selector */}
        <MonthCalendar onMonthChange={handleMonthChange} />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading availability data...</span>
          </div>
        ) : data.length === 0 ? (
          // No Data
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No activities found</p>
          </div>
        ) : (
          // Table
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 min-w-[200px]">
                    Activity Name
                  </th>
                  {dateArray.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isTodayDate = isToday(date);
                    return (
                      <th
                        key={dateStr}
                        className={`border border-gray-300 px-2 py-3 text-center text-sm font-semibold min-w-[80px] ${
                          isTodayDate
                            ? "bg-blue-100 text-blue-900"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div>{format(date, "EEE")}</div>
                        <div className="text-xs font-normal">{format(date, "d")}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {data.map((activity) => (
                  <tr key={activity.activityId} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white border border-gray-300 px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {activity.activityName}
                    </td>
                    {dateArray.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const slot = getSlotData(activity.activityId, dateStr);
                      const status = getSlotStatus(slot);
                      const statusColor = getStatusColor(status);

                      return (
                        <td
                          key={`${activity.activityId}-${dateStr}`}
                          className={`border border-gray-300 px-2 py-3 text-center text-sm cursor-pointer transition-colors ${statusColor}`}
                        >
                          {slot ? (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">
                                {slot.availableSeats}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-700">Limited (&lt;3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-700">Full</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">No Data</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
