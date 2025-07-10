import axios from "axios";
import toast from "react-hot-toast";
import { hostLogout } from "../presentation/store/slices/hostSlice";
import { store } from "../presentation/store";
// import { persistor } from "../presentation/store";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const hostAxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/host`,
    withCredentials: true,
});

// ✅ Response Interceptor
hostAxiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log("error axions interceptor")
    const msg = error?.response?.data?.message;

    if (
      error.response?.status === 403 || error.response?.status === 401
      
    ) {
      toast.error(msg);

      // Optionally clear Redux state
      // store.dispatch(logout()); // Replace with correct role reducer
      // persistor.purge();
      store.dispatch(hostLogout());
      // Redirect to login
      setTimeout(() => {
        window.location.href = "/host/login";
      }, 2000); // or "/admin/login" or "/host/login"
    }

    return Promise.reject(error);
  }
);