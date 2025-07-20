"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { Booking } from "../../../shared/types/global";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants/localStoragekeys";
import { userService } from "../../../services/UserService";
import ReusableTable from "../../components/ReusableComponents/ReusableTable";
import Pagination from "../../components/common/Pagination";
import RejectionModal from "../../components/ReusableComponents/RejectionModal";

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
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState<Booking[]>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useLocalStorage(
    LOCAL_STORAGE_KEYS.MY_BOOKING_PAGE,
    1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>();

  useEffect(() => {
    if (!user) return;

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await userService.getBookedActivity(
          user?._id,
          page,
          9
        );
        if (response.status === 200) {
          console.log(response, user._id);
          setData(response.data.bookings);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
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

  const cancelBooking = async (message: string) => {
    if (!selectedBooking) return;
    console.log(message);
    try {
      const response = await userService.cancelBooking(
        selectedBooking,
        message
      );
      if (response.status === 200) {
        toast.success("Booking cancellation requested");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {data && (
          <>
            <ReusableTable
              data={data}
              columns={columns}
              columnHeaders={columnHeaders}
              title="My Bookings"
              renderCell={(col, row) => {
                if (col === "index") return data.indexOf(row) + 1;
                if (col === "date") {
                  return new Date(row.date).toLocaleDateString();
                }
                if (col === "paymentStatus") {
                  return (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : row.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {String(row.paymentStatus).charAt(0).toUpperCase() +
                        String(row.paymentStatus).slice(1)}
                    </span>
                  );
                }
                if (col === "actions") {
                  const now = new Date();
                  const bookingDate = new Date(row.date);
                  const timeDiff = bookingDate.getTime() - now.getTime();
                  const daysUntilBooking = timeDiff / (1000 * 60 * 60 * 24);
                  const isDisabled = row.isCancelled || daysUntilBooking < 1;

                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedBooking(row);
                        setIsOpen(true);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isDisabled
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      }`}
                    >
                      {row.isCancelled ? "Cancelled" : "Cancel"}
                    </motion.button>
                  );
                }

                return String(row[col as keyof Booking]);
              }}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </>
        )}

        {data && data.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-gray-500">
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-sm mt-2">You haven't made any bookings yet.</p>
            </div>
          </motion.div>
        )}
      </div>
      <RejectionModal
        isOpen={isOpen}
        onclose={() => setIsOpen(false)}
        onConfirm={(message) => cancelBooking(message)}
      />
    </motion.div>
  );
};

export default MyBookings;
