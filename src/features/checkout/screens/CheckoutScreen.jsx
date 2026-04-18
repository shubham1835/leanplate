import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearPlacedOrder } from "@core/store/reducers/orderSlice";
import useCheckout  from "../hooks/useCheckout";
import MacroPill    from "@shared/components/MacroPill";
import CommonButton from "@shared/components/CommonButton";
import ErrorMessage from "@shared/components/ErrorMessage";
import styles       from "../styles/styles.module.css";
import { computePoints, waLink } from "@shared/utils/formatters";
import { WHATSAPP_NUMBER } from "@shared/constants/menuConstants";
import { SCREEN_NAMES } from "@core/navigation/routes";

export default function CheckoutScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Clear any leftover placed order when entering the screen
  useEffect(() => {
    dispatch(clearPlacedOrder());
  }, [dispatch]);

  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const {
    cartItems, cartTotal, macros,
    hasPlan, usePlanForOrder, isMixedCart, hasMealItems, hasNonMealItems,
    upsell, step, slot, note, loading, error, placedOrder,
    setStep, setSlot, setNote,
    handleAdd, handleRemove, handleAddUpsell,
    handlePlaceOrder, handleOrderNow, handleBackHome, slots,
  } = useCheckout();

  // Note: Auto-redirect to menu on empty cart has been removed 
  // so you can actually navigate to http://localhost:3000/checkout
  // even if your cart is completely empty!

  // Auto redirect to WhatsApp after 5 seconds
  useEffect(() => {
    if (placedOrder) {
      setRedirectCountdown(5);
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            const itemsStr = placedOrder.items?.map(i => `${i.quantity}x ${i.itemName}`).join(", ") || "";
            const text = `Hi! My order details are as below:\nOrder ID: ${placedOrder.orderNumber}\nItems: ${itemsStr}\nTotal: ₹${placedOrder.totalAmount}`;
            const waUrl = waLink(WHATSAPP_NUMBER, text);
            window.location.href = waUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [placedOrder]);

  /* ── Order success screen ─────────────────────────────────── */
  if (placedOrder) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>ORDER PLACED!</h2>
        <p className={styles.successSub}>Estimated pickup in ~15 mins</p>
        <div className={styles.successSlot}>{slot}</div>
        <div className={styles.successCard}>
          <div className={styles.successLabel}>Order ID</div>
          <div className={styles.successId}>{placedOrder.orderNumber}</div>
          <div className={styles.divider} />
          <div className={styles.successLabel}>You earned</div>
          <div className={styles.successPts}>+{placedOrder.pointsEarned || 0} pts 🏆</div>
        </div>

        <div style={{ marginTop: 24, marginBottom: 16, padding: 16, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", width: "100%" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 8, textAlign: "center" }}>
            Sending order details on WhatsApp in {redirectCountdown}s...
          </div>
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", width: "100%" }}>
             <div style={{ 
               height: "100%", 
               background: "#25D366", 
               width: `${Math.min(100, Math.max(0, (5 - redirectCountdown) * 20))}%`, 
               transition: "width 1s linear" 
             }} />
          </div>
        </div>

        <CommonButton onClick={handleBackHome} full size="lg">Back to Home</CommonButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Step indicator */}
      <div className={styles.steps}>
        {[{ n:1, label:"Cart" }, { n:2, label:"Pick Slot" }].map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={styles.stepItem}>
              <div className={`${styles.stepDot} ${step >= s.n ? styles.stepDotActive : ""}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`${styles.stepLabel} ${step === s.n ? styles.stepLabelActive : ""}`}>
                {s.label}
              </span>
            </div>
            {i === 0 && (
              <div className={`${styles.stepLine} ${step > 1 ? styles.stepLineActive : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <ErrorMessage message={error} />

      {/* ── STEP 1: Review ──────────────────────────────────── */}
      {step === 1 && (
        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyText}>Your cart is empty</p>
              <CommonButton onClick={() => window.history.back()} variant="outline" style={{ marginTop:16 }}>
                Browse Menu
              </CommonButton>
            </div>
          ) : (
            <>
              {/* Cart items */}
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <span className={styles.cartEmoji}>{item.emoji || "🍽"}</span>
                  <div className={styles.cartInfo}>
                    <div className={styles.cartName}>{item.name}</div>
                    <div className={styles.cartMeta}>
                      {item.proteinG}g protein · {item.calories} kcal
                    </div>
                  </div>
                  <div className={styles.cartRight}>
                    <div className={styles.cartPrice}>₹{item.price * item.qty}</div>
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove one ${item.name}`}
                      >−</button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleAdd(item)}
                        aria-label={`Add one ${item.name}`}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Macro summary */}
              <div className={styles.macroBar}>
                <MacroPill label="PROTEIN" value={Math.round(macros.protein)} type="protein" size="lg" />
                <div className={styles.macroDivider} />
                <MacroPill label="CARBS"   value={Math.round(macros.carbs)}   type="carbs"   size="lg" />
                <div className={styles.macroDivider} />
                <MacroPill label="FAT"     value={Math.round(macros.fat)}     type="fat"     size="lg" />
                <div className={styles.macroDivider} />
                <MacroPill label="KCAL"    value={Math.round(macros.cal)}     type="cal"     size="lg" />
              </div>

              {/* Note */}
              <input
                className={styles.noteInput}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Special instructions (e.g. extra spicy, no onion)"
              />

              {/* Upsell */}
              {upsell && (
                <div className={styles.upsell}>
                  <span className={styles.upsellEmoji}>{upsell.emoji}</span>
                  <div className={styles.upsellInfo}>
                    <div className={styles.upsellTag}>⚡ ADD TO BOOST GAINS</div>
                    <div className={styles.upsellName}>{upsell.name}</div>
                    <div className={styles.upsellMeta}>+{upsell.proteinG}g protein · ₹{upsell.price}</div>
                  </div>
                  <button className={styles.upsellBtn} onClick={handleAddUpsell}>+ Add</button>
                </div>
              )}

              {/* Total */}
              <div className={styles.totalRow}>
                <div>
                  <div className={styles.totalLabel}>Order Total</div>
                  <div className={styles.totalVal}>₹{cartTotal.toLocaleString("en-IN")}</div>
                </div>
                <div className={styles.totalRight}>
                  <div className={styles.totalLabel}>Points earned</div>
                  <div className={styles.totalPts}>+{computePoints(cartTotal)} pts</div>
                </div>
              </div>

              {isMixedCart && (
                <div className={styles.planBadge} style={{ background: "#e8f4fd", color: "#0c63a0" }}>
                  🔀 Meal items → deducted from plan &nbsp;·&nbsp; Other items → charged normally
                </div>
              )}
              {usePlanForOrder && (
                <div className={styles.planBadge}>✅ This order will be deducted from your plan</div>
              )}
              {hasPlan && !usePlanForOrder && !isMixedCart && (
                <div className={styles.planBadge} style={{ background: "#fff3cd", color: "#856404" }}>⚠️ No meal items — order will be charged normally</div>
              )}

              <CommonButton onClick={() => setStep(2)} full size="lg" style={{ marginTop:8 }}>
                Choose Pickup Time →
              </CommonButton>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: Slot ────────────────────────────────────── */}
      {step === 2 && (
        <div className={styles.body}>
          <h2 className={styles.slotTitle}>Pick a Slot</h2>
          <p className={styles.slotSub}>Select when you'll come to pick up your order</p>

          {/* ── Quick: Order Now ─────────────────────────── */}
          <button
            className={styles.orderNowBtn}
            onClick={handleOrderNow}
            disabled={loading}
          >
            <span className={styles.orderNowIcon}>⚡</span>
            <div className={styles.orderNowText}>
              <span className={styles.orderNowLabel}>Order Now</span>
              <span className={styles.orderNowSub}>Place order at current time</span>
            </div>
            {loading && slot === null ? (
              <span className={styles.orderNowSpinner}>…</span>
            ) : (
              <span className={styles.orderNowArrow}>→</span>
            )}
          </button>

          {/* ── Divider ──────────────────────────────────── */}
          <div className={styles.orDivider}>
            <span className={styles.orLine} />
            <span className={styles.orText}>or pick a time</span>
            <span className={styles.orLine} />
          </div>

          <div className={styles.slotGrid}>
            {slots.map((s) => (
              <button
                key={s}
                className={`${styles.slotBtn} ${slot === s ? styles.slotBtnActive : ""}`}
                onClick={() => setSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {slot && (
            <div className={styles.slotConfirm}>
              ✅ Pickup at {slot} — ready ~15 mins before
            </div>
          )}

          <div className={styles.slotActions}>
            <CommonButton onClick={() => setStep(1)} variant="flat" size="lg">← Back</CommonButton>
            <CommonButton
              onClick={handlePlaceOrder}
              size="lg" disabled={!slot} loading={loading}
              style={{ flex:1 }}
            >
              Place Order · ₹{cartTotal.toLocaleString("en-IN")}
            </CommonButton>
          </div>
        </div>
      )}
    </div>
  );
}
