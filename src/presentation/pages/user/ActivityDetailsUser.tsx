"use client";
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Star,
  Heart,
  Share2,
  Camera,
  CheckCircle,
  Navigation,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "../../../components/ui/badge";
// import { Switch } from "../../../components/ui/switch"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import type {
  Activity,
  AuthResponse,
  Booking,
  ResponseType,
} from "../../../shared/types/global";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { axiosInstance } from "../../../api/axiosInstance";

interface RazorpayResponse {
  amount: number;
  currency: string;
  id: string;
}

interface RazorpayVerifyResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

type Availability = { date: string; availableSeats: number };

export default function ActivityDetailsUser() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [checkAvailability, setCheckAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [count, setCount] = useState(1);
  const [razorpayAccountId, setRazorpayAccountId] = useState("");
  // const [statusChange, setStatusChange] = useState(activity.isActive)
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const formatDate = (date: Date | string | null | undefined) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Mock reviews data since it's not in your Activity type
  const mockReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! Highly recommended.",
      date: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      comment: "Great activity, well organized and fun.",
      date: "2024-01-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // const handleBooking = async () => {
  //   if (!activity) return;
  //   const data = {
  //     userId: user?._id,
  //     activityId: activity?._id,
  //     date: selectedDate,
  //     participantCount: count,
  //     pricePerParticipant: activity?.pricePerHead,
  //     activityTitle: activity?.activityName,
  //     paymentId: "686f66f374574b1a51ed47f0",
  //     paymentStatus: "pending",
  //     bookingStatus: "pending",
  //     hostId: activity?.userId,
  //     razorpayAccountId,
  //   };
  //   console.log("booking data   :", data);

  //   try {
  //     const response = await userService.BookActivit(data);
  //     if (response.status === 201) {
  //       toast.success("activityBooking success");
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // if (!window.Razorpay) {
  //   toast.error("Razorpay SDK not loaded");
  //   return;
  // } else {
  //   toast.success("kshasgdbjsn");
  // }

  const initiateCheckout = async () => {
    if (!activity || !selectedDate || !user) {
      toast.error("Please complete all booking details");
      return;
    }

    const originalDate = new Date(selectedDate);
    const millisecondInOneDay = 24 * 60 * 60 * 100;
    const expiryDate = new Date(originalDate.getTime() - millisecondInOneDay);

    const razorpayData = {
      amount: activity.pricePerHead * count,
      currency: "INR",
      activityId: activity._id,
      activityTitle: activity.activityName,
      participantCount: count,
      userId: user._id,
      hostId: activity.userId,
      holdUntilDate: expiryDate,
      date: selectedDate,
      razorpayAccountId,
      pricePerParticipant: activity.pricePerHead,
    };
    console.log("razorpay data: ", razorpayData);
    try {
      const res = await axiosInstance.post(
        "/user/activity/booking",
        razorpayData
      );
      const data = res.data as RazorpayResponse;
      console.log("razorpay response  : ", res);
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: activity.activityName,
        order_id: data.id,
        handler: async (response: RazorpayVerifyResponse) => {
          console.log("handler response:   ", response);
          try {
            const verifyRes: ResponseType<AuthResponse> =
              await axiosInstance.post("/user/payment/verify", {
                ...response,
                ...data,
                ...razorpayData,
              });
            console.log(verifyRes);
            if (verifyRes.status === 201) {
              toast.success("Booking successful!");
              navigate("/order-success", {
                state: verifyRes.data.booking as Booking,
              });
            }
          } catch (err) {
            console.log(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.firstName,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment initiation failed");
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await userService.getActivityDetails(location.state);
        console.log(response);
        if (response.status === 200) {
          setActivity(response.data.activity as Activity);
          setRazorpayAccountId(response.data.razorpayAccountId as string);
          // const mockAvailabilityData = [
          //   { date: "2025-07-12", availableSeats: 10 },
          //   { date: "2025-07-13", availableSeats: 8 },
          //   { date: "2025-07-14", availableSeats: 1 },
          //   { date: "2025-07-15", availableSeats: 5 },
          //   { date: "2025-07-16", availableSeats: 12 },
          //   { date: "2025-07-17", availableSeats: 7 },
          //   { date: "2025-07-18", availableSeats: 3 },
          // ];
          console.log(response);
          const map: Record<string, number> = {};
          (response.data.availability as Availability[]).forEach(
            (d: { date: string; availableSeats: number }) => {
              map[d.date] = d.availableSeats;
            }
          );
          console.log(map);
          setAvailability(map);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchActivity();
  }, [location.state]);

  useEffect(() => {
    console.log(activity);
  }, [activity]);

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week for the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);

  // Create empty cells for days before the month starts
  const emptyCells = Array.from({ length: startDay }, (_, i) => i);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const seats = availability[dateStr] ?? 0;
    setCount(1);
    if (seats > 0) {
      setSelectedDate(date);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 🔐 Prevent render until activity is loaded
  if (!activity) {
    return <div className="p-10 text-center">Loading activity details...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <motion.div
        className="sticky top-0 z-50 bg-white border-b shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {activity.activityName}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (127 reviews)</span>
                  <span>•</span>
                  <MapPin className="w-4 h-4" />
                  <span>
                    {activity.city}, {activity.state}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Image Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
              {/* Main Image */}
              <div className="md:col-span-2 relative">
                {activity.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}${
                      activity.images[selectedImageIndex]
                    }`}
                    alt={activity.activityName}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImageIndex(0)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              {/* Thumbnail Grid */}
              <div className="md:col-span-2 grid grid-cols-2 gap-2">
                {activity.images.slice(0, 5).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`${import.meta.env.VITE_IMG_URL}${image}`}
                      alt={`${activity.activityName} - ${index + 2}`}
                      className="w-400 h-60 p-0 object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-lg"
                      onClick={() => setSelectedImageIndex(index + 1)}
                    />
                    {index === 3 && activity.images.length > 5 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <span className="text-white font-semibold">
                          +{activity.images.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mobile Title */}
          <motion.div variants={itemVariants} className="md:hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {activity.activityName}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 (127 reviews)</span>
              <span>•</span>
              <MapPin className="w-4 h-4" />
              <span>
                {activity.city}, {activity.state}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {activity.itenary ||
                        "Experience an amazing adventure with our carefully curated activity. Join us for an unforgettable journey filled with excitement and discovery."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* What to Expect */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>What to Expect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Professional guide and equipment provided</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Small group experience (max {activity.maxCapacity}{" "}
                          people)
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>All safety measures included</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Suitable for all experience levels</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Meeting Point */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5" />
                      Meeting and Pickup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Meeting Point
                        </h4>
                        <p className="text-gray-700">
                          {activity.reportingPlace}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.street}, {activity.city}, {activity.state}{" "}
                          {activity.postalCode}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Start Time
                        </h4>
                        <p className="text-gray-700">
                          {activity.reportingTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reviews */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      Reviews (127)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="flex gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {review.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {review.name}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div variants={itemVariants} className="sticky top-24">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {formatPrice(activity.pricePerHead)}
                        </div>
                        <div className="text-sm text-gray-600">per person</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Duration varies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>Max {activity.maxCapacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{activity.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Available daily</span>
                      </div>
                    </div>
                    <Separator />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                      onClick={() => setCheckAvailability(true)}
                    >
                      Check Availability
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                      Free cancellation up to 24 hours before
                    </div>
                    <Separator />
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Activity created</span>
                        <span>{formatDate(activity.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last updated</span>
                        <span>{formatDate(activity.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <Badge
                          variant={activity.isActive ? "default" : "secondary"}
                        >
                          {activity.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Calendar Modal */}
      {checkAvailability && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCheckAvailability(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h4 className="text-lg font-semibold">
                  {format(currentMonth, "MMMM yyyy")}
                </h4>
                <Button variant="ghost" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-lg border">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 border-b">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {/* Empty cells for days before month starts */}
                  {emptyCells.map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="h-16 border-r border-b last:border-r-0"
                    ></div>
                  ))}

                  {/* Days of the month */}
                  {daysInMonth.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const seats = availability[dateStr] ?? 0;
                    const isAvailable = seats > 0;
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());

                    return (
                      <div
                        key={dateStr}
                        className={`
                          h-16 border-r border-b last:border-r-0 p-1 cursor-pointer transition-colors relative
                          ${isSelected ? "bg-blue-500 text-white" : ""}
                          ${
                            !isSelected && isAvailable
                              ? "bg-green-50 hover:bg-green-100"
                              : ""
                          }
                          ${
                            !isSelected && !isAvailable
                              ? "bg-gray-50 cursor-not-allowed"
                              : ""
                          }
                          ${
                            isToday && !isSelected ? "ring-2 ring-blue-300" : ""
                          }
                        `}
                        onClick={() => handleDateClick(date)}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-white"
                                : isToday
                                ? "text-blue-600"
                                : ""
                            }`}
                          >
                            {format(date, "d")}
                          </span>
                          <span
                            className={`text-xs ${
                              isSelected
                                ? "text-white"
                                : isAvailable
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {seats > 0 ? `${seats} seats` : "No seats"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Footer */}
              <div className="mt-6 space-y-4">
                {/* {selectedDate && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">
                      Selected: {format(selectedDate, "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Available seats:{" "}
                      {availability[format(selectedDate, "yyyy-MM-dd")] ?? 0}
                    </p>
                  </div>
                )} */}

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span>Unavailable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Selected</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Click on a date to book. Only available dates are clickable.
                </p>

                {selectedDate && (
                  <>
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mt-4">
                      <span className="text-sm font-medium text-gray-700">
                        Select quantity
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setCount((prev) => Math.max(prev - 1, 1))
                          }
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 text-xl font-semibold hover:bg-gray-200 transition"
                        >
                          –
                        </button>
                        <span className="text-lg font-semibold text-gray-800 w-6 text-center">
                          {count}
                        </span>
                        <button
                          onClick={() =>
                            setCount((prev) =>
                              Math.min(
                                prev + 1,
                                availability[format(selectedDate, "yyyy-MM-dd")]
                              )
                            )
                          }
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 text-xl font-semibold hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <h1>
                      Total Payable Amount : ₹ {count * activity.pricePerHead}
                    </h1>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg"
                      onClick={initiateCheckout}
                    >
                      Book for {format(selectedDate, "MMM d, yyyy")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
