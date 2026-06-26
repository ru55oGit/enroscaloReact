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
  german: string;

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
  statusTimedOut: string;

  // Rosco game
  startGame: string;
  continueGameBtn: string;
  feedbackTimeout: string;
  feedbackPassed: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  roscoCompleted: string;
  hitsLabel: string;
  pendingLabel: string;
  resultLabel: string;
  backToHome: string;
  reloadTime: string;
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
  deleteKey: string;
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
    german: "Alemán",
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
    statusTimedOut: "Tiempo agotado",
    startGame: "Comenzar",
    continueGameBtn: "Continuar",
    feedbackTimeout: "Tiempo agotado",
    feedbackPassed: "Pasapalabra",
    feedbackCorrect: "Correcto",
    feedbackWrong: "Incorrecto. Era:",
    roscoCompleted: "Rosco completado",
    hitsLabel: "Aciertos",
    pendingLabel: "Pendientes",
    resultLabel: "Resultado",
    backToHome: "Volver al inicio",
    reloadTime: "Recargar tiempo",
    startsWith: "Comienza con",
    contains: "Contiene",
    daySun: "Domingo",
    dayMon: "Lunes",
    dayTue: "Martes",
    dayWed: "Miércoles",
    dayThu: "Jueves",
    dayFri: "Viernes",
    daySat: "Sábado",
    deleteKey: "Borrar",
  },

  en: {
    appTitle: "Enroscado",
    tagline: "The Alphabet Game",
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
    german: "German",
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
    statusTimedOut: "Time's up",
    startGame: "Start",
    continueGameBtn: "Continue",
    feedbackTimeout: "Time's up",
    feedbackPassed: "Pass",
    feedbackCorrect: "Correct!",
    feedbackWrong: "Wrong. It was:",
    roscoCompleted: "Rosco complete",
    hitsLabel: "Correct",
    pendingLabel: "Pending",
    resultLabel: "Result",
    backToHome: "Back to home",
    reloadTime: "Add time",
    startsWith: "Starts with",
    contains: "Contains",
    daySun: "Sunday",
    dayMon: "Monday",
    dayTue: "Tuesday",
    dayWed: "Wednesday",
    dayThu: "Thursday",
    dayFri: "Friday",
    daySat: "Saturday",
    deleteKey: "Delete",
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
    german: "Alemão",
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
    statusTimedOut: "Tempo esgotado",
    startGame: "Começar",
    continueGameBtn: "Continuar",
    feedbackTimeout: "Tempo esgotado",
    feedbackPassed: "Passa a palavra",
    feedbackCorrect: "Correto!",
    feedbackWrong: "Incorreto. Era:",
    roscoCompleted: "Rosco concluído",
    hitsLabel: "Acertos",
    pendingLabel: "Pendentes",
    resultLabel: "Resultado",
    backToHome: "Voltar ao início",
    reloadTime: "Recarregar tempo",
    startsWith: "Começa com",
    contains: "Contém",
    daySun: "Domingo",
    dayMon: "Segunda",
    dayTue: "Terça",
    dayWed: "Quarta",
    dayThu: "Quinta",
    dayFri: "Sexta",
    daySat: "Sábado",
    deleteKey: "Apagar",
  },

  fr: {
    appTitle: "Enroscado",
    tagline: "En toutes lettres",
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
    german: "Allemand",
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
    statusTimedOut: "Temps écoulé",
    startGame: "Commencer",
    continueGameBtn: "Continuer",
    feedbackTimeout: "Temps écoulé",
    feedbackPassed: "Passez le mot",
    feedbackCorrect: "Correct!",
    feedbackWrong: "Incorrect. C'était:",
    roscoCompleted: "Rosco complété",
    hitsLabel: "Bons réponses",
    pendingLabel: "En attente",
    resultLabel: "Résultat",
    backToHome: "Retour à l'accueil",
    reloadTime: "Recharger le temps",
    startsWith: "Commence par",
    contains: "Contient",
    daySun: "Dimanche",
    dayMon: "Lundi",
    dayTue: "Mardi",
    dayWed: "Mercredi",
    dayThu: "Jeudi",
    dayFri: "Vendredi",
    daySat: "Samedi",
    deleteKey: "Effacer",
  },

  de: {
    appTitle: "Enroscado",
    tagline: "Buchstaben Battle",
    howToPlay: "WIE SPIELEN?",
    lookAtGrid: "Lies den Hinweis",
    findDifferent: "Schreib die Antwort",
    clickQuickly: "Wenn du nicht weißt: Weiter",
    playButton: "SPIELEN",
    selectLanguage: "Sprache auswählen",
    spanish: "Spanisch",
    english: "Englisch",
    portuguese: "Portugiesisch",
    french: "Französisch",
    german: "Deutsch",
    findEmoji: "🤔 Finde das Emoji",
    findDifferentEmoji: "Entdecke, welches Emoji anders ist!",
    worldFlags: "🗺️ Weltflaggen",
    findFlagsDescription: "Finde die Flaggen verschiedener Länder!",
    moviesAndSeries: "🎬 Filme und Serien",
    guessMoviesDescription: "Errate Filme und Serien mit Emojis!",
    whatIsTitle: "🤔 Was ist das?",
    guessWhatDescription: "Errate, was jedes Emoji darstellt!",
    home: "🏠 Startseite",
    findEmojiMenu: "🎮 Spielen",
    movies: "🎬 Filme",
    flags: "🚩 Flaggen",
    whatIs: "❓ Was ist das?",
    language: "🌐 Sprache",
    findDifferentEmoji2: "Beantworte das Rosco-Wort",
    findEmojiNotGroup: "Finde das Emoji, das nicht zur Gruppe gehört",
    findFlagOf: "Finde die Flagge von",
    guessCapitalNow: "Rate jetzt die Hauptstadt...",
    findEmojiNow: "Finde jetzt das Emoji...",
    invalidLevel: "Fehler: Ungültige Stufe",
    itemNotFound: "Fehler: Element nicht gefunden",
    correct: "Richtig!",
    excellent: "🎉 Ausgezeichnet!",
    nextScreen: "Weiter zum nächsten Bildschirm",
    knowCapitals: "🎉 Du kennst die Hauptstädte!",
    confirmExit: "Möchtest du beenden?",
    loseProgress: "Der aktuelle Spielfortschritt geht verloren",
    cancel: "ABBRECHEN",
    confirm: "BESTÄTIGEN",
    gameOverMovie: "🌬️ Der Vorhang ist gefallen!",
    gameOverLives: "💔 Keine Leben mehr!",
    tryAgain: "Versuchen wir es nochmal...",
    studyGeography: "🗺️ Zeit, Geografie zu lernen!",
    tryAgainGeo: "Versuche es nochmal...",
    congratulations: "Glückwunsch!",
    completedAllScreens: "Du hast alle Bildschirme abgeschlossen!",
    clearProgress: "Fortschritt löschen",
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    readyToPlay: "Bereit, Enroscado zu spielen? 😳",
    weeklySection: "Wöchentlich",
    categorySection: "Nach Kategorie",
    continueGame: "WEITER",
    viewResult: "ERGEBNIS SEHEN",
    lockedDay: "GESPERRT",
    unlocksOn: "Verfügbar ab",
    roscoOfThe: "ROSCO VOM",
    statusCompleted: "Abgeschlossen",
    statusInProgress: "In Bearbeitung",
    statusNotStarted: "Nicht gespielt",
    statusTimedOut: "Zeit abgelaufen",
    startGame: "Starten",
    continueGameBtn: "Weiter",
    feedbackTimeout: "Zeit abgelaufen",
    feedbackPassed: "Weiter",
    feedbackCorrect: "Richtig!",
    feedbackWrong: "Falsch. Es war:",
    roscoCompleted: "Rosco abgeschlossen",
    hitsLabel: "Treffer",
    pendingLabel: "Ausstehend",
    resultLabel: "Ergebnis",
    backToHome: "Zurück zum Start",
    reloadTime: "Zeit aufladen",
    startsWith: "Beginnt mit",
    contains: "Enthält",
    daySun: "Sonntag",
    dayMon: "Montag",
    dayTue: "Dienstag",
    dayWed: "Mittwoch",
    dayThu: "Donnerstag",
    dayFri: "Freitag",
    daySat: "Samstag",
    deleteKey: "Löschen",
  },
};

export type SupportedLanguage = "es" | "en" | "pt" | "fr" | "de";

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

    // German speaking countries
    DE: "de",
    AT: "de",
    LI: "de",

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
