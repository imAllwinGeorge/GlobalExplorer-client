import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Loader from "@/presentation/components/mainComponents/Loader";
import { hostService } from "@/services/HostService";
import { HttpStatusCode } from "@/shared/constants/constants";
import type { Booking, BookingWithUser, User } from "@/shared/types/global";
import QRVerificationSuccessModal from "@/presentation/components/sharedElements/QRVerificationSuccesssModal";
import QRVerificationFailedModal from "@/presentation/components/sharedElements/QRVerificationFailedModal";
import ReusableTable from "@/presentation/components/sharedElements/SharedTable";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/presentation/store";
import Pagination from "@/presentation/components/common/Pagination";

const columns = [
  "index",
  "activityTitle",
  "userName",
  "participantCount",
  "date",
  "remark",
];

const columnHeaders = {
  index: "#",
  activityTitle: "Activity Name",
  userName: "User Name",
  participantCount: "Booking For",
  date: "Date",
  remark: "Remark",
};
export default function QRVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<Booking>();
  const [user, setUser] = useState<User>();
  const [isOpen, setIsOpen] = useState(false);
  const [openFailedModal, setOpenFailedModal] = useState(false);
  const [errormessage, setErrorMessage] = useState<string>();
  const [triggerQR, setTriggerQR] = useState(false);
  const [bookings, setBookings] = useState<BookingWithUser[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const host = useSelector((state: RootState) => state.host.host);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        verifyBooking(decodedText);
      },
      (errorMessage) => {
        // Suppress repetitive warnings
        if (!errorMessage.includes("No MultiFormat Readers")) {
          console.warn("QR Error:", errorMessage);
        }
      }
    );

    return () => {
      scanner.clear();
    };
  }, [triggerQR]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!host) return;
      try {
        const response = await hostService.getTodayBookings(host._id as string, page, 5);
        if (response.status === HttpStatusCode.OK) {
          console.log(response)
          setBookings(response.data.bookings as BookingWithUser[]);
          setTotalPages(response.data.totalPages as number)
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchBookings();
  }, [host, page]);

  const verifyBooking = async (token: string) => {
    try {
      const response = await hostService.verifyBooking(token);
      if (response.status === HttpStatusCode.OK) {
        setBooking(response.data.booking);
        setUser(response.data.user as User);
        setIsOpen(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setOpenFailedModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Scan Booking QR</h2>
      <div id="reader" className="w-full max-w-sm" />

      {bookings && (
        <ReusableTable
          data={bookings}
          columns={columns}
          columnHeaders={columnHeaders}
          title="Today's Bookings"
          renderCell={(col, row) => {
            if (col === "index") return bookings.indexOf(row) + 1;
            if (col === "date") {
              return new Date(row.date).toLocaleDateString();
            }
            if (col === "userName")
              return `${row.user.firstName} ${row.user.lastName}`;

            if (col === "remark") return row.bookingStatus === "completed" ? "Joined" : "pending"

            return String(row[col as keyof Booking]);
          }}
        />
      )}

      <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            />
      {booking && user && (
        <QRVerificationSuccessModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setTriggerQR((prev) => !prev);
          }}
          booking={booking}
          user={user}
        />
      )}

      <QRVerificationFailedModal
        isOpen={openFailedModal}
        onClose={() => {
          setOpenFailedModal(false);
          setTriggerQR((prev) => !prev);
        }}
        errorMessage={errormessage as string}
      />
    </div>
  );
}
