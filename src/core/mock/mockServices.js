// src/core/mock/mockServices.js
// ─────────────────────────────────────────────────────────────────
// Mock implementations of every service.
// Each function mirrors the exact signature of the real service.
// Returns a Promise so hooks/thunks work identically.
// ─────────────────────────────────────────────────────────────────
import {
  MOCK_AUTH_RESPONSE,
  MOCK_USER,
  MOCK_MENU_CATEGORIES,
  MOCK_ALL_ITEMS,
  MOCK_PLANS,
  MOCK_ACTIVE_SUB,
  MOCK_ACTIVE_ORDER,
  MOCK_ORDER_HISTORY,
  MOCK_WEIGHT_LOGS,
  MOCK_PROGRESS_SUMMARY,
  MOCK_REWARDS_SUMMARY,
  MOCK_TRAINER_PROFILE,
  MOCK_TRAINER_CLIENTS,
  MOCK_ADMIN_ANALYTICS,
  MOCK_WEEKLY_REVENUE,
  MOCK_ADMIN_ORDERS,
  MOCK_ADMIN_USERS,
} from "./mockData";

// ── Helpers ───────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let orderCounter = 1046;
const nextOrderNumber = () => `ORD${orderCounter++}`;

// In-memory state so actions (addToCart, pause, etc.) persist during session
let _activeSub    = { ...MOCK_ACTIVE_SUB };
let _weightLogs   = [...MOCK_WEIGHT_LOGS];
let _adminOrders  = [...MOCK_ADMIN_ORDERS];

// ── AUTH SERVICE ──────────────────────────────────────────────────
export const mockAuthService = {
  sendOtp: async (phone) => {
    await delay(800);
    // Validate phone format
    if (!/^[6-9]\d{9}$/.test(phone)) throw { response:{ data:{ message:"Invalid phone number" } } };
    console.log(`[MOCK] OTP for ${phone}: 123456`);
    return { message:"OTP sent successfully", expiresInMinutes:10 };
  },

  verifyOtp: async (phone, otp) => {
    await delay(1000);
    // Accept any 6-digit code in mock; real OTP is 123456
    if (otp.length !== 6) throw { response:{ data:{ message:"Invalid OTP" } } };
    if (otp !== "123456")  throw { response:{ data:{ message:"Wrong OTP. Use 123456 in mock mode." } } };
    return { ...MOCK_AUTH_RESPONSE, user:{ ...MOCK_USER, phone } };
  },

  refresh: async () => {
    await delay(300);
    return MOCK_AUTH_RESPONSE;
  },

  logout: async () => {
    await delay(200);
    return { success:true };
  },

  updateProfile: async (data) => {
    await delay(500);
    return { ...MOCK_USER, ...data };
  },
};

// ── MENU SERVICE ──────────────────────────────────────────────────
export const mockMenuService = {
  getFullMenu: async () => {
    await delay(600);
    return MOCK_MENU_CATEGORIES;
  },

  getByGoal: async (goal) => {
    await delay(400);
    return MOCK_ALL_ITEMS.filter((i) => i.goalFit?.includes(goal));
  },

  getPopular: async (limit = 10) => {
    await delay(300);
    // Return items sorted by a mock order count (Combos + best sellers first)
    return [...MOCK_ALL_ITEMS]
      .sort((a, b) => (b.tags?.includes("Best Seller") ? 1 : 0) - (a.tags?.includes("Best Seller") ? 1 : 0))
      .slice(0, limit);
  },

  getById: async (id) => {
    await delay(200);
    const item = MOCK_ALL_ITEMS.find((i) => i.id === id);
    if (!item) throw { response:{ data:{ message:"Item not found" } } };
    return item;
  },
};

// ── ORDER SERVICE ─────────────────────────────────────────────────
export const mockOrderService = {
  initiateOrder: async (payload) => {
    await delay(700);
    // Return a fake Razorpay order object
    return {
      razorpayOrderId: `order_mock_${Date.now()}`,
      amount:           payload.items.reduce((s, i) => {
        const item = MOCK_ALL_ITEMS.find((m) => m.id === i.itemId);
        return s + (item?.price || 0) * i.quantity;
      }, 0),
      currency:         "INR",
      keyId:            "rzp_test_mock_key",
      internalOrderId:  `int-ord-${Date.now()}`,
    };
  },

  confirmPayment: async (orderId, paymentData) => {
    await delay(900);
    return _buildPlacedOrder(paymentData._items || [], paymentData._slot, "RAZORPAY");
  },

  placeOrderWithPlan: async (payload) => {
    await delay(800);
    // Deduct one meal from in-memory sub
    if (_activeSub && _activeSub.mealsRemaining > 0) {
      _activeSub = {
        ..._activeSub,
        mealsUsed:      _activeSub.mealsUsed + 1,
        mealsRemaining: _activeSub.mealsRemaining - 1,
      };
    }
    return _buildPlacedOrder(payload.items, payload.pickupSlot, "PLAN");
  },

  getMyOrders: async (page = 0, size = 10) => {
    await delay(500);
    const start = page * size;
    return {
      content:       MOCK_ORDER_HISTORY.slice(start, start + size),
      totalElements: MOCK_ORDER_HISTORY.length,
      totalPages:    Math.ceil(MOCK_ORDER_HISTORY.length / size),
      page, size, last: start + size >= MOCK_ORDER_HISTORY.length,
    };
  },

  getActiveOrder: async () => {
    await delay(400);
    return MOCK_ACTIVE_ORDER;
  },

  getById: async (id) => {
    await delay(300);
    const all = [MOCK_ACTIVE_ORDER, ...MOCK_ORDER_HISTORY];
    return all.find((o) => o.id === id) || null;
  },

  cancelOrder: async (id) => {
    await delay(500);
    return { success:true, message:"Order cancelled" };
  },
};

// Helper to build a placed order response
function _buildPlacedOrder(items, pickupSlot, paymentMethod) {
  const resolvedItems = (items || []).map((i) => {
    const mi = MOCK_ALL_ITEMS.find((m) => m.id === i.itemId);
    return {
      id:         `oi-${Date.now()}-${i.itemId}`,
      itemId:     i.itemId,
      itemName:   mi?.name || "Item",
      quantity:   i.quantity,
      unitPrice:  mi?.price || 0,
      totalPrice: (mi?.price || 0) * i.quantity,
      proteinG:   mi?.proteinG || 0,
      calories:   mi?.calories || 0,
    };
  });

  const total = resolvedItems.reduce((s, i) => s + i.totalPrice, 0);

  return {
    id:            `ord-${Date.now()}`,
    orderNumber:   nextOrderNumber(),
    status:        "PENDING",
    totalAmount:   total,
    finalAmount:   paymentMethod === "PLAN" ? 0 : total,
    discountAmount:paymentMethod === "PLAN" ? total : 0,
    pickupSlot:    pickupSlot || "08:00:00",
    pickupDate:    new Date().toISOString().split("T")[0],
    pointsEarned:  Math.floor(total / 10),
    paymentMethod,
    items:         resolvedItems,
    macroSummary: {
      totalProtein:  resolvedItems.reduce((s, i) => s + (i.proteinG || 0) * i.quantity, 0),
      totalCalories: resolvedItems.reduce((s, i) => s + (i.calories || 0), 0),
    },
    createdAt: new Date().toISOString(),
  };
}

// ── SUBSCRIPTION SERVICE ──────────────────────────────────────────
export const mockSubscriptionService = {
  getPlans: async () => {
    await delay(400);
    return MOCK_PLANS;
  },

  getActiveSub: async () => {
    await delay(400);
    return _activeSub;
  },

  getHistory: async () => {
    await delay(300);
    return [_activeSub];
  },

  create: async ({ planId, period }) => {
    await delay(800);
    const plan  = MOCK_PLANS.find((p) => p.id === planId);
    const isMonthly = period === "MONTHLY";
    _activeSub = {
      id:             `sub-${Date.now()}`,
      planId,
      planName:       plan?.name || planId,
      period,
      status:         "ACTIVE",
      mealsTotal:     isMonthly ? (plan?.monthlyMeals || 40) : (plan?.weeklyMeals || 10),
      mealsUsed:      0,
      mealsRemaining: isMonthly ? (plan?.monthlyMeals || 40) : (plan?.weeklyMeals || 10),
      startDate:      new Date().toISOString().split("T")[0],
      endDate:        isMonthly
        ? new Date(Date.now()+30*86400000).toISOString().split("T")[0]
        : new Date(Date.now()+7*86400000).toISOString().split("T")[0],
      amountPaid:     isMonthly ? (plan?.monthlyPrice || 3499) : (plan?.weeklyPrice || 999),
      autoRenew:      true,
      createdAt:      new Date().toISOString(),
    };
    return _activeSub;
  },

  pause: async (id) => {
    await delay(500);
    _activeSub = { ..._activeSub, status:"PAUSED", pausedAt: new Date().toISOString() };
    return _activeSub;
  },

  resume: async (id) => {
    await delay(500);
    _activeSub = { ..._activeSub, status:"ACTIVE", resumedAt: new Date().toISOString() };
    return _activeSub;
  },
};

// ── PROGRESS SERVICE ──────────────────────────────────────────────
export const mockProgressService = {
  getSummary: async () => {
    await delay(500);
    return { ...MOCK_PROGRESS_SUMMARY, weightHistory: _weightLogs };
  },

  getWeightHistory: async () => {
    await delay(400);
    return _weightLogs;
  },

  logWeight: async ({ weightKg, goal, notes }) => {
    await delay(500);
    const today = new Date().toISOString().split("T")[0];
    if (_weightLogs.find((w) => w.loggedAt === today)) {
      throw { response:{ data:{ message:"Weight already logged for today" } } };
    }
    const entry = {
      id:        `w-${Date.now()}`,
      weightKg:  parseFloat(weightKg),
      goal,
      notes:     notes || null,
      loggedAt:  today,
    };
    _weightLogs = [..._weightLogs, entry];
    return entry;
  },

  getMacros: async () => {
    await delay(300);
    return MOCK_PROGRESS_SUMMARY.weeklyAvgMacros;
  },
};

// ── REWARDS SERVICE ───────────────────────────────────────────────
export const mockRewardsService = {
  getSummary: async () => {
    await delay(400);
    return MOCK_REWARDS_SUMMARY;
  },

  redeem: async (milestoneId) => {
    await delay(600);
    return { success:true, milestoneId, message:"Reward redeemed!" };
  },
};

// ── TRAINER SERVICE ───────────────────────────────────────────────
export const mockTrainerService = {
  getProfile: async () => {
    await delay(400);
    return MOCK_TRAINER_PROFILE;
  },

  getClients: async () => {
    await delay(400);
    return MOCK_TRAINER_CLIENTS;
  },
};

// ── ADMIN SERVICE ─────────────────────────────────────────────────
export const mockAdminService = {
  getTodayOtps: async () => {
    await delay(400);
    const today = new Date().toISOString();
    return [
      { id:"otp-1", phone:"9876543210", name:"Shubham Sharma", otpCode:"123456", used:true,  attempts:1, createdAt:today, expiresAt:today },
      { id:"otp-2", phone:"9876543211", name:"Priya M.",       otpCode:"456789", used:false, attempts:0, createdAt:today, expiresAt:today },
      { id:"otp-3", phone:"9876543212", name:"Raj K.",         otpCode:"789012", used:true,  attempts:1, createdAt:today, expiresAt:today },
      { id:"otp-4", phone:"9876543213", name:null,             otpCode:"234567", used:false, attempts:2, createdAt:today, expiresAt:today },
    ];
  },

  getMenuItems: async () => {
    await delay(500);
    return MOCK_MENU_CATEGORIES;
  },

  getDailyAnalytics: async (date) => {
    await delay(600);
    return MOCK_ADMIN_ANALYTICS;
  },

  getWeeklyRevenue: async () => {
    await delay(500);
    return MOCK_WEEKLY_REVENUE;
  },

  getActiveOrders: async () => {
    await delay(400);
    return _adminOrders;
  },

  updateOrderStatus: async (orderId, status) => {
    await delay(400);
    _adminOrders = _adminOrders.map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    return _adminOrders.find((o) => o.id === orderId);
  },

  getUsers: async (page = 0, size = 20) => {
    await delay(500);
    return MOCK_ADMIN_USERS;
  },

  createMenuItem: async (data) => {
    await delay(600);
    return { ...data, id:`m-new-${Date.now()}`, isAvailable:true, isCombo:false };
  },

  updateMenuItem: async (id, data) => {
    await delay(500);
    return { ...data, id };
  },

  deleteMenuItem: async (id) => {
    await delay(400);
    return { success:true };
  },

  toggleAvailability: async (id) => {
    await delay(300);
    return { success:true };
  },
};
