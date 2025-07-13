import axios from "axios";
import { handleRoleBasedLogout } from "../utils/protected/authUtils";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl);
export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(window.location.pathname);
    return response;
  },
  async (error) => {
    console.log("error axios interceptor", error);
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Only retry for 401 with "Token Expired" message
    if (status === 401 && message === "Token Expired.") {
      const originalRequest = error.config;
      console.log(originalRequest);
      
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const url = originalRequest?.url;
          // Remove query params
          const pathname = url.split("?")[0];
          // Split by "/" and get the second element
          const role = pathname.split("/")[1];

          await axiosInstance.post("/auth/refresh-token", { role });
          console.log("retrying");
          return axiosInstance(originalRequest);
        } catch (retryError) {
          console.log("Retry failed, logging out");
          handleRoleBasedLogout(window.location.pathname);
          return Promise.reject(retryError);
        }
      }
    }
    // Handle other 401 errors (not token expired) and 403 errors
    else if (status === 403 || (status === 401 && message !== "Token Expired.")) {
      console.log("Handling 403 or other 401 errors - logging out");
      handleRoleBasedLogout(window.location.pathname);
    }

    console.log("check the error");
    return Promise.reject(error);
  }
);


// // ✅ Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(window.location.pathname);
//     return response;
//   },
//   async (error) => {
//     console.log("error axions interceptor", error);
//     // const msg = error?.response?.data?.message;

//     if (error.response.status === 401 && error.response.data.message === "Token Expired.") {
//       const originalRequest = error.config;
//       console.log(originalRequest);
//       if (originalRequest && !originalRequest._retry) {
//         originalRequest._retry = true;

//        try {
//          const url = originalRequest?.url

//         // Remove query params
//         const pathname = url.split("?")[0]; // "/user/blog/get-blogs"

//         // Split by "/" and get the second element
//         const role = pathname.split("/")[1]; // "user"

//         await axiosInstance.post("/auth/refresh-token",{role});
//         console.log("retriying");
//         return axiosInstance(originalRequest)
//        } catch (retryError) {
//           handleRoleBasedLogout(window.location.pathname);
//           return Promise.reject(retryError)
//        }
//       }
      
//     }else if (
//       error.response?.status === 403 || error.response.status === 401
//       // msg === "You have been blocked please contact admin."
//     ) {
//       const currentPath = window.location.pathname;
//       // let inferredPath: string;

//       // if (currentPath.startsWith("/admin")) {
//       //   localStorage.removeItem("persist:admin");
//       //   store.dispatch(adminLogout());
//       //   inferredPath = "/admin/login";
//       // } else if (currentPath.startsWith("/host")) {
//       //   localStorage.removeItem("persist:host");
//       //   store.dispatch(hostLogout());
//       //   inferredPath = "/host/login";
//       // } else if (currentPath.startsWith("/user")) {
//       //   localStorage.removeItem("persist:auth");
//       //   store.dispatch(logout());
//       //   inferredPath = "/login";
//       // }
//       handleRoleBasedLogout(currentPath)

//       // Optionally clear Redux state
//       // store.dispatch(logout()); // Replace with correct role reducer
//       // persistor.purge();

//       // Redirect to login
//       // setTimeout(() => {
//       //   window.location.href = inferredPath;
//       //   toast.error("You have been blocked. Logging out...");
//       // }, 1000); // or "/admin/login" or "/host/login"
//     } 
//     console.log("check  the  error")
//     return Promise.reject(error);
//   }
// );
