import { createSlice } from "@reduxjs/toolkit";

const goalSlice = createSlice({
  name: "goal",
  initialState: { selected: null },
  reducers: {
    setGoal(state, action) { state.selected = action.payload; },
    clearGoal(state)       { state.selected = null; },
  },
});

export const { setGoal, clearGoal } = goalSlice.actions;
export const selectGoal = (s) => s.goal.selected;
export default goalSlice.reducer;
