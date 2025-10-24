"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { HttpStatusCode, LOCAL_STORAGE_KEYS } from "../../../shared/constants/constants";
import { userService } from "../../../services/UserService";
import ReusableTable from "../../components/sharedElements/SharedTable";
import Pagination from "../../components/common/Pagination";
import RejectionModal from "../../components/sharedElements/RejectionModal";
const columns = [
    "index",
    "activityTitle",
    "participantCount",
    "date",
    "paymentStatus",
    "actions",
];
const columnHeaders = {
    index: "#",
    activityTitle: "Activity Name",
    participantCount: "Booking For",
    date: "Date",
    paymentStatus: "Payment Status",
    actions: "Actions",
};
const MyBookings = () => {
    const user = useSelector((state) => state.auth.user);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useLocalStorage(LOCAL_STORAGE_KEYS.MY_BOOKING_PAGE, 1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState();
    useEffect(() => {
        if (!user)
            return;
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                const response = await userService.getBookedActivity(user?._id, page, 9);
                if (response.status === HttpStatusCode.OK) {
                    console.log(response, user._id);
                    setData(response.data.bookings);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchBookingDetails();
    }, [user, page]);
    useEffect(() => {
        return () => {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.MY_BOOKING_PAGE);
        };
    }, []);
    // const handleCancelBooking = async (bookingId: string) => {
    //   // Add your cancel booking logic here
    //   console.log("Cancel booking:", bookingId);
    //   setIsOpen(true);
    // };
    const cancelBooking = async (message) => {
        if (!selectedBooking)
            return;
        console.log(message);
        try {
            const response = await userService.cancelBooking(selectedBooking, message);
            if (response.status === HttpStatusCode.OK) {
                toast.success("Booking cancellation requested");
            }
        }
        catch (error) {
            console.log("cancel booking error : ", error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-4 md:p-6", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-48 mb-6" }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsx("div", { className: "space-y-4", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "h-12 bg-gray-100 rounded" }, i))) }) })] }) }) }));
    }
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "min-h-screen bg-gray-50 p-4 md:p-6", children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h3", { className: "text-2xl font-bold text-amber-700 mb-6 pl-3", children: "My Bookings" }), data && (_jsxs(_Fragment, { children: [_jsx(ReusableTable, { data: data, columns: columns, columnHeaders: columnHeaders, title: "", renderCell: (col, row) => {
                                    if (col === "index")
                                        return data.indexOf(row) + 1;
                                    if (col === "date") {
                                        return new Date(row.date).toLocaleDateString();
                                    }
                                    if (col === "paymentStatus") {
                                        return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${row.paymentStatus === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : row.paymentStatus === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"}`, children: String(row.paymentStatus).charAt(0).toUpperCase() +
                                                String(row.paymentStatus).slice(1) }));
                                    }
                                    if (col === "actions") {
                                        const now = new Date();
                                        const bookingDate = new Date(row.date);
                                        const timeDiff = bookingDate.getTime() - now.getTime();
                                        const daysUntilBooking = timeDiff / (1000 * 60 * 60 * 24);
                                        const isDisabled = row.isCancelled || daysUntilBooking < 1;
                                        return (_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, disabled: isDisabled, onClick: () => {
                                                setSelectedBooking(row);
                                                setIsOpen(true);
                                            }, className: `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isDisabled
                                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                : "bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"}`, children: row.isCancelled ? "Cancelled" : "Cancel" }));
                                    }
                                    return String(row[col]);
                                } }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] })), data && data.length === 0 && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200", children: _jsxs("div", { className: "text-gray-500", children: [_jsx("p", { className: "text-lg font-medium", children: "No bookings found" }), _jsx("p", { className: "text-sm mt-2", children: "You haven't made any bookings yet." })] }) }))] }), _jsx(RejectionModal, { isOpen: isOpen, onclose: () => setIsOpen(false), onConfirm: (message) => cancelBooking(message) })] }));
};
export default MyBookings;
