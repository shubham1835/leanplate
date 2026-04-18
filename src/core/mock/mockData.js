// src/core/mock/mockData.js
// ─────────────────────────────────────────────────────────────────
// Complete mock dataset for Fit Fuel Diet Café
// Used by all mock service handlers when USE_MOCK=true
// ─────────────────────────────────────────────────────────────────

// ── AUTH ──────────────────────────────────────────────────────────
export const MOCK_USER = {
  id:           "usr-001",
  phone:        "9876543210",
  name:         "Shubham Sharma",
  email:        "shubham@fitfuel.in",
  goal:         "FAT_LOSS",
  rewardPoints: 340,
  streakCount:  5,
  streakLast:   new Date().toISOString().split("T")[0],
  role:         "USER",
  createdAt:    "2024-01-10T08:00:00Z",
};

export const MOCK_AUTH_RESPONSE = {
  accessToken:          "mock.jwt.access.token",
  refreshToken:         "mock.jwt.refresh.token",
  accessTokenExpiresIn: 86400000,
  user:                 MOCK_USER,
};

// ── MENU ──────────────────────────────────────────────────────────
export const MOCK_MENU_CATEGORIES = [
  {
    category:    "HYDRATION_DETOX",
    displayName: "Hydration & Detox",
    icon:        "💧",
    items: [
      { id:"m-01", name:"Green Detox Flush",        price:80,  proteinG:2,  carbsG:12, fatG:0,  calories:56,  tags:["Detox","Vegan"],           goalFit:["FAT_LOSS","MAINTENANCE"],                emoji:"🥒", isAvailable:true, isCombo:false },
      { id:"m-02", name:"Coconut Electrolyte Water", price:60,  proteinG:0,  carbsG:9,  fatG:1,  calories:45,  tags:["Hydration"],               goalFit:["FAT_LOSS","MUSCLE_GAIN","MAINTENANCE"],  emoji:"🥥", isAvailable:true, isCombo:false },
      { id:"m-03", name:"Lemon Ginger Detox Shot",   price:50,  proteinG:0,  carbsG:5,  fatG:0,  calories:20,  tags:["Best Seller","Detox"],      goalFit:["FAT_LOSS"],                              emoji:"🍋", isAvailable:true, isCombo:false },
      { id:"m-04", name:"Watermelon Mint Cooler",    price:90,  proteinG:1,  carbsG:18, fatG:0,  calories:76,  tags:["Refreshing"],              goalFit:["MAINTENANCE","FAT_LOSS"],                emoji:"🍉", isAvailable:true, isCombo:false },
      { id:"m-05", name:"Beetroot Immunity Booster", price:100, proteinG:2,  carbsG:14, fatG:0,  calories:64,  tags:["Immunity"],                goalFit:["MAINTENANCE","FAT_LOSS"],                emoji:"❤️", isAvailable:true, isCombo:false },
    ],
  },
  {
    category:    "HIGH_PROTEIN_EGGS",
    displayName: "High Protein Eggs",
    icon:        "🍳",
    items: [
      { id:"m-06", name:"3-Egg Masala Omelette",      price:110, proteinG:18, carbsG:4,  fatG:12, calories:196, tags:["High Protein","Best Seller"], goalFit:["MUSCLE_GAIN","MAINTENANCE"],            emoji:"🍳", isAvailable:true, isCombo:false },
      { id:"m-07", name:"Egg White Bhurji (5 whites)",price:100, proteinG:17, carbsG:3,  fatG:1,  calories:89,  tags:["High Protein","Fat Loss Pick"],goalFit:["FAT_LOSS"],                            emoji:"🥚", isAvailable:true, isCombo:false },
      { id:"m-08", name:"Boiled Egg Plate (4 eggs)",  price:80,  proteinG:24, carbsG:2,  fatG:18, calories:258, tags:["High Protein"],              goalFit:["MUSCLE_GAIN"],                          emoji:"🥚", isAvailable:true, isCombo:false },
      { id:"m-09", name:"Egg White Veggie Wrap",      price:130, proteinG:20, carbsG:22, fatG:3,  calories:195, tags:["Balanced"],                  goalFit:["FAT_LOSS","MAINTENANCE"],               emoji:"🌯", isAvailable:true, isCombo:false },
      { id:"m-10", name:"Spinach Egg Muffin (2 pcs)", price:120, proteinG:16, carbsG:6,  fatG:9,  calories:173, tags:["Meal Prep"],                 goalFit:["FAT_LOSS","MAINTENANCE"],               emoji:"🧁", isAvailable:true, isCombo:false },
    ],
  },
  {
    category:    "SANDWICHES",
    displayName: "Sandwiches",
    icon:        "🥪",
    items: [
      { id:"m-11", name:"Grilled Chicken Breast",   price:150, proteinG:28, carbsG:30, fatG:5,  calories:277, tags:["Best Seller","High Protein"], goalFit:["MUSCLE_GAIN","MAINTENANCE"],  emoji:"🥪", isAvailable:true, isCombo:false },
      { id:"m-12", name:"Paneer Tikka Sandwich",    price:130, proteinG:18, carbsG:32, fatG:8,  calories:276, tags:["Veg"],                        goalFit:["MUSCLE_GAIN","MAINTENANCE"],  emoji:"🧀", isAvailable:true, isCombo:false },
      { id:"m-13", name:"Tuna & Cucumber Sandwich", price:160, proteinG:26, carbsG:28, fatG:4,  calories:252, tags:["High Protein"],               goalFit:["FAT_LOSS","MUSCLE_GAIN"],     emoji:"🐟", isAvailable:true, isCombo:false },
      { id:"m-14", name:"Avocado Egg Multigrain",   price:140, proteinG:14, carbsG:24, fatG:10, calories:238, tags:["Healthy Fats"],               goalFit:["FAT_LOSS","MAINTENANCE"],     emoji:"🥑", isAvailable:true, isCombo:false },
      { id:"m-15", name:"Turkey Whole Wheat Club",  price:170, proteinG:30, carbsG:34, fatG:6,  calories:310, tags:["High Protein"],               goalFit:["MUSCLE_GAIN"],               emoji:"🦃", isAvailable:true, isCombo:false },
    ],
  },
  {
    category:    "PEANUT_BUTTER",
    displayName: "Peanut Butter Specials",
    icon:        "🥜",
    items: [
      { id:"m-16", name:"PB Banana Protein Shake",    price:120, proteinG:22, carbsG:28, fatG:10, calories:290, tags:["Best Seller","Pre-Workout"], goalFit:["MUSCLE_GAIN"],                emoji:"🥤", isAvailable:true, isCombo:false },
      { id:"m-17", name:"PB Multigrain Toast",        price:90,  proteinG:12, carbsG:26, fatG:12, calories:252, tags:["Pre-Workout"],               goalFit:["MUSCLE_GAIN","MAINTENANCE"],  emoji:"🍞", isAvailable:true, isCombo:false },
      { id:"m-18", name:"PB Oat Energy Ball (3 pcs)", price:100, proteinG:10, carbsG:30, fatG:14, calories:286, tags:["Energy Boost"],              goalFit:["MUSCLE_GAIN"],               emoji:"⚽", isAvailable:true, isCombo:false },
      { id:"m-19", name:"Low-Cal PB Rice Cake",       price:80,  proteinG:8,  carbsG:18, fatG:8,  calories:176, tags:["Low Cal"],                   goalFit:["FAT_LOSS"],                  emoji:"🫓", isAvailable:true, isCombo:false },
      { id:"m-20", name:"PB Overnight Oats",          price:110, proteinG:14, carbsG:38, fatG:12, calories:316, tags:["Meal Prep"],                 goalFit:["MUSCLE_GAIN","MAINTENANCE"],  emoji:"🥣", isAvailable:true, isCombo:false },
    ],
  },
  {
    category:    "COMBOS",
    displayName: "Combos",
    icon:        "🍱",
    items: [
      { id:"m-21", name:"Fat Loss Kickstart Combo",    price:220, proteinG:35, carbsG:20, fatG:8,  calories:292, tags:["Fat Loss","Best Value"],      goalFit:["FAT_LOSS"],                  emoji:"🔥", isAvailable:true, isCombo:true, comboDesc:"Egg White Bhurji + Detox Shot + Detox Flush" },
      { id:"m-22", name:"Muscle Gain Power Combo",     price:280, proteinG:48, carbsG:55, fatG:14, calories:542, tags:["Muscle Gain","High Protein"],  goalFit:["MUSCLE_GAIN"],               emoji:"💪", isAvailable:true, isCombo:true, comboDesc:"3-Egg Omelette + PB Banana Shake + Boiled Eggs" },
      { id:"m-23", name:"Pre-Workout Fuel Combo",      price:200, proteinG:24, carbsG:48, fatG:12, calories:396, tags:["Pre-Workout","Energy"],        goalFit:["MUSCLE_GAIN","MAINTENANCE"],  emoji:"⚡", isAvailable:true, isCombo:true, comboDesc:"PB Toast + Coconut Water + Energy Balls" },
      { id:"m-24", name:"Maintenance Balance Combo",   price:240, proteinG:30, carbsG:40, fatG:10, calories:370, tags:["Balanced"],                   goalFit:["MAINTENANCE"],               emoji:"⚖️", isAvailable:true, isCombo:true, comboDesc:"Chicken Sandwich + Watermelon Cooler + Detox Shot" },
      { id:"m-25", name:"Post-Workout Recovery Combo", price:260, proteinG:42, carbsG:45, fatG:8,  calories:428, tags:["Recovery","High Protein"],     goalFit:["MUSCLE_GAIN","FAT_LOSS"],    emoji:"🏋️", isAvailable:true, isCombo:true, comboDesc:"Tuna Sandwich + PB Shake + Electrolyte Water" },
    ],
  },
];

// Flat item list (used by checkout upsell, goal filtering, etc.)
export const MOCK_ALL_ITEMS = MOCK_MENU_CATEGORIES.flatMap((c) => c.items);

// ── SUBSCRIPTIONS ─────────────────────────────────────────────────
export const MOCK_PLANS = [
  {
    id:"lifestyle", name:"Lifestyle", tagline:"Flexible & easy",
    weeklyPrice:999, monthlyPrice:3499,
    weeklyMeals:10,  monthlyMeals:40,
    features:["1 meal/day","Goal-based recs","Pause anytime","Progress tracking"],
    popular:false,
  },
  {
    id:"starter", name:"Starter Fitness", tagline:"Build the habit",
    weeklyPrice:1499, monthlyPrice:4999,
    weeklyMeals:14,   monthlyMeals:56,
    features:["2 meals/day","Macro tracking","WhatsApp support","Trainer integration","Priority pickup"],
    popular:false,
  },
  {
    id:"transform", name:"Transformation", tagline:"Maximum results",
    weeklyPrice:2199, monthlyPrice:7499,
    weeklyMeals:21,   monthlyMeals:84,
    features:["3 meals/day","Custom macro targets","Weekly nutritionist call","Referral bonus 2x","VIP pickup lane","Body composition tracking"],
    popular:true,
  },
];

export const MOCK_ACTIVE_SUB = {
  id:             "sub-001",
  planId:         "transform",
  planName:       "Transformation",
  period:         "MONTHLY",
  status:         "ACTIVE",
  mealsTotal:     40,
  mealsUsed:      12,
  mealsRemaining: 28,
  startDate:      "2024-04-01",
  endDate:        "2024-04-30",
  amountPaid:     7499,
  autoRenew:      true,
  createdAt:      "2024-04-01T08:00:00Z",
};

// ── ORDERS ────────────────────────────────────────────────────────
export const MOCK_ACTIVE_ORDER = {
  id:          "ord-active-001",
  orderNumber: "ORD1043",
  status:      "PREPARING",
  totalAmount: 180,
  finalAmount: 180,
  pickupSlot:  "08:00:00",
  pickupDate:  new Date().toISOString().split("T")[0],
  pointsEarned:18,
  items: [
    { id:"oi-1", itemId:"m-07", itemName:"Egg White Bhurji (5 whites)", quantity:1, unitPrice:100, totalPrice:100, proteinG:17, calories:89 },
    { id:"oi-2", itemId:"m-01", itemName:"Green Detox Flush",            quantity:1, unitPrice:80,  totalPrice:80,  proteinG:2,  calories:56 },
  ],
  macroSummary:{ totalProtein:19, totalCarbs:15, totalFat:1, totalCalories:145 },
  createdAt:   new Date().toISOString(),
};

export const MOCK_ORDER_HISTORY = [
  {
    id:"ord-002", orderNumber:"ORD1042", status:"COLLECTED",
    totalAmount:180, finalAmount:180,
    pickupSlot:"08:02:00", pickupDate: new Date(Date.now()-86400000).toISOString().split("T")[0],
    pointsEarned:18, createdAt: new Date(Date.now()-86400000).toISOString(),
    items:[
      { id:"oi-3", itemId:"m-07", itemName:"Egg White Bhurji", quantity:1, unitPrice:100, totalPrice:100, proteinG:17, calories:89 },
      { id:"oi-4", itemId:"m-01", itemName:"Green Detox Flush", quantity:1, unitPrice:80,  totalPrice:80,  proteinG:2,  calories:56 },
    ],
    macroSummary:{ totalProtein:19, totalCalories:145 },
  },
  {
    id:"ord-003", orderNumber:"ORD1035", status:"COLLECTED",
    totalAmount:220, finalAmount:220,
    pickupSlot:"09:15:00", pickupDate: new Date(Date.now()-172800000).toISOString().split("T")[0],
    pointsEarned:22, createdAt: new Date(Date.now()-172800000).toISOString(),
    items:[{ id:"oi-5", itemId:"m-21", itemName:"Fat Loss Kickstart Combo", quantity:1, unitPrice:220, totalPrice:220, proteinG:35, calories:292 }],
    macroSummary:{ totalProtein:35, totalCalories:292 },
  },
  {
    id:"ord-004", orderNumber:"ORD1028", status:"COLLECTED",
    totalAmount:170, finalAmount:170,
    pickupSlot:"08:30:00", pickupDate: new Date(Date.now()-259200000).toISOString().split("T")[0],
    pointsEarned:17, createdAt: new Date(Date.now()-259200000).toISOString(),
    items:[
      { id:"oi-6", itemId:"m-06", itemName:"3-Egg Masala Omelette",      quantity:1, unitPrice:110, totalPrice:110, proteinG:18, calories:196 },
      { id:"oi-7", itemId:"m-02", itemName:"Coconut Electrolyte Water",  quantity:1, unitPrice:60,  totalPrice:60,  proteinG:0,  calories:45  },
    ],
    macroSummary:{ totalProtein:18, totalCalories:241 },
  },
  {
    id:"ord-005", orderNumber:"ORD1019", status:"COLLECTED",
    totalAmount:200, finalAmount:200,
    pickupSlot:"07:45:00", pickupDate: new Date(Date.now()-345600000).toISOString().split("T")[0],
    pointsEarned:20, createdAt: new Date(Date.now()-345600000).toISOString(),
    items:[
      { id:"oi-8", itemId:"m-16", itemName:"PB Banana Protein Shake",   quantity:1, unitPrice:120, totalPrice:120, proteinG:22, calories:290 },
      { id:"oi-9", itemId:"m-08", itemName:"Boiled Egg Plate (4 eggs)", quantity:1, unitPrice:80,  totalPrice:80,  proteinG:24, calories:258 },
    ],
    macroSummary:{ totalProtein:46, totalCalories:548 },
  },
];

// ── PROGRESS ──────────────────────────────────────────────────────
export const MOCK_WEIGHT_LOGS = [
  { id:"w-1", weightKg:82.0, goal:"FAT_LOSS", loggedAt:"2024-03-01" },
  { id:"w-2", weightKg:81.2, goal:"FAT_LOSS", loggedAt:"2024-03-08" },
  { id:"w-3", weightKg:80.5, goal:"FAT_LOSS", loggedAt:"2024-03-15" },
  { id:"w-4", weightKg:79.8, goal:"FAT_LOSS", loggedAt:"2024-03-22" },
  { id:"w-5", weightKg:79.1, goal:"FAT_LOSS", loggedAt:"2024-03-29" },
  { id:"w-6", weightKg:78.4, goal:"FAT_LOSS", loggedAt:"2024-04-05" },
  { id:"w-7", weightKg:78.0, goal:"FAT_LOSS", loggedAt:"2024-04-08" },
];

export const MOCK_PROGRESS_SUMMARY = {
  startWeight:   82.0,
  currentWeight: 78.0,
  weightChange:  -4.0,
  totalOrders:   47,
  weeklyOrders:  5,
  streakCount:   5,
  weightHistory: MOCK_WEIGHT_LOGS,
  weeklyAvgMacros:{ totalProtein:98, totalCarbs:140, totalFat:38, totalCalories:1380 },
};

// ── REWARDS ───────────────────────────────────────────────────────
export const MOCK_REWARDS_SUMMARY = {
  totalPoints: 340,
  streakCount: 5,
  history: [
    { points:18,  reason:"Order ORD1043", createdAt: new Date().toISOString() },
    { points:22,  reason:"Order ORD1042", createdAt: new Date(Date.now()-86400000).toISOString() },
    { points:50,  reason:"5-day streak bonus!", createdAt: new Date(Date.now()-86400000).toISOString() },
    { points:17,  reason:"Order ORD1035", createdAt: new Date(Date.now()-172800000).toISOString() },
  ],
  milestones: [
    { id:"detox_shot",    reward:"Free Detox Shot",          icon:"🥤", requiredPoints:200,  achieved:true,  claimed:true  },
    { id:"free_meal",     reward:"Free Meal (up to ₹150)",   icon:"🍳", requiredPoints:500,  achieved:false, claimed:false },
    { id:"plan_discount", reward:"20% Off Monthly Plan",     icon:"🎁", requiredPoints:1000, achieved:false, claimed:false },
    { id:"free_week",     reward:"Free Transformation Week", icon:"🏋️", requiredPoints:2000, achieved:false, claimed:false },
  ],
};

// ── TRAINER ───────────────────────────────────────────────────────
export const MOCK_TRAINER_PROFILE = {
  id:             "trn-001",
  name:           "Shubham Sharma",
  referralCode:   "TRN-2847",
  totalReferrals: 23,
  totalEarned:    1150,
  pendingPayout:  200,
};

export const MOCK_TRAINER_CLIENTS = [
  { userId:"u-1", userName:"Raj S.",    phone:"9876543211", orderCount:3, totalSpend:450,  commissionEarned:150 },
  { userId:"u-2", userName:"Priya M.", phone:"9876543212", orderCount:7, totalSpend:1050, commissionEarned:350 },
  { userId:"u-3", userName:"Amit K.",  phone:"9876543213", orderCount:2, totalSpend:300,  commissionEarned:100 },
  { userId:"u-4", userName:"Sneha P.", phone:"9876543214", orderCount:5, totalSpend:750,  commissionEarned:250 },
  { userId:"u-5", userName:"Vikram D.",phone:"9876543215", orderCount:6, totalSpend:900,  commissionEarned:300 },
];

// ── ADMIN ─────────────────────────────────────────────────────────
export const MOCK_ADMIN_ANALYTICS = {
  date:                new Date().toISOString().split("T")[0],
  totalOrders:         34,
  totalRevenue:        6840,
  activeSubscriptions: 89,
  newUsers:            7,
  topItems: [
    { itemName:"Egg White Bhurji",    orderCount:14, revenue:1400 },
    { itemName:"Fat Loss Combo",      orderCount:11, revenue:2420 },
    { itemName:"PB Protein Shake",    orderCount:9,  revenue:1080 },
    { itemName:"Grilled Chicken",     orderCount:8,  revenue:1200 },
    { itemName:"3-Egg Omelette",      orderCount:6,  revenue:660  },
  ],
};

export const MOCK_WEEKLY_REVENUE = {
  weekTotal: 41280,
  days: [
    { date:"2024-04-01", dayLabel:"M", revenue:5800, orders:29 },
    { date:"2024-04-02", dayLabel:"T", revenue:7200, orders:36 },
    { date:"2024-04-03", dayLabel:"W", revenue:6100, orders:30 },
    { date:"2024-04-04", dayLabel:"T", revenue:8400, orders:42 },
    { date:"2024-04-05", dayLabel:"F", revenue:9200, orders:46 },
    { date:"2024-04-06", dayLabel:"S", revenue:4580, orders:23 },
    { date:"2024-04-07", dayLabel:"S", revenue:0,    orders:0  },
  ],
};

export const MOCK_ADMIN_ORDERS = [
  {
    id:"ao-1", orderNumber:"ORD1043", status:"PREPARING",
    user:{ name:"Shubham S.", phone:"9876543210" },
    items:[{ itemName:"Egg White Bhurji + Detox Flush" }],
    finalAmount:180, pickupSlot:"08:00:00",
    createdAt: new Date().toISOString(),
  },
  {
    id:"ao-2", orderNumber:"ORD1044", status:"PENDING",
    user:{ name:"Priya M.", phone:"9876543211" },
    items:[{ itemName:"Muscle Gain Power Combo" }],
    finalAmount:280, pickupSlot:"08:30:00",
    createdAt: new Date().toISOString(),
  },
  {
    id:"ao-3", orderNumber:"ORD1045", status:"READY",
    user:{ name:"Raj K.", phone:"9876543212" },
    items:[{ itemName:"PB Banana Protein Shake" }],
    finalAmount:120, pickupSlot:"09:00:00",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_ADMIN_USERS = {
  content: [
    { id:"u-1", name:"Shubham S.",  phone:"9876543210", goal:"FAT_LOSS",    rewardPoints:340, role:"USER", createdAt:"2024-01-10T08:00:00Z" },
    { id:"u-2", name:"Priya M.",    phone:"9876543211", goal:"MAINTENANCE",  rewardPoints:120, role:"USER", createdAt:"2024-01-15T08:00:00Z" },
    { id:"u-3", name:"Raj K.",      phone:"9876543212", goal:"MUSCLE_GAIN",  rewardPoints:210, role:"USER", createdAt:"2024-01-20T08:00:00Z" },
    { id:"u-4", name:"Sneha P.",    phone:"9876543213", goal:"FAT_LOSS",    rewardPoints:95,  role:"USER", createdAt:"2024-02-01T08:00:00Z" },
    { id:"u-5", name:"Vikram D.",   phone:"9876543214", goal:"MUSCLE_GAIN",  rewardPoints:480, role:"USER", createdAt:"2024-02-05T08:00:00Z" },
  ],
  totalElements:312, totalPages:16, page:0, size:20, last:false,
};
