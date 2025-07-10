import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../../services/AdminService";
import type { Host } from "../../../shared/types/global";
import ConfirmModal from "../../components/ReusableComponents/ConfirmModal";
import { ChevronsRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
// import { toast } from 'react-toastify';

const AdminHosts = () => {
  const [users, setUsers] = useState<Host[]>([]);
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Host | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await adminService.getAllUsers<Host>(page, 5,"host");
        console.log("response fetchuserdata: ", response);
        if (response) {
          setUsers(response.users);
          setTotalPages(response.totalPages);
          //   toast(response)
        }
      } catch (error) {
        console.log("fetch users", error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchUserData();
  }, [triggerFetch, page]);

  const handleUserState = async () => {
    if (!selectedUser) return null;
    try {
      const toastId = toast.loading("Loading.....");
      const value = {
        isBlocked: !selectedUser.isBlocked,
      };
      const response = await adminService.updateStatus(
        selectedUser._id,
        value,
        "host"
      );
      if (response.status === 200) {
        setTriggerFetch((state) => !state);
        toast.dismiss(toastId);
        console.log("response changeing status", response);
        toast.success(response.data.message || "qwertyui");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-container bg-white text-gray-800 p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-yellow-700">Host Details</h1>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-yellow-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                First Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Last Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Is verified
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Action
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-yellow-800">
                Details
              </th>
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
                <td className="px-4 py-3">{user.isVerified}</td>
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
                <td>
                  <button
                    className={`px-4 py-1 rounded-md font-medium transition duration-150 "bg-white text-yellow-700 border border-yellow-600 hover:bg-yellow-600"`}
                    onClick={() =>
                      navigate("/admin/verify", {
                        state: { id: user._id, role: user.role },
                      })
                    }
                  >
                    <span>
                      <ChevronsRight />
                    </span>
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
          selectedUser?.isBlocked ? "Unblock" : "Block"
        } ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="warning"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
};

export default AdminHosts;
