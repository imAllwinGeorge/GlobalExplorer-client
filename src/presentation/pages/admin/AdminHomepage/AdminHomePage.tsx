import { BookUser, UserCog, Users } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../../services/AdminService";
import type { Dashboard } from "../../../../shared/types/global";

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
  labels: string[],
  datasets: {label: string,
    data: number[],
    fill: boolean,
    borderColor: string,
    backgroundColor: string,
    tension: number,
  }[],
}
const AdminHomePage = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState<ChartDataType| null>(null);
  const [lebels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [hostCount, setHostCount] = useState(0);
  const [totalBooking, setTotoalBooking] = useState(0);

  useEffect(() => {
    // Mock data for top 3 products
    const mockData = {
      labels: lebels,
      datasets: [
        {
          label: 'Bookings This Month',
          data: data,
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgb(59, 130, 246)',
          tension: 0.4,
        },
      ],
    };
    setChartData(mockData);
  }, [lebels, data])

  useEffect(() => {

    const fetchDashboardData = async () => {
      try {
        const response = await adminService.dashboardData();
        if(response.status === 200){
          console.log(response);
          const dashboardData = response.data.dashboardData as Dashboard[];
          setLabels(dashboardData.map((prod) => prod.activity.activityName));
          setData(dashboardData.map((prod) => prod.count));
          setUsersCount(response.data.userCount as number);
          setHostCount(response.data.hostCount as number);
          setTotoalBooking(response.data.bookingCount as number);
        }
      } catch (error) {
        console.log(error);
        if(error instanceof Error){
          toast.error(error.message)
        }
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">DASHBOARD</h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="flex items-center gap-4 bg-blue-100 p-4 rounded">
          <Users className="text-blue-500" />
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="font-bold text-lg">{usersCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-green-100 p-4 rounded">
          <BookUser className="text-green-500" />
          <div>
            <p className="text-gray-600 text-sm">Total Bookings</p>
            <p className="font-bold text-lg">{totalBooking}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-purple-100 p-4 rounded">
          <UserCog className="text-purple-500" />
          <div>
            <p className="text-gray-600 text-sm">Active Hosts</p>
            <p className="font-bold text-lg">{hostCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Top 5 Booked Products (This Month)</h2>
        {chartData && <Line ref={chartRef} data={chartData} />}
      </div>
    </div>
  );
};

export default AdminHomePage;
