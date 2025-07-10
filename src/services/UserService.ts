import { axiosInstance } from "../api/axiosInstance";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, ResponseType } from "../shared/types/global";

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

  async getAllActivities(page: number, limit: number): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(`/user/get-activities?page=${page}&limit=${limit}`)
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

}

export const userService = new UserService();