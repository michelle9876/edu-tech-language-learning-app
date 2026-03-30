export const theme = {
  colors: {
    background: "#F7EDE2",
    surface: "#FFF9F2",
    surfaceStrong: "#FFE8CF",
    ink: "#112D4E",
    inkMuted: "#5F6C7B",
    accent: "#0F766E",
    accentSoft: "#C7F0E9",
    coral: "#F97360",
    gold: "#F0B429",
    lavender: "#B8C0FF",
    border: "#E6D7C8",
    success: "#2F9E44",
    danger: "#C92A2A",
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 26,
    pill: 999,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    display: "Manrope_700Bold",
    heading: "Manrope_600SemiBold",
    body: "NotoSansKR_400Regular",
    bodyBold: "NotoSansKR_700Bold",
  },
  shadow: {
    card: {
      shadowColor: "#112D4E",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
  },
} as const;

