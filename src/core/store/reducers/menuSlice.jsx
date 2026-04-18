import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { menuService } from "@core/mock/serviceFactory";

// ─── Async Thunks ────────────────────────────────────────────────

export const fetchFullMenu = createAsyncThunk(
  "menu/fetchFull",
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.getFullMenu();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load menu");
    }
  }
);

export const fetchMenuByGoal = createAsyncThunk(
  "menu/fetchByGoal",
  async (goal, { rejectWithValue }) => {
    try {
      return await menuService.getByGoal(goal);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load recommendations");
    }
  }
);

export const fetchPopular = createAsyncThunk(
  "menu/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      return await menuService.getPopular(10);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load popular items");
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    categories:    [],   // [{ category, displayName, icon, items[] }]
    recommended:   [],   // goal-filtered flat list
    popular:       [],
    activeCategory: null,
    loading:       false,
    error:         null,
  },
  reducers: {
    setActiveCategory(state, { payload }) {
      state.activeCategory = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullMenu.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(fetchFullMenu.fulfilled, (s, { payload }) => {
        s.loading    = false;
        s.categories = payload;
        if (!s.activeCategory && payload.length > 0) {
          s.activeCategory = payload[0].category;
        }
      })
      .addCase(fetchFullMenu.rejected, (s, a) => { s.loading = false; s.error = a.payload; });

    builder
      .addCase(fetchMenuByGoal.fulfilled, (s, { payload }) => { s.recommended = payload; });

    builder
      .addCase(fetchPopular.fulfilled, (s, { payload }) => { s.popular = payload; });
  },
});

export const { setActiveCategory } = menuSlice.actions;

export const selectCategories    = (s) => s.menu.categories;
export const selectRecommended   = (s) => s.menu.recommended;
export const selectPopular       = (s) => s.menu.popular;
export const selectActiveCategory = (s) => s.menu.activeCategory;
export const selectMenuLoading   = (s) => s.menu.loading;
export const selectMenuError     = (s) => s.menu.error;
export const selectAllItems      = (s) =>
  s.menu.categories.flatMap((c) => c.items);

export default menuSlice.reducer;
