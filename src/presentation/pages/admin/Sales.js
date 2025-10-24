import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "../../../services/AdminService";
import { HttpStatusCode } from "../../../shared/constants/constants";
import { calculateGrowth } from "../../../utils/helpers/helper";
import RevanueChart from "../../components/common/Sales/RevanueChart";
import GrowthGauge from "../../components/common/Sales/GrowthGauge";
import StatsCard from "../../components/common/Dashboard/StatsCard";
const Sales = () => {
    const [salesData, setSalesData] = useState();
    const [value, setValue] = useState({ growth: 0, currentTotalSales: 0, previousTotalSales: 0 });
    const currentYear = new Date().getFullYear();
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await adminService.salesData();
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setSalesData(response.data);
                    setValue(calculateGrowth(response.data));
                }
            }
            catch (error) {
                console.error("Failed to fetch sales data:", error);
            }
        };
        fetchSalesData();
    }, []);
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
    return (_jsxs("div", { className: "flex flex-col gap-8 w-full pr-4", children: [_jsx("div", { className: "bg-white rounded-2xl shadow  h-[400px]", children: salesData && _jsx(RevanueChart, { salesDetails: salesData }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center", children: [_jsx("div", { className: "flex justify-center", children: _jsx(GrowthGauge, { value: value?.growth }) }), _jsxs("div", { className: "", children: [_jsx("h3", { className: "font-bold text-center p-5  ", children: "Sales Stats" }), _jsx(StatsCard, { stats: stats, cols: { base: 1, md: 2, xl: 2 } })] })] })] }));
};
export default Sales;
