// import type { SalesData } from "@/shared/types/global";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   Legend,
//   LinearScale,
//   Title,
//   Tooltip,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";


// const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const currentYear = new Date().getFullYear();

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
//   );

//   const options = {
//   responsive: true,
//   maintainAspectRatio: false, // important for flexible height
//   plugins: {
//     legend: { position: "top" as const },
//     title: { display: true, text: "Monthly Bookings" },
//   },
//   scales: {
//     y: { beginAtZero: true },
//   },
// };

// type RevanueChartPropsType = {
//     salesDetails: SalesData;
// }
// const RevanueChart = ({salesDetails}: RevanueChartPropsType) => {
//   console.log(salesDetails)
// const data = {
//     labels: MONTHS,
//     datasets: [
//       {
//         label: `${currentYear} sales`,
//         data: MONTHS.map((_, i) =>
//           salesDetails.current.find((b) => b._id.month === i + 1)?.totalSales || 0
//         ),
//         backgroundColor: "#4ade80",
//         borderRadius: 6,
//       },
//       {
//         label: `${currentYear - 1 } sales`,
//         data: MONTHS.map((_, i) =>
//           salesDetails.previous.find((b) => b._id.month === i + 1)?.totalSales || 0
//         ),
//         backgroundColor: "#red",
//         borderRadius: 6,
//       },
//     ],
//   };
  
//   return <div>
//     <Bar options={options} data={data} />
//   </div>;
// };

// export default RevanueChart;



import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { SalesData } from "../../../../shared/types/global";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#374151",
        usePointStyle: true,
        pointStyle: "circle",
        padding: 16,
      },
    },
    title: {
      display: true,
      text: "Year-over-Year Sales Comparison",
      color: "#111827",
      font: {
        size: 18,
        weight: "bold",
      },
      padding: { top: 10, bottom: 20 },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#e5e7eb" },
      ticks: {
        color: "#374151",
        callback: (value) => `${Math.abs(Number(value))}`, // remove minus sign
      },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#374151" },
    },
  },
};

type RevanueChartProps = {
  salesDetails: SalesData;
};

const RevanueChart = ({ salesDetails }: RevanueChartProps) => {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: `${currentYear} Sales`,
        data: MONTHS.map((_, i) =>
          salesDetails.current.find((b) => b._id.month === i + 1)?.totalSales || 0
        ),
        backgroundColor: "#4ade80", // green (up)
        borderRadius: 6,
      },
      {
        label: `${currentYear - 1} Sales`,
        data: MONTHS.map((_, i) =>
          -(salesDetails.previous.find((b) => b._id.month === i + 1)?.totalSales || 0)
        ), // make values negative
        backgroundColor: "#f87171", // red (down)
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="h-[400px] w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevanueChart;

