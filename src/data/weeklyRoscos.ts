import { ROSCO_SET_001 } from "./roscos/sets/set-001";
import { ROSCO_SCHEDULE } from "./roscos/schedule";
import { DayKey } from "../utils/weeklyRoscoState";

export type RoscoRule = "start" | "contain";

export interface RoscoEntry {
  word: string;
  startOrContain: RoscoRule;
  letter: string;
  definition: string;
}

export interface ActiveRoscoContext {
  setId: string;
  weekStart: string;
  scopeKey: string;
  roscos: Record<DayKey, RoscoEntry[]>;
}

const ROSCO_SET_REGISTRY: Record<string, Record<DayKey, RoscoEntry[]>> = {
  "set-001": ROSCO_SET_001,
};

const EXPECTED_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const toLocalIsoDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getWeekStart = (referenceDate = new Date()): string => {
  const localDate = new Date(referenceDate);
  localDate.setHours(0, 0, 0, 0);
  const sunday = new Date(localDate);
  sunday.setDate(localDate.getDate() - localDate.getDay());
  return toLocalIsoDate(sunday);
};

const DEFAULT_ROSCO_SET: Record<DayKey, RoscoEntry[]> = ROSCO_SET_001;

const validateRosco = (entries: RoscoEntry[]): boolean => {
  if (entries.length !== 26) {
    return false;
  }

  const seenLetters = new Set(entries.map((entry) => entry.letter.toUpperCase()));
  if (seenLetters.size !== 26) {
    return false;
  }

  for (const letter of EXPECTED_LETTERS) {
    if (!seenLetters.has(letter)) {
      return false;
    }
  }

  return entries.every(
    (entry) =>
      (entry.startOrContain === "start" || entry.startOrContain === "contain") &&
      Boolean(entry.word.trim()) &&
      Boolean(entry.definition.trim()),
  );
};

const validateSet = (setData: Record<DayKey, RoscoEntry[]>): boolean => {
  const dayKeys: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return dayKeys.every((dayKey) => validateRosco(setData[dayKey] ?? []));
};

const resolveSetById = (setId: string): Record<DayKey, RoscoEntry[]> => {
  const setData = ROSCO_SET_REGISTRY[setId];
  if (!setData) {
    return DEFAULT_ROSCO_SET;
  }

  if (!validateSet(setData)) {
    console.warn(`[weeklyRoscos] Invalid rosco set: ${setId}. Falling back to default set.`);
    return DEFAULT_ROSCO_SET;
  }

  return setData;
};

const resolveScheduleItem = (referenceDate = new Date()) => {
  const weekStart = getWeekStart(referenceDate);
  const sorted = [...ROSCO_SCHEDULE].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  const eligible = sorted.filter((item) => item.weekStart <= weekStart);
  const selected =
    (eligible.length > 0 ? eligible[eligible.length - 1] : undefined) ?? sorted[0];

  if (!selected) {
    return {
      weekStart,
      setId: "default",
    };
  }

  return {
    weekStart,
    setId: selected.setId,
  };
};

export const getActiveRoscoContext = (
  referenceDate = new Date(),
): ActiveRoscoContext => {
  const schedule = resolveScheduleItem(referenceDate);
  const roscos = resolveSetById(schedule.setId);

  return {
    setId: schedule.setId,
    weekStart: schedule.weekStart,
    scopeKey: `${schedule.weekStart}:${schedule.setId}`,
    roscos,
  };
};

export const getRoscoByDay = (
  dayKey: DayKey,
  referenceDate = new Date(),
): RoscoEntry[] => {
  const context = getActiveRoscoContext(referenceDate);
  return context.roscos[dayKey];
};
