import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const WHISPER_LANG_CODES: Record<string, string> = {
  english: "en",
  german: "de",
  italian: "it",
  french: "fr",
  spanish: "es",
};

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string = "audio/webm", language: string = "english"): Promise<string> {
  const openai = getOpenAI();

  const ext = mimeType.includes("wav") ? "wav" : mimeType.includes("mp4") ? "mp4" : "webm";
  const file = await import("openai").then(m => m.toFile(audioBuffer, `recording.${ext}`, { type: mimeType }));

  const transcription = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    language: WHISPER_LANG_CODES[language] || "en",
  });

  return transcription.text;
}

export interface EnglishTestScore {
  level: string;
  grammar: number;
  vocabulary: number;
  coherence: number;
  taskCompletion: number;
  feedback: string;
}

export async function scoreWriting(prompt: string, response: string, currentLevel: string, language: string = "english"): Promise<EnglishTestScore> {
  const openai = getOpenAI();

  const languageNames: Record<string, string> = {
    english: "English",
    italian: "Italian",
    german: "German",
    french: "French",
    spanish: "Spanish",
  };
  const langName = languageNames[language] || "English";

  const systemPrompt = `You are an expert ${langName} language examiner. Evaluate a candidate's written response for a General ${langName} placement test.
The candidate's response MUST be evaluated as ${langName} writing. If the response is entirely in a different language, score it very low.
However, ignore occasional filler words or short expressions from the candidate's native language (e.g. "dunque", "ma", "allora", "bueno", "also", "perro", "alors"). These subconscious slips are normal for language learners and should NOT count against the candidate.
The candidate's estimated CEFR level is ${currentLevel}.

Score these four dimensions from 0-100:
- grammar: Grammar accuracy — correctness, complexity, and range of structures used
- vocabulary: Vocabulary range — variety, appropriateness, collocations
- coherence: Coherence — organization, logical flow, use of linking words
- taskCompletion: Task completion — relevance to the prompt, completeness, adequate length

Then assign an overall CEFR level: A0, A1, A2, B1, B2, or C1.
Provide 2-3 sentences of constructive feedback.

Respond ONLY with valid JSON:
{
  "level": "<CEFR level A0-C1>",
  "grammar": <number 0-100>,
  "vocabulary": <number 0-100>,
  "coherence": <number 0-100>,
  "taskCompletion": <number 0-100>,
  "feedback": "<2-3 sentences>"
}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Prompt: "${prompt}"\n\nCandidate's response:\n"${response}"` },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("Failed to parse writing AI response:", content);
    return { level: currentLevel, grammar: 50, vocabulary: 50, coherence: 50, taskCompletion: 50, feedback: "AI scoring encountered an issue. Scores are approximate." };
  }
  const validLevels = ["A0", "A1", "A2", "B1", "B2", "C1"];
  const normalizedLevel = (parsed.level || "").replace(/[^A-C0-2]/g, "").toUpperCase();
  return {
    level: validLevels.includes(normalizedLevel) ? normalizedLevel : currentLevel,
    grammar: Math.min(100, Math.max(0, parsed.grammar || 0)),
    vocabulary: Math.min(100, Math.max(0, parsed.vocabulary || 0)),
    coherence: Math.min(100, Math.max(0, parsed.coherence || 0)),
    taskCompletion: Math.min(100, Math.max(0, parsed.taskCompletion || 0)),
    feedback: parsed.feedback || "",
  };
}

export async function scoreSpeaking(prompt: string, transcript: string, currentLevel: string, language: string = "english"): Promise<EnglishTestScore> {
  const openai = getOpenAI();

  const languageNames: Record<string, string> = {
    english: "English",
    italian: "Italian",
    german: "German",
    french: "French",
    spanish: "Spanish",
  };
  const langName = languageNames[language] || "English";

  const systemPrompt = `You are an expert ${langName} language examiner. Evaluate a candidate's spoken response (transcribed) for a General ${langName} placement test.
The candidate's response MUST be evaluated as ${langName} speech. If the response is entirely in a different language, score it very low.
However, ignore occasional filler words or short expressions from the candidate's native language (e.g. "dunque", "ma", "allora", "bueno", "also", "perro", "alors", "ehm", "cioè"). These subconscious slips are very common in spoken language tests and should NOT count against the candidate. Focus on the substantive ${langName} content only.
The transcript was generated by automatic speech recognition, so expect imperfect transcriptions caused by strong foreign accents. Do NOT penalize pronunciation-related misspellings, phonetic approximations, or minor word-boundary errors in the transcript — these are artifacts of the transcription process and the candidate's accent, not indicators of their ${langName} proficiency. Evaluate the intended meaning and grammatical structure behind the words.
The candidate's estimated CEFR level is ${currentLevel}.

Score these four dimensions from 0-100:
- grammar: Grammar accuracy — correctness and complexity in spoken ${langName}
- vocabulary: Vocabulary range — variety, appropriateness, fluency of expression
- coherence: Coherence — logical flow, clarity of ideas, appropriate register
- taskCompletion: Task completion — addressing the prompt fully, relevant content

Then assign an overall CEFR level: A0, A1, A2, B1, B2, or C1.
Provide 2-3 sentences of constructive feedback.

Respond ONLY with valid JSON:
{
  "level": "<CEFR level A0-C1>",
  "grammar": <number 0-100>,
  "vocabulary": <number 0-100>,
  "coherence": <number 0-100>,
  "taskCompletion": <number 0-100>,
  "feedback": "<2-3 sentences>"
}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Prompt: "${prompt}"\n\nCandidate's spoken response (transcript):\n"${transcript}"` },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("Failed to parse speaking AI response:", content);
    return { level: currentLevel, grammar: 50, vocabulary: 50, coherence: 50, taskCompletion: 50, feedback: "AI scoring encountered an issue. Scores are approximate." };
  }
  const validLevels = ["A0", "A1", "A2", "B1", "B2", "C1"];
  const normalizedLevel = (parsed.level || "").replace(/[^A-C0-2]/g, "").toUpperCase();
  return {
    level: validLevels.includes(normalizedLevel) ? normalizedLevel : currentLevel,
    grammar: Math.min(100, Math.max(0, parsed.grammar || 0)),
    vocabulary: Math.min(100, Math.max(0, parsed.vocabulary || 0)),
    coherence: Math.min(100, Math.max(0, parsed.coherence || 0)),
    taskCompletion: Math.min(100, Math.max(0, parsed.taskCompletion || 0)),
    feedback: parsed.feedback || "",
  };
}
