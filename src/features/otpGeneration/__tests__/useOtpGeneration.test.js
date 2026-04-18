import { renderHook, act } from "@testing-library/react";
import { Provider }        from "react-redux";
import { configureStore }  from "@reduxjs/toolkit";
import { MemoryRouter }    from "react-router-dom";
import React               from "react";
import userReducer         from "@core/store/reducers/userSlice";
import useOtpGeneration    from "../hooks/useOtpGeneration";

const makeStore = () => configureStore({ reducer: { user: userReducer } });

const wrapper = ({ children }) => (
  <Provider store={makeStore()}>
    <MemoryRouter>{children}</MemoryRouter>
  </Provider>
);

describe("useOtpGeneration", () => {
  it("initialises with empty phone and no error", () => {
    const { result } = renderHook(() => useOtpGeneration(), { wrapper });
    expect(result.current.formik.values.phone).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("shows validation error for invalid phone number", async () => {
    const { result } = renderHook(() => useOtpGeneration(), { wrapper });
    await act(async () => {
      result.current.formik.setFieldValue("phone", "12345");
      await result.current.formik.validateForm();
    });
    expect(result.current.formik.errors.phone).toBeDefined();
  });

  it("passes validation for a valid 10-digit number", async () => {
    const { result } = renderHook(() => useOtpGeneration(), { wrapper });
    await act(async () => {
      result.current.formik.setFieldValue("phone", "9876543210");
      await result.current.formik.validateForm();
    });
    expect(result.current.formik.errors.phone).toBeUndefined();
  });
});
