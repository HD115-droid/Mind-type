import { Platform } from "react-native";

const accentPrimary = "#8B5CF6";
const accentLight = "#A78BFA";
const accentGlow = "rgba(139, 92, 246, 0.4)";

export const Colors = {
  light: {
    text: "#FFFFFF",
    textSecondary: "#98989D",
    textTertiary: "#636366",
    buttonText: "#FFFFFF",
    tabIconDefault: "#98989D",
    tabIconSelected: accentPrimary,
    link: accentPrimary,
    backgroundRoot: "#000000",
    backgroundDefault: "#0A0A0F",
    backgroundSecondary: "#1C1C1E",
    backgroundTertiary: "#2C2C2E",
    backgroundElevated: "#1C1C1E",
    border: "rgba(255,255,255,0.08)",
    separator: "rgba(255,255,255,0.08)",
    disabled: "#3A3A3C",
    neonRed: accentPrimary,
    neonRedGlow: accentGlow,
    accent: accentPrimary,
    accentLight: accentLight,
    accentGlow: accentGlow,
    success: "#30D158",
    error: "#FF453A",
    warning: "#FFD60A",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#98989D",
    textTertiary: "#636366",
    buttonText: "#FFFFFF",
    tabIconDefault: "#98989D",
    tabIconSelected: accentPrimary,
    link: accentPrimary,
    backgroundRoot: "#000000",
    backgroundDefault: "#0A0A0F",
    backgroundSecondary: "#1C1C1E",
    backgroundTertiary: "#2C2C2E",
    backgroundElevated: "#1C1C1E",
    border: "rgba(255,255,255,0.08)",
    separator: "rgba(255,255,255,0.08)",
    disabled: "#3A3A3C",
    neonRed: accentPrimary,
    neonRedGlow: accentGlow,
    accent: accentPrimary,
    accentLight: accentLight,
    accentGlow: accentGlow,
    success: "#30D158",
    error: "#FF453A",
    warning: "#FFD60A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  inputHeight: 50,
  buttonHeight: 50,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    letterSpacing: 0.36,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700" as const,
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600" as const,
    letterSpacing: 0.38,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600" as const,
    letterSpacing: -0.41,
  },
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400" as const,
    letterSpacing: -0.41,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "400" as const,
    letterSpacing: -0.32,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
    letterSpacing: -0.24,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: -0.08,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "400" as const,
    letterSpacing: 0.07,
  },
  h1: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600" as const,
  },
  small: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  small: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  neonGlow: {
    shadowColor: accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  neonGlowSmall: {
    shadowColor: accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGlow: {
    shadowColor: accentPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  purpleGlow: {
    shadowColor: accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Georgia",
    rounded: "SF Pro Rounded",
    mono: "Menlo",
  },
  default: {
    sans: "System",
    serif: "serif",
    rounded: "System",
    mono: "monospace",
  },
  web: {
    sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

export const Gradients = {
  primary: ['#8B5CF6', '#A78BFA'] as const,
  primaryDark: ['#7C3AED', '#8B5CF6'] as const,
  surface: ['rgba(28, 28, 30, 0.9)', 'rgba(28, 28, 30, 0.7)'] as const,
  background: ['#000000', '#0A0A0F'] as const,
};
