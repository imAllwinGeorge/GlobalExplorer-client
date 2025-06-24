import { authAxiosInstace } from "../api/auth.axios"
import type { AuthResponse, ResponseType, User } from "../shared/types/global";

export const adminService = {
    getAllUsers: async (role: string): Promise<User[] | undefined > => {
        try {
            const response = await authAxiosInstace.get<{users:User[]}>(`/api/admin/get-users/${role}`);
            if(response.status === 200){
                console.log(response)
                return response.data.users
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },

    updateStatus: async (_id: string, value: object): Promise<ResponseType<AuthResponse>> => {
        const response = await authAxiosInstace.post<AuthResponse>("/api/admin/update-status",{_id , value});
        if(!response) throw new Error("update status error")
        return response
    }
}