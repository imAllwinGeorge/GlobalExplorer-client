"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { MapPin, Clock, Users, Calendar, Star, Heart, Share2, Camera, CheckCircle, Navigation, X, ChevronLeft, ChevronRight, } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "../../../components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Badge } from "../../../components/ui/badge";
// import { Switch } from "../../../components/ui/switch"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, } from "date-fns";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../api/axiosInstance";
import { formatInTimeZone } from "date-fns-tz";
import axios from "axios";
import { HttpStatusCode } from "../../../shared/constants/constants";
import { averageRating, formateDate, totalRatings } from "../../../utils/helpers/helper";
import { WriteReview } from "../../components/review/WriteReview";
export default function ActivityDetailsUser() {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [activity, setActivity] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [availability, setAvailability] = useState({});
    const [checkAvailability, setCheckAvailability] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [formattedDate, setFormattedDate] = useState();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [count, setCount] = useState(1);
    const [razorpayAccountId, setRazorpayAccountId] = useState("");
    // const [statusChange, setStatusChange] = useState(activity.isActive)
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const formatDate = (date) => {
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
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };
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
    //     if (response.status === HttpStatusCode.CREATED) {
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
            date: formattedDate,
            razorpayAccountId,
            pricePerParticipant: activity.pricePerHead,
        };
        console.log("razorpay data: ", razorpayData);
        try {
            const res = await axiosInstance.post("/user/activity/booking", razorpayData);
            const data = res.data;
            console.log("razorpay response  : ", res);
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: activity.activityName,
                order_id: data.id,
                handler: async (response) => {
                    console.log("handler response:   ", response);
                    try {
                        const verifyRes = await axiosInstance.post("/user/payment/verify", {
                            ...response,
                            ...data,
                            ...razorpayData,
                        });
                        console.log(verifyRes);
                        if (verifyRes.status === 201) {
                            toast.success("Booking successful!");
                            navigate(`/order-success/${verifyRes.data.booking._id}`, {
                                state: verifyRes.data.booking,
                            });
                        }
                    }
                    catch (err) {
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
        }
        catch (error) {
            console.error("Booking error:", error);
            if (axios.isAxiosError(error)) {
                // Extract a message from backend response if it exists
                const message = error.response?.data?.message || "Something went wrong. Please try again.";
                toast.error(message);
            }
            else {
                toast.error("Unexpected error occurred.");
            }
        }
    };
    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await userService.getActivityDetails(id);
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setActivity(response.data.activity);
                    setReviews(response.data.reviews);
                    setRazorpayAccountId(response.data.razorpayAccountId);
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
                    const map = {};
                    response.data.availability.forEach((d) => {
                        map[d.date] = d.availableSeats;
                    });
                    console.log(map);
                    setAvailability(map);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchActivity();
    }, [id]);
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
    const handleDateClick = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const seats = availability[dateStr] ?? 0;
        setCount(1);
        if (seats > 0) {
            setSelectedDate(date);
        }
        const asianDate = formatInTimeZone(date, "Asia/Kolkata", "yyyy-MM-dd");
        setFormattedDate(asianDate);
        console.log("selected date:   ", date);
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    // 🔐 Prevent render until activity is loaded
    if (!activity) {
        return _jsx("div", { className: "p-10 text-center", children: "Loading activity details..." });
    }
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx(motion.div, { className: "sticky top-0 z-50 bg-white border-b shadow-sm", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "hidden md:block", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: activity.activityName }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400" }), _jsx("span", { children: "4.8 (127 reviews)" }), _jsx("span", { children: "\u2022" }), _jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [activity.city, ", ", activity.state] })] })] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(Share2, { className: "w-4 h-4 mr-2" }), "Share"] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setIsLiked(!isLiked), children: [_jsx(Heart, { className: `w-4 h-4 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}` }), "Save"] })] })] }) }) }), _jsx("div", { className: "container mx-auto px-4 py-6 max-w-7xl", children: _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8", children: [_jsx(motion.div, { variants: itemVariants, className: "relative", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden", children: [_jsx("div", { className: "md:col-span-2 relative", children: activity.images.length > 0 ? (_jsx("img", { src: `${activity.images[selectedImageIndex]}`, alt: activity.activityName, className: "w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300", onClick: () => setSelectedImageIndex(0) })) : (_jsx("div", { className: "w-full h-full bg-gray-200 flex items-center justify-center", children: _jsx(Camera, { className: "w-12 h-12 text-gray-400" }) })) }), _jsx("div", { className: "md:col-span-2 grid grid-cols-2 gap-2", children: activity.images.slice(0, 5).map((image, index) => (_jsxs("div", { className: "relative", children: [_jsx("img", { src: `${image}`, alt: `${activity.activityName} - ${index + 2}`, className: "w-400 h-60 p-0 object-cover cursor-pointer hover:scale-105 transition-transform duration-300 rounded-lg", onClick: () => setSelectedImageIndex(index + 1) }), index === 3 && activity.images.length > 5 && (_jsx("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg", children: _jsxs("span", { className: "text-white font-semibold", children: ["+", activity.images.length - 4, " more"] }) }))] }, index))) })] }) }), _jsxs(motion.div, { variants: itemVariants, className: "md:hidden", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: activity.activityName }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400" }), _jsx("span", { children: "4.8 (127 reviews)" }), _jsx("span", { children: "\u2022" }), _jsx(MapPin, { className: "w-4 h-4" }), _jsxs("span", { children: [activity.city, ", ", activity.state] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-2xl", children: "Overview" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap", children: activity.itenary ||
                                                                "Experience an amazing adventure with our carefully curated activity. Join us for an unforgettable journey filled with excitement and discovery." }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "What to Expect" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "Professional guide and equipment provided" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }), _jsxs("span", { children: ["Small group experience (max ", activity.maxCapacity, " ", "people)"] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "All safety measures included" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" }), _jsx("span", { children: "Suitable for all experience levels" })] })] }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Navigation, { className: "w-5 h-5" }), "Meeting and Pickup"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Meeting Point" }), _jsx("p", { className: "text-gray-700", children: activity.reportingPlace }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [activity.street, ", ", activity.city, ", ", activity.state, " ", activity.postalCode] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Start Time" }), _jsx("p", { className: "text-gray-700", children: activity.reportingTime })] })] }) })] }) }), reviews !== null && reviews.length > 0 && (_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-4xl", children: [averageRating(reviews), _jsx(Star, { className: "w-8 h-8 fill-yellow-400 text-yellow-400" })] }), _jsx("span", { children: `${totalRatings(reviews)} ratings &
                      ${reviews.length} reviews` })] }), _jsx("hr", {}), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: reviews.map((review) => (_jsxs("div", { className: "flex gap-4", children: [_jsx(Avatar, { children: _jsx(AvatarFallback, { children: typeof review.userId === "object"
                                                                                ? review.userId.firstName.charAt(0)
                                                                                : "" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold", children: typeof review.userId === "object"
                                                                                            ? `${review.userId.firstName} ${review.userId.lastName}`
                                                                                            : "Anonymous" }), _jsx("div", { className: "flex", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: `w-4 h-4 ${i < review.rating
                                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                                : "text-gray-300"}` }, i))) }), _jsx("span", { className: "text-sm text-gray-500", children: formateDate(review.createdAt) })] }), _jsx("h2", { className: "font-bold", children: review.title }), _jsx("p", { className: "text-gray-700", children: review.comment })] })] }, review._id))) }) })] }) })), _jsx("div", { children: _jsx(WriteReview, { entityId: activity._id, userId: user?._id }) })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx(motion.div, { variants: itemVariants, className: "sticky top-24", children: _jsxs(Card, { className: "shadow-lg", children: [_jsx(CardHeader, { children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-gray-900", children: formatPrice(activity.pricePerHead) }), _jsx("div", { className: "text-sm text-gray-600", children: "per person" })] }) }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: "Duration varies" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-4 h-4 text-gray-500" }), _jsxs("span", { children: ["Max ", activity.maxCapacity] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: activity.city })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { children: "Available daily" })] })] }), _jsx(Separator, {}), _jsx(Button, { className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3", onClick: () => setCheckAvailability(true), children: "Check Availability" }), _jsx("div", { className: "text-center text-sm text-gray-600", children: "Free cancellation up to 24 hours before" }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Activity created" }), _jsx("span", { children: formatDate(activity.createdAt) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Last updated" }), _jsx("span", { children: formatDate(activity.updatedAt) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Status" }), _jsx(Badge, { variant: activity.isActive ? "default" : "secondary", children: activity.isActive ? "Active" : "Inactive" })] })] })] })] }) }) })] })] }) }), checkAvailability && (_jsx("div", { className: "fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-white rounded shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Select Date" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setCheckAvailability(false), children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: prevMonth, children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("h4", { className: "text-lg font-semibold", children: format(currentMonth, "MMMM yyyy") }), _jsx(Button, { variant: "ghost", size: "sm", onClick: nextMonth, children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "grid grid-cols-7 border-b", children: weekDays.map((day) => (_jsx("div", { className: "p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0", children: day }, day))) }), _jsxs("div", { className: "grid grid-cols-7", children: [emptyCells.map((_, index) => (_jsx("div", { className: "h-16 border-r border-b last:border-r-0" }, `empty-${index}`))), daysInMonth.map((date) => {
                                                const dateStr = format(date, "yyyy-MM-dd");
                                                const seats = availability[dateStr] ?? 0;
                                                const isAvailable = seats > 0;
                                                const isSelected = selectedDate && isSameDay(date, selectedDate);
                                                const isToday = isSameDay(date, new Date());
                                                return (_jsx("div", { className: `
                          h-16 border-r border-b last:border-r-0 p-1 cursor-pointer transition-colors relative
                          ${isSelected ? "bg-blue-500 text-white" : ""}
                          ${!isSelected && isAvailable
                                                        ? "bg-green-50 hover:bg-green-100"
                                                        : ""}
                          ${!isSelected && !isAvailable
                                                        ? "bg-gray-50 cursor-not-allowed"
                                                        : ""}
                          ${isToday && !isSelected ? "ring-2 ring-blue-300" : ""}
                        `, onClick: () => handleDateClick(date), children: _jsxs("div", { className: "flex flex-col items-center justify-center h-full", children: [_jsx("span", { className: `text-sm font-medium ${isSelected
                                                                    ? "text-white"
                                                                    : isToday
                                                                        ? "text-blue-600"
                                                                        : ""}`, children: format(date, "d") }), _jsx("span", { className: `text-xs ${isSelected
                                                                    ? "text-white"
                                                                    : isAvailable
                                                                        ? "text-green-600 font-medium"
                                                                        : "text-gray-400"}`, children: seats > 0 ? `${seats} seats` : "No seats" })] }) }, dateStr));
                                            })] })] }), _jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4 text-xs", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 bg-green-100 rounded-full" }), _jsx("span", { children: "Available" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 bg-gray-200 rounded-full" }), _jsx("span", { children: "Unavailable" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }), _jsx("span", { children: "Selected" })] })] }), _jsx("p", { className: "text-sm text-gray-600", children: "Click on a date to book. Only available dates are clickable." }), selectedDate && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center justify-between bg-gray-100 rounded-lg p-2 mt-4", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Select quantity" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setCount((prev) => Math.max(prev - 1, 1)), className: "w-8 h-8 rounded-full bg-white border border-gray-300 text-xl font-semibold hover:bg-gray-200 transition", children: "\u2013" }), _jsx("span", { className: "text-lg font-semibold text-gray-800 w-6 text-center", children: count }), _jsx("button", { onClick: () => setCount((prev) => Math.min(prev + 1, availability[format(selectedDate, "yyyy-MM-dd")])), className: "w-8 h-8 rounded-full bg-white border border-gray-300 text-xl font-semibold hover:bg-gray-200 transition", children: "+" })] })] }), _jsxs("h1", { children: ["Total Payable Amount : \u20B9 ", count * activity.pricePerHead] }), _jsxs(Button, { className: "w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg", onClick: initiateCheckout, children: ["Book for ", format(selectedDate, "MMM d, yyyy")] })] }))] })] }) }) }))] }));
}
