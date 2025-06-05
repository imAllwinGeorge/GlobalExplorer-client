import type { LoginDTO, SignupDTO } from "../../domain/entities/Auth";
import type { AuthResponse, ResponseType } from "../../shared/types/global";
import { axiosInstace } from "./axiosInstace";

export class AuthAPI {
    async register (data: SignupDTO): Promise<ResponseType<AuthResponse>>{
        const response = await axiosInstace.post<AuthResponse>("/api/send-otp",{data})
        if(!response) throw new Error("signup faild");
        console.log(response)
        return response
    }

    async verify (otp: string): Promise<ResponseType<AuthResponse>>{
        const response = await axiosInstace.post<AuthResponse>("/api/register",{otp})
        if(!response) throw new Error("otp verification error")
            console.log(response)
            return response
    }

    async resendOtp (): Promise<ResponseType<unknown>> {
        const response = await axiosInstace.post("/api/resend-otp")
        if(!response) throw new Error("resend otp error")
            return response
    }

    async login (data: LoginDTO): Promise<ResponseType<AuthResponse>> {
        const response = await axiosInstace.post<AuthResponse>("/api/login",{data})
        if(!response) throw new Error("login failed")
            return response;
    }

    async verifyToken(): Promise<ResponseType<AuthResponse>> {
        const response = await axiosInstace.post<AuthResponse>("/api/verify-token")
        if(!response) throw new Error("something went wrong")
            return response;
    }
}