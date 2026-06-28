import { DayKey, LetterStatus } from "./weeklyRoscoState";

export interface HistoryEntry {
  word: string;
  definition: string;
  letter: string;
  category?: string;
}

export interface HistoryDayRecord {
  weekStart: string;
  dayKey: DayKey;
  date: string;
  statuses: LetterStatus[];
  entries: HistoryEntry[];
}

interface HistoryStore {
  days: HistoryDayRecord[];
}

export interface CumulativeStats {
  correct: number;
  wrong: number;
  passed: number;
  byCategory: Record<string, { correct: number; wrong: number }>;
}

export interface BestStreak {
  words: HistoryEntry[];
  date: string;
}

const HISTORY_KEY = "enroscalo_history_v1";

function getHistory(): HistoryStore {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return { days: [] };
    return JSON.parse(raw) as HistoryStore;
  } catch {
    return { days: [] };
  }
}

export function upsertHistoryDay(record: HistoryDayRecord): void {
  const store = getHistory();
  const idx = store.days.findIndex(
    (d) => d.weekStart === record.weekStart && d.dayKey === record.dayKey
  );
  if (idx >= 0) {
    store.days[idx] = record;
  } else {
    store.days.push(record);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(store));
}

export function getCumulativeStats(): CumulativeStats {
  const { days } = getHistory();
  let correct = 0, wrong = 0, passed = 0;
  const byCategory: Record<string, { correct: number; wrong: number }> = {};

  for (const day of days) {
    day.statuses.forEach((status, i) => {
      if (status === "correct") correct++;
      else if (status === "wrong") wrong++;
      else if (status === "passed") passed++;

      const cat = day.entries[i]?.category;
      if (cat && (status === "correct" || status === "wrong")) {
        if (!byCategory[cat]) byCategory[cat] = { correct: 0, wrong: 0 };
        if (status === "correct") byCategory[cat].correct++;
        else byCategory[cat].wrong++;
      }
    });
  }

  return { correct, wrong, passed, byCategory };
}

export function getBestStreak(): BestStreak | null {
  const { days } = getHistory();
  let best: BestStreak | null = null;

  for (const day of days) {
    let current: HistoryEntry[] = [];
    let longest: HistoryEntry[] = [];

    day.statuses.forEach((status, i) => {
      if (status === "correct") {
        current.push(day.entries[i]);
        if (current.length > longest.length) longest = [...current];
      } else {
        current = [];
      }
    });

    if (longest.length > (best?.words.length ?? 0)) {
      best = { words: longest, date: day.date };
    }
  }

  return best;
}
