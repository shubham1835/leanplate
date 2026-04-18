import React, { useState } from "react";
import useOrders        from "../hooks/useOrders";
import LoadingOverlay   from "@shared/components/LoadingOverlay";
import CommonButton     from "@shared/components/CommonButton";
import styles           from "../styles/styles.module.css";
import { formatOrderDate } from "@shared/utils/formatters";

const STATUS_STEPS = ["PENDING","PREPARING","READY","COLLECTED"];

export default function OrdersScreen() {
  const { activeOrder, history, loading, handleReorder, handleCancel, getStatusColor, getEta } = useOrders();
  const [tab, setTab] = useState("active");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My <span style={{color:"#4ade80"}}>Orders</span></h1>
        <div className={styles.tabs}>
          {["active","history"].map((t) => (
            <button key={t} className={`${styles.tab} ${tab===t?styles.tabActive:""}`}
              onClick={()=>setTab(t)}>
              {t==="active"?"Active Order":"History"}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingOverlay />}

      {/* ── Active order ──────────────────────────────────── */}
      {tab === "active" && (
        <div className={styles.body}>
          {!activeOrder ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>
              <p>No active orders right now</p>
            </div>
          ) : (
            <div className={styles.activeCard}>
              <div className={styles.activeTop}>
                <div>
                  <div className={styles.activeStatus}
                    style={{color: getStatusColor(activeOrder.status)}}>
                    ● {activeOrder.status}
                  </div>
                  <div className={styles.activeId}>{activeOrder.orderNumber}</div>
                </div>
                <div className={styles.activeRight}>
                  <div className={styles.activeTotal}>₹{activeOrder.finalAmount}</div>
                  <div className={styles.activeSlot}>{activeOrder.pickupSlot}</div>
                </div>
              </div>

              <div className={styles.activeItems}>
                {activeOrder.items?.map((i) => i.itemName).join(", ")}
              </div>

              {/* Progress steps */}
              <div className={styles.progressSteps}>
                {STATUS_STEPS.map((s, i) => {
                  const idx   = STATUS_STEPS.indexOf(activeOrder.status);
                  const done  = i <= idx;
                  const isNow = i === idx;
                  return (
                    <div key={s} className={styles.stepRow}>
                      <div className={styles.stepDotCol}>
                        <div className={`${styles.dot} ${done?styles.dotDone:""}`}>
                          {done && i < idx ? "✓" : isNow ? "●" : ""}
                        </div>
                        {i < STATUS_STEPS.length-1 && (
                          <div className={`${styles.stepConnector} ${i<idx?styles.stepConnectorDone:""}`}/>
                        )}
                      </div>
                      <div className={styles.stepText}>
                        <div className={`${styles.stepLabel} ${done?styles.stepLabelDone:""}`}>
                          {s.charAt(0)+s.slice(1).toLowerCase().replace("_"," ")}
                        </div>
                        {isNow && <div className={styles.stepEta}>{getEta(s)}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                href={`https://wa.me/917841065516?text=Hi! Status of order ${activeOrder.orderNumber}?`}
                target="_blank" rel="noreferrer"
                className={styles.waTrack}
              >
                💬 Track on WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── History ───────────────────────────────────────── */}
      {tab === "history" && (
        <div className={styles.body}>
          {history.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>
              <p>No past orders yet</p>
            </div>
          ) : history.map((o) => (
            <div key={o.id} className={styles.histCard}>
              <div className={styles.histTop}>
                <div>
                  <div className={styles.histId}>{o.orderNumber}</div>
                  <div className={styles.histDate}>{formatOrderDate(o.createdAt)}</div>
                </div>
                <div className={styles.histRight}>
                  <div className={styles.histTotal}>₹{o.finalAmount}</div>
                  <div style={{fontSize:11, color: getStatusColor(o.status), fontWeight:700}}>
                    ✓ {o.status}
                  </div>
                </div>
              </div>
              <div className={styles.histItems}>{o.items?.map((i)=>i.itemName).join(", ")}</div>
              <div className={styles.histMacros}>
                <span>💪 {Math.round(o.macroSummary?.totalProtein||0)}g protein</span>
                <span>🔥 {o.macroSummary?.totalCalories||0} kcal</span>
              </div>
              <CommonButton onClick={()=>handleReorder(o)} variant="ghost" size="sm" color="#4ade80">
                🔄 Reorder
              </CommonButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
