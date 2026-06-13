import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import EmojiCarousel from "../components/EmojiCarousel";
import { getActiveRoscoContext } from "../data/weeklyRoscos";
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
  const { t } = useLanguage();
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

  const activeRoscoContext = useMemo(() => getActiveRoscoContext(), [refreshKey]);
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
      ? "Buenos dias"
      : nowHour < 20
        ? "Buenas tardes"
        : "Buenas noches";

  const getButtonLabel = (status: string): string => {
    if (status === "in_progress") {
      return "CONTINUAR";
    }
    if (status === "completed") {
      return "VER RESULTADO";
    }
    return "JUGAR";
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
            mt: 0.5,
            mb: 2,
            fontSize: { xs: 18, md: 22 },
          }}
        >
          {t.tagline}
        </Typography>

        <Typography sx={{ color: "#ffe6e6", fontSize: 18, fontWeight: 600 }}>
          {greeting}
        </Typography>

        <Typography sx={{ color: "#fff", fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
          estas para pensar?
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
                minWidth: 180,
                px: 4,
                py: 1.4,
                fontSize: 26,
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              {getButtonLabel(selectedDayState.status)}
            </Button>

            <Box sx={{ textAlign: "right", color: "#fff", fontWeight: 700 }}>
              <Typography sx={{ fontSize: 18 }}>ROSCO DEL {selectedDayMeta.label.toUpperCase()}</Typography>
              <Typography sx={{ fontSize: 16 }}>
                {getRoscoStatusLabel(selectedDayState, selectedDayRosco.length)}
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
          <Typography sx={{ fontSize: 42, fontWeight: 800, mb: 2 }}>
            CATEGORIAS
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
                    gap: 1,
                    cursor: available ? "pointer" : "not-allowed",
                  }}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#262a33" }}>
                    {day.label}
                  </Typography>

                  <Typography sx={{ fontSize: 14, minHeight: 40, color: "#7a7a7a", fontWeight: 700 }}>
                    {available
                      ? getRoscoStatusLabel(dayState, rosco.length)
                      : `Se habilita ${day.label}`}
                  </Typography>

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
                    }}
                  >
                    {available ? getButtonLabel(dayState.status) : "BLOQUEADO"}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
