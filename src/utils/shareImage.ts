// Redibuja el resultado del rosco en un canvas para compartirlo como imagen
// (navigator.share({ files: [...] })). No se clona el DOM real: los estilos
// de MUI (className hasheado por Emotion) no viajan a un canvas de forma
// confiable entre navegadores — mismo criterio que el resto del hub (ver
// shareImage.ts de emojinaloReact/imaginaloReact). Se redibuja desde los
// mismos datos (statuses/entries) que ya arma la pantalla de juego, en vez
// de intentar capturar el círculo real.

export type ShareLetterStatus = "correct" | "wrong" | "unanswered";

interface RoscoShareEntry {
  letter: string;
  status: ShareLetterStatus;
}

export interface RoscoShareStats {
  gameNumber: number;
  hits: number;
  total: number;
  // "3:42" — opcional porque no todo caller la tiene a mano (ya formateada,
  // ver formatDurationLabel).
  durationLabel?: string;
  // Racha de días jugados seguidos — todavía no existe ningún tracking de
  // esto en el código. Prop preparado a pedido, sin usar hasta que exista.
  streak?: number;
}

export type ShareImageFormat = "square" | "story";

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

// ── Constantes visuales (tocar acá para ajustar el look, no en el medio de
// las funciones de dibujo) ──────────────────────────────────────────────
// Mismo degradé que el fondo de toda la app (ver Layout/index.tsx), no un
// color aparte inventado para esta imagen.
const BG_GRADIENT_FROM = "#a34747";
const BG_GRADIENT_TO = "#F44336";
const COLOR_CORRECT = "#2ecc71";
const COLOR_WRONG = "#c0392b"; // rojo apagado — respondida, pero mal
const COLOR_UNANSWERED = "#7a8699"; // gris — ni respondida ni pasada a limpio
const COLOR_PERFECT = "#f5b700"; // dorado, 26/26
const COLOR_WHITE = "#ffffff";
const COLOR_MUTED = "rgba(255, 255, 255, 0.65)";
const RING_COLOR = "rgba(59, 130, 246, 0.28)";
const RING_COLOR_PERFECT = "rgba(245, 183, 0, 0.35)";

const RESULT_MESSAGES = {
  perfect: "¡PERFECTO!",
  great: "¡Casi!",
  good: "Bien ahí",
  low: "Seguí intentando",
};

function getResultMessage(hits: number, total: number): string {
  if (hits >= total) return RESULT_MESSAGES.perfect;
  if (hits >= 20) return RESULT_MESSAGES.great;
  if (hits >= 10) return RESULT_MESSAGES.good;
  return RESULT_MESSAGES.low;
}

export function formatDurationLabel(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

interface Layout {
  width: number;
  height: number;
  cardRadius: number;
  urlY: number;
  titleY: number;
  circleCenterY: number;
  circleSize: number;
  statsY: number;
  ctaY: number;
}

const SQUARE_LAYOUT: Layout = {
  width: 1080,
  height: 1080,
  cardRadius: 64,
  urlY: 60,
  titleY: 150,
  circleCenterY: 560,
  circleSize: 680,
  statsY: 960,
  ctaY: 1015,
};

const STORY_LAYOUT: Layout = {
  width: 1080,
  height: 1920,
  cardRadius: 64,
  urlY: 220,
  titleY: 310,
  circleCenterY: 860,
  circleSize: 680,
  statsY: 1260,
  ctaY: 1320,
};

export async function buildRoscoResultPngFile(
  entries: RoscoShareEntry[],
  stats: RoscoShareStats,
  filename: string,
  format: ShareImageFormat = "square",
): Promise<File | null> {
  if (!entries || entries.length === 0) return null;

  const layout = format === "story" ? STORY_LAYOUT : SQUARE_LAYOUT;
  const { width, height, cardRadius, urlY, titleY, circleCenterY, circleSize, statsY, ctaY } = layout;
  const circleCenterX = width / 2;

  const isPerfect = stats.hits >= stats.total;
  const dotSize = 58;
  // Margen entre las letras y el borde del anillo: más grande hacia afuera
  // (que no se corten contra el borde externo) y más chico hacia adentro
  // (que no sobre tanto hueco), para que las letras queden bien asentadas
  // dentro de la banda en vez de pegadas a un borde.
  const dotOuterMargin = 30;
  const dotRadius = circleSize / 2 - dotSize / 2 - dotOuterMargin;
  // Igual criterio que el anillo del demo de Home (EmojiCarousel): grosor
  // suficiente para que el anillo tape las letras, no un borde fino.
  const ringBorderWidth = dotSize + 40;
  const ringOuterRadius = circleSize / 2;
  const ringInnerRadius = ringOuterRadius - ringBorderWidth;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Tarjeta: la imagen entera es la tarjeta (bordes redondeados + fondo en
  // degradé oscuro de marca, reemplaza el blanco plano de antes).
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, BG_GRADIENT_FROM);
  gradient.addColorStop(1, BG_GRADIENT_TO);
  ctx.fillStyle = gradient;
  roundRectPath(ctx, 0, 0, width, height, cardRadius);
  ctx.fill();

  // URL arriba de todo, más grande que el título — es lo primero que se lee.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = "bold 72px sans-serif";
  ctx.fillText("enroscado.com", circleCenterX, urlY);

  // Encabezado: "Enroscado" + número de partida, en dos tonos.
  ctx.font = "bold 58px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const titlePart = "Enroscado";
  const numberPart = ` #${stats.gameNumber}`;
  const titleWidth = ctx.measureText(titlePart).width;
  const numberWidth = ctx.measureText(numberPart).width;
  const headerStartX = width / 2 - (titleWidth + numberWidth) / 2;
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText(titlePart, headerStartX, titleY);
  ctx.fillStyle = isPerfect ? COLOR_PERFECT : "#8fb3ff";
  ctx.fillText(numberPart, headerStartX + titleWidth, titleY);

  // Anillo grueso (dona): outerRadius/innerRadius vía path evenodd, para que
  // tape las letras en vez de ser solo un borde fino alrededor.
  if (isPerfect) {
    ctx.shadowColor = COLOR_PERFECT;
    ctx.shadowBlur = 50;
  }
  ctx.beginPath();
  ctx.arc(circleCenterX, circleCenterY, ringOuterRadius, 0, Math.PI * 2);
  ctx.arc(circleCenterX, circleCenterY, ringInnerRadius, 0, Math.PI * 2);
  ctx.fillStyle = isPerfect ? RING_COLOR_PERFECT : RING_COLOR;
  ctx.fill("evenodd");
  ctx.shadowBlur = 0;

  // Letras sobre el anillo.
  entries.forEach((entry, index) => {
    const angle = (-90 + (index * 360) / entries.length) * (Math.PI / 180);
    const x = circleCenterX + dotRadius * Math.cos(angle);
    const y = circleCenterY + dotRadius * Math.sin(angle);

    const dotColor = isPerfect
      ? COLOR_PERFECT
      : entry.status === "correct"
        ? COLOR_CORRECT
        : entry.status === "wrong"
          ? COLOR_WRONG
          : COLOR_UNANSWERED;

    if (isPerfect) {
      ctx.shadowColor = COLOR_PERFECT;
      ctx.shadowBlur = 14;
    }
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = COLOR_WHITE;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = isPerfect ? "#1a1f3a" : COLOR_WHITE;
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(entry.letter, x, y + 1);
  });

  // Puntaje + mensaje de resultado, centrados adentro del anillo.
  ctx.textAlign = "center";
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = "bold 140px sans-serif";
  ctx.fillText(`${stats.hits}/${stats.total}`, circleCenterX, circleCenterY - 20);

  ctx.fillStyle = isPerfect ? COLOR_PERFECT : COLOR_MUTED;
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(getResultMessage(stats.hits, stats.total), circleCenterX, circleCenterY + 80);

  // Stats extra (duración siempre que exista; racha solo si el caller la
  // tiene — hoy nadie la pasa, ver comentario en RoscoShareStats).
  const statsParts: string[] = [];
  if (stats.durationLabel) statsParts.push(`⏱ ${stats.durationLabel}`);
  if (stats.streak) statsParts.push(`🔥 ${stats.streak}`);
  if (statsParts.length > 0) {
    ctx.fillStyle = COLOR_MUTED;
    ctx.font = "600 34px sans-serif";
    ctx.fillText(statsParts.join("   "), circleCenterX, statsY);
  }

  // CTA abajo, chico: la URL ya no es el título, es la invitación a jugar.
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = "600 32px sans-serif";
  ctx.fillText("¿Te animás? enroscado.com", circleCenterX, ctaY);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;

  return new File([blob], filename, { type: "image/png" });
}

// Texto para pegar junto con la imagen (navigator.share / portapapeles). Sin
// emojis a pedido — solo el número de partida y el resultado. No depende de
// idioma, así que no necesita pasar por el sistema de traducciones. No
// incluye la URL: el caller la agrega aparte (como link real, no como texto
// plano) para que quede clickeable/autolinkeada en el share.
export function buildRoscoShareText(stats: RoscoShareStats): string {
  const statsParts = [`${stats.hits}/${stats.total}`];
  if (stats.durationLabel) statsParts.push(stats.durationLabel);
  if (stats.streak) statsParts.push(`Racha: ${stats.streak}`);

  return [`Enroscado #${stats.gameNumber}`, statsParts.join(" · ")].join("\n");
}
