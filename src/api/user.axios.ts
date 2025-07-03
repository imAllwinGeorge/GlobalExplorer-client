import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../presentation/store";
import { logout } from "../presentation/store/slices/authSlice";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const userAxiosInstace = axios.create({
    baseURL: `${API_BASE_URL}/user`,
    withCredentials: true
})

// ✅ Response Interceptor
userAxiosInstace.interceptors.response.use(
  response => response,
  error => {
    console.log("error axions interceptor")
    const msg = error?.response?.data?.message;

    if (
      error.response?.status === 403 &&
      msg === "You have been blocked please contact admin."
    ) {
      toast.error("You have been blocked. Logging out...");
        localStorage.removeItem("persist:auth");
      // Optionally clear Redux state
      store.dispatch(logout()); // Replace with correct role reducer
    //   persistor.purge();

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // or "/admin/login" or "/host/login"
    }

    return Promise.reject(error);
  }
);