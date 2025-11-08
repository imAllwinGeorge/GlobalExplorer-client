export const API_ROUTES = {
  AUTH: {
    SEND_OTP: "/api/send-otp",
    REGISTER: "/api/register",
    FORGOT_PASSWORD: "/api/forgot-passowrd",
    RESET_PASSWORD: (role: string, id: string, token: string) =>
      `/api/reset-password/${role}/${id}/${token}`,
    RESEND_OTP: "/api/resend-otp",
    LOGIN: "/api/login",
    VERIFY_TOKEN: "/api/verify-token",
    GOOGLE_LOGIN: (role: string) => `/api/auth/google?role=${role}`,
    LOGOUT: (role: string) => `/api/logout/${role}`,
    GET_PROFILE: (role: string, id: string) =>
      `/api/get-profile?role=${role}&id=${id}`,
  },
  ADMIN: {
    GET_USERS: (
      role: "user" | "host",
      page: number,
      limit: number,
      query: string,
      filter: string | boolean
    ) =>
      `/api/admin/get-users/${role}?page=${page}&limit=${limit}&search=${query}&filter=${filter}`,
    UPDATE_STATUS: (role: string) => `/api/admin/update-status/${role}`,
    GET_USER: (_id: string, role: string) =>
      `/api/admin/get-user?_id=${_id}&role=${role}`,
    ADD_CATEGORY: "/api/admin/add-category",
    GET_CATEGORY: (page: number, limit: number, query: string) =>
      `/api/admin/get-category?page=${page}&limit=${limit}&search=${query}`,
    EDIT_CATEGORY: "/api/admin/edit-category",
    UPDATE_CATEGORY: "/api/admin/edit-category",
    GET_ACTIVITIES: (
      page: number,
      limit: number,
      query: string,
      filter: string | boolean
    ) =>
      `/api/admin/get-activities?page=${page}&limit=${limit}&search=${query}&filter=${filter}`,
    ACTIVITY_STATUS: (id: string) => `/api/admin/activity/status/${id}`,
    DASHBOARD: `/api/admin/dashboard`,
    SALES: "/api/admin/sales",
  },
  HOST: {
    GET_ACTIVITIES: (
      id: string,
      page: number,
      limit: number,
      search: string,
      filter: string | boolean
    ) =>
      `/api/host/get-activity/${id}?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
    GET_CATEGORIES: "/api/host/get-categories",
    ADD_ACTIVITY: "/api/host/add-activity",
    EDIT_ACTIVITY: (id: string) => `/api/host/edit-activity/${id}`,
    UPDATE_ACTIVITY: (id: string) => `/api/host/edit-activity/${id}`,
    EDIT_PROFILE: (id: string) => `/api/host/update-profile/${id}`,
    GET_BOOKINGS: (
      id: string,
      page: number,
      limit: number,
      search: string,
      filter: string | boolean
    ) =>
      `/api/host/get-bookings?hostId=${id}&page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
    DASHBOARD: (id: string) => `/api/host/dashboard/${id}`,
    GET_CONVERSATION: (id: string) => `/api/host/chat/get-conversation/${id}`,
    MARK_READ_MESSAGE: (conversationId: string, userId: string) =>
      `/api/host/mark-read-message/${conversationId}/${userId}`,
    SALES: (id: string) => `/api/host/sales/${id}`,
    VERIFY_BOOKING: `/api/host/booking/qr-verification`,
    TODAY_BOOKING: (id: string, page: number, limit: number) => `/api/host/booking/today/${id}?page=${page}&limit=${limit}`
  },
  USER: {
    GET_USER: (_id: string, role: string) =>
      `/api/user/get-user?userId=${_id}&role=${role}`,
    GET_ACTIVITIES: (
      page: number,
      limit: number,
      search: string,
      filter: boolean
    ) =>
      `/api/user/get-activities?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
    CREATE_BLOG: "/api/user/blog/create-blog",
    GET_BLOGS: (page: number, limit: number) =>
      `/api/user/blog/get-blogs?page=${page}&limit=${limit}`,
    GET_BLOG: (id: string) => `/api/user/blog/get-blog/${id}`,
    GET_MY_BLOGS: (id: string, page: number, limit: number) =>
      `/api/user/blog/get-myblogs?id=${id}&page=${page}&limit=${limit}`,
    EDIT_BLOG: (id: string) => `/api/user/blog/edit-blog/${id}`,
    DELETE_BLOG: (id: string) => `/api/user/blog/delete-blog/${id}`,
    GET_ACTIVITY_DETAILS: (id: string) =>
      `/api/user/activity/get-details/${id}`,
    BOOK_ACTIVITY: "/api/user/activity/booiking",
    GET_BOOKING: (orderId: string) => `/api/user/activity/order/${orderId}`,
    GET_CATEGORIES: "/api/user/get-categories",
    FILTER_SEARCH: "/api/user/activity/filter",
    UPDATE_PROFILE: (id: string) => `/api/user/update-profile/${id}`,
    GET_BOOKINGS: (id: string, page: number, limit: number) =>
      `/api/user/get-bookings?id=${id}&page=${page}&limit=${limit}`,
    CANCEL_BOOKING: (bookingId: string, message: string) =>
      `/api/user/cancel-booking?id=${bookingId}&message=${message}`,
    GET_CONVERSATION: (id: string) => `/api/user/chat/get-conversation/${id}`,
    SEARCH_USER: (search: string) => `/api/user/get-user/${search}`,
    GET_CHAT: (conversationId: string) =>
      `/api/user/get-chat/${conversationId}`,
    MARK_READ_MESSAGE: (conversationId: string, userId: string) =>
      `/api/user/mark-read-message/${conversationId}/${userId}`,
    GET_NOTIFICATION: (userId: string, page: number, limit: number) =>
      `/api/user/get-notification/${userId}?page=${page}&limit=${limit}`,
    WRITE_REVIEW: "/api/user/review/write-review",
    DASHBOARD: (page: number, limit: number) =>
      `/api/user/get-homeData?page${page}&limit=${limit}`,
  },
};
