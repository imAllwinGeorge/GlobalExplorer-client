"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
const RadioGroup = ({ name, options, value, onChange, className = "", }) => {
    return (_jsx("div", { className: `grid w-full ${className} p-2 gap-2`, style: {
            gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }, children: options.map((option, index) => {
            const isSelected = option.value === value;
            return (_jsxs(motion.label, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: `flex items-center justify-center gap-2 py-3 px-4 border rounded-md cursor-pointer select-none transition-all duration-200
              ${isSelected
                    ? "bg-yellow-500 text-white border-yellow-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"}`, children: [_jsx("input", { type: "radio", name: name, value: option.label, checked: isSelected, onChange: () => onChange(option.value), className: "hidden" }), _jsx("span", { className: `w-5 h-5 flex items-center justify-center rounded-full border-2 ${isSelected
                            ? "border-white bg-white text-yellow-500"
                            : "border-gray-400"}`, children: isSelected && _jsx(Check, { size: 14, className: "text-yellow-500" }) }), _jsx("span", { className: "font-medium", children: option.label })] }, index));
        }) }));
};
export default RadioGroup;
