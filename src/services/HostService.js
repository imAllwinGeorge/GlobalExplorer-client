import { axiosInstance } from "../api/axiosInstance";
export class HostService {
    async getActivities(id, page, limit, search, filter) {
        try {
            const response = await axiosInstance.get(`/host/get-activity/${id}?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "something went wrong! Please try again later..";
            throw new Error(message);
        }
    }
    async getCategories() {
        try {
            const response = await axiosInstance.get("/host/get-categories");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong! Please try again later";
            throw new Error(message);
        }
    }
    async addActivity(data) {
        try {
            const response = await axiosInstance.post("/host/add-Activity", data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again later";
            throw new Error(message);
        }
    }
    async editActivity(id, data) {
        try {
            const response = await axiosInstance.put(`/host/edit-activity/${id}`, data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wront! please try again";
            throw new Error(message);
        }
    }
    async updateStatus(id, data) {
        try {
            const response = await axiosInstance.patch(`/host/edit-activity/${id}`, { data });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went Wrong! Please try again.";
            throw new Error(message);
        }
    }
    async editProfile(id, data) {
        try {
            const response = await axiosInstance.post(`/host/update-profile/${id}`, data);
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "Something went frong! Please try again.";
            throw new Error(message);
        }
    }
    async activityBookings(id, page, limit, search, filter) {
        try {
            const response = await axiosInstance.get(`/host/get-bookings?id=${id}&page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! please try again.";
            throw new Error(message);
        }
    }
    async dashboardData(id) {
        try {
            const response = await axiosInstance.get(`/host/dashboard/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! please try again.";
            throw new Error(message);
        }
    }
    async getConverSations(id) {
        try {
            const response = await axiosInstance.get(`/host/chat/get-conversation/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try agian.";
            throw new Error(message);
        }
    }
    async MarkReadMessage(conversationId, userId) {
        try {
            const response = await axiosInstance.patch(`/host/mark-read-message/${conversationId}/${userId}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async salesData(id) {
        try {
            const response = axiosInstance.get(`/host/sales/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again";
            throw new Error(message);
        }
    }
}
export const hostService = new HostService();
