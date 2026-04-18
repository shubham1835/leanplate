import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@core/mock/serviceFactory";
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_KEY } from "@shared/constants/storageKeys";

// ─── Async Thunks ────────────────────────────────────────────────

export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async (phone, { rejectWithValue }) => {
    try {
      return await authService.sendOtp(phone);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOtp(phone, otp);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const rt   = localStorage.getItem(REFRESH_TOKEN_KEY);
      const data = await authService.refresh(rt);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const userDetails = createAsyncThunk(
  "user/userDetails",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.userProfile();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load user details");
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────

const initialState = {
  user:            null,
  isAuthenticated: false,
  otpSent:         false,
  loading:         false,
  error:           null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user            = null;
      state.isAuthenticated = false;
      state.otpSent         = false;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    clearError(state) {
      state.error = null;
    },
    updateProfile(state, action) {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // sendOtp
    builder
      .addCase(sendOtp.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
      .addCase(sendOtp.rejected,  (state, a) => { state.loading = false; state.error = a.payload; });

    // verifyOtp
    builder
      .addCase(verifyOtp.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.user            = payload.user;
        state.otpSent         = false;
      })
      .addCase(verifyOtp.rejected, (state, a) => { state.loading = false; state.error = a.payload; });

    // refreshToken
    builder
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user            = null;
      });

    // userDetails
    builder
      .addCase(userDetails.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(userDetails.fulfilled, (s, { payload }) => { s.loading = false; s.user = payload; })
      .addCase(userDetails.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearAuth, clearError, updateProfile } = userSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────
export const selectUser            = (s) => s.user.user;
export const selectIsAuthenticated = (s) => s.user.isAuthenticated;
export const selectOtpSent         = (s) => s.user.otpSent;
export const selectUserLoading     = (s) => s.user.loading;
export const selectUserError       = (s) => s.user.error;
export const selectUserRole        = (s) => s.user.user?.role ?? null;
export const selectIsAdmin         = (s) => s.user.user?.role === "ADMIN";

export default userSlice.reducer;
