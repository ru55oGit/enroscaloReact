import { ROSCO_WORDS, RoscoEntry } from "./roscoWords";
import { DayKey } from "../utils/weeklyRoscoState";

export const WEEKLY_ROSCOS: Record<DayKey, RoscoEntry[]> = {
  sun: ROSCO_WORDS,
  mon: ROSCO_WORDS,
  tue: ROSCO_WORDS,
  wed: ROSCO_WORDS,
  thu: ROSCO_WORDS,
  fri: ROSCO_WORDS,
  sat: ROSCO_WORDS,
};

export const getRoscoByDay = (dayKey: DayKey): RoscoEntry[] => {
  return WEEKLY_ROSCOS[dayKey] ?? ROSCO_WORDS;
};
