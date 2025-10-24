import { axiosInstance } from "../api/axiosInstance";
import { HttpStatusCode } from "../shared/constants/constants";
export const adminService = {
    getAllUsers: async (page, limit, role, query, filter) => {
        try {
            const response = await axiosInstance.get(`/admin/get-users/${role}?page=${page}&limit=${limit}&search=${query}&filter=${filter}`);
            if (response.status === HttpStatusCode.OK) {
                console.log(response);
                return { users: response.data.users, totalPages: response.data.totalPages };
            }
            return { users: [], totalPages: 1 };
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Error fetching users";
            throw new Error(message);
        }
    },
    updateStatus: async (_id, value, role) => {
        try {
            const response = await axiosInstance.post(`/admin/update-status/${role}`, { _id, value });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    },
    getUserDetails: async (_id, role) => {
        try {
            const response = await axiosInstance.get(`/admin/get-user?_id=${_id}&role=${role}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    },
    addCategory: async (data) => {
        try {
            const response = await axiosInstance.post("/admin/add-category", { data });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    },
    getCategories: async (page, limit, query) => {
        try {
            const response = await axiosInstance.get(`/admin/get-category?page=${page}&limit=${limit}&search=${query}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong!. Please try again";
            throw new Error(message);
        }
    },
    editCategory: async (data) => {
        try {
            const response = await axiosInstance.put("/admin/edit-category", data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong! Please try again";
            throw new Error(message);
        }
    },
    updateCategoryStatus: async (data) => {
        try {
            const response = await axiosInstance.patch("/admin/edit-category", data);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "something went wrong! Please try again";
            throw new Error(message);
        }
    },
    getActivities: async (page = 1, limit = 3, query, filter) => {
        try {
            const response = await axiosInstance.get(`/admin/get-activities?page=${page}&limit=${limit}&search=${query}&filter=${filter}`);
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wront! Please try again";
            throw new Error(message);
        }
    },
    updateActivityStatus: async (id, data) => {
        try {
            const response = await axiosInstance.patch(`/admin/activity/status/${id}`, { data });
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went Wrong! Please try again.";
            throw new Error(message);
        }
    },
    dashboardData: async () => {
        try {
            const response = axiosInstance.get("/admin/dashboard");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                " Something went wrong!. Please try again";
            throw new Error(message);
        }
    },
    salesData: async () => {
        try {
            const response = axiosInstance.get("/admin/sales");
            return response;
        }
        catch (error) {
            const message = error.response?.data?.message ||
                "Something went wrong!. Please try again";
            throw new Error(message);
        }
    }
};
