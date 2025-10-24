import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../services/AuthAPI";
import toast from "react-hot-toast";
import { validateHostSignupForm } from "../../../../shared/validation/validateSignupFrom";
import Input from "../../../components/ui/Input";
import { Banknote, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { isValidAccontNumber, isValidIFSC, isValidName, } from "../../../../shared/validation/validations";
import { HttpStatusCode, ROLE } from "../../../../shared/constants/constants";
const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: ROLE.HOST,
    accountHolderName: "",
    ifsc: "",
    accountNumber: "",
    branch: "",
    kyc_idProof: null,
    kyc_addressProof: null,
    kyc_panCard: null,
    registrationCertificate: null,
    safetyCertificate: null,
    license: null,
    insurance: null,
};
const HostSignUp = () => {
    const [data, setData] = useState(initialFormState);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState({});
    const authAPI = new AuthAPI();
    const navigate = useNavigate();
    const registerHost = async () => {
        console.log("data before setting form data: ", data);
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File || typeof value === "string") {
                formData.append(key, value);
            }
        });
        for (const [key, value] of formData) {
            console.log(key, value);
        }
        try {
            const response = await authAPI.register(formData);
            if (response.status === HttpStatusCode.OK) {
                navigate("/host/verify_otp");
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const handleChange = (key, value) => {
        console.log("shgv");
        setError({});
        setData({ ...data, [key]: value });
    };
    const handleClick = async (event) => {
        event.preventDefault();
        const errors = validateHostSignupForm(data);
        if (data.password !== confirmPassword) {
            errors.confirmPassword = "both password and cofirm should be same";
        }
        if (step === 1) {
            if (Object.keys(errors).length > 0) {
                return setError(errors);
            }
            setStep(2);
        }
        if (step === 2) {
            if (!isValidName(data.accountHolderName)) {
                errors.accountHolderName = "name should only contain alphabets";
            }
            if (!isValidIFSC(data.ifsc)) {
                errors.ifsc =
                    "IFSC's first 4 charecters should be alphabets, 5th charecter should be 0, rest 6 should be numbers.";
            }
            if (!isValidAccontNumber(data.accountNumber)) {
                errors.accountNumber = "Account number should 11 to 17 numbers.";
            }
            if (!isValidName(data.branch)) {
                errors.branch = "Branch can only contain alphabets.";
            }
            if (data.kyc_panCard === null) {
                errors.kyc_panCard = "PAN card must be uploaded.";
            }
            if (data.kyc_idProof === null) {
                errors.kyc_idProof = "ID proof shold not be empty";
            }
            if (data.kyc_addressProof === null) {
                errors.kyc_addressProof = "Address proof must be uploaded.";
            }
            if (Object.values(errors).length > 0) {
                return setError(errors);
            }
            setStep(3);
        }
        if (step === 3) {
            if (data.registrationCertificate === null) {
                errors.registrationCertificate =
                    "Please upload registration certificate.";
            }
            if (data.safetyCertificate === null) {
                errors.safetyCertificate = "Please upload safety certificate.";
            }
            if (data.license === null) {
                errors.license = "Please upload License.";
            }
            if (data.insurance === null) {
                errors.insurance = "Please upload insurance.";
            }
            if (Object.values(errors).length > 0) {
                console.log(Object.values(errors));
                return setError(errors);
            }
            registerHost();
        }
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-cover bg-center", style: {
            backgroundImage: "url('/background/iStock-1153641199.jpg')",
        }, children: [_jsx(motion.div, { className: "max-full  md:w-[400px] bg-white p-4 flex flex-col justify-center rounded-3xl m-8 ml-40", initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }, children: _jsxs("div", { className: "max-w-[320px] mx-auto", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-1", children: "Sign UP" }), _jsx("p", { className: "text-sm text-gray-500 text-center mb-6", children: "Signup For Better Experience" }), _jsxs("form", { className: "space-y-1", children: [step === 1 && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0 }, animate: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: 0.8 },
                                    }, children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "firstName", className: "text-sm font-bold text-gray-600", children: "First Name" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "firstName", placeholder: "Enter name", type: "text", value: data.firstName, className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: (e) => handleChange("firstName", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.firstName && (_jsx("span", { className: "text-red-700", children: error.firstName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "lastName", className: "text-sm font-bold text-gray-600", children: "Last Name" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "lastName", placeholder: "Enter name", type: "text", value: data.lastName, className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: (e) => handleChange("lastName", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.lastName && (_jsx("span", { className: "text-red-700", children: error.lastName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "email", className: "text-sm font-bold text-gray-600", children: "E-mail" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "email", placeholder: "example@gmail.com", type: "email", value: data.email, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("email", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M21 5L12 12L3 5", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.email && (_jsx("span", { className: "text-red-700 text-xs", children: error.email }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "phoneNumber", className: "text-sm font-bold text-gray-600", children: "Mobile No" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "phoneNumber", placeholder: "9876543210", type: "tel", value: data.phoneNumber, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("phoneNumber", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsx(Phone, { size: 16 }) })] }), error.phoneNumber && (_jsx("span", { className: "text-red-700 text-xs", children: error.phoneNumber }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "password", className: "text-sm font-bold text-gray-600", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "password", placeholder: "* * * * * * * *", type: showPassword ? "text" : "password", value: data.password, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("password", e.target.value) }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), error.password && (_jsx("span", { className: "text-red-700 text-xs", children: error.password }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "confirmPassword", className: "text-sm font-bold text-gray-600", children: "Confirm password" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "confirmPassword", placeholder: "* * * * * * * *", type: showConfirmPassword ? "text" : "password", value: confirmPassword, className: "pl-3 pr-8 py-2 w-full border rounded-md", onChange: (e) => setConfirmPassword(e.target.value) }), _jsx("button", { type: "button", className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(EyeOff, { size: 16 })) : (_jsx(Eye, { size: 16 })) })] }), error.confirmPassword && (_jsx("span", { className: "text-red-700 text-xs", children: error.confirmPassword }))] }), _jsx(Button, { onClick: handleClick, 
                                            //   disabled={
                                            //     Object.values(data).some((value) => !value) ||
                                            //     !confirmPassword
                                            //   }
                                            className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2", children: "Next" }), _jsx("button", { onClick: () => setStep(2), children: "Next" })] })), step === 2 && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0 }, animate: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: 0.8 },
                                    }, children: [_jsx("h1", { children: "Bank Details" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "accountHolderName", className: "text-sm font-bold text-gray-600", children: "Account Holder Name" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "accountHolderName", placeholder: "Enter name", type: "text", value: data.accountHolderName, className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: (e) => handleChange("accountHolderName", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.accountHolderName && (_jsx("span", { className: "text-red-700", children: error.accountHolderName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "ifsc", className: "text-sm font-bold text-gray-600", children: "IFSC" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "ifsc", placeholder: "IFSC", type: "text", value: data.ifsc, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("ifsc", e.target.value) }) }), error.ifsc && (_jsx("span", { className: "text-red-700 text-xs", children: error.ifsc }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "accountNumber", className: "text-sm font-bold text-gray-600", children: "Account Number" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "accountNumber", placeholder: "* * * * * * * * * *", type: "number", value: data.accountNumber, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("accountNumber", e.target.value) }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsx(Banknote, { size: 16 }) })] }), error.accountNumber && (_jsx("span", { className: "text-red-700 text-xs", children: error.accountNumber }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "branch", className: "text-sm font-bold text-gray-600", children: "Branch" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "branch", placeholder: "* * * * * * * *", type: "text", value: data.branch, className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => handleChange("branch", e.target.value) }) }), error.branch && (_jsx("span", { className: "text-red-700 text-xs", children: error.branch }))] }), _jsx("h1", { children: "KYC Details" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "kyc_panCard", className: "text-sm font-bold text-gray-600", children: "PAN Card" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "kyc_panCard", name: "kyc-panCard", type: "file", className: "pl-3 pr-8 py-2 w-full border rounded-md", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleChange("kyc_panCard", file);
                                                            }
                                                        } }) }), error.kyc_panCard && (_jsx("span", { className: "text-red-700 text-xs", children: error.kyc_panCard }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "kyc_idProof", className: "text-sm font-bold text-gray-600", children: "ID Proof" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "kyc_idProof", type: "file", name: "kyc-idProof", className: "pl-3 pr-8 py-2 w-full border rounded-md", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleChange("kyc_idProof", file);
                                                            }
                                                        } }) }), error.kyc_idProof && (_jsx("span", { className: "text-red-700 text-xs", children: error.kyc_idProof }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "kyc_addressProof", className: "text-sm font-bold text-gray-600", children: "Address Proof" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "kyc_addressProof", type: "file", name: "kyc_addressProof", className: "pl-3 pr-8 py-2 w-full border rounded-md", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleChange("kyc_addressProof", file);
                                                            }
                                                        } }) }), error.kyc_addressProof && (_jsx("span", { className: "text-red-700 text-xs", children: error.kyc_addressProof }))] }), _jsx(Button, { onClick: handleClick, 
                                            //   disabled={
                                            //     Object.values(data).some((value) => !value) ||
                                            //     !confirmPassword
                                            //   }
                                            className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2", children: "Next" }), _jsx("button", { onClick: () => setStep(3), children: "Next" })] })), step === 3 && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0 }, animate: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: 0.8 },
                                    }, children: [_jsx("h1", { children: "Legal Documents" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "registrationCertificate", className: "text-sm font-bold text-gray-600", children: "Registration Certificate" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "registrationCertificate", type: "file", name: "registrationCertificate", className: "pl-3 pr-8 py-1 w-full border rounded-md", onChange: (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleChange("registrationCertificate", file);
                                                                }
                                                            } }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("path", { d: "M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.registrationCertificate && (_jsx("span", { className: "text-red-700", children: error.registrationCertificate }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "safetyCertificate", className: "text-sm font-bold text-gray-600", children: "Safety Certificate" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "safetyCertificate", type: "file", name: "safetyCertificate", className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleChange("safetyCertificate", file);
                                                                }
                                                            } }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M21 5L12 12L3 5", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2", stroke: "currentColor", strokeWidth: "1.5" })] }) })] }), error.safetyCertificate && (_jsx("span", { className: "text-red-700 text-xs", children: error.safetyCertificate }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "license", className: "text-sm font-bold text-gray-600", children: "License" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "license", type: "file", name: "license", className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleChange("license", file);
                                                                }
                                                            } }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400", children: _jsx(Banknote, { size: 16 }) })] }), error.license && (_jsx("span", { className: "text-red-700 text-xs", children: error.license }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "insurance", className: "text-sm font-bold text-gray-600", children: "Insurance" }), _jsx("div", { className: "relative", children: _jsx(Input, { id: "insurance", type: "file", name: "insurance", className: "pl-3 pr-8 w-full border rounded-md", onChange: (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleChange("insurance", file);
                                                            }
                                                        } }) }), error.insurance && (_jsx("span", { className: "text-red-700 text-xs", children: error.insurance }))] }), _jsx(Button, { onClick: handleClick, 
                                            // disabled={
                                            //   Object.values(data).some((value) => !value) ||
                                            //   !confirmPassword
                                            // }
                                            className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2", children: "Next" }), _jsx("button", { onClick: () => setStep(3), children: "Next" })] })), _jsxs("p", { className: "text-xs text-center text-gray-500 mt-4", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-indigo-600 hover:underline", children: "Sign in" })] })] })] }) }), _jsx("div", { children: _jsx("img", { src: "/assets/globalexplorer.png", alt: "GlobalExplorer" }) })] }));
};
export default HostSignUp;
