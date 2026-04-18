import React from "react";
import useMenu          from "../hooks/useMenu";
import CartFAB          from "@shared/components/CartFAB";
import Tag              from "@shared/components/Tag";
import MacroPill        from "@shared/components/MacroPill";
import LoadingOverlay   from "@shared/components/LoadingOverlay";
import ErrorMessage     from "@shared/components/ErrorMessage";
import styles           from "../styles/styles.module.css";

export default function MenuScreen() {
  const {
    categories, activeCategory, visibleItems,
    loading, error, search, goalFilter, goalConfig, goal,
    setSearch, clearSearch, toggleGoalFilter,
    handleCategoryChange, handleAdd, handleRemove, getItemQty,
  } = useMenu();

  return (
    <div className={styles.page}>
      {/* ── Sticky header ───────────────────────────────── */}
      <div className={styles.stickyTop}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Menu</h1>
          {goal ? (
            <button
              className={styles.filterBtn}
              style={goalFilter ? { background: goalConfig.bg, borderColor: `${goalConfig.color}66`, color: goalConfig.color } : {}}
              onClick={toggleGoalFilter}
            >
              {goalConfig.icon} {goalFilter ? goalConfig.label : "All Items"}
            </button>
          ) : (
            <span style={{fontSize:12,color:"#94a3b8",padding:"7px 14px"}}>
              All Items
            </span>
          )}
        </div>

        {/* Search */}
        <div className={styles.searchBar}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
          />
          {search && <button className={styles.clearBtn} onClick={clearSearch}>✕</button>}
        </div>

        {/* Category pills */}
        <div className={styles.catRow}>
          {categories.map((cat) => (
            <button
              key={cat.category}
              className={`${styles.catPill} ${activeCategory === cat.category ? styles.catPillActive : ""}`}
              onClick={() => handleCategoryChange(cat.category)}
            >
              {cat.icon} {cat.displayName?.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className={styles.body}>
        {loading && <LoadingOverlay />}
        {error   && <ErrorMessage message={error} />}

        {!loading && (
          <div className={styles.itemList}>
            {visibleItems.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <div>No items found</div>
              </div>
            ) : visibleItems.map((item) => {
              const qty = getItemQty(item.id);
              return (
                <div key={item.id} className={styles.itemCard}>
                  {/* Top row */}
                  <div className={styles.itemTop}>
                    <div className={styles.itemLeft}>
                      <div className={styles.itemEmoji}>{item.emoji || "🍽"}</div>
                      <div>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.tagRow}>
                          {item.tags?.map((t) => <Tag key={t} label={t} />)}
                        </div>
                        {item.comboDesc && (
                          <div className={styles.comboDesc}>Includes: {item.comboDesc}</div>
                        )}
                      </div>
                    </div>
                    <div className={styles.itemPrice}>₹{item.price}</div>
                  </div>

                  {/* Macros */}
                  <div className={styles.macroRow}>
                    <MacroPill label="PROTEIN" value={item.proteinG || 0} type="protein" size="lg" />
                    <MacroPill label="CARBS"   value={item.carbsG   || 0} type="carbs"   size="lg" />
                    <MacroPill label="FAT"     value={item.fatG     || 0} type="fat"     size="lg" />
                    <MacroPill label="KCAL"    value={item.calories || 0} type="cal"     size="lg" />
                  </div>

                  {/* Goal chips */}
                  <div className={styles.goalChips}>
                    {item.goalFit?.map((g) => {
                      const cfg = { FAT_LOSS: { icon:"🔥", color:"#f87171", bg:"rgba(248,113,113,0.08)" },
                                    MUSCLE_GAIN: { icon:"💪", color:"#60a5fa", bg:"rgba(96,165,250,0.08)" },
                                    MAINTENANCE: { icon:"⚖️", color:"#4ade80", bg:"rgba(74,222,128,0.08)" } }[g];
                      if (!cfg) return null;
                      return (
                        <span key={g} style={{ fontSize:10, padding:"3px 8px", background:cfg.bg,
                          color:cfg.color, border:`1px solid ${cfg.color}33`,
                          borderRadius:5, fontWeight:700, letterSpacing:0.3 }}>
                          {cfg.icon} {g.replace("_"," ")}
                        </span>
                      );
                    })}
                  </div>

                  {/* Add/Remove */}
                  {qty === 0 ? (
                    <button className={styles.addBtn} onClick={() => handleAdd(item)}>
                      + Add to Order
                    </button>
                  ) : (
                    <div className={styles.qtyRow}>
                      <button className={styles.qtyMinus} onClick={() => handleRemove(item.id)}>−</button>
                      <span className={styles.qtyNum}>{qty}</span>
                      <button className={styles.qtyPlus} onClick={() => handleAdd(item)}>+</button>
                      <span className={styles.lineTotal}>₹{item.price * qty}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CartFAB />
    </div>
  );
}
