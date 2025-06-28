import type { AuthResponse, ResponseType } from "../shared/types/global";
import { authAxiosInstace } from "../api/auth.axios";
import type { SignupDTO } from "../shared/types/DTO";
import type { ErrorResponse } from "../shared/types/auth.type";

// interface SignupDTO {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthAPI {
  async register(data: SignupDTO | FormData): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await authAxiosInstace.post<AuthResponse>(
        "/api/send-otp",
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
      const response = await authAxiosInstace.post<AuthResponse>(
        "/api/register",
        {
          otp,
        }
      );
      return response;
    } catch (error) {
      console.log("please checkthis error: ", error);
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";

      throw new Error(message); // ✅ Throw a proper error
    }
  }

  async verifyEmail(email: string, role: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await authAxiosInstace.post<AuthResponse>(
        "/api/forgot-password",
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
      const response = await authAxiosInstace.patch<AuthResponse>(
        `/api/reset-password/${role}/${id}/${token}`,
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
      const response = await authAxiosInstace.post("/api/resend-otp");
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
      const response = await authAxiosInstace.post<AuthResponse>("/api/login", {
        data,
      });
      return response;
    } catch (error) {
      console.log("login",error)
      const message = (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async verifyToken(): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await authAxiosInstace.post<AuthResponse>(
        "/api/verify-token"
      );
      if (!response) throw new Error("something went wrong");
      return response;
    } catch (error) {
      const message = (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }

  async googleLogin(role: string) {
    try {
      window.location.href = `http://localhost:3000/api/auth/google?role=${role}`;
    } catch (error) {
      if (error) {
        throw new Error("something went wrong please try again");
      }
    }
  }
}
