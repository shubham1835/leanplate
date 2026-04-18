import { renderHook, act } from "@testing-library/react";
import { Provider }        from "react-redux";
import { configureStore }  from "@reduxjs/toolkit";
import { MemoryRouter }    from "react-router-dom";
import React               from "react";
import menuReducer         from "@core/store/reducers/menuSlice";
import goalReducer         from "@core/store/reducers/goalSlice";
import cartReducer         from "@core/store/reducers/cartSlice";
import useMenu             from "../hooks/useMenu";

const makeStore = () =>
  configureStore({ reducer: { menu: menuReducer, goal: goalReducer, cart: cartReducer } });

const wrapper = ({ children }) => (
  <Provider store={makeStore()}>
    <MemoryRouter>{children}</MemoryRouter>
  </Provider>
);

describe("useMenu", () => {
  it("initialises with empty search and no goal filter", () => {
    const { result } = renderHook(() => useMenu(), { wrapper });
    expect(result.current.search).toBe("");
    expect(result.current.goalFilter).toBe(false);
  });

  it("toggles goal filter", () => {
    const { result } = renderHook(() => useMenu(), { wrapper });
    act(() => { result.current.toggleGoalFilter(); });
    expect(result.current.goalFilter).toBe(true);
    act(() => { result.current.toggleGoalFilter(); });
    expect(result.current.goalFilter).toBe(false);
  });

  it("clears search", () => {
    const { result } = renderHook(() => useMenu(), { wrapper });
    act(() => { result.current.setSearch("egg"); });
    expect(result.current.search).toBe("egg");
    act(() => { result.current.clearSearch(); });
    expect(result.current.search).toBe("");
  });
});
