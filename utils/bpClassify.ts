import { classifyBP, BPClassification } from "../constants/bpRanges";

export function getBPClassification(
  systolic: number,
  diastolic: number,
): BPClassification {
  return classifyBP(systolic, diastolic);
}

export function getBPStatusColor(
  systolic: number,
  diastolic: number,
): string {
  return classifyBP(systolic, diastolic).color;
}

export function getBPStatusLabel(
  systolic: number,
  diastolic: number,
): string {
  return classifyBP(systolic, diastolic).label;
}
