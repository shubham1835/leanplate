import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i.id === payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...payload, qty: 1 });
      }
    },
    removeItem(state, { payload: id }) {
      const existing = state.items.find((i) => i.id === id);
      if (!existing) return;
      if (existing.qty > 1) {
        existing.qty -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== id);
      }
    },
    deleteItem(state, { payload: id }) {
      state.items = state.items.filter((i) => i.id !== id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────
export const selectCartItems  = (s) => s.cart.items;
export const selectCartCount  = (s) => s.cart.items.reduce((t, i) => t + i.qty, 0);
export const selectCartTotal  = (s) => s.cart.items.reduce((t, i) => t + i.price * i.qty, 0);
export const selectItemQty    = (id) => (s) => s.cart.items.find((i) => i.id === id)?.qty || 0;
export const selectCartMacros = (s) =>
  s.cart.items.reduce(
    (acc, i) => ({
      protein: acc.protein + (i.proteinG || 0) * i.qty,
      carbs:   acc.carbs   + (i.carbsG   || 0) * i.qty,
      fat:     acc.fat     + (i.fatG     || 0) * i.qty,
      cal:     acc.cal     + (i.calories || 0) * i.qty,
    }),
    { protein: 0, carbs: 0, fat: 0, cal: 0 }
  );

export default cartSlice.reducer;
