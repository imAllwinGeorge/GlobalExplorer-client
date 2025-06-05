import type { LoginDTO, SignupDTO } from "../../domain/entities/Auth";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { AuthResponse, ResponseType } from "../../shared/types/global";
import type { IAuthUsecase } from "./interfaces/IAuthUsecase";

export class AuthUseCase implements IAuthUsecase {
  private repository: IAuthRepository

  constructor(repository: IAuthRepository){
    this.repository = repository
  }


  async register(data: SignupDTO): Promise<ResponseType<AuthResponse>> {
    return this.repository.register(data)
  }

  async verify (otp: string): Promise<ResponseType<AuthResponse>> {
    return this.repository.verifyOtp(otp)
  }
  
  async resendOtp ():Promise<ResponseType<unknown>> {
    return this.repository.resendOtp();
  }

  async login (data: LoginDTO): Promise<ResponseType<AuthResponse>> {
    return this.repository.login(data);
  }

  async verifyToken(): Promise<ResponseType<AuthResponse>> {
    return this.repository.verifyToken();
  }

}