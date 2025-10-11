import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false, // important for flexible height
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Monthly Bookings" },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

type MonthlyBookingChartPropsType = {
  bookingDetails: { _id: { month: number }; count: number }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthlyBookingChart = ({ bookingDetails }: MonthlyBookingChartPropsType) => {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "Bookings",
        data: MONTHS.map((_, i) =>
          bookingDetails.find((b) => b._id.month === i + 1)?.count || 0
        ),
        backgroundColor: "#4ade80",
        borderRadius: 6,
      },
    ],
  };

  return (
    // 🧩 This div acts like <ResponsiveContainer> from Recharts
    <div className="relative w-full" style={{ height: "300px", minHeight: "250px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyBookingChart;
