import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLanguage } from "../i18n/LanguageContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { getActiveRoscoContext } from "../data/weeklyRoscos";
import {
  DayKey,
  LetterStatus,
  deriveStatus,
  getCurrentDayKey,
  getDayMeta,
  getDayState,
  isDayAvailable,
  isDayKey,
  saveDayState,
} from "../utils/weeklyRoscoState";

const normalizeText = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
};

const findNextPlayableIndex = (
  statuses: LetterStatus[],
  fromIndex: number,
): number => {
  for (let offset = 1; offset <= statuses.length; offset += 1) {
    const idx = (fromIndex + offset) % statuses.length;
    if (statuses[idx] === "pending" || statuses[idx] === "passed") {
      return idx;
    }
  }

  return -1;
};

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const todayKey = getCurrentDayKey();
  const rawDay = searchParams.get("day");
  const dayKey: DayKey = isDayKey(rawDay) ? rawDay : todayKey;
  const activeRoscoContext = useMemo(() => getActiveRoscoContext(), []);
  const roscoWords = activeRoscoContext.roscos[dayKey];
  const dayMeta = getDayMeta(dayKey);
  const initialDayState = useMemo(
    () => getDayState(dayKey, roscoWords.length, activeRoscoContext.scopeKey),
    [activeRoscoContext.scopeKey, dayKey, roscoWords.length],
  );

  const [hits, setHits] = useState(initialDayState.hits);
  const [plays, setPlays] = useState(initialDayState.plays);
  const [currentIndex, setCurrentIndex] = useState(initialDayState.currentIndex);
  const [statuses, setStatuses] = useState<LetterStatus[]>(initialDayState.statuses);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(initialDayState.feedback);

  useEffect(() => {
    if (!isDayAvailable(dayKey)) {
      navigate("/", { replace: true });
      return;
    }

    setHits(initialDayState.hits);
    setPlays(initialDayState.plays);
    setCurrentIndex(initialDayState.currentIndex);
    setStatuses(initialDayState.statuses);
    setFeedback(initialDayState.feedback);
    setAnswer("");
  }, [dayKey, initialDayState, navigate]);

  const unresolvedCount = useMemo(() => {
    return statuses.filter((status) => status === "pending" || status === "passed")
      .length;
  }, [statuses]);

  const dayStatus = deriveStatus(statuses, plays);
  const isFinished = dayStatus === "completed";
  const currentEntry = isFinished ? null : roscoWords[currentIndex];

  useEffect(() => {
    if (statuses.length !== roscoWords.length) {
      return;
    }

    saveDayState(dayKey, {
      hits,
      plays,
      currentIndex,
      statuses,
      feedback,
    }, activeRoscoContext.scopeKey);
  }, [activeRoscoContext.scopeKey, currentIndex, dayKey, feedback, hits, plays, roscoWords.length, statuses]);

  useEffect(() => {
    if (dayStatus === "completed") {
      return;
    }

    const currentStatus = statuses[currentIndex];
    if (currentStatus === "pending" || currentStatus === "passed") {
      return;
    }

    const nextIndex = findNextPlayableIndex(statuses, currentIndex);
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, dayStatus, statuses]);

  const boardSize = isMobile ? 290 : 380;
  const letterSize = isMobile ? 31 : 36;
  const radius = boardSize / 2 - letterSize / 2 - 8;

  const moveToNext = (nextStatuses: LetterStatus[]) => {
    const nextIndex = findNextPlayableIndex(nextStatuses, currentIndex);
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentEntry || isFinished) {
      return;
    }

    const normalizedAnswer = normalizeText(answer);
    if (!normalizedAnswer) {
      return;
    }

    const isCorrect = normalizeText(currentEntry.word) === normalizedAnswer;

    setStatuses((prevStatuses) => {
      const nextStatuses = [...prevStatuses];
      nextStatuses[currentIndex] = isCorrect ? "correct" : "wrong";
      moveToNext(nextStatuses);
      return nextStatuses;
    });

    setPlays((prev) => prev + 1);
    if (isCorrect) {
      setHits((prev) => prev + 1);
      setFeedback("Correcto");
    } else {
      setFeedback(`Incorrecto. Era: ${currentEntry.word}`);
    }
    setAnswer("");
  };

  const handlePass = () => {
    if (!currentEntry || isFinished) {
      return;
    }

    setStatuses((prevStatuses) => {
      const nextStatuses = [...prevStatuses];
      if (nextStatuses[currentIndex] === "pending") {
        nextStatuses[currentIndex] = "passed";
      }
      moveToNext(nextStatuses);
      return nextStatuses;
    });

    setFeedback("Pasapalabra");
    setPlays((prev) => prev + 1);
    setAnswer("");
  };

  const getLetterColor = (index: number): string => {
    if (!isFinished && index === currentIndex) {
      return "#f1c40f";
    }
    switch (statuses[index]) {
      case "correct":
        return "#2ecc71";
      case "wrong":
        return "#e74c3c";
      case "passed":
        return "#f39c12";
      default:
        return "#1565c0";
    }
  };

  return (
    <Layout hits={hits} plays={plays}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 2.5,
          px: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          {`${t.findDifferentEmoji2} - ${dayMeta.label}`}
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontWeight: 700, fontSize: 14 }}>
          {`Pendientes: ${unresolvedCount}`}
        </Typography>

        <Box
          sx={{
            width: boardSize,
            height: boardSize,
            background: "#fff",
            borderRadius: "50%",
            position: "relative",
            border: "4px solid rgba(21, 101, 192, 0.25)",
            boxShadow: "inset 0 0 0 8px rgba(21, 101, 192, 0.08)",
          }}
        >
          {roscoWords.map((entry, index) => {
            const angle = (-90 + (index * 360) / roscoWords.length) * (Math.PI / 180);
            const x = boardSize / 2 + radius * Math.cos(angle) - letterSize / 2;
            const y = boardSize / 2 + radius * Math.sin(angle) - letterSize / 2;

            return (
              <Box
                key={entry.letter}
                sx={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: letterSize,
                  height: letterSize,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getLetterColor(index),
                  color: !isFinished && index === currentIndex ? "#1f2937" : "#fff",
                  fontWeight: 700,
                  fontSize: isMobile ? 15 : 16,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                }}
              >
                {entry.letter}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            p: 2,
            backdropFilter: "blur(2px)",
          }}
        >
          {!isFinished && currentEntry && (
            <>
              <Typography sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
                {currentEntry.startOrContain === "start" ? "Comienza" : "Contiene"} con la letra {currentEntry.letter}
              </Typography>
              <Typography sx={{ color: "#fff", mb: 2 }}>
                {currentEntry.definition}
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
              >
                <TextField
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  size="small"
                  placeholder="Escribe tu respuesta"
                  disabled={isFinished}
                  sx={{
                    flex: 1,
                    minWidth: 200,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
                <Button type="submit" variant="contained" sx={{ minWidth: 96 }}>
                  Responder
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handlePass}
                  sx={{ color: "#fff", borderColor: "#fff", minWidth: 118 }}
                >
                  Pasapalabra
                </Button>
              </Box>
            </>
          )}

          {isFinished && (
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
                Rosco completado
              </Typography>
              <Typography sx={{ color: "#fff", mt: 0.5, mb: 2 }}>
                Resultado: {hits}/{roscoWords.length}
              </Typography>
              <Button variant="contained" onClick={() => navigate("/")}> 
                Volver al inicio
              </Button>
            </Box>
          )}

          <Typography
            sx={{
              color: "#fff",
              mt: isFinished ? 2 : 1.5,
              minHeight: 24,
              fontWeight: 600,
            }}
          >
            {feedback}
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
};

export default Game;
