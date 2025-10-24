import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { validateLoginForm } from "../../../../shared/validation/validateLoginForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../../../components/ui/Input";
import { AuthAPI } from "../../../../services/AuthAPI";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hostLogin } from "../../../store/slices/hostSlice";
import { HttpStatusCode, ROLE } from "../../../../shared/constants/constants";
const HostLogin = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        role: ROLE.HOST,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authAPI = new AuthAPI();
    const handleChange = (key) => async (e) => {
        setError({});
        setData({ ...data, [key]: e.target.value });
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        const errors = validateLoginForm(data);
        if (Object.keys(errors).length > 0) {
            return setError(errors);
        }
        try {
            const response = await authAPI.login(data);
            if (response.status === HttpStatusCode.OK) {
                dispatch(hostLogin(response.data.user));
                navigate("/host/home");
            }
        }
        catch (error) {
            console.log("login error message: ", error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (_jsx("div", { className: "flex min-h-screen bg-cover bg-center", style: {
            backgroundImage: "url('/background/hiking-quotes-1586278882.jpg')",
        }, children: _jsxs("div", { className: "w-full md:w-[500px] bg-white/90 p-8 flex flex-col justify-center", children: [_jsx("div", { className: "w-auto h-auto", children: _jsx("img", { src: "/assets/globalexplorer.png", alt: "GlobalExplorer" }) }), _jsxs("div", { className: "max-w-[500px] mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-1", children: "Login" }), _jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: "Welcome back! Please login to your account." }), _jsxs("form", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "email", className: "text-sm text-gray-600", children: "E-mail" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "email", type: "email", placeholder: "example@gmail.com", className: "pl-3 pr-8 py-2 w-full border rounded-md", value: data.email, onChange: handleChange("email") }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" })] }), error.email && (_jsx("span", { className: "text-red-700 text-xs", children: error.email }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "password", className: "text-sm text-gray-600", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", type: showPassword ? "text" : "password", placeholder: "* * * * * * * *", className: "pl-3 pr-8 py-2 w-full border rounded-md", value: data.password, onChange: handleChange("password") }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), error.password && (_jsx("span", { className: "text-red-700 text-xs", children: error.password }))] }), _jsx("button", { type: "button", onClick: handleLogin, disabled: !data.email || !data.password, className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2", children: "Login" }), _jsx(Link, { to: "/forgot-password", state: ROLE.HOST, className: " text-indigo-600 hover:underline", children: "forgot password" }), _jsxs("p", { className: "text-xs text-center text-gray-500 mt-4", children: ["Don't have an account?", " ", _jsx(Link, { to: "/host/signup", className: "text-indigo-600 hover:underline", children: "Sign up" })] })] })] })] }) }));
};
export default HostLogin;
