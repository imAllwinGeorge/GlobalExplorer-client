import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthAPI } from "../../../../services/AuthAPI";
import { useDispatch } from "react-redux";
import { hostRegister } from "../../../store/slices/hostSlice";
import Input from "../../../components/ui/Input";
import { HttpStatusCode } from "../../../../shared/constants/constants";
const HostOtp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [isActive, setIsActive] = useState(true);
    // forgot password time it will be usefull...............
    // const [email, setEmail] = useState("");
    const authAPI = new AuthAPI();
    useEffect(() => {
        const storedExpiry = localStorage.getItem("otp_expiry");
        if (storedExpiry) {
            const expiryTime = parseInt(storedExpiry, 10);
            const now = Date.now();
            const remaining = Math.floor((expiryTime - now) / 1000);
            if (remaining > 0) {
                setTimeLeft(remaining);
                setIsActive(true);
            }
            else {
                setTimeLeft(0);
                setIsActive(false);
                localStorage.removeItem("otp_expiry");
            }
        }
        else {
            // If no expiry time is stored, set default (optional)
            const newExpiry = Date.now() + 120000;
            localStorage.setItem("otp_expiry", newExpiry.toString());
        }
    }, []);
    useEffect(() => {
        let timer = null;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timer !== null)
                            clearInterval(timer);
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer)
                clearInterval(timer);
        };
    }, [isActive, timeLeft]);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!isActive) {
            alert("Time expired! Please resend OTP");
            return;
        }
        try {
            const response = await authAPI.verify(otp);
            console.log("dispatch response: ", response);
            if (response.status === HttpStatusCode.CREATED) {
                dispatch(hostRegister(response.data.user));
                console.log(response);
                navigate("/host/home");
            }
            // need to check at the time of forgot password.....................................
            // else if (response.status === HttpStatusCode.OK) {
            //   setEmail(response.data.user?.email);
            //   navigate("/new-password", { state: { email: email } });
            // }
        }
        catch (error) {
            console.error("verifyOtp error:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("unexpected error occured");
            }
        }
    };
    const handleResendOtp = async () => {
        if (isActive) {
            alert("Please wait for timer to expire");
            return;
        }
        try {
            const response = await authAPI.resendOtp();
            if (response.status === HttpStatusCode.OK) {
                const newExpiry = Date.now() + 120000; // 2 minutes from now
                localStorage.setItem("otp_expiry", newExpiry.toString());
                // Reset timer and states
                setTimeLeft(120);
                setIsActive(true);
            }
        }
        catch (error) {
            console.error("resendOtp error:", error);
        }
    };
    return (_jsxs("div", { className: "max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "OTP Verification" }), _jsxs("form", { onSubmit: (e) => handleVerify(e), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "otp", className: "block text-sm font-medium text-gray-700 mb-2", children: "Enter OTP" }), _jsx(Input, { type: "text", id: "otp", value: otp, onChange: (e) => setOtp(e.target.value), className: "w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent", placeholder: "Enter your OTP" })] }), _jsxs("div", { className: "bg-gray-700 text-white p-4 rounded-md text-center", children: [_jsx("p", { className: "text-sm font-medium mb-1", children: "Time Remaining" }), _jsx("p", { className: "text-2xl font-bold", children: formatTime(timeLeft) })] }), _jsx("button", { type: "submit", disabled: !isActive, className: `w-full py-3 px-4 rounded-md text-white font-medium
            ${isActive
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"} transition duration-150 ease-in-out`, children: "Verify OTP" }), _jsx("button", { type: "button", onClick: handleResendOtp, disabled: isActive, className: `w-full py-3 px-4 rounded-md text-white font-medium
            ${!isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"} transition duration-150 ease-in-out`, children: "Resend OTP" })] })] }));
};
export default HostOtp;
