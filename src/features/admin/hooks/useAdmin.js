import { useEffect, useState, useCallback } from "react";
import { adminService } from "@core/mock/serviceFactory";

export default function useAdmin() {
  const [tab,        setTab]        = useState("overview");
  const [analytics,  setAnalytics]  = useState(null);
  const [revenue,    setRevenue]    = useState(null);
  const [orders,     setOrders]     = useState([]);
  const [users,      setUsers]      = useState([]);
  const [menuItems,  setMenuItems]  = useState([]);
  const [otps,       setOtps]       = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [menuLoading,setMenuLoading]= useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSearch,  setOtpSearch]  = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [editItem,   setEditItem]   = useState(null);   // item being edited
  const [showForm,   setShowForm]   = useState(false);  // new item form

  // Initial load: overview data
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      adminService.getDailyAnalytics().then(setAnalytics).catch(() => {}),
      adminService.getWeeklyRevenue().then(setRevenue).catch(() => {}),
      adminService.getActiveOrders().then(setOrders).catch(() => {}),
      adminService.getUsers(0, 20).then((d) => setUsers(d?.content || d || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  // Lazy load menu items when menu tab is opened
  useEffect(() => {
    if (tab === "menu" && menuItems.length === 0) {
      loadMenuItems();
    }
  }, [tab]);

  // Lazy load OTPs when otp tab is opened
  useEffect(() => {
    if (tab === "otps") {
      loadOtps();
    }
  }, [tab]);

  const loadMenuItems = async () => {
    setMenuLoading(true);
    try {
      const data = await adminService.getMenuItems();
      // data is array of categories each with .items — flatten
      const flat = Array.isArray(data)
        ? data.flatMap((cat) => (cat.items || []).map((i) => ({ ...i, categoryDisplay: cat.displayName || cat.category })))
        : [];
      setMenuItems(flat);
    } catch (e) {
      console.error("Failed to load menu items:", e);
    } finally {
      setMenuLoading(false);
    }
  };

  const loadOtps = async () => {
    setOtpLoading(true);
    try {
      const data = await adminService.getTodayOtps();
      setOtps(data || []);
    } catch (e) {
      console.error("Failed to load OTPs:", e);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Order status update ──────────────────────────────────────────
  const handleUpdateStatus = useCallback(async (orderId, status) => {
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, ...updated } : o)));
    } catch (e) {
      console.error("Status update failed:", e);
    }
  }, []);

  // ── Menu CRUD ────────────────────────────────────────────────────
  const handleToggleAvailability = useCallback(async (id) => {
    try {
      await adminService.toggleAvailability(id);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  }, []);

  const handleDeleteItem = useCallback(async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await adminService.deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }, []);

  const handleSaveItem = useCallback(async (data) => {
    try {
      if (editItem) {
        const updated = await adminService.updateMenuItem(editItem.id, data);
        setMenuItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...i, ...data, ...updated } : i)));
      } else {
        const created = await adminService.createMenuItem(data);
        setMenuItems((prev) => [...prev, created]);
      }
      setEditItem(null);
      setShowForm(false);
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, [editItem]);

  // Filtered menu items
  const filteredMenu = menuItems.filter((i) =>
    !menuSearch || i.name?.toLowerCase().includes(menuSearch.toLowerCase())
  );

  // Filtered OTPs
  const filteredOtps = otps.filter((o) =>
    !otpSearch ||
    o.phone?.includes(otpSearch) ||
    o.name?.toLowerCase().includes(otpSearch.toLowerCase())
  );

  return {
    tab, setTab,
    analytics, revenue, orders, users,
    menuItems: filteredMenu, menuLoading, menuSearch, setMenuSearch,
    otps: filteredOtps, otpLoading, otpSearch, setOtpSearch,
    editItem, setEditItem, showForm, setShowForm,
    loading,
    handleUpdateStatus,
    handleToggleAvailability,
    handleDeleteItem,
    handleSaveItem,
    refreshOrders: () => adminService.getActiveOrders().then(setOrders).catch(() => {}),
    refreshOtps:   loadOtps,
  };
}
