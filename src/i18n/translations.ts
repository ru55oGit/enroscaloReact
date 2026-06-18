export interface Translation {
  // Home page
  appTitle: string;
  tagline: string;
  howToPlay: string;
  lookAtGrid: string;
  findDifferent: string;
  clickQuickly: string;
  playButton: string;

  // Language selector
  selectLanguage: string;
  spanish: string;
  english: string;
  portuguese: string;
  french: string;

  // Levels page
  findEmoji: string;
  findDifferentEmoji: string;
  worldFlags: string;
  findFlagsDescription: string;
  moviesAndSeries: string;
  guessMoviesDescription: string;
  whatIsTitle: string;
  guessWhatDescription: string;

  // Menu
  home: string;
  findEmojiMenu: string;
  movies: string;
  flags: string;
  whatIs: string;
  language: string;

  // Game pages
  findDifferentEmoji2: string;
  findEmojiNotGroup: string;
  findFlagOf: string;
  guessCapitalNow: string;
  findEmojiNow: string;
  invalidLevel: string;

  // Success messages
  correct: string;
  excellent: string;
  nextScreen: string;
  itemNotFound: string;
  knowCapitals: string;

  // Exit confirmation popup
  confirmExit: string;
  loseProgress: string;
  cancel: string;
  confirm: string;

  // Game Over messages
  gameOverMovie: string;
  gameOverLives: string;
  tryAgain: string;
  studyGeography: string;
  tryAgainGeo: string;
  congratulations: string;
  completedAllScreens: string;
  clearProgress: string;

  // Rosco Home
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  readyToPlay: string;
  weeklySection: string;
  categorySection: string;
  continueGame: string;
  viewResult: string;
  lockedDay: string;
  unlocksOn: string;
  roscoOfThe: string;

  // Rosco status
  statusCompleted: string;
  statusInProgress: string;
  statusNotStarted: string;

  // Rosco game
  startGame: string;
  continueGameBtn: string;
  feedbackTimeout: string;
  feedbackPassed: string;
  feedbackCorrect: string;
  roscoCompleted: string;
  hitsLabel: string;
  pendingLabel: string;
  resultLabel: string;
  backToHome: string;
  startsWith: string;
  contains: string;

  // Day names
  daySun: string;
  dayMon: string;
  dayTue: string;
  dayWed: string;
  dayThu: string;
  dayFri: string;
  daySat: string;
}

export const translations: Record<string, Translation> = {
  es: {
    appTitle: "Enroscado",
    tagline: "pensá · respondé · ganá",
    howToPlay: "¿CÓMO JUGAR?",
    lookAtGrid: "Leé la pista",
    findDifferent: "Escribí la respuesta",
    clickQuickly: "Si no sabés: Pasapalabra",
    playButton: "JUGAR",
    selectLanguage: "Seleccionar idioma",
    spanish: "Español",
    english: "Inglés",
    portuguese: "Portugués",
    french: "Francés",
    findEmoji: "🤔 Encuentra el emoji",
    findDifferentEmoji: "¡Descubre cuál es el emoji diferente!",
    worldFlags: "🗺️ Banderas del Mundo",
    findFlagsDescription: "¡Encuentra las banderas de diferentes países!",
    moviesAndSeries: "🎬 Películas y Series",
    guessMoviesDescription: "¡Adivina las películas y series con emojis!",
    whatIsTitle: "🤔 ¿Qué es?",
    guessWhatDescription: "¡Adivina qué representa cada emoji!",
    home: "🏠 Inicio",
    findEmojiMenu: "🎮 Jugar",
    movies: "🎬 Películas",
    flags: "🚩 Banderas",
    whatIs: "❓ ¿Qué es?",
    language: "🌐 Idioma",
    findDifferentEmoji2: "Responde la palabra del rosco",
    findEmojiNotGroup: "Encuentra el Emoji que no pertenece al grupo",
    findFlagOf: "Encuentra la bandera de",
    guessCapitalNow: "Ahora adivina la capital...",
    findEmojiNow: "Ahora encuentra el emoji...",
    invalidLevel: "Error: Nivel no válido",
    itemNotFound: "Error: Item no encontrado",
    correct: "¡Acertaste!",
    excellent: "🎉 ¡Excelente!",
    nextScreen: "Pasando a las siguiente pantalla",
    knowCapitals: "🎉 ¡Conoces las capitales!",
    confirmExit: "¿Desea Salir?",
    loseProgress: "Se perderá el progreso actual del juego",
    cancel: "CANCELAR",
    confirm: "CONFIRMAR",
    gameOverMovie: "🌬️ ¡El telón se cerró!",
    gameOverLives: "💔 ¡Se acabaron las vidas!",
    tryAgain: "Volvamos a intentarlo...",
    studyGeography: "🗺️ ¡Hora de estudiar geografía!",
    tryAgainGeo: "Inténtalo de nuevo...",
    congratulations: "¡Felicitaciones!",
    completedAllScreens: "¡Completaste todas las pantallas!",
    clearProgress: "Borrar Progreso",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    readyToPlay: "¿Listo para jugar Enroscado? 😳",
    weeklySection: "Semanal",
    categorySection: "Por categoría",
    continueGame: "CONTINUAR",
    viewResult: "VER RESULTADO",
    lockedDay: "BLOQUEADO",
    unlocksOn: "Se habilita el",
    roscoOfThe: "ROSCO DEL",
    statusCompleted: "Completado",
    statusInProgress: "En progreso",
    statusNotStarted: "Sin jugar",
    startGame: "Comenzar",
    continueGameBtn: "Continuar",
    feedbackTimeout: "Tiempo agotado",
    feedbackPassed: "Pasapalabra",
    feedbackCorrect: "Correcto",
    roscoCompleted: "Rosco completado",
    hitsLabel: "Aciertos",
    pendingLabel: "Pendientes",
    resultLabel: "Resultado",
    backToHome: "Volver al inicio",
    startsWith: "Comienza con",
    contains: "Contiene",
    daySun: "Domingo",
    dayMon: "Lunes",
    dayTue: "Martes",
    dayWed: "Miércoles",
    dayThu: "Jueves",
    dayFri: "Viernes",
    daySat: "Sábado",
  },

  en: {
    appTitle: "Enroscado",
    tagline: "think · answer · win",
    howToPlay: "HOW TO PLAY?",
    lookAtGrid: "Read the clue",
    findDifferent: "Type your answer",
    clickQuickly: "If needed: pass",
    playButton: "PLAY",
    selectLanguage: "Select language",
    spanish: "Spanish",
    english: "English",
    portuguese: "Portuguese",
    french: "French",
    findEmoji: "🤔 Find the emoji",
    findDifferentEmoji: "Discover which emoji is different!",
    worldFlags: "🗺️ World Flags",
    findFlagsDescription: "Find the flags of different countries!",
    moviesAndSeries: "🎬 Movies and Series",
    guessMoviesDescription: "Guess the movies and series with emojis!",
    whatIsTitle: "🤔 What is?",
    guessWhatDescription: "Guess what each emoji represents!",
    home: "🏠 Home",
    findEmojiMenu: "🎮 Play",
    movies: "🎬 Movies",
    flags: "🚩 Flags",
    whatIs: "❓ What is?",
    language: "🌐 Language",
    findDifferentEmoji2: "Answer the Rosco word",
    findEmojiNotGroup: "Find the emoji that doesn't belong to the group",
    findFlagOf: "Find the flag of",
    guessCapitalNow: "Now guess the capital...",
    findEmojiNow: "Now find the emoji...",
    invalidLevel: "Error: Invalid level",
    itemNotFound: "Error: Item not found",
    correct: "You got it!",
    excellent: "🎉 Excellent!",
    nextScreen: "Moving to the next screen",
    knowCapitals: "🎉 You know the capitals!",
    confirmExit: "Do you want to exit?",
    loseProgress: "You will lose the current game progress",
    cancel: "CANCEL",
    confirm: "CONFIRM",
    gameOverMovie: "🌬️ The curtain fell!",
    gameOverLives: "💔 Lives are over!",
    tryAgain: "Let's try again...",
    studyGeography: "🗺️ Time to study geography!",
    tryAgainGeo: "Try again...",
    congratulations: "Congratulations!",
    completedAllScreens: "You completed all the screens!",
    clearProgress: "Clear Progress",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    readyToPlay: "Ready to play Enroscado? 😳",
    weeklySection: "Weekly",
    categorySection: "By category",
    continueGame: "CONTINUE",
    viewResult: "VIEW RESULT",
    lockedDay: "LOCKED",
    unlocksOn: "Unlocks on",
    roscoOfThe: "ROSCO OF",
    statusCompleted: "Completed",
    statusInProgress: "In progress",
    statusNotStarted: "Not played",
    startGame: "Start",
    continueGameBtn: "Continue",
    feedbackTimeout: "Time's up",
    feedbackPassed: "Pass",
    feedbackCorrect: "Correct!",
    roscoCompleted: "Rosco complete",
    hitsLabel: "Correct",
    pendingLabel: "Pending",
    resultLabel: "Result",
    backToHome: "Back to home",
    startsWith: "Starts with",
    contains: "Contains",
    daySun: "Sunday",
    dayMon: "Monday",
    dayTue: "Tuesday",
    dayWed: "Wednesday",
    dayThu: "Thursday",
    dayFri: "Friday",
    daySat: "Saturday",
  },

  pt: {
    appTitle: "Enroscado",
    tagline: "pense · responda · ganhe",
    howToPlay: "COMO JOGAR?",
    lookAtGrid: "Leia a dica",
    findDifferent: "Digite a resposta",
    clickQuickly: "Se nao souber: passe",
    playButton: "JOGAR",
    selectLanguage: "Selecionar idioma",
    spanish: "Espanhol",
    english: "Inglês",
    portuguese: "Português",
    french: "Francês",
    findEmoji: "🤔 Encontre o emoji",
    findDifferentEmoji: "Descubra qual emoji é diferente!",
    worldFlags: "🗺️ Bandeiras do Mundo",
    findFlagsDescription: "Encontre as bandeiras de diferentes países!",
    moviesAndSeries: "🎬 Filmes e Séries",
    guessMoviesDescription: "Adivinhe os filmes e séries com emojis!",
    whatIsTitle: "🤔 O que é?",
    guessWhatDescription: "Adivinhe o que cada emoji representa!",
    home: "🏠 Início",
    findEmojiMenu: "🎮 Jogar",
    movies: "🎬 Filmes",
    flags: "🚩 Bandeiras",
    whatIs: "❓ O que é?",
    language: "🌐 Idioma",
    findDifferentEmoji2: "Responda a palavra do rosco",
    findEmojiNotGroup: "Encontre o emoji que não pertence ao grupo",
    findFlagOf: "Encontre a bandeira de",
    guessCapitalNow: "Agora adivinhe a capital...",
    findEmojiNow: "Agora encontre o emoji...",
    invalidLevel: "Erro: Nível inválido",
    itemNotFound: "Erro: Item não encontrado",
    correct: "Você acertou!",
    excellent: "🎉 Excelente!",
    nextScreen: "Passando para a próxima tela",
    knowCapitals: "🎉 Você conhece as capitais!",
    confirmExit: "Deseja sair?",
    loseProgress: "Você perderá o progresso atual do jogo",
    cancel: "CANCELAR",
    confirm: "CONFIRMAR",
    gameOverMovie: "🌬️ A cortina caiu!",
    gameOverLives: "💔 As vidas acabaram!",
    tryAgain: "Vamos tentar novamente...",
    studyGeography: "🗺️ Hora de estudar geografia!",
    tryAgainGeo: "Tente novamente...",
    congratulations: "Parabéns!",
    completedAllScreens: "Você completou todas as telas!",
    clearProgress: "Limpar Progresso",
    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    goodEvening: "Boa noite",
    readyToPlay: "Pronto para jogar Enroscado? 😳",
    weeklySection: "Semanal",
    categorySection: "Por categoria",
    continueGame: "CONTINUAR",
    viewResult: "VER RESULTADO",
    lockedDay: "BLOQUEADO",
    unlocksOn: "Disponível em",
    roscoOfThe: "ROSCO DE",
    statusCompleted: "Concluído",
    statusInProgress: "Em andamento",
    statusNotStarted: "Não jogado",
    startGame: "Começar",
    continueGameBtn: "Continuar",
    feedbackTimeout: "Tempo esgotado",
    feedbackPassed: "Passa a palavra",
    feedbackCorrect: "Correto!",
    roscoCompleted: "Rosco concluído",
    hitsLabel: "Acertos",
    pendingLabel: "Pendentes",
    resultLabel: "Resultado",
    backToHome: "Voltar ao início",
    startsWith: "Começa com",
    contains: "Contém",
    daySun: "Domingo",
    dayMon: "Segunda",
    dayTue: "Terça",
    dayWed: "Quarta",
    dayThu: "Quinta",
    dayFri: "Sexta",
    daySat: "Sábado",
  },

  fr: {
    appTitle: "Enroscado",
    tagline: "pensez · repondez · gagnez",
    howToPlay: "COMMENT JOUER?",
    lookAtGrid: "Lisez l'indice",
    findDifferent: "Ecrivez la reponse",
    clickQuickly: "Si besoin: passez",
    playButton: "JOUER",
    selectLanguage: "Sélectionner la langue",
    spanish: "Espagnol",
    english: "Anglais",
    portuguese: "Portugais",
    french: "Français",
    findEmoji: "🤔 Trouvez l'emoji",
    findDifferentEmoji: "Découvrez quel emoji est différent!",
    worldFlags: "🗺️ Drapeaux du Monde",
    findFlagsDescription: "Trouvez les drapeaux de différents pays!",
    moviesAndSeries: "🎬 Films et Séries",
    guessMoviesDescription: "Devinez les films et séries avec des emojis!",
    whatIsTitle: "🤔 Qu'est-ce que?",
    guessWhatDescription: "Devinez ce que chaque emoji représente!",
    home: "🏠 Accueil",
    findEmojiMenu: "🎮 Jouer",
    movies: "🎬 Films",
    flags: "🚩 Drapeaux",
    whatIs: "❓ Qu'est-ce que?",
    language: "🌐 Langue",
    findDifferentEmoji2: "Repondez au mot du rosco",
    findEmojiNotGroup: "Trouvez l'emoji qui n'appartient pas au groupe",
    findFlagOf: "Trouvez le drapeau de",
    guessCapitalNow: "Maintenant devinez la capitale...",
    findEmojiNow: "Maintenant trouvez l'emoji...",
    invalidLevel: "Erreur: Niveau invalide",
    itemNotFound: "Erreur: Élément non trouvé",
    correct: "Vous avez réussi!",
    excellent: "🎉 Excellent!",
    nextScreen: "Passage à l'écran suivant",
    knowCapitals: "🎉 Vous connaissez les capitales!",
    confirmExit: "Voulez-vous quitter?",
    loseProgress: "Vous perdrez la progression actuelle du jeu",
    cancel: "ANNULER",
    confirm: "CONFIRMER",
    gameOverMovie: "🌬️ Le rideau est tombé!",
    gameOverLives: "💔 Les vies sont finies!",
    tryAgain: "Essayons encore...",
    studyGeography: "🗺️ Il est temps d'étudier la géographie!",
    tryAgainGeo: "Essayez encore...",
    congratulations: "Félicitations!",
    completedAllScreens: "Vous avez terminé tous les écrans!",
    clearProgress: "Effacer Progression",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    readyToPlay: "Prêt à jouer à Enroscado? 😳",
    weeklySection: "Hebdomadaire",
    categorySection: "Par catégorie",
    continueGame: "CONTINUER",
    viewResult: "VOIR RÉSULTAT",
    lockedDay: "VERROUILLÉ",
    unlocksOn: "Disponible le",
    roscoOfThe: "ROSCO DU",
    statusCompleted: "Complété",
    statusInProgress: "En cours",
    statusNotStarted: "Non joué",
    startGame: "Commencer",
    continueGameBtn: "Continuer",
    feedbackTimeout: "Temps écoulé",
    feedbackPassed: "Passez le mot",
    feedbackCorrect: "Correct!",
    roscoCompleted: "Rosco complété",
    hitsLabel: "Bons réponses",
    pendingLabel: "En attente",
    resultLabel: "Résultat",
    backToHome: "Retour à l'accueil",
    startsWith: "Commence par",
    contains: "Contient",
    daySun: "Dimanche",
    dayMon: "Lundi",
    dayTue: "Mardi",
    dayWed: "Mercredi",
    dayThu: "Jeudi",
    dayFri: "Vendredi",
    daySat: "Samedi",
  },
};

export type SupportedLanguage = "es" | "en" | "pt" | "fr";

export const getLanguageByCountry = (
  countryCode: string,
): SupportedLanguage => {
  const languageMap: Record<string, SupportedLanguage> = {
    // Spanish speaking countries
    AR: "es",
    MX: "es",
    CO: "es",
    PE: "es",
    CL: "es",
    VE: "es",
    BO: "es",
    PY: "es",
    UY: "es",
    ES: "es",
    EC: "es",
    GT: "es",
    HN: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    DO: "es",
    CU: "es",

    // Portuguese speaking countries
    BR: "pt",
    PT: "pt",
    AO: "pt",
    MZ: "pt",
    GW: "pt",
    CV: "pt",
    ST: "pt",
    TL: "pt",

    // French speaking countries
    FR: "fr",
    BE: "fr",
    CH: "fr",
    LU: "fr",
    MC: "fr",
    SN: "fr",
    CI: "fr",
    ML: "fr",
    BF: "fr",
    NE: "fr",
    TD: "fr",
    CF: "fr",
    CG: "fr",
    CD: "fr",
    GA: "fr",
    CM: "fr",
    DJ: "fr",
    KM: "fr",
    MG: "fr",
    SC: "fr",
    VU: "fr",
    NC: "fr",
    PF: "fr",

    // English speaking countries (fallback for others)
    US: "en",
    GB: "en",
    AU: "en",
    CA: "en",
    IE: "en",
    NZ: "en",
    ZA: "en",
    IN: "en",
    SG: "en",
    MY: "en",
    PH: "en",
    NG: "en",
    KE: "en",
    GH: "en",
    UG: "en",
  };

  return languageMap[countryCode] || "en";
};
