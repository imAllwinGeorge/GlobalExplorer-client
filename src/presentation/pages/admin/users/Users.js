import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/sharedElements/ConfirmModal";
import { adminService } from "../../../../services/AdminService";
import toast from "react-hot-toast";
import Pagination from "../../../components/common/Pagination";
import { HttpStatusCode, ROLE } from "../../../../shared/constants/constants";
import SearchBox from "../../../components/sharedElements/Search-box";
import RadioGroup from "../../../../components/ui/RadioGroup";
// import { toast } from 'react-toastify';
const options = [
    { label: "Active Users", value: false },
    { label: "Blocked Users", value: true },
];
const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState(options[0].value);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await adminService.getAllUsers(page, 5, "user", searchQuery, selected);
                console.log("response fetchuserdata: ", response);
                if (response) {
                    setUsers(response.users);
                    setTotalPages(response.totalPages);
                    //   toast(response)
                }
            }
            catch (error) {
                console.log("fetch users", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchUserData();
    }, [page, searchQuery, selected]);
    const handleUserState = async () => {
        if (!selectedUser)
            return null;
        try {
            const toastId = toast.loading("Loading.....");
            const value = {
                isBlocked: !selectedUser.isBlocked,
            };
            const response = await adminService.updateStatus(selectedUser._id, value, ROLE.USER);
            if (response.status === HttpStatusCode.OK) {
                const updatedUsers = users.filter((user) => {
                    if (user._id !== response.data.user._id) {
                        return user;
                    }
                });
                console.log(updatedUsers);
                setUsers(updatedUsers);
                console.log(response);
                toast.dismiss(toastId);
                console.log("response changeing status", response);
                toast.success(response.data.message || "qwertyui");
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    return (_jsxs("div", { className: "users-container bg-white text-gray-800 p-8 rounded-xl shadow-lg", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-yellow-700", children: "User Details" }), _jsx(SearchBox, { placeholder: "Search for users.............", onSearch: (query) => setSearchQuery(query) }), _jsx(RadioGroup, { name: "status", options: options, value: selected, onChange: setSelected }), _jsx("div", { className: "overflow-x-auto rounded-lg shadow border border-gray-200", children: _jsxs("table", { className: "min-w-full bg-white", children: [_jsx("thead", { className: "bg-yellow-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "#" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "First Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "Last Name" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "Email" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "Phone" }), _jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-yellow-800", children: "Action" })] }) }), _jsx("tbody", { children: users.map((user, index) => (_jsxs("tr", { className: "hover:bg-yellow-50 transition duration-150 border-b border-gray-100", children: [_jsx("td", { className: "px-4 py-3", children: index + 1 }), _jsx("td", { className: "px-4 py-3", children: user.firstName }), _jsx("td", { className: "px-4 py-3", children: user.lastName }), _jsx("td", { className: "px-4 py-3", children: user.email }), _jsx("td", { className: "px-4 py-3", children: user.phoneNumber }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { className: `px-4 py-1 rounded-md font-medium transition duration-150 ${user.isBlocked
                                                ? "bg-white text-yellow-700 border border-yellow-600 hover:bg-yellow-100"
                                                : "bg-yellow-500 text-white hover:bg-yellow-600"}`, onClick: () => {
                                                setIsModelOpen(true);
                                                setSelectedUser(user);
                                            }, children: user.isBlocked ? "Unblock" : "Block" }) })] }, user._id))) })] }) }), _jsx(ConfirmModal, { isOpen: isModalOpen, onClose: () => setIsModelOpen(false), onConfirm: handleUserState, title: `${selectedUser?.isBlocked ? "Unblock" : "Block"} User`, message: `Are you sure you want to ${selectedUser?.isBlocked ? "Unblock" : "Block"} ${selectedUser?.firstName} ${selectedUser?.lastName}?`, confirmText: "Confirm", cancelText: "Cancel", variant: "warning" }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] }));
};
export default Users;
