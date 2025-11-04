// src/components/navbar/NotificationMenu.tsx
import { useRef, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { NOTIFICATION_EVENT } from "@/shared/constants/constants";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "@/presentation/hooks/useNotification";

interface Props {
  userId: string;
  onClose: () => void;
}

const NotificationMenu = ({ userId, onClose }: Props) => {
  const { notifications, setPage, hasMore, loading } = useNotifications(userId);
  const socket = useSocket();
  const observer = useRef<IntersectionObserver | null>(null);

  const handleRead = useCallback(
    (id: string) => {
      if (!socket) return;
      socket.emit(NOTIFICATION_EVENT.READ_NOTIFICATION, { id, receiverId: userId });
    },
    [socket, userId]
  );

  const lastRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((p) => p + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage]
  );

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-16 right-4 md:w-80 w-72 max-w-[90vw] bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
    >
      {notifications.map((noti, i) =>
        i === notifications.length - 1 ? (
          <div key={noti._id} ref={lastRef}>
            <NotificationItem notification={noti} onRead={handleRead} />
          </div>
        ) : (
          <NotificationItem key={noti._id} notification={noti} onRead={handleRead} />
        )
      )}
      {loading && (
        <p className="text-center text-xs text-gray-500 py-2">Loading...</p>
      )}
      {!hasMore && !loading && notifications.length > 0 && (
        <p className="text-center text-xs text-gray-400 py-2">No more notifications</p>
      )}
      {!notifications.length && !loading && (
        <p className="text-center text-sm text-gray-500 py-4">No notifications yet</p>
      )}
    </div>
  );
};

export default NotificationMenu;
