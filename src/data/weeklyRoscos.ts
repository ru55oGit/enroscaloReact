import { ROSCO_SET_001 } from "./roscos/sets/set-001";
import { ROSCO_SET_002 } from "./roscos/sets/set-002";
import { ROSCO_SET_003 } from "./roscos/sets/set-003";
import { ROSCO_SET_004 } from "./roscos/sets/set-004";
import { ROSCO_SET_005 } from "./roscos/sets/set-005";
import { ROSCO_SET_006 } from "./roscos/sets/set-006";
import { ROSCO_SET_007 } from "./roscos/sets/set-007";
import { ROSCO_SET_008 } from "./roscos/sets/set-008";
import { ROSCO_SET_009 } from "./roscos/sets/set-009";
import { ROSCO_SET_010 } from "./roscos/sets/set-010";
import { ROSCO_SET_011 } from "./roscos/sets/set-011";
import { ROSCO_SET_012 } from "./roscos/sets/set-012";
import { ROSCO_SET_013 } from "./roscos/sets/set-013";
import { ROSCO_SET_014 } from "./roscos/sets/set-014";
import { ROSCO_SET_015 } from "./roscos/sets/set-015";
import { ROSCO_SET_016 } from "./roscos/sets/set-016";
import { ROSCO_SET_017 } from "./roscos/sets/set-017";
import { ROSCO_SET_018 } from "./roscos/sets/set-018";
import { ROSCO_SET_EN_001 } from "./roscos/sets/en/set-en-001";
import { ROSCO_SET_EN_002 } from "./roscos/sets/en/set-en-002";
import { ROSCO_SET_EN_003 } from "./roscos/sets/en/set-en-003";
import { ROSCO_SET_EN_004 } from "./roscos/sets/en/set-en-004";
import { ROSCO_SET_FR_001 } from "./roscos/sets/fr/set-fr-001";
import { ROSCO_SET_FR_002 } from "./roscos/sets/fr/set-fr-002";
import { ROSCO_SET_FR_003 } from "./roscos/sets/fr/set-fr-003";
import { ROSCO_SET_FR_004 } from "./roscos/sets/fr/set-fr-004";
import { ROSCO_SET_PT_001 } from "./roscos/sets/pt/set-pt-001";
import { ROSCO_SET_PT_002 } from "./roscos/sets/pt/set-pt-002";
import { ROSCO_SET_DE_001 } from "./roscos/sets/de/set-de-001";
import { ROSCO_SET_DE_002 } from "./roscos/sets/de/set-de-002";
import { DayKey } from "../utils/weeklyRoscoState";

export type RoscoRule = "start" | "contain";

export interface RoscoEntry {
  word: string;
  startOrContain: RoscoRule;
  letter: string;
  definition: string;
  category?: string;
}

export interface ActiveRoscoContext {
  setId: string;
  weekStart: string;
  scopeKey: string;
  roscos: Record<DayKey, RoscoEntry[]>;
}

type LangSets = Partial<Record<string, Record<DayKey, RoscoEntry[]>>>;

const ROSCO_SET_REGISTRY: Record<string, LangSets> = {
  "set-001": { es: ROSCO_SET_001, en: ROSCO_SET_EN_001, fr: ROSCO_SET_FR_001, pt: ROSCO_SET_PT_001, de: ROSCO_SET_DE_001 },
  "set-002": { es: ROSCO_SET_002, en: ROSCO_SET_EN_002, fr: ROSCO_SET_FR_002, pt: ROSCO_SET_PT_002, de: ROSCO_SET_DE_002 },
  "set-003": { es: ROSCO_SET_003, en: ROSCO_SET_EN_003, fr: ROSCO_SET_FR_003 },
  "set-004": { es: ROSCO_SET_004, en: ROSCO_SET_EN_004, fr: ROSCO_SET_FR_004 },
  "set-005": { es: ROSCO_SET_005 },
  "set-006": { es: ROSCO_SET_006 },
  "set-007": { es: ROSCO_SET_007 },
  "set-008": { es: ROSCO_SET_008 },
  "set-009": { es: ROSCO_SET_009 },
  "set-010": { es: ROSCO_SET_010 },
  "set-011": { es: ROSCO_SET_011 },
  "set-012": { es: ROSCO_SET_012 },
  "set-013": { es: ROSCO_SET_013 },
  "set-014": { es: ROSCO_SET_014 },
  "set-015": { es: ROSCO_SET_015 },
  "set-016": { es: ROSCO_SET_016 },
  "set-017": { es: ROSCO_SET_017 },
  "set-018": { es: ROSCO_SET_018 },
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

const resolveSetById = (setId: string, language: string): Record<DayKey, RoscoEntry[]> => {
  const langSets = ROSCO_SET_REGISTRY[setId];
  if (!langSets) {
    return DEFAULT_ROSCO_SET;
  }

  const setData = langSets[language] ?? langSets["es"] ?? DEFAULT_ROSCO_SET;

  if (!validateSet(setData)) {
    console.warn(`[weeklyRoscos] Invalid rosco set: ${setId}/${language}. Falling back.`);
    return langSets["es"] ?? DEFAULT_ROSCO_SET;
  }

  return setData;
};

const CYCLE_BASE_DATE = "2025-12-29"; // domingo de la semana del 01/01/2026, set-001
const CYCLE_SIZE = 18;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const resolveScheduleItem = (referenceDate = new Date()) => {
  const weekStart = getWeekStart(referenceDate);
  const weeksSinceBase = Math.floor(
    (new Date(weekStart).getTime() - new Date(CYCLE_BASE_DATE).getTime()) / MS_PER_WEEK,
  );
  const setIndex = ((weeksSinceBase % CYCLE_SIZE) + CYCLE_SIZE) % CYCLE_SIZE;
  const setId = `set-${String(setIndex + 1).padStart(3, "0")}`;
  return { weekStart, setId };
};

export const getActiveRoscoContext = (
  referenceDate = new Date(),
  language = "es",
): ActiveRoscoContext => {
  const schedule = resolveScheduleItem(referenceDate);
  const roscos = resolveSetById(schedule.setId, language);

  return {
    setId: schedule.setId,
    weekStart: schedule.weekStart,
    scopeKey: `${language}:${schedule.weekStart}:${schedule.setId}`,
    roscos,
  };
};

export const getRoscoByDay = (
  dayKey: DayKey,
  referenceDate = new Date(),
  language = "es",
): RoscoEntry[] => {
  const context = getActiveRoscoContext(referenceDate, language);
  return context.roscos[dayKey];
};
