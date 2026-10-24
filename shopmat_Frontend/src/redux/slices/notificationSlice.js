
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "success",
  },
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
    },
    clearNotification: (state) => {
      state.message = "";
    },
  },
});

export const {
  showNotification,
  clearNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
