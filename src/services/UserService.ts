import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, Booking, ResponseType } from "../shared/types/global";

export class UserService {
  private http: typeof axiosInstance;
  constructor(http: typeof axiosInstance = axiosInstance) {
    this.http = http;
  }

  async getUserDetails(
    _id: string,
    role: string
  ): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(
        `/user/get-user?_id=${_id}&role=${role}`
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  };

  async getAllActivities(page: number, limit: number, filter: object = {}): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(`/user/get-activities?page=${page}&limit=${limit}`, filter)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async createBlog( data: FormData): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await this.http.post<AuthResponse>(`/user/blog/create-blog`, data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went Wrong! Please try again"
      throw new Error(message)
    }
  }

  async getBlogs(page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/user/blog/get-blogs?page=${page}?limit=${limit}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getMyBlogs(id: string, page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/user/blog/get-myblogs?id=${id}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getActivityDetails(id: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/user/activity/get-details/${id}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again"
      throw new Error(message)
    }
  }

  async BookActivit (data: object): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/user/activity/booking',{data});
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getCategories (): Promise<ResponseType<AuthResponse>>{
    try {
      const response = await axiosInstance.get<AuthResponse>('/user/get-categories');
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

  async filterSearch(page: number, limit: number, filters: object): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/user/activity/filter`, {
        params: {
          page,
          limit,
          ...filters,
        },
      } );
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async editProfile(id: string, data: object): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`/user/update-profile/${id}`, data)
      return response
    } catch (error) {
      console.log(error)
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went frong! Please try again."
      throw new Error(message)
    }
  }

  async getBookedActivity (id: string, page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      console.log(id)
      const response = await axiosInstance.get<AuthResponse>(`/user/get-bookings?id=${id}&page=${page}&limit=${limit}`);
      return response
    } catch (error) {
      console.log(error);
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async cancelBooking(bookedActivity: Booking, message: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/user/cancel-booking?id=${bookedActivity._id}&message=${message}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

}

export const userService = new UserService();