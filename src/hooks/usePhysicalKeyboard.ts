import { useEffect } from "react";
import { normalizeLetter } from "../utils/textNormalization";

interface UsePhysicalKeyboardOptions {
  onKeyPress: (key: string) => void;
  enabled?: boolean;
  allowedKeys?: string[];
}

/**
 * Hook para manejar input del teclado físico
 * Útil cuando el teclado virtual no está disponible (desktop/laptop)
 */
export const usePhysicalKeyboard = ({
  onKeyPress,
  enabled = true,
  allowedKeys,
}: UsePhysicalKeyboardOptions): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Obtener la tecla presionada (manteniendo acentos originales)
      const originalKey = event.key;
      const normalizedKey = normalizeLetter(originalKey);

      // Lista de teclas válidas por defecto (letras, números y Ñ)
      const defaultAllowedKeys = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "Ñ",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      ];

      // Caracteres especiales para todos los idiomas
      const specialChars = [
        // Acentos españoles
        "Á",
        "É",
        "Í",
        "Ó",
        "Ú",
        // Acentos portugueses
        "À",
        "Â",
        "Ã",
        "Ê",
        "Ô",
        "Õ",
        "Ç",
        // Acentos franceses
        "À",
        "Â",
        "Ä",
        "É",
        "È",
        "Ê",
        "Ë",
        "Í",
        "Î",
        "Ï",
        "Ó",
        "Ô",
        "Ö",
        "Ú",
        "Ù",
        "Û",
        "Ü",
        "Ç",
        "Œ",
        // Versiones minúsculas también (por si las presionan)
        "á",
        "é",
        "í",
        "ó",
        "ú",
        "à",
        "â",
        "ã",
        "ê",
        "ô",
        "õ",
        "ç",
        "à",
        "â",
        "ä",
        "é",
        "è",
        "ê",
        "ë",
        "í",
        "î",
        "ï",
        "ó",
        "ô",
        "ö",
        "ú",
        "ù",
        "û",
        "ü",
        "ç",
        "œ",
      ];

      const validKeys = allowedKeys || [...defaultAllowedKeys, ...specialChars];

      // Verificar si es una tecla válida (original o normalizada)
      const isValidKey =
        validKeys.includes(originalKey.toUpperCase()) ||
        validKeys.includes(originalKey.toLowerCase()) ||
        validKeys.includes(normalizedKey) ||
        specialChars.includes(originalKey.toUpperCase()) ||
        specialChars.includes(originalKey.toLowerCase());

      if (isValidKey) {
        // Prevenir comportamiento por defecto solo para teclas que manejamos
        event.preventDefault();

        // Enviar la tecla original (con acentos si los tiene)
        onKeyPress(originalKey.toUpperCase());
      }

      // Manejar casos especiales para Ñ en algunos teclados
      if (event.code === "Semicolon" && event.shiftKey) {
        event.preventDefault();
        onKeyPress("Ñ");
      }
    };

    // Agregar event listener al documento
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyPress, enabled, allowedKeys]);
};
