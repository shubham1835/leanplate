import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  placeOrderWithPlan, initiateOrder,
  selectOrderLoading, selectOrderError, selectPlacedOrder, clearPlacedOrder,
} from "@core/store/reducers/orderSlice";
import {
  selectCartItems, selectCartTotal, selectCartMacros, addItem, removeItem, clearCart,
} from "@core/store/reducers/cartSlice";
import { selectActiveSub } from "@core/store/reducers/subscriptionSlice";
import { selectAllItems } from "@core/store/reducers/menuSlice";
import { PICKUP_SLOTS } from "@shared/constants/menuConstants";
import { SCREEN_NAMES } from "@core/navigation/routes";

export default function useCheckout() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const cartItems   = useSelector(selectCartItems);
  const cartTotal   = useSelector(selectCartTotal);
  const macros      = useSelector(selectCartMacros);
  const activeSub   = useSelector(selectActiveSub);
  const allItems    = useSelector(selectAllItems);
  const loading     = useSelector(selectOrderLoading);
  const error       = useSelector(selectOrderError);
  const placedOrder = useSelector(selectPlacedOrder);
  const inFlight    = useRef(false);

  const [step,    setStep]    = useState(1); // 1=review, 2=slot
  const [slot,    setSlot]    = useState(null);
  const [note,    setNote]    = useState("");

  // Upsell: first item not in cart
  const upsell = allItems.find((i) =>
    !cartItems.find((c) => c.id === i.id) && i.proteinG >= 15
  ) || null;

  const hasPlan = activeSub?.status === "ACTIVE" && activeSub.mealsRemaining > 0;

  // Split cart items by type
  const mealItems    = cartItems.filter((i) => i.meal === true);
  const nonMealItems = cartItems.filter((i) => i.meal !== true);

  // Derived flags for UI badges
  const hasMealItems    = hasPlan && mealItems.length > 0;
  const hasNonMealItems = nonMealItems.length > 0;
  // true when ALL items are meals and plan is active (pure plan order)
  const usePlanForOrder = hasPlan && mealItems.length === cartItems.length && cartItems.length > 0;
  // true when cart is mixed (some meal, some not) and plan is active
  const isMixedCart = hasPlan && mealItems.length > 0 && nonMealItems.length > 0;

  const handleAdd       = (item) => dispatch(addItem(item));
  const handleRemove    = (id)   => dispatch(removeItem(id));
  const handleAddUpsell = ()     => upsell && dispatch(addItem(upsell));

  // Shared dispatch logic — accepts an explicit slot or falls back to state
  const dispatchOrder = async (pickupSlot) => {
    if (!pickupSlot || inFlight.current) return;
    inFlight.current = true;

    const basePayload = {
      pickupSlot,
      pickupDate:  new Date().toISOString().split("T")[0],
      specialNote: note,
    };

    try {
      if (isMixedCart) {
        // ── Mixed cart: fire both orders in parallel ──────────────────
        const planPayload = {
          ...basePayload,
          items:          mealItems.map((i) => ({ itemId: i.id, quantity: i.qty })),
          subscriptionId: activeSub.id,
        };
        const normalPayload = {
          ...basePayload,
          items: nonMealItems.map((i) => ({ itemId: i.id, quantity: i.qty })),
        };

        const [planResult, normalResult] = await Promise.all([
          dispatch(placeOrderWithPlan(planPayload)),
          dispatch(initiateOrder(normalPayload)),
        ]);

        // Clear cart only when both succeed
        if (
          placeOrderWithPlan.fulfilled.match(planResult) &&
          initiateOrder.fulfilled.match(normalResult)
        ) {
          dispatch(clearCart());
        }
      } else if (usePlanForOrder) {
        // ── All meal items → plan order ───────────────────────────────
        const result = await dispatch(
          placeOrderWithPlan({
            ...basePayload,
            items:          mealItems.map((i) => ({ itemId: i.id, quantity: i.qty })),
            subscriptionId: activeSub.id,
          })
        );
        if (placeOrderWithPlan.fulfilled.match(result)) dispatch(clearCart());
      } else {
        // ── All non-meal items (or no active plan) → normal order ─────
        const result = await dispatch(
          initiateOrder({
            ...basePayload,
            items: cartItems.map((i) => ({ itemId: i.id, quantity: i.qty })),
          })
        );
        if (initiateOrder.fulfilled.match(result)) dispatch(clearCart());
      }
    } finally {
      inFlight.current = false;
    }
  };

  // Place order with selected slot
  const handlePlaceOrder = () => dispatchOrder(slot);

  // Place order right now — uses the actual current time as the slot label
  const handleOrderNow = () => {
    const now = new Date();
    const label = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    setSlot(label);
    dispatchOrder(label);
  };

  const handleBackHome = () => {
    dispatch(clearPlacedOrder());
    navigate(SCREEN_NAMES.HOME, { replace: true });
  };

  return {
    cartItems, cartTotal, macros, activeSub,
    hasPlan, usePlanForOrder, isMixedCart, hasMealItems, hasNonMealItems,
    upsell, step, slot, note, loading, error, placedOrder,
    setStep, setSlot, setNote,
    handleAdd, handleRemove, handleAddUpsell,
    handlePlaceOrder, handleOrderNow, handleBackHome,
    slots: PICKUP_SLOTS,
  };
}
