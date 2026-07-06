/**
 * Generador de sets de emojis para el Bonus rosco.
 *
 * Uso:
 *   npx tsx scripts/generateEmojiSet.ts [número_de_set]
 *   Ejemplo: npx tsx scripts/generateEmojiSet.ts 2
 *
 * Requiere: ANTHROPIC_API_KEY en el entorno.
 * Instalar si no está: npm install @anthropic-ai/sdk tsx
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
// Para estas letras forzar "contain" (stock insuficiente en "empieza con" en español)
const FORCE_CONTAIN = new Set(["J", "K", "Q", "U", "W", "X", "Y"]);

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const setNumber = parseInt(process.argv[2] ?? "1", 10);
const outputPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  `../src/data/roscos/sets/emoji/set-emoji-${String(setNumber).padStart(3, "0")}.ts`,
);

const SYSTEM = `Eres un experto en emojis Unicode y español.
Tu tarea es asignar un emoji a cada letra del abecedario (A-Z) para un juego de tipo rosco/pasapalabra en español.

REGLAS ESTRICTAS:
1. Cada entrada tiene: letra, emoji, nombre_es (la palabra que el jugador debe escribir), regla (start|contain).
2. La regla ya está definida en el input — NO la cambies.
3. "start": el nombre_es DEBE comenzar con esa letra.
4. "contain": el nombre_es DEBE contener esa letra en cualquier posición (pero NO necesariamente al inicio).
5. nombre_es debe ser una palabra común en español, sin tildes, sin ñ, sin espacios. Máximo 12 letras.
6. El emoji debe representar visualmente la palabra de forma clara e inmediata.
7. No repetir emojis ni palabras respecto a sets anteriores (te los paso como contexto).
8. Para "contain": verifica carácter a carácter que la letra esté en el nombre antes de incluirlo.
9. Responde SOLO con JSON válido, sin texto adicional.`;

const USER_TEMPLATE = (setNum: number, usedWords: string[]) => `
Genera el set-emoji-${String(setNum).padStart(3, "0")} para el juego Enroscado.

Letras a asignar (formato: LETRA → regla):
${LETTERS.map(l => `${l} → ${FORCE_CONTAIN.has(l) ? "contain" : "start"}`).join("\n")}

Palabras ya usadas en sets anteriores (NO repetir): ${usedWords.length > 0 ? usedWords.join(", ") : "ninguna"}

Responde con un array JSON de 26 objetos en orden A-Z, con este formato exacto:
[
  { "letter": "A", "startOrContain": "start", "word": "Abeja", "definition": "🐝" },
  ...
]

Verificación obligatoria para "contain": antes de incluir una entrada, comprueba que la letra realmente está en el word. Por ejemplo, para K con "contain": "Bikini" (B-I-K-I-N-I ✓), "Kayak" (K-A-Y-A-K ✓).
`;

async function generateSet(setNum: number): Promise<void> {
  // Recopilar palabras usadas en sets anteriores
  const usedWords: string[] = [];
  for (let i = 1; i < setNum; i++) {
    const prevPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      `../src/data/roscos/sets/emoji/set-emoji-${String(i).padStart(3, "0")}.ts`,
    );
    if (fs.existsSync(prevPath)) {
      const content = fs.readFileSync(prevPath, "utf-8");
      const matches = content.matchAll(/word:\s*"([^"]+)"/g);
      for (const m of matches) usedWords.push(m[1]);
    }
  }

  console.log(`Generando set-emoji-${String(setNum).padStart(3, "0")}...`);
  if (usedWords.length > 0) {
    console.log(`Palabras excluidas (sets anteriores): ${usedWords.join(", ")}`);
  }

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: SYSTEM,
    messages: [{ role: "user", content: USER_TEMPLATE(setNum, usedWords) }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("No se pudo extraer JSON de la respuesta:", raw);
    process.exit(1);
  }

  const entries: Array<{ letter: string; startOrContain: string; word: string; definition: string }> =
    JSON.parse(jsonMatch[0]);

  // Validar
  const errors: string[] = [];
  for (const e of entries) {
    const wordNorm = e.word.toUpperCase();
    if (FORCE_CONTAIN.has(e.letter)) {
      if (!wordNorm.includes(e.letter)) {
        errors.push(`${e.letter}: "${e.word}" no contiene la letra ${e.letter}`);
      }
    } else {
      if (!wordNorm.startsWith(e.letter)) {
        errors.push(`${e.letter}: "${e.word}" no empieza con ${e.letter}`);
      }
    }
  }
  if (errors.length > 0) {
    console.error("Errores de validación:", errors.join("\n"));
    process.exit(1);
  }

  // Generar TypeScript
  const setVarName = `BONUS_SET_${String(setNum).padStart(3, "0")}`;
  const maxWordLen = Math.max(...entries.map(e => e.word.length));
  const lines = entries.map(e => {
    const rule = FORCE_CONTAIN.has(e.letter) ? "contain" : "start";
    const wordPad = e.word.padEnd(maxWordLen);
    const comment = rule === "contain"
      ? `  // ${e.word.toUpperCase().split("").join("-")}`
      : "";
    return `  { letter: "${e.letter}", startOrContain: "${rule}", word: "${wordPad}", definition: "${e.definition}", entryType: "emoji" },${comment}`;
  });

  const output = `import { RoscoEntry } from "../../../weeklyRoscos";

// CONTAIN forzado para: J, K, Q, U, W, X, Y (stock insuficiente de "empieza con" en español)
export const ${setVarName}: RoscoEntry[] = [
${lines.join("\n")}
];
`;

  fs.writeFileSync(outputPath, output, "utf-8");
  console.log(`✅ Generado: ${outputPath}`);
  console.log("\nRecordá agregar en weeklyRoscos.ts:");
  console.log(`  import { ${setVarName} } from "./roscos/sets/emoji/set-emoji-${String(setNum).padStart(3, "0")}";`);
  console.log(`  Y agregar ${setVarName} al BONUS_ROSCO_REGISTRY.`);
}

generateSet(setNumber).catch(console.error);
