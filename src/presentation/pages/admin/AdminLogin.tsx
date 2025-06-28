import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginFormError } from "../../../shared/types/auth.type";
import { validateLoginForm } from "../../../shared/validation/validateLoginForm";
import { AuthAPI } from "../../../services/AuthAPI";
import { useDispatch } from "react-redux";
import { adminLogin } from "../../store/slices/adminSlice";
import toast from "react-hot-toast";


const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormError>({});
  const [rememberMe, setRememberMe] = useState(false);

  const authAPI = new AuthAPI();

  const validateForm = () => {
    const data = { email, password };
    const newErrors: LoginFormError = validateLoginForm(data);

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        role: "admin",
      };
      const response = await authAPI.login(data);
      if (response.status === 200) {
        console.log(response.data)
        setTimeout(() => {
          dispatch(adminLogin(response.data.user))
        navigate("/admin/users");
        },1000)
      }
    } catch (error) {
      console.log(error);
       if(error instanceof Error){
        toast.error(error.message)
       }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        {/* Image Section */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center relative"
          style={{
        backgroundImage: "url('/background/hiking-quotes-1586278882.jpg')",
      }}
        >          
        </div>
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-black text-white p-8">
          <h1 className="text-3xl text-amber-400 font-bold mb-4 text-center">
            Admin Login
          </h1>
          <p className="text-white text-2xl mb-6 text-center">
            Only admins are allowed to login through this interface
          </p>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="space-y-6 bg-black "
          >
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                name="email"
                placeholder="admin@email.com"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                name="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-amber-500 hover:bg-amber-600 transition duration-300 text-white font-bold"
            >
              Login Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
