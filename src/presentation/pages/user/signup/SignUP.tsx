import React, { useState } from "react";
import Input from "../../../components/Input";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff, Phone } from "lucide-react";

import { validateSignupForm } from "../../../../shared/validation/validateSignupFrom";
import type { RegisterFormErrors } from "../../../../shared/types/auth.type";
import { AuthAPI } from "../../../../services/AuthAPI";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUP = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<RegisterFormErrors>({});

  const authAPI = new AuthAPI();

  const navigate = useNavigate();

  const handleChange =
    (key: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError({});
      setData({ ...data, [key]: e.target.value });
    };

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const errors: RegisterFormErrors = validateSignupForm(data);

    if (data.password !== confirmPassword) {
      errors.confirmPassword = "both password and cofirm should be same";
    }

    if (Object.keys(errors).length > 0) {
      return setError(errors);
    }
    try {
      const response = await authAPI.register(data);
      if (response.status === 200) {
        navigate("/verify_otp");
      }
    } catch (error) {
      console.log(error);
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
      <div className="max-full  md:w-[400px] bg-white p-4 flex flex-col justify-center rounded-3xl m-8 ml-40">
        <div className="max-w-[320px] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-1">Sign UP</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Signup For Better Experience
          </p>

          <form className="space-y-1">
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-sm font-bold text-gray-600">
                First Name
              </label>
              <div className="relative">
                <Input
                  id="fullName"
                  placeholder="Enter first name"
                  type="text"
                  value={data.firstName}
                  className="pl-3 pr-8 py-1 w-full border rounded-md"
                  onChange={handleChange("firstName")}
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
              <label htmlFor="lastName" className="text-sm font-bold text-gray-600">
                Last Name
              </label>
              <div className="relative">
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  type="text"
                  value={data.lastName}
                  className="pl-3 pr-8 py-1 w-full border rounded-md"
                  onChange={handleChange("lastName")}
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
              <label htmlFor="email" className="text-sm font-bold text-gray-600">
                E-mail
              </label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="example@gmail.com"
                  type="email"
                  value={data.email}
                  className="pl-3 pr-8 w-full border rounded-md"
                  onChange={handleChange("email")}
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
              <label htmlFor="phoneNumber" className="text-sm font-bold text-gray-600">
                Mobile No
              </label>
              <div className="relative">
                <Input
                  id="phoneNumber"
                  placeholder="9876543210"
                  type="tel"
                  value={data.phoneNumber}
                  className="pl-3 pr-8 w-full border rounded-md"
                  onChange={handleChange("phoneNumber")}
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
              <label htmlFor="password" className="text-sm font-bold text-gray-600">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="* * * * * * * *"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  className="pl-3 pr-8 w-full border rounded-md"
                  onChange={handleChange("password")}
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
                <span className="text-red-700 text-xs">{error.password}</span>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              disabled={
                Object.values(data).some((value) => !value) || !confirmPassword
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2"
            >
              Register
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div>
        <img src="src/assets/globalexplorer.png" alt="GlobalExplorer" />
      </div>
    </div>
  );
};

export default SignUP;
