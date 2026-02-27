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
  A1: -200,
  A2: -100,
  B1: 0,
  B2: 100,
  C1: 200,
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

export function updateTheta(oldTheta: number, isCorrect: boolean, standardError: number): number {
  const se = standardError / 100;
  const step = (isCorrect ? 0.3 : -0.3) * (1 / se);
  const newTheta = oldTheta + Math.round(step * 100);
  return Math.max(-300, Math.min(300, newTheta));
}

export function updateStandardError(oldSE: number): number {
  const newSE = Math.round(oldSE * 0.9);
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

export function checkPhaseTransitions(
  totalQuestions: number,
  correctAnswers: number,
  currentLevel: string,
  questionsAtCurrentLevel: number
): { newLevel: string; phaseComplete: boolean } {
  const levelIdx = LEVEL_NUMERIC[currentLevel] ?? 1;

  if (totalQuestions <= 9) {
    if (totalQuestions === 2) {
      if (correctAnswers === 2 && levelIdx < 5) return { newLevel: NUMERIC_LEVEL[levelIdx + 1], phaseComplete: false };
      if (correctAnswers === 0 && levelIdx > 0) return { newLevel: NUMERIC_LEVEL[levelIdx - 1], phaseComplete: false };
    }
    if (totalQuestions === 3) {
      if (correctAnswers === 3 && levelIdx < 5) return { newLevel: NUMERIC_LEVEL[levelIdx + 1], phaseComplete: false };
      if (correctAnswers === 0 && levelIdx > 0) return { newLevel: NUMERIC_LEVEL[levelIdx - 1], phaseComplete: false };
    }
    if (totalQuestions === 6) {
      if (correctAnswers >= 5 && levelIdx < 5) return { newLevel: NUMERIC_LEVEL[levelIdx + 1], phaseComplete: false };
      if (correctAnswers <= 1 && levelIdx > 0) return { newLevel: NUMERIC_LEVEL[levelIdx - 1], phaseComplete: false };
    }
    if (totalQuestions === 9) {
      if (correctAnswers >= 7 && levelIdx < 5) return { newLevel: NUMERIC_LEVEL[levelIdx + 1], phaseComplete: false };
      if (correctAnswers <= 3 && levelIdx > 0) return { newLevel: NUMERIC_LEVEL[levelIdx - 1], phaseComplete: false };
    }
  } else if (totalQuestions <= 15) {
    if (totalQuestions >= 14) {
      const recentCorrect = correctAnswers;
      const window5Correct = Math.min(recentCorrect, 5);
      if (window5Correct >= 4 && levelIdx < 5) return { newLevel: NUMERIC_LEVEL[levelIdx + 1], phaseComplete: false };
      if (window5Correct <= 1 && levelIdx > 0) return { newLevel: NUMERIC_LEVEL[levelIdx - 1], phaseComplete: false };
    }
  } else {
    if (questionsAtCurrentLevel >= 8) {
      return { newLevel: currentLevel, phaseComplete: true };
    }
  }

  return { newLevel: currentLevel, phaseComplete: false };
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

export function getWritingPrompt(level: string): string {
  const prompts: Record<string, string> = {
    A0: "Write a very simple email saying hello to a colleague.",
    A1: "Write a short email to introduce yourself to a new colleague. Include your name, job title, and department.",
    A2: "Write an email to your manager asking for time off next week for a personal appointment.",
    B1: "Write an email to a client confirming a meeting next Tuesday at 2 PM.",
    B2: "Write an email to a supplier expressing concern about a delayed shipment.",
    C1: "Write an email to your team announcing a strategic reorganization of the department.",
  };
  return prompts[level] || prompts.B1;
}

export function getSpeakingPrompt(level: string): string {
  const prompts: Record<string, string> = {
    A0: "Tell me your name and what you do at work. Use very simple words.",
    A1: "Describe your typical workday in simple terms.",
    A2: "Explain what your company does and what products or services it offers.",
    B1: "Describe a challenge you faced at work recently and how you resolved it.",
    B2: "Discuss the advantages and disadvantages of remote work for your industry.",
    C1: "Analyze how digital transformation is affecting your sector and propose strategies for staying competitive.",
  };
  return prompts[level] || prompts.B1;
}

export const SECTION_SKILLS = ["grammar", "vocabulary", "use_of_english", "reading", "listening"] as const;
export const MAX_QUESTIONS_PER_SECTION = 5;
export const TOTAL_MC_SECTIONS = 5;
