"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { easeOut, motion } from "framer-motion";
import { MapPin, Clock, Users, Calendar, Pencil } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../../../components/ui/badge";
export default function ActivityCard({ activity, onEdit, onViewDetails, showDates = true, currencySymbol = "$", exchangeRate = 83.5, secondaryCurrency = "INR", buttonTitle, }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US").format(price);
    };
    const getSecondaryPrice = (price) => {
        return Math.round(price * exchangeRate);
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOut },
        },
        hover: {
            y: -5,
            transition: { duration: 0.2, ease: easeOut },
        },
    };
    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3, ease: easeOut },
        },
    };
    return (_jsx(motion.div, { variants: cardVariants, initial: "hidden", animate: "visible", whileHover: "hover", className: "w-full max-w-6xl m-4", children: _jsx(Card, { className: "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300", children: _jsx(CardContent, { className: "p-0", children: _jsxs("div", { className: "flex flex-col lg:flex-row", children: [_jsxs("div", { className: "lg:w-4/5 relative overflow-hidden ml-3", children: [_jsx(motion.div, { variants: imageVariants, className: "w-full h-full relative", children: _jsx("img", { src: `${activity.images[0]}`, alt: activity.activityName, width: 400, height: 300, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }) }), !activity.isActive && (_jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center", children: _jsx(Badge, { variant: "secondary", className: "text-white bg-red-600", children: "Currently Unavailable" }) }))] }), _jsxs("div", { className: "lg:w-3/5 p-6 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(motion.h3, { className: "text-xl lg:text-2xl font-bold text-gray-900 mb-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, children: activity.activityName }), _jsxs("div", { className: "flex items-center text-gray-600 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 mr-1" }), _jsxs("span", { children: [activity.city, ", ", activity.state, ", ", activity.country] })] })] }), _jsxs(motion.div, { className: "space-y-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: [_jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Users, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: ["Max Capacity: ", activity.maxCapacity, " people"] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: ["Reporting Time: ", activity.reportingTime] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: ["Meeting Point: ", activity.reportingPlace] })] })] }), activity.itenary && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, children: _jsx(Button, { variant: "outline", size: "sm", className: "text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent", onClick: () => onViewDetails?.(activity), children: "What's Included in this Activity? >" }) }))] }), _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between mt-6 space-y-4 lg:space-y-0", children: [_jsxs(motion.div, { className: "text-right lg:text-left", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.5 }, children: [_jsx("div", { className: "text-sm text-gray-500 mb-1", children: "Price from" }), _jsxs("div", { className: "text-2xl lg:text-3xl font-bold text-gray-900", children: [currencySymbol, formatPrice(activity.pricePerHead), " USD"] }), _jsxs("div", { className: "text-lg text-gray-600", children: ["\u20B9", formatPrice(getSecondaryPrice(activity.pricePerHead)), " ", secondaryCurrency] }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [activity.maxCapacity, " bookings are left"] }), _jsx(Button, { variant: "link", size: "sm", className: "text-blue-600 p-0 h-auto", onClick: () => onViewDetails?.(activity), children: "Rate Details" })] }), showDates && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, children: buttonTitle === "EDIT" ? _jsxs(Button, { className: "w-full lg:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg font-semibold", onClick: () => onEdit?.(activity), children: [_jsx(Pencil, { className: "w-4 h-4 mr-2" }), buttonTitle] }) : _jsxs(Button, { className: "w-full lg:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg font-semibold", onClick: () => onViewDetails?.(activity), children: [_jsx(Calendar, { className: "w-4 h-4 mr-2" }), buttonTitle] }) }))] })] })] }) }) }) }));
}
