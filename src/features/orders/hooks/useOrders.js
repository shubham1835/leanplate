// hooks/useOrders.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, fetchActiveOrder, cancelOrder, selectActiveOrder, selectOrderHistory, selectOrderLoading } from "@core/store/reducers/orderSlice";
import { onForegroundMessage, showLocalNotification, ORDER_STATUS_NOTIFICATIONS } from "@core/services/fcmService";
import { addItem, clearCart } from "@core/store/reducers/cartSlice";
import { useNavigate } from "react-router-dom";
import { SCREEN_NAMES } from "@core/navigation/routes";

export default function useOrders() {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const activeOrder  = useSelector(selectActiveOrder);
  const history      = useSelector(selectOrderHistory);
  const loading      = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(fetchActiveOrder());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Listen for order status push notifications while app is open
  useEffect(() => {
    let unsubscribe = () => {};
    onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      if (title) {
        showLocalNotification(title, body, payload.data);
        // Refresh active order when a status push arrives
        dispatch(fetchActiveOrder());
      }
    }).then((fn) => { unsubscribe = fn; });
    return () => unsubscribe();
  }, [dispatch]);

  const handleReorder = (order) => {
    dispatch(clearCart());
    order.items?.forEach((i) => dispatch(addItem({ ...i, id: i.itemId, qty: 1 })));
    navigate(SCREEN_NAMES.CHECKOUT);
  };

  const handleCancel = (id) => dispatch(cancelOrder(id));

  const getStatusColor = (s) => ({
    PENDING: "#fb923c", PREPARING: "#facc15",
    READY: "#4ade80",   COLLECTED: "#475569", CANCELLED: "#f87171",
  }[s] || "#94a3b8");

  const getEta = (s) => ({ PENDING:"~15 mins", PREPARING:"~8 mins", READY:"Ready now!" }[s] || "");

  return { activeOrder, history, loading, handleReorder, handleCancel, getStatusColor, getEta };
}
