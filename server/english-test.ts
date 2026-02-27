import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

export interface WritingScore {
  score: number;
  level: string;
  feedback: string;
  grammar: string;
  vocabulary: string;
  coherence: string;
  taskAchievement: string;
}

export interface SpeakingScore {
  score: number;
  level: string;
  feedback: string;
  fluency: string;
  grammar: string;
  vocabulary: string;
  pronunciation: string;
  coherence: string;
}

function scoreToCEFR(score: number): string {
  if (score >= 90) return "C2";
  if (score >= 78) return "C1";
  if (score >= 65) return "B2";
  if (score >= 50) return "B1";
  if (score >= 35) return "A2";
  return "A1";
}

export async function scoreWriting(prompt: string, response: string, targetLevel: string): Promise<WritingScore> {
  const openai = getOpenAI();

  const systemPrompt = `You are an expert English language examiner for CEFR placement tests. 
You must evaluate a candidate's written response and provide a score from 0-100.

Scoring criteria:
- Grammar accuracy (25%): Correct use of tenses, articles, prepositions, sentence structure
- Vocabulary range (25%): Appropriate word choice, variety, collocations
- Coherence & cohesion (25%): Logical flow, linking words, paragraph structure
- Task achievement (25%): Relevance to prompt, adequate length, completeness

The target level for this task is ${targetLevel}. Score relative to native-like proficiency (100 = perfect native).

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "level": "<CEFR level A1-C2>",
  "feedback": "<2-3 sentences of constructive feedback>",
  "grammar": "<1 sentence about grammar>",
  "vocabulary": "<1 sentence about vocabulary>",
  "coherence": "<1 sentence about coherence>",
  "taskAchievement": "<1 sentence about task achievement>"
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
  if (!content) {
    return {
      score: 0, level: "A1",
      feedback: "Unable to evaluate response.",
      grammar: "N/A", vocabulary: "N/A", coherence: "N/A", taskAchievement: "N/A",
    };
  }

  const parsed = JSON.parse(content);
  return {
    score: Math.min(100, Math.max(0, parsed.score || 0)),
    level: parsed.level || scoreToCEFR(parsed.score || 0),
    feedback: parsed.feedback || "",
    grammar: parsed.grammar || "",
    vocabulary: parsed.vocabulary || "",
    coherence: parsed.coherence || "",
    taskAchievement: parsed.taskAchievement || "",
  };
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string = "audio/webm"): Promise<string> {
  const openai = getOpenAI();

  const ext = mimeType.includes("wav") ? "wav" : mimeType.includes("mp4") ? "mp4" : "webm";
  const file = await import("openai").then(m => m.toFile(audioBuffer, `recording.${ext}`, { type: mimeType }));

  const transcription = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    language: "en",
  });

  return transcription.text;
}

export async function scoreSpeaking(prompt: string, transcription: string, targetLevel: string): Promise<SpeakingScore> {
  const openai = getOpenAI();

  const systemPrompt = `You are an expert English language examiner for CEFR placement tests.
You must evaluate a candidate's spoken response (provided as a transcription) and provide a score from 0-100.

Scoring criteria:
- Fluency (20%): Natural flow, appropriate pace, minimal hesitation
- Grammar accuracy (20%): Correct structures, tenses, agreement
- Vocabulary range (20%): Appropriate and varied word choice
- Pronunciation indicators (20%): Based on transcription patterns (unusual spellings from Whisper may indicate pronunciation issues)
- Coherence (20%): Logical structure, clear ideas, relevant to prompt

The target level for this task is ${targetLevel}. Score relative to native-like proficiency (100 = perfect native).

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "level": "<CEFR level A1-C2>",
  "feedback": "<2-3 sentences of constructive feedback>",
  "fluency": "<1 sentence about fluency>",
  "grammar": "<1 sentence about grammar>",
  "vocabulary": "<1 sentence about vocabulary>",
  "pronunciation": "<1 sentence about pronunciation>",
  "coherence": "<1 sentence about coherence>"
}`;

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Prompt: "${prompt}"\n\nCandidate's spoken response (transcription):\n"${transcription}"` },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (!content) {
    return {
      score: 0, level: "A1",
      feedback: "Unable to evaluate response.",
      fluency: "N/A", grammar: "N/A", vocabulary: "N/A", pronunciation: "N/A", coherence: "N/A",
    };
  }

  const parsed = JSON.parse(content);
  return {
    score: Math.min(100, Math.max(0, parsed.score || 0)),
    level: parsed.level || scoreToCEFR(parsed.score || 0),
    feedback: parsed.feedback || "",
    fluency: parsed.fluency || "",
    grammar: parsed.grammar || "",
    vocabulary: parsed.vocabulary || "",
    pronunciation: parsed.pronunciation || "",
    coherence: parsed.coherence || "",
  };
}
