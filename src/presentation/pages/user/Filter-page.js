"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
// import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { HttpStatusCode, LOCAL_STORAGE_KEYS } from "../../../shared/constants/constants";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import SearchBox from "../../components/sharedElements/Search-box";
import ActivityCard from "../../components/common/ActivityCard";
import { useNavigate } from "react-router-dom";
const distanceOptions = [
    { value: "", label: "Any distance" },
    { value: "5000", label: "Within 5km" },
    { value: "15000", label: "5km - 15km" },
    { value: "30000", label: "15km - 30km" },
    { value: "50000", label: "30km - 50km" },
    { value: "50000+", label: "50km+" },
];
// const priceRanges = [
//   { value: "", label: "Any price" },
//   { value: "0-50", label: "Under $50" },
//   { value: "50-100", label: "$50 - $100" },
//   { value: "100-200", label: "$100 - $200" },
//   { value: "200-500", label: "$200 - $500" },
//   { value: "500+", label: "$500+" },
// ];
// // Placeholder function for fetching filtered activities - replace with your API call
// async function fetchFilteredActivities(
//   filters: FilterState
// ): Promise<Activity[]> {
//   // Replace this with your actual API call
//   console.log("Fetching activities with filters:", filters);
//   return [];
// }
export default function FilterPage({ onFiltersChange, className = "", }) {
    //   const router = useRouter()
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_FILTER_PAGE, 1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTERS, {
        search: "",
        category: "",
        distance: "",
        priceRange: "",
        lat: 0,
        lng: 0,
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [triggerFetch, setTriggerFetch] = useState(true);
    // Load categories on mount
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await userService.getCategories();
                if (response.status === HttpStatusCode.OK) {
                    setCategories(response.data.categories);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        }
        fetchCategories();
    }, []);
    useEffect(() => {
        const controller = new AbortController();
        async function fetchActivities() {
            try {
                setIsLoading(true);
                console.log(filters);
                const response = await userService.filterSearch(page, 9, filters);
                if (response.status === HttpStatusCode.OK) {
                    setActivities(response.data.activities);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchActivities();
        return () => {
            controller.abort(); // abort on dependency change or unmount
        };
    }, [filters, page, triggerFetch]);
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log("Latitude:", pos.coords.latitude);
                console.log("Longitude:", pos.coords.longitude);
                // setPosition([pos.coords.latitude, pos.coords.longitude])
                // setFormData((prev) => ({
                //   ...prev,
                //   location: {
                //     ...prev.location, coordinates: [pos.coords.latitude, pos.coords.longitude]
                //   },
                // }));
                setFilters((prev) => ({
                    ...prev,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }));
            }, (err) => {
                console.error("Geolocation error:", err.message);
            }, {
                enableHighAccuracy: true, // ✅ Request high accuracy (uses GPS when available)
                timeout: 10000, // ✅ Wait up to 10 seconds
                maximumAge: 0, // ✅ Don't use cached position
            });
        }
        else {
            console.warn("Geolocation not supported");
        }
    }, [setFilters]);
    useEffect(() => {
        return () => {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.FILTERS);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_FILTER_PAGE);
        };
    }, []);
    const handleSearch = useCallback((query) => {
        setFilters((prev) => ({ ...prev, search: query }));
    }, [setFilters]);
    //   const applyFilters = useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //       const filteredActivities = await fetchFilteredActivities(filters);
    //       setActivities(filteredActivities);
    //       onFiltersChange?.(filters);
    //     } catch (error) {
    //       console.error("Error fetching activities:", error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   }, [filters, onFiltersChange]);
    const clearFilters = () => {
        const clearedFilters = {
            search: "",
            category: "",
            distance: "",
            priceRange: "",
            lat: filters.lat,
            lng: filters.lng,
        };
        setFilters(clearedFilters);
        onFiltersChange?.(clearedFilters);
    };
    const hasActiveFilters = Object.values(filters).some((value) => value !== "");
    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    return (_jsxs("div", { className: `space-y-6 px-4 md:px-6 lg:px-12 xl:px-20 ${className}`, children: [_jsx("div", { className: "lg:hidden", children: _jsxs("button", { onClick: () => setShowMobileFilters(!showMobileFilters), className: "flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors", children: [_jsx(Filter, { className: "h-4 w-4" }), "Filters", hasActiveFilters && (_jsx("span", { className: "bg-orange-700 text-xs px-2 py-1 rounded-full", children: Object.values(filters).filter((v) => v !== "").length }))] }) }), _jsx(AnimatePresence, { children: (showMobileFilters || window.innerWidth >= 1024) && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-orange-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Filter Activities" })] }), _jsx("div", { className: "lg:hidden", children: _jsx("button", { onClick: () => setShowMobileFilters(false), className: "p-1 hover:bg-gray-100 rounded-full transition-colors", children: _jsx(X, { className: "h-4 w-4" }) }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search Activities" }), _jsx(SearchBox, { placeholder: "Search by name, location, or description...", onSearch: handleSearch, initialValue: filters.search })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category" }), _jsxs("select", { value: filters.category, onChange: (e) => updateFilter("category", e.target.value), className: "w-full px-3 py-2 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors", children: [_jsx("option", { value: "", children: "All Categories" }), categories.map((category) => (_jsx("option", { value: category._id, children: category.categoryName }, category._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Distance" }), _jsx("select", { value: filters.distance, onChange: (e) => updateFilter("distance", e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors", children: distanceOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100", children: [_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setTriggerFetch((prev) => !prev), disabled: isLoading, className: "flex-1 sm:flex-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium", children: isLoading ? "Searching..." : "Apply Filters" }), hasActiveFilters && (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: clearFilters, className: "px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium", children: "Clear All" }))] })] })] }) })) }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h2", { className: "text-xl font-semibold text-gray-900", children: ["Tour Activities", activities.length > 0 && (_jsxs("span", { className: "text-gray-500 font-normal ml-2", children: ["(", activities.length, " found)"] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [activities?.map((activity) => (_jsx(ActivityCard, { activity: activity, onEdit: () => navigate(`/activity-details/${activity._id}`), onViewDetails: () => navigate(`/activity-details/${activity._id}`), currencySymbol: "$", exchangeRate: 83.5, secondaryCurrency: "INR", buttonTitle: "Details" }, activity._id))), isLoading && (_jsx("div", { className: "col-span-full flex items-center justify-center py-12", children: _jsxs("div", { className: "flex items-center gap-3 text-gray-600", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" }), _jsx("span", { children: "Loading activities..." })] }) })), !isLoading && activities.length === 0 && hasActiveFilters && (_jsx("div", { className: "col-span-full text-center py-12", children: _jsxs("div", { className: "text-gray-500 space-y-2", children: [_jsx("p", { className: "text-lg", children: "No activities found matching your criteria" }), _jsx("p", { className: "text-sm", children: "Try adjusting your filters or search terms" }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: clearFilters, className: "mt-4 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium", children: "Clear all filters" })] }) }))] })] }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] }));
}
