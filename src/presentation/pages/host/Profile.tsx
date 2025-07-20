import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { authService } from "../../../services/AuthAPI"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import type { Host } from "../../../shared/types/global"
import MyProfile from "../../components/common/MyProfile"
import { HostService } from "../../../services/HostService"

const Profile = () => {
  const user = useSelector((state: RootState) => state.host.host)
  const [profile, setProfile] = useState< Host >()
  const [triggerFetch, setTriggerFetch] = useState(false);
  const hostService = new HostService();


  const editProfile = async (data: object) => {
    if(!user) return;
    try {
      const response = await hostService.editProfile(user._id, data);
      if(response.status === 200) {
        toast.success("Profile edited successful")
        setTriggerFetch(prev => !prev)
      }
    } catch (error) {
      console.log(error);
      if(error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    if(!user) return;
    const fetchProfile = async () => {
      try {
        const response = await authService.getUserProfile(user?._id, "host")
        if(response.status === 200) {
          setProfile(response.data.user as Host);
        }
      } catch (error) {
        console.log(error)
        if(error instanceof Error){
          toast.error(error.message);
        }
      }
    }
    fetchProfile()
  }, [user, triggerFetch])
  return (
    <div>
      {profile && <MyProfile role="host" initialData={profile} onEdit={editProfile} />}
    </div>
  )
}

export default Profile