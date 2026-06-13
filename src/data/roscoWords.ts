export type RoscoRule = "start" | "contain";

export interface RoscoEntry {
  word: string;
  startOrContain: RoscoRule;
  letter: string;
  definition: string;
}

export const ROSCO_WORDS: RoscoEntry[] = [
  {
    word: "Avion",
    startOrContain: "start",
    letter: "A",
    definition: "Medio de transporte que vuela.",
  },
  {
    word: "Barco",
    startOrContain: "start",
    letter: "B",
    definition: "Vehiculo que navega por el agua.",
  },
  {
    word: "Roca",
    startOrContain: "contain",
    letter: "C",
    definition: "Masa solida de origen mineral.",
  },
  {
    word: "Dado",
    startOrContain: "start",
    letter: "D",
    definition: "Objeto usado en juegos de azar.",
  },
  {
    word: "Escuela",
    startOrContain: "start",
    letter: "E",
    definition: "Lugar donde se estudia.",
  },
  {
    word: "Foca",
    startOrContain: "start",
    letter: "F",
    definition: "Mamifero marino de cuerpo robusto.",
  },
  {
    word: "Guitarra",
    startOrContain: "start",
    letter: "G",
    definition: "Instrumento musical de cuerdas.",
  },
  {
    word: "Helado",
    startOrContain: "start",
    letter: "H",
    definition: "Postre frio y dulce.",
  },
  {
    word: "Isla",
    startOrContain: "start",
    letter: "I",
    definition: "Porcion de tierra rodeada de agua.",
  },
  {
    word: "Jardin",
    startOrContain: "start",
    letter: "J",
    definition: "Espacio donde crecen plantas.",
  },
  {
    word: "Koala",
    startOrContain: "start",
    letter: "K",
    definition: "Marsupial originario de Australia.",
  },
  {
    word: "Lupa",
    startOrContain: "start",
    letter: "L",
    definition: "Lente que aumenta el tamano de los objetos.",
  },
  {
    word: "Camino",
    startOrContain: "contain",
    letter: "M",
    definition: "Via o senda para desplazarse.",
  },
  {
    word: "Nube",
    startOrContain: "start",
    letter: "N",
    definition: "Conjunto visible de gotas en el cielo.",
  },
  {
    word: "Oso",
    startOrContain: "start",
    letter: "O",
    definition: "Mamifero grande y fuerte.",
  },
  {
    word: "Pelota",
    startOrContain: "start",
    letter: "P",
    definition: "Objeto esferico usado en deportes.",
  },
  {
    word: "Bosque",
    startOrContain: "contain",
    letter: "Q",
    definition: "Terreno poblado de arboles.",
  },
  {
    word: "Reloj",
    startOrContain: "start",
    letter: "R",
    definition: "Instrumento para medir el tiempo.",
  },
  {
    word: "Silla",
    startOrContain: "start",
    letter: "S",
    definition: "Mueble para sentarse.",
  },
  {
    word: "Tren",
    startOrContain: "start",
    letter: "T",
    definition: "Medio de transporte sobre rieles.",
  },
  {
    word: "Murcielago",
    startOrContain: "contain",
    letter: "U",
    definition: "Mamifero que puede volar.",
  },
  {
    word: "Ventana",
    startOrContain: "start",
    letter: "V",
    definition: "Abertura que permite ver hacia afuera.",
  },
  {
    word: "Wafle",
    startOrContain: "start",
    letter: "W",
    definition: "Masa dulce cocida en molde.",
  },
  {
    word: "Taxi",
    startOrContain: "contain",
    letter: "X",
    definition: "Vehiculo de transporte publico.",
  },
  {
    word: "Yate",
    startOrContain: "start",
    letter: "Y",
    definition: "Embarcacion de recreo.",
  },
  {
    word: "Lapiz",
    startOrContain: "contain",
    letter: "Z",
    definition: "Instrumento para escribir o dibujar.",
  },
];
