import {
  ActivityIcon,
    BadgeDollarSign,
  BookHeart,
  Filter,
  Globe,
  HeartHandshake,
  Home,
  IdCardIcon,
  LayoutDashboard,
  MessageCircleMore,
  Notebook,
  NotebookPen,
  NotebookText,
  ShieldUser,
  User,
  Users,
} from "lucide-react";

export const navitems = {
  user: [
    {
      title: "Home",
      path: "/home",
      icon: Home,
    },
    {
      title: "Explorations",
      path: "/explorations",
      icon: Globe,
    },
    {
      title: "Filter",
      path: "/filter",
      icon: Filter
    },
    {
      title: "Blogs",
      path: "/blogs",
      icon: BookHeart
    },
    {
      title: "About",
      path: "/about",
      icon: NotebookText
    },
    {
      title: "Profile",
      path: "/profile",
      icon: User
    },
  ],
  admin: [],
  host: [],
};

export const SideBarItems = {
    user: [
      {
        title: "My Profile",
        path: "/profile",
        icon: User,
      },
      {
        title: "My Bookings",
        path: "/bookings",
        icon: NotebookPen,
      },
      {
        title: "My Chat",
        path: "/chat",
        icon: IdCardIcon,
      }
    ],
    admin: [
    {
        title: "Dashboard",
        path: "/admin/home",
        icon: LayoutDashboard
    },
    {
        title: "Users",
        path: "/admin/users",
        icon: Users
    },
    {
        title: "Host",
        path: "/admin/host",
        icon: ShieldUser
    },
    {
        title: "Sales",
        path: "/admin/sales",
        icon: BadgeDollarSign
    },
    {
        title: "Activities",
        path: "/admin/activities",
        icon: Globe
    },
    {
        title: "Services",
        path: "/admin/services",
        icon: HeartHandshake
    },
    {
        title: "Earnings",
        path: "/admin/earnings",
        icon: BadgeDollarSign
    },
  ],
  host: [
    {
      title: "Dashboard",
      path: "/host/home",
      icon: Notebook,
    },
    {
      title: "Profile",
      path: "/host/profile",
      icon: Notebook,
    },
    {
      title: "Activity Booking",
      path: "/host/bookings",
      icon: NotebookText,
    },
    {
      title: "Activities",
      path: "/host/activity",
      icon: ActivityIcon,
    },
    {
      title: "My Chats",
      path: "/host/chat",
      icon: MessageCircleMore,
    },
    {
      title: "My Blogs",
      path: "/host/blogs",
      icon: BookHeart,
    },
  ],
}
