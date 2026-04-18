import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "@core/mock/serviceFactory";

// ─── Async Thunks ────────────────────────────────────────────────

export const initiateOrder = createAsyncThunk(
  "orders/initiate",
  async (payload, { rejectWithValue }) => {
    try {
      return await orderService.initiateOrder(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      return await orderService.confirmPayment(orderId, paymentData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment confirmation failed");
    }
  }
);

export const placeOrderWithPlan = createAsyncThunk(
  "orders/placeWithPlan",
  async (payload, { rejectWithValue }) => {
    try {
      return await orderService.placeOrderWithPlan(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMine",
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders(page, size);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchActiveOrder = createAsyncThunk(
  "orders/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getActiveOrder();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch active order");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      await orderService.cancelOrder(orderId);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel order");
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    activeOrder:    null,
    history:        [],
    placedOrder:    null,   // confirmed order (for success screen)
    totalPages:     0,
    loading:        false,
    error:          null,
  },
  reducers: {
    clearPlacedOrder(state) { state.placedOrder = null; },
    clearError(state)       { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (s) => { s.loading = true;  s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };

    builder
      .addCase(initiateOrder.pending,   pending)
      .addCase(initiateOrder.fulfilled, (s, { payload }) => {
        s.loading = false; s.placedOrder = payload;
      })
      .addCase(initiateOrder.rejected,  rejected);

    builder
      .addCase(confirmPayment.pending,   pending)
      .addCase(confirmPayment.fulfilled, (s, { payload }) => {
        s.loading = false; s.placedOrder = payload;
      })
      .addCase(confirmPayment.rejected,  rejected);

    builder
      .addCase(placeOrderWithPlan.pending,   pending)
      .addCase(placeOrderWithPlan.fulfilled, (s, { payload }) => {
        s.loading = false; s.placedOrder = payload;
      })
      .addCase(placeOrderWithPlan.rejected,  rejected);

    builder
      .addCase(fetchMyOrders.pending,   pending)
      .addCase(fetchMyOrders.fulfilled, (s, { payload }) => {
        s.loading    = false;
        s.history    = payload.content;
        s.totalPages = payload.totalPages;
      })
      .addCase(fetchMyOrders.rejected,  rejected);

    builder
      .addCase(fetchActiveOrder.fulfilled, (s, { payload }) => {
        s.activeOrder = payload;
      });

    builder
      .addCase(cancelOrder.fulfilled, (s, { payload: id }) => {
        if (s.activeOrder?.id === id) s.activeOrder = null;
        s.history = s.history.filter((o) => o.id !== id);
      });
  },
});

export const { clearPlacedOrder, clearError } = orderSlice.actions;

export const selectActiveOrder  = (s) => s.orders.activeOrder;
export const selectOrderHistory = (s) => s.orders.history;
export const selectPlacedOrder  = (s) => s.orders.placedOrder;
export const selectOrderLoading = (s) => s.orders.loading;
export const selectOrderError   = (s) => s.orders.error;

export default orderSlice.reducer;
