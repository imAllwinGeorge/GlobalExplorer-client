"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { ImageOffIcon, UploadCloudIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import Input from "../ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../../../components/ui/card";
const fieldVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};
function ImageUploadField({ id, label, currentImageUrl, onChange, }) {
    // const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    // const [tempUrl, setTempUrl] = useState("") // For direct URL input
    // Effect to create and revoke object URLs for file previews
    // useEffect(() => {
    //   if (selectedFile) {
    //     const url = URL.createObjectURL(selectedFile)
    //     setFilePreviewUrl(url)
    //     return () => {
    //       URL.revokeObjectURL(url)
    //     }
    //   }
    //   setFilePreviewUrl(null)
    // }, [selectedFile])
    // Reset internal state when currentImageUrl changes from parent (e.g., role switch)
    useEffect(() => {
        // setSelectedFile(null)
        setFilePreviewUrl(null);
        // setTempUrl("")
        setShowUrlInput(false);
    }, [currentImageUrl]);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            // setSelectedFile(e.target.files[0])
            onChange(id, e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setFilePreviewUrl(url);
            // Simulate upload and update parent state with a new URL (e.g., a placeholder)
            // In a real app, you'd upload the file and get a real URL back.
            // onChange(id, `/placeholder.svg?height=128&width=256&text=${label.replace(/\s/g, "+")}+Uploaded`)
            setShowUrlInput(false); // Hide URL input after file selection
        }
    };
    // const handleSaveUrl = () => {
    //   onChange(id, tempUrl)
    //   setShowUrlInput(false)
    //   setSelectedFile(null) // Clear any file preview if URL is manually saved
    // }
    // const handleDelete = () => {
    //   setSelectedFile(null)
    //   setFilePreviewUrl(null)
    //   setTempUrl("")
    //   setShowUrlInput(false)
    // }
    const handleUploadNew = () => {
        // setSelectedFile(null) // Clear any existing file selection
        setFilePreviewUrl(null);
        // setTempUrl("") // Clear temp URL when opening for new upload
        setShowUrlInput(true);
    };
    const displayImageSrc = filePreviewUrl || `${import.meta.env.VITE_IMG_URL}${currentImageUrl}`;
    return (_jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: id, children: label }), _jsx(AnimatePresence, { mode: "wait", children: (currentImageUrl || filePreviewUrl) && !showUrlInput ? (_jsxs(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: fieldVariants, className: "relative group", children: [_jsx("img", { src: displayImageSrc || "/placeholder.svg", alt: label, className: "w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700", onError: (e) => {
                                e.currentTarget.src =
                                    "/placeholder.svg?height=128&width=256&text=Image+Load+Error";
                                e.currentTarget.alt = "Image not found or failed to load";
                            } }), _jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md", children: _jsx(Button, { type: "button", variant: "secondary", size: "icon", onClick: handleUploadNew, "aria-label": `Upload new ${label}`, children: _jsx(UploadCloudIcon, { className: "h-5 w-5" }) }) })] }, "image-preview")) : (_jsxs(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: fieldVariants, className: "flex flex-col gap-2", children: [_jsx(Input, { id: id, type: "file", onChange: handleFileChange, accept: "image/*" }), _jsx("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: _jsx(Button, { type: "button", variant: "outline", onClick: () => setShowUrlInput(false), className: "flex-1", children: "Cancel" }) })] }, "upload-input")) }), !currentImageUrl && !filePreviewUrl && !showUrlInput && (_jsxs(Button, { variant: "outline", onClick: () => setShowUrlInput(true), className: "w-full", children: [_jsx(UploadCloudIcon, { className: "mr-2 h-4 w-4" }), " Upload ", label] })), !currentImageUrl && !filePreviewUrl && !showUrlInput && (_jsx("div", { className: "flex items-center justify-center h-32 w-full rounded-md border border-dashed text-muted-foreground", children: _jsx(ImageOffIcon, { className: "h-8 w-8" }) }))] }));
}
// --- End ImageUploadField Component ---
export default function MyProfile({ role, initialData, onEdit, }) {
    const [formData, setFormData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [newImgFields, setNewImgFields] = useState({});
    // Reset formData when role changes to ensure correct initial data for the new role
    useEffect(() => {
        setFormData(initialData);
    }, [role, initialData]);
    const handleChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }, []);
    // const handleDelete = useCallback((id: string) => {
    //   const {id: __unused, ...rest} = formData
    //   setFormData({...rest})
    // })
    // Handler for ImageUploadField
    const handleImageChange = useCallback((id, value) => {
        console.log(id, value);
        setNewImgFields((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        console.log(newImgFields);
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Saving profile data:", formData);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "string") {
                data.append(key, value);
            }
        });
        Object.entries(newImgFields).forEach(([key, file]) => {
            if (file instanceof File) {
                data.append(key, file);
            }
        });
        await onEdit(data);
        setIsSaving(false);
        // alert("Profile updated successfully!")
    };
    const renderFields = () => {
        switch (role) {
            case "admin": {
                const adminData = formData;
                return (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: adminData.email, onChange: handleChange, required: true })] }, "admin-email"), _jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: adminData.password || "", onChange: handleChange })] }, "admin-password")] }));
            }
            case "user": {
                const userData = formData;
                return (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-4", variants: fieldVariants, children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", type: "text", value: userData.firstName, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", type: "text", value: userData.lastName, onChange: handleChange, required: true })] })] }, "user-name-fields"), _jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: userData.email, onChange: handleChange, required: true })] }, "user-email"), _jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "phoneNumber", children: "Phone Number" }), _jsx(Input, { id: "phoneNumber", type: "tel", value: userData.phoneNumber, onChange: handleChange, required: true })] }, "user-phone")] }));
            }
            case "host": {
                const hostData = formData;
                return (_jsxs(_Fragment, { children: [_jsxs(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 gap-4", variants: fieldVariants, children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "firstName", children: "First Name" }), _jsx(Input, { id: "firstName", type: "text", value: hostData.firstName, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "lastName", children: "Last Name" }), _jsx(Input, { id: "lastName", type: "text", value: hostData.lastName, onChange: handleChange, required: true })] })] }, "host-name-fields"), _jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: hostData.email, onChange: handleChange, required: true })] }, "host-email"), _jsxs(motion.div, { className: "space-y-2", variants: fieldVariants, children: [_jsx("label", { htmlFor: "phoneNumber", children: "Phone Number" }), _jsx(Input, { id: "phoneNumber", type: "tel", value: hostData.phoneNumber, onChange: handleChange, required: true })] }, "host-phone"), _jsx("h3", { className: "text-lg font-semibold mt-6 border-b pb-2", children: "KYC Documents" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsx(ImageUploadField, { id: "kyc_idProof", label: "KYC ID Proof", currentImageUrl: hostData.kyc_idProof || "", onChange: handleImageChange }), _jsx(ImageUploadField, { id: "kyc_addressProof", label: "KYC Address Proof", currentImageUrl: hostData.kyc_addressProof || "", onChange: handleImageChange }), _jsx(ImageUploadField, { id: "kyc_panCard", label: "KYC Pan Card", currentImageUrl: hostData.kyc_panCard || "", onChange: handleImageChange })] }), _jsx("h3", { className: "text-lg font-semibold mt-6 border-b pb-2", children: "Bank Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "accountNumber", children: "Account Number" }), _jsx(Input, { id: "accountNumber", type: "text", value: hostData.accountNumber, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "accountHolderName", children: "Account Holder Name" }), _jsx(Input, { id: "accountHolderName", type: "text", value: hostData.accountHolderName, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "branch", children: "Branch" }), _jsx(Input, { id: "branch", type: "text", value: hostData.branch, onChange: handleChange, required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "ifsc", children: "IFSC Code" }), _jsx(Input, { id: "ifsc", type: "text", value: hostData.ifsc, onChange: handleChange, required: true })] })] }), _jsx("h3", { className: "text-lg font-semibold mt-6 border-b pb-2", children: "Certificates & Licenses" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsx(ImageUploadField, { id: "registrationCertificate", label: "Registration Certificate", currentImageUrl: hostData.registrationCertificate || "", onChange: handleImageChange }), _jsx(ImageUploadField, { id: "safetyCertificate", label: "Safety Certificate", currentImageUrl: hostData.safetyCertificate || "", onChange: handleImageChange }), _jsx(ImageUploadField, { id: "license", label: "License", currentImageUrl: hostData.license || "", onChange: handleImageChange }), _jsx(ImageUploadField, { id: "insurance", label: "Insurance", currentImageUrl: hostData.insurance || "", onChange: handleImageChange })] })] }));
            }
            default:
                return null;
        }
    };
    return (_jsxs(Card, { className: "w-full max-w-4xl mx-auto my-8", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "capitalize", children: [role, " Profile"] }), _jsxs(CardDescription, { children: ["Manage your ", role, " account details."] })] }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(AnimatePresence, { mode: "wait", children: renderFields() }), _jsx(CardFooter, { className: "flex justify-end p-0 pt-6", children: _jsx(Button, { type: "submit", disabled: isSaving, children: isSaving ? "Saving..." : "Save Profile" }) })] }) })] }));
}
