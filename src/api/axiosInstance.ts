import axios from "axios";
import toast from "react-hot-toast";
import { store } from "../presentation/store";
import { adminLogout } from "../presentation/store/slices/adminSlice";
import { hostLogout } from "../presentation/store/slices/hostSlice";
import { logout } from "../presentation/store/slices/authSlice";
const baseUrl = import.meta.env.VITE_API_BASE_URL
console.log(baseUrl)
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log(window.location.pathname)
    return response
  },
  error => {
    console.log("error axions interceptor", baseUrl)
    // const msg = error?.response?.data?.message;

    if (
      error.response?.status === 403 || error.response.status === 401
      // msg === "You have been blocked please contact admin."
    ) {
      const currentPath = window.location.pathname;
      let inferredPath: string;

      if(currentPath.startsWith("/admin")) {
        localStorage.removeItem("persist:admin")
        store.dispatch(adminLogout());
        inferredPath = "/admin/login"
      }else if(currentPath.startsWith("/host")) {
        localStorage.removeItem("persist:host");
        store.dispatch(hostLogout());
        inferredPath = "/host/login"
      }else if(currentPath.startsWith("/user")) {
        localStorage.removeItem("persist:auth");
        store.dispatch(logout());
        inferredPath = "/login"
      }

      // Optionally clear Redux state
      // store.dispatch(logout()); // Replace with correct role reducer
      // persistor.purge();

      // Redirect to login
      setTimeout(() => {
        window.location.href = inferredPath;
        toast.error("You have been blocked. Logging out...");
      }, 1000); // or "/admin/login" or "/host/login"
    }

    return Promise.reject(error);
  }
);