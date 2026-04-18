import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  addItem, removeItem, deleteItem, clearCart,
  selectCartCount, selectCartTotal, selectCartMacros,
} from "../reducers/cartSlice";

const ITEM = { id:"1", name:"Egg Bhurji", price:100, proteinG:17, carbsG:3, fatG:1, calories:89 };
const ITEM2= { id:"2", name:"Detox Flush",price:80,  proteinG:2,  carbsG:12,fatG:0, calories:56 };

const store = () => configureStore({ reducer: { cart: cartReducer } });

describe("cartSlice", () => {
  it("adds a new item with qty 1", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    expect(selectCartCount(s.getState())).toBe(1);
  });

  it("increments qty for existing item", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(addItem(ITEM));
    expect(selectCartCount(s.getState())).toBe(2);
    expect(s.getState().cart.items.length).toBe(1);
  });

  it("removes one qty", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(addItem(ITEM));
    s.dispatch(removeItem("1"));
    expect(selectCartCount(s.getState())).toBe(1);
  });

  it("removes item entirely when qty reaches 0", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(removeItem("1"));
    expect(selectCartCount(s.getState())).toBe(0);
    expect(s.getState().cart.items.length).toBe(0);
  });

  it("calculates total correctly", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(addItem(ITEM));
    s.dispatch(addItem(ITEM2));
    expect(selectCartTotal(s.getState())).toBe(100*2 + 80*1);
  });

  it("clears cart", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(clearCart());
    expect(selectCartCount(s.getState())).toBe(0);
  });

  it("computes macro totals", () => {
    const s = store();
    s.dispatch(addItem(ITEM));
    s.dispatch(addItem(ITEM));
    const macros = selectCartMacros(s.getState());
    expect(macros.protein).toBe(34);
    expect(macros.cal).toBe(178);
  });
});
