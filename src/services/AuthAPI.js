import { axiosInstance } from "../api/axiosInstance";
import { socketService } from "./SocketService";
import { HttpStatusCode } from "../shared/constants/constants";
// interface SignupDTO {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }
export class AuthAPI {
    async register(data) {
        try {
            const response = await axiosInstance.post("/send-otp", data);
            console.log(response);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async verify(otp) {
        try {
            const response = await axiosInstance.post("/register", {
                otp,
            });
            return response;
        }
        catch (error) {
            console.log("please checkthis error: ", error);
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message); // ✅ Throw a proper error
        }
    }
    async verifyEmail(email, role) {
        try {
            const response = await axiosInstance.post("/forgot-password", { email, role });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async resetPassword(id, role, token, password) {
        try {
            const response = await axiosInstance.patch(`/reset-password/${role}/${id}/${token}`, { password });
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async resendOtp() {
        try {
            const response = await axiosInstance.post("/resend-otp");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async login(data) {
        try {
            const response = await axiosInstance.post("/login", {
                data,
            });
            return response;
        }
        catch (error) {
            console.log("login", error);
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async verifyToken() {
        try {
            const response = await axiosInstance.post("/verify-token");
            // if (!response) throw new Error("something went wrong");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async googleLogin(role) {
        try {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?role=${role}`;
        }
        catch (error) {
            if (error) {
                throw new Error("something went wrong please try again");
            }
        }
    }
    async logout(role) {
        try {
            const response = await axiosInstance.post(`/logout/${role}`);
            if (response.status === HttpStatusCode.OK) {
                socketService.disconnect();
            }
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "sonme thing went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async getUserProfile(id, role) {
        try {
            const response = await axiosInstance.get(`/get-profile?role=${role}&id=${id}`);
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "some thing went wrong!. Please try again";
            throw new Error(message);
        }
    }
}
export const authService = new AuthAPI();
