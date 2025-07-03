import { useEffect } from "react"
import toast from "react-hot-toast";
import { adminService } from "../../../../services/AdminService";
import { useAppSelector } from "../../../hooks/useAppHooks";


const HostHome = () => {
  const location = useAppSelector(state => state.auth.user);
  
    useEffect(() => {
      const fetchUser = async (id: string, role: string) => {
        try {
          const response = await adminService.getUserDetails(id, role);
          if(response.status === 200){
            toast.success("success")
          }
        } catch (error) {
          console.log(error);
          if(error instanceof Error){
            toast.error(error.message)
          }
        }
      }
      if(location) fetchUser(location._id, location.role);
    },[location])
  return (
    <div>HostHome</div>
  )
}

export default HostHome