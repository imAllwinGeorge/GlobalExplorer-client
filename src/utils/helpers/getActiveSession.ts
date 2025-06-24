import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../presentation/store";

export const getActiveSession = createSelector(
    (state: RootState) => state.auth.user,
    (state: RootState) => state.admin.admin,
    (user, admin) => {
        if(user) return {role: user.role, type: "user"};
        if(admin) return {role: admin.role, type: 'admin'};
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