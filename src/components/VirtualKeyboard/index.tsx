import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import { Box } from "@mui/material";
import "react-simple-keyboard/build/css/index.css";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeText } from "../../utils/textNormalization";
import HouseAdBanner from "../../ads/HouseAdBanner";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters?: string[];
  wrongLetters?: string[];
  includeActionKeys?: boolean;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  onPass?: () => void;
  hidden?: boolean;
  // Arranca cerrado (muestra un banner en su lugar) hasta que el juego pide
  // abrirlo — distinto de `hidden`, que es la animación de ocultar/mostrar
  // ya existente del teclado una vez abierto.
  open?: boolean;
  gameSlug?: string;
}

// Filas/offsets calcados del teclado español de iPhone: fila 1 y fila 2
// comparten las mismas 10 columnas (sin offset entre ellas), y la fila
// Z-M (7 teclas) queda centrada bajo esas 10 columnas — por eso la M cae
// justo abajo de la mitad entre K y L. Con flexbox ponderado (flex-grow)
// alcanza ese mismo resultado visual sin pixeles fijos: la fila corta
// "cede" 1.5 columnas de ancho a cada lado para el acento y el borrar.
const ES_ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ES_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const ES_ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];
const ACCENTED_VOWEL: Record<string, string> = { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const IS_VOWEL = (letter: string) => letter in ACCENTED_VOWEL;

const keyButtonSx = (variant: "default" | "correct" | "incorrect" | "action") => ({
  flex: 1,
  minWidth: 0,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  border: "1px solid #666",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: variant === "correct" || variant === "incorrect" ? "not-allowed" : "pointer",
  transition: "all 0.15s ease",
  "&:active": { transform: "scale(0.96)" },
  ...(variant === "default" && { backgroundColor: "#444", color: "#fff" }),
  ...(variant === "correct" && { backgroundColor: "#27ae60", borderColor: "#1e8449", color: "#fff" }),
  ...(variant === "incorrect" && { backgroundColor: "#e74c3c", borderColor: "#c0392b", color: "#fff" }),
  ...(variant === "action" && { backgroundColor: "#223a75", borderColor: "#1a2d58", color: "#fff", fontSize: 11 }),
});

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  guessedLetters = [],
  wrongLetters = [],
  includeActionKeys = false,
  soundEnabled = true,
  onSoundToggle,
  onPass,
  hidden = false,
  open = true,
  gameSlug = "enroscado",
}) => {
  const isMobile = useIsMobile();
  const { t, currentLanguage } = useLanguage();
  const [accentActive, setAccentActive] = useState(false);

  const getKeyboardLayout = () => {
    // El borrar vive dentro de la fila Z-M (rojo, como en enganchadoReact)
    // en vez de una fila de acciones aparte.
    const zRow = `Z X C V B N M${includeActionKeys ? " {bksp}" : ""}`;
    const baseLayout = ["Q W E R T Y U I O P", "A S D F G H J K L", zRow];

    switch (currentLanguage) {
      case "pt":
        return {
          default: [
            ...baseLayout,
            "Á À Â Ã É Ê",
            "Í Ó Ô Õ Ú Ç",
            ...(includeActionKeys ? ["{pass} {sound}"] : []),
          ],
        };
      case "fr":
        return {
          default: [
            ...baseLayout,
            "À Â Ä É È Ê Ë",
            "Í Î Ï Ó Ô Ö",
            "Ú Ù Û Ü Ç Œ",
            ...(includeActionKeys ? ["{pass} {sound}"] : []),
          ],
        };
      case "de":
        return {
          default: [
            baseLayout[0],
            "A S D F G H J K L Ö",
            `Z X C V B N M Ü${includeActionKeys ? " {bksp}" : ""}`,
            "Ä ß",
            ...(includeActionKeys ? ["{pass} {sound}"] : []),
          ],
        };
      case "en":
      default:
        return {
          default: [
            ...baseLayout,
            "Á É Í Ó Ú",
            ...(includeActionKeys ? ["{pass} {sound}"] : []),
          ],
        };
    }
  };

  const isAlreadyGuessed = (letter: string) =>
    guessedLetters.some((guessed) => normalizeText(guessed) === letter);
  const isWrong = (letter: string) => wrongLetters.some((wrong) => normalizeText(wrong) === letter);

  const pressLetter = (displayChar: string) => {
    const normalizedKey = normalizeText(displayChar);
    const alreadyTried = guessedLetters.some((guessed) => normalizeText(guessed) === normalizedKey);
    if (!alreadyTried) {
      onKeyPress(displayChar);
    }
  };

  const handleEsLetterClick = (letter: string) => {
    const display = accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    pressLetter(display);
    // Una vez tocada una vocal o cualquier consonante, el acento se
    // desactiva — es una tecla "muerta", no un modo que queda prendido.
    setAccentActive(false);
  };

  const handleSoundButton = (target: boolean) => {
    if (target !== soundEnabled) {
      onSoundToggle?.();
    }
  };

  const renderEsLetterKey = (letter: string, flex = 1) => {
    const correct = isAlreadyGuessed(letter) && !isWrong(letter);
    const wrong = isWrong(letter);
    const variant = correct ? "correct" : wrong ? "incorrect" : "default";
    const display = accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    return (
      <Box
        key={letter}
        component="button"
        type="button"
        onClick={() => handleEsLetterClick(letter)}
        sx={{ ...keyButtonSx(variant), flex }}
      >
        {display}
      </Box>
    );
  };

  const handleKeyPress = (key: string) => {
    if (key === "{sound}") {
      onSoundToggle?.();
      return;
    }

    if (key === "{pass}") {
      onPass?.();
      return;
    }

    pressLetter(key);
  };

  if (!isMobile) {
    return null;
  }

  const wrapperSx = {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: "8px 4px 12px",
    zIndex: 9999,
    borderTop: "1px solid #555",
    opacity: hidden ? 0 : 1,
    transform: hidden ? "translateY(40px)" : "translateY(0px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    pointerEvents: hidden ? ("none" as const) : ("auto" as const),
  };

  if (currentLanguage === "es") {
    return (
      <Box sx={wrapperSx}>
        {open ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
              {ES_ROW_1.map((letter) => renderEsLetterKey(letter))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
              {ES_ROW_2.map((letter) => renderEsLetterKey(letter))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
              <Box
                component="button"
                type="button"
                onClick={() => setAccentActive((prev) => !prev)}
                aria-label="Acento"
                sx={{
                  ...keyButtonSx("default"),
                  flex: 1.5,
                  fontSize: 16,
                  fontWeight: 800,
                  backgroundColor: accentActive ? "#f0b429" : "#444",
                  color: accentActive ? "#1a1a1a" : "#fff",
                  borderColor: accentActive ? "#d99f1a" : "#666",
                }}
              >
                ´
              </Box>
              {ES_ROW_3.map((letter) => renderEsLetterKey(letter))}
              {includeActionKeys && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => onKeyPress("{bksp}")}
                  aria-label="Borrar"
                  sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
                >
                  ⌫
                </Box>
              )}
            </Box>
            {includeActionKeys && (
              <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => handleSoundButton(true)}
                  sx={{
                    ...keyButtonSx("action"),
                    flex: 1.4,
                    height: 40,
                    gap: "4px",
                    backgroundColor: soundEnabled ? "#2ecc71" : "#223a75",
                    borderColor: soundEnabled ? "#1e8449" : "#1a2d58",
                  }}
                >
                  <VolumeUpRoundedIcon sx={{ fontSize: 16 }} />
                  On
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => onPass?.()}
                  sx={{ ...keyButtonSx("action"), flex: 7.2, height: 40, fontSize: 13 }}
                >
                  {t.feedbackPassed}
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => handleSoundButton(false)}
                  sx={{
                    ...keyButtonSx("action"),
                    flex: 1.4,
                    height: 40,
                    gap: "4px",
                    backgroundColor: !soundEnabled ? "#e74c3c" : "#223a75",
                    borderColor: !soundEnabled ? "#c0392b" : "#1a2d58",
                  }}
                >
                  <VolumeOffRoundedIcon sx={{ fontSize: 16 }} />
                  Off
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
            <HouseAdBanner slot={`${gameSlug}-keyboard-banner`} gameSlug={gameSlug} locale={currentLanguage} />
          </Box>
        )}
      </Box>
    );
  }

  const layout = getKeyboardLayout();

  return (
    <Box
      sx={{
        ...wrapperSx,
        "& .hg-theme-default": {
          backgroundColor: "transparent",
          maxWidth: "100%",
          "& .hg-row": {
            display: "flex",
            justifyContent: "center",
            gap: "2px",
            marginBottom: "4px",
          },
          "& .hg-button": {
            backgroundColor: "#444",
            color: "#fff",
            border: "1px solid #666",
            margin: "0",
            padding: "8px 4px",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            minWidth: "28px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "#555",
              borderColor: "#777",
            },
            "&:active": {
              backgroundColor: "#333",
              transform: "scale(0.98)",
            },
          },
          "& .hg-button.correct": {
            backgroundColor: "#27ae60 !important",
            borderColor: "#1e8449 !important",
            color: "#fff !important",
            cursor: "not-allowed",
          },
          "& .hg-button.incorrect": {
            backgroundColor: "#e74c3c !important",
            borderColor: "#c0392b !important",
            color: "#fff !important",
            cursor: "not-allowed",
          },
          "& .hg-button.action": {
            backgroundColor: "#223a75",
            borderColor: "#1a2d58",
            minWidth: "64px",
            fontSize: "11px",
          },
          "& .hg-button.delete": {
            backgroundColor: "#e74c3c",
            borderColor: "#c0392b",
            color: "#fff",
          },
          "@media (max-width: 480px)": {
            "& .hg-button": {
              minWidth: "24px",
              height: "32px",
              fontSize: "11px",
              padding: "6px 2px",
            },
          },
          "@media (max-width: 360px)": {
            "& .hg-button": {
              minWidth: "20px",
              height: "28px",
              fontSize: "10px",
              padding: "4px 1px",
            },
            "& .hg-row": {
              gap: "1px",
              marginBottom: "2px",
            },
          },
        },
      }}
    >
      {open ? (
        <Keyboard
          layout={layout}
          layoutName="default"
          onChange={() => {}}
          onKeyPress={handleKeyPress}
          buttonTheme={[
            {
              class: "correct",
              buttons: guessedLetters
                .filter((letter) => !wrongLetters.includes(letter))
                .join(" "),
            },
            {
              class: "incorrect",
              buttons: wrongLetters.join(" "),
            },
            {
              class: "action",
              buttons: "{pass} {sound}",
            },
            {
              class: "delete",
              buttons: "{bksp}",
            },
          ]}
          display={{ "{bksp}": "⌫", "{sound}": soundEnabled ? "🔊" : "🔇", "{pass}": t.feedbackPassed }}
          theme="hg-theme-default"
          disableButtonHold
          preventMouseDownDefault
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
          <HouseAdBanner slot={`${gameSlug}-keyboard-banner`} gameSlug={gameSlug} locale={currentLanguage} />
        </Box>
      )}
    </Box>
  );
};

export default VirtualKeyboard;
