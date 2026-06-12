import { useState, useEffect } from "react";

/**
 * Hook para detectar si el dispositivo es móvil
 * Combina detección de touch, user agent y tamaño de pantalla
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      // Detectar capacidad de touch
      const hasTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Detectar user agent de dispositivos móviles
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
      const isMobileUserAgent = mobileRegex.test(userAgent);

      // Detectar tamaño de pantalla pequeña (típico de móviles)
      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

      // Detectar orientación (solo disponible en dispositivos móviles)
      const hasOrientation = "orientation" in window;

      // Considerar móvil si tiene touch Y (es user agent móvil O pantalla pequeña O tiene orientación)
      const isMobileDevice =
        hasTouchScreen &&
        (isMobileUserAgent || isSmallScreen || hasOrientation);

      setIsMobile(isMobileDevice);
    };

    // Verificar al cargar
    checkIsMobile();

    // Verificar al cambiar tamaño de pantalla
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = () => checkIsMobile();

    // Usar addEventListener si está disponible, sino usar el método legacy
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      // Fallback para navegadores más antiguos
      mediaQuery.addListener(handleMediaChange);
    }

    // Verificar al cambiar orientación
    const handleOrientationChange = () => checkIsMobile();
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return isMobile;
};
