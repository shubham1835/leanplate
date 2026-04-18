import { combineReducers } from "@reduxjs/toolkit";
import userReducer         from "./reducers/userSlice";
import goalReducer         from "./reducers/goalSlice";
import cartReducer         from "./reducers/cartSlice";
import menuReducer         from "./reducers/menuSlice";
import orderReducer        from "./reducers/orderSlice";
import subscriptionReducer from "./reducers/subscriptionSlice";

const rootReducer = combineReducers({
  user:         userReducer,
  goal:         goalReducer,
  cart:         cartReducer,
  menu:         menuReducer,
  orders:       orderReducer,
  subscription: subscriptionReducer,
});

export default rootReducer;
