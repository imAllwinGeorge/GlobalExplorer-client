import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import AddActivity from "../../components/activity/AddActivity";
import AcitivityList from "../../components/activity/AcitivityList";
import { useSelector } from "react-redux";
import { hostService } from "../../../services/HostService";
import Pagination from "../../components/common/Pagination";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { HttpStatusCode, LOCAL_STORAGE_KEYS, OPTIONS, ROLE } from "../../../shared/constants/constants";
import SearchBox from "../../components/sharedElements/Search-box";
import RadioGroup from "../../../components/ui/RadioGroup";
const ActivityPage = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [activities, setActivities] = useState(null);
    const [page, setPage] = useLocalStorage(LOCAL_STORAGE_KEYS.HOST_ACTIVITY_PAGE, 1);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState(OPTIONS.host[0].value);
    const [triggerFetch, setTriggerFetch] = useState(true);
    const user = useSelector((state) => state.host.host);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const fetchActivity = async () => {
            if (!user)
                return;
            try {
                const response = await hostService.getActivities(user?._id, page, 6, searchQuery, selected);
                if (response.status === HttpStatusCode.OK) {
                    console.log("fetched activities", response);
                    setActivities(response.data.activities);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchActivity();
        return () => {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.HOST_ACTIVITY_PAGE);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, triggerFetch, searchQuery, selected]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "container mx-auto px-4 py-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl md:text-3xl font-bold text-gray-900", children: "Activities" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Manage your activities and create new experiences" })] }), _jsxs(Button, { onClick: () => setIsOpenModal(true), className: "bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Activity" })] })] }) }) }), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx(SearchBox, { placeholder: "search for activities.....", onSearch: (query) => setSearchQuery(query) }), _jsx(RadioGroup, { name: "activities", value: selected, options: OPTIONS.host, onChange: setSelected }), activities && (_jsx("div", { className: "mb-8", children: _jsx(AcitivityList, { activities: activities, role: ROLE.HOST, refetch: () => setTriggerFetch((prev) => !prev) }) })), (!activities || activities.length === 0) && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx(Plus, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No activities yet" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Get started by creating your first activity" }), _jsxs(Button, { onClick: () => setIsOpenModal(true), className: "bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add Your First Activity" })] })] })), activities && activities.length > 0 && (_jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) }))] }), isOpenModal && (_jsx("div", { className: "fixed inset-0 z-[9999] bg-black/50 bg-opacity-50 overflow-y-auto", children: _jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-3xl", children: _jsx(AddActivity, { onClose: () => {
                                setIsOpenModal(false);
                                setTriggerFetch((prev) => !prev);
                            } }) }) }) }))] }));
};
export default ActivityPage;
