"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { User, Mail, Phone, CreditCard, FileText, Shield, Download, } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, } from "../../../components/ui/card";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../../../services/AdminService";
import ConfirmModal from "../../components/sharedElements/ConfirmModal";
import RejectionModal from "../../components/sharedElements/RejectionModal";
import { HttpStatusCode, ROLE } from "../../../shared/constants/constants";
export default function AdminHostDetails() {
    const [data, setData] = useState({});
    const [status, setStatus] = useState({});
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const { id, role } = useParams();
    // const [errors, setErrors] = useState<HostSignupFormErrors>({})
    // const handleEdit = (section: keyof typeof editingSections) => {
    //   setEditingSections((prev) => ({
    //     ...prev,
    //     [section]: true,
    //   }))
    //   setErrors({})
    // }
    // const handleCancel = (section: keyof typeof editingSections) => {
    //   setEditingSections((prev) => ({
    //     ...prev,
    //     [section]: false,
    //   }))
    //   setData(initialData)
    //   setErrors({})
    // }
    // const handleSave = (section: keyof typeof editingSections) => {
    //   // Basic validation
    //   const newErrors: HostSignupFormErrors = {}
    //   if (section === "personal") {
    //     if (!data.firstName.trim()) newErrors.firstName = "First name is required"
    //     if (!data.lastName.trim()) newErrors.lastName = "Last name is required"
    //     if (!data.email.trim()) newErrors.email = "Email is required"
    //     if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    //   }
    //   if (section === "bank") {
    //     if (!data.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required"
    //     if (!data.ifsc.trim()) newErrors.ifsc = "IFSC is required"
    //     if (!data.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
    //     if (!data.branch.trim()) newErrors.branch = "Branch is required"
    //   }
    //   if (Object.keys(newErrors).length > 0) {
    //     setErrors(newErrors)
    //     return
    //   }
    //   setEditingSections((prev) => ({
    //     ...prev,
    //     [section]: false,
    //   }))
    //   setErrors({})
    //   // onSave?.(data)
    // }
    const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Verified", value: "verified" },
        { label: "Rejected", value: "reject" },
    ];
    const handleStatusChange = (newStatus, id, role) => {
        setStatus({ newStatus, id, role });
        if (newStatus.isVerified === "reject") {
            setIsRejected(true);
        }
        else {
            setIsModelOpen(true);
        }
    };
    const handleStatus = async (statusObj = status) => {
        try {
            console.log(statusObj);
            const response = await adminService.updateStatus(statusObj.id, statusObj.newStatus, statusObj.role);
            console.log("host verifiction response ", response);
            if (response.status === HttpStatusCode.OK) {
                toast.success("status updated!");
                setData(response.data.user);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
        finally {
            setIsModelOpen(false);
            setIsRejected(false);
        }
    };
    useEffect(() => {
        const fetchUser = async (id, role) => {
            try {
                const response = await adminService.getUserDetails(id, role);
                if (response &&
                    response.status === HttpStatusCode.OK &&
                    role === ROLE.HOST) {
                    setData(response.data.user); // type cast safely
                }
                else {
                    toast.error("Invalid user data");
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchUser(id, role);
    }, [id, role]);
    const FileDisplay = ({ file, label, }) => {
        return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(FileText, { className: "text-gray-500", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: label }), file ? (_jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${file}`, alt: label, className: "w-32 h-32 object-cover border roounded-md" })) : (_jsx("p", { className: "text-xs text-red-500", children: "No file uploaded" }))] })] }), file && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                        const link = document.createElement("a");
                        link.href = `${file}`; // your cloudinary image url
                        link.download = "my-image.jpg"; // optional name
                        link.target = "_blank";
                        link.click();
                    }, children: _jsx(Download, { size: 16 }) }))] }));
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Host Profile Details" }), _jsx("p", { className: "text-gray-600 mt-2", children: "View and manage your registration information" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { className: "text-blue-600", size: 24 }), _jsx(CardTitle, { children: "Personal Information" })] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(User, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Full Name" }), _jsxs("p", { className: "font-medium", children: [data.firstName, " ", data.lastName] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Mail, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Email" }), _jsx("p", { className: "font-medium", children: data.email })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Phone, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Phone Number" }), _jsx("p", { className: "font-medium", children: data.phoneNumber })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Shield, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Role" }), _jsx(Badge, { variant: "secondary", children: data.role })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CreditCard, { className: "text-green-600", size: 24 }), _jsx(CardTitle, { children: "Bank Details" })] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Account Holder Name" }), _jsx("p", { className: "font-medium", children: data.accountHolderName || "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "IFSC Code" }), _jsx("p", { className: "font-medium", children: data.ifsc || "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Account Number" }), _jsx("p", { className: "font-medium", children: data.accountNumber
                                                ? `****${data.accountNumber.slice(-4)}`
                                                : "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Branch" }), _jsx("p", { className: "font-medium", children: data.branch || "Not provided" })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FileText, { className: "text-orange-600", size: 24 }), _jsx(CardTitle, { children: "KYC Documents" }), _jsx(Button, { className: "bg-orange-400 font-bold", onClick: () => {
                                        const newStatus = { kyc_verified: !data.kyc_verified };
                                        handleStatus({ newStatus, id: data._id, role: data.role });
                                    }, children: data.kyc_verified ? "Verified" : "pending" })] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FileDisplay, { file: data.kyc_panCard, label: "PAN Card" }), _jsx(FileDisplay, { file: data.kyc_idProof, label: "ID Proof" }), _jsx(FileDisplay, { file: data.kyc_addressProof, label: "Address Proof" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Shield, { className: "text-purple-600", size: 24 }), _jsx(CardTitle, { children: "Legal Documents" })] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FileDisplay, { file: data.registrationCertificate, label: "Registration Certificate" }), _jsx(FileDisplay, { file: data.safetyCertificate, label: "Safety Certificate" }), _jsx(FileDisplay, { file: data.license, label: "License" }), _jsx(FileDisplay, { file: data.insurance, label: "Insurance" })] }) })] }), _jsxs("div", { className: "w-48", children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsxs("select", { id: "status", value: data.isVerified, onChange: (e) => handleStatusChange({ isVerified: e.target.value }, data._id, data.role), className: "block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { disabled: true, value: "", children: "Select Status" }), statusOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value)))] })] }), _jsx(ConfirmModal, { isOpen: isModalOpen, onClose: () => setIsModelOpen(false), onConfirm: handleStatus, title: "Verify Host Details", message: `Are you sure you want to ${status.newStatus?.isVerified}?`, confirmText: "Confirm", cancelText: "Cancel", variant: "warning" }), _jsx(RejectionModal, { isOpen: isRejected, onclose: () => setIsRejected(false), onConfirm: (message) => {
                    const updatedStatus = {
                        ...status,
                        newStatus: {
                            ...status.newStatus,
                            reasonForRejection: message,
                        },
                    };
                    handleStatus(updatedStatus); // ✅ Safely use the new data
                } })] }));
}
