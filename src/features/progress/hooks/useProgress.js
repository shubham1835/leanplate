import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectGoal } from "@core/store/reducers/goalSlice";
import { selectUser  } from "@core/store/reducers/userSlice";
import { progressService } from "@core/mock/serviceFactory";
import { GOAL_CONFIG } from "@shared/constants/menuConstants";

export default function useProgress() {
  const goal       = useSelector(selectGoal);
  const user       = useSelector(selectUser);
  const goalConfig = GOAL_CONFIG[goal] || GOAL_CONFIG.MAINTENANCE;

  const [tab,     setTab]     = useState("weight");
  const [weights, setWeights] = useState([]);
  const [input,   setInput]   = useState("");
  const [logged,  setLogged]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    progressService.getWeightHistory()
      .then((data) => setWeights(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogWeight = async () => {
    const val = parseFloat(input);
    if (!val || val < 30 || val > 300) return;
    try {
      const entry = await progressService.logWeight({ weightKg: val, goal });
      setWeights((prev) => [...prev, entry]);
      setLogged(true);
      setInput("");
    } catch {}
  };

  // Summary
  const startW   = weights.length ? weights[0].weightKg   : null;
  const currentW = weights.length ? weights[weights.length-1].weightKg : null;
  const delta    = startW && currentW ? (currentW - startW).toFixed(1) : null;

  return {
    tab, setTab, weights, input, setInput, logged, loading,
    goalConfig, goal, user, startW, currentW, delta, handleLogWeight,
  };
}
