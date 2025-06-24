import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ReusableComponents/ConfirmModal";
import type { User } from "../../../../shared/types/global";
import { adminService } from "../../../../services/AdminService";
// import { toast } from 'react-toastify';


const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [triggerFetch, setTriggerFetch] = useState(false)

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const response = await adminService.getAllUsers("user");
              console.log("response fetchuserdata: ",response)
              if(response){
                  setUsers(response)
                //   toast(response)
              }
          } catch (error) {
              console.log("fetch users",error);
            //   toast(error.response.data)
          }
      }
      fetchUserData();
  }, [triggerFetch])
  const handleUserState = async () => {
    if(!selectedUser) return null
    try {
      const value = {
        isBlocked: !selectedUser.isBlocked
      }
      const response = await adminService.updateStatus(selectedUser._id, value);
      if(response.status === 200){
        setTriggerFetch(state => !state)
      }
    } catch (error) {
     console.log(error) 
    }
  }

  

  return (
    <div className="users-container bg-white text-gray-800 p-8 rounded-xl shadow-lg">
  <h1 className="text-2xl font-bold mb-6 text-yellow-700">User Details</h1>

  <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
    <table className="min-w-full bg-white">
      <thead className="bg-yellow-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">#</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">First Name</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">Last Name</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">Email</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">Phone</th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={user._id}
            className="hover:bg-yellow-50 transition duration-150 border-b border-gray-100"
          >
            <td className="px-4 py-3">{index + 1}</td>
            <td className="px-4 py-3">{user.firstName}</td>
            <td className="px-4 py-3">{user.lastName}</td>
            <td className="px-4 py-3">{user.email}</td>
            <td className="px-4 py-3">{user.phoneNumber}</td>
            <td className="px-4 py-3">
              <button
                className={`px-4 py-1 rounded-md font-medium transition duration-150 ${
                  user.isBlocked
                    ? "bg-white text-yellow-700 border border-yellow-600 hover:bg-yellow-100"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
                onClick={() => {
                  setIsModelOpen(true);
                  setSelectedUser(user);
                }}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <ConfirmModal
    isOpen={isModalOpen}
    onClose={() => setIsModelOpen(false)}
    onConfirm={handleUserState}
    title={`${selectedUser?.isBlocked ? "Unblock" : "Block"} User`}
    message={`Are you sure you want to ${
      selectedUser?.isBlocked ? "unblock" : "block"
    } ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
    confirmText="Confirm"
    cancelText="Cancel"
    variant="warning"
  />
</div>

  );
};

export default Users;
