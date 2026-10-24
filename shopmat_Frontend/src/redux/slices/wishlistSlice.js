import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("shopmart-wishlist") || "[]");

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: saved },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((i) => i.id === product.id);
      state.items = exists
        ? state.items.filter((i) => i.id !== product.id)
        : [...state.items, product];
      localStorage.setItem("shopmart-wishlist", JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("shopmart-wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;