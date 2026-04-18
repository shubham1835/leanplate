import React from "react";
import useHome        from "../hooks/useHome";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import { useNavigate } from "react-router-dom";
import CartFAB        from "@shared/components/CartFAB";
import Ring           from "@shared/components/Ring";
import Tag            from "@shared/components/Tag";
import MacroPill      from "@shared/components/MacroPill";
import CommonButton   from "@shared/components/CommonButton";
import styles         from "../styles/styles.module.css";

const MACRO_TARGETS = [
  { label: "Protein", cur: 35,  target: 150, type: "protein", color: "#60a5fa" },
  { label: "Carbs",   cur: 60,  target: 180, type: "carbs",   color: "#facc15" },
  { label: "Fat",     cur: 12,  target: 50,  type: "fat",     color: "#f87171" },
  { label: "Kcal",   cur: 480, target: 1800, type: "cal",     color: "#4ade80" },
];

export default function HomeScreen() {
  const {
    user, goal, goalConfig, recommended, activeSub,
    streak, points, subProgress,
    getItemQty, handleAddItem, handleRemoveItem,
    handleChangeGoal, handleRepeatOrder, handleViewPlan, handleSeeAllMenu,
    waDietPlan, waNutri,
  } = useHome();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className={styles.page}>

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <div>
            <div className={styles.brand}>⚡ LEAN PLATE</div>
            <h1 className={styles.greeting}>
              Hey, <span style={{ color: "#4ade80" }}>{firstName}! 👋</span>
            </h1>
            <div className={styles.date}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </div>
          </div>
          <div className={styles.pointsCard}>
            <div className={styles.pointsVal}>{points}</div>
            <div className={styles.pointsLabel}>PTS</div>
          </div>
        </div>

        {/* Streak + goal chip */}
        <div className={styles.chipRow}>
          <div className={styles.streakChip}>
            <span className={styles.streakIcon}>🔥</span>
            <div>
              <div className={styles.streakTitle}>{streak}-Day Streak!</div>
              <div className={styles.streakSub}>5 more = free meal 🎁</div>
            </div>
          </div>
          <button className={styles.goalChip}
            style={{ background: goalConfig.bg, border: `1.5px solid ${goalConfig.color}44` }}
            onClick={handleChangeGoal}>
            <span className={styles.goalChipIcon}>{goalConfig.icon}</span>
            <span className={styles.goalChipLabel} style={{ color: goalConfig.color }}>
              {goal?.replace("_", " ")}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Order Confirmation Banner ──────────────────────── */}
        <section style={{
          background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05))",
          border: "1px solid rgba(74,222,128,0.3)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: 28, filter: "drop-shadow(0 2px 4px rgba(74,222,128,0.3))" }}>📞</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#026023ff", marginBottom: 4 }}>
              Order Confirmation
            </div>
            <div style={{ fontSize: 13, color: "#026023ff", lineHeight: 1.5 }}>
              After placing an order, please call us at <span style={{ color: "#4ade80", fontWeight: 700 }}>+91-7841065516</span> or <span style={{ color: "#4ade80", fontWeight: 700 }}>+91-7773926651</span> to confirm.
            </div>
          </div>
        </section>

        {/* ── Quick Actions ───────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Quick Actions</div>
          <div className={styles.actionRow}>
            <button className={styles.actionPrimary} onClick={handleRepeatOrder}>
              🔄 Repeat Last Order
            </button>
            <button className={styles.actionSecondary} onClick={handleViewPlan}>
              📋 Order My Plan
            </button>
          </div>
        </section>

        {/* ── Guest CTA ─────────────────────────────────────────── */}
        {!isAuthenticated && (
          <div style={{
            background:"linear-gradient(135deg,#0a1f0a,#111)",
            border:"1.5px solid rgba(74,222,128,0.3)",
            borderRadius:16, padding:16, marginTop:0, marginBottom:4,
          }}>
            <div style={{fontSize:15,fontWeight:900,marginBottom:6}}>
              🔐 Login to Order & Track
            </div>
            <div style={{fontSize:13,color:"#475569",marginBottom:12,lineHeight:1.5}}>
              Browse the menu freely. Login when you're ready to order or subscribe to a plan.
            </div>
            <button onClick={() => navigate(SCREEN_NAMES.LOGIN)} style={{
              background:"#4ade80", color:"#000", border:"none",
              borderRadius:11, padding:"12px 0", width:"100%",
              fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 4px 16px rgba(74,222,128,0.3)",
            }}>
              Login / Sign Up →
            </button>
          </div>
        )}

        {/* ── Active Plan ─────────────────────────────────────── */}
        {isAuthenticated && activeSub && (
          <section className={styles.planCard}>
            <div className={styles.planTop}>
              <div>
                <div className={styles.planName}>{activeSub.planName?.toUpperCase()} PLAN</div>
                <div className={styles.planMeals}>{activeSub.mealsRemaining} meals left</div>
              </div>
              <Ring pct={subProgress} size={58} stroke={5} color="#4ade80">
                <span style={{ fontSize: 10, fontWeight: 900, color: "#4ade80" }}>{subProgress}%</span>
              </Ring>
            </div>
            <div className={styles.planBar}>
              <div className={styles.planBarFill} style={{ width: `${subProgress}%` }} />
            </div>
            <div className={styles.planMeta}>
              <span>{activeSub.mealsUsed} used of {activeSub.mealsTotal}</span>
              <button className={styles.planManage} onClick={handleViewPlan}>
                Expires {activeSub.endDate} · Manage →
              </button>
            </div>
          </section>
        )}

        {/* ── Macro Rings ─────────────────────────────────────── */}
        <section className={styles.macroCard}>
          <div className={styles.sectionLabel} style={{ marginBottom: 12 }}>🎯 Today's Macro Target</div>
          <div className={styles.macroGrid}>
            {MACRO_TARGETS.map((m) => (
              <div key={m.type} className={styles.macroItem}>
                <Ring pct={Math.round((m.cur / m.target) * 100)} size={52} stroke={4} color={m.color}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: m.color }}>
                    {Math.round((m.cur / m.target) * 100)}%
                  </span>
                </Ring>
                <div className={styles.macroLabel}>{m.label}</div>
                <div className={styles.macroVal} style={{ color: m.color }}>{m.cur}g</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recommended ─────────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>
              {goalConfig.icon} For <span style={{ color: goalConfig.color }}>{goalConfig.label}</span>
            </span>
            <button className={styles.seeAll} onClick={handleSeeAllMenu}>See all →</button>
          </div>
          <div className={styles.itemList}>
            {(recommended.length ? recommended : []).slice(0, 4).map((item) => {
              const qty = getItemQty(item.id);
              return (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.itemEmoji}
                    style={{ background: `${goalConfig.color}12` }}>
                    {item.emoji || "🍽"}
                  </div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemTags}>
                      {item.tags?.slice(0, 2).map((t) => <Tag key={t} label={t} />)}
                    </div>
                    <div className={styles.itemMacros}>
                      <MacroPill label="P" value={item.proteinG || 0} type="protein" />
                      <MacroPill label="C" value={item.carbsG   || 0} type="carbs"   />
                      <MacroPill label="KCAL" value={item.calories || 0} type="cal"  />
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.itemPrice}>₹{item.price}</div>
                    {qty === 0 ? (
                      <button className={styles.addBtn} onClick={() => handleAddItem(item)}>+</button>
                    ) : (
                      <div className={styles.qtyRow}>
                        <button className={styles.qtyBtn} onClick={() => handleRemoveItem(item.id)}>−</button>
                        <span className={styles.qtyNum}>{qty}</span>
                        <button className={styles.qtyBtn} style={{ background: "#4ade80", color: "#000" }}
                          onClick={() => handleAddItem(item)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── WhatsApp CTA ─────────────────────────────────────── */}
        <section className={styles.waCard}>
          <div className={styles.waHeader}>
            <span style={{ fontSize: 22 }}>🥗</span>
            <div>
              <div className={styles.waTitle}>Talk to Our Nutritionist</div>
              <div className={styles.waSub}>Get a custom diet plan in minutes</div>
            </div>
          </div>
          <div className={styles.waRow}>
            <a href={waDietPlan} target="_blank" rel="noreferrer" className={styles.waBtnPrimary}>
              💬 Get Diet Plan
            </a>
            <a href={waNutri} target="_blank" rel="noreferrer" className={styles.waBtnOutline}>
              👩‍⚕️ Chat Now
            </a>
          </div>
        </section>
      </div>

      <CartFAB />
    </div>
  );
}
