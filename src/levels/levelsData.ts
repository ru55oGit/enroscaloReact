// TODO: Reemplaza este archivo con los datos reales de tu juego
// Ejemplo: para emojinalo son pares de emojis, para descifraloreact son palabras encriptadas

export interface Level {
  level: number;
  // TODO: Define la estructura de datos de tu nivel según tu juego
  data: unknown;
}

// Ejemplo de niveles - TODO: Reemplazar con los niveles reales de tu juego
export const ALL_LEVELS: Record<number, Level> = {
  1: { level: 1, data: null },
  2: { level: 2, data: null },
  3: { level: 3, data: null },
  4: { level: 4, data: null },
  5: { level: 5, data: null },
  6: { level: 6, data: null },
  7: { level: 7, data: null },
  8: { level: 8, data: null },
  9: { level: 9, data: null },
  10: { level: 10, data: null },
  11: { level: 11, data: null },
  12: { level: 12, data: null },
  13: { level: 13, data: null },
  14: { level: 14, data: null },
  15: { level: 15, data: null },
  16: { level: 16, data: null },
  17: { level: 17, data: null },
  18: { level: 18, data: null },
  19: { level: 19, data: null },
  20: { level: 20, data: null },
};

export const TOTAL_LEVELS = Object.keys(ALL_LEVELS).length;
export const PROGRESS_KEY = "game_progress"; // TODO: Cambiar por un nombre único de tu juego

export const getLevelData = (level: number): Level | undefined => {
  return ALL_LEVELS[level];
};
