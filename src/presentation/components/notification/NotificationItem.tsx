// src/components/notification/NotificationItem.tsx
import React from "react";
import type { Notification } from "@/shared/types/global";

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
}

const NotificationItem = React.memo(({ notification, onRead }: Props) => {
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

  return (
    <button
      onClick={() => onRead(notification._id)}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
        notification.isRead
          ? "bg-white hover:bg-gray-50"
          : "bg-blue-100 border-l-4 border-l-blue-500"
      }`}
    >
      <p
        className={`text-sm ${
          notification.isRead ? "text-gray-700" : "font-semibold text-gray-900"
        }`}
      >
        {notification.message}
      </p>
      <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
    </button>
  );
});

export default NotificationItem;
