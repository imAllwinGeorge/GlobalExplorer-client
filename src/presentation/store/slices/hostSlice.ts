import { createSlice } from "@reduxjs/toolkit";
import type { IHost } from "../../../shared/types/user.type";


interface HostState  {
  host: null | IHost;
}

const initialState: HostState = {
  host: null,
};

const hostSlice = createSlice({
  name: "host",
  initialState,
  reducers: {
    hostRegister: (state, action) => {
      console.log("fownownobwnogfslfsjogw", action)
      state.host = action.payload;
    },
    hostLogin: (state, action) => {
      state.host = action.payload;
    },
    hostLogout: (state) => {
      state.host = null;
    },
  },
});

export const {hostRegister, hostLogin, hostLogout} = hostSlice.actions;
export default hostSlice.reducer;