"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActivtyCardUser from "./ActiviyCard-user";
import { Button } from "../ui/button";
export default function Carousel({ activities, onCardClick, title = "Popular Activities", }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerView = 4;
    const maxIndex = Math.max(0, activities.length - cardsPerView);
    const handlePrevious = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };
    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };
    return (_jsxs("div", { className: "w-full max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: title }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "icon", onClick: handlePrevious, disabled: currentIndex === 0, className: "rounded-full bg-transparent", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "icon", onClick: handleNext, disabled: currentIndex >= maxIndex, className: "rounded-full", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "relative overflow-hidden", children: _jsx("div", { className: "flex transition-transform duration-300 ease-in-out gap-6 p-2", style: {
                        transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                    }, children: activities.map((activity, index) => (_jsx("div", { className: "flex-shrink-0 w-1/4", children: _jsx(ActivtyCardUser, { activity: activity, onCardClick: onCardClick }) }, index))) }) })] }));
}
