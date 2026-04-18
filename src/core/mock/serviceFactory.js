// src/core/mock/serviceFactory.js
// No top-level await — uses conditional static imports instead.

import realAuthService         from "@core/services/authService";
import realMenuService         from "@core/services/menuService";
import realOrderService        from "@core/services/orderService";
import realSubscriptionService from "@core/services/subscriptionService";
import realProgressService     from "@core/services/progressService";
import {
  rewardsService as realRewardsService,
  trainerService as realTrainerService,
  adminService   as realAdminService,
} from "@core/services/otherServices";

import {
  mockAuthService,
  mockMenuService,
  mockOrderService,
  mockSubscriptionService,
  mockProgressService,
  mockRewardsService,
  mockTrainerService,
  mockAdminService,
} from "./mockServices";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

if (import.meta.env.DEV) {
  console.info(
    USE_MOCK
      ? "%c[FitFuel] 🧪 MOCK MODE — local data"
      : "%c[FitFuel] 🌐 REAL API — " + import.meta.env.VITE_API_URL,
    "background:#052e16;color:#4ade80;padding:4px 10px;border-radius:4px;font-weight:700;"
  );
}

export const authService         = USE_MOCK ? mockAuthService         : realAuthService;
export const menuService         = USE_MOCK ? mockMenuService         : realMenuService;
export const orderService        = USE_MOCK ? mockOrderService        : realOrderService;
export const subscriptionService = USE_MOCK ? mockSubscriptionService : realSubscriptionService;
export const progressService     = USE_MOCK ? mockProgressService     : realProgressService;
export const rewardsService      = USE_MOCK ? mockRewardsService      : realRewardsService;
export const trainerService      = USE_MOCK ? mockTrainerService      : realTrainerService;
export const adminService        = USE_MOCK ? mockAdminService        : realAdminService;

export { USE_MOCK };
