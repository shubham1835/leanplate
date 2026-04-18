/**
 * SCREEN_NAMES — single source of truth for all route paths.
 * Never use raw string literals for navigation anywhere else.
 */
export const SCREEN_NAMES = {
  // Auth
  LOGIN:            "/auth/login",
  OTP_VERIFY:       "/auth/verify",

  // Goal selection (onboarding gate)
  GOAL_SELECTION:   "/goal",

  // Main app — HOME and MENU are public (guest access)
  HOME:             "/",
  MENU:             "/menu",

  // Protected — require login
  CHECKOUT:         "/checkout",
  ORDERS:           "/orders",
  PROGRESS:         "/progress",
  PLANS:            "/plans",
  PROFILE:          "/profile",

  // Admin
  ADMIN:            "/admin",
};
