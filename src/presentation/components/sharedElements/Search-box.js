"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Input from "../ui/Input";
export default function SearchBox({ placeholder = "Search...", onSearch, initialValue = "", debounceMs = 500, }) {
    const [query, setQuery] = useState(initialValue);
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, debounceMs);
        return () => clearTimeout(timer);
    }, [query, onSearch, debounceMs]);
    return (_jsxs("div", { className: "relative m-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx(Input, { type: "text", placeholder: placeholder, value: query, onChange: (e) => setQuery(e.target.value), className: "pl-10 pr-4 py-2 w-full" })] }));
}
