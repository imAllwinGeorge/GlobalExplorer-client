import type { AuthResponse, ResponseType } from "../shared/types/global";
import type { LoginDTO, SignupDTO } from "../shared/types/DTO";
import type { ErrorResponse } from "../shared/types/auth.type";
import { axiosInstance } from "../api/axiosInstance";

// interface SignupDTO {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

export class AuthAPI {
  async register(
    data: SignupDTO | FormData
  ): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/send-otp",
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

  async verify(otp: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/register", {
        otp,
      });
      return response;
    } catch (error) {
      console.log("please checkthis error: ", error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";

      throw new Error(message); // ✅ Throw a proper error
    }
  }

  async verifyEmail(
    email: string,
    role: string
  ): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/forgot-password",
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
  ): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.patch<AuthResponse>(
        `/reset-password/${role}/${id}/${token}`,
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

  async resendOtp(): Promise<ResponseType<unknown>> {
    try {
      const response = await axiosInstance.post("/resend-otp");
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async login(data: LoginDTO): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/login", {
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

  async verifyToken(): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.post<AuthResponse>("/verify-token");
      // if (!response) throw new Error("something went wrong");
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
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?role=${role}`;
    } catch (error) {
      if (error) {
        throw new Error("something went wrong please try again");
      }
    }
  }

  async logout(role: string) {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `/logout/${role}`
      );
      return response;
    } catch (error) {
      console.log(error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "sonme thing went wrong!. Please try again";
      throw new Error(message);
    }
  }
  async getUserProfile(id: string, role: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await axiosInstance.get<AuthResponse>(`/get-profile?role=${role}&id=${id}`);
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
