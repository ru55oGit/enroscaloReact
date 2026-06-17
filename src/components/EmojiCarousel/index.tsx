import React from "react";
import Box from "@mui/material/Box";
import { LetterStatus } from "../../utils/weeklyRoscoState";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface EmojiCarouselProps {
  statuses?: LetterStatus[];
  activeIndex?: number;
  boardSize?: number;
  dotSize?: number;
  dotFontSize?: number;
  mb?: number;
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
  boardSize = 250,
  dotSize = 24,
  dotFontSize = 13,
  mb = 2,
}) => {
  const borderWidth = 3;
  const radius = boardSize / 2 - dotSize / 2 - 8;
  // Absolute children are measured from the padding edge (inside the border),
  // so the visual center in absolute coords is boardSize/2 - borderWidth.
  const cx = boardSize / 2 - borderWidth;
  const cy = boardSize / 2 - borderWidth;

  return (
    <Box
      sx={{
        mb,
        width: boardSize,
        height: boardSize,
        borderRadius: "50%",
        backgroundColor: "#fff",
        position: "relative",
        border: `${borderWidth}px solid rgba(21, 101, 192, 0.24)`,
        boxShadow: "inset 0 0 0 8px rgba(21, 101, 192, 0.08)",
      }}
    >
      {LETTERS.map((letter, index) => {
        const angle = (-90 + (index * 360) / LETTERS.length) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle) - dotSize / 2;
        const y = cy + radius * Math.sin(angle) - dotSize / 2;

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
              fontSize: dotFontSize,
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
