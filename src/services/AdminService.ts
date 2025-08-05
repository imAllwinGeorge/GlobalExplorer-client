import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, Host, ResponseType, User } from "../shared/types/global";

export const adminService = {
  getAllUsers: async <T extends User | Host>(page: number, limit: number, role: "user" | "host"): Promise<{users:T[], totalPages: number}> => {
    try {
      const response = await axiosInstance.get<{ users: T[], totalPages: number }>(
        `/admin/get-users/${role}?page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        console.log(response);
        return {users: response.data.users, totalPages: response.data.totalPages}
      }
      return {users: [], totalPages: 1}
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
      const response = await axiosInstance.post<AuthResponse>(
        `/admin/update-status/${role}`,
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
      const response = await axiosInstance.get<AuthResponse>(`/admin/get-user?_id=${_id}&role=${role}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again";
      throw new Error(message)
    }
  },

  addCategory: async (data: {categoryName: string; description: string}): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/admin/add-category",{data});
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  getCategories: async(page: number, limit: number): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/admin/get-category?page=${page}&limit=${limit}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  editCategory: async (data: {_id: string; value: {categoryName: string, description: string}}) => {
    try {
      const response = await axiosInstance.put("/admin/edit-category",data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },
  
  updateCategoryStatus:async (data: {_id: string; value: object}) => {
    try {
      const response = await axiosInstance.patch("/admin/edit-category",data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },

  getActivities: async (page = 1, limit = 3): Promise<ResponseType<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/admin/get-activities?page=${page}&limit=${limit}`,)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wront! Please try again"
      throw new Error(message)
    }
  },

  updateActivityStatus: async (id: string, data: object): Promise<ResponseType<AuthResponse>> => {
      try {
        const response = await axiosInstance.patch<AuthResponse>(`/admin/activity/status/${id}`,{data})
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message || 
        "Something went Wrong! Please try again."
        throw new Error(message)
      }
    },

    dashboardData: async (): Promise<ResponseType<AuthResponse>> => {
      try {
        const response = axiosInstance.get<AuthResponse>("/admin/dashboard");
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        " Something went wrong!. Please try again"
        throw new Error(message)
      }
    }
};
