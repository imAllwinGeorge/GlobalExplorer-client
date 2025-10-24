import type { AxiosResponse } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse } from "../shared/types/global";

export class HostService {
  async getActivities(id: string, page: number, limit: number, search: string, filter: string | boolean): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        `/api/host/get-activity/${id}?page=${page}&limit=${limit}&search=${search}&filter=${filter}`
      );
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong! Please try again later..";
      throw new Error(message);
    }
  }

  async getCategories(): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        "/api/host/get-categories"
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong! Please try again later";
      throw new Error(message);
    }
  }

  async addActivity(data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/api/host/add-Activity",
        data
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong! Please try again later";
      throw new Error(message);
    }
  }

  async editActivity(id: string, data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(
        `/api/host/edit-activity/${id}`,
        data
      )
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wront! please try again"
      throw new Error(message)
    }
  }

  async updateStatus(id: string, data: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/api/host/edit-activity/${id}`,{data})
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "Something went Wrong! Please try again."
      throw new Error(message)
    }
  }

  async editProfile(id: string, data: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`/api/host/update-profile/${id}`, data)
      return response
    } catch (error) {
      console.log(error)
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went frong! Please try again."
      throw new Error(message)
    }
  }

  async activityBookings(id: string, page: number, limit: number, search: string, filter: string | boolean): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/host/get-bookings?id=${id}&page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again."
      throw new Error(message);
    }
  }

  async dashboardData(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/host/dashboard/${id}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again."
      throw new Error(message);
    }
  }

  async getConverSations(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/host/chat/get-conversation/${id}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try agian.";
      throw new Error(message);
    }
  }

  async MarkReadMessage (conversationId: string, userId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/api/host/mark-read-message/${conversationId}/${userId}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again";
      throw new Error(message)
    }
  }

  async salesData(id: string):Promise<AxiosResponse<AuthResponse>> {
      try {
        const response = axiosInstance.get<AuthResponse>(`/api/host/sales/${id}`);
        return response;
      } catch (error) {
        const message = (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again"
        throw new Error(message)
      }
    }
}

export const hostService = new HostService();
