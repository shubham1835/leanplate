import React, { useState } from "react";
import useAdmin       from "../hooks/useAdmin";
import LoadingOverlay from "@shared/components/LoadingOverlay";
import CommonButton   from "@shared/components/CommonButton";
import styles         from "../styles/styles.module.css";

const STATUS_COLOR = {
  PENDING:"#fb923c", PREPARING:"#facc15", READY:"#4ade80",
  COLLECTED:"#94a3b8", REJECTED:"#f87171", CANCELLED:"#f87171",
};

// ── Order action buttons based on current status ─────────────────
function OrderActions({ order, onUpdate }) {
  if (order.status === "PENDING") return (
    <div style={{display:"flex",gap:8}}>
      <CommonButton size="sm" color="#facc15" full onClick={() => onUpdate(order.id,"PREPARING")}>
        Start Preparing
      </CommonButton>
      <CommonButton size="sm" color="#f87171" full onClick={() => onUpdate(order.id,"REJECTED")}>
        Reject
      </CommonButton>
    </div>
  );
  if (order.status === "PREPARING") return (
    <CommonButton size="sm" color="#4ade80" full onClick={() => onUpdate(order.id,"READY")}>
      Mark Ready ✓
    </CommonButton>
  );
  if (order.status === "READY") return (
    <CommonButton size="sm" color="#60a5fa" full onClick={() => onUpdate(order.id,"COLLECTED")}>
      Mark Collected
    </CommonButton>
  );
  return null;
}

// ── Inline edit form for menu items ──────────────────────────────
function MenuItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:      item?.name      || "",
    category:  item?.category  || "EGGS_BHURJI",
    price:     item?.price     || "",
    proteinG:  item?.proteinG  || 0,
    carbsG:    item?.carbsG    || 0,
    fatG:      item?.fatG      || 0,
    calories:  item?.calories  || 0,
    emoji:     item?.emoji     || "🍽",
    isAvailable: item?.isAvailable ?? true,
  });

  const field = (k) => ({
    value: form[k],
    onChange: (e) => setForm((p) => ({ ...p, [k]: e.target.value })),
  });

  const inputStyle = {
    background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8,
    padding:"8px 10px", fontSize:13, fontFamily:"inherit",
    color:"#1e293b", outline:"none", width:"100%", boxSizing:"border-box",
  };

  return (
    <div style={{background:"#fff",border:"1.5px solid #16a34a33",borderRadius:14,padding:16,marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:"#1e293b",marginBottom:12}}>
        {item ? "✏️ Edit Item" : "➕ New Menu Item"}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <div style={{gridColumn:"1/-1"}}>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>NAME</label>
          <input {...field("name")} style={inputStyle} placeholder="Item name" />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>CATEGORY</label>
          <select {...field("category")} style={inputStyle}>
            {["HYDRATION_SHAKES","SIGNATURE_BOWLS","EGGS_BHURJI","SALADS_SOUPS","SANDWICHES"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>PRICE (₹)</label>
          <input {...field("price")} type="number" style={inputStyle} placeholder="99" />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>PROTEIN (g)</label>
          <input {...field("proteinG")} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>CARBS (g)</label>
          <input {...field("carbsG")} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>FAT (g)</label>
          <input {...field("fatG")} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>CALORIES</label>
          <input {...field("calories")} type="number" style={inputStyle} />
        </div>
        <div>
          <label style={{fontSize:11,color:"#94a3b8",fontWeight:700,display:"block",marginBottom:4}}>EMOJI</label>
          <input {...field("emoji")} style={inputStyle} placeholder="🍳" />
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <CommonButton size="sm" color="#16a34a" full onClick={() => onSave(form)}>
          {item ? "Save Changes" : "Create Item"}
        </CommonButton>
        <CommonButton size="sm" variant="flat" onClick={onCancel}>Cancel</CommonButton>
      </div>
    </div>
  );
}

// ── Main Admin Screen ─────────────────────────────────────────────
export default function AdminScreen() {
  const {
    tab, setTab, analytics, revenue, orders, users,
    menuItems, menuLoading, menuSearch, setMenuSearch,
    otps, otpLoading, otpSearch, setOtpSearch,
    editItem, setEditItem, showForm, setShowForm,
    loading, handleUpdateStatus,
    handleToggleAvailability, handleDeleteItem,
    handleSaveItem, refreshOrders, refreshOtps,
  } = useAdmin();

  const stats = analytics ? [
    {l:"Today Orders", v:analytics.totalOrders,         icon:"📋", c:"#16a34a"},
    {l:"Revenue",      v:`₹${analytics.totalRevenue}`,  icon:"💰", c:"#d97706"},
    {l:"Active Subs",  v:analytics.activeSubscriptions, icon:"🔄", c:"#2563eb"},
    {l:"New Users",    v:analytics.newUsers,             icon:"👤", c:"#7c3aed"},
  ] : [];

  const revenueData = revenue?.days?.map((d) => d.revenue) ?? [];
  const maxRev      = Math.max(...revenueData.filter(Boolean), 1);
  const topItems    = analytics?.topItems ?? [];

  const TABS = [
    ["overview","📊 Overview"],
    ["orders",  "📋 Orders"],
    ["menu",    "🥗 Menu"],
    ["otps",    "🔑 OTPs"],
    ["users",   "👤 Users"],
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.adminBadge}>🛡 ADMIN</div>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <div className={styles.tabs}>
        {TABS.map(([id, label]) => (
          <button key={id}
            className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
            onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {loading && <LoadingOverlay />}

      <div className={styles.body}>

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {tab === "overview" && (
          <>
            <div className={styles.statsGrid}>
              {stats.map((s) => (
                <div key={s.l} className={styles.statCard}>
                  <div className={styles.statTop}>
                    <span style={{fontSize:22}}>{s.icon}</span>
                  </div>
                  <div className={styles.statVal} style={{color:s.c}}>{s.v}</div>
                  <div className={styles.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Revenue This Week</span>
                <span className={styles.cardVal}>
                  ₹{revenueData.reduce((a, b) => a + b, 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className={styles.barChart}>
                {revenueData.map((v, i) => {
                  const isToday = i === 5;
                  return (
                    <div key={i} className={styles.barWrap}>
                      <div className={styles.barValLabel}>
                        {v > 0 ? `${(v / 1000).toFixed(1)}k` : ""}
                      </div>
                      <div className={styles.bar} style={{
                        height: v > 0 ? `${(v / maxRev) * 80}px` : "0px",
                        background: isToday ? "#16a34a" : "#bbf7d0",
                      }} />
                      <div className={styles.barLabel}>
                        {["M","T","W","T","F","S","S"][i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.sectionLabel}>Top Items Today</div>
            {topItems.map((item, i) => (
              <div key={i} className={styles.topItem}>
                <div>
                  <div className={styles.topItemName}>{item.itemName}</div>
                  <div className={styles.topItemOrders}>{item.orderCount} orders</div>
                </div>
                <div className={styles.topItemRev}>₹{item.revenue?.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </>
        )}

        {/* ── ORDERS ───────────────────────────────────────────── */}
        {tab === "orders" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div className={styles.sectionLabel} style={{margin:0}}>
                {orders.length} active orders
              </div>
              <button onClick={refreshOrders} style={{
                background:"none",border:"none",color:"#16a34a",fontSize:12,
                fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              }}>
                ↻ Refresh
              </button>
            </div>

            <div className={styles.orderStatus}>
              {[
                {l:"Pending",   v:orders.filter(o=>o.status==="PENDING").length,   c:"#fb923c"},
                {l:"Preparing", v:orders.filter(o=>o.status==="PREPARING").length, c:"#facc15"},
                {l:"Ready",     v:orders.filter(o=>o.status==="READY").length,     c:"#4ade80"},
              ].map((s) => (
                <div key={s.l} className={styles.orderStatusCard}
                  style={{background:`${s.c}15`,border:`1px solid ${s.c}44`}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:11,color:"#94a3b8"}}>{s.l}</div>
                </div>
              ))}
            </div>

            {orders.length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}>
                <div style={{fontSize:36,marginBottom:8}}>📋</div>
                <div>No active orders</div>
              </div>
            ) : orders.map((o) => (
              <div key={o.id} className={styles.orderCard}>
                <div className={styles.orderCardTop}>
                  <div>
                    <div className={styles.orderCardId}>{o.orderNumber}</div>
                    <div className={styles.orderCardUser}>
                      {o.user?.name} · {o.pickupSlot}
                    </div>
                  </div>
                  <div style={{fontSize:11,color:STATUS_COLOR[o.status]||"#94a3b8",fontWeight:700}}>
                    ● {o.status}
                  </div>
                </div>
                <div className={styles.orderCardItems}>
                  {o.items?.map((i) => i.itemName).join(", ")}
                </div>
                <div className={styles.orderCardActions}>
                  <OrderActions order={o} onUpdate={handleUpdateStatus} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── MENU ─────────────────────────────────────────────── */}
        {tab === "menu" && (
          <>
            <div className={styles.menuTopBar}>
              <input
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="🔍 Search items..."
                style={{
                  flex:1, background:"#f1f5f9", border:"1.5px solid #e2e8f0",
                  borderRadius:8, padding:"8px 12px", fontSize:13,
                  fontFamily:"inherit", outline:"none", color:"#1e293b",
                }}
              />
              <CommonButton size="sm" color="#16a34a"
                onClick={() => { setEditItem(null); setShowForm(true); }}
                style={{marginLeft:10,flexShrink:0}}>
                + Add Item
              </CommonButton>
            </div>

            {showForm && (
              <MenuItemForm
                item={editItem}
                onSave={handleSaveItem}
                onCancel={() => { setShowForm(false); setEditItem(null); }}
              />
            )}

            {menuLoading ? (
              <LoadingOverlay message="Loading menu items..." />
            ) : menuItems.length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}>
                <div style={{fontSize:36,marginBottom:8}}>🥗</div>
                <div>No items found</div>
              </div>
            ) : menuItems.map((item) => (
              <div key={item.id} style={{
                background:"#fff", border:"1px solid #e2e8f0", borderRadius:12,
                padding:"12px 14px", marginBottom:8,
                display:"flex", alignItems:"center", gap:10,
              }}>
                <span style={{fontSize:24,flexShrink:0}}>{item.emoji || "🍽"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1e293b"}}>{item.name}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                    {item.categoryDisplay || item.category} ·
                    <span style={{color:"#60a5fa"}}> {item.proteinG}g P</span> ·
                    <span style={{color:"#f59e0b"}}> {item.carbsG}g C</span> ·
                    <span style={{color:"#f87171"}}> {item.fatG}g F</span> ·
                    <span style={{color:"#16a34a"}}> {item.calories} kcal</span>
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:900,color:"#16a34a",flexShrink:0}}>
                  ₹{item.price}
                </div>
                <div style={{
                  fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,flexShrink:0,
                  background: item.isAvailable ? "#dcfce7" : "#fee2e2",
                  color:      item.isAvailable ? "#16a34a" : "#dc2626",
                }}>
                  {item.isAvailable ? "ON" : "OFF"}
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={() => handleToggleAvailability(item.id)} style={{
                    background:"#f1f5f9",border:"1px solid #e2e8f0",
                    borderRadius:6,padding:"5px 8px",cursor:"pointer",
                    fontSize:12,color:"#475569",fontFamily:"inherit",
                  }}>
                    {item.isAvailable ? "🔴" : "🟢"}
                  </button>
                  <button onClick={() => { setEditItem(item); setShowForm(true); }} style={{
                    background:"#eff6ff",border:"1px solid #bfdbfe",
                    borderRadius:6,padding:"5px 8px",cursor:"pointer",
                    fontSize:12,color:"#2563eb",fontFamily:"inherit",
                  }}>
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} style={{
                    background:"#fef2f2",border:"1px solid #fecaca",
                    borderRadius:6,padding:"5px 8px",cursor:"pointer",
                    fontSize:12,color:"#dc2626",fontFamily:"inherit",
                  }}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── OTPs ─────────────────────────────────────────────── */}
        {tab === "otps" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>Today's OTPs</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                  {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short",year:"numeric"})}
                </div>
              </div>
              <button onClick={refreshOtps} style={{
                background:"none",border:"none",color:"#16a34a",
                fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              }}>
                ↻ Refresh
              </button>
            </div>

            <input
              value={otpSearch}
              onChange={(e) => setOtpSearch(e.target.value)}
              placeholder="🔍 Search by phone or name..."
              style={{
                width:"100%", background:"#f1f5f9", border:"1.5px solid #e2e8f0",
                borderRadius:8, padding:"10px 12px", fontSize:13,
                fontFamily:"inherit", outline:"none", color:"#1e293b",
                marginBottom:14, boxSizing:"border-box",
              }}
            />

            {otpLoading ? (
              <LoadingOverlay message="Loading OTPs..." />
            ) : otps.length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}>
                <div style={{fontSize:36,marginBottom:8}}>🔑</div>
                <div style={{fontSize:14,fontWeight:600}}>No OTPs generated today</div>
              </div>
            ) : (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f1f5f9"}}>
                      {["Phone","Name","OTP","Generated At","Used","Expires At"].map((h) => (
                        <th key={h} style={{
                          padding:"10px 12px",textAlign:"left",
                          fontSize:11,fontWeight:700,color:"#94a3b8",
                          letterSpacing:0.5,textTransform:"uppercase",
                          borderBottom:"1px solid #e2e8f0",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {otps.map((otp, i) => (
                      <tr key={otp.id || i} style={{
                        background: i % 2 === 0 ? "#fff" : "#f8fafc",
                        borderBottom:"1px solid #f1f5f9",
                      }}>
                        <td style={{padding:"10px 12px",fontWeight:700,color:"#1e293b"}}>
                          {otp.phone}
                        </td>
                        <td style={{padding:"10px 12px",color:"#475569"}}>
                          {otp.name || "—"}
                        </td>
                        <td style={{padding:"10px 12px"}}>
                          <span style={{
                            fontFamily:"monospace", fontSize:16, fontWeight:900,
                            color: otp.used ? "#94a3b8" : "#16a34a",
                            background: otp.used ? "#f1f5f9" : "#dcfce7",
                            padding:"3px 10px", borderRadius:6,
                            letterSpacing:3,
                          }}>
                            {otp.otpCode}
                          </span>
                        </td>
                        <td style={{padding:"10px 12px",color:"#475569",fontSize:12}}>
                          {otp.createdAt ? new Date(otp.createdAt).toLocaleTimeString("en-IN") : "—"}
                        </td>
                        <td style={{padding:"10px 12px"}}>
                          <span style={{
                            fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
                            background: otp.used ? "#f1f5f9" : "#fef3c7",
                            color:      otp.used ? "#94a3b8" : "#d97706",
                          }}>
                            {otp.used ? "✓ Used" : "Pending"}
                          </span>
                        </td>
                        <td style={{padding:"10px 12px",color:"#94a3b8",fontSize:12}}>
                          {otp.expiresAt ? new Date(otp.expiresAt).toLocaleTimeString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── USERS ─────────────────────────────────────────────── */}
        {tab === "users" && (
          <>
            <div className={styles.sectionLabel} style={{marginBottom:12}}>
              {users.length} users loaded
            </div>
            {users.length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8"}}>
                <div style={{fontSize:36,marginBottom:8}}>👤</div>
                <div>No users data</div>
              </div>
            ) : users.map((u, i) => (
              <div key={u.id || i} className={styles.userCard}>
                <div className={styles.userAvatar}>👤</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{u.name || "—"}</div>
                  <div className={styles.userPhone}>{u.phone}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className={styles.userPts}>{u.rewardPoints || 0} pts</div>
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>
                    {u.goal?.replace("_"," ") || "No goal"}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
