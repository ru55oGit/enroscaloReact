import { RoscoEntry } from "../../../weeklyRoscos";

// CONTAIN forzado para: J, K, Q, U, W, X, Y (stock insuficiente de "empieza con" en español)
export const BONUS_SET_001: RoscoEntry[] = [
  { letter: "A", startOrContain: "start", word: "Abeja",      definition: "🐝", entryType: "emoji" },
  { letter: "B", startOrContain: "start", word: "Ballena",    definition: "🐋", entryType: "emoji" },
  { letter: "C", startOrContain: "start", word: "Cohete",     definition: "🚀", entryType: "emoji" },
  { letter: "D", startOrContain: "start", word: "Delfin",     definition: "🐬", entryType: "emoji" },
  { letter: "E", startOrContain: "start", word: "Elefante",   definition: "🐘", entryType: "emoji" },
  { letter: "F", startOrContain: "start", word: "Flor",       definition: "🌸", entryType: "emoji" },
  { letter: "G", startOrContain: "start", word: "Gato",       definition: "🐱", entryType: "emoji" },
  { letter: "H", startOrContain: "start", word: "Helicoptero",definition: "🚁", entryType: "emoji" },
  { letter: "I", startOrContain: "start", word: "Isla",       definition: "🏝️", entryType: "emoji" },
  { letter: "J", startOrContain: "contain", word: "Oveja",    definition: "🐑", entryType: "emoji" },  // O-V-E-J-A
  { letter: "K", startOrContain: "contain", word: "Bikini",   definition: "👙", entryType: "emoji" },  // B-I-K-I-N-I
  { letter: "L", startOrContain: "start", word: "Leon",       definition: "🦁", entryType: "emoji" },
  { letter: "M", startOrContain: "start", word: "Mariposa",   definition: "🦋", entryType: "emoji" },
  { letter: "N", startOrContain: "start", word: "Nube",       definition: "☁️", entryType: "emoji" },
  { letter: "O", startOrContain: "start", word: "Oso",        definition: "🐻", entryType: "emoji" },
  { letter: "P", startOrContain: "start", word: "Pato",       definition: "🦆", entryType: "emoji" },
  { letter: "Q", startOrContain: "contain", word: "Bosque",   definition: "🌳", entryType: "emoji" },  // B-O-S-Q-U-E
  { letter: "R", startOrContain: "start", word: "Raton",      definition: "🐭", entryType: "emoji" },
  { letter: "S", startOrContain: "start", word: "Serpiente",  definition: "🐍", entryType: "emoji" },
  { letter: "T", startOrContain: "start", word: "Tortuga",    definition: "🐢", entryType: "emoji" },
  { letter: "U", startOrContain: "contain", word: "Aguacate", definition: "🥑", entryType: "emoji" },  // A-G-U-A-C-A-T-E
  { letter: "V", startOrContain: "start", word: "Vaca",       definition: "🐄", entryType: "emoji" },
  { letter: "W", startOrContain: "contain", word: "Kiwi",     definition: "🥝", entryType: "emoji" },  // K-I-W-I
  { letter: "X", startOrContain: "contain", word: "Taxi",     definition: "🚕", entryType: "emoji" },  // T-A-X-I
  { letter: "Y", startOrContain: "contain", word: "Payaso",   definition: "🤡", entryType: "emoji" },  // P-A-Y-A-S-O
  { letter: "Z", startOrContain: "start", word: "Zorro",      definition: "🦊", entryType: "emoji" },
];
