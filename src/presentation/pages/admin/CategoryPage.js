"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/ui/Input";
import { isValidName } from "../../../shared/validation/validations";
import { adminService } from "../../../services/AdminService";
import ConfirmModal from "../../components/sharedElements/ConfirmModal";
import toast from "react-hot-toast";
import { Pencil, Plus, X } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { HttpStatusCode } from "../../../shared/constants/constants";
import SearchBox from "../../components/sharedElements/Search-box";
const CategoryPage = () => {
    const [data, setData] = useState({
        categoryName: "",
        description: "",
    });
    const [editData, setEditData] = useState({
        categoryName: "",
        description: " ",
    });
    const [category, setCategory] = useState(null);
    const [error, setError] = useState({});
    const [triggerFetch, setTriggerFetch] = useState(true);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const handleChange = (key) => (e) => {
        setData({ ...data, [key]: e.target.value });
    };
    const handleEditChange = (key) => (e) => {
        setEditData({ ...editData, [key]: e.target.value });
    };
    const submitForm = async (event) => {
        event.preventDefault();
        const errors = {};
        if (!isValidName(data.categoryName)) {
            errors.categoryName = "category Name can only contain alphabets";
        }
        else if (!data.description.trim()) {
            errors.description = "This field cannot be empty";
        }
        if (Object.keys(errors).length > 0) {
            return setError(errors);
        }
        try {
            const response = await adminService.addCategory(data);
            if (response.status === HttpStatusCode.CREATED) {
                setTriggerFetch((prev) => !prev);
                setData({ categoryName: "", description: "" });
                setError({});
                toast.success("Success. Category Added");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const handleCategoryState = async () => {
        if (!selectedCategory)
            return;
        const toastId = toast.loading("Loading....");
        try {
            const response = await adminService.updateCategoryStatus({
                _id: selectedCategory?._id,
                value: { isActive: !selectedCategory?.isActive },
            });
            if (response.status === HttpStatusCode.OK) {
                toast.dismiss(toastId);
                toast.success(`Category ${!selectedCategory.isActive ? "activated" : "deactivated"}`);
                setSelectedCategory(null);
                setTriggerFetch((prev) => !prev);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const editCategory = async () => {
        if (!editData || !selectedCategory)
            return;
        console.log("sghiwghwsghhsgjksdhgkhasklghjklasdhgjklvasdjklfgjklsdhgjkhasdkjfg", editData);
        try {
            const response = await adminService.editCategory({
                _id: selectedCategory._id,
                value: {
                    categoryName: editData.categoryName,
                    description: editData.description,
                },
            });
            if (response.status === HttpStatusCode.OK) {
                setTriggerFetch((prev) => !prev);
                setOpenEditModal(false);
                setData({ categoryName: "", description: "" });
                setSelectedCategory(null);
                toast.success("Category Edited successfully...");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await adminService.getCategories(page, 5, searchQuery);
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setCategory(response.data.categories);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchCategory();
    }, [triggerFetch, page, searchQuery]);
    useEffect(() => {
        if (selectedCategory && openEditModal) {
            setData({
                categoryName: selectedCategory.categoryName,
                description: selectedCategory.description,
            });
        }
    }, [selectedCategory, openEditModal]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-4 lg:p-8", children: [_jsxs("div", { className: "max-w-7xl mx-auto space-y-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4", children: _jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [_jsx(Plus, { className: "w-6 h-6" }), "Add Category"] }) }), _jsx("div", { className: "p-6", children: _jsxs("form", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, className: "space-y-2", children: [_jsx("label", { htmlFor: "categoryName", className: "text-sm font-medium text-gray-700", children: "Category Name" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "categoryName", type: "text", placeholder: "Enter category name", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200", value: data.categoryName, onChange: handleChange("categoryName") }) }), _jsx(AnimatePresence, { children: error.categoryName && (_jsx(motion.span, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-red-500 text-sm", children: error.categoryName })) })] }), _jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, className: "space-y-2", children: [_jsx("label", { htmlFor: "description", className: "text-sm font-medium text-gray-700", children: "Description" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "description", type: "text", placeholder: "Enter category description", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200", value: data.description, onChange: handleChange("description") }) }), _jsx(AnimatePresence, { children: error.description && (_jsx(motion.span, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-red-500 text-sm", children: error.description })) })] }), _jsx(motion.button, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "button", onClick: submitForm, disabled: !data.categoryName || !data.description, className: "w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed", children: "Add Category" })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4", children: _jsx("h1", { className: "text-2xl font-bold text-white", children: "Category Details" }) }), _jsxs("div", { className: "overflow-x-auto", children: [_jsx(SearchBox, { placeholder: "Search for categories.....", onSearch: (query) => setSearchQuery(query) }), _jsxs("table", { className: "min-w-full", children: [_jsx("thead", { className: "bg-orange-50 border-b border-orange-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-orange-800", children: "#" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-orange-800", children: "Category Name" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-orange-800 hidden md:table-cell", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-orange-800", children: "Action" })] }) }), _jsx("tbody", { children: _jsx(AnimatePresence, { children: category &&
                                                        category.map((cate, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { delay: index * 0.1 }, className: "hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100", children: [_jsx("td", { className: "px-6 py-4 text-gray-900 font-medium", children: index + 1 }), _jsx("td", { className: "px-6 py-4 text-gray-900 font-medium", children: cate.categoryName }), _jsx("td", { className: "px-6 py-4 text-gray-600 hidden md:table-cell", children: cate.description }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [_jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${cate.isActive
                                                                                    ? "bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50"
                                                                                    : "bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"}`, onClick: () => {
                                                                                    setIsModelOpen(true);
                                                                                    setSelectedCategory(cate);
                                                                                }, children: cate.isActive ? "Deactivate" : "Activate" }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50 flex items-center justify-center", onClick: () => {
                                                                                    setSelectedCategory(cate);
                                                                                    setOpenEditModal(true);
                                                                                    setEditData(cate);
                                                                                }, children: _jsx(Pencil, { className: "w-4 h-4" }) })] }) })] }, cate._id))) }) })] })] })] })] }), _jsx(AnimatePresence, { children: openEditModal && selectedCategory && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-white", children: "Edit Category" }), _jsx("button", { onClick: () => {
                                            setOpenEditModal(false);
                                            setSelectedCategory(null);
                                            setData({ categoryName: "", description: "" });
                                        }, className: "text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "p-6", children: _jsxs("form", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "editCategoryName", className: "text-sm font-medium text-gray-700", children: "Category Name" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "editCategoryName", type: "text", placeholder: "Category Name", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200", value: editData.categoryName, onChange: handleEditChange("categoryName") }) }), _jsx(AnimatePresence, { children: error.categoryName && (_jsx(motion.span, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-red-500 text-sm", children: error.categoryName })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "editDescription", className: "text-sm font-medium text-gray-700", children: "Description" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "editDescription", type: "text", placeholder: "Description", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200", value: editData.description, onChange: handleEditChange("description") }) }), _jsx(AnimatePresence, { children: error.description && (_jsx(motion.span, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "text-red-500 text-sm", children: error.description })) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "button", onClick: () => {
                                                        setOpenEditModal(false);
                                                        setSelectedCategory(null);
                                                        setData({ categoryName: "", description: "" });
                                                    }, className: "flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200", children: "Cancel" }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "button", onClick: editCategory, disabled: !data.categoryName || !data.description, className: "flex-1 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed", children: "Update" })] })] }) })] }) })) }), _jsx(ConfirmModal, { isOpen: isModalOpen, onClose: () => setIsModelOpen(false), onConfirm: handleCategoryState, title: `${selectedCategory?.isActive ? "Deactivate" : "Activate"} Category`, message: `Are you sure you want to ${selectedCategory?.isActive ? "Deactivate" : "Activate"} ${selectedCategory?.categoryName}?`, confirmText: "Confirm", cancelText: "Cancel", variant: "warning" }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] }));
};
export default CategoryPage;
