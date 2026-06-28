import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import EmojiCarousel from "../components/EmojiCarousel";
import { useIsMobile } from "../hooks/useIsMobile";
import { getActiveRoscoContext } from "../data/weeklyRoscos";
import {
  upsertHistoryDay,
  getCumulativeStats,
  getBestStreak,
  CumulativeStats,
  BestStreak,
} from "../utils/historyStore";
import {
  DayKey,
  WEEK_DAYS,
  getCurrentDayKey,
  getDayMeta,
  getDayState,
  getRoscoStatusLabel,
  getWeeklyState,
  isDayAvailable,
} from "../utils/weeklyRoscoState";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const refresh = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const isMobile = useIsMobile();
  const miniRoscoSize = isMobile ? 93 : 118;
  const miniDotSize = isMobile ? 9 : 11;
  const miniDotFontSize = isMobile ? 5 : 6;

  const activeRoscoContext = useMemo(() => getActiveRoscoContext(new Date(), currentLanguage), [refreshKey, currentLanguage]);
  const weeklyState = useMemo(
    () => getWeeklyState(26, activeRoscoContext.scopeKey),
    [activeRoscoContext.scopeKey],
  );
  const currentDayKey = getCurrentDayKey();
  const [selectedDayKey, setSelectedDayKey] = useState<DayKey>(currentDayKey);

  const selectedDayMeta = getDayMeta(selectedDayKey);
  const selectedDayRosco = activeRoscoContext.roscos[selectedDayKey];
  const selectedDayState =
    weeklyState.days[selectedDayKey] ??
    getDayState(selectedDayKey, selectedDayRosco.length, activeRoscoContext.scopeKey);

  useEffect(() => {
    if (!isDayAvailable(selectedDayKey)) {
      setSelectedDayKey(currentDayKey);
    }
  }, [currentDayKey, selectedDayKey]);

  const nowHour = new Date().getHours();
  const greeting =
    nowHour < 12
      ? t.goodMorning
      : nowHour < 20
        ? t.goodAfternoon
        : t.goodEvening;

  const DAY_LABELS: Record<string, string> = {
    sun: t.daySun, mon: t.dayMon, tue: t.dayTue, wed: t.dayWed,
    thu: t.dayThu, fri: t.dayFri, sat: t.daySat,
  };

  const statusLabels = { completed: t.statusCompleted, inProgress: t.statusInProgress, notStarted: t.statusNotStarted, timedOut: t.statusTimedOut };

  const CATEGORY_META: Record<string, { label: string; icon: string }> = {
    "naturaleza": { label: "Naturaleza", icon: "🌿" },
    "ciencias": { label: "Ciencias", icon: "🔬" },
    "cultura-general": { label: "Cultura General", icon: "📚" },
    "gastronomia": { label: "Gastronomía", icon: "🍽️" },
    "arte-musica": { label: "Arte y Música", icon: "🎨" },
    "transporte": { label: "Transporte", icon: "🚗" },
    "deporte-juego": { label: "Deporte y Juego", icon: "⚽" },
    "mitologia-fantasia": { label: "Mitología y Fantasía", icon: "🐉" },
    "educacion-sociedad": { label: "Educación y Sociedad", icon: "🎓" },
    "personalidades": { label: "Personalidades", icon: "🌟" },
    // English categories
    "nature": { label: "Nature", icon: "🌿" },
    "science": { label: "Science", icon: "🔬" },
    "general": { label: "General Knowledge", icon: "📚" },
    "food": { label: "Food", icon: "🍽️" },
    "art-music": { label: "Art & Music", icon: "🎨" },
    "transport": { label: "Transport", icon: "🚗" },
    "sport-game": { label: "Sport & Games", icon: "⚽" },
    "myth-fantasy": { label: "Myth & Fantasy", icon: "🐉" },
    "society": { label: "Society", icon: "🎓" },
    "people": { label: "People", icon: "🌟" },
  };

  const LANG_LOCALE: Record<string, string> = { es: "es-AR", en: "en-US", pt: "pt-BR", fr: "fr-FR", de: "de-DE" };
  const DAY_OFFSETS: Record<DayKey, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

  const [cumulativeStats, setCumulativeStats] = useState<CumulativeStats>(() => getCumulativeStats());
  const [bestStreak, setBestStreak] = useState<BestStreak | null>(() => getBestStreak());

  useEffect(() => {
    for (const day of WEEK_DAYS) {
      if (!isDayAvailable(day.key)) continue;
      const dayState = weeklyState.days[day.key];
      if (!dayState) continue;
      const hasData = dayState.statuses.some((s) => s !== "pending");
      if (!hasData) continue;
      const rosco = activeRoscoContext.roscos[day.key];
      const [y, m, d] = activeRoscoContext.weekStart.split("-").map(Number);
      const date = new Date(y, m - 1, d + DAY_OFFSETS[day.key]);
      const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      upsertHistoryDay({
        weekStart: activeRoscoContext.weekStart,
        dayKey: day.key,
        date: isoDate,
        statuses: dayState.statuses,
        entries: rosco.map((e) => ({ word: e.word, definition: e.definition, letter: e.letter, category: e.category })),
      });
    }
    setCumulativeStats(getCumulativeStats());
    setBestStreak(getBestStreak());
  }, [weeklyState, activeRoscoContext]);

  const hasCategoryStats = Object.keys(cumulativeStats.byCategory).length > 0;
  const hasGlobalStats = cumulativeStats.correct + cumulativeStats.wrong + cumulativeStats.passed > 0;

  const getButtonLabel = (status: string): string => {
    if (status === "in_progress") return t.continueGame;
    if (status === "completed") return t.viewResult;
    return t.playButton;
  };

  return (
    <Layout showFooter={false}>
      <Box
        sx={{
          width: "100%",
          px: { xs: 1.5, md: 2 },
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LanguageSelector />

        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "1px",
            fontFamily: "Lobster, cursive",
            textAlign: "center",
            width: "100%",
          }}
        >
          {t.appTitle}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.64)",
            fontStyle: "italic",
            letterSpacing: "2px",
            width: "100%",
            textAlign: "center",
            fontSize: { xs: 18, md: 22 },
          }}
        >
          {t.tagline}
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>
          {greeting}
        </Typography>

        <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>
          {t.readyToPlay}
        </Typography>

        <Box
          sx={{
            width: "100%",
            borderRadius: 6,
            backgroundColor: "#eb6f62",
            p: 2,
            boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              borderRadius: 4,
              minHeight: 260,
              backgroundColor: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box sx={{ transform: "scale(0.95)" }}>
              <EmojiCarousel
                statuses={selectedDayState.statuses}
                activeIndex={
                  selectedDayState.status === "in_progress"
                    ? selectedDayState.currentIndex
                    : undefined
                }
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate(`/game?day=${selectedDayKey}`)}
              sx={{
                backgroundColor: "#f3f3f3",
                color: "#c63b2e",
                fontWeight: 800,
                borderRadius: 999,
                px: 4,
                py: 1.4,
                fontSize: 18,
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              {getButtonLabel(selectedDayState.status)}
            </Button>

            <Box sx={{ textAlign: { xs: "left", md: "right" }, color: "#fff", fontWeight: 700 }}>
              <Typography sx={{ fontSize: 18 }}>{t.roscoOfThe} {DAY_LABELS[selectedDayMeta.key].toUpperCase()}</Typography>
              <Typography sx={{ fontSize: 16 }}>
                {getRoscoStatusLabel(selectedDayState, selectedDayRosco.length, statusLabels)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: 4,
            backgroundColor: "#ededed",
            p: 2,
            color: "#222",
          }}
        >
          <Typography sx={{ fontSize: 36, fontWeight: 800, mb: 2 }}>
            {t.weeklySection}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 1.5,
            }}
          >
            {WEEK_DAYS.map((day) => {
              const available = isDayAvailable(day.key);
              const rosco = activeRoscoContext.roscos[day.key];
              const dayState =
                weeklyState.days[day.key] ??
                getDayState(day.key, rosco.length, activeRoscoContext.scopeKey);

              return (
                <Box
                  key={day.key}
                  onClick={() => {
                    if (available) {
                      setSelectedDayKey(day.key);
                    }
                  }}
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    border:
                      selectedDayKey === day.key
                        ? "2px solid #d84331"
                        : "1px solid #d7d7d7",
                    p: 1.5,
                    opacity: available ? 1 : 0.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: available ? "pointer" : "not-allowed",
                  }}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#262a33", alignSelf: "flex-start" }}>
                    {DAY_LABELS[day.key]}
                  </Typography>

                  {available ? (
                    <>
                      <Box sx={{ width: miniRoscoSize, height: miniRoscoSize, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <EmojiCarousel
                          statuses={dayState.statuses}
                          activeIndex={
                            dayState.status === "in_progress"
                              ? dayState.currentIndex
                              : undefined
                          }
                          boardSize={miniRoscoSize}
                          dotSize={miniDotSize}
                          dotFontSize={miniDotFontSize}
                          mb={0}
                        />
                      </Box>
                      <Typography sx={{ fontSize: 12, textAlign: "center", color: "#7a7a7a", fontWeight: 700, mb: 1 }}>
                        {getRoscoStatusLabel(dayState, rosco.length, statusLabels)}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 14, color: "#7a7a7a", fontWeight: 700, my: "auto" }}>
                      {`${t.unlocksOn} ${DAY_LABELS[day.key]}`}
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!available}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/game?day=${day.key}`);
                    }}
                    sx={{
                      mt: "auto",
                      backgroundColor: available ? "#d84331" : "#bcbcbc",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 9,
                    }}
                  >
                    {available ? getButtonLabel(dayState.status) : t.lockedDay}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>

        {hasGlobalStats && (() => {
          const total = cumulativeStats.correct + cumulativeStats.wrong + cumulativeStats.passed;
          const correctPct = Math.round((cumulativeStats.correct / total) * 100);
          const wrongPct = Math.round((cumulativeStats.wrong / total) * 100);
          const passedPct = Math.round((cumulativeStats.passed / total) * 100);

          const topCategory = Object.entries(cumulativeStats.byCategory).sort((a, b) => {
            const pctA = b[1].correct / (b[1].correct + b[1].wrong);
            const pctB = a[1].correct / (a[1].correct + a[1].wrong);
            const totalA = b[1].correct + b[1].wrong;
            const totalB = a[1].correct + a[1].wrong;
            return totalA > 3 && totalB > 3 ? pctA - pctB : totalA - totalB;
          }).pop();
          const topMeta = topCategory ? (CATEGORY_META[topCategory[0]] ?? { label: topCategory[0], icon: "📌" }) : null;

          const StatRow = ({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) => (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#555" }}>{count}/{total} · {pct}%</Typography>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, backgroundColor: "#d0d0d0", overflow: "hidden" }}>
                <Box sx={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 4, transition: "width 0.5s ease" }} />
              </Box>
            </Box>
          );

          return (
            <Box sx={{ borderRadius: 4, backgroundColor: "#fff", p: 2, color: "#222", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 2 }}>{t.statsSection}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <StatRow label={t.statsCorrect} count={cumulativeStats.correct} pct={correctPct} color="#2ecc71" />
                <StatRow label={t.statsWrong} count={cumulativeStats.wrong} pct={wrongPct} color="#e74c3c" />
                {cumulativeStats.passed > 0 && (
                  <StatRow label={t.statsPassed} count={cumulativeStats.passed} pct={passedPct} color="#f39c12" />
                )}
              </Box>
              {topMeta && (
                <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{
                    fontSize: 28, lineHeight: 1,
                    width: 48, height: 48, borderRadius: 3,
                    backgroundColor: "#f5f5f5",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {topMeta.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                      {t.knowledgeProfile}
                    </Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#222" }}>{topMeta.label}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#aaa" }}>{t.topCategoryLabel}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })()}

        {hasCategoryStats && (
          <Box
            sx={{
              borderRadius: 4,
              backgroundColor: "#ededed",
              p: 2,
              color: "#222",
            }}
          >
            <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 2 }}>
              {t.categorySection}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {Object.entries(cumulativeStats.byCategory)
                .sort((a, b) => (b[1].correct + b[1].wrong) - (a[1].correct + a[1].wrong))
                .map(([cat, { correct, wrong }]) => {
                  const total = correct + wrong;
                  const pct = Math.round((correct / total) * 100);
                  const meta = CATEGORY_META[cat] ?? { label: cat, icon: "📌" };
                  const barColor = pct >= 70 ? "#2ecc71" : pct >= 40 ? "#f39c12" : "#e74c3c";

                  return (
                    <Box key={cat}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333" }}>
                          {meta.icon} {meta.label}
                        </Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                          {correct}/{total} · {pct}%
                        </Typography>
                      </Box>
                      <Box sx={{ height: 8, borderRadius: 4, backgroundColor: "#d0d0d0", overflow: "hidden" }}>
                        <Box
                          sx={{
                            height: "100%",
                            width: `${pct}%`,
                            backgroundColor: barColor,
                            borderRadius: 4,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        )}

        {bestStreak && (
          <Box sx={{ borderRadius: 4, backgroundColor: "#fff", p: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#222" }}>{t.bestStreakSection}</Typography>
            <Typography sx={{ fontSize: 13, color: "#888", mb: 2 }}>
              {bestStreak.words.length} {t.bestStreakWords} · {(() => { const [y,m,d] = bestStreak.date.split("-").map(Number); return new Date(y, m-1, d).toLocaleDateString(LANG_LOCALE[currentLanguage], { weekday: "long", day: "numeric", month: "long" }); })()}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {bestStreak.words.map((entry) => (
                <Box key={entry.letter} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Box sx={{
                    minWidth: 28, height: 28, borderRadius: "50%",
                    backgroundColor: "#2ecc71", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0,
                  }}>
                    {entry.letter.toUpperCase()}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#222" }}>{entry.word}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>{entry.definition}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ width: "100%", px: 2, pb: 4, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
          ¿Qué es Enroscado?
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, mb: 3 }}>
          Enroscado es un juego de vocabulario diario inspirado en el clásico rosco. Cada día aparece un nuevo rosco con 27 letras del abecedario — tenés que adivinar una palabra para cada letra usando la definición como pista. Jugá en español, inglés, portugués, francés o alemán y poné a prueba tu conocimiento.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", mb: 1 }}>
          ¿Cómo jugar?
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
          Cada letra del rosco tiene una definición. Escribí la palabra que creés que corresponde y confirmala. Si acertás, la letra queda en verde. Si errás, queda en rojo. Podés pasar una letra y volver a ella más tarde. El objetivo es completar el rosco con la mayor cantidad de aciertos posibles. Un nuevo rosco aparece cada día, así que ¡volvé mañana!
        </Typography>
      </Box>
    </Layout>
  );
}
