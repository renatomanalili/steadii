import { colors } from "./theme";

export type BPStatus =
  | "normal"
  | "elevated"
  | "stage1"
  | "stage2"
  | "crisis";

export type BPClassification = {
  status: BPStatus;
  label: string;
  color: string;
};

export function classifyBP(
  systolic: number,
  diastolic: number,
): BPClassification {
  if (systolic > 180 || diastolic > 120) {
    return {
      status: "crisis",
      label: "Hypertensive Crisis",
      color: colors.statusCrisis,
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      status: "stage2",
      label: "Stage 2 Hypertension",
      color: colors.statusStage2,
    };
  }

  if (systolic >= 130 || diastolic >= 80) {
    return {
      status: "stage1",
      label: "Stage 1 Hypertension",
      color: colors.statusStage1,
    };
  }

  if (systolic >= 120 && diastolic < 80) {
    return {
      status: "elevated",
      label: "Elevated",
      color: colors.statusElevated,
    };
  }

  return {
    status: "normal",
    label: "Normal",
    color: colors.statusNormal,
  };
}
