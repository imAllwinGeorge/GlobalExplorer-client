import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../presentation/store";

export const getActiveSession = createSelector(
    (state: RootState) => state.auth.user,
    (state: RootState) => state.admin.admin,
    (state: RootState) => state.host.host,
    (user, admin, host) => {
        if(user) return {role: user.role, type: "user"};
        if(admin) return {role: admin.role, type: 'admin'};
        if(host) return {role: host.role, type: "host"};
        return null;
    }
)

export const getUserSession = createSelector(
    (state: RootState) => state.auth.user,
    (user) => {
        if(user) return {role: user.role, type: "user"};
    }
)

export const getAdminSession = createSelector(
    (state: RootState) => state.admin.admin,
    (admin) => {
        if(admin) return {role: admin.role, type: "admin"}
    }
)

export const getHostSession = createSelector(
    (state: RootState) => state.host.host,
    (host) => {
        if(host) return {role: host.role, type: "host"}
    }
)