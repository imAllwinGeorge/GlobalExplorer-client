import React from "react"
import { Badge } from "@/components/ui/badge"
import type { BookingWithUser } from "@/shared/types/global"
import { Button } from "@/presentation/components/ui/button"

interface BookingDetailsProps {
  booking: BookingWithUser
  onClose: () => void
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
  if (!booking) return null

  const totalAmount = (booking.pricePerParticipant || 0) * booking.participantCount

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-800"
    if (status === "pending") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getBookingStatusColor = (status: string) => {
    if (status === "confirmed") return "bg-blue-100 text-blue-800"
    if (status === "pending") return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

        {/* Activity Information */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Activity Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <InfoRow label="Activity Name" value={booking.activityTitle} />
            <InfoRow label="Activity ID" value={booking.activityId} mono />
            <InfoRow label="Activity Date" value={new Date(booking.date).toLocaleDateString()} />
            <InfoRow label="Participants" value={booking.participantCount.toString()} />
          </div>
        </section>

        {/* User Information */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">User Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <InfoRow label="Name" value={`${booking.user.firstName} ${booking.user.lastName}`} />
            <InfoRow label="Email" value={booking.user.email} />
            <InfoRow label="Phone" value={booking.user.phoneNumber} />
            <InfoRow label="User ID" value={booking.userId} mono />
          </div>
        </section>

        {/* Payment Information */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Payment Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <InfoRow label="Price Per Participant" value={`₹${booking.pricePerParticipant || 0}`} />
            <InfoRow label="Total Amount" value={`₹${totalAmount}`} bold />
            <InfoRow
              label="Payment Status"
              value={<Badge className={getStatusColor(booking.paymentStatus)}>{booking.paymentStatus.toUpperCase()}</Badge>}
            />
            {booking.razorpayOrderId && <InfoRow label="Order ID" value={booking.razorpayOrderId} mono />}
            {booking.razorpayPaymentId && <InfoRow label="Payment ID" value={booking.razorpayPaymentId} mono />}
          </div>
        </section>

        {/* Booking Status */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Booking Status</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <InfoRow
              label="Status"
              value={<Badge className={getBookingStatusColor(booking.bookingStatus)}>{booking.bookingStatus.toUpperCase()}</Badge>}
            />
            <InfoRow
              label="Cancelled"
              value={<Badge variant={booking.isCancelled ? "destructive" : "secondary"}>{booking.isCancelled ? "YES" : "NO"}</Badge>}
            />
            <InfoRow
              label="Refunded"
              value={<Badge variant={booking.isRefunded ? "secondary" : "outline"}>{booking.isRefunded ? "YES" : "NO"}</Badge>}
            />
            {booking.holdUntilDate && (
              <InfoRow
                label="Hold Until"
                value={new Date(booking.holdUntilDate).toLocaleDateString()}
              />
            )}
          </div>
        </section>

        {/* QR Code */}
        {booking.qrCode && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">QR Code</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
              <div className="bg-white p-4 rounded border border-gray-200">
                <img
                  src={booking.qrCode}
                  alt="Booking QR Code"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
          </section>
        )}

        {/* Timestamps */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Timestamps</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <InfoRow label="Created" value={new Date(booking.createdAt).toLocaleString()} />
            <InfoRow label="Updated" value={new Date(booking.updatedAt).toLocaleString()} />
          </div>
        </section>

        {/* Booking ID */}
        <section>
          <div className="bg-blue-50 rounded-lg p-4">
            <span className="text-gray-600">Booking ID:</span>
            <div className="font-mono text-sm text-gray-900 mt-1 break-all">{booking._id}</div>
          </div>
        </section>

        <div className="flex justify-end pt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// ✅ Small reusable helper for rows
const InfoRow = ({
  label,
  value,
  mono,
  bold,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
  bold?: boolean
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span
      className={`text-gray-900 ${mono ? "font-mono text-sm" : ""} ${bold ? "font-semibold text-lg" : ""}`}
    >
      {value}
    </span>
  </div>
)

export default BookingDetails
