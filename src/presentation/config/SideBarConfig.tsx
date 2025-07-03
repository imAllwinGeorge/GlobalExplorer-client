import {
    BadgeDollarSign,
  BookHeart,
  Filter,
  Globe,
  HeartHandshake,
  Home,
  LayoutDashboard,
  MessageCircleMore,
  Notebook,
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
    user: [],
    admin: [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
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
