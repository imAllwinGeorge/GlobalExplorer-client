import { useEffect, useState } from "react";
import type { LoginFormError } from "../../../../shared/types/auth.type";
import { validateLoginForm } from "../../../../shared/validation/validateLoginForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../../../components/Input";
import { useAppDispatch } from "../../../hooks/useAppHooks";
import { login, setGoogleUser } from "../../../store/slices/authSlice";
import { AuthAPI } from "../../../../services/AuthAPI";
import toast from "react-hot-toast";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginFormError>({});
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const authAPI = new AuthAPI();

  const handleChange =
    (key: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError({});
      setData({ ...data, [key]: e.target.value });
    };

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const errors: LoginFormError = validateLoginForm(data);

    if (Object.keys(errors).length > 0) {
      return setError(errors);
    }
    try {
      const response = await dispatch(login(data));
      if (login.fulfilled.match(response)) {
        navigate("/home");
      } else {
        toast.error(response.payload as string)
      }
    } catch (error) {
      console.log("dispatch error message: ", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("google login button clicked");
      const role = "user";
      await authAPI.googleLogin(role);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userString = params.get("user");
    if (userString) {
      const user = JSON.parse(decodeURIComponent(userString));
      console.log(user);
      dispatch(setGoogleUser(user));
      navigate("/home");
    }
  }, [navigate, dispatch]);
  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/background/hiking-quotes-1586278882.jpg')",
      }}
    >
      {/* Left side - Login Form */}
      <div className="w-full md:w-[500px] bg-white/90 p-8 flex flex-col justify-center">
        <div className="w-auto h-auto">
          <img src="assets/globalexplorer.png" alt="GlobalExplorer" />
        </div>
        <div className="max-w-[500px] mx-auto">
          <h1 className="text-2xl font-bold text-center mb-1">Login</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Welcome back! Please login to your account.
          </p>

          <form className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-600">
                E-mail
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="pl-3 pr-8 py-2 w-full border rounded-md"
                  value={data.email}
                  onChange={handleChange("email")}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* Email icon */}
                </div>
              </div>
              {error.email && (
                <span className="text-red-700 text-xs">{error.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-gray-600">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="* * * * * * * *"
                  className="pl-3 pr-8 py-2 w-full border rounded-md"
                  value={data.password}
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

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={!data.email || !data.password}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md mt-2"
            >
              Login
            </button>
            <Link to="/forgot-password" state={"user"} className=" text-indigo-600 hover:underline">
             forgot password
          </Link>

            {/* Navigation Link */}
            <p className="text-xs text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
          {/* Navigation Link */}

          <div className="w-full py-4  ">
            <button
              className="flex items-center justify-center border border-black rounded px-4 py-2 w-full "
              onClick={handleGoogleLogin}
            >
              <img
                src="/icons/google.png"
                alt="google"
                className="w-5 h-5 mr-2"
              />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
