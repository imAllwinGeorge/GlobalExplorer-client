// src/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { userService } from "@/services/UserService";
import { NOTIFICATION_EVENT, HttpStatusCode } from "@/shared/constants/constants";
import type { Notification } from "@/shared/types/global";

export function useNotifications(userId?: string) {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications with pagination
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await userService.fetchNotification(userId, page);
        if (res.status === HttpStatusCode.OK) {
          const fetched = res.data.notifications as unknown as Notification[];
          setNotifications((prev) => [...prev, ...fetched]);
          setHasMore(fetched.length >= 10);
          setUnreadCount(res.data.totalNotification as number)
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, page]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNew = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    const handleRead = (data: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === data._id ? data : n))
      );
    };

    socket.on(NOTIFICATION_EVENT.SEND_NOTIFICATION, handleNew);
    socket.on(NOTIFICATION_EVENT.READ_NOTIFICATION, handleRead);

    return () => {
      socket.off(NOTIFICATION_EVENT.SEND_NOTIFICATION, handleNew);
      socket.off(NOTIFICATION_EVENT.READ_NOTIFICATION, handleRead);
    };
  }, [socket]);

  return { notifications, unreadCount, setPage, hasMore, loading };
}
