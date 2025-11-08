import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Booking, SalesData } from "../../../shared/types/global";
import { hostService } from "../../../services/HostService";
import { HttpStatusCode } from "../../../shared/constants/constants";
import { calculateGrowth } from "../../../utils/helpers/helper";
import RevanueChart from "../../components/common/Sales/RevanueChart";
import GrowthGauge from "../../components/common/Sales/GrowthGauge";
import StatsCard from "../../components/common/Dashboard/StatsCard";
import SalesReportPage from "@/presentation/components/sales/Sales.report";

const SalesPage = () => {
  const host = useSelector((state: RootState) => state.host.host);
  const [salesData, setSalesData] = useState<SalesData>();
  const [bookings, setBookings] = useState<Booking[]>();
  const [value, setValue] = useState<{
    growth: number;
    currentTotalSales: number;
    previousTotalSales: number;
  }>({ growth: 0, currentTotalSales: 0, previousTotalSales: 0 });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        if (!host) return;
        const response = await hostService.salesData(host._id);
        console.log(response);
        if (response.status === HttpStatusCode.OK) {
          setSalesData(response.data as SalesData);
          setValue(calculateGrowth(response.data as SalesData));
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      }
    };

    fetchSalesData();
  }, [host]);

  const stats = [
    {
      title: currentYear.toString(),
      value: value.currentTotalSales,
      icon: Users,
      progress: "75%",
      bg: "bg-blue-100",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
    {
      title: (currentYear - 1).toString(),
      value: value.previousTotalSales,
      icon: Users,
      progress: "75%",
      bg: "bg-blue-100",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
    },
  ];
  return (
    <div className="flex flex-col gap-8 w-full pr-4">
      {/* --- Chart Section --- */}
      <div className="bg-white rounded-2xl shadow  h-[400px]">
        {salesData && <RevanueChart salesDetails={salesData} />}
      </div>

      {/* --- Stats & Growth Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center">
          <GrowthGauge value={value?.growth} />
        </div>
        <div className="">
          <h3 className="font-bold text-center p-5  ">Sales Stats</h3>
          <StatsCard stats={stats} cols={{ base: 1, md: 2, xl: 2 }} />
        </div>
      </div>

      {bookings && <SalesReportPage bookings={bookings} />}
    </div>
  );
};

export default SalesPage;
