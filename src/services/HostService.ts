import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, ResponseType } from "../shared/types/global";

export class HostService {
  async getActivities(id: string, page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        `/host/get-activity/${id}?page=${page}&limit=${limit}`
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

  async getCategories(): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        "/host/get-categories"
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong! Please try again later";
      throw new Error(message);
    }
  }

  async addActivity(data: FormData): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/host/add-Activity",
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

  async editActivity(id: string, data: FormData): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(
        `/host/edit-activity/${id}`,
        data
      )
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wront! please try again"
      throw new Error(message)
    }
  }

  async updateStatus(id: string, data: object): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/host/edit-activity/${id}`,{data})
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "Something went Wrong! Please try again."
      throw new Error(message)
    }
  }

  async editProfile(id: string, data: object): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`/host/update-profile/${id}`, data)
      return response
    } catch (error) {
      console.log(error)
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went frong! Please try again."
      throw new Error(message)
    }
  }

  async activityBookings(id: string, page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/host/get-bookings?id=${id}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again."
      throw new Error(message);
    }
  }
}

export const hostService = new HostService();
