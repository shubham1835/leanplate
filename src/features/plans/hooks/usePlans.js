import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPlans, fetchActiveSub, pauseSubscription,
  resumeSubscription, createSubscription,
  selectPlans, selectActiveSub, selectSubLoading, selectSubError,
} from "@core/store/reducers/subscriptionSlice";

export default function usePlans() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const plans     = useSelector(selectPlans);
  const activeSub = useSelector(selectActiveSub);
  const loading   = useSelector(selectSubLoading);
  const error     = useSelector(selectSubError);
  const [period, setPeriod] = useState("MONTHLY");

  useEffect(() => {
    dispatch(fetchPlans());
    dispatch(fetchActiveSub());
  }, [dispatch]);

  const handlePause     = () => activeSub && dispatch(pauseSubscription(activeSub.id));
  const handleResume    = () => activeSub && dispatch(resumeSubscription(activeSub.id));
  const handleSubscribe = (planId) => dispatch(createSubscription({ planId, period }));
  const handleBack      = () => navigate(-1);

  const subProgress = activeSub
    ? Math.round((activeSub.mealsUsed / activeSub.mealsTotal) * 100)
    : 0;

  return {
    plans, activeSub, loading, error,
    period, setPeriod, subProgress,
    handlePause, handleResume, handleSubscribe, handleBack,
  };
}
