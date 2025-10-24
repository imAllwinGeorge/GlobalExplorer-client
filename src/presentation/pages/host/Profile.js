import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../../../services/AuthAPI";
import { useSelector } from "react-redux";
import MyProfile from "../../components/common/MyProfile";
import { HostService } from "../../../services/HostService";
import { useDispatch } from "react-redux";
import { HttpStatusCode, ROLE } from "../../../shared/constants/constants";
import { hostLogin } from "../../store/slices/hostSlice";
const Profile = () => {
    const user = useSelector((state) => state.host.host);
    const [profile, setProfile] = useState();
    const hostService = new HostService();
    const dispatch = useDispatch();
    const editProfile = async (data) => {
        if (!user)
            return;
        try {
            const response = await hostService.editProfile(user._id, data);
            if (response.status === HttpStatusCode.OK) {
                toast.success("Profile edited successful");
                // setTriggerFetch(prev => !prev)
                dispatch(hostLogin(response.data.user));
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
                const response = await authService.getUserProfile(user?._id, ROLE.HOST);
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
        };
        fetchProfile();
    }, [user]);
    return (_jsx("div", { children: profile && _jsx(MyProfile, { role: "host", initialData: profile, onEdit: editProfile }) }));
};
export default Profile;
