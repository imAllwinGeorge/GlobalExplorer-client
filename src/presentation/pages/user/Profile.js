// "use client";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import type { User } from "../../../shared/types/global";
// import type { RootState } from "../../store";
// import { userService } from "../../../services/UserService";
// import { authService } from "../../../services/AuthAPI";
// import MyProfile from "../../components/common/MyProfile";
// import { HttpStatusCode, ROLE } from "@/shared/constants/constants";
// const Profile = () => {
//   const [profile, setProfile] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const user = useSelector((state: RootState) => state.auth.user);
//   const editProfile = async (data: object) => {
//     if (!user) return;
//     console.log("Editing profile...", data);
//     try {
//       const response = await userService.editProfile(user._id, data);
//       if (response.status === HttpStatusCode.OK) {
//         toast.success("Profile edited successfully");
//         // setTriggerFetch((prev) => !prev)
//         setProfile(response.data.user as User);
//       }
//     } catch (error) {
//       console.log(error);
//       if (error instanceof Error) {
//         toast.error(error.message);
//       }
//     }
//   };
//   useEffect(() => {
//     if (!user) return;
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const response = await authService.getUserProfile(user?._id, ROLE.USER);
//         console.log(response);
//         if (response.status === HttpStatusCode.OK) {
//           setProfile(response.data.user as User);
//         }
//       } catch (error) {
//         console.log(error);
//         if (error instanceof Error) {
//           toast.error(error.message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [user]);
//   return (
//     <div className="flex">
//         {/* Profile Content */}
//         <main className="flex-1">
//           <div className="px-4 py-6 sm:px-6 lg:px-8">
//             <div className="mx-auto max-w-4xl">
//               {/* Page Header */}
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="mb-8"
//               >
//                 <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
//                 <p className="mt-2 text-sm text-gray-600">
//                   Manage your personal information and account settings
//                 </p>
//               </motion.div>
//               {/* Profile Content */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className="bg-white shadow-sm rounded-lg border border-gray-200"
//               >
//                 {loading && (
//                   <div className="p-8">
//                     <div className="animate-pulse">
//                       <div className="flex items-center space-x-4 mb-6">
//                         <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
//                         <div className="space-y-2">
//                           <div className="h-4 bg-gray-200 rounded w-32"></div>
//                           <div className="h-3 bg-gray-200 rounded w-48"></div>
//                         </div>
//                       </div>
//                       <div className="space-y-4">
//                         {[...Array(4)].map((_, i) => (
//                           <div key={i} className="space-y-2">
//                             <div className="h-4 bg-gray-200 rounded w-24"></div>
//                             <div className="h-10 bg-gray-200 rounded"></div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {!loading && !profile && (
//                   <div className="p-8 text-center">
//                     <div className="text-gray-500">
//                       <p className="text-lg font-medium">Profile not found</p>
//                       <p className="text-sm mt-2">
//                         Unable to load your profile information.
//                       </p>
//                     </div>
//                   </div>
//                 )}
//                 {!loading && profile && (
//                   <div className="p-6 sm:p-8">
//                     <MyProfile
//                       role="user"
//                       initialData={profile}
//                       onEdit={editProfile}
//                     />
//                   </div>
//                 )}
//               </motion.div>
//             </div>
//           </div>
//         </main>
//       </div>
//   );
// };
// export default Profile;
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { userService } from "../../../services/UserService";
import { authService } from "../../../services/AuthAPI";
import MyProfile from "../../components/common/MyProfile";
import { HttpStatusCode, ROLE } from "../../../shared/constants/constants";
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const editProfile = async (data) => {
        if (!user)
            return;
        console.log("Editing profile...", data);
        try {
            const response = await userService.editProfile(user._id, data);
            if (response.status === HttpStatusCode.OK) {
                toast.success("Profile edited successfully");
                setProfile(response.data.user);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    useEffect(() => {
        if (!user)
            return;
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await authService.getUserProfile(user?._id, ROLE.USER);
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setProfile(response.data.user);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);
    return (_jsx("div", { className: "flex w-full", children: _jsx("main", { className: "flex-1 w-full", children: _jsx("div", { className: "px-4 py-6 sm:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-4xl", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "mb-8", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900", children: "My Profile" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Manage your personal information and account settings" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white shadow-sm rounded-lg border border-gray-200", children: [loading && (_jsx("div", { className: "p-8", children: _jsxs("div", { className: "animate-pulse", children: [_jsxs("div", { className: "flex items-center space-x-4 mb-6", children: [_jsx("div", { className: "w-20 h-20 bg-gray-200 rounded-full" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-32" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-48" })] })] }), _jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-24" }), _jsx("div", { className: "h-10 bg-gray-200 rounded" })] }, i))) })] }) })), !loading && !profile && (_jsx("div", { className: "p-8 text-center", children: _jsxs("div", { className: "text-gray-500", children: [_jsx("p", { className: "text-lg font-medium", children: "Profile not found" }), _jsx("p", { className: "text-sm mt-2", children: "Unable to load your profile information." })] }) })), !loading && profile && (_jsx("div", { className: "p-6 sm:p-8", children: _jsx(MyProfile, { role: "user", initialData: profile, onEdit: editProfile }) }))] })] }) }) }) }));
};
export default Profile;
