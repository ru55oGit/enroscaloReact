import React, { useState } from "react";
import Keyboard from "react-simple-keyboard";
import { Box } from "@mui/material";
import "react-simple-keyboard/build/css/index.css";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import KeyboardHideRoundedIcon from "@mui/icons-material/KeyboardHideRounded";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeText } from "../../utils/textNormalization";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters?: string[];
  wrongLetters?: string[];
  includeActionKeys?: boolean;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  onPass?: () => void;
  // Las dos filas de acentos de pt (Á À Â Ã É Ê / Í Ó Ô Õ Ú Ç) solo tienen
  // sentido cuando la palabra actual realmente usa alguno — el resto de
  // las veces son dos filas enteras que no sirven para nada y tapan
  // mucha pantalla (ver conversación, mismo criterio que imaginalo/emojinalo).
  hasPtAccents?: boolean;
  // Cierra el teclado (el "huequito" que quedaba vacío en en/pt donde no
  // hay acento ni borrar que poner, ahora lo ocupa este botón en vez de
  // quedar como espacio muerto).
  onClose?: () => void;
  hidden?: boolean;
  // Antes mostraba un banner de house-ad en su lugar mientras estaba
  // cerrado, pero la página ya tiene uno propio más arriba (HouseAdBanner
  // slot="enroscado-game-banner") y quedaban los dos superpuestos al
  // scrollear — ahora simplemente no renderiza nada hasta que se abre.
  open?: boolean;
}

// Filas/offsets calcados del teclado de iPhone: fila 1 y fila 2 comparten
// las mismas columnas (sin offset entre ellas), y la fila Z-M queda
// centrada bajo esas columnas — por eso en es la M cae justo abajo de la
// mitad entre K y L. Con flexbox ponderado (flex-grow) alcanza ese mismo
// resultado visual sin pixeles fijos: la fila corta "cede" ancho a cada
// lado para las teclas especiales que la flanquean.
const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ES_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"];
const LATIN_ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];
const ACCENTED_VOWEL: Record<string, string> = { A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const IS_VOWEL = (letter: string) => letter in ACCENTED_VOWEL;

// pt sí necesita sus propios acentos directos en el teclado (no son un
// simple "modo acento" como en es, son letras bien distintas — ç en
// particular ni siquiera es una vocal acentuada) — van en dos filas fijas
// arriba del todo, no en la tecla muerta que en/pt comparten más abajo.
const PT_ACCENT_ROWS = [
  ["Á", "À", "Â", "Ã", "É", "Ê"],
  ["Í", "Ó", "Ô", "Õ", "Ú", "Ç"],
];
const PT_ACCENT_BASE: Record<string, string> = {
  Á: "A", À: "A", Â: "A", Ã: "A", É: "E", Ê: "E",
  Í: "I", Ó: "O", Ô: "O", Õ: "O", Ú: "U", Ç: "C",
};

const keyButtonSx = (variant: "default" | "correct" | "incorrect" | "action") => ({
  flex: 1,
  minWidth: 0,
  height: 34,
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
  hasPtAccents = false,
  onClose,
  hidden = false,
  open = true,
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
      default:
        return {
          default: [
            baseLayout[0],
            "A S D F G H J K L Ö",
            `Z X C V B N M Ü${includeActionKeys ? " {bksp}" : ""}`,
            "Ä ß",
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

  const handleLetterClick = (letter: string) => {
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

  const renderLetterKey = (letter: string, flex = 1) => {
    const correct = isAlreadyGuessed(letter) && !isWrong(letter);
    const wrong = isWrong(letter);
    const variant = correct ? "correct" : wrong ? "incorrect" : "default";
    const display = accentActive && IS_VOWEL(letter) ? ACCENTED_VOWEL[letter] : letter;
    return (
      <Box
        key={letter}
        component="button"
        type="button"
        onClick={() => handleLetterClick(letter)}
        sx={{ ...keyButtonSx(variant), flex }}
      >
        {display}
      </Box>
    );
  };

  const renderBksp = (ariaLabel: string) =>
    includeActionKeys && (
      <Box
        component="button"
        type="button"
        onClick={() => onKeyPress("{bksp}")}
        aria-label={ariaLabel}
        sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
      >
        ⌫
      </Box>
    );

  const renderCloseKeyboard = () => (
    <Box
      component="button"
      type="button"
      onClick={() => onClose?.()}
      aria-label="Cerrar teclado"
      sx={{ ...keyButtonSx("default"), flex: 1.5, backgroundColor: "#e74c3c", borderColor: "#c0392b" }}
    >
      <KeyboardHideRoundedIcon sx={{ fontSize: 18 }} />
    </Box>
  );

  const renderPtAccentRows = () => (
    <>
      {PT_ACCENT_ROWS.map((row, rowIndex) => (
        <Box key={`pt-accent-${rowIndex}`} sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
          {row.map((char) => {
            const base = PT_ACCENT_BASE[char];
            const correct = isAlreadyGuessed(base) && !isWrong(base);
            const wrong = isWrong(base);
            const variant = correct ? "correct" : wrong ? "incorrect" : "default";
            return (
              <Box
                key={char}
                component="button"
                type="button"
                onClick={() => pressLetter(char)}
                sx={keyButtonSx(variant)}
              >
                {char}
              </Box>
            );
          })}
        </Box>
      ))}
    </>
  );

  // row2: 10 teclas en es (con Ñ) o 9 en el resto (sin letra extra).
  // leftFlank: qué va a la izquierda de la fila Z-M. "accent" en es (tecla
  // "muerta" ´ en el lugar del shift). en/pt no necesitan acento ni un
  // segundo borrar (con el de la derecha alcanza) — ese hueco lo ocupa
  // cerrar el teclado en vez de quedar vacío o duplicar el borrar.
  const renderMainRows = (row2: string[], leftFlank: "accent" | "close") => (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
        {ROW_1.map((letter) => renderLetterKey(letter))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
        {row2.map((letter) => renderLetterKey(letter))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
        {leftFlank === "accent" ? (
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
        ) : (
          renderCloseKeyboard()
        )}
        {ROW_3.map((letter) => renderLetterKey(letter))}
        {renderBksp("Borrar")}
      </Box>
    </>
  );

  const renderActionRow = () =>
    includeActionKeys && (
      <Box sx={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        <Box
          component="button"
          type="button"
          onClick={() => handleSoundButton(true)}
          sx={{
            ...keyButtonSx("action"),
            flex: 1.4,
            height: 38,
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
          sx={{ ...keyButtonSx("action"), flex: 7.2, height: 38, fontSize: 13 }}
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
            height: 38,
            gap: "4px",
            backgroundColor: !soundEnabled ? "#e74c3c" : "#223a75",
            borderColor: !soundEnabled ? "#c0392b" : "#1a2d58",
          }}
        >
          <VolumeOffRoundedIcon sx={{ fontSize: 16 }} />
          Off
        </Box>
      </Box>
    );

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

  if (!isMobile || !open) {
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

  if (currentLanguage === "es" || currentLanguage === "en" || currentLanguage === "pt") {
    return (
      <Box sx={wrapperSx}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {currentLanguage === "pt" && hasPtAccents && renderPtAccentRows()}
          {renderMainRows(
            currentLanguage === "es" ? ES_ROW_2 : LATIN_ROW_2,
            currentLanguage === "es" ? "accent" : "close",
          )}
          {renderActionRow()}
        </Box>
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
    </Box>
  );
};

export default VirtualKeyboard;
