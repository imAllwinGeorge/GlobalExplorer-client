"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { easeOut, motion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { MapPin, Users } from "lucide-react";
export default function ActivtyCardUser({ activity, onCardClick,
// currencySymbol = "₹",
// exchangeRate = 83.5,
//   secondaryCurrency = "INR",
// discountPercentage = 20,
 }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN").format(price);
    };
    // const getConvertedPrice = (price: number) => {
    //   return Math.round(price * exchangeRate)
    // }
    // const getDiscountedPrice = (price: number) => {
    //   return Math.round(price * (1 - discountPercentage / 100))
    // }
    // Mock duration calculation - you can replace this with actual duration from your data
    // const getDuration = () => {
    //   // This is a placeholder - replace with actual duration logic
    //   const durations = ["2H", "3H", "6H", "1D", "2D", "3N/4D", "6D/5N", "7N/8D"]
    //   return durations[Math.floor(Math.random() * durations.length)]
    // }
    // Mock rating - replace with actual rating from your data
    // const getRating = () => {
    //   return {
    //     rating: (4.0 + Math.random() * 1).toFixed(1),
    //     reviews: Math.floor(1000 + Math.random() * 5000),
    //   }
    // }
    // const { rating, reviews } = getRating()
    // const convertedPrice = getConvertedPrice(activity.pricePerHead)
    // const discountedPrice = getDiscountedPrice(convertedPrice)
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: easeOut,
            },
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: easeOut,
            },
        },
    };
    const imageVariants = {
        hidden: { scale: 1.1, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: easeOut,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: easeOut,
            },
        },
    };
    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: 0.2,
                ease: easeOut,
            },
        },
    };
    return (_jsx("div", { className: "w-full max-w-sm mx-auto p-2", children: _jsx(motion.div, { variants: cardVariants, initial: "hidden", animate: "visible", whileHover: "hover", className: "cursor-pointer group", onClick: () => onCardClick?.(activity), children: _jsx(Card, { className: "overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all py-0 duration-500 bg-white rounded-2xl", children: _jsxs(CardContent, { className: "p-0", children: [_jsx("div", { className: "relative w-full h-[280px] sm:h-[320px] md:h-[280px] overflow-hidden rounded-t-2xl", children: _jsxs(motion.div, { variants: imageVariants, className: "w-full h-full relative", children: [_jsx("img", { src: `${activity.images[0]}`, alt: activity.activityName, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" }), !activity.isActive && (_jsx(motion.div, { className: "absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, children: _jsx(Badge, { variant: "secondary", className: "text-white bg-red-600 text-sm px-4 py-2 rounded-full font-semibold", children: "Currently Unavailable" }) }))] }) }), _jsxs(motion.div, { variants: contentVariants, className: "p-5 sm:p-6 space-y-4", children: [_jsx(motion.h3, { className: "text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 min-h-[1 rem] leading-tight", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3, duration: 0.4 }, children: activity.activityName }), _jsxs(motion.div, { className: "space-y-2", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5, duration: 0.4 }, children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-2xl font-bold text-gray-500 ", children: ["\u20B9", formatPrice(activity.pricePerHead)] }), _jsx("span", { className: "text-sm text-gray-600 font-medium", children: "per person" })] }), _jsxs("div", { className: "flex items-center text-gray-600 text-sm", children: [_jsx(MapPin, { className: "w-4 h-4 mr-1" }), _jsxs("span", { children: [activity.city, ", ", activity.state, ", ", activity.country] })] })] }), _jsx(motion.div, { className: "space-y-2", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: _jsxs("div", { className: "flex items-center text-sm text-gray-600", children: [_jsx(Users, { className: "w-4 h-4 mr-2" }), _jsxs("span", { children: ["Max Capacity: ", activity.maxCapacity, " people"] })] }) }), _jsx(motion.div, { className: "opacity-0 group-hover:opacity-100 transition-opacity duration-300", initial: { opacity: 0 }, animate: { opacity: 1 }, children: _jsx("div", { className: "text-center ", children: _jsx("span", { className: "text-sm text-blue-600 font-medium", children: "Click to view details \u2192" }) }) })] })] }) }) }) }));
}
