"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin, Clock, Users, Calendar, DollarSign, Edit, ArrowLeft, ImageIcon, } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, } from "../../../components/ui/card";
import { Separator } from "@radix-ui/react-select";
import { useState } from "react";
import { adminService } from "../../../services/AdminService";
import { Switch } from "../../../components/ui/switch";
import toast from "react-hot-toast";
import ConfirmModal from "../sharedElements/ConfirmModal";
import { HttpStatusCode, ROLE } from "../../../shared/constants/constants";
export default function ActivityDetails({ role, activity, onEdit, onBack, }) {
    const [statusChange, setStatusChange] = useState(activity.isActive);
    const [selectedActvity, setSelectedActivity] = useState(null);
    const [isModalOpen, setIsModelOpen] = useState(false);
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
    const updateStatus = async () => {
        if (!selectedActvity)
            return;
        try {
            const response = await adminService.updateActivityStatus(selectedActvity?.activityId, {
                isActive: selectedActvity?.status,
            });
            if (response.status === HttpStatusCode.OK) {
                setStatusChange(selectedActvity.status);
                toast.success("Activity Status Changed");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-6", children: [_jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [_jsxs(motion.div, { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center gap-4", children: [onBack && (_jsxs(Button, { variant: "outline", size: "sm", onClick: onBack, children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"] })), _jsx("div", { children: _jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-900", children: activity.activityName }) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [role === ROLE.HOST ? (_jsx(Badge, { variant: activity.isActive ? "default" : "secondary", children: activity.isActive ? "Active" : "Inactive" })) : (_jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "active-status", checked: statusChange, onCheckedChange: (checked) => {
                                                        setSelectedActivity({
                                                            activityId: activity._id,
                                                            status: checked,
                                                        });
                                                        setIsModelOpen(true);
                                                    } }), _jsx("label", { htmlFor: "active-status", children: statusChange ? "Active" : "Inactive" })] }) })), onEdit && role === ROLE.HOST && (_jsxs(Button, { onClick: () => onEdit(activity), className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), "Edit Activity"] }))] })] }), _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(ImageIcon, { className: "w-5 h-5" }), "Activity Images"] }) }), _jsx(CardContent, { children: activity.images.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: activity.images.map((image, index) => (_jsx("div", { className: "relative aspect-video rounded-lg overflow-hidden", children: _jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${image}`, alt: `${activity.activityName} - Image ${index + 1}`, className: "object-cover hover:scale-105 transition-transform duration-300" }) }, index))) })) : (_jsx("div", { className: "aspect-video bg-gray-100 rounded-lg flex items-center justify-center", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx(ImageIcon, { className: "w-12 h-12 mx-auto mb-2" }), _jsx("p", { children: "No images available" })] }) })) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Activity Description" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap", children: activity.itenary || "No description available." }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), "Location Details"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Street Address" }), _jsx("p", { className: "text-gray-900", children: activity.street })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "City" }), _jsx("p", { className: "text-gray-900", children: activity.city })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "District" }), _jsx("p", { className: "text-gray-900", children: activity.district })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "State" }), _jsx("p", { className: "text-gray-900", children: activity.state })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Postal Code" }), _jsx("p", { className: "text-gray-900", children: activity.postalCode })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Country" }), _jsx("p", { className: "text-gray-900", children: activity.country })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-gray-500", children: "Coordinates" }), _jsxs("p", { className: "text-gray-900", children: ["Latitude: ", activity.location.coordinates[1], ", Longitude:", " ", activity.location.coordinates[0]] })] })] })] }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Quick Information" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(DollarSign, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Price per Head" }), _jsx("p", { className: "font-semibold text-lg", children: formatPrice(activity.pricePerHead) })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { className: "w-5 h-5 text-blue-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Max Capacity" }), _jsxs("p", { className: "font-semibold", children: [activity.maxCapacity, " people"] })] })] })] })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5" }), "Reporting Details"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Reporting Place" }), _jsx("p", { className: "font-medium", children: activity.reportingPlace })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Reporting Time" }), _jsx("p", { className: "font-medium", children: activity.reportingTime })] })] })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5" }), "Activity Timeline"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Created At" }), _jsx("p", { className: "text-sm font-medium", children: formatDate(activity.createdAt) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Last Updated" }), _jsx("p", { className: "text-sm font-medium", children: formatDate(activity.updatedAt) })] })] })] }) })] })] })] }), _jsx(ConfirmModal, { isOpen: isModalOpen, onClose: () => setIsModelOpen(false), onConfirm: updateStatus, title: `${selectedActvity?.status ? "Unblock" : "Block"} User`, message: `Are you sure you want to ${selectedActvity?.status ? "Unblock" : "Block"} This Activity?`, confirmText: "Confirm", cancelText: "Cancel", variant: "warning" })] }));
}
