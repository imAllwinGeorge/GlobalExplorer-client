import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import Carousel from "../../components/common/Carousel";
import ActivityCard from "../../components/common/ActivityCard";
import { useNavigate } from "react-router-dom";
import { HttpStatusCode } from "../../../shared/constants/constants";
import SearchBox from "../../components/sharedElements/Search-box";
const ActivityPageUser = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activities, setActivities] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const handleCardClick = (activity) => {
        console.log("Card clicked:", activity.activityName);
        // Handle card click - navigate to details page, etc.
        navigate(`/activity-details/${activity._id}`);
    };
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await userService.getAllActivities(page, 6, searchQuery);
                if (response.status === HttpStatusCode.OK) {
                    setActivities(response.data.activities);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error("error fetching data...");
                }
            }
        };
        fetchActivities();
    }, [page, searchQuery]);
    return (_jsxs("div", { children: [_jsx(SearchBox, { placeholder: "Search for activities.....", onSearch: (query) => setSearchQuery(query) }), activities && (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsx(Carousel, { activities: activities, onCardClick: handleCardClick, title: "Popular Activities" }) })), _jsxs("div", { className: "container mx-auto px-8 md:px-10 lg:px-14", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Activities" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: activities?.map((activity) => (_jsx(ActivityCard, { activity: activity, onEdit: () => navigate(`/activity-details/${activity._id}`), onViewDetails: () => navigate(`/activity-details/${activity._id}`), currencySymbol: "$", exchangeRate: 83.5, secondaryCurrency: "INR", buttonTitle: "Details" }, activity._id))) })] }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] }));
};
export default ActivityPageUser;
