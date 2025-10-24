"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HostService } from "../../../services/HostService";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { HttpStatusCode } from "../../../shared/constants/constants";
// Placeholder function for getting coordinates from address
const getLocationFromAddress = async (address) => {
    // This is a placeholder function - you can integrate with your preferred geocoding API
    // For example: Google Maps Geocoding API, Mapbox, or OpenStreetMap Nominatim
    try {
        // Simulated API call
        console.log("Getting location for address:", address);
        // Return default coordinates for now
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${import.meta.env.VITE_MAP_API}`);
        const result = await response.json();
        // console.log(result);
        const { lat, lng } = result.results[0].geometry;
        // setPosition([lat, lng])
        console.log(lat, lng);
        return [lat, lng];
    }
    catch (error) {
        console.error("Error getting location:", error);
        return [0, 0];
    }
};
const validateActivityForm = (data, selectedDays) => {
    const errors = {};
    if (!data.activityName.trim())
        errors.activityName = "Please provide a valid Activity Name";
    if (data.itenary.trim().split(/\s+/).length <= 20)
        errors.itenary = "Please provide valid itenary. Itenary should atleast 20 words";
    if (data.maxCapacity <= 0)
        errors.maxCapacity = "Max capacity must be greater than 0";
    if (!data.categoryId)
        errors.categoryId = "Please a select a category";
    if (data.pricePerHead <= 0)
        errors.pricePerHead = "Price per head must be greater than 0";
    if (!data.street.trim())
        errors.street = "Street is required";
    if (!data.city.trim())
        errors.city = "city is required";
    if (!data.district.trim())
        errors.district = "District is required";
    if (!data.state.trim())
        errors.state = "State is required";
    if (!data.postalCode.trim())
        errors.postalCode = "Postal Code is required";
    if (!data.country.trim())
        errors.country = "Country is required";
    if (!data.reportingPlace.trim())
        errors.reportingPlace = "Please mention a reporting place";
    if (!data.reportingTime.trim())
        errors.reportingTime = "Select a reporting time";
    if (!data.images || data.images.length === 0) {
        errors.images = "At least one image is required";
    }
    if (!selectedDays || selectedDays.length === 0) {
        errors.recurrenceDays = "At least one recurrence day must be selected";
    }
    return errors;
};
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export default function AddActivity({ onClose }) {
    const user = useSelector((state) => state.host.host);
    const [formData, setFormData] = useState({
        activityName: "",
        itenary: "",
        maxCapacity: 0,
        categoryId: "",
        pricePerHead: 0,
        userId: user?._id || "",
        street: "",
        city: "",
        district: "",
        state: "",
        postalCode: "",
        country: "",
        location: {
            coordinates: [0, 0],
        },
        images: [],
        recurrenceDays: [],
        reportingPlace: "",
        reportingTime: "",
    });
    const [errors, setErrors] = useState();
    const [categories, setCategories] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const hostService = new HostService();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "maxCapacity" || name === "pricePerHead"
                ? Number(value)
                : value,
        }));
    };
    const ChangeView = ({ center }) => {
        const map = useMap();
        map.setView(center); // This moves the map to the new center
        return null;
    };
    const handleAddressChange = async () => {
        const address = `${formData.street}, ${formData.city}, ${formData.district}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;
        if (address.trim().length > 10) {
            try {
                const coordinates = await getLocationFromAddress(address);
                setFormData((prev) => ({
                    ...prev,
                    location: {
                        ...prev.location, coordinates: coordinates
                    },
                }));
            }
            catch (error) {
                console.error("Failed to get location:", error);
            }
        }
    };
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...files],
            }));
        }
    };
    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.location.coordinates.reverse();
        console.log("Activity Data:", formData);
        // Handle form submission here
        const newErrors = validateActivityForm(formData, selectedDays);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log("osdgboasg", newErrors);
            return;
        }
        console.log("kghikshgvkjs");
        const data = new FormData();
        // Append text fields
        data.append("activityName", formData.activityName);
        data.append("itenary", formData.itenary);
        data.append("maxCapacity", formData.maxCapacity.toString());
        data.append("categoryId", formData.categoryId);
        data.append("pricePerHead", formData.pricePerHead.toString());
        data.append("userId", formData.userId);
        data.append("street", formData.street);
        data.append("city", formData.city);
        data.append("district", formData.district);
        data.append("state", formData.state);
        data.append("postalCode", formData.postalCode);
        data.append("country", formData.country);
        data.append("reportingPlace", formData.reportingPlace);
        data.append("reportingTime", formData.reportingTime);
        //Append selected Days
        // selectedDays.forEach(day => {
        //   data.append("recurrenceDays[]", day);
        // })
        data.append("recurrenceDays", JSON.stringify(selectedDays));
        // Append location (as JSON or individual fields)
        data.append("location", JSON.stringify(formData.location));
        // Append images
        formData.images.forEach((file) => {
            data.append("images", file); // backend should use multer or similar
        });
        try {
            console.log("gwsgs");
            const response = await hostService.addActivity(data); // Ensure this sends FormData
            console.log("Success:", response.data);
            if (response.status === HttpStatusCode.CREATED) {
                toast.success("Activity added successfully");
                onClose();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const toggleDay = (day) => {
        const updated = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day)
            : [...selectedDays, day];
        setSelectedDays(updated);
        console.log(updated);
    };
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await hostService.getCategories();
                if (response.status === HttpStatusCode.OK) {
                    setCategories(response.data.categories);
                    console.log(response);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log("Latitude:", pos.coords.latitude);
                console.log("Longitude:", pos.coords.longitude);
                // setPosition([pos.coords.latitude, pos.coords.longitude])
                setFormData((prev) => ({
                    ...prev,
                    location: {
                        ...prev.location, coordinates: [pos.coords.latitude, pos.coords.longitude]
                    },
                }));
            }, (err) => {
                console.error("Geolocation error:", err.message);
            });
        }
        else {
            console.warn("Geolocation not supported");
        }
    }, []);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsx("main", { className: "flex-1 p-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Add New Activity" }), _jsx("p", { className: "text-gray-600", children: "Create a new activity for your guests to explore" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs(motion.section, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 border-b pb-2", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Activity Name *" }), _jsx("input", { type: "text", name: "activityName", value: formData.activityName, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Enter activity name" }), errors?.activityName && _jsx("span", { className: "text-red-500", children: errors.activityName })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category ID *" }), _jsxs("select", { name: "categoryId", value: formData.categoryId, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", children: [_jsx("option", { value: "", children: "Select category" }), categories &&
                                                                    categories.map((category) => (_jsx("option", { value: category._id, children: category.categoryName }, category._id)))] }), errors?.categoryId && _jsx("span", { className: "text-red-500", children: errors.categoryId })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Max Capacity *" }), _jsx("input", { type: "number", name: "maxCapacity", value: formData.maxCapacity, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Maximum participants" }), errors?.maxCapacity && _jsx("span", { className: "text-red-500", children: errors.maxCapacity })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Price Per Head *" }), _jsx("input", { type: "number", name: "pricePerHead", value: formData.pricePerHead, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Price in USD", min: "0", step: "0.01" }), errors?.pricePerHead && _jsx("span", { className: "text-red-500", children: errors.pricePerHead })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [daysOfWeek.map((day) => (_jsx("button", { type: "button", onClick: () => toggleDay(day), className: `py-2 px-3 rounded border ${selectedDays.includes(day)
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-gray-700"}`, children: day.slice(0, 3) }, day))), errors?.recurrenceDays && _jsx("span", { className: "text-red-500", children: errors.activityName })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Itinerary *" }), _jsx("textarea", { name: "itenary", value: formData.itenary, onChange: handleInputChange, rows: 4, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Describe the activity itinerary..." }), errors?.itenary && _jsx("span", { className: "text-red-500", children: errors.itenary })] })] }), _jsxs(motion.section, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 border-b pb-2", children: "Location Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Street Address *" }), _jsx("input", { type: "text", name: "street", value: formData.street, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Street address" }), errors?.street && _jsx("span", { className: "text-red-500", children: errors.street })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "City *" }), _jsx("input", { type: "text", name: "city", value: formData.city, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "City" }), errors?.city && _jsx("span", { className: "text-red-500", children: errors.city })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "District *" }), _jsx("input", { type: "text", name: "district", value: formData.district, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "District" }), errors?.district && _jsx("span", { className: "text-red-500", children: errors.district })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "State *" }), _jsx("input", { type: "text", name: "state", value: formData.state, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "State" }), errors?.state && _jsx("span", { className: "text-red-500", children: errors.state })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Postal Code *" }), _jsx("input", { type: "text", name: "postalCode", value: formData.postalCode, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Postal code" }), errors?.postalCode && _jsx("span", { className: "text-red-500", children: errors.postalCode })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Country *" }), _jsx("input", { type: "text", name: "country", value: formData.country, onChange: handleInputChange, onBlur: handleAddressChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Country" }), errors?.country && _jsx("span", { className: "text-red-500", children: errors.country })] })] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-lg", children: _jsxs(MapContainer, { center: formData.location.coordinates, zoom: 13, scrollWheelZoom: false, style: { height: "300px", width: "100%" }, children: [_jsx(ChangeView, { center: formData.location.coordinates }), _jsx(TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), _jsx(Marker, { position: formData.location.coordinates, children: _jsxs(Popup, { children: ["A pretty CSS3 popup. ", _jsx("br", {}), " Easily customizable."] }) })] }) })] }), _jsxs(motion.section, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 }, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 border-b pb-2", children: "Meeting Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reporting Place *" }), _jsx("input", { type: "text", name: "reportingPlace", value: formData.reportingPlace, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all", placeholder: "Where participants should meet" }), errors?.reportingPlace && _jsx("span", { className: "text-red-500", children: errors.reportingPlace })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reporting Time *" }), _jsx("input", { type: "time", name: "reportingTime", value: formData.reportingTime, onChange: handleInputChange, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" }), errors?.reportingTime && _jsx("span", { className: "text-red-500", children: errors.reportingTime })] })] })] }), _jsxs(motion.section, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4 }, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 border-b pb-2", children: "Activity images" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Upload images" }), _jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: handleImageUpload, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" }), errors?.images && _jsx("span", { className: "text-red-500", children: errors.images })] }), formData.images.length > 0 && (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: formData.images.map((image, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "relative group", children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Activity ${index + 1}`, className: "w-full h-24 object-cover rounded-lg" }), _jsx("button", { type: "button", onClick: () => removeImage(index), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity", children: "\u00D7" })] }, index))) }))] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "flex justify-end space-x-4 pt-6 border-t", children: [_jsx("button", { type: "button", className: "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", onClick: onClose, children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all transform hover:scale-105", children: "Create Activity" })] })] })] }) }) }) }));
}
