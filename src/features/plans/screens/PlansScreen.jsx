import React from "react";
import usePlans         from "../hooks/usePlans";
import CommonButton     from "@shared/components/CommonButton";
import LoadingOverlay   from "@shared/components/LoadingOverlay";
import ErrorMessage     from "@shared/components/ErrorMessage";
import Ring             from "@shared/components/Ring";
import styles           from "../styles/styles.module.css";

const PLAN_COLORS = { lifestyle:"#60a5fa", starter:"#4ade80", transform:"#facc15" };

export default function PlansScreen() {
  const {
    plans, activeSub, loading, error,
    period, setPeriod, subProgress,
    handlePause, handleResume, handleSubscribe, handleBack,
  } = usePlans();

  const isPaused   = activeSub?.status === "PAUSED";
  const BLOCKED_STATUSES = ["ACTIVE", "PENDING", "PAUSED"];
  const isBlocked   = BLOCKED_STATUSES.includes(activeSub?.status);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>←</button>
        <div>
          <h1 className={styles.title}>Subscription <span style={{color:"#4ade80"}}>Plans</span></h1>
          <p className={styles.subtitle}>Save up to 30% vs individual orders</p>
        </div>
      </div>

      {loading && <LoadingOverlay />}
      {error   && <div className={styles.body}><ErrorMessage message={error}/></div>}

      <div className={styles.body}>
        {activeSub && (
          <div className={styles.activeCard}>
            <div className={styles.activeTop}>
              <div className={styles.activeBadge}>YOUR ACTIVE PLAN</div>
              <div className={`${styles.statusPill} ${isPaused?styles.statusPaused:styles.statusActive}`}>
                {isPaused?"PAUSED":"ACTIVE"}
              </div>
            </div>
            <div className={styles.activeMain}>
              <div>
                <div className={styles.activeName}>{activeSub.planName}</div>
                <div className={styles.activePeriod}>
                  {activeSub.period} · ₹{activeSub.amountPaid?.toLocaleString("en-IN")}
                </div>
              </div>
              <Ring pct={subProgress} size={60} stroke={5} color="#facc15">
                <span style={{fontSize:10,fontWeight:900,color:"#facc15"}}>{subProgress}%</span>
              </Ring>
            </div>
            <div className={styles.activeMeta}>
              {[
                {v:activeSub.mealsRemaining, l:"meals left",   c:"#facc15"},
                {v:activeSub.endDate,        l:"expires",      c:"#f1f5f9"},
                {v:activeSub.mealsTotal,     l:"total meals",  c:"#4ade80"},
              ].map((m)=>(
                <div key={m.l} className={styles.activeMetaItem}>
                  <span className={styles.activeMetaVal} style={{color:m.c}}>{m.v}</span>
                  <span className={styles.activeMetaLabel}>{m.l}</span>
                </div>
              ))}
            </div>
            <div className={styles.planBar}>
              <div className={styles.planBarFill} style={{width:`${subProgress}%`}}/>
            </div>
            <CommonButton
              onClick={isPaused?handleResume:handlePause} full
              color={isPaused?"#4ade80":"#f87171"}
              variant={isPaused?"primary":"outline"}>
              {isPaused?"▶ Resume Plan":"⏸ Pause Plan"}
            </CommonButton>
          </div>
        )}

        {isBlocked && (
          <div className={styles.blockedBanner}>
            <span className={styles.blockedBannerIcon}>⚠️</span>
            <span className={styles.blockedBannerText}>
              You already have a plan that is <strong>{activeSub.status}</strong>. You cannot subscribe to a new plan while a plan is active, pending, or paused.
            </span>
          </div>
        )}

        <div className={styles.periodToggle}>
          {["MONTHLY"].map((p)=>(
            <button key={p}
              className={`${styles.periodBtn} ${period===p?styles.periodBtnActive:""}`}
              onClick={()=>setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>

        <div className={styles.planList}>
          {plans.map((plan)=>{
            const price    = plan.monthlyPrice;
            const meals    = plan.monthlyMeals;
            const perMeal  = price&&meals?Math.round(price/meals):0;
            const isCurrent= activeSub?.planId===plan.id&&activeSub?.status!=="EXPIRED";
            const color    = PLAN_COLORS[plan.id]||"#4ade80";
            return (
              <div key={plan.id}
                className={`${styles.planCard} ${plan.popular?styles.planCardPopular:""} ${isBlocked&&!isCurrent?styles.planCardDisabled:""}`}
                style={plan.popular?{border:`2px solid ${color}`}:{}}>
                {plan.popular&&(
                  <div className={styles.popularBadge} style={{background:color,color:"#000"}}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className={styles.planCardTop}>
                  <div>
                    <div className={styles.planCardName}>{plan.name}</div>
                    <div className={styles.planCardTagline}>{plan.tagline}</div>
                  </div>
                  <div className={styles.planCardPriceCol}>
                    <div className={styles.planCardPrice} style={{color}}>₹{price?.toLocaleString("en-IN")}</div>
                    <div className={styles.planCardPerMeal}>₹{perMeal}/meal · {meals} meals</div>
                  </div>
                </div>
                <div className={styles.planFeatures}>
                  {plan.features?.map((f,i)=>(
                    <div key={i} className={styles.planFeature}>
                      <span style={{color}}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <CommonButton onClick={()=>!isCurrent&&!isBlocked&&handleSubscribe(plan.id)}
                  full color={color} variant={isCurrent?"outline":"primary"} disabled={isCurrent||isBlocked}>
                  {isCurrent?`Current Plan ✓`:isBlocked?`Plan ${activeSub.status}`:`Subscribe · ₹${price?.toLocaleString("en-IN")}`}
                </CommonButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
