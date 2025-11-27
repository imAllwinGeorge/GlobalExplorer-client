"use client"

import type { DateFilterType, SalesFilters } from "@/shared/types/global"
import { useState } from "react"

interface SalesFilterProps {
  onFilterChange: (filters: SalesFilters) => void
  isLoading?: boolean
}

export default function SalesFilter({ onFilterChange, isLoading = false }: SalesFilterProps) {
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>("all")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [showDateRange, setShowDateRange] = useState(false)
  const [showPriceRange, setShowPriceRange] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const handleDateFilterChange = (type: DateFilterType) => {
    setDateFilterType(type)
    setShowDateRange(type === "range")
    applyFilters(type, fromDate, toDate, minPrice, maxPrice)
  }

  const handlePriceChange = () => {
    applyFilters(dateFilterType, fromDate, toDate, minPrice, maxPrice)
  }

  

  const applyFilters = (
    type: DateFilterType,
    from: string,
    to: string,
    min: string,
    max: string,
  ) => {
    const filters: SalesFilters = {
      dateFilterType: type,
      fromDate: from || undefined,
      toDate: to || undefined,
      minPrice: min ? Number.parseFloat(min) : undefined,
      maxPrice: max ? Number.parseFloat(max) : undefined,
    }
    onFilterChange(filters)
  }

  const handleDateRangeApply = () => {
    applyFilters("range", fromDate, toDate, minPrice, maxPrice, )
  }

  const handleClearFilters = () => {
    setDateFilterType("all")
    setFromDate("")
    setToDate("")
    setMinPrice("")
    setMaxPrice("")
    setShowDateRange(false)
    setShowPriceRange(false)
    applyFilters("all", "", "", "", "")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      <div>
        {/* Date Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {[
              { label: "All", value: "all" as DateFilterType },
              { label: "Today", value: "today" as DateFilterType },
              { label: "Yesterday", value: "yesterday" as DateFilterType },
              { label: "This Week", value: "week" as DateFilterType },
              { label: "This Month", value: "month" as DateFilterType },
              { label: "This Year", value: "year" as DateFilterType },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleDateFilterChange(option.value)
                  setShowDateRange(false)
                }}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  dateFilterType === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range */}
          <button
            onClick={() => {
              setDateFilterType("range")
              setShowDateRange(!showDateRange)
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              dateFilterType === "range" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } disabled:opacity-50`}
          >
            Custom Range
          </button>

          {showDateRange && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    max={today}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate}
                    max={today}
                    disabled={isLoading || !fromDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>
              <button
                onClick={handleDateRangeApply}
                disabled={isLoading || !fromDate || !toDate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Apply Date Range
              </button>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Price Range</h3>
            <button
              onClick={() => setShowPriceRange(!showPriceRange)}
              className="text-sm text-blue-600 hover:text-blue-700"
              disabled={isLoading}
            >
              {showPriceRange ? "Hide" : "Show"}
            </button>
          </div>

          {showPriceRange && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    placeholder="₹0"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={handlePriceChange}
                    placeholder="₹999999"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </div>
  )
}
