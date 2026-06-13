import React from "react";
import Box from "@mui/material/Box";
import { LetterStatus } from "../../utils/weeklyRoscoState";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface EmojiCarouselProps {
  statuses?: LetterStatus[];
  activeIndex?: number;
}

const getLetterColor = (
  status: LetterStatus | undefined,
  isActive: boolean,
): string => {
  if (isActive) {
    return "#f1c40f";
  }

  switch (status) {
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

const EmojiCarousel: React.FC<EmojiCarouselProps> = ({
  statuses,
  activeIndex,
}) => {
  const boardSize = 250;
  const dotSize = 24;
  const radius = boardSize / 2 - dotSize / 2 - 8;

  return (
    <Box
      sx={{
        mb: 2,
        width: boardSize,
        height: boardSize,
        borderRadius: "50%",
        backgroundColor: "#fff",
        position: "relative",
        border: "3px solid rgba(21, 101, 192, 0.24)",
        boxShadow: "inset 0 0 0 8px rgba(21, 101, 192, 0.08)",
      }}
    >
      {LETTERS.map((letter, index) => {
        const angle = (-90 + (index * 360) / LETTERS.length) * (Math.PI / 180);
        const x = boardSize / 2 + radius * Math.cos(angle) - dotSize / 2;
        const y = boardSize / 2 + radius * Math.sin(angle) - dotSize / 2;

        return (
          <Box
            key={letter}
            sx={{
              position: "absolute",
              left: x,
              top: y,
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: getLetterColor(statuses?.[index], activeIndex === index),
              color: "#fff",
              border: "1.5px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            {letter}
          </Box>
        );
      })}
    </Box>
  );
};

export default EmojiCarousel;
