import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { isValidEmail } from "../../../../shared/validation/validations";
import { AuthAPI } from "../../../../services/AuthAPI";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HttpStatusCode } from "../../../../shared/constants/constants";
export default function VerifyEmail() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const { role } = useParams();
    const navigate = useNavigate();
    const authAPI = new AuthAPI();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const errors = isValidEmail(email);
        if (!errors) {
            setError("please Enter valid email");
        }
        try {
            const response = await authAPI.verifyEmail(email, role);
            if (response.status === HttpStatusCode.OK) {
                setIsSubmitted(true);
                toast.success(response.data.message || "Recovery link sented to you email");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
            setIsLoading(false);
        }
    };
    if (isSubmitted) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 p-4", children: _jsx("div", { className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Check your email" }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["We've sent a password reset link to ", _jsx("strong", { children: email })] }), _jsx("button", { onClick: () => navigate("/login"), className: "w-full text-gray-500 py-2 px-4 hover:text-gray-700", children: "\u2190 Back to login" })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 p-4", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Forgot your password?" }), _jsx("p", { className: "text-gray-600", children: "Enter your email address and we'll send you a link to reset your password." })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email address" }), _jsx("input", { id: "email", type: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), required: true, disabled: isLoading, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" })] }), error && (_jsx("div", { className: "mb-4 bg-red-50 border border-red-200 rounded-md p-3", children: _jsx("p", { className: "text-red-800 text-sm", children: error }) })), _jsx("button", { type: "submit", disabled: isLoading || !email.trim(), className: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4", children: isLoading ? "Sending..." : "Send reset link" })] }), _jsx("div", { className: "text-center", children: _jsx("button", { onClick: () => navigate("/login"), className: "text-gray-500 text-sm hover:text-gray-700", children: "\u2190 Back to login" }) })] }) }));
}
