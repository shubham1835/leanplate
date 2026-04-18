import React from "react";
import useProgress    from "../hooks/useProgress";
import Ring           from "@shared/components/Ring";
import CommonButton   from "@shared/components/CommonButton";
import LoadingOverlay from "@shared/components/LoadingOverlay";
import styles         from "../styles/styles.module.css";

// ── Inline SVG line chart ────────────────────────────────────────
function WeightChart({ weights }) {
  if (!weights.length) return null;
  const W = 340, H = 130, PX = 28, PY = 10;
  const vals = weights.map((d) => parseFloat(d.weightKg));
  const minV = Math.min(...vals) - 0.5;
  const maxV = Math.max(...vals) + 0.5;
  const xStep = (W - PX * 2) / Math.max(weights.length - 1, 1);
  const toY   = (v) => PY + ((maxV - v) / (maxV - minV)) * (H - PY * 2);
  const pts   = weights.map((d, i) => `${PX + i * xStep},${toY(d.weightKg)}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0,1,2,3].map((i) => (
        <line key={i} x1={PX} x2={W-PX}
          y1={PY + i*(H-PY*2)/3} y2={PY + i*(H-PY*2)/3}
          stroke="#1e1e1e" strokeDasharray="3,3" />
      ))}
      <polygon
        points={`${PX},${H-PY} ${pts} ${PX+(weights.length-1)*xStep},${H-PY}`}
        fill="url(#wg)"
      />
      <polyline points={pts} fill="none" stroke="#4ade80" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {weights.map((d, i) => (
        <g key={i}>
          <circle cx={PX+i*xStep} cy={toY(d.weightKg)}
            r={i===weights.length-1?6:4}
            fill={i===weights.length-1?"#4ade80":"#080808"}
            stroke="#4ade80" strokeWidth="2" />
          {(i===0||i===weights.length-1) && (
            <text x={PX+i*xStep} y={toY(d.weightKg)-10}
              textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="700">
              {d.weightKg}
            </text>
          )}
          <text x={PX+i*xStep} y={H+2} textAnchor="middle" fill="#475569" fontSize="8">
            {d.loggedAt?.slice(5)}
          </text>
        </g>
      ))}
    </svg>
  );
}

const MACRO_BARS = [
  { label:"Protein", cur:98,  target:150, color:"#60a5fa", unit:"g" },
  { label:"Carbs",   cur:140, target:180, color:"#facc15", unit:"g" },
  { label:"Fat",     cur:38,  target:50,  color:"#f87171", unit:"g" },
  { label:"Calories",cur:1380,target:1800,color:"#4ade80", unit:"kcal" },
];

export default function ProgressScreen() {
  const {
    tab, setTab, weights, input, setInput, logged, loading,
    goalConfig, goal, startW, currentW, delta, handleLogWeight,
  } = useProgress();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress <span style={{color:"#4ade80"}}>Tracker</span></h1>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        {[
          { l:"Start",   v: startW   ? `${startW} kg`   : "—", c:"#94a3b8" },
          { l:"Current", v: currentW ? `${currentW} kg` : "—", c:"#4ade80" },
          { l:"Lost",    v: delta    ? `${Math.abs(delta)} kg` : "—", c:"#facc15" },
        ].map((s)=>(
          <div key={s.l} className={styles.statCard}>
            <div className={styles.statVal} style={{color:s.c}}>{s.v}</div>
            <div className={styles.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabRow}>
        {[["weight","⚖️ Weight"],["meals","🥗 Meals"],["macros","📊 Macros"]].map(([id,label])=>(
          <button key={id}
            className={`${styles.tabBtn} ${tab===id?styles.tabBtnActive:""}`}
            onClick={()=>setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {loading && <LoadingOverlay />}

        {/* Weight tab */}
        {tab==="weight" && (
          <>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Weight Trend</span>
                {delta && (
                  <span style={{fontSize:12,color:parseFloat(delta)<0?"#4ade80":"#f87171",fontWeight:700}}>
                    {parseFloat(delta)<0?"▼":"▲"} {Math.abs(delta)} kg
                  </span>
                )}
              </div>
              <WeightChart weights={weights} />
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle} style={{marginBottom:12}}>📊 Log Today's Weight</div>
              {logged ? (
                <div className={styles.loggedMsg}>✅ Logged! Keep it up!</div>
              ) : (
                <div className={styles.logRow}>
                  <div className={styles.logInput}>
                    <input
                      type="number" value={input}
                      onChange={(e)=>setInput(e.target.value)}
                      onKeyDown={(e)=>e.key==="Enter"&&handleLogWeight()}
                      placeholder="e.g. 78.2"
                      className={styles.logInputField}
                    />
                    <span className={styles.logUnit}>kg</span>
                  </div>
                  <CommonButton onClick={handleLogWeight} size="md" disabled={!input}>Log</CommonButton>
                </div>
              )}
            </div>
          </>
        )}

        {/* Meals tab */}
        {tab==="meals" && (
          <>
            <div className={styles.mealsGrid}>
              {[{l:"Total Meals",v:"47",i:"🥗"},{l:"This Week",v:"5",i:"📅"},
                {l:"Plan Meals Left",v:"28",i:"🎯"},{l:"Fav Item",v:"Egg Bhurji",i:"⭐"}
              ].map((s)=>(
                <div key={s.l} className={styles.mealCard}>
                  <div className={styles.mealIcon}>{s.i}</div>
                  <div className={styles.mealVal}>{s.v}</div>
                  <div className={styles.mealLabel}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle} style={{marginBottom:12}}>This Month's Meals</div>
              <div className={styles.barChart}>
                {[3,5,4,6,5,7,5,4,6,5,6,7].map((v,i)=>(
                  <div key={i} className={styles.barWrap}>
                    <div className={styles.bar} style={{height:v*8,background:i>=10?"rgba(74,222,128,0.35)":"rgba(74,222,128,0.7)"}}/>
                    <div className={styles.barLabel}>{i+1}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Macros tab */}
        {tab==="macros" && (
          <>
            <div className={styles.card}>
              <div className={styles.cardTitle} style={{marginBottom:14}}>Weekly Avg Macros</div>
              {MACRO_BARS.map((m)=>(
                <div key={m.label} className={styles.macroBar}>
                  <div className={styles.macroBarTop}>
                    <span className={styles.macroBarLabel}>{m.label}</span>
                    <span style={{fontSize:12,color:m.color,fontWeight:700}}>
                      {m.cur} / {m.target} {m.unit}
                    </span>
                  </div>
                  <div className={styles.macroBarTrack}>
                    <div className={styles.macroBarFill}
                      style={{width:`${Math.min(100,(m.cur/m.target)*100)}%`,background:m.color}}/>
                  </div>
                  <div className={styles.macroBarPct}>{Math.round((m.cur/m.target)*100)}% of daily target</div>
                </div>
              ))}
            </div>

            <div className={styles.insightCard}
              style={{background:goalConfig.bg, border:`1px solid ${goalConfig.color}22`}}>
              <div style={{fontSize:13,color:goalConfig.color,fontWeight:700,marginBottom:4}}>
                {goalConfig.icon} {goalConfig.label} Insight
              </div>
              <div style={{fontSize:12,color:"#475569",lineHeight:1.5}}>
                {goal==="FAT_LOSS" && "You're in a slight caloric deficit. Try to hit your protein target for better muscle preservation."}
                {goal==="MUSCLE_GAIN" && "You're close to your protein target. Increase carbs slightly for better training energy."}
                {goal==="MAINTENANCE" && "Good balance! You're close to your maintenance targets. Stay consistent."}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
