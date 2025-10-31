import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { ReviewDTO } from "../shared/types/DTO";
import type { AuthResponse, Booking } from "../shared/types/global";
import type { AxiosResponse } from "axios";

export class UserService {
  private http: typeof axiosInstance;
  constructor(http: typeof axiosInstance = axiosInstance) {
    this.http = http;
  }

  async getUserDetails(
    _id: string,
    role: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(
        `/api/user/get-user?_id=${_id}&role=${role}`
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  };

  async getAllActivities(page: number, limit: number, search: string, filter = true): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(`/api/user/get-activities?page=${page}&limit=${limit}&search=${search}&filter=${filter}`)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async createBlog( data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await this.http.post<AuthResponse>(`/api/user/blog/create-blog`, data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went Wrong! Please try again"
      throw new Error(message)
    }
  }

  async getBlogs(page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/blog/get-blogs?page=${page}?limit=${limit}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getBlog(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      console.log("fetch blog called")
      const response = await axiosInstance.get<AuthResponse>(`/api/user/blog/get-blog/${id}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong! please try again"
      throw new Error(message)
    }
  }

  async getMyBlogs(id: string, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/blog/get-myblogs?id=${id}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async editBlog(id: string, data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(`/api/user/blog/edit-blog/${id}`, data);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again.";
      throw new Error(message)
    }
  }

  async deleteBlog(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.delete<AuthResponse>(`/api/user/blog/delete-blog/${id}`)
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again.";
      throw new Error(message)
    }
  }

  async getActivityDetails(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/activity/get-details/${id}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again"
      throw new Error(message)
    }
  }

  async BookActivit (data: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/api/user/activity/booking',{data});
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getOrder (orderId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/activity/order/${orderId}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "Something went wrong! Please try again"

      throw new Error(message);
    }
  }

  async getCategories (): Promise<AxiosResponse<AuthResponse>>{
    try {
      const response = await axiosInstance.get<AuthResponse>('/api/user/get-categories');
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

  async filterSearch(page: number, limit: number, filters: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/activity/filter`, {
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

  async editProfile(id: string, data: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(`/api/user/update-profile/${id}`, data)
      return response
    } catch (error) {
      console.log(error)
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went frong! Please try again."
      throw new Error(message)
    }
  }

  async getBookedActivity (id: string, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      console.log(id)
      const response = await axiosInstance.get<AuthResponse>(`/api/user/get-bookings?id=${id}&page=${page}&limit=${limit}`);
      return response
    } catch (error) {
      console.log(error);
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async cancelBooking(bookedActivity: Booking, message: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/api/user/cancel-booking?id=${bookedActivity._id}&message=${message}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

  async getConverSations(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/chat/get-conversation/${id}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try agian.";
      throw new Error(message);
    }
  }

  async searchUser (search: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/get-user/${search}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went Wrong!. Please try again.";
      throw new Error(message);
    }
  }

  async getMessages (conversationId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/get-chat/${conversationId}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong. Please try again.";
      throw new Error(message)
    }
  }

  async MarkReadMessage (conversationId: string, userId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(`/api/user/mark-read-message/${conversationId}/${userId}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again";
      throw new Error(message)
    }
  }

  async fetchNotification (userId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/get-notification/${userId}`);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again."
      throw new Error(message)
    }
  }

  async writeReview (review: ReviewDTO): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(`/api/user/review/write-review`, {review});
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      " Something went wrong!. Please try again!."
      throw new Error(message)
    }
  }

  async getHomeData (page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/api/user/get-homeData?page-${page}&limit=${limit}`);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again!."
      throw new Error(message)
    }
  }

}

export const userService = new UserService();