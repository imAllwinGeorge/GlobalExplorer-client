import { useSocket } from "../../../contexts/SocketContext"
import { NOTIFICATION_EVENT } from "../../../shared/constants/constants";
import type { Notification } from "../../../shared/types/global"

interface NotificationPropsType {
  notifications: Notification[],
  receiverId: string
}
const NotificationMessages = ({notifications, receiverId}: NotificationPropsType) => {
  const socket = useSocket();

  const handleRead = (id: string) => {
    console.log("read notification triggered", socket)
    if(!socket) return
    socket.emit(NOTIFICATION_EVENT.READ_NOTIFICATION,{id,receiverId})
  }
  return (
    <div className="absolute top-16 right-4 md:right-4 md:w-80 w-72 max-w-[90vw] bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
      {notifications.map((noti) => (
        <button
          key={noti._id}
          onClick={() => handleRead(noti._id)}
          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
            !noti.isRead ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""
          }`}
        >
          <span className={`text-sm block ${!noti.isRead ? "font-medium text-gray-900" : "text-gray-600"}`}>
            {noti.message}
          </span>
        </button>
      ))}
    </div>
  )
}

export default NotificationMessages