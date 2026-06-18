import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useIsMobile } from "../hooks/useIsMobile";
import { useLanguage } from "../i18n/LanguageContext";
import { getActiveRoscoContext } from "../data/weeklyRoscos";
import {
  DayKey,
  LetterStatus,
  PlayState,
  deriveStatus,
  getCurrentDayKey,
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

const normalizeKeyUpper = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
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

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { t, currentLanguage } = useLanguage();

  const todayKey = getCurrentDayKey();
  const rawDay = searchParams.get("day");
  const dayKey: DayKey = isDayKey(rawDay) ? rawDay : todayKey;
  const activeRoscoContext = useMemo(() => getActiveRoscoContext(new Date(), currentLanguage), [currentLanguage]);
  const roscoWords = activeRoscoContext.roscos[dayKey];
  const initialDayState = useMemo(
    () => getDayState(dayKey, roscoWords.length, activeRoscoContext.scopeKey),
    [activeRoscoContext.scopeKey, dayKey, roscoWords.length],
  );

  const [hits, setHits] = useState(initialDayState.hits);
  const [plays, setPlays] = useState(initialDayState.plays);
  const [currentIndex, setCurrentIndex] = useState(initialDayState.currentIndex);
  const [statuses, setStatuses] = useState<LetterStatus[]>(initialDayState.statuses);
  const [answerChars, setAnswerChars] = useState<string[]>([]);
  const [lockedIndex, setLockedIndex] = useState<number>(-1);
  const [lockedConsumed, setLockedConsumed] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [feedback, setFeedback] = useState(initialDayState.feedback);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialDayState.remainingSeconds,
  );
  const [playState, setPlayState] = useState<PlayState>(initialDayState.playState);

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
    setRemainingSeconds(initialDayState.remainingSeconds);
    setPlayState(initialDayState.playState);
  }, [dayKey, initialDayState, navigate]);

  const unresolvedCount = useMemo(() => {
    return statuses.filter((status) => status === "pending" || status === "passed")
      .length;
  }, [statuses]);

  const dayStatus = deriveStatus(statuses, plays);
  const isFinished = dayStatus === "completed";
  const isTimeOver = remainingSeconds <= 0 && !isFinished;
  const currentEntry = isFinished ? null : roscoWords[currentIndex];
  const isTimerRunning = playState === "running" && !isFinished && !isTimeOver;
  const showResumeOverlay = !isFinished && !isTimeOver && playState !== "running";

  useEffect(() => {
    if (!currentEntry || isFinished || isTimeOver) {
      setAnswerChars([]);
      setLockedIndex(-1);
      return;
    }

    const normalizedWord = normalizeKeyUpper(currentEntry.word);
    const forcedLetter = normalizeKeyUpper(currentEntry.letter).charAt(0);
    const forcedIdx =
      currentEntry.startOrContain === "start"
        ? 0
        : Math.max(0, normalizedWord.indexOf(forcedLetter));
    const nextChars = Array.from({ length: normalizedWord.length }, () => "");
    nextChars[forcedIdx] = forcedLetter;

    setLockedIndex(forcedIdx);
    setLockedConsumed(false);
    setAnswerChars(nextChars);
  }, [currentEntry, isFinished, isTimeOver]);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimerRunning]);

  useEffect(() => {
    if (remainingSeconds === 0 && !isFinished) {
      setFeedback(t.feedbackTimeout);
      setPlayState("paused");
    }
  }, [isFinished, remainingSeconds]);

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
      remainingSeconds,
      playState,
    }, activeRoscoContext.scopeKey);
  }, [activeRoscoContext.scopeKey, currentIndex, dayKey, feedback, hits, playState, plays, remainingSeconds, roscoWords.length, statuses]);

  useEffect(() => {
    if (dayStatus === "completed" || pendingAdvance) {
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
  }, [currentIndex, dayStatus, pendingAdvance, statuses]);

  const boardSize = isMobile ? 290 : 380;
  const letterSize = isMobile ? 31 : 36;
  const radius = boardSize / 2 - letterSize / 2 - 8;

  const playErrorSound = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // audio not supported
    }
  };

  const moveToNext = (nextStatuses: LetterStatus[]) => {
    const nextIndex = findNextPlayableIndex(nextStatuses, currentIndex);
    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
    }
  };

  const commitAnswer = (chars: string[]) => {
    if (!currentEntry || isFinished || isTimeOver) {
      return;
    }

    if (chars.some((char) => char.length === 0)) {
      return;
    }

    const normalizedAnswer = normalizeText(chars.join(""));

    const isCorrect = normalizeText(currentEntry.word) === normalizedAnswer;

    setStatuses((prevStatuses) => {
      const nextStatuses = [...prevStatuses];
      nextStatuses[currentIndex] = isCorrect ? "correct" : "wrong";
      if (isCorrect) {
        moveToNext(nextStatuses);
      }
      return nextStatuses;
    });

    setPlays((prev) => prev + 1);
    if (isCorrect) {
      setHits((prev) => prev + 1);
      setFeedback(t.feedbackCorrect);
    } else {
      setFeedback(`Incorrecto. Era: ${currentEntry.word}`);
      setPendingAdvance(true);
      setPlayState("paused");
      playErrorSound();
      if (navigator.vibrate) {
        navigator.vibrate([150, 60, 150]);
      }
    }
  };

  const handleKeyInput = (rawKey: string) => {
    if (!currentEntry || isFinished || isTimeOver || showResumeOverlay) {
      return;
    }

    if (rawKey === "{enter}" || rawKey === "ENTER") {
      commitAnswer(answerChars);
      return;
    }

    if (rawKey === "{bksp}" || rawKey === "BACKSPACE") {
      setAnswerChars((previous) => {
        const next = [...previous];
        for (let index = next.length - 1; index >= 0; index -= 1) {
          if (index === lockedIndex) {
            continue;
          }
          if (next[index]) {
            next[index] = "";
            break;
          }
        }
        return next;
      });
      return;
    }

    const key = normalizeKeyUpper(rawKey);
    if (!/^[A-Z]$/.test(key)) {
      return;
    }

    if (lockedIndex >= 0 && key === answerChars[lockedIndex] && !lockedConsumed) {
      setLockedConsumed(true);
      return;
    }

    setAnswerChars((previous) => {
      const next = [...previous];
      const fillIndex = next.findIndex(
        (char, index) => !char && index !== lockedIndex,
      );
      if (fillIndex < 0) {
        return previous;
      }

      next[fillIndex] = key;
      if (next.every((char) => char.length > 0)) {
        commitAnswer(next);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const isLetter = /^[a-zA-Z]$/.test(key);
      const isBackspace = key === "Backspace";
      const isEnter = key === "Enter";

      if (!isLetter && !isBackspace && !isEnter) {
        return;
      }

      event.preventDefault();
      if (isBackspace) {
        handleKeyInput("BACKSPACE");
      } else if (isEnter) {
        handleKeyInput("ENTER");
      } else {
        handleKeyInput(key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, handleKeyInput]);

  const handlePass = () => {
    if (!currentEntry || isFinished || isTimeOver) {
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

    setFeedback(t.feedbackPassed);
    setPlays((prev) => prev + 1);
    setPlayState("paused");
  };

  const handleResume = () => {
    if (isFinished || isTimeOver) {
      return;
    }

    if (pendingAdvance) {
      setPendingAdvance(false);
      moveToNext(statuses);
    }

    setPlayState("running");
  };

  const getLetterColor = (index: number): string => {
    if (!isFinished && !pendingAdvance && index === currentIndex) {
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
    <Layout headerRightText={formatTime(remainingSeconds)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 2,
          px: 1,
        }}
      >
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
                  color: !isFinished && !pendingAdvance && index === currentIndex ? "#1f2937" : "#fff",
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

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 5,
              textAlign: "center",
            }}
          >
            {currentEntry && !isTimeOver && !isFinished && (
              <Box sx={{ maxWidth: boardSize * 0.52 }}>
                <Typography
                  sx={{
                    color: "#44536b",
                    fontWeight: 800,
                    fontSize: isMobile ? 18 : 22,
                    mb: 1,
                    opacity: showResumeOverlay ? 0 : 1,
                    transition: "opacity 220ms ease",
                  }}
                >
                  {currentEntry.startOrContain === "start"
                    ? `${t.startsWith} ${currentEntry.letter}.`
                    : `${t.contains} ${currentEntry.letter}.`}
                </Typography>
                <Typography
                  sx={{
                    color: "#5f6f86",
                    fontWeight: 600,
                    fontSize: isMobile ? 14 : 16,
                    lineHeight: 1.35,
                    opacity: showResumeOverlay ? 0 : 1,
                    transition: "opacity 220ms ease",
                  }}
                >
                  {currentEntry.definition}
                </Typography>
              </Box>
            )}

            {showResumeOverlay && (
              <Button
                type="button"
                onClick={handleResume}
                sx={{
                  position: "absolute",
                  width: isMobile ? 126 : 148,
                  height: isMobile ? 126 : 148,
                  minWidth: 0,
                  borderRadius: "50%",
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: isMobile ? 18 : 20,
                  lineHeight: 1.1,
                  boxShadow: "0 16px 28px rgba(46, 204, 113, 0.35)",
                  opacity: showResumeOverlay ? 1 : 0,
                  transform: showResumeOverlay ? "scale(1)" : "scale(0.92)",
                  transition: "opacity 220ms ease, transform 220ms ease",
                  "&:hover": {
                    backgroundColor: "#27ae60",
                    boxShadow: "0 18px 32px rgba(39, 174, 96, 0.38)",
                  },
                }}
              >
                {playState === "idle" ? t.startGame : t.continueGameBtn}
              </Button>
            )}

            {isTimeOver && (
              <Box sx={{ maxWidth: boardSize * 0.52 }}>
                <Typography
                  sx={{
                    color: "#e74c3c",
                    fontWeight: 800,
                    fontSize: isMobile ? 22 : 28,
                    mb: 1,
                  }}
                >
                  {t.feedbackTimeout}
                </Typography>
                <Typography sx={{ color: "#5f6f86", fontWeight: 600 }}>
                  {`${t.hitsLabel}: ${hits} · ${t.pendingLabel}: ${unresolvedCount}`}
                </Typography>
              </Box>
            )}

            {isFinished && (
              <Box sx={{ maxWidth: boardSize * 0.52 }}>
                <Typography
                  sx={{
                    color: "#2ecc71",
                    fontWeight: 800,
                    fontSize: isMobile ? 22 : 28,
                    mb: 1,
                  }}
                >
                  {t.roscoCompleted}
                </Typography>
                <Typography sx={{ color: "#5f6f86", fontWeight: 600 }}>
                  {`${t.resultLabel}: ${hits}/${roscoWords.length}`}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

<Box sx={{ textAlign: "center" }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handlePass}
                  disabled={showResumeOverlay}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    minWidth: 154,
                    fontWeight: 700,
                  }}
                >
                  {t.feedbackPassed}
                </Button>
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
          {!isFinished && !isTimeOver && currentEntry && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 0.2,
                  flexWrap: "wrap",
                  mb: 2,
                }}
              >
                {answerChars.map((char, index) => (
                  <Box
                    key={`${currentEntry.letter}-${index}`}
                    sx={{
                      width: isMobile ? 32 : 42,
                      height: isMobile ? 32 : 42,
                      borderRadius: 1,
                      border: "2px solid #1f2f64",
                      backgroundColor: "#fff",
                      color: index === lockedIndex ? "#1f2f64" : "#111827",
                      fontWeight: 800,
                      fontSize: isMobile ? 18 : 24,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      pb: 0.5,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                      opacity: showResumeOverlay ? 0.8 : 1,
                    }}
                  >
                    {char || "_"}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {isFinished && (
            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" onClick={() => navigate("/")}>
                {t.backToHome}
              </Button>
            </Box>
          )}

          {isTimeOver && (
            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" onClick={() => navigate("/")}>
                {t.backToHome}
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

      <VirtualKeyboard
        onKeyPress={handleKeyInput}
        includeActionKeys
      />
    </Layout>
  );
};

export default Game;
