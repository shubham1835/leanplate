import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, userDetails, selectIsAuthenticated, clearAuth } from "@core/store/reducers/userSlice";
import { selectGoal, setGoal } from "@core/store/reducers/goalSlice";
import { setupFCM } from "@core/services/fcmService";
import { selectRecommended, fetchMenuByGoal } from "@core/store/reducers/menuSlice";
import { selectActiveSub, fetchActiveSub } from "@core/store/reducers/subscriptionSlice";
import { addItem, removeItem, selectItemQty, selectCartItems } from "@core/store/reducers/cartSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import { GOAL_CONFIG, WHATSAPP_NUMBER } from "@shared/constants/menuConstants";
import { waLink } from "@shared/utils/formatters";

export default function useHome() {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const user         = useSelector(selectUser);
  const goal         = useSelector(selectGoal);
  const recommended  = useSelector(selectRecommended);
  const activeSub    = useSelector(selectActiveSub);
  const cartItems    = useSelector(selectCartItems);
  const goalConfig   = GOAL_CONFIG[goal] || GOAL_CONFIG.FAT_LOSS;

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (goal) dispatch(fetchMenuByGoal(goal));
    // Only fetch auth-required data when logged in
    if (isAuthenticated) {
      dispatch(fetchActiveSub());
      dispatch(userDetails());
      console.log("localStorage FCM token",localStorage.getItem("fcm_token"));
      if(!localStorage.getItem("fcm_token")){
        console.log("FCM Token not found, setting up FCM");
        setupFCM().catch((e) => console.warn("[FCM] Setup error:", e));
      }
    }
  }, [goal, isAuthenticated, dispatch]);

  const getItemQty = (id) => cartItems.find((i) => i.id === id)?.qty || 0;

  const handleAddItem    = (item) => dispatch(addItem(item));
  const handleRemoveItem = (id)   => dispatch(removeItem(id));
  const handleChangeGoal = ()     => navigate(SCREEN_NAMES.GOAL_SELECTION);
  const handleRepeatOrder= ()     => navigate(SCREEN_NAMES.CHECKOUT);
  const handleViewPlan   = ()     => navigate(SCREEN_NAMES.PLANS);
  const handleSeeAllMenu = ()     => navigate(SCREEN_NAMES.MENU);

  const waDietPlan  = waLink(WHATSAPP_NUMBER, "Hi! I need a custom diet plan");
  const waNutri     = waLink(WHATSAPP_NUMBER, "Hi! I need nutritionist help");

  // Mock streak / points (replace with real selectors when a rewards slice is added)
  const streak = user?.streakCount || 0;
  const points = user?.rewardPoints || 0;

  const subProgress = activeSub
    ? Math.round((activeSub.mealsUsed / activeSub.mealsTotal) * 100)
    : 0;

  return {
    user, goal, goalConfig, recommended, activeSub,
    streak, points, subProgress,
    getItemQty, handleAddItem, handleRemoveItem,
    handleChangeGoal, handleRepeatOrder, handleViewPlan, handleSeeAllMenu,
    waDietPlan, waNutri,
  };
}
