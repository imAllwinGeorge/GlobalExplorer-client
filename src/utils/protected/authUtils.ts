
import toast from "react-hot-toast";
import { store } from "../../presentation/store";
import { adminLogout } from "../../presentation/store/slices/adminSlice";
import { hostLogout } from "../../presentation/store/slices/hostSlice";
import { logout } from "../../presentation/store/slices/authSlice";

export function handleRoleBasedLogout(currentPath: string) {
  
  let inferredPath: string;

  if (currentPath.startsWith("/admin")) {
    localStorage.removeItem("persist:admin");
    store.dispatch(adminLogout());
    inferredPath = "/admin/login";
  } else if (currentPath.startsWith("/host")) {
    localStorage.removeItem("persist:host");
    store.dispatch(hostLogout());
    inferredPath = "/host/login";
  } else if (currentPath.startsWith("/user")) {
    localStorage.removeItem("persist:auth");
    store.dispatch(logout());
    inferredPath = "/login";
    
  } else {
    inferredPath = "/login"; // fallback route
    localStorage.removeItem("persist:auth");
    store.dispatch(logout());
  }
  console.log("234567890-2345678901234567890234567890-234567890-= :",inferredPath)
  setTimeout(() => {
    window.location.href = inferredPath;
    toast.error("Session expired. Logging out...");
  }, 1000);
}
