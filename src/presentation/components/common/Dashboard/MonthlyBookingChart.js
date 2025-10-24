import { jsx as _jsx } from "react/jsx-runtime";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const options = {
    responsive: true,
    maintainAspectRatio: false, // important for flexible height
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Bookings" },
    },
    scales: {
        y: { beginAtZero: true },
    },
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MonthlyBookingChart = ({ bookingDetails }) => {
    const data = {
        labels: MONTHS,
        datasets: [
            {
                label: "Bookings",
                data: MONTHS.map((_, i) => bookingDetails.find((b) => b._id.month === i + 1)?.count || 0),
                backgroundColor: "#4ade80",
                borderRadius: 6,
            },
        ],
    };
    return (
    // 🧩 This div acts like <ResponsiveContainer> from Recharts
    _jsx("div", { className: "relative w-full", style: { height: "300px", minHeight: "250px" }, children: _jsx(Bar, { data: data, options: options }) }));
};
export default MonthlyBookingChart;
