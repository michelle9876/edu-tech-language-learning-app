import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "ghost";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
};

export const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}: PrimaryButtonProps) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.base,
      styles[variant],
      disabled && styles.disabled,
      pressed && !disabled && styles.pressed,
    ]}
  >
    <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  primary: {
    backgroundColor: theme.colors.accent,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  label: {
    color: "white",
    fontFamily: theme.typography.heading,
    fontSize: 16,
  },
  ghostLabel: {
    color: theme.colors.ink,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});

