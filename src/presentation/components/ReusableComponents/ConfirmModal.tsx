import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string,
    variant?: "danger" | 'warning' | "info",
    className?: string,
    confirmButtonClassName?: string
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    className = "",
    confirmButtonClassName = "",
}: ConfirmModalProps) => {
    if(!isOpen) return null;

    const handleConfirm = () => {
        onConfirm()
        onClose()
    };
    const getVarianStyles = () => {
        switch (variant){
            case "danger":
                return {
                    iconColor: "text-red-500",
                    icongBg: "bg-red-100",
                    confirmBtn: confirmButtonClassName || "bg-red-600 hover:bg-red-700"
                }
            case "warning":
                return {
                    iconColor: "text-yellow-500",
                    iconBg: "bg-yellow-100",
                    confirmBtn: confirmButtonClassName || "bg-[#f69938] hover:bg-[#e5873a]"
                }
            case "info":
                return {
                    iconColor: "text-blue-500",
                    iconBg: "bg-blue-100",
                    confirmBtn: confirmButtonClassName || "bg-blue-600 hover:bg-blue-700"
                }
            default:
                return {
                    iconColor: "text-yellow-500",
                    iconBg: "bg-yellow-100",
                    confirmBtn: confirmButtonClassName || "bg-[#f69938] hover:bg-[#e5873a]"
                }
        }
    }
    const styles = getVarianStyles();
  return (
   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal