import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionService } from "@core/mock/serviceFactory";

export const fetchPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue }) => {
    try { return await subscriptionService.getPlans(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to load plans"); }
  }
);

export const fetchActiveSub = createAsyncThunk(
  "subscription/fetchActive",
  async (_, { rejectWithValue }) => {
    try { return await subscriptionService.getActiveSub(); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to load subscription"); }
  }
);

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async (payload, { rejectWithValue }) => {
    try { return await subscriptionService.create(payload); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to create subscription"); }
  }
);

export const pauseSubscription = createAsyncThunk(
  "subscription/pause",
  async (subId, { rejectWithValue }) => {
    try { return await subscriptionService.pause(subId); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to pause"); }
  }
);

export const resumeSubscription = createAsyncThunk(
  "subscription/resume",
  async (subId, { rejectWithValue }) => {
    try { return await subscriptionService.resume(subId); }
    catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to resume"); }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: { activeSub: null, plans: [], loading: false, error: null },
  reducers: { clearSubError(state) { state.error = null; } },
  extraReducers: (builder) => {
    const pending  = (s) => { s.loading = true;  s.error = null; };
    const rejected = (s, a) => { s.loading = false; s.error = a.payload; };

    builder
      .addCase(fetchPlans.fulfilled, (s, { payload }) => { s.plans = payload; });

    builder
      .addCase(fetchActiveSub.pending,   pending)
      .addCase(fetchActiveSub.fulfilled, (s, { payload }) => { s.loading = false; s.activeSub = payload; })
      .addCase(fetchActiveSub.rejected,  rejected);

    builder
      .addCase(createSubscription.pending,   pending)
      .addCase(createSubscription.fulfilled, (s, { payload }) => { s.loading = false; s.activeSub = payload; })
      .addCase(createSubscription.rejected,  rejected);

    builder
      .addCase(pauseSubscription.fulfilled,  (s, { payload }) => { s.activeSub = payload; })
      .addCase(resumeSubscription.fulfilled, (s, { payload }) => { s.activeSub = payload; });
  },
});

export const { clearSubError } = subscriptionSlice.actions;

export const selectActiveSub    = (s) => s.subscription.activeSub;
export const selectPlans        = (s) => s.subscription.plans;
export const selectSubLoading   = (s) => s.subscription.loading;
export const selectSubError     = (s) => s.subscription.error;

export default subscriptionSlice.reducer;
