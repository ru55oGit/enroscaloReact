import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hypher from "hypher";
import spanishHyphenation from "hyphenation.es";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import HouseAdBanner from "../ads/HouseAdBanner";
import HowToPlayCollapse from "../components/HowToPlayCollapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { useRewardedAd } from "../ads/useRewardedAd";
import RewardedAdModal from "../ads/RewardedAdModal";
import { useIsMobile } from "../hooks/useIsMobile";
import { useLanguage } from "../i18n/LanguageContext";
import { getActiveRoscoContext, getActiveBonusContext, getGameNumber } from "../data/weeklyRoscos";
import { recordLastPlayed } from "../utils/lastPlayedState";
import { buildRoscoShareText, formatDurationLabel } from "../utils/shareImage";
import { track } from "../lib/analytics";
import {
  DayKey,
  LetterStatus,
  PlayState,
  WEEK_DAYS,
  deriveStatus,
  getCurrentDayKey,
  getDayState,
  isDayAvailable,
  isDayKey,
  saveDayState,
  DEFAULT_ROSCO_TIME_SECONDS,
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

const spanishHypher = new Hypher(spanishHyphenation as Record<string, unknown>);

const isVowelChar = (c: string): boolean => /[aeiouáéíóúü]/i.test(c);

const getRecommendedBreakPoint = (chars: string[], maxChunkLength: number): number => {
  const safeMax = Math.max(2, Math.min(maxChunkLength, chars.length - 1));
  const preferredMin = Math.max(2, safeMax - 3);
  for (let i = safeMax; i >= preferredMin; i -= 1) {
    const prev = chars[i - 1];
    const next = chars[i];
    if (!prev || !next) continue;
    if (isVowelChar(prev) !== isVowelChar(next) || (isVowelChar(prev) && isVowelChar(next))) return i;
  }
  return safeMax;
};

const getSyllableBreakPoint = (word: string, maxChunkLength: number): number | null => {
  if (!word || maxChunkLength < 2 || word.length <= 2) return null;
  const safeMax = Math.max(2, Math.min(maxChunkLength, word.length - 1));
  if (safeMax < 2) return null;

  const syllables = spanishHypher.hyphenate(word);
  if (!Array.isArray(syllables) || syllables.length <= 1) return null;

  const breakpoints: number[] = [];
  let consumed = 0;
  syllables.slice(0, -1).forEach((syl: string) => {
    consumed += syl.length;
    breakpoints.push(consumed);
  });

  const strong = breakpoints.filter((p) => p >= 2 && p <= safeMax && word.length - p >= 2);
  if (strong.length > 0) return strong[strong.length - 1];

  const weak = breakpoints.filter((p) => p >= 2 && p <= safeMax);
  if (weak.length > 0) return weak[weak.length - 1];

  return null;
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

const RELOAD_TIME_SECONDS = 120;

// weekStart es el domingo de esa semana ("YYYY-MM-DD"); WEEK_DAYS trae los
// días en ese mismo orden (sun=0), así que sumarle el índice da la fecha
// real del rosco — no la fecha de hoy, que es lo que se compartía antes
// (mal: si compartís un sábado el rosco del lunes, tiene que decir lunes).
const dateFromWeekStart = (weekStart: string, dayKey: DayKey): Date => {
  const [year, month, day] = weekStart.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayIndex = WEEK_DAYS.findIndex((d) => d.key === dayKey);
  date.setDate(date.getDate() + Math.max(0, dayIndex));
  return date;
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
  const isBonus = rawDay === "bonus";
  const dayKey: DayKey = (!isBonus && isDayKey(rawDay)) ? rawDay : todayKey;

  const activeRoscoContext = useMemo(() => getActiveRoscoContext(new Date(), currentLanguage), [currentLanguage]);
  const bonusContext = useMemo(() => isBonus ? getActiveBonusContext(new Date(), currentLanguage) : null, [isBonus, currentLanguage]);

  const roscoWords = isBonus ? (bonusContext?.rosco ?? []) : activeRoscoContext.roscos[dayKey];
  const activeScopeKey = isBonus ? (bonusContext?.scopeKey ?? "bonus") : activeRoscoContext.scopeKey;
  const stateDayKey: DayKey = isBonus ? "sat" : dayKey;

  const initialDayState = useMemo(
    () => getDayState(stateDayKey, roscoWords.length, activeScopeKey),
    [activeScopeKey, stateDayKey, roscoWords.length],
  );

  const [hits, setHits] = useState(initialDayState.hits);
  const [plays, setPlays] = useState(initialDayState.plays);
  const [currentIndex, setCurrentIndex] = useState(initialDayState.currentIndex);
  const [statuses, setStatuses] = useState<LetterStatus[]>(initialDayState.statuses);
  const [answerChars, setAnswerChars] = useState<string[]>([]);
  // Arranca cerrado con un banner en su lugar; se abre al tocar un casillero
  // de la respuesta. No se vuelve a cerrar solo entre palabras — el rosco
  // avanza rápido, cerrarlo en cada letra sería muy molesto.
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(false);
  const [feedback, setFeedback] = useState(initialDayState.feedback);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialDayState.remainingSeconds,
  );
  const [playState, setPlayState] = useState<PlayState>(initialDayState.playState);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("enroscalo_sound_enabled") !== "false";
  });
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [sharingResult, setSharingResult] = useState(false);
  const canShareResult = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    recordLastPlayed();
  }, []);

  useEffect(() => {
    if (!isBonus && !isDayAvailable(dayKey)) {
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
  }, [dayKey, isBonus, initialDayState, navigate]);

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

  // Recompensa de rewarded ad cuando se acaba el tiempo: suma tiempo y
  // reanuda el rosco en vez de dejarlo cortado con palabras pendientes.
  // Mismo monto que tenía el botón "Recargar tiempo" gratuito de antes.
  const grantExtraTime = useCallback(() => {
    setRemainingSeconds((prev) => prev + RELOAD_TIME_SECONDS);
    setFeedback("");
    setPlayState("running");
  }, []);

  const rewardedAd = useRewardedAd("enroscado-timeover-rewarded", "enroscado", currentLanguage, grantExtraTime);

  useEffect(() => {
    if (!currentEntry || isFinished || isTimeOver) {
      setAnswerChars([]);
      return;
    }

    const normalizedWord = normalizeKeyUpper(currentEntry.word);
    setAnswerChars(Array.from({ length: normalizedWord.length }, () => ""));
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
      // "timeout" es la única causa real de game over acá: no hay otra
      // forma de "perder" un rosco más que agotar el tiempo.
      track("game_over", {
        mode: isBonus ? "bonus" : dayKey,
        score: hits,
        duration_sec: DEFAULT_ROSCO_TIME_SECONDS,
        reason: "timeout",
      });
    }
  }, [isFinished, remainingSeconds]);

  // Se guarda si isFinished ya era true al montar (día ya completado antes,
  // solo se está viendo el resultado) para no re-trackear una finalización
  // vieja como si fuera nueva en esta sesión.
  const prevIsFinishedRef = useRef(isFinished);
  useEffect(() => {
    if (isFinished && !prevIsFinishedRef.current) {
      track("level_complete", {
        mode: isBonus ? "bonus" : dayKey,
        score: hits,
        duration_sec: DEFAULT_ROSCO_TIME_SECONDS - remainingSeconds,
      });
    }
    prevIsFinishedRef.current = isFinished;
  }, [isFinished]);

  useEffect(() => {
    if (statuses.length !== roscoWords.length) {
      return;
    }

    saveDayState(stateDayKey, {
      hits,
      plays,
      currentIndex,
      statuses,
      feedback,
      remainingSeconds,
      playState,
    }, activeScopeKey);
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tileSize = isMobile ? 32 : 42;
  const charsPerRow = Math.max(6, Math.floor((Math.min(520, windowWidth) - 48 + 1.6) / (tileSize + 1.6)));

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

  const playSuccessSound = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
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
      if (soundEnabled) playSuccessSound();
      if (navigator.vibrate) navigator.vibrate([80]);
    } else {
      setFeedback(`${t.feedbackWrong} ${currentEntry.word}`);
      setPendingAdvance(true);
      setPlayState("paused");
      if (soundEnabled) playErrorSound();
      if (navigator.vibrate) navigator.vibrate([150, 60, 150]);
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

    setAnswerChars((previous) => {
      const next = [...previous];
      const fillIndex = next.findIndex((char) => !char);
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

    if (playState === "idle") {
      track("game_start", { mode: isBonus ? "bonus" : dayKey });
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

  // No hay forma de confirmar a qué red terminó yendo el share (WhatsApp o
  // Facebook son solo accesos visuales al mismo navigator.share nativo del
  // sistema — es la única forma confiable de adjuntar una imagen al
  // compartir desde la web, los links tipo wa.me no soportan archivos).
  const handleShareResult = async (method: "whatsapp" | "facebook") => {
    if (!canShareResult || sharingResult) return;
    setSharingResult(true);
    track("share", { method, mode: isBonus ? "bonus" : dayKey });

    try {
      const roscoWeekStart = isBonus ? bonusContext?.weekStart : activeRoscoContext.weekStart;
      const roscoDate = roscoWeekStart ? dateFromWeekStart(roscoWeekStart, stateDayKey) : new Date();

      const shareEntries = roscoWords.map((entry, index) => ({
        letter: entry.letter,
        status:
          statuses[index] === "correct"
            ? ("correct" as const)
            : statuses[index] === "wrong"
              ? ("wrong" as const)
              : ("unanswered" as const),
      }));

      const dateLabel = new Intl.DateTimeFormat(currentLanguage, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(roscoDate);

      const stats = {
        gameNumber: getGameNumber(roscoDate),
        hits,
        total: roscoWords.length,
        durationLabel: formatDurationLabel(DEFAULT_ROSCO_TIME_SECONDS - remainingSeconds),
        dateLabel,
        // Racha de días: todavía no hay tracking de esto, se deja sin pasar
        // (ver comentario en RoscoShareStats, shareImage.ts).
      };

      const shareLabels = {
        resultPerfect: t.shareResultPerfect,
        resultGreat: t.shareResultGreat,
        resultGood: t.shareResultGood,
        resultLow: t.shareResultLow,
        ctaPhrase: t.shareCtaPhrase,
        streakLabel: t.shareStreakLabel,
      };
      const targetUrl = "https://www.enroscado.com";
      // Antes se adjuntaba la imagen directo con navigator.share({files:[...]})
      // — pero con un archivo adjunto WhatsApp deja de tratar el share como
      // "link" y no arma la tarjeta clickeable (la URL queda como texto
      // plano, ver conversación). En vez de la imagen, se comparte un link a
      // boludeando-ads que sirve HTML con <meta og:image> para los bots de
      // preview (ahí sí se genera el PNG, server-side) y redirige directo a
      // una persona real que clickee — imagen Y link clickeable a la vez.
      const resultMessage =
        hits >= stats.total ? shareLabels.resultPerfect
        : hits >= 20 ? shareLabels.resultGreat
        : hits >= 10 ? shareLabels.resultGood
        : shareLabels.resultLow;
      const statusesParam = shareEntries.map((e) => (e.status === "correct" ? "c" : e.status === "wrong" ? "w" : "u")).join("");
      const shareLinkPayload = {
        domain: "www.enroscado.com",
        game: "Enroscado",
        n: String(stats.gameNumber),
        hits: String(stats.hits),
        total: String(stats.total),
        dur: stats.durationLabel,
        date: dateLabel,
        msg: resultMessage,
        cta: shareLabels.ctaPhrase,
        statuses: statusesParam,
        target: targetUrl,
        // El PNG se cachea 1 año (immutable) del lado de boludeando-ads —
        // bumpear este número cada vez que cambie el diseño del PNG
        // server-side, sino un link ya compartido sigue sirviendo la
        // versión vieja (pasó de verdad con el rediseño del anillo).
        v: "5",
      };

      const shareImageApiUrl = new URL("https://ads-api.boludeando.com/api/share/rosco");
      Object.entries(shareLinkPayload).forEach(([key, value]) => {
        if (value) shareImageApiUrl.searchParams.set(key, value);
      });

      // La URL de arriba (con 11 query params) aparece como texto plano
      // larguísimo en el cuerpo del mensaje de WhatsApp debajo de la
      // preview — se pide un short link al mismo payload. Si el pedido
      // falla (red caída, etc.) se comparte igual con la URL larga en vez
      // de romper el share.
      let shareUrl = shareImageApiUrl.toString();
      try {
        const linkResponse = await fetch("https://ads-api.boludeando.com/api/share/rosco/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shareLinkPayload),
        });
        if (linkResponse.ok) {
          const { id } = await linkResponse.json();
          if (id) shareUrl = `https://ads-api.boludeando.com/api/s/${id}`;
        }
      } catch {
        // Sigue con shareUrl = la URL larga ya armada arriba.
      }

      const shareData: ShareData = {
        title: "Enroscado",
        text: buildRoscoShareText(stats, shareLabels),
        url: shareUrl,
      };

      await navigator.share(shareData);
    } catch {
      // Canceló el panel de compartir sin elegir nada: no hay nada que hacer.
    } finally {
      setSharingResult(false);
    }
  };

  const currentWordStr = currentEntry ? normalizeKeyUpper(currentEntry.word) : "";
  const maxChunkLength = Math.max(2, charsPerRow - 1);
  const tileBreakPoint = (currentWordStr && currentWordStr.length > charsPerRow)
    ? (getSyllableBreakPoint(currentWordStr, maxChunkLength) ??
       getRecommendedBreakPoint(currentWordStr.split(""), maxChunkLength))
    : null;
  const tileRow1 = tileBreakPoint !== null ? answerChars.slice(0, tileBreakPoint) : answerChars;
  const tileRow2 = tileBreakPoint !== null ? answerChars.slice(tileBreakPoint) : [];

  return (
    <Layout
      headerRightText={formatTime(remainingSeconds)}
      onBack={() => {
        setPlayState("paused");
        navigate(-1);
      }}
    >
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
                {currentEntry.entryType === "emoji" ? (
                  <Typography
                    sx={{
                      fontSize: isMobile ? 64 : 80,
                      lineHeight: 1,
                      mt: 0.5,
                      opacity: showResumeOverlay ? 0 : 1,
                      transition: "opacity 220ms ease",
                    }}
                  >
                    {currentEntry.definition}
                  </Typography>
                ) : (
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
                )}
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

        {!isFinished && (
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handlePass}
              disabled={showResumeOverlay}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                minWidth: 200,
                fontWeight: 700,
              }}
            >
              {t.feedbackPassed}
            </Button>
          </Box>
        )}
        {!isFinished && !isTimeOver && currentEntry && (
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 0.2 }}>
                {tileRow1.map((char, i) => (
                  <Box
                    key={`${currentEntry.letter}-${i}`}
                    onClick={() => setKeyboardOpen(true)}
                    sx={{
                      width: tileSize,
                      height: tileSize,
                      borderRadius: 1,
                      border: "2px solid #1f2f64",
                      backgroundColor: "#fff",
                      color: "#111827",
                      fontWeight: 800,
                      fontSize: isMobile ? 18 : 24,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      pb: 0.5,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                      opacity: showResumeOverlay ? 0.8 : 1,
                      cursor: "pointer",
                    }}
                  >
                    {char || "_"}
                  </Box>
                ))}
                {tileRow2.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "flex-end", color: "#fff", fontWeight: 800, fontSize: isMobile ? 18 : 24, pb: 0.5, ml: 0.3 }}>
                    -
                  </Box>
                )}
              </Box>
              {tileRow2.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", gap: 0.2 }}>
                  {tileRow2.map((char, i) => (
                    <Box
                      key={`${currentEntry.letter}-${(tileBreakPoint ?? 0) + i}`}
                      onClick={() => setKeyboardOpen(true)}
                      sx={{
                        width: tileSize,
                        height: tileSize,
                        borderRadius: 1,
                        border: "2px solid #1f2f64",
                        backgroundColor: "#fff",
                        color: "#111827",
                        fontWeight: 800,
                        fontSize: isMobile ? 18 : 24,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        pb: 0.5,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                        opacity: showResumeOverlay ? 0.8 : 1,
                        cursor: "pointer",
                      }}
                    >
                      {char || "_"}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          

          {isFinished && (
            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" onClick={() => navigate("/")}>
                {t.backToHome}
              </Button>
            </Box>
          )}
        </Box>
        )}
        {!isFinished && (
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
            {isTimeOver && (
              <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                <Button
                  variant="contained"
                  onClick={rewardedAd.requestAd}
                  disabled={!rewardedAd.canShowAd}
                  sx={{
                    backgroundColor: "#f0b429",
                    color: "#1a1a1a",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: 999,
                    minWidth: 200,
                    "&:hover": { backgroundColor: "#d99f1a" },
                    "&.Mui-disabled": { backgroundColor: "rgba(240,180,41,0.35)", color: "rgba(26,26,26,0.5)" },
                  }}
                >
                  {rewardedAd.loadingAd ? "..." : t.reloadTime}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/?scrollTo=weekly")}
                  sx={{ color: "#fff", borderColor: "#fff", fontWeight: 700, minWidth: 200, mb: 2 }}
                >
                  {t.backToHome}
                </Button>
              </Box>
            )}
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {feedback}
            </Typography>
          </Box>
        )}

        {isFinished && canShareResult && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid #d7d7d7",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#222" }}>
              {t.shareResultTitle}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Box
                component="button"
                type="button"
                onClick={() => handleShareResult("whatsapp")}
                disabled={sharingResult}
                aria-label="Compartir por WhatsApp"
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#25D366",
                  color: "#fff",
                  cursor: sharingResult ? "default" : "pointer",
                  opacity: sharingResult ? 0.6 : 1,
                  transition: "transform 0.15s ease",
                  "&:hover": { transform: sharingResult ? "none" : "translateY(-2px)" },
                }}
              >
                <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.32 4.92L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.58.12.17 1.75 2.67 4.3 3.74.6.26 1.07.41 1.44.52.6.19 1.15.17 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29-.25-.12-1.48-.73-1.71-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.37-.78-1.87-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01Z" />
                </svg>
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => handleShareResult("facebook")}
                disabled={sharingResult}
                aria-label="Compartir por Facebook"
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#1877F2",
                  color: "#fff",
                  cursor: sharingResult ? "default" : "pointer",
                  opacity: sharingResult ? 0.6 : 1,
                  transition: "transform 0.15s ease",
                  "&:hover": { transform: sharingResult ? "none" : "translateY(-2px)" },
                }}
              >
                <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
                </svg>
              </Box>
            </Box>
          </Box>
        )}

        {isFinished && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 3,
              backgroundColor: "#fff",
              border: "1px solid #d7d7d7",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              p: 2,
              color: "#222",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/?scrollTo=weekly")}
                sx={{ color: "#d84331", borderColor: "#d84331", fontWeight: 700 }}
              >
                {t.backToHome}
              </Button>
            </Box>
            {roscoWords.map((entry, index) => (
              <Box
                key={entry.letter}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  py: 1,
                  borderBottom: index < roscoWords.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: getLetterColor(index),
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                    mt: 0.3,
                  }}
                >
                  {entry.letter}
                </Box>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                  {entry.entryType === "emoji" ? (
                    <Typography sx={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
                      {entry.definition}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: "#777", lineHeight: 1.3 }}>
                      {entry.definition}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: getLetterColor(index) }}>
                    {entry.word}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <HowToPlayCollapse title={t.howToPlayTitle} body={t.howToPlayText} />

        <HouseAdBanner slot="enroscado-game-banner" gameSlug="enroscado" locale={currentLanguage} />
      </Box>

      <VirtualKeyboard
        onKeyPress={handleKeyInput}
        includeActionKeys
        soundEnabled={soundEnabled}
        hidden={showResumeOverlay || isFinished || isTimeOver}
        open={keyboardOpen}
        onSoundToggle={() => {
          setSoundEnabled((prev) => {
            const next = !prev;
            localStorage.setItem("enroscalo_sound_enabled", String(next));
            return next;
          });
        }}
        onPass={handlePass}
        hasPtAccents={/[áàâãéêíóôõúç]/i.test(currentEntry?.word ?? "")}
        onClose={() => setKeyboardOpen(false)}
      />

      <RewardedAdModal
        locale={currentLanguage}
        open={rewardedAd.showingAd}
        adCreative={rewardedAd.adCreative}
        canConfirmReward={rewardedAd.canConfirmReward}
        secondsUntilCanConfirm={rewardedAd.secondsUntilCanConfirm}
        onConfirm={rewardedAd.handleAdWatched}
        onSkip={rewardedAd.handleAdSkipped}
        onImageClick={rewardedAd.handleImageClick}
        confirmLabel={t.rewardedAdConfirmButton}
        skipLabel={t.rewardedAdSkipButton}
        waitLabel={t.rewardedAdWaitLabel}
      />
    </Layout>
  );
};

export default Game;
