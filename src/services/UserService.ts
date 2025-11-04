import { API_ROUTES } from "@/shared/constants/apiRoutes";
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
        API_ROUTES.USER.GET_USER(_id, role)
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
      const response = await this.http.get<AuthResponse>(API_ROUTES.USER.GET_ACTIVITIES(page, limit, search, filter))
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async createBlog( data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await this.http.post<AuthResponse>(API_ROUTES.USER.CREATE_BLOG, data);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went Wrong! Please try again"
      throw new Error(message)
    }
  }

  async getBlogs(page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_BLOGS(page, limit));
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
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_BLOG(id));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "something went wrong! please try again"
      throw new Error(message)
    }
  }

  async getMyBlogs(id: string, page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_MY_BLOGS(id, page, limit));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async editBlog(id: string, data: FormData): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.put<AuthResponse>(API_ROUTES.USER.EDIT_BLOG(id), data);
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again.";
      throw new Error(message)
    }
  }

  async deleteBlog(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.delete<AuthResponse>(API_ROUTES.USER.DELETE_BLOG(id))
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again.";
      throw new Error(message)
    }
  }

  async getActivityDetails(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_ACTIVITY_DETAILS(id));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! please try again"
      throw new Error(message)
    }
  }

  async BookActivit (data: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.USER.BOOK_ACTIVITY,{data});
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again"
      throw new Error(message)
    }
  }

  async getOrder (orderId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_BOOKING(orderId));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message || 
      "Something went wrong! Please try again"

      throw new Error(message);
    }
  }

  async getCategories (): Promise<AxiosResponse<AuthResponse>>{
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_CATEGORIES);
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

  async filterSearch(page: number, limit: number, filters: object): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.FILTER_SEARCH, {
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
      const response = await axiosInstance.put<AuthResponse>(API_ROUTES.USER.UPDATE_PROFILE(id), data)
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
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_BOOKINGS(id, page, limit));
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
      const response = await axiosInstance.patch<AuthResponse>(API_ROUTES.USER.CANCEL_BOOKING(bookedActivity._id, message));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong! Please try again."
      throw new Error(message)
    }
  }

  async getConverSations(id: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_CONVERSATION(id));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try agian.";
      throw new Error(message);
    }
  }

  async searchUser (search: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.SEARCH_USER(search));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went Wrong!. Please try again.";
      throw new Error(message);
    }
  }

  async getMessages (conversationId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_CHAT(conversationId));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong. Please try again.";
      throw new Error(message)
    }
  }

  async MarkReadMessage (conversationId: string, userId: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(API_ROUTES.USER.MARK_READ_MESSAGE(conversationId, userId));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again";
      throw new Error(message)
    }
  }

  async fetchNotification (userId: string, page: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.GET_NOTIFICATION(userId, page, 10));
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again."
      throw new Error(message)
    }
  }

  async writeReview (review: ReviewDTO): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.USER.WRITE_REVIEW, {review});
      return response
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      " Something went wrong!. Please try again!."
      throw new Error(message)
    }
  }

  async getHomeData (page: number, limit: number): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.USER.DASHBOARD(page, limit));
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
      "Something went wrong!. Please try again!."
      throw new Error(message)
    }
  }

}

export const userService = new UserService();