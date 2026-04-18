import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFullMenu, setActiveCategory,
  selectCategories, selectActiveCategory, selectMenuLoading, selectMenuError,
} from "@core/store/reducers/menuSlice";
import { addItem, removeItem, selectCartItems } from "@core/store/reducers/cartSlice";
import { selectGoal } from "@core/store/reducers/goalSlice";
import { GOAL_CONFIG } from "@shared/constants/menuConstants";

export default function useMenu() {
  const dispatch       = useDispatch();
  const categories     = useSelector(selectCategories);
  const activeCategory = useSelector(selectActiveCategory);
  const loading        = useSelector(selectMenuLoading);
  const error          = useSelector(selectMenuError);
  const goal           = useSelector(selectGoal);               // may be null for guests
  const cartItems      = useSelector(selectCartItems);

  const [search,     setSearch]     = useState("");
  const [goalFilter, setGoalFilter] = useState(false);

  // Safe goal config — guests get a neutral default
  const safeGoal   = goal || "FAT_LOSS";
  const goalConfig = GOAL_CONFIG[safeGoal] || GOAL_CONFIG.FAT_LOSS;

  // Fetch menu on mount (or when returning to this tab after clearing)
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchFullMenu());
    }
  }, [dispatch]);   // intentionally only on mount

  const currentCat   = categories.find((c) => c.category === activeCategory);
  const visibleItems = (currentCat?.items || []).filter((item) => {
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchGoal   = !goalFilter || !goal ||
      (item.goalFit || []).includes(goal);
    return matchSearch && matchGoal;
  });

  const getItemQty   = (id) => cartItems.find((i) => i.id === id)?.qty || 0;
  const handleAdd    = (item) => dispatch(addItem(item));
  const handleRemove = (id)   => dispatch(removeItem(id));

  const handleCategoryChange = (cat) => dispatch(setActiveCategory(cat));

  // Only allow goal filter when user has set a goal
  const toggleGoalFilter = () => {
    if (!goal) return; // guests can't filter by goal
    setGoalFilter((f) => !f);
  };

  const clearSearch = () => setSearch("");

  return {
    categories, activeCategory, visibleItems,
    loading, error, search, goalFilter, goalConfig, goal,
    setSearch, clearSearch, toggleGoalFilter,
    handleCategoryChange, handleAdd, handleRemove, getItemQty,
  };
}
