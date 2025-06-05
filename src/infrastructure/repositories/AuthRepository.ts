import type { LoginDTO, SignupDTO } from "../../domain/entities/Auth";
import type { AuthAPI } from "../../infrastructure/api/AuthAPI";
import type { AuthResponse, ResponseType } from "../../shared/types/global";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  private api: AuthAPI;

  constructor(api: AuthAPI) {
    this.api = api;
  }

  async register(data: SignupDTO): Promise<ResponseType<AuthResponse>> {
    const response = await this.api.register(data);
    return response;
  }

  async verifyOtp(otp: string): Promise<ResponseType<AuthResponse>> {
    const response = await this.api.verify(otp);
    return response;
  }

  async resendOtp(): Promise<ResponseType<unknown>> {
    return await this.api.resendOtp();
  }

  async login(data: LoginDTO): Promise<ResponseType<AuthResponse>> {
    const response = await this.api.login(data);
    return response;
  }

  async verifyToken(): Promise<ResponseType<AuthResponse>> {
    const response = await this.api.verifyToken();
    return response;
  }
}
