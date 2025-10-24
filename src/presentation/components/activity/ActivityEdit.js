import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { easeOut, motion } from "framer-motion";
import { Save, ArrowLeft, MapPin, DollarSign, Clock, ImageIcon, X, } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, } from "../../../components/ui/card";
import Input from "../ui/Input";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "../../../components/ui/separator";
import { Switch } from "../../../components/ui/switch";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import toast from "react-hot-toast";
import { HostService } from "../../../services/HostService";
import ConfirmModal from "../sharedElements/ConfirmModal";
import { HttpStatusCode } from "../../../shared/constants/constants";
// Placeholder function for getting coordinates from address
const getLocationFromAddress = async (address) => {
    // This is a placeholder function - you can integrate with your preferred geocoding API
    // For example: Google Maps Geocoding API, Mapbox, or OpenStreetMap Nominatim
    try {
        // Simulated API call
        console.log("Getting location for address:", address);
        // Return default coordinates for now
        const response = await fetch(`${import.meta.env.VITE_GET_GEOLOCATION}${encodeURIComponent(address)}&key=${import.meta.env.VITE_MAP_API}`);
        const result = await response.json();
        // console.log(result);
        const { lat, lng } = result.results[0].geometry;
        // setPosition([lat, lng])
        return [lat, lng];
    }
    catch (error) {
        console.error("Error getting location:", error);
        return [0, 0];
    }
};
const validateActivityForm = (data) => {
    const errors = {};
    if (!data.activityName.trim())
        errors.activityName = "Please provide a valid Activity Name";
    if (data.itenary.trim().split(/\s+/).length <= 20)
        errors.itenary =
            "Please provide valid itenary. Itenary should atleast 20 words";
    if (data.maxCapacity <= 0)
        errors.maxCapacity = "Max capacity must be greater than 0";
    if (!data.categoryId)
        errors.categoryId = "";
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
    return errors;
};
export default function ActivityEdit({ activity, onSave, onCancel, isLoading = false, }) {
    console.log(activity);
    const [formData, setFormData] = useState({
        ...activity,
        location: {
            ...activity.location,
            coordinates: [...activity.location.coordinates].reverse(),
        },
        updatedAt: new Date(),
    });
    console.log(formData);
    const [images, setImages] = useState([]);
    const [statusChange, setStatusChange] = useState(activity.isActive);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [errors, setErrors] = useState();
    const hostService = new HostService();
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "maxCapacity" || field === "pricePerHead"
                ? Number(value)
                : value,
        }));
    };
    const handleLocationChange = (index, value) => {
        const newLocation = [...formData.location.coordinates];
        newLocation[index] = Number.parseFloat(value) || 0;
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                coordinates: newLocation,
            },
        }));
    };
    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateActivityForm(formData);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave?.(formData, images);
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
    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3, ease: easeOut },
        },
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
                        ...prev.location,
                        coordinates: coordinates,
                    },
                }));
            }
            catch (error) {
                console.error("Failed to get location:", error);
            }
        }
    };
    const updateStatus = async () => {
        if (!selectedActivity)
            return;
        try {
            const response = await hostService.updateStatus(selectedActivity?.activityId, { isActive: selectedActivity?.status });
            if (response.status === HttpStatusCode.OK) {
                toast.success(response.data.message || "status changed successfull");
                setStatusChange(selectedActivity.status);
                setFormData((prev) => ({ ...prev, isActive: selectedActivity.status }));
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 py-6", children: [_jsxs("div", { className: "container mx-auto px-4 max-w-4xl", children: [_jsxs(motion.div, { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4", initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center gap-4", children: [onCancel && (_jsxs(Button, { variant: "outline", size: "sm", onClick: onCancel, children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Cancel"] })), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-900", children: "Edit Activity" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Activity Name: ", activity.activityName] })] })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "active-status", checked: statusChange, onCheckedChange: (checked) => {
                                                setSelectedActivity({
                                                    activityId: activity._id,
                                                    status: checked,
                                                });
                                                setIsModelOpen(true);
                                                // updateStatus(activity._id, checked)
                                            } }), _jsx("label", { htmlFor: "active-status", children: formData.isActive ? "Active" : "Inactive" })] }) })] }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-6", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Basic Information" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: _jsxs("div", { children: [_jsx("label", { htmlFor: "activityName", children: "Activity Name *" }), _jsx(Input, { id: "activityName", value: formData.activityName, onChange: (e) => handleInputChange("activityName", e.target.value) }), errors?.activityName && (_jsx("span", { className: "text-red-500", children: errors.activityName }))] }) }), _jsxs("div", { children: [_jsx("label", { htmlFor: "itenary", children: "Activity Description" }), _jsx(Textarea, { id: "itenary", value: formData.itenary, onChange: (e) => handleInputChange("itenary", e.target.value), rows: 4, placeholder: "Describe the activity, what's included, and what guests can expect..." }), errors?.itenary && (_jsx("span", { className: "text-red-500", children: errors.itenary }))] })] })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(DollarSign, { className: "w-5 h-5" }), "Pricing & Capacity"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "pricePerHead", children: "Price per Head (USD) *" }), _jsx(Input, { id: "pricePerHead", type: "number", min: "0", step: "0.01", value: formData.pricePerHead, onChange: (e) => handleInputChange("pricePerHead", Number.parseFloat(e.target.value) || 0) }), errors?.pricePerHead && (_jsx("span", { className: "text-red-500", children: errors.pricePerHead }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "maxCapacity", children: "Maximum Capacity *" }), _jsx(Input, { id: "maxCapacity", type: "number", min: "1", value: formData.maxCapacity, onChange: (e) => handleInputChange("maxCapacity", Number.parseInt(e.target.value) || 1) }), errors?.maxCapacity && (_jsx("span", { className: "text-red-500", children: errors.maxCapacity }))] })] }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), "Location Information"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "street", children: "Street Address *" }), _jsx(Input, { id: "street", value: formData.street, onChange: (e) => handleInputChange("street", e.target.value), onBlur: handleAddressChange }), errors?.street && (_jsx("span", { className: "text-red-500", children: errors.street }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "city", children: "City *" }), _jsx(Input, { id: "city", value: formData.city, onChange: (e) => handleInputChange("city", e.target.value), onBlur: handleAddressChange }), errors?.city && (_jsx("span", { className: "text-red-500", children: errors.city }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "district", children: "District" }), _jsx(Input, { id: "district", value: formData.district, onChange: (e) => handleInputChange("district", e.target.value), onBlur: handleAddressChange }), errors?.district && (_jsx("span", { className: "text-red-500", children: errors.district }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "state", children: "State *" }), _jsx(Input, { id: "state", value: formData.state, onChange: (e) => handleInputChange("state", e.target.value), onBlur: handleAddressChange }), errors?.state && (_jsx("span", { className: "text-red-500", children: errors.state }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "postalCode", children: "Postal Code" }), _jsx(Input, { id: "postalCode", value: formData.postalCode, onChange: (e) => handleInputChange("postalCode", e.target.value), onBlur: handleAddressChange }), errors?.postalCode && (_jsx("span", { className: "text-red-500", children: errors.postalCode }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "country", children: "Country *" }), _jsx(Input, { id: "country", value: formData.country, onChange: (e) => handleInputChange("country", e.target.value), onBlur: handleAddressChange }), errors?.country && (_jsx("span", { className: "text-red-500", children: errors.country }))] }), _jsx("div", { className: "w-full bg-gray-50 p-4 rounded-lg", children: _jsxs(MapContainer, { center: formData.location.coordinates, zoom: 13, scrollWheelZoom: false, style: { height: "300px", width: "200%" }, children: [_jsx(ChangeView, { center: formData.location.coordinates }), _jsx(TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), _jsx(Marker, { position: formData.location.coordinates, children: _jsxs(Popup, { children: ["A pretty CSS3 popup. ", _jsx("br", {}), " Easily customizable."] }) })] }) })] }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "latitude", children: "Latitude" }), _jsx(Input, { id: "latitude", type: "number", step: "any", value: formData.location.coordinates[0], onChange: (e) => handleLocationChange(0, e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "longitude", children: "Longitude" }), _jsx(Input, { id: "longitude", type: "number", step: "any", value: formData.location.coordinates[1], onChange: (e) => handleLocationChange(1, e.target.value) })] })] })] })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5" }), "Reporting Details"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "reportingPlace", children: "Reporting Place *" }), _jsx(Input, { id: "reportingPlace", value: formData.reportingPlace, onChange: (e) => handleInputChange("reportingPlace", e.target.value) }), errors?.reportingPlace && (_jsx("span", { className: "text-red-500", children: errors.reportingPlace }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "reportingTime", children: "Reporting Time *" }), _jsx(Input, { id: "reportingTime", value: formData.reportingTime, onChange: (e) => handleInputChange("reportingTime", e.target.value), placeholder: "e.g., 2:00 PM" }), errors?.reportingPlace && (_jsx("span", { className: "text-red-500", children: errors.reportingPlace }))] })] }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(ImageIcon, { className: "w-5 h-5" }), "Activity Images"] }), errors?.images && (_jsx("span", { className: "text-red-500", children: errors.images }))] }), _jsxs(CardContent, { className: "space-y-4", children: [formData.images.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { children: "Current Images" }), _jsx("div", { className: "space-y-2", children: formData.images.map((image, index) => (_jsxs("div", { className: "flex items-center gap-2 p-2 border rounded", children: [_jsx(motion.div, { variants: imageVariants, className: "h-full p-5", children: _jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${image}`, alt: image, width: 400, height: 300, className: "w-full h-64 lg:h-full object-cover rounded-3xl" }) }), _jsx(Button, { type: "button", variant: "outline", size: "sm", className: "hover:bg-red-500", onClick: () => removeImage(index), children: _jsx(X, { className: "w-4 h-4 " }) })] }, index))) })] })), _jsxs(motion.section, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.4 }, className: "space-y-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 border-b pb-2", children: "Activity images" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Upload images" }), _jsx("input", { type: "file", multiple: true, accept: "image/*", onChange: (e) => {
                                                                            const files = e.target.files
                                                                                ? Array.from(e.target.files)
                                                                                : [];
                                                                            setImages((prev) => [...prev, ...files]);
                                                                        }, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: images.map((image, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "relative group", children: [_jsx("img", { src: URL.createObjectURL(image), alt: `Activity ${index + 1}`, className: "w-full h-24 object-cover rounded-lg" }), _jsx("button", { type: "button", onClick: () => setImages((prev) => prev.filter((_, i) => i !== index)), className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity", children: "\u00D7" })] }, index))) })] })] })] }) }), _jsxs(motion.div, { variants: itemVariants, className: "flex justify-end gap-4 pt-6", children: [onCancel && (_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" })), _jsxs(Button, { type: "submit", disabled: isLoading, className: "bg-green-600 hover:bg-green-700", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isLoading ? "Saving..." : "Save Changes"] })] })] }) })] }), _jsx(ConfirmModal, { isOpen: isModalOpen, onClose: () => setIsModelOpen(false), onConfirm: updateStatus, title: `${selectedActivity?.status ? "Unblock" : "Block"} Activity`, message: `Are you sure you want to ${selectedActivity?.status ? "Unblock" : "Block"} This Activity?`, confirmText: "Confirm", cancelText: "Cancel", variant: "warning" })] }));
}
