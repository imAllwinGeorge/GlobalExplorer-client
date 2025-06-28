import { authAxiosInstace } from "../api/auth.axios";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, ResponseType, User } from "../shared/types/global";

export const adminService = {
  getAllUsers: async (role: string): Promise<User[] | undefined> => {
    try {
      const response = await authAxiosInstace.get<{ users: User[] }>(
        `/api/admin/get-users/${role}`
      );
      if (response.status === 200) {
        console.log(response);
        return response.data.users;
      }
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Error fetching users"
      throw new Error(message)
    }
    
  },

  updateStatus: async (
    _id: string,
    value: object
  ): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await authAxiosInstace.post<AuthResponse>(
        "/api/admin/update-status",
        { _id, value }
      );

      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  },
};
