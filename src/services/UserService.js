import { axiosInstance } from "../api/axiosInstance";
export class UserService {
    constructor(http = axiosInstance) {
        Object.defineProperty(this, "http", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.http = http;
    }
    async getUserDetails(_id, role) {
        try {
            const response = await this.http.get(`/user/get-user?_id=${_id}&role=${role}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    ;
    async getAllActivities(page, limit, search, filter = true) {
        try {
            const response = await this.http.get(`/user/get-activities?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async createBlog(data) {
        try {
            const response = await this.http.post(`/user/blog/create-blog`, data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went Wrong! Please try again";
            throw new Error(message);
        }
    }
    async getBlogs(page, limit) {
        try {
            const response = await axiosInstance.get(`/user/blog/get-blogs?page=${page}?limit=${limit}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async getBlog(id) {
        try {
            console.log("fetch blog called");
            const response = await axiosInstance.get(`/user/blog/get-blog/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong! please try again";
            throw new Error(message);
        }
    }
    async getMyBlogs(id, page, limit) {
        try {
            const response = await axiosInstance.get(`/user/blog/get-myblogs?id=${id}&page=${page}&limit=${limit}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async editBlog(id, data) {
        try {
            const response = await axiosInstance.put(`/user/blog/edit-blog/${id}`, data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again.";
            throw new Error(message);
        }
    }
    async deleteBlog(id) {
        try {
            const response = await axiosInstance.delete(`/user/blog/delete-blog/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again.";
            throw new Error(message);
        }
    }
    async getActivityDetails(id) {
        try {
            const response = await axiosInstance.get(`/user/activity/get-details/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! please try again";
            throw new Error(message);
        }
    }
    async BookActivit(data) {
        try {
            const response = await axiosInstance.post('/user/activity/booking', { data });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async getOrder(orderId) {
        try {
            const response = await axiosInstance.get(`/user/activity/order/${orderId}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async getCategories() {
        try {
            const response = await axiosInstance.get('/user/get-categories');
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again.";
            throw new Error(message);
        }
    }
    async filterSearch(page, limit, filters) {
        try {
            const response = await axiosInstance.get(`/user/activity/filter`, {
                params: {
                    page,
                    limit,
                    ...filters,
                },
            });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async editProfile(id, data) {
        try {
            const response = await axiosInstance.put(`/user/update-profile/${id}`, data);
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "Something went frong! Please try again.";
            throw new Error(message);
        }
    }
    async getBookedActivity(id, page, limit) {
        try {
            console.log(id);
            const response = await axiosInstance.get(`/user/get-bookings?id=${id}&page=${page}&limit=${limit}`);
            return response;
        }
        catch (error) {
            console.log(error);
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again";
            throw new Error(message);
        }
    }
    async cancelBooking(bookedActivity, message) {
        try {
            const response = await axiosInstance.patch(`/user/cancel-booking?id=${bookedActivity._id}&message=${message}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong! Please try again.";
            throw new Error(message);
        }
    }
    async getConverSations(id) {
        try {
            const response = await axiosInstance.get(`/user/chat/get-conversation/${id}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try agian.";
            throw new Error(message);
        }
    }
    async searchUser(search) {
        try {
            const response = await axiosInstance.get(`/user/get-user/${search}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went Wrong!. Please try again.";
            throw new Error(message);
        }
    }
    async getMessages(conversationId) {
        try {
            const response = await axiosInstance.get(`/user/get-chat/${conversationId}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong. Please try again.";
            throw new Error(message);
        }
    }
    async MarkReadMessage(conversationId, userId) {
        try {
            const response = await axiosInstance.patch(`/user/mark-read-message/${conversationId}/${userId}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again";
            throw new Error(message);
        }
    }
    async fetchNotification(userId) {
        try {
            const response = await axiosInstance.get(`user/get-notification/${userId}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again.";
            throw new Error(message);
        }
    }
    async writeReview(review) {
        try {
            const response = await axiosInstance.post(`/user/review/write-review`, { review });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                " Something went wrong!. Please try again!.";
            throw new Error(message);
        }
    }
    async getImages() {
        try {
            const response = await axiosInstance.get("/user/get-images");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again!.";
            throw new Error(message);
        }
    }
}
export const userService = new UserService();
