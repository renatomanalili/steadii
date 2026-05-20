export const colors = {
  // backgrounds
  background: "#0F1320",
  surface: "#161C2E",
  card: "#1E2740",
  borderSubtle: "#1E2740",
  borderDefault: "#2A3554",

  // accent
  accentPrimary: "#4ECCA3",
  accentLight: "#6EE7C7",
  accentMuted: "#1D6E5A",

  // text
  textPrimary: "#FFFFFF",
  textSecondary: "#8B9ABF",
  textTertiary: "#4A5578",
  textOnAccent: "#0F1320",

  // bp status
  statusNormal: "#3DCC7E",
  statusElevated: "#F5A623",
  statusStage1: "#E07B39",
  statusStage2: "#E05757",
  statusCrisis: "#CC2936",
} as const;

export const fonts = {
  light: "DMSans_300Light",
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semibold: "DMSans_600SemiBold",
  bold: "DMSans_700Bold",
} as const;

export const typography = {
  hero:  { fontSize: 72, fontFamily: fonts.light },
  title: { fontSize: 22, fontFamily: fonts.semibold },
  body:  { fontSize: 15, fontFamily: fonts.regular },
  label: { fontSize: 13, fontFamily: fonts.medium },
  small: { fontSize: 12, fontFamily: fonts.regular },
  tiny:  { fontSize: 11, fontFamily: fonts.medium },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;
