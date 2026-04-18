import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, clearAuth } from "@core/store/reducers/userSlice";
import { selectGoal } from "@core/store/reducers/goalSlice";
import { clearCart } from "@core/store/reducers/cartSlice";
import { teardownFCM } from "@core/services/fcmService";
import { SCREEN_NAMES } from "@core/navigation/routes";
import { rewardsService, trainerService } from "@core/mock/serviceFactory";
import { GOAL_CONFIG } from "@shared/constants/menuConstants";

const MILESTONES = [
  { id:"detox_shot",   reward:"Free Detox Shot",           icon:"🥤", pts:200  },
  { id:"free_meal",    reward:"Free Meal (up to ₹150)",    icon:"🍳", pts:500  },
  { id:"plan_discount",reward:"20% Off Monthly Plan",      icon:"🎁", pts:1000 },
  { id:"free_week",    reward:"Free Transformation Week",  icon:"🏋️", pts:2000 },
];

export default function useProfile() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const user        = useSelector(selectUser);
  const goal        = useSelector(selectGoal);
  const goalConfig  = GOAL_CONFIG[goal] || GOAL_CONFIG.MAINTENANCE;

  const [tab,          setTab]          = useState("me");
  const [rewardSummary,setRewardSummary]= useState(null);
  const [trainerData,  setTrainerData]  = useState(null);
  const [trainerClients,setTrainerClients]=useState([]);

  useEffect(() => {
    rewardsService.getSummary()
      .then(setRewardSummary)
      .catch(()=>setRewardSummary({ totalPoints: user?.rewardPoints||340, history:[] }));
  }, []);

  const handleTrainerTab = () => {
    if (!trainerData) {
      trainerService.getProfile().then(setTrainerData).catch(()=>{});
      trainerService.getClients().then(setTrainerClients).catch(()=>{});
    }
  };

  const handleSignOut = async () => {
    await teardownFCM().catch(() => {});   // remove FCM token from backend
    dispatch(clearAuth());
    dispatch(clearCart());
    navigate(SCREEN_NAMES.LOGIN, { replace: true });
  };

  const handleNavigate = (to) => navigate(to);

  const totalPoints = rewardSummary?.totalPoints ?? user?.rewardPoints ?? 0;
  const streak      = user?.streakCount ?? 0;

  const milestones = MILESTONES.map((m) => ({
    ...m,
    achieved: totalPoints >= m.pts,
    pct:      Math.min(100, Math.round((totalPoints / m.pts) * 100)),
  }));

  return {
    user, goal, goalConfig, tab, setTab,
    totalPoints, streak, milestones,
    trainerData, trainerClients,
    handleTrainerTab, handleSignOut, handleNavigate,
  };
}
