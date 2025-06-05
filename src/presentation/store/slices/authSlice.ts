import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthUseCase } from "../../../application/usecases/AuthUsecase";
import { AuthAPI } from "../../../infrastructure/api/AuthAPI";
import type { User } from "../../../shared/types/global";
import { AuthRepository } from "../../../infrastructure/repositories/AuthRepository";

const api = new AuthAPI();
const repository = new AuthRepository(api)
const authUsecase = new AuthUseCase(repository);

export const register = createAsyncThunk(
  "auth/register",
  async (otp: string, { rejectWithValue }) => {
    try {
      const response = await authUsecase.verify(otp);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error || "something went wrong");
    }
  }
);

interface AuthState {
  user: null | User | undefined;
  token: string | null | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
