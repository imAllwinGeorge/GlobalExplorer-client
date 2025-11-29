import { API_ROUTES } from "@/shared/constants/apiRoutes";
import { axiosInstance } from "../api/axiosInstance";
import { HttpStatusCode } from "../shared/constants/constants";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, Host, SalesFilters, User } from "../shared/types/global";
import type { AxiosResponse } from "axios";
import { extractErrorMessage } from "@/utils/helpers/helper";

export const adminService = {
  getAllUsers: async <T extends User | Host>(page: number, limit: number, role: "user" | "host", query: string, filter: string | boolean): Promise<{users:T[], totalPages: number}> => {
    try {
      const response = await axiosInstance.get<{ users: T[], totalPages: number }>(
        API_ROUTES.ADMIN.GET_USERS(role, page, limit, query, filter)
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
        API_ROUTES.ADMIN.UPDATE_STATUS(role),
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
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.GET_USER(_id, role));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again";
      throw new Error(message)
    }
  },

  addCategory: async (data: {categoryName: string; description: string}): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.ADMIN.ADD_CATEGORY,{data});
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  getCategories: async(page: number, limit: number, query: string): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.GET_CATEGORY(page, limit, query));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong!. Please try again"
      throw new Error(message)
    }
  },

  editCategory: async (data: {categoryId: string; value: {categoryName: string, description: string}}) => {
    try {
      const response = await axiosInstance.put(API_ROUTES.ADMIN.EDIT_CATEGORY,data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },
  
  updateCategoryStatus:async (data: {categoryId: string; value: object}) => {
    try {
      const response = await axiosInstance.patch(API_ROUTES.ADMIN.UPDATE_CATEGORY,data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message  ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  },

  getActivities: async (page = 1, limit = 3, query: string, filter: string | boolean): Promise<AxiosResponse<AuthResponse>> => {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.GET_ACTIVITIES(page, limit, query, filter),)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wront! Please try again"
      throw new Error(message)
    }
  },

  updateActivityStatus: async (id: string, data: object): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = await axiosInstance.patch<AuthResponse>(API_ROUTES.ADMIN.ACTIVITY_STATUS(id),{data})
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message || 
        "Something went Wrong! Please try again."
        throw new Error(message)
      }
    },

    dashboardData: async (): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.DASHBOARD);
        return response
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        " Something went wrong!. Please try again"
        throw new Error(message)
      }
    },

    salesData: async (): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.SALES);
        return response;
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again"
        throw new Error(message)
      }
    },

    filterBookings: async(filter: SalesFilters, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> => {
      try {
        const response = await axiosInstance.get<AuthResponse>(API_ROUTES.ADMIN.SALES_REPORT(filter, page, limit));
        return response
      } catch (error) {
        const message = extractErrorMessage(error as ErrorResponse);
        throw new Error(message)
      }
    }
};
