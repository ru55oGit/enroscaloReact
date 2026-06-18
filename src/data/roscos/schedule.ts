export interface RoscoScheduleItem {
  weekStart: string; // Sunday in YYYY-MM-DD
  setId: string;
}

export const ROSCO_SCHEDULE: RoscoScheduleItem[] = [
  { weekStart: "2026-06-07", setId: "set-001" },
  { weekStart: "2026-06-22", setId: "set-002" },
];
