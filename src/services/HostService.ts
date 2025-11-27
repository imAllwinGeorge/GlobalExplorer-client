import type { AxiosResponse } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, SalesFilters } from "../shared/types/global";
import { API_ROUTES } from "@/shared/constants/apiRoutes";
import { extractErrorMessage } from "@/utils/helpers/helper";

export class HostService {
  async getActivities(
    id: string,
    page: number,
    limit: number,
    search: string,
    filter: string | boolean
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.GET_ACTIVITIES(id, page, limit, search, filter)
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

  async getActivity(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.GET_ACTIVITY(id)
      );
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong! Please try again later..";
      throw new Error(message);
    }
  }

  async getCategories(): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.GET_CATEGORIES
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
        API_ROUTES.HOST.ADD_ACTIVITY,
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

  async editActivity(
    id: string,
    data: FormData
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(
        API_ROUTES.HOST.EDIT_ACTIVITY(id),
        data
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wront! please try again";
      throw new Error(message);
    }
  }

  async updateStatus(
    id: string,
    data: object
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(
        API_ROUTES.HOST.UPDATE_ACTIVITY(id),
        { data }
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went Wrong! Please try again.";
      throw new Error(message);
    }
  }

  async editProfile(
    id: string,
    data: object
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ROUTES.HOST.EDIT_PROFILE(id),
        data
      );
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went frong! Please try again.";
      throw new Error(message);
    }
  }

  async activityBookings(
    id: string,
    page: number,
    limit: number,
    search: string,
    filter: string | boolean
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.GET_BOOKINGS(id, page, limit, search, filter)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong! please try again.";
      throw new Error(message);
    }
  }

  async dashboardData(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.DASHBOARD(id)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong! please try again.";
      throw new Error(message);
    }
  }

  async filterBookings(hostId: string, filter: SalesFilters, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.HOST.SALES_REPORT(hostId,filter, page, limit));
      return response
    } catch (error) {
      const message = extractErrorMessage(error as ErrorResponse);
      throw new Error(message);
    }
  }

  async filterActivityBookings(activityId: string, filter: SalesFilters, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.HOST.ACTIVITY_SALES(activityId, filter, page, limit));
      return response
    } catch (error) {
      const message = extractErrorMessage(error as ErrorResponse);
      throw new Error(message);
    }
  }

  async getConverSations(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.GET_CONVERSATION(id)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try agian.";
      throw new Error(message);
    }
  }

  async MarkReadMessage(
    conversationId: string,
    userId: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(
        API_ROUTES.HOST.MARK_READ_MESSAGE(conversationId, userId)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async salesData(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.SALES(id)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async verifyBooking(token: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ROUTES.HOST.VERIFY_BOOKING,
        { token }
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async getTodayBookings(
    hostId: string,
    page: number,
    limit: number
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(
        API_ROUTES.HOST.TODAY_BOOKING(hostId, page, limit)
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async updateDynamicPricing(
    activityId: string,
    data: { dynamicPricingEnabled: boolean; maxDynamicPercentage: number }
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(
        API_ROUTES.HOST.UPDATE_DYNAMIC_PRICING(activityId),
        { data }
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async updatePricing(
    activityId: string,
    data: {
      pricePerHead: number;
      offerPercentage: number;
      basePrice: number;
    }
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(
        API_ROUTES.HOST.UPDATE_PRICING(activityId),
        { data }
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "Something went wrong!. Please try again";
      throw new Error(message);
    }
  }
}

export const hostService = new HostService();
