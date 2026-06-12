import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ALL_LEVELS, PROGRESS_KEY, TOTAL_LEVELS } from "../levels/levelsData";
import { useLanguage } from "../i18n/LanguageContext";

const Levels: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      return parseInt(savedProgress, 10);
    } else {
      localStorage.setItem(PROGRESS_KEY, "1");
      return 1;
    }
  });

  // Actualizar progreso cuando el componente se hace visible
  useEffect(() => {
    const handleFocus = () => {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        setUnlockedLevel(parseInt(savedProgress, 10));
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  // Scroll animado al primer nivel bloqueado o al último si todos están desbloqueados
  useEffect(() => {
    const firstLockedLevel = unlockedLevel + 1;

    setTimeout(() => {
      if (firstLockedLevel <= TOTAL_LEVELS) {
        const lockedElement = document.querySelector(
          `[data-level="${firstLockedLevel}"]`,
        );
        if (lockedElement) {
          lockedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      } else {
        const lastElement = document.querySelector(
          `[data-level="${TOTAL_LEVELS}"]`,
        );
        if (lastElement) {
          lastElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }, 500);
  }, [unlockedLevel]);

  const handleClearProgress = () => {
    localStorage.removeItem(PROGRESS_KEY);
    setUnlockedLevel(1);
  };

  const handleLevelClick = (level: number) => {
    if (level <= unlockedLevel) {
      // TODO: Cambiar "/game" por la ruta de tu juego
      navigate(`/game`, { state: { level } });
    }
  };

  // Emojis de números del 0 al 9
  const digitEmojis = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
  ];

  // Generar los pares de emojis según la cantidad real de niveles
  const numberEmojis = Array.from({ length: TOTAL_LEVELS }, (_, i) => {
    const n = i + 1;
    const isUnlocked = n <= unlockedLevel;

    if (!isUnlocked) {
      return <span style={{ fontSize: "24px" }}>🔒</span>;
    }

    const str = n.toString();
    return (
      <Stack
        direction="row"
        spacing={0.2}
        justifyContent="center"
        alignItems="center"
      >
        {str.split("").map((digit, index) => (
          <span
            key={index}
            style={{ fontSize: str.length >= 3 ? "18px" : "20px" }}
          >
            {digitEmojis[parseInt(digit, 10)]}
          </span>
        ))}
      </Stack>
    );
  });

  const levels = Array(TOTAL_LEVELS).fill(null);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        {/* TODO: Cambiar por el título de tu juego */}
        <Typography
          variant="h4"
          sx={{ mb: 3, color: "#fff", fontWeight: 700, textAlign: "center" }}
        >
          {t.findEmoji}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, color: "#fff", opacity: 0.8, textAlign: "center" }}
        >
          {t.findDifferentEmoji}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {levels.map((_, i) => {
            const level = i + 1;
            const isUnlocked = level <= unlockedLevel;

            return (
              <Button
                key={i}
                variant="contained"
                data-level={level}
                onClick={() => handleLevelClick(level)}
                disabled={!isUnlocked}
                sx={{
                  background: isUnlocked ? "#fff" : "#ccc",
                  borderRadius: 2,
                  width: "100%",
                  aspectRatio: "1 / 1",
                  minWidth: 0,
                  minHeight: 0,
                  p: 1,
                  boxShadow: isUnlocked ? "0 2px 8px #0002" : "0 1px 4px #0001",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: isUnlocked ? "#222" : "#888",
                  transition: "transform 0.1s",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  "&:hover": {
                    background: isUnlocked ? "#f5f5f5" : "#ccc",
                    transform: isUnlocked ? "scale(1.02)" : "none",
                  },
                  "&:disabled": {
                    color: "#888",
                  },
                }}
              >
                {numberEmojis[i]}
              </Button>
            );
          })}
        </Box>

        {/* Botón para borrar progreso */}
        <Button
          variant="outlined"
          onClick={handleClearProgress}
          sx={{
            mt: 3,
            py: 1,
            px: 3,
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.6)",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          {t.clearProgress}
        </Button>
      </Box>
    </Layout>
  );
};

export default Levels;
