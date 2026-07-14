import { Easing } from "remotion";

// Curvas do PEDRA MOTION OS → 03_Motion_Design/02_Easing_e_Springs
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out, elegante
  outSoft: Easing.bezier(0.25, 1, 0.5, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const SPRING = {
  settle: { damping: 18, mass: 0.9, stiffness: 120 },
  reveal: { damping: 15, mass: 1, stiffness: 90 },
  pop: { damping: 12, mass: 0.6, stiffness: 200 },
} as const;
