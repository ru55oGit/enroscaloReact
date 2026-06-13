import { RoscoEntry } from "../data/roscoWords";

export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface DayMeta {
  key: DayKey;
  label: string;
  shortLabel: string;
}

export type LetterStatus = "pending" | "passed" | "correct" | "wrong";
export type DayProgressStatus = "not_started" | "in_progress" | "completed";

export interface DayRoscoState {
  status: DayProgressStatus;
  hits: number;
  plays: number;
  currentIndex: number;
  statuses: LetterStatus[];
  feedback: string;
  updatedAt: string;
}

interface WeeklyRoscoState {
  days: Partial<Record<DayKey, DayRoscoState>>;
}

const STORAGE_KEY_PREFIX = "enroscalo_week_state_v2";

export const WEEK_DAYS: DayMeta[] = [
  { key: "sun", label: "Domingo", shortLabel: "Dom" },
  { key: "mon", label: "Lunes", shortLabel: "Lun" },
  { key: "tue", label: "Martes", shortLabel: "Mar" },
  { key: "wed", label: "Mierc", shortLabel: "Mie" },
  { key: "thu", label: "Jueves", shortLabel: "Jue" },
  { key: "fri", label: "Viernes", shortLabel: "Vie" },
  { key: "sat", label: "Sabado", shortLabel: "Sab" },
];

export const getCurrentDayKey = (referenceDate = new Date()): DayKey => {
  return WEEK_DAYS[referenceDate.getDay()].key;
};

export const isDayAvailable = (
  dayKey: DayKey,
  referenceDate = new Date(),
): boolean => {
  const targetIndex = WEEK_DAYS.findIndex((day) => day.key === dayKey);
  return targetIndex >= 0 && targetIndex <= referenceDate.getDay();
};

export const isDayKey = (value: string | null): value is DayKey => {
  return WEEK_DAYS.some((day) => day.key === value);
};

const buildEmptyDayState = (wordCount: number): DayRoscoState => ({
  status: "not_started",
  hits: 0,
  plays: 0,
  currentIndex: 0,
  statuses: Array.from({ length: wordCount }, () => "pending"),
  feedback: "",
  updatedAt: new Date().toISOString(),
});

const buildEmptyWeekState = (): WeeklyRoscoState => ({
  days: {},
});

const getStorageKey = (scopeKey: string): string => {
  return `${STORAGE_KEY_PREFIX}:${scopeKey}`;
};

export const deriveStatus = (
  statuses: LetterStatus[],
  plays: number,
): DayProgressStatus => {
  const unresolvedCount = statuses.filter(
    (status) => status === "pending" || status === "passed",
  ).length;

  if (unresolvedCount === 0) {
    return "completed";
  }

  if (plays > 0 || statuses.some((status) => status !== "pending")) {
    return "in_progress";
  }

  return "not_started";
};

export const getWeeklyState = (
  wordCount: number,
  scopeKey = "default",
): WeeklyRoscoState => {
  if (typeof window === "undefined") {
    return buildEmptyWeekState();
  }

  const raw = window.localStorage.getItem(getStorageKey(scopeKey));
  if (!raw) {
    return buildEmptyWeekState();
  }

  try {
    const parsed = JSON.parse(raw) as WeeklyRoscoState;

    if (!parsed || typeof parsed !== "object") {
      return buildEmptyWeekState();
    }

    const safeDays: Partial<Record<DayKey, DayRoscoState>> = {};
    for (const day of WEEK_DAYS) {
      const dayState = parsed.days?.[day.key];
      if (!dayState) {
        continue;
      }

      if (
        !Array.isArray(dayState.statuses) ||
        dayState.statuses.length !== wordCount ||
        dayState.currentIndex < 0 ||
        dayState.currentIndex >= wordCount
      ) {
        continue;
      }

      safeDays[day.key] = {
        ...dayState,
        status: deriveStatus(dayState.statuses, dayState.plays),
      };
    }

    return { days: safeDays };
  } catch {
    return buildEmptyWeekState();
  }
};

export const getDayState = (
  dayKey: DayKey,
  wordCount: number,
  scopeKey = "default",
): DayRoscoState => {
  const weekState = getWeeklyState(wordCount, scopeKey);
  return weekState.days[dayKey] ?? buildEmptyDayState(wordCount);
};

export const saveDayState = (
  dayKey: DayKey,
  value: Omit<DayRoscoState, "status" | "updatedAt">,
  scopeKey = "default",
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const weekState = getWeeklyState(value.statuses.length, scopeKey);
  const nextDayState: DayRoscoState = {
    ...value,
    status: deriveStatus(value.statuses, value.plays),
    updatedAt: new Date().toISOString(),
  };

  const nextState: WeeklyRoscoState = {
    ...weekState,
    days: {
      ...weekState.days,
      [dayKey]: nextDayState,
    },
  };

  window.localStorage.setItem(getStorageKey(scopeKey), JSON.stringify(nextState));
};

export const getRoscoStatusLabel = (
  dayState: DayRoscoState,
  totalWords: number,
): string => {
  if (dayState.status === "completed") {
    return `Completado ${dayState.hits}/${totalWords}`;
  }

  if (dayState.status === "in_progress") {
    return `En progreso ${dayState.hits}/${totalWords}`;
  }

  return "Sin jugar";
};

export const getDayMeta = (dayKey: DayKey): DayMeta => {
  return WEEK_DAYS.find((day) => day.key === dayKey) ?? WEEK_DAYS[0];
};

export const getPlayableCurrentAndPastDays = (
  referenceDate = new Date(),
): DayKey[] => {
  const todayIndex = referenceDate.getDay();
  return WEEK_DAYS.slice(0, todayIndex + 1).map((day) => day.key);
};

export const buildRoscoPreview = (entries: RoscoEntry[]): string => {
  return entries.map((entry) => entry.letter).join(" ");
};
