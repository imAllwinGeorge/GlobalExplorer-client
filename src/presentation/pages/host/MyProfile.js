"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Edit, Save, X, User, Mail, Phone, CreditCard, FileText, Shield, Eye, EyeOff, Download, } from "lucide-react";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, } from "../../../components/ui/card";
export default function MyProfile({ initialData }) {
    const [data, setData] = useState(initialData);
    const [editingSections, setEditingSections] = useState({
        personal: false,
        bank: false,
        kyc: false,
        legal: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const handleEdit = (section) => {
        setEditingSections((prev) => ({
            ...prev,
            [section]: true,
        }));
        setErrors({});
    };
    const handleCancel = (section) => {
        setEditingSections((prev) => ({
            ...prev,
            [section]: false,
        }));
        setData(initialData);
        setErrors({});
    };
    const handleSave = (section) => {
        // Basic validation
        const newErrors = {};
        if (section === "personal") {
            if (!data.firstName.trim())
                newErrors.firstName = "First name is required";
            if (!data.lastName.trim())
                newErrors.lastName = "Last name is required";
            if (!data.email.trim())
                newErrors.email = "Email is required";
            if (!data.phoneNumber.trim())
                newErrors.phoneNumber = "Phone number is required";
        }
        if (section === "bank") {
            if (!data.accountHolderName.trim())
                newErrors.accountHolderName = "Account holder name is required";
            if (!data.ifsc.trim())
                newErrors.ifsc = "IFSC is required";
            if (!data.accountNumber.trim())
                newErrors.accountNumber = "Account number is required";
            if (!data.branch.trim())
                newErrors.branch = "Branch is required";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setEditingSections((prev) => ({
            ...prev,
            [section]: false,
        }));
        setErrors({});
        // onSave?.(data)
    };
    const handleInputChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleFileChange = (field, file) => {
        setData((prev) => ({
            ...prev,
            [field]: file,
        }));
    };
    //   const formatFileSize = (bytes: number) => {
    //     if (bytes === 0) return "0 Bytes"
    //     const k = 1024
    //     const sizes = ["Bytes", "KB", "MB", "GB"]
    //     const i = Math.floor(Math.log(bytes) / Math.log(k))
    //     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    //   }
    const FileDisplay = ({ file, label, field, isEditing, }) => {
        if (isEditing) {
            return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { type: "file", accept: ".pdf,.jpg,.jpeg,.png", onChange: (e) => handleFileChange(field, e.target.files?.[0] || null), className: "flex-1" }), file && (_jsxs(Badge, { variant: "secondary", className: "flex items-center space-x-1", children: [_jsx(FileText, { size: 12 }), _jsx("span", { className: "text-xs", children: file })] }))] })] }));
        }
        console.log(file);
        return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(FileText, { className: "text-gray-500", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: label }), file ? (
                                //   <p className="text-xs text-gray-500">
                                //     {file.name} ({formatFileSize(file.size)})
                                //   </p>
                                _jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${file}`, alt: label, className: "w-32 h-32 object-cover border roounded-md" })) : (_jsx("p", { className: "text-xs text-red-500", children: "No file uploaded" }))] })] }), file && (_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Download, { size: 16 }) }))] }));
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Host Profile Details" }), _jsx("p", { className: "text-gray-600 mt-2", children: "View and manage your registration information" })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { className: "text-blue-600", size: 24 }), _jsx(CardTitle, { children: "Personal Information" })] }), !editingSections.personal ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEdit("personal"), children: [_jsx(Edit, { size: 16, className: "mr-2" }), "Edit"] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCancel("personal"), children: [_jsx(X, { size: 16, className: "mr-2" }), "Cancel"] }), _jsxs(Button, { size: "sm", onClick: () => handleSave("personal"), children: [_jsx(Save, { size: 16, className: "mr-2" }), "Save"] })] }))] }), _jsx(CardContent, { className: "space-y-4", children: editingSections.personal ? (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", value: data.firstName, onChange: (e) => handleInputChange("firstName", e.target.value), className: errors.firstName ? "border-red-500" : "" }), errors.firstName && (_jsx("p", { className: "text-red-500 text-xs", children: errors.firstName }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", value: data.lastName, onChange: (e) => handleInputChange("lastName", e.target.value), className: errors.lastName ? "border-red-500" : "" }), errors.lastName && (_jsx("p", { className: "text-red-500 text-xs", children: errors.lastName }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: data.email, onChange: (e) => handleInputChange("email", e.target.value), className: errors.email ? "border-red-500" : "" }), errors.email && (_jsx("p", { className: "text-red-500 text-xs", children: errors.email }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "phoneNumber", children: "Phone Number" }), _jsx(Input, { id: "phoneNumber", value: data.phoneNumber, onChange: (e) => handleInputChange("phoneNumber", e.target.value), className: errors.phoneNumber ? "border-red-500" : "" }), errors.phoneNumber && (_jsx("p", { className: "text-red-500 text-xs", children: errors.phoneNumber }))] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", value: data.password, onChange: (e) => handleInputChange("password", e.target.value), className: "pr-10" }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "absolute right-0 top-0 h-full px-3", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(User, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Full Name" }), _jsxs("p", { className: "font-medium", children: [data.firstName, " ", data.lastName] })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Mail, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Email" }), _jsx("p", { className: "font-medium", children: data.email })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Phone, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Phone Number" }), _jsx("p", { className: "font-medium", children: data.phoneNumber })] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Shield, { className: "text-gray-400", size: 20 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Role" }), _jsx(Badge, { variant: "secondary", children: data.role })] })] })] })) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CreditCard, { className: "text-green-600", size: 24 }), _jsx(CardTitle, { children: "Bank Details" })] }), !editingSections.bank ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEdit("bank"), children: [_jsx(Edit, { size: 16, className: "mr-2" }), "Edit"] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCancel("bank"), children: [_jsx(X, { size: 16, className: "mr-2" }), "Cancel"] }), _jsxs(Button, { size: "sm", onClick: () => handleSave("bank"), children: [_jsx(Save, { size: 16, className: "mr-2" }), "Save"] })] }))] }), _jsx(CardContent, { className: "space-y-4", children: editingSections.bank ? (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "accountHolderName", children: "Account Holder Name" }), _jsx(Input, { id: "accountHolderName", value: data.accountHolderName, onChange: (e) => handleInputChange("accountHolderName", e.target.value), className: errors.accountHolderName ? "border-red-500" : "" }), errors.accountHolderName && (_jsx("p", { className: "text-red-500 text-xs", children: errors.accountHolderName }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "ifsc", children: "IFSC Code" }), _jsx(Input, { id: "ifsc", value: data.ifsc, onChange: (e) => handleInputChange("ifsc", e.target.value), className: errors.ifsc ? "border-red-500" : "" }), errors.ifsc && (_jsx("p", { className: "text-red-500 text-xs", children: errors.ifsc }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "accountNumber", children: "Account Number" }), _jsx(Input, { id: "accountNumber", value: data.accountNumber, onChange: (e) => handleInputChange("accountNumber", e.target.value), className: errors.accountNumber ? "border-red-500" : "" }), errors.accountNumber && (_jsx("p", { className: "text-red-500 text-xs", children: errors.accountNumber }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "branch", children: "Branch" }), _jsx(Input, { id: "branch", value: data.branch, onChange: (e) => handleInputChange("branch", e.target.value), className: errors.branch ? "border-red-500" : "" }), errors.branch && (_jsx("p", { className: "text-red-500 text-xs", children: errors.branch }))] })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Account Holder Name" }), _jsx("p", { className: "font-medium", children: data.accountHolderName || "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "IFSC Code" }), _jsx("p", { className: "font-medium", children: data.ifsc || "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Account Number" }), _jsx("p", { className: "font-medium", children: data.accountNumber
                                                ? `****${data.accountNumber.slice(-4)}`
                                                : "Not provided" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Branch" }), _jsx("p", { className: "font-medium", children: data.branch || "Not provided" })] })] })) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FileText, { className: "text-orange-600", size: 24 }), _jsx(CardTitle, { children: "KYC Documents" })] }), !editingSections.kyc ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEdit("kyc"), children: [_jsx(Edit, { size: 16, className: "mr-2" }), "Edit"] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCancel("kyc"), children: [_jsx(X, { size: 16, className: "mr-2" }), "Cancel"] }), _jsxs(Button, { size: "sm", onClick: () => handleSave("kyc"), children: [_jsx(Save, { size: 16, className: "mr-2" }), "Save"] })] }))] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FileDisplay, { file: data.kyc_panCard, label: "PAN Card", field: "kyc_panCard", isEditing: editingSections.kyc }), _jsx(FileDisplay, { file: data.kyc_idProof, label: "ID Proof", field: "kyc_idProof", isEditing: editingSections.kyc }), _jsx(FileDisplay, { file: data.kyc_addressProof, label: "Address Proof", field: "kyc_addressProof", isEditing: editingSections.kyc })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Shield, { className: "text-purple-600", size: 24 }), _jsx(CardTitle, { children: "Legal Documents" })] }), !editingSections.legal ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEdit("legal"), children: [_jsx(Edit, { size: 16, className: "mr-2" }), "Edit"] })) : (_jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCancel("legal"), children: [_jsx(X, { size: 16, className: "mr-2" }), "Cancel"] }), _jsxs(Button, { size: "sm", onClick: () => handleSave("legal"), children: [_jsx(Save, { size: 16, className: "mr-2" }), "Save"] })] }))] }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsx(FileDisplay, { file: data.registrationCertificate, label: "Registration Certificate", field: "registrationCertificate", isEditing: editingSections.legal }), _jsx(FileDisplay, { file: data.safetyCertificate, label: "Safety Certificate", field: "safetyCertificate", isEditing: editingSections.legal }), _jsx(FileDisplay, { file: data.license, label: "License", field: "license", isEditing: editingSections.legal }), _jsx(FileDisplay, { file: data.insurance, label: "Insurance", field: "insurance", isEditing: editingSections.legal })] }) })] })] }));
}
