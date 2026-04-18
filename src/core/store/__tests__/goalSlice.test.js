import { configureStore } from "@reduxjs/toolkit";
import goalReducer, { setGoal, clearGoal, selectGoal } from "../reducers/goalSlice";

const store = () => configureStore({ reducer: { goal: goalReducer } });

describe("goalSlice", () => {
  it("starts with null goal", () => {
    const s = store();
    expect(selectGoal(s.getState())).toBeNull();
  });

  it("sets a goal", () => {
    const s = store();
    s.dispatch(setGoal("FAT_LOSS"));
    expect(selectGoal(s.getState())).toBe("FAT_LOSS");
  });

  it("clears the goal", () => {
    const s = store();
    s.dispatch(setGoal("MUSCLE_GAIN"));
    s.dispatch(clearGoal());
    expect(selectGoal(s.getState())).toBeNull();
  });
});
