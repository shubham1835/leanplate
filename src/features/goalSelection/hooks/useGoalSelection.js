import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setGoal } from "@core/store/reducers/goalSlice";
import { fetchMenuByGoal } from "@core/store/reducers/menuSlice";
import { selectUser } from "@core/store/reducers/userSlice";
import { SCREEN_NAMES } from "@core/navigation/routes";
import { GOAL_CONFIG } from "@shared/constants/menuConstants";

export default function useGoalSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const goals = Object.entries(GOAL_CONFIG).map(([id, cfg]) => ({ id, ...cfg }));

  const handleSelect = async (goalId) => {
    dispatch(setGoal(goalId));
    dispatch(fetchMenuByGoal(goalId));   // pre-fetch recommendations
    navigate(SCREEN_NAMES.HOME, { replace: true });
  };

  return { goals, user, handleSelect };
}
