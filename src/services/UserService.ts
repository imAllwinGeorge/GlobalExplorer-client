import { userAxiosInstace } from "../api/user.axios";
import type { ErrorResponse } from "../shared/types/auth.type";
import type { AuthResponse, ResponseType } from "../shared/types/global";

export class UserService {
  private http: typeof userAxiosInstace;
  constructor(http: typeof userAxiosInstace = userAxiosInstace) {
    this.http = http;
  }

  async getUserDetails(
    _id: string,
    role: string
  ): Promise<ResponseType<AuthResponse>> {
    try {
      const response = await this.http.get<AuthResponse>(
        `/get-user?_id=${_id}&role=${role}`
      );
      return response;
    } catch (error) {
      const message =
        (error as ErrorResponse).response?.data?.message ||
        "something went wrong!. Please try again";
      throw new Error(message);
    }
  }
}

export const userService = new UserService();