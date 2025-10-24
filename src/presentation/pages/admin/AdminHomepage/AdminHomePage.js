import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookUser, CalendarArrowUp, CalendarCheck, CookingPot, UserCog, Users, } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../../services/AdminService";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import StatsCard from "../../../components/common/Dashboard/StatsCard";
import MonthlyBookingChart from "../../../components/common/Dashboard/MonthlyBookingChart";
import TopSellingActivities from "../../../components/common/Dashboard/TopSellingActivities";
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const AdminHomePage = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);
    const [lebels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [hostCount, setHostCount] = useState(0);
    const [totalBooking, setTotalBooking] = useState(0);
    const [cancelledBooking, setCancelledBooking] = useState(0);
    const [upCommingBooking, setUpCommingBooking] = useState(0);
    const [completed, setCompletedBooking] = useState(0);
    const [dashboardData, setDashboardData] = useState();
    const [monthlyBookings, setMonthlyBookings] = useState();
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
            try {
                const response = await adminService.dashboardData();
                if (response.status === HttpStatusCode.OK) {
                    console.log(response);
                    const dashboardData = response.data.dashboardData;
                    setDashboardData(dashboardData);
                    setLabels(dashboardData.map((prod) => prod.activity.activityName));
                    setData(dashboardData.map((prod) => prod.count));
                    setUsersCount(response.data.userCount);
                    setHostCount(response.data.hostCount);
                    setTotalBooking(response.data.bookingCount);
                    setCancelledBooking(response.data.cancelledBooking);
                    setUpCommingBooking(response.data.upCommingBooking);
                    setCompletedBooking(response.data.completedBooking);
                    setMonthlyBookings(response.data.monthlyBookings);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchDashboardData();
    }, []);
    const stats = [
        {
            title: "Total Users",
            value: usersCount,
            icon: Users,
            progress: "75%",
            bg: "bg-blue-100",
            gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
        },
        {
            title: "Total Hosts",
            value: hostCount,
            icon: UserCog,
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
    return (_jsxs("div", { className: "p-6 text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "DASHBOARD" }), _jsx(StatsCard, { stats: stats, cols: { base: 1, md: 2, xl: 2 } }), _jsxs("div", { className: "bg-green-100 p-6 rounded-xl flex flex-col gap-6", children: [_jsx(BookUser, { className: "text-green-500" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-600 text-sm", children: "Total Bookings" }), _jsx("p", { className: "font-bold text-lg", children: totalBooking })] }), _jsx(StatsCard, { stats: bookingStats, cols: { base: 1, md: 2, xl: 3 } }), monthlyBookings && _jsx(MonthlyBookingChart, { bookingDetails: monthlyBookings })] }), _jsx("div", { children: _jsxs("div", { children: [_jsx("h3", { className: "font-bold p-4", children: "Top Selling products of the month" }), dashboardData && _jsx(TopSellingActivities, { topSellingProducts: dashboardData })] }) }), _jsxs("div", { className: "bg-white p-6 rounded shadow", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Top 5 Booked Products (This Month)" }), chartData && _jsx(Line, { ref: chartRef, data: chartData })] })] }));
};
export default AdminHomePage;
