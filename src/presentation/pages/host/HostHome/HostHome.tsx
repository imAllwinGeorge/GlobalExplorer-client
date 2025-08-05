  import { BookUser, MountainSnow } from "lucide-react"
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
import type { Dashboard } from "../../../../shared/types/global";
import { hostService } from "../../../../services/HostService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

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


const HostHome = () => {
  const host = useSelector((state: RootState) => state.host.host);
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState<ChartDataType| null>(null);
  const [lebels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [activityCount, setActivityCount] = useState(0);
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
      if(!host) return
      try {
        const response = await hostService.dashboardData(host._id);
        if(response.status === 200){
          console.log(response);
          const dashboardData = response.data.dashboardData as Dashboard[];
          setLabels(dashboardData.map((prod) => prod.activity.activityName));
          setData(dashboardData.map((prod) => prod.count));
          setTotoalBooking(response.data.bookingCount as number);
          setActivityCount(response.data.activityCount as number)
        }
      } catch (error) {
        console.log(error);
        if(error instanceof Error){
          toast.error(error.message)
        }
      }
    }
    fetchDashboardData();
  }, [host]);
  return (
    <div>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">DASHBOARD</h1>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="flex items-center gap-4 bg-blue-100 p-4 rounded">
            <MountainSnow className="text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Listed Activity</p>
              <p className="font-bold text-lg">{activityCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-green-100 p-4 rounded">
            <BookUser className="text-green-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="font-bold text-lg">{totalBooking}</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-4 bg-purple-100 p-4 rounded">
            <UserCog className="text-purple-500" />
            <div>
              <p className="text-gray-600 text-sm">Active Hosts</p>
              <p className="font-bold text-lg">{hostCount}</p>
            </div>
          </div> */}
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
