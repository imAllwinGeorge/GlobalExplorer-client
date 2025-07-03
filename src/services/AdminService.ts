import { adminAxiosInstnace } from "../api/admin.axios";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, Host, ResponseType, User } from "../shared/types/global";

export const adminService = {
  getAllUsers: async <T extends User | Host>(role: "user" | "host"): Promise<T[]> => {
    try {
      const response = await adminAxiosInstnace.get<{ users: T[] }>(
        `/get-users/${role}`
      );
      if (response.status === 200) {
        console.log(response);
        return response.data.users;
      }
      return []
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Error fetching users"
      throw new Error(message)
    }
    
  },

  updateStatus: async (
    _id: string,
    value: object,
    role: string
  ): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await adminAxiosInstnace.post<AuthResponse>(
        `/update-status/${role}`,
        { _id, value }
      );

      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  },

  getUserDetails: async (_id: string, role: string): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await adminAxiosInstnace.get<AuthResponse>(`/get-user?_id=${_id}&role=${role}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again";
      throw new Error(message)
    }
  }
};
