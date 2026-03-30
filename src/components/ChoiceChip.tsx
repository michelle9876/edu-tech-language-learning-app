import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/constants/theme";

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const ChoiceChip = ({ label, selected, onPress }: ChoiceChipProps) => (
  <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
    <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
  },
  selected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft,
  },
  label: {
    color: theme.colors.ink,
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  selectedLabel: {
    fontFamily: theme.typography.bodyBold,
  },
});

