import { createSelector } from "@reduxjs/toolkit";
export const getActiveSession = createSelector((state) => state.auth.user, (state) => state.admin.admin, (state) => state.host.host, (user, admin, host) => {
    if (user)
        return { role: user.role, type: "user" };
    if (admin)
        return { role: admin.role, type: 'admin' };
    if (host)
        return { role: host.role, type: "host" };
    return null;
});
export const getUserSession = createSelector((state) => state.auth.user, (user) => {
    if (user)
        return { role: user.role, type: "user" };
});
export const getAdminSession = createSelector((state) => state.admin.admin, (admin) => {
    if (admin)
        return { role: admin.role, type: "admin" };
});
export const getHostSession = createSelector((state) => state.host.host, (host) => {
    if (host)
        return { role: host.role, type: "host" };
});
