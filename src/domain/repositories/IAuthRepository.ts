import type { AuthResponse, ResponseType } from "../../shared/types/global";
import type { LoginDTO, SignupDTO } from "../entities/Auth";

export interface IAuthRepository {
    register (data: SignupDTO): Promise<ResponseType<AuthResponse>>;
    verifyOtp (otp: string): Promise<ResponseType<AuthResponse>>;
    resendOtp():Promise<ResponseType<unknown>>;
    login(data: LoginDTO): Promise<ResponseType<AuthResponse>>;
    verifyToken(): Promise<ResponseType<AuthResponse>>;
}