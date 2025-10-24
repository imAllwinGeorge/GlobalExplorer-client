import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateLoginForm } from "../../../shared/validation/validateLoginForm";
import { AuthAPI } from "../../../services/AuthAPI";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";
import { HttpStatusCode, ROLE } from "../../../shared/constants/constants";
const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const authAPI = new AuthAPI();
    const validateForm = () => {
        const data = { email, password };
        const newErrors = validateLoginForm(data);
        return newErrors;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const validation = validateForm();
            if (Object.keys(validation).length > 0) {
                setErrors(validation);
                return;
            }
            const data = {
                email,
                password,
                role: ROLE.ADMIN,
            };
            const response = await authAPI.login(data);
            if (response.status === HttpStatusCode.OK) {
                console.log(response.data);
                setTimeout(() => {
                    dispatch(adminLogin(response.data.user));
                    navigate("/admin/users");
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-black", children: _jsxs("div", { className: "flex flex-col md:flex-row w-full max-w-5xl rounded-lg shadow-lg overflow-hidden", children: [_jsx("div", { className: "hidden md:block w-1/2 bg-cover bg-center relative", style: {
                        backgroundImage: "url('/background/hiking-quotes-1586278882.jpg')",
                    } }), _jsxs("div", { className: "w-full md:w-1/2 bg-black text-white p-8", children: [_jsx("h1", { className: "text-3xl text-amber-400 font-bold mb-4 text-center", children: "Admin Login" }), _jsx("p", { className: "text-white text-2xl mb-6 text-center", children: "Only admins are allowed to login through this interface" }), _jsxs("form", { onSubmit: (e) => handleSubmit(e), className: "space-y-6 bg-black ", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-lg font-medium mb-2", children: "Email address" }), _jsx("input", { id: "email", type: "email", value: email, name: "email", placeholder: "admin@email.com", className: "w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none", onChange: (e) => setEmail(e.target.value) }), errors.email && (_jsx("span", { className: "text-red-500 text-sm", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-lg font-medium mb-2", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, name: "password", placeholder: "Enter your password", className: "w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none", onChange: (e) => setPassword(e.target.value) }), errors.password && (_jsx("span", { className: "text-red-500 text-sm", children: errors.password }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "remember", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked), className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("label", { htmlFor: "remember", className: "ml-2 text-sm", children: "Remember me" })] }), _jsx(Link, { to: "/forgot-password", className: "text-sm text-blue-500 hover:underline", children: "Forgot Password?" })] }), _jsx("button", { type: "submit", className: "w-full py-3 rounded-md bg-amber-500 hover:bg-amber-600 transition duration-300 text-white font-bold", children: "Login Account" })] })] })] }) }));
};
export default AdminLogin;
