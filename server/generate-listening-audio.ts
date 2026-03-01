import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;
type Voice = typeof VOICES[number];

const VOICE_ACCENT_MAP: Record<Voice, string> = {
  alloy: "General American",
  echo: "Male British",
  fable: "British Narrative",
  onyx: "Deep American Male",
  nova: "Young American Female",
  shimmer: "Warm Female",
};

interface ListeningEntry {
  index: number;
  level: string;
  topic: string;
  passage: string;
  voice: Voice;
}

function extractListeningPassages(): ListeningEntry[] {
  const questionsFile = fs.readFileSync(path.join(__dirname, "english-test-questions.ts"), "utf-8");

  const entries: ListeningEntry[] = [];
  const regex = /q\("(\w+)",\s*"listening",\s*"(\w+)",\s*"[^"]+",\s*\[[^\]]+\],\s*"[^"]+",\s*\n?\s*"([^"]+)"\)/g;

  let match;
  let idx = 0;
  while ((match = regex.exec(questionsFile)) !== null) {
    const level = match[1];
    const topic = match[2];
    const passage = match[3].replace(/\\n/g, "\n").replace(/You will hear:\n?/i, "").trim();

    const voice = VOICES[idx % VOICES.length];
    entries.push({ index: idx, level, topic, passage, voice });
    idx++;
  }

  return entries;
}

async function generateAudio(text: string, voice: Voice, outputPath: string): Promise<void> {
  const response = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: voice,
    input: text,
    response_format: "mp3",
    speed: 0.95,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

async function main() {
  const outputDir = path.join(__dirname, "..", "client", "public", "audio", "listening");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const entries = extractListeningPassages();
  console.log(`Found ${entries.length} listening passages to generate audio for.`);

  if (entries.length === 0) {
    console.error("No listening passages found! Check the regex pattern.");
    process.exit(1);
  }

  for (const entry of entries) {
    const fileName = `listening_${entry.level}_${entry.index.toString().padStart(3, "0")}.mp3`;
    const filePath = path.join(outputDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`SKIP (exists): ${fileName}`);
      continue;
    }

    console.log(`Generating [${entry.index + 1}/${entries.length}] ${fileName} (voice: ${entry.voice} / ${VOICE_ACCENT_MAP[entry.voice]})...`);
    console.log(`  Text: ${entry.passage.substring(0, 80)}...`);

    try {
      await generateAudio(entry.passage, entry.voice, filePath);
      console.log(`  OK: ${fileName} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
    } catch (error: any) {
      console.error(`  ERROR: ${fileName} - ${error.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log("\nDone! Now update english-test-questions.ts audioUrl fields.");

  const manifest: Record<string, string> = {};
  for (const entry of entries) {
    const fileName = `listening_${entry.level}_${entry.index.toString().padStart(3, "0")}.mp3`;
    manifest[`${entry.level}_${entry.index}`] = `/audio/listening/${fileName}`;
  }
  fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Manifest written to manifest.json");
}

main().catch(console.error);
