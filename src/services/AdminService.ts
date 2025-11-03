import { axiosInstance } from "../api/axiosInstance";
import { HttpStatusCode } from "../shared/constants/constants";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, Host, User } from "../shared/types/global";
import type { AxiosResponse } from "axios";

export const adminService = {
  getAllUsers: async <T extends User | Host>(page: number, limit: number, role: "user" | "host", query: string, filter: string | boolean): Promise<{users:T[], totalPages: number}> => {
    try {
      const response = await axiosInstance.get<{ users: T[], totalPages: number }>(
        `/api/admin/get-users/${role}?page=${page}&limit=${limit}&search=${query}&filter=${filter}`
      );
      if (response.status === HttpStatusCode.OK) {
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
  ): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `/api/admin/update-status/${role}`,
        { userId: _id, value }
      );

      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  },

  getUserDetails: async (_id: string, role: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/admin/get-user?_id=${_id}&role=${role}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again";
      throw new Error(message)
    }
  },

  addCategory: async (data: {categoryName: string; description: string}): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/api/admin/add-category",{data});
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  getCategories: async(page: number, limit: number, query: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/admin/get-category?page=${page}&limit=${limit}&search=${query}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  editCategory: async (data: {categoryId: string; value: {categoryName: string, description: string}}) => {
    try {
      const response = await axiosInstance.put("/api/admin/edit-category",data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },
  
  updateCategoryStatus:async (data: {categoryId: string; value: object}) => {
    try {
      const response = await axiosInstance.patch("/api/admin/edit-category",data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },

  getActivities: async (page = 1, limit = 3, query: string, filter: string | boolean): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/admin/get-activities?page=${page}&limit=${limit}&search=${query}&filter=${filter}`,)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wront! Please try again"
      throw new Error(message)
    }
  },

  updateActivityStatus: async (id: string, data: object): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = await axiosInstance.patch<AuthResponse>(`/api/admin/activity/status/${id}`,{data})
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message || 
        "Something went Wrong! Please try again."
        throw new Error(message)
      }
    },

    dashboardData: async (): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = axiosInstance.get<AuthResponse>("/api/admin/dashboard");
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        " Something went wrong!. Please try again"
        throw new Error(message)
      }
    },

    salesData: async (): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = axiosInstance.get<AuthResponse>("/api/admin/sales");
        return response;
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again"
        throw new Error(message)
      }
    }
};
