// Redibuja el resultado del rosco en un canvas para compartirlo como imagen
// (navigator.share({ files: [...] })). No se clona el DOM real: los estilos
// de MUI (className hasheado por Emotion) no viajan a un canvas de forma
// confiable entre navegadores — mismo criterio que el resto del hub (ver
// shareImage.ts de emojinaloReact/imaginaloReact). Se redibuja desde los
// mismos datos (statuses/entries) que ya arma la pantalla de juego, en vez
// de intentar capturar el círculo real.

export type ShareLetterStatus = "correct" | "wrong";

interface RoscoShareEntry {
  letter: string;
  status: ShareLetterStatus;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const COLOR_CORRECT = "#2ecc71";
const COLOR_WRONG = "#e74c3c";
const ACCENT = "#e74c3c";

export async function buildRoscoResultPngFile(
  entries: RoscoShareEntry[],
  hits: number,
  dateLabel: string,
  filename: string,
): Promise<File | null> {
  if (!entries || entries.length === 0) return null;

  const width = 560;
  const height = 660;
  const circleSize = 420;
  const circleCenterX = width / 2;
  const circleCenterY = 320;
  const dotSize = 34;
  const dotRadius = circleSize / 2 - dotSize / 2 - 6;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Tarjeta blanca redondeada, igual que el resto del hub.
  ctx.fillStyle = "#ffffff";
  roundRectPath(ctx, 0, 0, width, height, 28);
  ctx.fill();

  // Título de marca.
  ctx.fillStyle = ACCENT;
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("www.enroscado.com", width / 2, 56);

  // Anillo del rosco: un punto de color por letra.
  ctx.strokeStyle = "rgba(21, 101, 192, 0.15)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(circleCenterX, circleCenterY, circleSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  entries.forEach((entry, index) => {
    const angle = (-90 + (index * 360) / entries.length) * (Math.PI / 180);
    const x = circleCenterX + dotRadius * Math.cos(angle);
    const y = circleCenterY + dotRadius * Math.sin(angle);

    ctx.fillStyle = entry.status === "correct" ? COLOR_CORRECT : COLOR_WRONG;
    ctx.beginPath();
    ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(entry.letter, x, y + 1);
  });

  // Resultado, centrado adentro del anillo.
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(`${hits}/${entries.length}`, circleCenterX, circleCenterY);

  // Fecha y día, debajo del anillo.
  ctx.fillStyle = "#000000";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(dateLabel, width / 2, circleCenterY + circleSize / 2 + 40);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;

  return new File([blob], filename, { type: "image/png" });
}
