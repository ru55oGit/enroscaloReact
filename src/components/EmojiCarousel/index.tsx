import React from "react";
import Box from "@mui/material/Box";
// TODO: Si quieres usar Swiper instala: npm install swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// Slides de ejemplo - TODO: personaliza con tu contenido
// Para proyectos con múltiples categorías como descifraloReact, agrega más slides
// Para proyectos simples, deja solo 1 slide
const CAROUSEL_SLIDES = [
  {
    id: 1,
    content: (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1.5,
          width: "250px",
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 3,
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {Array.from({ length: 35 }, (_, i) => (
          <Box key={i} sx={{ fontSize: "24px", textAlign: "center" }}>
            {i === 18 ? "😍" : "😀"}
          </Box>
        ))}
      </Box>
    ),
  },
  // Para agregar más slides (como en descifraloReact):
  // {
  //   id: 2,
  //   content: <Box>Tu segundo slide aquí</Box>,
  // },
];

const EmojiCarousel: React.FC = () => {
  // Versión simple con 1 solo item (sin carrusel animado)
  // Para activar el carrusel con Swiper, usa el código comentado de abajo
  if (CAROUSEL_SLIDES.length === 1) {
    return (
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        {CAROUSEL_SLIDES[0].content}
      </Box>
    );
  }

  // Múltiples slides - versión básica sin librería
  // Para usar Swiper, reemplaza por la implementación comentada al final
  return (
    <Box
      sx={{
        mb: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {CAROUSEL_SLIDES.map((slide) => (
        <Box key={slide.id} sx={{ display: "flex", justifyContent: "center" }}>
          {slide.content}
        </Box>
      ))}
    </Box>
  );
};

export default EmojiCarousel;

/* 
// IMPLEMENTACIÓN CON SWIPER (descomentar para activar)
// Instalar: npm install swiper

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const EmojiCarouselSwiper: React.FC = () => {
  return (
    <Box sx={{ mb: 2, width: "100%", maxWidth: 300 }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={CAROUSEL_SLIDES.length > 1}
        style={{ paddingBottom: "30px" }}
      >
        {CAROUSEL_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {slide.content}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
*/
