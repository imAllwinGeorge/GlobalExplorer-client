export const HttpStatusCode = {
  // ✅ Success responses
  OK : 200, // Request was successful (e.g., fetching data, updating without response body)
  CREATED : 201, // Resource successfully created (e.g., user registration, new booking)
  ACCEPTED : 202, // Request accepted for processing but not completed yet (e.g., background job)
  NO_CONTENT : 204, // Request successful but no content returned (e.g., deleting a resource)

  // ❌ Client errors
  BAD_REQUEST : 400, // Invalid request (e.g., missing fields, invalid data format)
  UNAUTHORIZED : 401, // Authentication required (e.g., user not logged in, invalid token)
  FORBIDDEN : 403, // Access denied (e.g., trying to access admin-only routes)
  NOT_FOUND : 404, // Requested resource not found (e.g., wrong ID, missing endpoint)
  METHOD_NOT_ALLOWED : 405, // HTTP method not supported (e.g., using GET instead of POST)
  CONFLICT : 409, // Conflict in request (e.g., duplicate email, already registered)
  PAYLOAD_TOO_LARGE : 413, // Request payload is too large (e.g., file upload exceeds limit)
  UNSUPPORTED_MEDIA_TYPE : 415, // Unsupported content type (e.g., sending XML instead of JSON)
  TOO_MANY_REQUESTS : 429, // Rate limiting (e.g., too many login attempts, API abuse)

  // ⚠️ Server errors
  INTERNAL_SERVER_ERROR : 500, // Generic server error (e.g., database failure, unhandled exception)
  NOT_IMPLEMENTED : 501, // Feature not implemented yet (e.g., unbuilt endpoint)
  BAD_GATEWAY : 502, // Server received invalid response from upstream (e.g., microservices failure)
  SERVICE_UNAVAILABLE : 503, // Server is down or overloaded (e.g., maintenance mode)
  GATEWAY_TIMEOUT : 504, // Upstream server timed out (e.g., long API response time)
}

export const ROLE = {
  ADMIN: "admin",
  HOST: "host",
  USER: "user"
}

export const LOCAL_STORAGE_KEYS = {
  // Admin
  ADMIN_ACTIVITY_PAGE: "admin_activities_page",
  

  // Host
  HOST_ACTIVITY_PAGE: "host_activities_page",
 

  // User (if needed)
  USER_PAGE: "user_activities_page",
  SELECTED_ACTIVITY: "activity_id",
  EDIT_ACTIVITY: "edit_activity_id",
  USER_FILTER_PAGE: "user_filter_page",
  FILTER_SELECTED_ACTIVITY: "filter_selected_activity",
  FILTERS: "filters",
  SELECTED_BLOG: "selected_blog",
  MY_BOOKING_PAGE: "my_booking_page",
};


export const DIRECT_CHAT_EVENTS = {
  SEND_MESSAGE: "direct-chat:send-message",
  RECEIVE_MESSAGE: "direct-chat:receive-message",
  READ_MESSAGE: "direct-chat:read-message",
  MARK_AS_READ: "direct-chat:mark-as-read",
  DISCONNECT: "disconnect",
};

export const NOTIFICATION_EVENT = {
  SEND_NOTIFICATION: "send:notification",
  READ_NOTIFICATION: "read:notification"
}

// shared/constants/constants.ts
export const VIDEO_CALL_EVENT = {
  CALL_REQUEST: "video:call-request",
  CALL_ACCEPT: "video:call-accept",
  CALL_REJECT: "video:call-reject",
  CALL_END: "video:call-end",
  OFFER: "video:offer",
  ANSWER: "video:answer",
  ICECANDIDATE: "video:icecandidate",
} as const;

export const OPTIONS = {
  admin: [
  { label: "Active", value: true },
  { label: "InActive", value: false },
],
host: [
  { label: "Active", value: true },
  { label: "InActive", value: false },
],
booking:[
  {label: "Up Comming", value: "upcomming"},
  {label: "Completed", value: "completed"},
  {label: "Cancelled", value: "cancelled"}
]
}