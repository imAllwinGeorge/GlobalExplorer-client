import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    admin: null
};
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        adminLogin: (state, action) => {
            console.log("from the adminSlice", action);
            state.admin = action.payload;
        },
        adminLogout: (state) => {
            state.admin = null;
        }
    }
});
export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
