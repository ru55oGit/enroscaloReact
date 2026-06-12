/**
 * Utilidad para normalizar texto removiendo acentos y caracteres especiales
 * Útil para comparaciones insensibles a acentos en juegos de palabras
 */

/**
 * Normaliza una cadena removiendo acentos y convirtiendo a mayúsculas
 * @param text - Texto a normalizar
 * @returns Texto sin acentos en mayúsculas
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize("NFD") // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remueve diacríticos
    .toUpperCase(); // Convierte a mayúsculas
};

/**
 * Normaliza una letra individual
 * @param letter - Letra a normalizar
 * @returns Letra sin acentos en mayúsculas
 */
export const normalizeLetter = (letter: string): string => {
  return normalizeText(letter);
};

/**
 * Compara dos textos ignorando acentos y mayúsculas
 * @param text1 - Primer texto
 * @param text2 - Segundo texto
 * @returns true si son iguales (ignorando acentos)
 */
export const compareTextIgnoreAccents = (
  text1: string,
  text2: string,
): boolean => {
  return normalizeText(text1) === normalizeText(text2);
};

/**
 * Verifica si una letra (con o sin acento) coincide con otra
 * @param inputLetter - Letra ingresada por el usuario
 * @param targetLetter - Letra objetivo en la palabra
 * @returns true si las letras coinciden (ignorando acentos)
 */
export const letterMatches = (
  inputLetter: string,
  targetLetter: string,
): boolean => {
  return normalizeLetter(inputLetter) === normalizeLetter(targetLetter);
};

/**
 * Obtiene la versión con acento de una letra si existe en el texto objetivo
 * @param inputLetter - Letra ingresada (sin acento)
 * @param targetWord - Palabra objetivo que puede contener acentos
 * @returns La letra con acento si existe, sino la letra original
 */
export const getAccentedLetter = (
  inputLetter: string,
  targetWord: string,
): string => {
  const normalizedInput = normalizeLetter(inputLetter);

  // Buscar en la palabra objetivo si hay una versión acentuada de esta letra
  for (const char of targetWord) {
    if (
      normalizeLetter(char) === normalizedInput &&
      char !== inputLetter.toUpperCase()
    ) {
      return char.toUpperCase();
    }
  }

  return inputLetter.toUpperCase();
};
