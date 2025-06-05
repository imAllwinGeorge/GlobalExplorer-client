import type { AuthResponse, ResponseType } from "../../../shared/types/global";
import type { SignupDTO } from "../../../domain/entities/Auth";

export interface IAuthUsecase {
  register(data: SignupDTO): Promise<ResponseType<AuthResponse>>;
  verify (otp: string): Promise<ResponseType<AuthResponse>>;
}
