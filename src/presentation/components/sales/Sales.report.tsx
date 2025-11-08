import { useMemo, useState } from "react"
import ReusableTable from "../sharedElements/SharedTable"
import { exportToExcel, type ColumnConfig } from "@/utils/helpers/excel"
import type { Booking } from "@/shared/types/global"

type FilterPeriod = "weekly" | "monthly" | "yearly" | "all"

const columns: (keyof Booking | "totalRevenue")[] = [
  "activityTitle",
  "date",
  "participantCount",
  "pricePerParticipant",
  "paymentStatus",
  "totalRevenue",
]

const columnHeaders: Record<string, string> = {
  activityTitle: "Activity Name",
  date: "Date",
  participantCount: "Participants",
  pricePerParticipant: "Price per Person",
  paymentStatus: "Payment Status",
  totalRevenue: "Total Revenue",
}

type SalesReportPageProps = {
    bookings: Booking[]
}

export default function SalesReportPage({bookings}: SalesReportPageProps) {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all")

  const filteredData = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date)

      switch (filterPeriod) {
        case "weekly": {
          const startOfWeek = new Date(startOfToday)
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(endOfWeek.getDate() + 6)
          return bookingDate >= startOfWeek && bookingDate <= endOfWeek
        }
        case "monthly":
          return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
        case "yearly":
          return bookingDate.getFullYear() === now.getFullYear()
        case "all":
        default:
          return true
      }
    })
  }, [filterPeriod, bookings])

  const metrics = useMemo(() => {
    const totalRevenue = filteredData.reduce(
      (sum, booking) => sum + booking.participantCount * booking.pricePerParticipant,
      0
    )
    const totalBookings = filteredData.length
    const totalParticipants = filteredData.reduce((sum, booking) => sum + booking.participantCount, 0)
    const paidBookings = filteredData.filter((b) => b.paymentStatus === "paid").length

    return { totalRevenue, totalBookings, totalParticipants, paidBookings }
  }, [filteredData])

  const handleExportExcel = async () => {
    const exportData = filteredData.map((booking) => ({
      "Activity Name": booking.activityTitle,
      Date: new Date(booking.date).toLocaleDateString(),
      Participants: booking.participantCount,
      "Price per Person": `₹${booking.pricePerParticipant.toFixed(2)}`,
      "Payment Status": booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1),
      "Total Revenue": `₹${(booking.participantCount * booking.pricePerParticipant).toFixed(2)}`,
    }))

    const filename = `sales-report-${filterPeriod}-${new Date().toISOString().split("T")[0]}.xlsx`
    await exportToExcel(
      exportData,
      Object.keys(exportData[0]).map((key) => ({ key, label: key })) as ColumnConfig<typeof exportData[0]>[],
      { filename, sheetName: `${filterPeriod.charAt(0).toUpperCase() + filterPeriod.slice(1)} Report` }
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Report</h1>
          <p className="text-gray-600">Track and analyze your booking revenue and metrics</p>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Total Revenue" value={`₹${metrics.totalRevenue.toFixed(2)}`} subtitle={`${filterPeriod} period`} />
          <MetricCard title="Total Bookings" value={metrics.totalBookings} subtitle={`${metrics.paidBookings} paid`} />
          <MetricCard
            title="Total Participants"
            value={metrics.totalParticipants}
            subtitle={`${(metrics.totalParticipants / metrics.totalBookings || 0).toFixed(1)} avg`}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.totalBookings > 0 ? ((metrics.paidBookings / metrics.totalBookings) * 100).toFixed(1) : 0}%`}
            subtitle="Payment completion"
          />
        </div>

        {/* Filter and Export */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Period</h2>
            <div className="flex flex-wrap gap-2">
              {["all", "weekly", "monthly", "yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setFilterPeriod(period as FilterPeriod)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterPeriod === period ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <ReusableTable
            data={filteredData}
            columns={columns}
            columnHeaders={columnHeaders}
            title="Sales Data"
            renderCell={(col, row) => {
              if (col === "date") return new Date(row.date).toLocaleDateString()
              if (col === "pricePerParticipant") return `₹${row.pricePerParticipant.toFixed(2)}`
              if (col === "paymentStatus") {
                return (
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : row.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.paymentStatus.charAt(0).toUpperCase() + row.paymentStatus.slice(1)}
                  </span>
                )
              }
              if (col === "totalRevenue") {
                return `₹${(row.participantCount * row.pricePerParticipant).toFixed(2)}`
              }
              return String(row[col as keyof Booking])
            }}
          />
        </div>
      </div>
    </main>
  )
}

function MetricCard({ title, value, subtitle }: { title: string; value: string | number; subtitle: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
    </div>
  )
}
