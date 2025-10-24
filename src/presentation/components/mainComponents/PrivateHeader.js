"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion";
import { ArrowRight, Play, } from "lucide-react";
import { Button } from "../ui/button";
const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] } },
};
const containerVariant = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};
export default function PrivateHeader() {
    return (_jsx("section", { className: "w-full py-8 md:py-12 lg:py-16", children: _jsx("section", { className: "w-full py-16 px-10 bg-white", children: _jsxs("div", { className: "container mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center gap-12", children: [_jsxs(motion.div, { className: "w-full lg:w-1/2 space-y-6 text-center lg:text-left", variants: containerVariant, initial: "hidden", animate: "visible", children: [_jsx(motion.span, { className: "inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full", variants: textVariant, children: "Discover. Book. Explore. home page" }), _jsx(motion.h1, { className: "text-4xl sm:text-5xl font-bold tracking-tight text-gray-900", variants: textVariant, children: "Unforgettable Tours & Activities Await You" }), _jsx(motion.p, { className: "text-gray-600 md:text-lg max-w-xl mx-auto lg:mx-0", variants: textVariant, children: "From thrilling adventures to peaceful agro retreats and vibrant cultural tours, Global Explorer connects you to authentic travel experiences around the world." }), _jsxs(motion.div, { className: "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start", variants: textVariant, children: [_jsxs(Button, { size: "lg", className: "inline-flex items-center gap-2", children: ["Explore Activities", _jsx(ArrowRight, { className: "h-4 w-4" })] }), _jsxs(Button, { variant: "outline", size: "lg", className: "inline-flex items-center gap-2 bg-transparent", children: [_jsx(Play, { className: "h-4 w-4" }), "Watch Video"] })] })] }), _jsx(motion.div, { className: "w-full lg:w-1/2", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] }, children: _jsx("img", { src: "background/DSCF7704_1200-2-585x390.jpg", alt: "Tour Adventure", className: "w-full h-auto rounded-xl shadow-lg" }) })] }) }) }));
}
