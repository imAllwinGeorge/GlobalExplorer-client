import {
  BookUser,
  CalendarArrowUp,
  CalendarCheck,
  CookingPot,
  MountainSnow,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { DashboardData } from "../../../../shared/types/global";
import { hostService } from "../../../../services/HostService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { HttpStatusCode } from "@/shared/constants/constants";
import TopSellingActivities from "@/presentation/components/common/Dashboard/TopSellingActivities";
import StatsCard from "@/presentation/components/common/Dashboard/StatsCard";
import MonthlyBookingChart from "@/presentation/components/common/Dashboard/MonthlyBookingChart";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
};

const HostHome = () => {
  const host = useSelector((state: RootState) => state.host.host);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [lebels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [activityCount, setActivityCount] = useState(0);
  const [totalBooking, setTotoalBooking] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardData[]>();
  const [upCommingBooking, setUpCommingBooking] = useState(0);
  const [completed, setCompletedBooking] = useState(0);
  const [cancelledBooking, setCancelledBooking] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState<{
              _id: { month: number };
              count: number;
            }[]>()

  useEffect(() => {
    // Mock data for top 3 products
    const mockData = {
      labels: lebels,
      datasets: [
        {
          label: "Bookings This Month",
          data: data,
          fill: false,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgb(59, 130, 246)",
          tension: 0.4,
        },
      ],
    };
    setChartData(mockData);
  }, [lebels, data]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!host) return;
      try {
        const response = await hostService.dashboardData(host._id);
        if (response.status === HttpStatusCode.OK) {
          console.log(response);
          const dashboardData = response.data.dashboardData as DashboardData[];
          setDashboardData(dashboardData);
          setLabels(dashboardData.map((prod) => prod.activity.activityName));
          setData(dashboardData.map((prod) => prod.count));
          setTotoalBooking(response.data.bookingCount as number);
          setActivityCount(response.data.activityCount as number);
          setUpCommingBooking(response.data.upCommingBooking as number);
          setCompletedBooking(response.data.completedBooking as number);
          setCancelledBooking(response.data.cancelledBooking as number);
          setMonthlyBookings(response.data.monthlyBookings)
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchDashboardData();
  }, [host]);

  const stats = [
    {
      title: "Listed Activities",
      value: activityCount,
      icon: MountainSnow,
      progress: "75%",
      bg: "bg-blue-100",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
    {
      title: "Total Bookings",
      value: totalBooking,
      icon: BookUser,
      progress: "63%",
      bg: "bg-purple-100",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
  ];

  const bookingStats = [
    {
      title: "Upcoming",
      value: upCommingBooking,
      icon: CalendarArrowUp,
      progress: `${((upCommingBooking / totalBooking) * 100).toFixed(2)}%`,
      bg: "bg-green-100",
      gradient: "bg-gradient-to-r from-green-500 to-lime-500",
    },
    {
      title: "Completed",
      value: completed,
      icon: CalendarCheck,
      progress: `${((completed / totalBooking) * 100).toFixed(2)}%`,
      bg: "bg-emerald-100",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      title: "Cancelled",
      value: cancelledBooking,
      icon: CookingPot,
      progress: `${((cancelledBooking / totalBooking) * 100).toFixed(2)}%`,
      bg: "bg-red-100",
      gradient: "bg-gradient-to-r from-red-500 to-orange-500",
    },
  ];
  return (
    <div>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">DASHBOARD</h1>

        <StatsCard stats={stats} cols={{ base: 1, md: 2, xl: 2 }} />

        <div>
          <h1>Activity Stats</h1>
          <StatsCard stats={bookingStats} cols={{ base: 1, md: 2, xl: 3 }} />
          {monthlyBookings && <MonthlyBookingChart bookingDetails={monthlyBookings} />}
        </div>

        <div>
          {dashboardData && (
            <TopSellingActivities topSellingProducts={dashboardData} />
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Top 5 Booked Products (This Month)
          </h2>
          {chartData && <Line ref={chartRef} data={chartData} />}
        </div>
      </div>
    </div>
  );
};

export default HostHome;
