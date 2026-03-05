import type { BeQuestion } from "@shared/schema";

const CEFR_LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"] as const;

const THETA_THRESHOLDS: Record<string, number> = {
  C1: 225,
  B2: 125,
  B1: 25,
  A2: -75,
  A1: -175,
};

const SELF_ASSESSMENT_THETA: Record<string, number> = {
  A1: -150,
  A2: -50,
  B1: 50,
  B2: 150,
  C1: 250,
};

const LEVEL_NUMERIC: Record<string, number> = {
  A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5,
};

const NUMERIC_LEVEL: Record<number, string> = {
  0: "A0", 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1",
};

export function calculateProbability(theta: number, difficulty: number, discrimination: number): number {
  const a = discrimination / 100;
  const b = difficulty / 100;
  const t = theta / 100;
  return 1 / (1 + Math.exp(-a * (t - b)));
}

export function calculateFisherInformation(theta: number, difficulty: number, discrimination: number): number {
  const a = discrimination / 100;
  const p = calculateProbability(theta, difficulty, discrimination);
  return a * a * p * (1 - p);
}

export function selectNextQuestion(
  theta: number,
  usedQuestionIds: number[],
  skillType: string,
  availableQuestions: BeQuestion[]
): BeQuestion | null {
  const candidates = availableQuestions.filter(
    (q) => q.skillType === skillType && !usedQuestionIds.includes(q.id)
  );

  if (candidates.length === 0) return null;

  let bestQuestion: BeQuestion | null = null;
  let bestInfo = -Infinity;

  for (const q of candidates) {
    const info = calculateFisherInformation(theta, q.difficulty ?? 0, q.discrimination ?? 100);
    if (info > bestInfo) {
      bestInfo = info;
      bestQuestion = q;
    }
  }

  return bestQuestion;
}

export function updateTheta(oldTheta: number, isCorrect: boolean, standardError: number, difficulty: number = 0, discrimination: number = 100): number {
  const safeSE = Math.max(standardError, 20);
  const se = safeSE / 100;
  const a = 1.5; // Optimized discrimination for faster movement
  const p = calculateProbability(oldTheta, difficulty, discrimination);
  const residual = (isCorrect ? 1 : 0) - p;
  const step = se * se * a * residual;
  const newTheta = oldTheta + Math.round(step * 300); // Higher step multiplier to jump levels faster
  return Math.max(-300, Math.min(300, newTheta));
}

export function updateStandardError(oldSE: number, theta: number, difficulty: number = 0, discrimination: number = 100): number {
  const se = Math.max(oldSE, 20) / 100;
  const a = 1.5; // Matches updateTheta discrimination
  const p = calculateProbability(theta, difficulty, discrimination);
  const info = a * a * p * (1 - p);
  const newVariance = 1 / (1 / (se * se) + info);
  const newSE = Math.round(Math.sqrt(newVariance) * 100);
  return Math.max(20, newSE);
}

export function thetaToCEFR(theta: number): string {
  if (theta >= THETA_THRESHOLDS.C1) return "C1";
  if (theta >= THETA_THRESHOLDS.B2) return "B2";
  if (theta >= THETA_THRESHOLDS.B1) return "B1";
  if (theta >= THETA_THRESHOLDS.A2) return "A2";
  if (theta >= THETA_THRESHOLDS.A1) return "A1";
  return "A0";
}

export function selfAssessmentToTheta(level: string): number {
  return SELF_ASSESSMENT_THETA[level] ?? 0;
}

export function checkA0HardFail(consecutiveIncorrectA1: number, currentLevel: string): boolean {
  return currentLevel === "A1" && consecutiveIncorrectA1 >= 6;
}

export function calculateFinalLevel(
  mcLevel: string,
  writingLevel: string | null,
  speakingLevel: string | null
): string {
  const mcNum = LEVEL_NUMERIC[mcLevel] ?? 0;

  if (!writingLevel && !speakingLevel) return mcLevel;

  if (!speakingLevel) {
    const wNum = LEVEL_NUMERIC[writingLevel!] ?? 0;
    const avg = mcNum * 0.6 + wNum * 0.4;
    return NUMERIC_LEVEL[Math.round(avg)] ?? "A0";
  }

  if (!writingLevel) {
    const sNum = LEVEL_NUMERIC[speakingLevel] ?? 0;
    const avg = mcNum * 0.6 + sNum * 0.4;
    return NUMERIC_LEVEL[Math.round(avg)] ?? "A0";
  }

  const wNum = LEVEL_NUMERIC[writingLevel] ?? 0;
  const sNum = LEVEL_NUMERIC[speakingLevel] ?? 0;
  const avg = mcNum * 0.4 + wNum * 0.3 + sNum * 0.3;
  return NUMERIC_LEVEL[Math.round(avg)] ?? "A0";
}

const writingPrompts: Record<string, Record<string, string>> = {
  english: {
    A0: "Write 3-4 simple sentences about yourself: your name, where you live, and one thing you like.",
    A1: "Write a short message to a friend inviting them to a party at your house this Saturday. Include the time and your address.",
    A2: "Write an email to a hotel to book a room for two nights next month. Ask about the price and breakfast.",
    B1: "Write a letter to a friend describing a recent holiday you took. Include where you went, what you did, and whether you enjoyed it.",
    B2: "Write an essay discussing the advantages and disadvantages of social media for young people today.",
    C1: "Write a well-structured opinion essay on whether governments should invest more in renewable energy. Support your argument with examples.",
  },
  german: {
    A0: "Schreiben Sie 3-4 einfache Sätze über sich selbst: Ihren Namen, wo Sie wohnen und eine Sache, die Sie mögen.",
    A1: "Schreiben Sie eine kurze Nachricht an einen Freund und laden Sie ihn zu einer Party bei Ihnen am Samstag ein. Nennen Sie die Uhrzeit und Ihre Adresse.",
    A2: "Schreiben Sie eine E-Mail an ein Hotel, um ein Zimmer für zwei Nächte nächsten Monat zu buchen. Fragen Sie nach dem Preis und dem Frühstück.",
    B1: "Schreiben Sie einen Brief an einen Freund, in dem Sie einen kürzlichen Urlaub beschreiben. Erzählen Sie, wohin Sie gefahren sind, was Sie gemacht haben und ob es Ihnen gefallen hat.",
    B2: "Schreiben Sie einen Aufsatz über die Vor- und Nachteile von sozialen Medien für junge Menschen heute.",
    C1: "Schreiben Sie einen gut strukturierten Meinungsaufsatz darüber, ob Regierungen mehr in erneuerbare Energien investieren sollten. Unterstützen Sie Ihre Argumentation mit Beispielen.",
  },
  italian: {
    A0: "Scrivi 3-4 frasi semplici su di te: il tuo nome, dove vivi e una cosa che ti piace.",
    A1: "Scrivi un breve messaggio a un amico per invitarlo a una festa a casa tua sabato prossimo. Includi l'orario e il tuo indirizzo.",
    A2: "Scrivi un'e-mail a un hotel per prenotare una camera per due notti il mese prossimo. Chiedi informazioni sul prezzo e sulla colazione.",
    B1: "Scrivi una lettera a un amico descrivendo una vacanza recente. Racconta dove sei andato/a, cosa hai fatto e se ti è piaciuto.",
    B2: "Scrivi un tema sui vantaggi e gli svantaggi dei social media per i giovani di oggi.",
    C1: "Scrivi un saggio d'opinione ben strutturato sul tema se i governi dovrebbero investire di più nelle energie rinnovabili. Supporta la tua argomentazione con esempi.",
  },
  french: {
    A0: "Écrivez 3-4 phrases simples sur vous-même : votre nom, où vous habitez et une chose que vous aimez.",
    A1: "Écrivez un court message à un ami pour l'inviter à une fête chez vous samedi prochain. Indiquez l'heure et votre adresse.",
    A2: "Écrivez un e-mail à un hôtel pour réserver une chambre pour deux nuits le mois prochain. Demandez le prix et le petit-déjeuner.",
    B1: "Écrivez une lettre à un ami décrivant des vacances récentes. Racontez où vous êtes allé(e), ce que vous avez fait et si vous avez aimé.",
    B2: "Écrivez un essai sur les avantages et les inconvénients des réseaux sociaux pour les jeunes d'aujourd'hui.",
    C1: "Écrivez un essai d'opinion bien structuré sur la question de savoir si les gouvernements devraient investir davantage dans les énergies renouvelables. Appuyez votre argumentation avec des exemples.",
  },
  spanish: {
    A0: "Escribe 3-4 oraciones simples sobre ti mismo/a: tu nombre, dónde vives y una cosa que te gusta.",
    A1: "Escribe un mensaje corto a un amigo invitándolo a una fiesta en tu casa el próximo sábado. Incluye la hora y tu dirección.",
    A2: "Escribe un correo electrónico a un hotel para reservar una habitación por dos noches el próximo mes. Pregunta por el precio y el desayuno.",
    B1: "Escribe una carta a un amigo describiendo unas vacaciones recientes. Cuenta adónde fuiste, qué hiciste y si te gustó.",
    B2: "Escribe un ensayo sobre las ventajas y desventajas de las redes sociales para los jóvenes de hoy.",
    C1: "Escribe un ensayo de opinión bien estructurado sobre si los gobiernos deberían invertir más en energías renovables. Apoya tu argumentación con ejemplos.",
  },
};

const speakingPrompts: Record<string, Record<string, string>> = {
  english: {
    A0: "Tell me your name and where you are from. Use very simple words.",
    A1: "Describe your daily routine. What do you do in the morning, afternoon, and evening?",
    A2: "Talk about your favourite hobby or free-time activity. Why do you enjoy it?",
    B1: "Describe an interesting trip or experience you had recently and explain why it was memorable.",
    B2: "Discuss the advantages and disadvantages of living in a big city compared to a small town.",
    C1: "Analyse how technology has changed the way people communicate and discuss whether these changes are mostly positive or negative.",
  },
  german: {
    A0: "Sagen Sie mir Ihren Namen und woher Sie kommen. Verwenden Sie ganz einfache Wörter.",
    A1: "Beschreiben Sie Ihren Tagesablauf. Was machen Sie morgens, nachmittags und abends?",
    A2: "Erzählen Sie von Ihrem Lieblingshobby oder Ihrer Freizeitbeschäftigung. Warum gefällt es Ihnen?",
    B1: "Beschreiben Sie eine interessante Reise oder Erfahrung, die Sie kürzlich gemacht haben, und erklären Sie, warum sie unvergesslich war.",
    B2: "Diskutieren Sie die Vor- und Nachteile des Lebens in einer Großstadt im Vergleich zu einer Kleinstadt.",
    C1: "Analysieren Sie, wie die Technologie die Art und Weise verändert hat, wie Menschen kommunizieren, und erörtern Sie, ob diese Veränderungen überwiegend positiv oder negativ sind.",
  },
  italian: {
    A0: "Dimmi il tuo nome e da dove vieni. Usa parole molto semplici.",
    A1: "Descrivi la tua routine quotidiana. Cosa fai la mattina, il pomeriggio e la sera?",
    A2: "Parla del tuo hobby preferito o di un'attività del tempo libero. Perché ti piace?",
    B1: "Descrivi un viaggio o un'esperienza interessante che hai fatto di recente e spiega perché è stata memorabile.",
    B2: "Discuti i vantaggi e gli svantaggi di vivere in una grande città rispetto a una piccola città.",
    C1: "Analizza come la tecnologia ha cambiato il modo in cui le persone comunicano e discuti se questi cambiamenti sono prevalentemente positivi o negativi.",
  },
  french: {
    A0: "Dites-moi votre nom et d'où vous venez. Utilisez des mots très simples.",
    A1: "Décrivez votre routine quotidienne. Que faites-vous le matin, l'après-midi et le soir ?",
    A2: "Parlez de votre passe-temps préféré ou d'une activité de loisir. Pourquoi l'aimez-vous ?",
    B1: "Décrivez un voyage ou une expérience intéressante que vous avez vécue récemment et expliquez pourquoi elle était mémorable.",
    B2: "Discutez des avantages et des inconvénients de vivre dans une grande ville par rapport à une petite ville.",
    C1: "Analysez comment la technologie a changé la façon dont les gens communiquent et discutez si ces changements sont plutôt positifs ou négatifs.",
  },
  spanish: {
    A0: "Dime tu nombre y de dónde eres. Usa palabras muy sencillas.",
    A1: "Describe tu rutina diaria. ¿Qué haces por la mañana, por la tarde y por la noche?",
    A2: "Habla de tu pasatiempo favorito o actividad de tiempo libre. ¿Por qué te gusta?",
    B1: "Describe un viaje o una experiencia interesante que hayas tenido recientemente y explica por qué fue memorable.",
    B2: "Discute las ventajas y desventajas de vivir en una ciudad grande en comparación con un pueblo pequeño.",
    C1: "Analiza cómo la tecnología ha cambiado la forma en que las personas se comunican y discute si estos cambios son mayormente positivos o negativos.",
  },
};

export function getWritingPrompt(level: string, language: string = "english"): string {
  const prompts = writingPrompts[language] || writingPrompts.english;
  return prompts[level] || prompts.B1;
}

export function getSpeakingPrompt(level: string, language: string = "english"): string {
  const prompts = speakingPrompts[language] || speakingPrompts.english;
  return prompts[level] || prompts.B1;
}

export const SECTION_SKILLS = ["grammar", "vocabulary", "use_of_english", "reading", "listening"] as const;
export const MIN_QUESTIONS_PER_SECTION = 5;
export const MAX_QUESTIONS_PER_SECTION = 25;
export const TOTAL_MC_SECTIONS = 5;

export const LEVEL_STABILITY_COUNT = 3;

export function isLevelStable(recentSectionLevels: string[], requiredConsecutive: number = LEVEL_STABILITY_COUNT): boolean {
  if (recentSectionLevels.length < requiredConsecutive) return false;
  const last = recentSectionLevels.slice(-requiredConsecutive);
  return last.every(l => l === last[0]);
}

export function shouldEndSection(
  questionsInSection: number,
  standardError: number,
  recentSectionLevels: string[],
  maxQuestions: number = 25
): boolean {
  if (questionsInSection >= maxQuestions) return true;
  if (questionsInSection < Math.min(MIN_QUESTIONS_PER_SECTION, maxQuestions)) return false;

  // Optimized stopping condition: lower SE threshold to ensure better precision
  // for high-ability students or lucky guessers, while still allowing early stop.
  if (standardError <= 35 && isLevelStable(recentSectionLevels)) return true;

  return false;
}
