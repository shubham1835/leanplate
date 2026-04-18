// Tests that verify all mock services return correct shape and data
import {
  mockAuthService,
  mockMenuService,
  mockOrderService,
  mockSubscriptionService,
  mockProgressService,
  mockRewardsService,
  mockTrainerService,
  mockAdminService,
} from "../mockServices";

describe("mockAuthService", () => {
  it("sendOtp resolves for valid phone", async () => {
    const res = await mockAuthService.sendOtp("9876543210");
    expect(res.message).toBe("OTP sent successfully");
    expect(res.expiresInMinutes).toBe(10);
  });

  it("sendOtp rejects for invalid phone", async () => {
    await expect(mockAuthService.sendOtp("12345")).rejects.toBeDefined();
  });

  it("verifyOtp succeeds with code 123456", async () => {
    const res = await mockAuthService.verifyOtp("9876543210", "123456");
    expect(res.accessToken).toBeDefined();
    expect(res.user.phone).toBe("9876543210");
  });

  it("verifyOtp fails with wrong code", async () => {
    await expect(mockAuthService.verifyOtp("9876543210", "000000")).rejects.toBeDefined();
  });
});

describe("mockMenuService", () => {
  it("getFullMenu returns 5 categories", async () => {
    const cats = await mockMenuService.getFullMenu();
    expect(cats).toHaveLength(5);
    expect(cats[0]).toHaveProperty("category");
    expect(cats[0]).toHaveProperty("items");
  });

  it("getByGoal filters correctly for FAT_LOSS", async () => {
    const items = await mockMenuService.getByGoal("FAT_LOSS");
    expect(items.length).toBeGreaterThan(0);
    items.forEach((i) => expect(i.goalFit).toContain("FAT_LOSS"));
  });

  it("getByGoal filters correctly for MUSCLE_GAIN", async () => {
    const items = await mockMenuService.getByGoal("MUSCLE_GAIN");
    items.forEach((i) => expect(i.goalFit).toContain("MUSCLE_GAIN"));
  });

  it("getPopular returns at most limit items", async () => {
    const items = await mockMenuService.getPopular(5);
    expect(items.length).toBeLessThanOrEqual(5);
  });

  it("getById returns correct item", async () => {
    const item = await mockMenuService.getById("m-01");
    expect(item.name).toBe("Green Detox Flush");
  });

  it("getById throws for unknown id", async () => {
    await expect(mockMenuService.getById("m-999")).rejects.toBeDefined();
  });
});

describe("mockOrderService", () => {
  const items = [{ itemId:"m-07", quantity:1 }, { itemId:"m-01", quantity:1 }];

  it("placeOrderWithPlan returns a valid order", async () => {
    const order = await mockOrderService.placeOrderWithPlan({
      items,
      pickupSlot: "08:00:00",
      pickupDate: "2024-04-10",
    });
    expect(order.orderNumber).toMatch(/^ORD\d+/);
    expect(order.status).toBe("PENDING");
    expect(order.paymentMethod).toBe("PLAN");
    expect(order.items).toHaveLength(2);
  });

  it("getMyOrders returns paginated history", async () => {
    const res = await mockOrderService.getMyOrders(0, 10);
    expect(res).toHaveProperty("content");
    expect(res).toHaveProperty("totalElements");
    expect(Array.isArray(res.content)).toBe(true);
  });

  it("getActiveOrder returns the active order", async () => {
    const order = await mockOrderService.getActiveOrder();
    expect(order.orderNumber).toBe("ORD1043");
    expect(order.status).toBe("PREPARING");
  });
});

describe("mockSubscriptionService", () => {
  it("getPlans returns 3 plans", async () => {
    const plans = await mockSubscriptionService.getPlans();
    expect(plans).toHaveLength(3);
    const ids = plans.map((p) => p.id);
    expect(ids).toContain("lifestyle");
    expect(ids).toContain("starter");
    expect(ids).toContain("transform");
  });

  it("getActiveSub returns current subscription", async () => {
    const sub = await mockSubscriptionService.getActiveSub();
    expect(sub.planId).toBe("transform");
    expect(sub.status).toBe("ACTIVE");
    expect(sub.mealsRemaining).toBeGreaterThan(0);
  });

  it("pause changes status to PAUSED", async () => {
    const sub = await mockSubscriptionService.pause("sub-001");
    expect(sub.status).toBe("PAUSED");
  });

  it("resume changes status back to ACTIVE", async () => {
    const sub = await mockSubscriptionService.resume("sub-001");
    expect(sub.status).toBe("ACTIVE");
  });

  it("create generates a new subscription", async () => {
    const sub = await mockSubscriptionService.create({ planId:"starter", period:"WEEKLY" });
    expect(sub.planId).toBe("starter");
    expect(sub.period).toBe("WEEKLY");
    expect(sub.status).toBe("ACTIVE");
  });
});

describe("mockProgressService", () => {
  it("getWeightHistory returns array of logs", async () => {
    const logs = await mockProgressService.getWeightHistory();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("weightKg");
    expect(logs[0]).toHaveProperty("loggedAt");
  });

  it("logWeight adds a new entry", async () => {
    const before = (await mockProgressService.getWeightHistory()).length;
    const entry  = await mockProgressService.logWeight({ weightKg: 77.5, goal:"FAT_LOSS" });
    expect(entry.weightKg).toBe(77.5);
    const after  = (await mockProgressService.getWeightHistory()).length;
    expect(after).toBe(before + 1);
  });
});

describe("mockRewardsService", () => {
  it("getSummary returns points and milestones", async () => {
    const summary = await mockRewardsService.getSummary();
    expect(summary.totalPoints).toBe(340);
    expect(summary.milestones).toHaveLength(4);
  });
});

describe("mockTrainerService", () => {
  it("getProfile returns trainer with referral code", async () => {
    const profile = await mockTrainerService.getProfile();
    expect(profile.referralCode).toBe("TRN-2847");
    expect(profile.totalReferrals).toBe(23);
  });

  it("getClients returns array of clients", async () => {
    const clients = await mockTrainerService.getClients();
    expect(clients.length).toBeGreaterThan(0);
    expect(clients[0]).toHaveProperty("userName");
    expect(clients[0]).toHaveProperty("commissionEarned");
  });
});

describe("mockAdminService", () => {
  it("getDailyAnalytics returns order + revenue data", async () => {
    const data = await mockAdminService.getDailyAnalytics();
    expect(data.totalOrders).toBe(34);
    expect(data.topItems.length).toBeGreaterThan(0);
  });

  it("getWeeklyRevenue returns 7 days", async () => {
    const data = await mockAdminService.getWeeklyRevenue();
    expect(data.days).toHaveLength(7);
    expect(data.weekTotal).toBeGreaterThan(0);
  });

  it("updateOrderStatus mutates in-memory state", async () => {
    const updated = await mockAdminService.updateOrderStatus("ao-2", "PREPARING");
    expect(updated.status).toBe("PREPARING");
  });
});
