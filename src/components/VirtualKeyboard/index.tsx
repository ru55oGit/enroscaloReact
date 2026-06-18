import React from "react";
import Keyboard from "react-simple-keyboard";
import { Box } from "@mui/material";
import "react-simple-keyboard/build/css/index.css";
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
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  guessedLetters = [],
  wrongLetters = [],
  includeActionKeys = false,
  soundEnabled = true,
  onSoundToggle,
}) => {
  const isMobile = useIsMobile();
  const { t, currentLanguage } = useLanguage();

  const getKeyboardLayout = () => {
    const baseLayout = [
      "1 2 3 4 5 6 7 8 9 0",
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "Z X C V B N M",
    ];

    switch (currentLanguage) {
      case "es":
        return {
          default: [
            ...baseLayout.slice(0, 2),
            "A S D F G H J K L Ñ",
            baseLayout[3],
            "Á É Í Ó Ú",
            ...(includeActionKeys ? ["{bksp} {sound}"] : []),
          ],
        };
      case "pt":
        return {
          default: [
            ...baseLayout,
            "Á À Â Ã É Ê",
            "Í Ó Ô Õ Ú Ç",
            ...(includeActionKeys ? ["{bksp} {sound}"] : []),
          ],
        };
      case "fr":
        return {
          default: [
            ...baseLayout,
            "À Â Ä É È Ê Ë",
            "Í Î Ï Ó Ô Ö",
            "Ú Ù Û Ü Ç Œ",
            ...(includeActionKeys ? ["{bksp} {sound}"] : []),
          ],
        };
      case "en":
      default:
        return {
          default: [
            ...baseLayout,
            "Á É Í Ó Ú",
            ...(includeActionKeys ? ["{bksp} {sound}"] : []),
          ],
        };
    }
  };

  const layout = getKeyboardLayout();

  const handleKeyPress = (key: string) => {
    if (key === "{sound}") {
      onSoundToggle?.();
      return;
    }

    const normalizedKey = normalizeText(key);
    const alreadyTried = guessedLetters.some(
      (guessed) => normalizeText(guessed) === normalizedKey,
    );

    if (alreadyTried) {
      return;
    }

    onKeyPress(key);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "8px 4px 12px",
        zIndex: 9999,
        borderTop: "1px solid #555",
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
            buttons: "{bksp} {sound}",
          },
        ]}
        display={{ "{bksp}": t.deleteKey, "{sound}": soundEnabled ? "🔊" : "🔇" }}
        theme="hg-theme-default"
        disableButtonHold
        preventMouseDownDefault
      />
    </Box>
  );
};

export default VirtualKeyboard;
