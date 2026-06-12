import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LanguageSelector from "../components/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import EmojiCarousel from "../components/EmojiCarousel";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Layout showFooter={false}>
      {/* Language Selector */}
      <LanguageSelector />

      {/* TODO: Cambiar por el nombre de tu juego */}
      <Typography
        variant="h2"
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 4,
          letterSpacing: "2px",
          fontFamily: "Lobster, cursive",
        }}
      >
        {t.appTitle}
      </Typography>

      {/* Carrusel de preview del juego */}
      {/* Para descifralo o proyectos con múltiples items usa varios slides */}
      {/* Para proyectos simples usa un solo item fijo */}
      <EmojiCarousel />

      {/* Sección ¿Cómo jugar? + Botón */}
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pb: 2,
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 2,
              letterSpacing: "2px",
            }}
          >
            {t.howToPlay}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Paso 1 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                height: 35,
                width: 200,
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "32px" }}>👀</Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t.lookAtGrid}
              </Typography>
            </Box>

            {/* Paso 2 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                height: 35,
                width: 200,
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "32px" }}>🤔</Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t.findDifferent}
              </Typography>
            </Box>

            {/* Paso 3 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                height: 35,
                width: 200,
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: "32px" }}>👆</Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t.clickQuickly}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="outlined"
          sx={{
            width: { md: "75%", xs: "calc(100% - 16px)" },
            py: 1.5,
            px: 4,
            borderRadius: 3,
            border: "1px solid #fff",
            background: "none",
            color: "#fff",
            fontSize: 20,
            fontWeight: 600,
            "&:hover": {
              background: "#e74c3c22",
              border: "1px solid #fff",
            },
          }}
          onClick={() => navigate("/levels")}
        >
          {t.playButton}
        </Button>
      </Box>
    </Layout>
  );
}
