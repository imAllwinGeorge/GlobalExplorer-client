import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthAPI } from "../../../services/AuthAPI";
const authAPI = new AuthAPI();
export const register = createAsyncThunk("auth/register", async (otp, { rejectWithValue }) => {
    try {
        const response = await authAPI.verify(otp);
        return response.data;
    }
    catch (error) {
        console.log("thunk error response: ", error);
        if (error instanceof Error) {
            return rejectWithValue(error.message || "unexpected error occured");
        }
        ;
    }
});
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await authAPI.login(credentials);
        console.log("login api response:", response);
        return response.data;
    }
    catch (error) {
        console.log("thunk error response: ", error);
        if (error instanceof Error) {
            return rejectWithValue(error.message || "login failed");
        }
    }
});
export const googleLogin = createAsyncThunk("auth/google-login", async (role, { rejectWithValue }) => {
    try {
        const response = await authAPI.googleLogin(role);
        return response;
    }
    catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message || "google login failed");
        }
    }
});
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
        },
        setGoogleUser(state, action) {
            state.user = action.payload;
            state.token = "qwertyui";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.user = action.payload.user;
            }
            state.token = "asdfghjklwertyuizxcvbnm";
        })
            .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
            .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
            console.log("login fullfilled", action);
            state.loading = false;
            if (action.payload) {
                state.user = action.payload.user;
                state.token = action.payload.token;
            }
        })
            .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            console.log("login rejected", action);
        });
    },
});
export const { logout, setGoogleUser } = authSlice.actions;
export default authSlice.reducer;
