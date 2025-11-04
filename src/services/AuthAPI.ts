import type { AuthResponse } from "../shared/types/global";
import type { LoginDTO, SignupDTO } from "../shared/types/DTO";
import type { ErrorResponse } from "../shared/types/auth.type";
import { axiosInstance } from "../api/axiosInstance";
import { socketService } from "./SocketService";
import type { AxiosResponse } from "axios";
import { HttpStatusCode } from "../shared/constants/constants";
import { API_ROUTES } from "@/shared/constants/apiRoutes";
import { config } from "@/shared/constants/config";

export class AuthAPI {
  async register(
    data: SignupDTO | FormData
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ROUTES.AUTH.SEND_OTP,
        data
      );

      console.log(response);
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async verify(otp: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, {
        otp,
      });
      return response;
    } catch (error) {
      console.log("please checkthis error: ", error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";

      throw new Error(message);
    }
  }

  async verifyEmail(
    email: string,
    role: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ROUTES.AUTH.FORGOT_PASSWORD,
        { email, role }
      );

      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";

      throw new Error(message);
    }
  }

  async resetPassword(
    id: string,
    role: string,
    token: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(
        API_ROUTES.AUTH.RESET_PASSWORD(role, id, token),
        { password }
      );
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";

      throw new Error(message);
    }
  }

  async resendOtp(): Promise<AxiosResponse<unknown>> {
    try {
      const response = await axiosInstance.post(API_ROUTES.AUTH.RESEND_OTP);
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async login(data: LoginDTO): Promise<AxiosResponse<AuthResponse>> {
    try {
      console.log(import.meta.env.VITE_API_BASE_URL)
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, {
        data,
      });
      return response;
    } catch (error) {
      console.log("login", error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async verifyToken(): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(API_ROUTES.AUTH.VERIFY_TOKEN);
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async googleLogin(role: string) {
    try {
      window.location.href = `${config.VITE_API_BASE_URL}${API_ROUTES.AUTH.GOOGLE_LOGIN(role)}`;
    } catch (error) {
      if (error) {
        throw new Error("something went wrong please try again");
      }
    }
  }

  async logout(role: string) {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        API_ROUTES.AUTH.LOGOUT(role)
      );
      if(response.status === HttpStatusCode.OK) {
        socketService.disconnect();
      }
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "sonme thing went wrong!. Please try again";
      throw new Error(message);
    }
  }
  async getUserProfile(id: string, role: string): Promise<AxiosResponse<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(API_ROUTES.AUTH.GET_PROFILE(role, id));
      return response
    } catch (error) {
      console.log(error)
      const message = (error as ErrorResponse).response?.data?.message || 
      "some thing went wrong!. Please try again";
      throw new Error(message)
    }
  }
 
}

export const authService = new AuthAPI();
