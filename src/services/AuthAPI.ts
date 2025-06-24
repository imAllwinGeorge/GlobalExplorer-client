import type { AuthResponse, ResponseType } from "../shared/types/global";
import { authAxiosInstace } from "../api/auth.axios";
import type { SignupDTO } from "../shared/types/DTO";

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
  async register(data: SignupDTO): Promise<ResponseType<AuthResponse>> {
    const response = await authAxiosInstace.post<AuthResponse>(
      "/api/send-otp",
      {
        data,
      }
    );
    if (!response) throw new Error("signup faild");
    console.log(response);
    return response;
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
      console.log("please checkthis error: ",error)
      if(error){
        return error
      }
    }
  }

  async verifyEmail(email: string): Promise<ResponseType<AuthResponse>> {
    const response = await authAxiosInstace.post<AuthResponse>(
      "/api/forgot-password",{email}
    )
    if(!response) throw new Error("email verification Error")
      console.log(response)
    return response
  }

  async resetPassword(id: string, token: string, password: string): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await authAxiosInstace.patch<AuthResponse>(
      `/api/reset-password/${id}/${token}`,{password}
    )
    return response
    } catch (error) {
      console.log(error)
      return 
    }
  }

  async resendOtp(): Promise<ResponseType<unknown>> {
    const response = await authAxiosInstace.post("/api/resend-otp");
    if (!response) throw new Error("resend otp error");
    return response;
  }

  async login(data: LoginDTO): Promise<ResponseType<AuthResponse>> {
    const response = await authAxiosInstace.post<AuthResponse>("/api/login", {
      data,
    });
    if (!response) throw new Error("login failed");
    return response;
  }

  async verifyToken(): Promise<ResponseType<AuthResponse>> {
    const response = await authAxiosInstace.post<AuthResponse>(
      "/api/verify-token"
    );
    if (!response) throw new Error("something went wrong");
    return response;
  }

  async googleLogin(role: string) {
   window.location.href = `http://localhost:3000/api/auth/google?role=${role}`
  }
}
