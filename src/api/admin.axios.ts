import axios from "axios";
import toast from "react-hot-toast";
import {  store } from "../presentation/store";
import { adminLogout } from "../presentation/store/slices/adminSlice";
const apiUrl = import.meta.env.VITE_API_BASE_URL
console.log("url for backend", apiUrl)

export const adminAxiosInstnace = axios.create({
    baseURL: `${apiUrl}/admin`,
    withCredentials: true,
});

// ✅ Response Interceptor
adminAxiosInstnace.interceptors.response.use(
  response => response,
  error => {
    console.log("error axions interceptor",error)
    const msg = error?.response?.data?.message;

    if (
      error.response?.status === 403 
    ) {
      toast.error(msg);

      // Optionally clear Redux state
      store.dispatch(adminLogout()); // Replace with correct role reducer
    //   persistor.purge();

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/adminlogin";
      }, 2000); // or "/admin/login" or "/host/login"
    }

    return Promise.reject(error);
  }
);