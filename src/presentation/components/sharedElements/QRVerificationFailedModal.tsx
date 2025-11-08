import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export default function QRVerificationFailedModal({ isOpen, onClose, errorMessage = "Failed to scan the QR Code!" }: ErrorDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-sm text-gray-600">Unable to verify your booking</p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 py-6">
          {/* Error Message */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Details</h3>
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
            <h3 className="font-semibold text-gray-900 mb-3">Troubleshooting Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-amber-600">1.</span>
                <span>Ensure the QR code is clearly visible and not damaged</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-amber-600">2.</span>
                <span>Check that your device camera has proper lighting</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-amber-600">3.</span>
                <span>Try scanning from a different angle</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-amber-600">4.</span>
                <span>Contact support if the issue persists</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
}
