import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff, Phone } from "lucide-react";
import { validateSignupForm } from "../../../../shared/validation/validateSignupFrom";
import { AuthAPI } from "../../../../services/AuthAPI";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HttpStatusCode, ROLE } from "../../../../shared/constants/constants";
const SignUP = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: ROLE.USER,
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState({});
    const authAPI = new AuthAPI();
    const navigate = useNavigate();
    const handleChange = (key) => async (e) => {
        setError({});
        setData({ ...data, [key]: e.target.value });
    };
    const handleClick = async (event) => {
        event.preventDefault();
        const errors = validateSignupForm(data);
        if (data.password !== confirmPassword) {
            errors.confirmPassword = "both password and cofirm should be same";
        }
        if (Object.keys(errors).length > 0) {
            return setError(errors);
        }
        try {
            const response = await authAPI.register(data);
            if (response.status === HttpStatusCode.OK) {
                navigate("/verify_otp");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-cover bg-center", style: {
            backgroundImage: "url('/background/iStock-1153641199.jpg')",
        }, children: [_jsx("div", { className: "max-full  md:w-[400px] bg-white p-4 flex flex-col justify-center rounded-3xl m-8 ml-40", children: _jsxs("div", { className: "max-w-[320px] mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-1", children: "Sign UP" }), _jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: "Signup For Better Experience" }), _jsxs("form", { className: "space-y-1", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "firstName", className: "text-sm font-bold text-gray-600", children: "First Name" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "fullName", placeholder: "Enter first name", type: "text", value: data.firstName, className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: handleChange("firstName") }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.firstName && (_jsx("span", { className: "text-red-700", children: error.firstName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "lastName", className: "text-sm font-bold text-gray-600", children: "Last Name" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "lastName", placeholder: "Enter last name", type: "text", value: data.lastName, className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: handleChange("lastName") }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.lastName && (_jsx("span", { className: "text-red-700", children: error.lastName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "email", className: "text-sm font-bold text-gray-600", children: "E-mail" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "email", placeholder: "example@gmail.com", type: "email", value: data.email, className: "pl-3 pr-8 w-full border rounded-md", onChange: handleChange("email") }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M21 5L12 12L3 5", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.email && (_jsx("span", { className: "text-red-700 text-xs", children: error.email }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "phoneNumber", className: "text-sm font-bold text-gray-600", children: "Mobile No" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "phoneNumber", placeholder: "9876543210", type: "tel", value: data.phoneNumber, className: "pl-3 pr-8 w-full border rounded-md", onChange: handleChange("phoneNumber") }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsx(Phone, { size: 16 }) })] }), error.phoneNumber && (_jsx("span", { className: "text-red-700 text-xs", children: error.phoneNumber }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "password", className: "text-sm font-bold text-gray-600", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", placeholder: "* * * * * * * *", type: showPassword ? "text" : "password", value: data.password, className: "pl-3 pr-8 w-full border rounded-md", onChange: handleChange("password") }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), error.password && (_jsx("span", { className: "text-red-700 text-xs", children: error.password }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "confirmPassword", className: "text-sm font-bold text-gray-600", children: "Confirm password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "confirmPassword", placeholder: "* * * * * * * *", type: showConfirmPassword ? "text" : "password", value: confirmPassword, className: "pl-3 pr-8 py-2 w-full border rounded-md", onChange: (e) => setConfirmPassword(e.target.value) }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(EyeOff, { size: 16 })) : (_jsx(Eye, { size: 16 })) })] }), error.confirmPassword && (_jsx("span", { className: "text-red-700 text-xs", children: error.confirmPassword }))] }), _jsx(Button, { onClick: handleClick, disabled: Object.values(data).some((value) => !value) || !confirmPassword, className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2", children: "Register" }), _jsxs("p", { className: "text-xs text-center text-gray-500 mt-4", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-indigo-600 hover:underline", children: "Sign in" })] })] })] }) }), _jsx("div", { children: _jsx("img", { src: "assets/globalexplorer.png", alt: "GlobalExplorer" }) })] }));
};
export default SignUP;
