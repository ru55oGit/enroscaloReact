import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { getLevelData, PROGRESS_KEY, TOTAL_LEVELS } from "../levels/levelsData";
import { useLanguage } from "../i18n/LanguageContext";
import { useIsMobile } from "../hooks/useIsMobile";

interface LocationState {
  level?: number;
}

const Game: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Obtener nivel desde el estado de navegación
  const state = location.state as LocationState;
  const level = state?.level ?? 1;

  const [hits, setHits] = useState(0);
  const [plays, setPlays] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cargar datos del nivel
  const levelData = getLevelData(level);

  useEffect(() => {
    if (!levelData) {
      // Nivel inválido, volver a niveles
      navigate("/levels");
    }
  }, [levelData, navigate]);

  // Guardar progreso y avanzar al siguiente nivel
  const handleSuccess = () => {
    const nextLevel = level + 1;
    const currentProgress = parseInt(
      localStorage.getItem(PROGRESS_KEY) || "1",
      10,
    );

    if (level >= currentProgress) {
      localStorage.setItem(PROGRESS_KEY, nextLevel.toString());
    }

    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      if (nextLevel <= TOTAL_LEVELS) {
        navigate("/game", { state: { level: nextLevel } });
      } else {
        // Completó todos los niveles
        navigate("/levels");
      }
    }, 3000);
  };

  // TODO: Implementar la lógica real de tu juego aquí
  const handleGameAction = () => {
    setPlays((p) => p + 1);
    // Simular acierto - reemplazar con lógica real
    setHits((h) => h + 1);
    handleSuccess();
  };

  if (!levelData) {
    return (
      <Layout>
        <Typography sx={{ color: "#fff" }}>{t.invalidLevel}</Typography>
      </Layout>
    );
  }

  return (
    <Layout hits={hits} plays={plays} isGridScreen>
      {/* Contenido principal del juego */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: 2,
        }}
      >
        {/* Instrucción del juego */}
        {/* TODO: Cambiar el texto de instrucción según tu juego */}
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {t.findDifferentEmoji2}
        </Typography>

        {/* Área principal del juego */}
        {/* TODO: Reemplazar con tu componente de juego real */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Nivel actual */}
          <Typography
            sx={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            Nivel {level}
          </Typography>

          {/* Placeholder del juego - TODO: Reemplazar por tu componente de juego */}
          <Box
            sx={{
              width: "100%",
              minHeight: 300,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              border: "2px dashed rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
              p: 3,
            }}
          >
            <Typography
              sx={{ color: "#fff", textAlign: "center", opacity: 0.8 }}
            >
              🎮 Tu juego va aquí
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                textAlign: "center",
                fontSize: 14,
                opacity: 0.6,
              }}
            >
              Reemplaza este placeholder con tu componente de juego
            </Typography>

            {/* Botón de ejemplo */}
            <Button
              variant="contained"
              onClick={handleGameAction}
              sx={{
                mt: 2,
                backgroundColor: "#e74c3c",
                "&:hover": { backgroundColor: "#c0392b" },
              }}
            >
              Acerté! (demo)
            </Button>
          </Box>

          {/* Teclado virtual solo en mobile si lo necesita tu juego */}
          {/* TODO: Descomentar si tu juego usa teclado virtual */}
          {/* {isMobile && (
            <VirtualKeyboard
              onKeyPress={handleKeyPress}
            />
          )} */}
        </Box>
      </Box>

      {/* Modal de éxito */}
      <Modal
        open={showSuccessModal}
        onClose={() => {}}
        aria-labelledby="success-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 4,
            textAlign: "center",
            minWidth: 280,
            maxWidth: 350,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1, fontSize: "48px" }}>
            🎉
          </Typography>
          <Typography
            id="success-modal-title"
            variant="h5"
            sx={{ color: "#e74c3c", fontWeight: 700, mb: 1 }}
          >
            {t.excellent}
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 14 }}>
            {t.nextScreen}
          </Typography>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Game;
