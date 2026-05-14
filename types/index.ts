export type BPReading = {
  id: number;
  systolic: number;
  diastolic: number;
  bpm: number | null;
  period: "AM" | "PM";
  loggedAt: string;
  notes: string | null;
};

export type Goal = {
  id: number;
  label: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
};

export type UserProfile = {
  name: string;
  reminderTime: string | null;
  units: "mmHg" | "kPa";
};

export type ComplianceStatus = "both" | "one" | "none";

export type DayCompliance = {
  date: string;
  status: ComplianceStatus;
};

export type WeeklyStats = {
  avgSystolic: number;
  avgDiastolic: number;
  totalReadings: number;
  complianceRate: number;
  bestDay: string | null;
};
