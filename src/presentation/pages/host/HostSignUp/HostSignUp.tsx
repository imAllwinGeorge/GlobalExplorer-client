import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../../../services/AuthAPI";
import toast from "react-hot-toast";
import { validateHostSignupForm } from "../../../../shared/validation/validateSignupFrom";
import type { HostSignupFormErrors } from "../../../../shared/types/auth.type";
import Input from "../../../components/Input";
import { Banknote, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  isValidAccontNumber,
  isValidIFSC,
  isValidName,
} from "../../../../shared/validation/validations";

export type HostFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  accountHolderName: string;
  ifsc: string;
  accountNumber: string;
  branch: string;
  kyc_idProof: File | null;
  kyc_addressProof: File | null;
  kyc_panCard: File | null;
  registrationCertificate: File | null;
  safetyCertificate: File | null;
  license: File | null;
  insurance: File | null;
};

const initialFormState: HostFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  role: "host",
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
  const [data, setData] = useState<HostFormData>(initialFormState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const [error, setError] = useState<HostSignupFormErrors>({});

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
      if (response.status === 200) {
        navigate("/host/verify_otp");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleChange = (key: string, value: File | string) => {
    console.log("shgv");
    setError({});
    setData({ ...data, [key]: value });
  };

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const errors: HostSignupFormErrors = validateHostSignupForm(data);

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
  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background/iStock-1153641199.jpg')",
      }}
    >
      {/* Form */}
      <motion.div
        className="max-full  md:w-[400px] bg-white p-4 flex flex-col justify-center rounded-3xl m-8 ml-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
      >
        <div className="max-w-[320px] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-1">Sign UP</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Signup For Better Experience
          </p>

          <form className="space-y-1">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8 },
                }}
              >
                <div className="space-y-1">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-bold text-gray-600"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      placeholder="Enter name"
                      type="text"
                      value={data.firstName}
                      className="pl-3 pr-8 py-1 w-full border rounded-md"
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.firstName && (
                    <span className="text-red-700">{error.firstName}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-bold text-gray-600"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      placeholder="Enter name"
                      type="text"
                      value={data.lastName}
                      className="pl-3 pr-8 py-1 w-full border rounded-md"
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.lastName && (
                    <span className="text-red-700">{error.lastName}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-gray-600"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="example@gmail.com"
                      type="email"
                      value={data.email}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 5L12 12L3 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.email && (
                    <span className="text-red-700 text-xs">{error.email}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-bold text-gray-600"
                  >
                    Mobile No
                  </label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      placeholder="9876543210"
                      type="tel"
                      value={data.phoneNumber}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={16} />
                    </div>
                  </div>
                  {error.phoneNumber && (
                    <span className="text-red-700 text-xs">
                      {error.phoneNumber}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-600"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="* * * * * * * *"
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error.password && (
                    <span className="text-red-700 text-xs">
                      {error.password}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-bold text-gray-600"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      placeholder="* * * * * * * *"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      className="pl-3 pr-8 py-2 w-full border rounded-md"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {error.confirmPassword && (
                    <span className="text-red-700 text-xs">
                      {error.confirmPassword}
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleClick}
                  //   disabled={
                  //     Object.values(data).some((value) => !value) ||
                  //     !confirmPassword
                  //   }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2"
                >
                  Next
                </Button>
                <button onClick={() => setStep(2)}>Next</button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8 },
                }}
              >
                <h1>Bank Details</h1>
                <div className="space-y-1">
                  <label
                    htmlFor="accountHolderName"
                    className="text-sm font-bold text-gray-600"
                  >
                    Account Holder Name
                  </label>
                  <div className="relative">
                    <Input
                      id="accountHolderName"
                      placeholder="Enter name"
                      type="text"
                      value={data.accountHolderName}
                      className="pl-3 pr-8 py-1 w-full border rounded-md"
                      onChange={(e) =>
                        handleChange("accountHolderName", e.target.value)
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.accountHolderName && (
                    <span className="text-red-700">
                      {error.accountHolderName}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="ifsc"
                    className="text-sm font-bold text-gray-600"
                  >
                    IFSC
                  </label>
                  <div className="relative">
                    <Input
                      id="ifsc"
                      placeholder="IFSC"
                      type="text"
                      value={data.ifsc}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => handleChange("ifsc", e.target.value)}
                    />
                  </div>
                  {error.ifsc && (
                    <span className="text-red-700 text-xs">{error.ifsc}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="accountNumber"
                    className="text-sm font-bold text-gray-600"
                  >
                    Account Number
                  </label>
                  <div className="relative">
                    <Input
                      id="accountNumber"
                      placeholder="* * * * * * * * * *"
                      type="number"
                      value={data.accountNumber}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) =>
                        handleChange("accountNumber", e.target.value)
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Banknote size={16} />
                    </div>
                  </div>
                  {error.accountNumber && (
                    <span className="text-red-700 text-xs">
                      {error.accountNumber}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="branch"
                    className="text-sm font-bold text-gray-600"
                  >
                    Branch
                  </label>
                  <div className="relative">
                    <Input
                      id="branch"
                      placeholder="* * * * * * * *"
                      type="text"
                      value={data.branch}
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => handleChange("branch", e.target.value)}
                    />
                  </div>
                  {error.branch && (
                    <span className="text-red-700 text-xs">{error.branch}</span>
                  )}
                </div>

                <h1>KYC Details</h1>

                <div className="space-y-1">
                  <label
                    htmlFor="kyc_panCard"
                    className="text-sm font-bold text-gray-600"
                  >
                    PAN Card
                  </label>
                  <div className="relative">
                    <Input
                      id="kyc_panCard"
                      name="kyc-panCard"
                      type="file"
                      className="pl-3 pr-8 py-2 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("kyc_panCard", file);
                        }
                      }}
                    />
                  </div>
                  {error.kyc_panCard && (
                    <span className="text-red-700 text-xs">
                      {error.kyc_panCard}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="kyc_idProof"
                    className="text-sm font-bold text-gray-600"
                  >
                    ID Proof
                  </label>
                  <div className="relative">
                    <Input
                      id="kyc_idProof"
                      type="file"
                      name="kyc-idProof"
                      className="pl-3 pr-8 py-2 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("kyc_idProof", file);
                        }
                      }}
                    />
                  </div>
                  {error.kyc_idProof && (
                    <span className="text-red-700 text-xs">
                      {error.kyc_idProof}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="kyc_addressProof"
                    className="text-sm font-bold text-gray-600"
                  >
                    Address Proof
                  </label>
                  <div className="relative">
                    <Input
                      id="kyc_addressProof"
                      type="file"
                      name="kyc_addressProof"
                      className="pl-3 pr-8 py-2 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("kyc_addressProof", file);
                        }
                      }}
                    />
                  </div>
                  {error.kyc_addressProof && (
                    <span className="text-red-700 text-xs">
                      {error.kyc_addressProof}
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleClick}
                  //   disabled={
                  //     Object.values(data).some((value) => !value) ||
                  //     !confirmPassword
                  //   }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2"
                >
                  Next
                </Button>
                <button onClick={() => setStep(3)}>Next</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8 },
                }}
              >
                <h1>Legal Documents</h1>
                <div className="space-y-1">
                  <label
                    htmlFor="registrationCertificate"
                    className="text-sm font-bold text-gray-600"
                  >
                    Registration Certificate
                  </label>
                  <div className="relative">
                    <Input
                      id="registrationCertificate"
                      type="file"
                      name="registrationCertificate"
                      className="pl-3 pr-8 py-1 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("registrationCertificate", file);
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.registrationCertificate && (
                    <span className="text-red-700">
                      {error.registrationCertificate}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="safetyCertificate"
                    className="text-sm font-bold text-gray-600"
                  >
                    Safety Certificate
                  </label>
                  <div className="relative">
                    <Input
                      id="safetyCertificate"
                      type="file"
                      name="safetyCertificate"
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("safetyCertificate", file);
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 5L12 12L3 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                  {error.safetyCertificate && (
                    <span className="text-red-700 text-xs">
                      {error.safetyCertificate}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="license"
                    className="text-sm font-bold text-gray-600"
                  >
                    License
                  </label>
                  <div className="relative">
                    <Input
                      id="license"
                      type="file"
                      name="license"
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("license", file);
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Banknote size={16} />
                    </div>
                  </div>
                  {error.license && (
                    <span className="text-red-700 text-xs">
                      {error.license}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="insurance"
                    className="text-sm font-bold text-gray-600"
                  >
                    Insurance
                  </label>
                  <div className="relative">
                    <Input
                      id="insurance"
                      type="file"
                      name="insurance"
                      className="pl-3 pr-8 w-full border rounded-md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("insurance", file);
                        }
                      }}
                    />
                  </div>
                  {error.insurance && (
                    <span className="text-red-700 text-xs">
                      {error.insurance}
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleClick}
                  // disabled={
                  //   Object.values(data).some((value) => !value) ||
                  //   !confirmPassword
                  // }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2"
                >
                  Next
                </Button>
                <button onClick={() => setStep(3)}>Next</button>
              </motion.div>
            )}
            <p className="text-xs text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
      <div>
        <img src="/assets/globalexplorer.png" alt="GlobalExplorer" />
      </div>
    </div>
  );
};

export default HostSignUp;
