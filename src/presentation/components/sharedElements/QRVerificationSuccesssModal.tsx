import { motion } from "framer-motion";
import { CheckCircle, MapPin, Calendar, Users, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import type { Booking, User } from "@/shared/types/global";
import { formateDate } from "@/utils/helpers/helper";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  user: User;
}

export default function QRVerificationSuccessModal({
  isOpen,
  onClose,
  booking,
  user,
}: BookingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md sm:max-w-lg w-full p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Successful!
            </h2>
            <p className="text-sm text-gray-600">
              Booking confirmed and verified
            </p>
          </div>
        </div>

        <div className="space-y-6 py-6">
          {/* Activity Details */}
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">
              Activity Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Activity</p>
                  <p className="font-medium text-gray-900">
                    {booking.activityTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formateDate(booking.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-medium text-gray-900">
                    {booking.participantCount} person
                    {booking.participantCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* User Details */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Booked By
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900 break-all">
                  {user.email}
                </p>
              </div>
              {user.phoneNumber && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">
                    {user.phoneNumber}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Booking ID */}
          {/* <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Booking ID</p>
            <p className="font-mono font-semibold text-gray-900 break-all">
              {booking._id}
            </p>
          </div> */}

          {/* Payment Status */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-600">Payment Status</span>
            <Badge
              className={`${
                booking.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : booking.paymentStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking.paymentStatus.charAt(0).toUpperCase() +
                booking.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Close
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
