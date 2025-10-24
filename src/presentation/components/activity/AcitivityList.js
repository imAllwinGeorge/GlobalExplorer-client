import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HostService } from "../../../services/HostService";
import ActivityCard from "../common/ActivityCard";
import ActivityDetails from "./ActvityDetails";
import ActivityEdit from "./ActivityEdit";
import toast from "react-hot-toast";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { HttpStatusCode, LOCAL_STORAGE_KEYS, ROLE } from "../../../shared/constants/constants";
import { useEffect } from "react";
const AcitivityList = ({ activities, role, refetch }) => {
    const [selectedActivity, setSelectedActivity] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_ACTIVITY, null);
    const [editActivity, setEditActivity] = useLocalStorage(LOCAL_STORAGE_KEYS.EDIT_ACTIVITY, null);
    const hostService = new HostService();
    const handleEdit = (activity) => {
        setEditActivity(activity);
    };
    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
    };
    const onBack = () => {
        setSelectedActivity(null);
        refetch?.();
    };
    const updateActivity = async (activity, images) => {
        activity.location.coordinates.reverse();
        const data = new FormData();
        data.append("activityName", activity.activityName);
        data.append("itenary", activity.itenary);
        data.append("maxCapacity", activity.maxCapacity.toString());
        data.append("categoryId", activity.categoryId);
        data.append("pricePerHead", activity.pricePerHead.toString());
        data.append("userId", activity.userId);
        data.append("street", activity.street);
        data.append("city", activity.city);
        data.append("district", activity.district);
        data.append("state", activity.state);
        data.append("postalCode", activity.postalCode);
        data.append("country", activity.country);
        data.append("reportingPlace", activity.reportingPlace);
        data.append("reportingTime", activity.reportingTime);
        data.append("existingImage", JSON.stringify(activity.images));
        data.append("location", JSON.stringify(activity.location));
        data.append("recurrenceDays", JSON.stringify(activity.recurrenceDays));
        images.forEach((file) => {
            data.append("images", file);
        });
        try {
            const response = await hostService.editActivity(activity._id, data);
            if (response.status === HttpStatusCode.OK) {
                console.log("edit activity: ", response);
                toast.success("Activity Edited successfully.");
                setEditActivity(null);
                refetch();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    // When either detail or edit is active, hide activity list
    const showOverlay = selectedActivity || editActivity;
    useEffect(() => {
        return () => localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_ACTIVITY);
    }, []);
    return (_jsxs("div", { className: "container mx-auto px-4", children: [!showOverlay && (_jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 text-center mb-8 ", children: "Activities" }), _jsx("div", { className: "space-y-6", children: activities?.map((activity) => (_jsx(ActivityCard, { activity: activity, onEdit: handleEdit, onViewDetails: handleViewDetails, currencySymbol: "$", exchangeRate: 83.5, secondaryCurrency: "INR", buttonTitle: role === ROLE.HOST ? "EDIT" : "Details" }, activity._id))) })] })), selectedActivity && (_jsx("div", { className: "fixed inset-0 z-50 bg-white overflow-y-auto", children: _jsx(ActivityDetails, { role: role, activity: selectedActivity, onEdit: handleEdit, onBack: onBack }) })), editActivity && role === ROLE.HOST && (_jsx("div", { className: "fixed inset-0 z-50 bg-white overflow-y-auto", children: _jsx(ActivityEdit, { activity: editActivity, onSave: updateActivity, onCancel: () => setEditActivity(null) }) }))] }));
};
export default AcitivityList;
