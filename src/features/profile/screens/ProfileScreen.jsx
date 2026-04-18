import React from "react";
import useProfile     from "../hooks/useProfile";
import Ring           from "@shared/components/Ring";
import CommonButton   from "@shared/components/CommonButton";
import { SCREEN_NAMES } from "@core/navigation/routes";
import styles         from "../styles/styles.module.css";

const MENU_ITEMS = [
  { icon:"📋", label:"My Plans",          to: SCREEN_NAMES.PLANS   },
  { icon:"📈", label:"Progress Tracker",  to: SCREEN_NAMES.PROGRESS},
  { icon:"🔔", label:"Notifications",     to: null },
  { icon:"👩‍⚕️",label:"My Nutritionist",   to: null },
  { icon:"📞", label:"Contact Us",        to: null },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function ProfileScreen() {
  const {
    user, tab, setTab,
    totalPoints, streak, milestones,
    trainerData, trainerClients,
    handleTrainerTab, handleSignOut, handleNavigate,
  } = useProfile();

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My <span style={{color:"#4ade80"}}>Profile</span></h1>
        <div className={styles.tabs}>
          {[["me","👤 Me"],["trainer","🏋️ Trainer"],["rewards","🏆 Rewards"]].map(([id,label])=>(
            <button key={id}
              className={`${styles.tab} ${tab===id?styles.tabActive:""}`}
              onClick={()=>{ setTab(id); if(id==="trainer") handleTrainerTab(); }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>

        {/* ── ME TAB ─────────────────────────────────────── */}
        {tab==="me" && (
          <>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>💪</div>
              <div className={styles.profileName}>{user?.name || "—"}</div>
              <div className={styles.profilePhone}>{user?.phone ? `+91 ${user.phone}` : ""}</div>
            </div>

            <div className={styles.statsGrid}>
              {[
                {l:"Total Orders",  v:"47",           icon:"📋"},
                {l:"Reward Points", v:totalPoints,     icon:"🏆"},
                {l:"Plan Meals",    v:"28",            icon:"🎯"},
                {l:"Day Streak",    v:`${streak} 🔥`,  icon:"⚡"},
              ].map((s)=>(
                <div key={s.l} className={styles.statCard}>
                  <div className={styles.statIcon}>{s.icon}</div>
                  <div className={styles.statVal} style={{color:"#4ade80"}}>{s.v}</div>
                  <div className={styles.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className={styles.menuList}>
              {MENU_ITEMS.map((m)=>(
                <button key={m.label} className={styles.menuItem}
                  onClick={()=>m.to&&handleNavigate(m.to)}>
                  <span className={styles.menuIcon}>{m.icon}</span>
                  <span className={styles.menuLabel}>{m.label}</span>
                  <span className={styles.menuArrow}>›</span>
                </button>
              ))}
            </div>

            <button className={styles.signOut} onClick={handleSignOut}>Sign Out</button>
          </>
        )}

        {/* ── TRAINER TAB ────────────────────────────────── */}
        {tab==="trainer" && (
          <>
            <div className={styles.refCard}>
              <div className={styles.refLabel}>YOUR REFERRAL CODE</div>
              <div className={styles.refCode}>
                {trainerData?.referralCode || "TRN-2847"}
              </div>
              <div className={styles.refSub}>Share with clients → earn ₹50 per order</div>
            </div>

            <div className={styles.statsGrid}>
              {[
                {l:"Total Referrals", v: trainerData?.totalReferrals??23,   c:"#4ade80"},
                {l:"This Month",      v:8,                                   c:"#60a5fa"},
                {l:"Total Earned",    v:`₹${(trainerData?.totalEarned??1150).toLocaleString("en-IN")}`, c:"#facc15"},
                {l:"Pending",         v:`₹${(trainerData?.pendingPayout??200).toLocaleString("en-IN")}`,c:"#fb923c"},
              ].map((s)=>(
                <div key={s.l} className={styles.statCard}>
                  <div className={styles.statVal} style={{color:s.c}}>{s.v}</div>
                  <div className={styles.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className={styles.sectionLabel}>Recent Clients</div>
            {(trainerClients.length
              ? trainerClients
              : [{userName:"Raj S.",phone:"",orderCount:3,commissionEarned:150},
                 {userName:"Priya M.",phone:"",orderCount:7,commissionEarned:350},
                 {userName:"Amit K.",phone:"",orderCount:2,commissionEarned:100}]
            ).map((c,i)=>(
              <div key={i} className={styles.clientCard}>
                <div className={styles.clientAvatar}>👤</div>
                <div className={styles.clientInfo}>
                  <div className={styles.clientName}>{c.userName}</div>
                  <div className={styles.clientOrders}>{c.orderCount} orders via your code</div>
                </div>
                <div className={styles.clientEarned}>
                  ₹{c.commissionEarned?.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── REWARDS TAB ────────────────────────────────── */}
        {tab==="rewards" && (
          <>
            <div className={styles.pointsHero}>
              <div style={{fontSize:52}}>🏆</div>
              <div className={styles.pointsBig}>{totalPoints}</div>
              <div className={styles.pointsSub}>reward points · 10 pts per ₹100</div>
            </div>

            <div className={styles.sectionLabel}>Milestones</div>
            {milestones.map((m)=>(
              <div key={m.id} className={styles.milestoneCard}
                style={{opacity:m.achieved&&m.pct===100?0.55:1}}>
                <span style={{fontSize:32}}>{m.icon}</span>
                <div className={styles.milestoneInfo}>
                  <div className={styles.milestoneName}>{m.reward}</div>
                  {m.achieved ? (
                    <div className={styles.milestoneStatus} style={{color:"#4ade80"}}>✅ Achieved</div>
                  ) : (
                    <>
                      <div className={styles.milestoneStatus} style={{color:"#475569"}}>
                        {m.pts - totalPoints} pts to go
                      </div>
                      <div className={styles.milestoneTrack}>
                        <div className={styles.milestoneFill}
                          style={{width:`${m.pct}%`}}/>
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.milestonePts}>{m.pts}</div>
              </div>
            ))}

            {/* Streak calendar */}
            <div className={styles.streakCard}>
              <div className={styles.streakTitle}>🔥 Weekly Order Streak</div>
              <div className={styles.streakRow}>
                {DAYS.map((d,i)=>(
                  <div key={d} className={styles.streakDay}>
                    <div className={styles.streakDot}
                      style={i<streak?{background:"rgba(250,204,21,0.15)",border:"2px solid #facc15"}:{}}>
                      {i<streak?"🔥":""}
                    </div>
                    <div className={styles.streakDayLabel}>{d.charAt(0)}</div>
                  </div>
                ))}
              </div>
              <div className={styles.streakMsg}>
                {streak}/7 days — {10-streak} more to go for free meal! 🎁
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
