import { createSlice } from "@reduxjs/toolkit";
import type { IAdmin } from "../../../shared/types/user.type";

interface AdminState {
    admin: IAdmin | null
}

const initialState: AdminState = {
    admin: null
}

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLogin: (state, action) => {
            console.log("from the adminSlice",action)
            state.admin = action.payload
        },
        adminLogout: (state) => {
            state.admin = null
        }
    }

})

export const {adminLogin, adminLogout} = adminSlice.actions;
export default adminSlice.reducer;