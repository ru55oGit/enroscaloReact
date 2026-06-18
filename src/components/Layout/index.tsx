import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { SupportedLanguage } from "../../i18n/translations";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  headerRightText?: string;
  onBack?: () => void;
}

// TODO: Personalizar con los emojis/decoraciones de tu juego
const RAIN_EMOJIS = [
  "😀",
  "😂",
  "🤣",
  "😍",
  "🥳",
  "🤩",
  "😎",
  "🤔",
  "😜",
  "🥸",
  "🤪",
  "😇",
  "🤗",
  "😻",
  "🎉",
  "🦄",
  "🌈",
  "🍕",
  "🎸",
  "🚀",
  "⭐",
  "💡",
  "🔥",
  "💎",
  "👑",
  "💪",
  "🎯",
  "🏆",
  "🎭",
  "🎨",
  "🌟",
  "💫",
  "🌙",
  "☀️",
  "🌸",
  "🌺",
  "🌼",
  "🌻",
];

const Layout: React.FC<LayoutProps> = ({
  children,
  showFooter = true,
  headerRightText,
  onBack,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const showHeader = location.pathname !== "/";
  const canvasRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const isGameRoute = location.pathname === "/game";

  // Funciones para manejar el menú hamburguesa
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setLanguageMenuOpen(false);
  };

  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
    setLanguageMenuOpen(false);
    setMenuOpen(false);
  };

  const handleMenuNavigation = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function spawnEmoji() {
      if (!canvas) return;

      const el = document.createElement("div");
      el.className = "rain-emoji";
      el.textContent =
        RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)];
      const left = Math.random() * 100;
      const dur = 5 + Math.random() * 8;
      const size = 1.2 + Math.random() * 1.8;
      const delay = Math.random() * -dur;

      el.style.cssText = `
        left: ${left}%; 
        font-size: ${size}rem; 
        animation-duration: ${dur}s; 
        animation-delay: ${delay}s;
      `;

      canvas.appendChild(el);

      setTimeout(
        () => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        },
        (dur + Math.abs(delay)) * 1000,
      );
    }

    intervalRef.current = setInterval(spawnEmoji, 300);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (canvas) {
        canvas.innerHTML = "";
      }
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(#a34747, #F44336)",
        alignItems: "center",
        width: { md: "40vw", xs: "100%" },
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        pb: 2,
      }}
    >
      {/* Canvas para lluvia de emojis */}
      <Box
        ref={canvasRef}
        id="bg-canvas"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          "& .rain-emoji": {
            position: "absolute",
            top: "-50px",
            animation: "fall linear infinite",
            userSelect: "none",
            pointerEvents: "none",
            opacity: 0.7,
          },
          "@keyframes fall": {
            "0%": {
              transform: "translateY(-100px) rotate(0deg)",
              opacity: 0,
            },
            "10%": {
              opacity: 0.7,
            },
            "90%": {
              opacity: 0.7,
            },
            "100%": {
              transform: "translateY(100vh) rotate(360deg)",
              opacity: 0,
            },
          },
        }}
      />

      {showHeader && (
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            px: 2,
            borderBottom: "2px solid #e74c3c",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            width: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Back arrow en game, menú en otras pantallas */}
          {isGameRoute ? (
            <Box
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                cursor: "pointer",
              }}
              onClick={() => onBack ? onBack() : navigate(-1)}
              aria-label="Volver"
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26 6L14 19L26 32"
                  stroke="#e74c3c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          ) : (
            <Box
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 3,
                cursor: "pointer",
              }}
              onClick={handleMenuToggle}
              aria-label="Menú"
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="8" width="38" height="4" rx="2" fill="#e74c3c" />
                <rect y="17" width="38" height="4" rx="2" fill="#e74c3c" />
                <rect y="26" width="38" height="4" rx="2" fill="#e74c3c" />
              </svg>
            </Box>
          )}
          {/* Título centrado - TODO: Cambiar por el nombre de tu juego */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "Lobster, cursive",
              fontSize: 40,
              color: "#e74c3c",
              letterSpacing: 1,
              cursor: "pointer",
              zIndex: 2,
              width: "max-content",
            }}
            onClick={() => window.location.replace("/")}
          >
            Enroscado
          </Box>
          {headerRightText && (
            <Box
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 24,
                color: "#e74c3c",
                fontWeight: 700,
                background: "#fff",
                px: 2,
                borderRadius: 2,
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              }}
              aria-label="Temporizador"
            >
              {headerRightText}
            </Box>
          )}
        </Box>
      )}
      <Container
        disableGutters
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          mt: 2,
          px: 0,
          position: "relative",
          zIndex: 5,
        }}
      >
        {children}
      </Container>
      {showFooter && (
        <Box
          component="footer"
          sx={{
            py: 2,
            textAlign: "center",
            fontSize: 16,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* TODO: Cambiar por el nombre de tu juego */}©{" "}
          {new Date().getFullYear()} Enroscado
        </Box>
      )}

      {/* Menú hamburguesa */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(180deg, #c0392b 0%, #e74c3c 100%)",
          },
        }}
      >
        <Box sx={{ pt: 4, pb: 2 }}>
          {/* TODO: Cambiar por el nombre de tu juego */}
          <Box
            sx={{
              textAlign: "center",
              fontFamily: "Lobster, cursive",
              fontSize: 32,
              color: "#fff",
              mb: 3,
              px: 2,
            }}
          >
            Enroscado
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation("/")}
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText
                  primary={t.home}
                  primaryTypographyProps={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#e74c3c",
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleMenuNavigation("/game")}
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText
                  primary={t.findEmojiMenu}
                  primaryTypographyProps={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#e74c3c",
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* Opción de idiomas */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLanguageMenuToggle}
                sx={{
                  px: 3,
                  py: 2,
                  backgroundColor: "#fff",
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText
                  primary={t.language}
                  primaryTypographyProps={{
                    fontSize: 22,
                    fontWeight: 500,
                    color: "#e74c3c",
                  }}
                />
                {languageMenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            {/* Submenú de idiomas */}
            <Collapse in={languageMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {availableLanguages.map((language) => (
                  <ListItem key={language.code} disablePadding>
                    <ListItemButton
                      onClick={() => handleLanguageChange(language.code)}
                      sx={{
                        pl: 6,
                        pr: 3,
                        py: 1.5,
                        backgroundColor:
                          currentLanguage === language.code
                            ? "#f1c40f22"
                            : "#f5f5f5",
                        borderBottom: "1px solid #e0e0e0",
                        "&:hover": {
                          backgroundColor:
                            currentLanguage === language.code
                              ? "#f1c40f33"
                              : "#eee",
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${language.flag} ${language.name}`}
                        primaryTypographyProps={{
                          fontSize: 18,
                          fontWeight:
                            currentLanguage === language.code ? 600 : 400,
                          color:
                            currentLanguage === language.code
                              ? "#f1c40f"
                              : "#666",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Layout;
