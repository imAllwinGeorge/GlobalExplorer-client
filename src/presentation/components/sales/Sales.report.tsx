import { useEffect, useMemo, useState } from "react";
import ReusableTable from "../sharedElements/SharedTable";
import { exportToExcel, type ColumnConfig } from "@/utils/helpers/excel";
import type {
  BookingWithUser,
  Booking,
  SalesFilters,
} from "@/shared/types/global";
import SalesFilter from "./Sales-Filter";
import toast from "react-hot-toast";
import { hostService } from "@/services/HostService";
import { HttpStatusCode, ROLE } from "@/shared/constants/constants";
import { adminService } from "@/services/AdminService";
import Pagination from "../common/Pagination";

const columns: (keyof Booking | "totalRevenue")[] = [
  "activityTitle",
  "date",
  "participantCount",
  "pricePerParticipant",
  "paymentStatus",
  "totalRevenue",
];

const columnHeaders: Record<string, string> = {
  activityTitle: "Activity Name",
  date: "Date",
  participantCount: "Participants",
  pricePerParticipant: "Price per Person",
  paymentStatus: "Payment Status",
  totalRevenue: "Total Revenue",
};

type SalesReportPageProps = {
  role: string;
  hostId?: string;
  activityId?: string;
};

export default function SalesReportPage({ role, hostId, activityId }: SalesReportPageProps) {
  const [bookings, setBookings] = useState<BookingWithUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalpages] = useState(0);
  const [filters, setFilters] = useState<SalesFilters>({
    dateFilterType: "all",
  });

  const metrics = useMemo(() => {
    const totalRevenue = bookings.reduce(
      (sum, booking) =>
        sum + booking.participantCount * booking.pricePerParticipant,
      0
    );
    const totalBookings = bookings.length;
    const totalParticipants = bookings.reduce(
      (sum, booking) => sum + booking.participantCount,
      0
    );
    const paidBookings = bookings.filter(
      (b) => b.paymentStatus === "paid"
    ).length;

    return { totalRevenue, totalBookings, totalParticipants, paidBookings };
  }, [bookings]);

  const handleExportExcel = async () => {
    const exportData = bookings.map((booking) => ({
      "Activity Name": booking.activityTitle,
      Date: new Date(booking.date).toLocaleDateString(),
      Participants: booking.participantCount,
      "Price per Person": `₹${booking.pricePerParticipant.toFixed(2)}`,
      "Payment Status":
        booking.paymentStatus.charAt(0).toUpperCase() +
        booking.paymentStatus.slice(1),
      "Total Revenue": `₹${(
        booking.participantCount * booking.pricePerParticipant
      ).toFixed(2)}`,
    }));

    const filename = `GlobalExplorer-sales-report.xlsx`;
    await exportToExcel(
      exportData,
      Object.keys(exportData[0]).map((key) => ({
        key,
        label: key,
      })) as ColumnConfig<(typeof exportData)[0]>[],
      { filename, sheetName: `Sales Report` }
    );
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let response;

        if (!hostId && role === ROLE.ADMIN) {
          response = await adminService.filterBookings(filters, page, 6);
          console.log("sales admin",response);
          if (response.status === HttpStatusCode.OK) {
            setBookings(response.data.bookings as BookingWithUser[]);
            setTotalpages(response.data.totalPages as number);
          }
        } else if (activityId && role === ROLE.HOST) {
          response = await hostService.filterActivityBookings(activityId, filters, page, 6);
          console.log("sales host activity", response);
          if (response.status === HttpStatusCode.OK) {
            setBookings(response.data.bookings as BookingWithUser[]);
            setTotalpages(response.data.totalPages as number);
          }
        } else if (hostId && role === ROLE.HOST) {
          response = await hostService.filterBookings(hostId as string, filters, page, 6);
          console.log("sales host hostid", response);
          if (response.status === HttpStatusCode.OK) {
            setBookings(response.data.bookings as BookingWithUser[]);
            setTotalpages(response.data.totalPages as number);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    };

    fetchBookings();
  }, [hostId, activityId, filters, page, role]);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Report
          </h1>
          <p className="text-gray-600">
            Track and analyze your booking revenue and metrics
          </p>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`₹${metrics.totalRevenue.toFixed(2)}`}
            subtitle={`${filters.dateFilterType} period`}
          />
          <MetricCard
            title="Total Bookings"
            value={metrics.totalBookings}
            subtitle={`${metrics.paidBookings} paid`}
          />
          <MetricCard
            title="Total Participants"
            value={metrics.totalParticipants}
            subtitle={`${(
              metrics.totalParticipants / metrics.totalBookings || 0
            ).toFixed(1)} avg`}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${
              metrics.totalBookings > 0
                ? (
                    (metrics.paidBookings / metrics.totalBookings) *
                    100
                  ).toFixed(1)
                : 0
            }%`}
            subtitle="Payment completion"
          />
        </div>

        {/* Filter and Export */}
        <SalesFilter onFilterChange={(newFilters) => setFilters(newFilters)} />

        {/* Export Button */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={handleExportExcel}
            disabled={bookings.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <ReusableTable
            data={bookings}
            columns={columns}
            columnHeaders={columnHeaders}
            title="Sales Data"
            renderCell={(col, row) => {
              if (col === "date")
                return new Date(row.date).toLocaleDateString();
              if (col === "pricePerParticipant")
                return `₹${row.pricePerParticipant.toFixed(2)}`;
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
                    {row.paymentStatus.charAt(0).toUpperCase() +
                      row.paymentStatus.slice(1)}
                  </span>
                );
              }
              if (col === "totalRevenue") {
                return `₹${(
                  row.participantCount * row.pricePerParticipant
                ).toFixed(2)}`;
              }
              return String(row[col as keyof Booking]);
            }}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => {
              setPage((prev) => Math.min(prev + 1, totalPages));
            }}
          />
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
