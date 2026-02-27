import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Award,
  Clock,
  Globe,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Target,
  MessageSquare,
  PenLine,
  Mic,
  MicOff,
  Square,
  Loader2,
  Download,
  Printer,
  User,
  Mail,
  Phone,
  Volume2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";

interface Question {
  id: number;
  level: string;
  text: string;
  options: string[];
  correct: number;
}

const questions: Question[] = [
  { id: 1, level: "A1", text: "What ___ your name?", options: ["is", "are", "am", "do"], correct: 0 },
  { id: 2, level: "A1", text: "She ___ from Italy.", options: ["come", "comes", "coming", "is come"], correct: 1 },
  { id: 3, level: "A1", text: "I ___ a student.", options: ["is", "are", "am", "be"], correct: 2 },
  { id: 4, level: "A1", text: "___ you like coffee?", options: ["Are", "Is", "Do", "Does"], correct: 2 },
  { id: 5, level: "A1", text: "There ___ two cats in the garden.", options: ["is", "are", "be", "have"], correct: 1 },
  { id: 6, level: "A1", text: "I go to school ___ bus.", options: ["with", "in", "by", "on"], correct: 2 },
  { id: 7, level: "A1", text: "My sister ___ tennis every Saturday.", options: ["play", "plays", "playing", "is play"], correct: 1 },
  { id: 8, level: "A1", text: "We ___ got a big house.", options: ["has", "have", "is", "are"], correct: 1 },
  { id: 9, level: "A2", text: "I ___ to the cinema last night.", options: ["go", "goes", "went", "gone"], correct: 2 },
  { id: 10, level: "A2", text: "She is ___ than her brother.", options: ["tall", "taller", "tallest", "more tall"], correct: 1 },
  { id: 11, level: "A2", text: "We ___ dinner when the phone rang.", options: ["have", "had", "were having", "are having"], correct: 2 },
  { id: 12, level: "A2", text: "You ___ smoke in the hospital.", options: ["mustn't", "don't have", "haven't", "aren't"], correct: 0 },
  { id: 13, level: "A2", text: "He has ___ been to London.", options: ["ever", "never", "yet", "already"], correct: 1 },
  { id: 14, level: "A2", text: "I'm going ___ my grandparents this weekend.", options: ["visit", "visiting", "to visit", "visited"], correct: 2 },
  { id: 15, level: "A2", text: "There isn't ___ milk in the fridge.", options: ["some", "any", "no", "a"], correct: 1 },
  { id: 16, level: "A2", text: "The film was ___ boring that I fell asleep.", options: ["too", "very", "so", "such"], correct: 2 },
  { id: 17, level: "B1", text: "If it ___ tomorrow, we'll stay at home.", options: ["will rain", "rains", "rained", "would rain"], correct: 1 },
  { id: 18, level: "B1", text: "She told me that she ___ the book.", options: ["reads", "read", "had read", "has read"], correct: 2 },
  { id: 19, level: "B1", text: "I wish I ___ more free time.", options: ["have", "had", "would have", "having"], correct: 1 },
  { id: 20, level: "B1", text: "The car ___ repaired at the moment.", options: ["is being", "is", "has been", "was"], correct: 0 },
  { id: 21, level: "B1", text: "He asked me where I ___.", options: ["live", "lived", "do live", "am living"], correct: 1 },
  { id: 22, level: "B1", text: "I ___ English for five years now.", options: ["study", "studied", "have been studying", "am studying"], correct: 2 },
  { id: 23, level: "B1", text: "You'd better ___ a jacket. It's cold outside.", options: ["to take", "take", "taking", "took"], correct: 1 },
  { id: 24, level: "B1", text: "Despite ___ tired, she continued working.", options: ["be", "being", "was", "to be"], correct: 1 },
  { id: 25, level: "B2", text: "By the time we arrived, the film ___.", options: ["started", "has started", "had already started", "was starting"], correct: 2 },
  { id: 26, level: "B2", text: "I'd rather you ___ smoke in here.", options: ["don't", "didn't", "won't", "not"], correct: 1 },
  { id: 27, level: "B2", text: "Not until I got home ___ I had left my keys at the office.", options: ["I realised", "did I realise", "I did realise", "realised I"], correct: 1 },
  { id: 28, level: "B2", text: "She ___ have left already; her coat is still here.", options: ["must", "can't", "might", "should"], correct: 1 },
  { id: 29, level: "B2", text: "He treats her as if she ___ a child.", options: ["is", "were", "was being", "has been"], correct: 1 },
  { id: 30, level: "B2", text: "The project is worth ___.", options: ["to do", "doing", "done", "do"], correct: 1 },
  { id: 31, level: "B2", text: "___ the rain, the match went ahead.", options: ["Although", "Despite", "However", "Even"], correct: 1 },
  { id: 32, level: "B2", text: "Little ___ he know what was about to happen.", options: ["does", "did", "was", "had"], correct: 1 },
  { id: 33, level: "C1", text: "Had I known you were coming, I ___ a cake.", options: ["would bake", "would have baked", "had baked", "will have baked"], correct: 1 },
  { id: 34, level: "C1", text: "Hardly had we sat down ___ the lights went out.", options: ["than", "when", "that", "as"], correct: 1 },
  { id: 35, level: "C1", text: "The suspect is ___ to have fled the country.", options: ["told", "said", "believed", "spoken"], correct: 2 },
  { id: 36, level: "C1", text: "There's no point ___ about it now.", options: ["to worry", "worrying", "worry", "worried"], correct: 1 },
  { id: 37, level: "C1", text: "She ___ well have taken the earlier train.", options: ["might", "should", "would", "could"], correct: 0 },
  { id: 38, level: "C1", text: "So ___ was the damage that the building had to be demolished.", options: ["big", "extensive", "large", "wide"], correct: 1 },
  { id: 39, level: "C1", text: "Under no circumstances ___ leave the building without permission.", options: ["you should", "should you", "you must", "must you"], correct: 1 },
  { id: 40, level: "C1", text: "The new law, ___ was passed last month, has proven controversial.", options: ["that", "which", "what", "whose"], correct: 1 },
  { id: 41, level: "C2", text: "Seldom ___ such a magnificent performance.", options: ["I have seen", "have I seen", "I saw", "did I saw"], correct: 1 },
  { id: 42, level: "C2", text: "The politician's speech was nothing if not ___.", options: ["controversial", "ordinary", "mundane", "predictable"], correct: 0 },
  { id: 43, level: "C2", text: "She speaks with such ___ that you'd think she was a native.", options: ["fluidity", "fluency", "flowing", "fluidness"], correct: 1 },
  { id: 44, level: "C2", text: "The findings ___ our initial hypothesis.", options: ["corroborate", "exacerbate", "ameliorate", "exonerate"], correct: 0 },
  { id: 45, level: "C2", text: "Were it not for your timely intervention, the outcome ___ been far worse.", options: ["will have", "would have", "could", "should"], correct: 1 },
  { id: 46, level: "C2", text: "The author's prose is characterised by its ___.", options: ["verbosity", "brevity and precision", "ambiguity", "redundancy"], correct: 1 },
  { id: 47, level: "C2", text: "His argument, ___ compelling on the surface, fails to withstand scrutiny.", options: ["albeit", "despite", "whereas", "notwithstanding"], correct: 0 },
  { id: 48, level: "C2", text: "The committee members were at ___ over the proposed changes.", options: ["odds", "ends", "arms", "bay"], correct: 0 },
  { id: 49, level: "C2", text: "She has a ___ for languages that is truly remarkable.", options: ["flair", "talent", "knack", "aptitude"], correct: 0 },
  { id: 50, level: "C2", text: "The report left no stone ___ in its investigation.", options: ["unturned", "uncovered", "untouched", "unmoved"], correct: 0 },
];

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelInfo: Record<string, { name: string; description: string; color: string; bgColor: string }> = {
  "A1": { name: "Beginner", description: "Comprendi e usi espressioni familiari di base. Sai presentarti e fare domande semplici sulla vita quotidiana.", color: "text-emerald-600 dark:text-emerald-400", bgColor: "from-emerald-500 to-emerald-600" },
  "A2": { name: "Elementary", description: "Comunichi in situazioni semplici e di routine. Sai descrivere il tuo ambiente e i tuoi bisogni immediati.", color: "text-green-600 dark:text-green-400", bgColor: "from-green-500 to-green-600" },
  "B1": { name: "Intermediate", description: "Gestisci la maggior parte delle situazioni durante un viaggio. Produci testi semplici su argomenti familiari ed esprimi esperienze e opinioni.", color: "text-blue-600 dark:text-blue-400", bgColor: "from-blue-500 to-blue-600" },
  "B2": { name: "Upper Intermediate", description: "Interagisci con scioltezza e spontaneita con parlanti nativi. Produci testi chiari e dettagliati su molti argomenti.", color: "text-indigo-600 dark:text-indigo-400", bgColor: "from-indigo-500 to-indigo-600" },
  "C1": { name: "Advanced", description: "Usi la lingua in modo flessibile ed efficace per scopi sociali, accademici e professionali. Produci testi ben strutturati e dettagliati su argomenti complessi.", color: "text-purple-600 dark:text-purple-400", bgColor: "from-purple-500 to-purple-600" },
  "C2": { name: "Proficiency", description: "Comprendi praticamente tutto cio che leggi o ascolti. Ti esprimi in modo spontaneo, scorrevole e preciso, differenziando sottili sfumature di significato.", color: "text-rose-600 dark:text-rose-400", bgColor: "from-rose-500 to-rose-600" },
};

const courseRecommendations: Record<string, { title: string; link: string; description: string }[]> = {
  "A1": [
    { title: "Corsi di Lingua in Presenza", link: "/formazione-in-presenza", description: "Corsi di gruppo per principianti a Vicenza e Thiene" },
    { title: "Formazione Online", link: "/corsi-e-learning", description: "Piattaforma e-learning con AI e tutor madrelingua" },
  ],
  "A2": [
    { title: "Corsi di Lingua in Presenza", link: "/formazione-in-presenza", description: "Corsi di gruppo elementari per consolidare le basi" },
    { title: "Language Coaching", link: "/language-coaching", description: "Percorsi 1-to-1 personalizzati per progredire velocemente" },
  ],
  "B1": [
    { title: "Language Coaching", link: "/language-coaching", description: "Percorsi personalizzati per raggiungere il livello B2" },
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Pratica conversazione ogni venerdi con madrelingua" },
  ],
  "B2": [
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Mantieni e migliora la fluency con conversazione settimanale" },
    { title: "Full Immersion", link: "/full-immersion", description: "Workshop intensivi per fare il salto al livello C1" },
  ],
  "C1": [
    { title: "Full Immersion", link: "/full-immersion", description: "Esperienze intensive per perfezionare il tuo inglese" },
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Mantieni il livello con conversazione avanzata" },
  ],
  "C2": [
    { title: "Speakers' Corner", link: "/speakers-corner", description: "Conversazione avanzata per mantenere l'eccellenza" },
    { title: "Language Coaching", link: "/language-coaching", description: "Perfezionamento professionale e accademico" },
  ],
};

interface WritingTask {
  level: string;
  prompt: string;
  minWords: number;
  maxWords: number;
}

const writingTasks: WritingTask[] = [
  { level: "B1", prompt: "Describe your daily routine and what you enjoy doing in your free time", minWords: 80, maxWords: 120 },
  { level: "B2", prompt: "Write about a time when you had to solve a difficult problem. What happened and what did you learn?", minWords: 120, maxWords: 180 },
  { level: "C1", prompt: "Some people believe that artificial intelligence will replace most human jobs within the next 20 years. To what extent do you agree or disagree?", minWords: 180, maxWords: 250 },
];

interface SpeakingTask {
  level: string;
  prompt: string;
  minSeconds: number;
  maxSeconds: number;
}

const speakingTasks: SpeakingTask[] = [
  { level: "B1", prompt: "Tell me about yourself and your interests", minSeconds: 30, maxSeconds: 60 },
  { level: "B2", prompt: "Describe a memorable experience you've had while travelling or learning something new", minSeconds: 60, maxSeconds: 90 },
  { level: "C1", prompt: "What do you think are the most important skills for success in today's world, and why?", minSeconds: 90, maxSeconds: 120 },
];

interface WritingScoreResult {
  score: number;
  level: string;
  feedback: string;
  grammar: string;
  vocabulary: string;
  coherence: string;
  taskAchievement: string;
}

interface SpeakingScoreResult {
  score: number;
  level: string;
  feedback: string;
  fluency: string;
  grammar: string;
  vocabulary: string;
  pronunciation: string;
  coherence: string;
}

type Phase = "intro" | "grammar" | "writing" | "speaking" | "results";

interface CandidateInfo {
  nome: string;
  cognome: string;
  email: string;
  phone: string;
  azienda: string;
  citta: string;
  provincia: string;
  selfAssessedLevel: string;
}

function determineGrammarLevel(answers: Record<number, number>): { level: string; scores: Record<string, { correct: number; total: number }>; totalCorrect: number } {
  const scores: Record<string, { correct: number; total: number }> = {};
  levels.forEach(l => { scores[l] = { correct: 0, total: 0 }; });
  questions.forEach(q => {
    scores[q.level].total++;
    if (answers[q.id] === q.correct) scores[q.level].correct++;
  });
  let determinedLevel = "A1";
  for (const level of levels) {
    const { correct, total } = scores[level];
    if (total > 0 && (correct / total) * 100 >= 60) determinedLevel = level;
    else break;
  }
  const totalCorrect = Object.values(scores).reduce((sum, s) => sum + s.correct, 0);
  return { level: determinedLevel, scores, totalCorrect };
}

function scoreToCEFR(score: number): string {
  if (score >= 90) return "C2";
  if (score >= 78) return "C1";
  if (score >= 65) return "B2";
  if (score >= 50) return "B1";
  if (score >= 35) return "A2";
  return "A1";
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export default function EnglishTestPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({ nome: "", cognome: "", email: "", phone: "", azienda: "", citta: "", provincia: "", selfAssessedLevel: "A1" });

  const [orderedQuestions, setOrderedQuestions] = useState<Question[]>(questions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [grammarAnswers, setGrammarAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [writingResponses, setWritingResponses] = useState<string[]>(["", "", ""]);
  const [writingScores, setWritingScores] = useState<(WritingScoreResult | null)[]>([null, null, null]);
  const [currentWritingTask, setCurrentWritingTask] = useState(0);
  const [writingLoading, setWritingLoading] = useState(false);

  const [speakingRecordings, setSpeakingRecordings] = useState<(Blob | null)[]>([null, null, null]);
  const [speakingTranscriptions, setSpeakingTranscriptions] = useState<(string | null)[]>([null, null, null]);
  const [speakingScores, setSpeakingScores] = useState<(SpeakingScoreResult | null)[]>([null, null, null]);
  const [currentSpeakingTask, setCurrentSpeakingTask] = useState(0);
  const [speakingLoading, setSpeakingLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const grammarResult = useMemo(() => {
    if (phase === "intro") return null;
    if (Object.keys(grammarAnswers).length < orderedQuestions.length) return null;
    return determineGrammarLevel(grammarAnswers);
  }, [grammarAnswers, phase, orderedQuestions]);

  const grammarProgress = (currentQuestion / orderedQuestions.length) * 100;
  const currentQ = orderedQuestions[currentQuestion];
  const currentLevel = currentQ?.level || "A1";

  const handleGrammarAnswer = useCallback((optionIndex: number) => {
    setSelectedOption(optionIndex);
    setTimeout(() => {
      setGrammarAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
      setSelectedOption(null);
      if (currentQuestion < orderedQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setPhase("writing");
      }
    }, 400);
  }, [currentQ, currentQuestion]);

  const handleScoreWriting = useCallback(async (taskIndex: number) => {
    setWritingLoading(true);
    try {
      const task = writingTasks[taskIndex];
      const res = await apiRequest("POST", "/api/english-test/score-writing", {
        prompt: task.prompt,
        response: writingResponses[taskIndex],
        targetLevel: task.level,
      });
      const score: WritingScoreResult = await res.json();
      setWritingScores(prev => {
        const next = [...prev];
        next[taskIndex] = score;
        return next;
      });
      if (taskIndex < writingTasks.length - 1) {
        setCurrentWritingTask(taskIndex + 1);
      } else {
        setPhase("speaking");
      }
    } catch {
      setWritingScores(prev => {
        const next = [...prev];
        next[taskIndex] = { score: 0, level: "A1", feedback: "Errore nella valutazione. Riprova.", grammar: "N/A", vocabulary: "N/A", coherence: "N/A", taskAchievement: "N/A" };
        return next;
      });
    } finally {
      setWritingLoading(false);
    }
  }, [writingResponses]);

  const handleTranscribeAndScore = useCallback(async (taskIndex: number) => {
    setSpeakingLoading(true);
    try {
      const blob = speakingRecordings[taskIndex];
      if (!blob) return;
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      const transcribeRes = await fetch("/api/english-test/transcribe", { method: "POST", body: formData });
      if (!transcribeRes.ok) throw new Error("Transcription failed");
      const transcribeData = await transcribeRes.json();
      const transcription = transcribeData.text;
      setSpeakingTranscriptions(prev => {
        const next = [...prev];
        next[taskIndex] = transcription;
        return next;
      });

      const task = speakingTasks[taskIndex];
      const scoreRes = await apiRequest("POST", "/api/english-test/score-speaking", {
        prompt: task.prompt,
        transcription,
        targetLevel: task.level,
      });
      const score: SpeakingScoreResult = await scoreRes.json();
      setSpeakingScores(prev => {
        const next = [...prev];
        next[taskIndex] = score;
        return next;
      });
      if (taskIndex < speakingTasks.length - 1) {
        setCurrentSpeakingTask(taskIndex + 1);
      } else {
        setPhase("results");
      }
    } catch {
      setSpeakingScores(prev => {
        const next = [...prev];
        next[taskIndex] = { score: 0, level: "A1", feedback: "Errore nella valutazione. Riprova.", fluency: "N/A", grammar: "N/A", vocabulary: "N/A", pronunciation: "N/A", coherence: "N/A" };
        return next;
      });
    } finally {
      setSpeakingLoading(false);
    }
  }, [speakingRecordings]);

  const overallResults = useMemo(() => {
    if (phase !== "results" || !grammarResult) return null;

    const grammarPct = Math.round((grammarResult.totalCorrect / questions.length) * 100);
    const writingAvg = writingScores.filter(Boolean).length > 0
      ? Math.round(writingScores.filter(Boolean).reduce((s, w) => s + (w?.score || 0), 0) / writingScores.filter(Boolean).length)
      : 0;
    const speakingAvg = speakingScores.filter(Boolean).length > 0
      ? Math.round(speakingScores.filter(Boolean).reduce((s, w) => s + (w?.score || 0), 0) / speakingScores.filter(Boolean).length)
      : 0;

    const overallScore = Math.round(grammarPct * 0.4 + writingAvg * 0.3 + speakingAvg * 0.3);
    const overallLevel = scoreToCEFR(overallScore);
    const writingLevel = scoreToCEFR(writingAvg);
    const speakingLevel = scoreToCEFR(speakingAvg);

    return {
      grammarScore: grammarPct,
      grammarLevel: grammarResult.level,
      grammarScores: grammarResult.scores,
      grammarCorrect: grammarResult.totalCorrect,
      writingScore: writingAvg,
      writingLevel,
      speakingScore: speakingAvg,
      speakingLevel,
      overallScore,
      overallLevel,
    };
  }, [phase, grammarResult, writingScores, speakingScores]);

  const handleSubmitResults = useCallback(async () => {
    if (!overallResults || submitted) return;
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/english-test/submit", {
        candidateNome: candidateInfo.nome,
        candidateCognome: candidateInfo.cognome,
        candidateEmail: candidateInfo.email,
        candidatePhone: candidateInfo.phone || null,
        candidateAzienda: candidateInfo.azienda || null,
        candidateCitta: candidateInfo.citta || null,
        candidateProvincia: candidateInfo.provincia || null,
        selfAssessedLevel: candidateInfo.selfAssessedLevel,
        grammarScore: overallResults.grammarScore,
        grammarLevel: overallResults.grammarLevel,
        writingScore: overallResults.writingScore,
        writingLevel: overallResults.writingLevel,
        writingResponses: JSON.stringify(writingTasks.map((t, i) => ({
          prompt: t.prompt,
          response: writingResponses[i],
          score: writingScores[i]?.score || 0,
          level: writingScores[i]?.level || "",
          feedback: writingScores[i]?.feedback || "",
        }))),
        speakingScore: overallResults.speakingScore,
        speakingLevel: overallResults.speakingLevel,
        speakingResponses: JSON.stringify(speakingTasks.map((t, i) => ({
          prompt: t.prompt,
          transcription: speakingTranscriptions[i],
          score: speakingScores[i]?.score || 0,
          level: speakingScores[i]?.level || "",
          feedback: speakingScores[i]?.feedback || "",
        }))),
        overallLevel: overallResults.overallLevel,
        overallScore: overallResults.overallScore,
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }, [overallResults, candidateInfo, writingResponses, writingScores, speakingTranscriptions, speakingScores, submitted]);

  useEffect(() => {
    if (phase === "results" && overallResults && !submitted && !submitting) {
      handleSubmitResults();
    }
  }, [phase, overallResults, submitted, submitting, handleSubmitResults]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCandidateInfo({ nome: "", cognome: "", email: "", phone: "", azienda: "", citta: "", provincia: "", selfAssessedLevel: "A1" });
    setCurrentQuestion(0);
    setGrammarAnswers({});
    setSelectedOption(null);
    setWritingResponses(["", "", ""]);
    setWritingScores([null, null, null]);
    setCurrentWritingTask(0);
    setSpeakingRecordings([null, null, null]);
    setSpeakingTranscriptions([null, null, null]);
    setSpeakingScores([null, null, null]);
    setCurrentSpeakingTask(0);
    setSubmitted(false);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {phase === "intro" && (
        <IntroSection
          candidateInfo={candidateInfo}
          onCandidateChange={setCandidateInfo}
          onStart={() => {
            const startIdx = levels.indexOf(candidateInfo.selfAssessedLevel);
            const reordered: Question[] = [];
            for (let i = startIdx; i < levels.length; i++) {
              reordered.push(...questions.filter(q => q.level === levels[i]));
            }
            for (let i = 0; i < startIdx; i++) {
              reordered.push(...questions.filter(q => q.level === levels[i]));
            }
            setOrderedQuestions(reordered);
            setPhase("grammar");
          }}
        />
      )}

      {phase === "grammar" && currentQ && (
        <GrammarSection
          question={currentQ}
          currentIndex={currentQuestion}
          total={orderedQuestions.length}
          progress={grammarProgress}
          level={currentLevel}
          selectedOption={selectedOption}
          onAnswer={handleGrammarAnswer}
          onBack={currentQuestion > 0 ? () => { setCurrentQuestion(prev => prev - 1); setSelectedOption(null); } : undefined}
        />
      )}

      {phase === "writing" && (
        <WritingSection
          currentTask={currentWritingTask}
          responses={writingResponses}
          scores={writingScores}
          loading={writingLoading}
          onResponseChange={(idx, val) => {
            setWritingResponses(prev => { const next = [...prev]; next[idx] = val; return next; });
          }}
          onSubmitTask={handleScoreWriting}
        />
      )}

      {phase === "speaking" && (
        <SpeakingSection
          currentTask={currentSpeakingTask}
          recordings={speakingRecordings}
          scores={speakingScores}
          loading={speakingLoading}
          onRecordingComplete={(idx, blob) => {
            setSpeakingRecordings(prev => { const next = [...prev]; next[idx] = blob; return next; });
          }}
          onSubmitTask={handleTranscribeAndScore}
        />
      )}

      {phase === "results" && overallResults && (
        <ResultsSection
          results={overallResults}
          writingScores={writingScores}
          speakingScores={speakingScores}
          speakingTranscriptions={speakingTranscriptions}
          onRestart={handleRestart}
          submitting={submitting}
          submitted={submitted}
        />
      )}

      <Footer />
    </div>
  );
}

function IntroSection({
  candidateInfo,
  onCandidateChange,
  onStart,
}: {
  candidateInfo: CandidateInfo;
  onCandidateChange: (info: CandidateInfo) => void;
  onStart: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleStart = () => {
    const newErrors: Record<string, string> = {};
    if (!candidateInfo.nome.trim()) newErrors.nome = "Il nome e obbligatorio";
    if (!candidateInfo.cognome.trim()) newErrors.cognome = "Il cognome e obbligatorio";
    if (!candidateInfo.email.trim()) newErrors.email = "L'email e obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateInfo.email)) newErrors.email = "Email non valida";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onStart();
  };

  return (
    <main className="pt-24 pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/6 dark:bg-accent/12 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-6" data-testid="badge-test-intro">
              <Globe className="w-4 h-4 mr-2" />
              Test di Livello Completo
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6" data-testid="text-test-title">
              Scopri il Tuo Livello di{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Inglese</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Test completo con 3 sezioni: Grammatica, Writing e Speaking.
              Valutazione professionale con AI secondo il Quadro Comune Europeo (CEFR), dal livello A1 al C2.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: BookOpen, label: "Grammatica", sublabel: "50 domande A1-C2", detail: "15-20 min" },
              { icon: PenLine, label: "Writing", sublabel: "3 compiti scritti", detail: "15-20 min" },
              { icon: Mic, label: "Speaking", sublabel: "3 compiti orali", detail: "10-15 min" },
            ].map((item, i) => (
              <Card key={i} className="text-center hover-elevate" data-testid={`card-section-info-${i}`}>
                <CardContent className="p-5">
                  <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="font-semibold mb-1">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.sublabel}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.detail}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="max-w-lg mx-auto">
            <Card data-testid="card-candidate-form">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6 text-center">I Tuoi Dati</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome" className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Nome *
                      </Label>
                      <Input
                        id="nome"
                        value={candidateInfo.nome}
                        onChange={e => onCandidateChange({ ...candidateInfo, nome: e.target.value })}
                        placeholder="Mario"
                        data-testid="input-candidate-nome"
                      />
                      {errors.nome && <p className="text-sm text-destructive mt-1" data-testid="error-nome">{errors.nome}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cognome" className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Cognome *
                      </Label>
                      <Input
                        id="cognome"
                        value={candidateInfo.cognome}
                        onChange={e => onCandidateChange({ ...candidateInfo, cognome: e.target.value })}
                        placeholder="Rossi"
                        data-testid="input-candidate-cognome"
                      />
                      {errors.cognome && <p className="text-sm text-destructive mt-1" data-testid="error-cognome">{errors.cognome}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={candidateInfo.email}
                      onChange={e => onCandidateChange({ ...candidateInfo, email: e.target.value })}
                      placeholder="mario@email.com"
                      data-testid="input-candidate-email"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1" data-testid="error-email">{errors.email}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Telefono
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={candidateInfo.phone}
                        onChange={e => onCandidateChange({ ...candidateInfo, phone: e.target.value })}
                        placeholder="+39 333 1234567"
                        data-testid="input-candidate-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="azienda" className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        Azienda
                      </Label>
                      <Input
                        id="azienda"
                        value={candidateInfo.azienda}
                        onChange={e => onCandidateChange({ ...candidateInfo, azienda: e.target.value })}
                        placeholder="Azienda"
                        data-testid="input-candidate-azienda"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="citta" className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        Citta
                      </Label>
                      <Input
                        id="citta"
                        value={candidateInfo.citta}
                        onChange={e => onCandidateChange({ ...candidateInfo, citta: e.target.value })}
                        placeholder="Vicenza"
                        data-testid="input-candidate-citta"
                      />
                    </div>
                    <div>
                      <Label htmlFor="provincia" className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        Provincia (sigla)
                      </Label>
                      <Input
                        id="provincia"
                        value={candidateInfo.provincia}
                        onChange={e => onCandidateChange({ ...candidateInfo, provincia: e.target.value.toUpperCase().slice(0, 2) })}
                        placeholder="VI"
                        maxLength={2}
                        data-testid="input-candidate-provincia"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      Qual e il tuo livello attuale di inglese? *
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Seleziona il livello che pensi corrisponda alle tue competenze. Il test iniziera da questo livello per risparmiare tempo.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {levels.map((level) => {
                        const info = levelInfo[level];
                        const isSelected = candidateInfo.selfAssessedLevel === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => onCandidateChange({ ...candidateInfo, selfAssessedLevel: level })}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            }`}
                            data-testid={`button-level-${level}`}
                          >
                            <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0 shrink-0 mt-0.5`}>{level}</Badge>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm">{info.name}</div>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{info.description}</p>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button className="w-full mt-2" size="lg" onClick={handleStart} data-testid="button-start-test">
                    Inizia il Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function PhaseIndicator({ currentPhase }: { currentPhase: Phase }) {
  const phaseList: { key: Phase; label: string; icon: typeof BookOpen }[] = [
    { key: "grammar", label: "Grammatica", icon: BookOpen },
    { key: "writing", label: "Writing", icon: PenLine },
    { key: "speaking", label: "Speaking", icon: Mic },
  ];
  const currentIdx = phaseList.findIndex(p => p.key === currentPhase);
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {phaseList.map((p, i) => (
        <div key={p.key} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i === currentIdx ? "bg-primary text-primary-foreground" : i < currentIdx ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          }`} data-testid={`phase-indicator-${p.key}`}>
            {i < currentIdx ? <CheckCircle2 className="w-3.5 h-3.5" /> : <p.icon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{p.label}</span>
          </div>
          {i < phaseList.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

function GrammarSection({
  question, currentIndex, total, progress, level, selectedOption, onAnswer, onBack,
}: {
  question: Question; currentIndex: number; total: number; progress: number; level: string;
  selectedOption: number | null; onAnswer: (index: number) => void; onBack?: () => void;
}) {
  const info = levelInfo[level];
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <PhaseIndicator currentPhase="grammar" />
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0`} data-testid="badge-current-level">
              {level} - {info.name}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="text-question-count">
              {currentIndex + 1} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <Card className="shadow-lg" data-testid={`card-question-${question.id}`}>
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold leading-relaxed" data-testid="text-question">{question.text}</h2>
                </div>
                <div className="space-y-3">
                  {question.options.map((option, i) => (
                    <motion.button
                      key={i}
                      onClick={() => selectedOption === null ? onAnswer(i) : undefined}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedOption === i ? "border-primary bg-primary/10 scale-[0.98]" : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      whileHover={selectedOption === null ? { scale: 1.01 } : {}}
                      whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                      data-testid={`button-option-${i}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                          selectedOption === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>{String.fromCharCode(65 + i)}</span>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between gap-2 mt-6 flex-wrap">
          {onBack ? (
            <Button variant="ghost" onClick={onBack} data-testid="button-previous">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Precedente
            </Button>
          ) : <div />}
          <p className="text-xs text-muted-foreground">Seleziona la risposta corretta</p>
        </div>
      </div>
    </main>
  );
}

function WritingSection({
  currentTask, responses, scores, loading, onResponseChange, onSubmitTask,
}: {
  currentTask: number; responses: string[]; scores: (WritingScoreResult | null)[];
  loading: boolean;
  onResponseChange: (idx: number, val: string) => void;
  onSubmitTask: (idx: number) => void;
}) {
  const task = writingTasks[currentTask];
  const response = responses[currentTask];
  const score = scores[currentTask];
  const wordCount = countWords(response);
  const isValid = wordCount >= task.minWords;

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <PhaseIndicator currentPhase="writing" />

        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" data-testid="badge-writing-task">
              <PenLine className="w-3.5 h-3.5 mr-1.5" />
              Writing Task {currentTask + 1}/3
            </Badge>
            <Badge className={`bg-gradient-to-r ${levelInfo[task.level].bgColor} text-white border-0`}>
              {task.level}
            </Badge>
          </div>
          <Progress value={((currentTask + (score ? 1 : 0)) / writingTasks.length) * 100} className="h-2" data-testid="progress-writing" />
        </div>

        {score ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6" data-testid={`card-writing-score-${currentTask}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Valutazione Completata
                  </h3>
                  <Badge className={`bg-gradient-to-r ${levelInfo[score.level]?.bgColor || "from-blue-500 to-blue-600"} text-white border-0`}>
                    {score.level} - {score.score}/100
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{score.feedback}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Grammatica", value: score.grammar },
                    { label: "Vocabolario", value: score.vocabulary },
                    { label: "Coerenza", value: score.coherence },
                    { label: "Completezza", value: score.taskAchievement },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-md p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">{item.label}</div>
                      <div className="text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {currentTask < writingTasks.length - 1 && (
              <div className="text-center text-sm text-muted-foreground">Passaggio al prossimo compito...</div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg" data-testid={`card-writing-task-${currentTask}`}>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Compito di Scrittura</h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-writing-prompt">{task.prompt}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ({task.minWords}-{task.maxWords} parole)
                  </p>
                </div>
                <Textarea
                  value={response}
                  onChange={e => onResponseChange(currentTask, e.target.value)}
                  placeholder="Scrivi la tua risposta in inglese..."
                  className="min-h-[200px] text-base"
                  disabled={loading}
                  data-testid="textarea-writing-response"
                />
                <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
                  <span className={`text-sm ${wordCount < task.minWords ? "text-muted-foreground" : wordCount > task.maxWords ? "text-destructive" : "text-green-600 dark:text-green-400"}`} data-testid="text-word-count">
                    {wordCount} / {task.minWords}-{task.maxWords} parole
                  </span>
                  <Button
                    onClick={() => onSubmitTask(currentTask)}
                    disabled={!isValid || loading}
                    data-testid="button-submit-writing"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Valutazione in corso...
                      </>
                    ) : (
                      <>
                        Invia Risposta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function AudioRecorder({
  maxSeconds,
  onRecordingComplete,
  disabled,
}: {
  maxSeconds: number;
  onRecordingComplete: (blob: Blob) => void;
  disabled: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setPermissionError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(blob);
        setHasRecorded(true);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= maxSeconds) {
            mediaRecorder.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return next;
        });
      }, 1000);
    } catch {
      setPermissionError(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        {isRecording ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono font-medium" data-testid="text-recording-time">
                {formatTime(elapsed)} / {formatTime(maxSeconds)}
              </span>
            </div>
            <Button variant="destructive" onClick={stopRecording} data-testid="button-stop-recording">
              <Square className="mr-2 h-4 w-4" />
              Ferma
            </Button>
          </div>
        ) : (
          <Button
            onClick={startRecording}
            disabled={disabled}
            variant={hasRecorded ? "outline" : "default"}
            data-testid="button-start-recording"
          >
            <Mic className="mr-2 h-4 w-4" />
            {hasRecorded ? "Registra di Nuovo" : "Inizia Registrazione"}
          </Button>
        )}
      </div>
      {isRecording && (
        <Progress value={(elapsed / maxSeconds) * 100} className="h-2" data-testid="progress-recording" />
      )}
      {hasRecorded && !isRecording && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4" />
          <span data-testid="text-recording-complete">Registrazione completata</span>
        </div>
      )}
      {permissionError && (
        <div className="flex items-center justify-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span data-testid="text-permission-error">Permesso microfono negato. Consenti l'accesso al microfono.</span>
        </div>
      )}
    </div>
  );
}

function SpeakingSection({
  currentTask, recordings, scores, loading, onRecordingComplete, onSubmitTask,
}: {
  currentTask: number; recordings: (Blob | null)[]; scores: (SpeakingScoreResult | null)[];
  loading: boolean;
  onRecordingComplete: (idx: number, blob: Blob) => void;
  onSubmitTask: (idx: number) => void;
}) {
  const task = speakingTasks[currentTask];
  const recording = recordings[currentTask];
  const score = scores[currentTask];

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <PhaseIndicator currentPhase="speaking" />

        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" data-testid="badge-speaking-task">
              <Mic className="w-3.5 h-3.5 mr-1.5" />
              Speaking Task {currentTask + 1}/3
            </Badge>
            <Badge className={`bg-gradient-to-r ${levelInfo[task.level].bgColor} text-white border-0`}>
              {task.level}
            </Badge>
          </div>
          <Progress value={((currentTask + (score ? 1 : 0)) / speakingTasks.length) * 100} className="h-2" data-testid="progress-speaking" />
        </div>

        {score ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="mb-6" data-testid={`card-speaking-score-${currentTask}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Valutazione Completata
                  </h3>
                  <Badge className={`bg-gradient-to-r ${levelInfo[score.level]?.bgColor || "from-blue-500 to-blue-600"} text-white border-0`}>
                    {score.level} - {score.score}/100
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{score.feedback}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Fluenza", value: score.fluency },
                    { label: "Grammatica", value: score.grammar },
                    { label: "Vocabolario", value: score.vocabulary },
                    { label: "Pronuncia", value: score.pronunciation },
                    { label: "Coerenza", value: score.coherence },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-md p-3">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">{item.label}</div>
                      <div className="text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {currentTask < speakingTasks.length - 1 && (
              <div className="text-center text-sm text-muted-foreground">Passaggio al prossimo compito...</div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg" data-testid={`card-speaking-task-${currentTask}`}>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Compito Orale</h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-speaking-prompt">{task.prompt}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (Durata: {task.minSeconds}-{task.maxSeconds} secondi)
                  </p>
                </div>

                <AudioRecorder
                  maxSeconds={task.maxSeconds}
                  onRecordingComplete={(blob) => onRecordingComplete(currentTask, blob)}
                  disabled={loading}
                />

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => onSubmitTask(currentTask)}
                    disabled={!recording || loading}
                    data-testid="button-submit-speaking"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Trascrizione e valutazione...
                      </>
                    ) : (
                      <>
                        Invia Registrazione
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function ResultsSection({
  results,
  writingScores,
  speakingScores,
  speakingTranscriptions,
  onRestart,
  submitting,
  submitted,
}: {
  results: {
    grammarScore: number; grammarLevel: string;
    grammarScores: Record<string, { correct: number; total: number }>;
    grammarCorrect: number;
    writingScore: number; writingLevel: string;
    speakingScore: number; speakingLevel: string;
    overallScore: number; overallLevel: string;
  };
  writingScores: (WritingScoreResult | null)[];
  speakingScores: (SpeakingScoreResult | null)[];
  speakingTranscriptions: (string | null)[];
  onRestart: () => void;
  submitting: boolean;
  submitted: boolean;
}) {
  const info = levelInfo[results.overallLevel];
  const recommendations = courseRecommendations[results.overallLevel] || [];

  const handlePrint = () => { window.print(); };

  return (
    <main className="pt-24 pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/6 dark:bg-accent/12 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6" data-testid="icon-result">
              <GraduationCap className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
              <p className="text-lg text-muted-foreground mb-2">Il tuo livello complessivo:</p>
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                <Badge className={`bg-gradient-to-r ${info.bgColor} text-white border-0 text-2xl px-6 py-2`} data-testid="badge-result-level">
                  {results.overallLevel}
                </Badge>
                <span className={`text-3xl font-bold ${info.color}`} data-testid="text-result-name">{info.name}</span>
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-2" data-testid="text-result-description">{info.description}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-overall-score">
                Punteggio Complessivo: {results.overallScore}%
              </p>
              {submitting && (
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvataggio risultati...
                </div>
              )}
              {submitted && (
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Risultati salvati e inviati via email
                </div>
              )}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mb-10">
            <Card data-testid="card-section-breakdown">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Risultati per Sezione
                </h3>
                <div className="space-y-6">
                  {[
                    { label: "Grammatica", score: results.grammarScore, level: results.grammarLevel, weight: "40%", icon: BookOpen },
                    { label: "Writing", score: results.writingScore, level: results.writingLevel, weight: "30%", icon: PenLine },
                    { label: "Speaking", score: results.speakingScore, level: results.speakingLevel, weight: "30%", icon: Mic },
                  ].map(section => {
                    const li = levelInfo[section.level];
                    return (
                      <div key={section.label} data-testid={`section-score-${section.label.toLowerCase()}`}>
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <section.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{section.label}</span>
                            <span className="text-xs text-muted-foreground">(peso: {section.weight})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{section.score}%</span>
                            <Badge className={`bg-gradient-to-r ${li?.bgColor || "from-gray-500 to-gray-600"} text-white border-0`}>{section.level}</Badge>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${li?.bgColor || "from-gray-500 to-gray-600"} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${section.score}%` }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="mb-10">
            <Card data-testid="card-grammar-detail">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Dettaglio Grammatica ({results.grammarCorrect}/{questions.length})
                </h3>
                <div className="space-y-3">
                  {levels.map(level => {
                    const score = results.grammarScores[level];
                    const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
                    const li = levelInfo[level];
                    return (
                      <div key={level} className="flex items-center gap-3" data-testid={`grammar-score-${level}`}>
                        <Badge className={`bg-gradient-to-r ${li.bgColor} text-white border-0 w-12 justify-center shrink-0`}>{level}</Badge>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-medium">{li.name}</span>
                            <span className="text-sm text-muted-foreground">{score.correct}/{score.total}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div className={`h-full bg-gradient-to-r ${li.bgColor} rounded-full`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.6 }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {writingScores.some(Boolean) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mb-10">
              <Card data-testid="card-writing-detail">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-primary" />
                    Dettaglio Writing
                  </h3>
                  <div className="space-y-6">
                    {writingTasks.map((task, i) => {
                      const ws = writingScores[i];
                      if (!ws) return null;
                      return (
                        <div key={i} className="border-b last:border-0 pb-4 last:pb-0" data-testid={`writing-detail-${i}`}>
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <span className="text-sm font-semibold">Task {i + 1} ({task.level})</span>
                            <Badge className={`bg-gradient-to-r ${levelInfo[ws.level]?.bgColor || "from-gray-500 to-gray-600"} text-white border-0`}>{ws.level} - {ws.score}/100</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ws.feedback}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: "Grammatica", value: ws.grammar },
                              { label: "Vocabolario", value: ws.vocabulary },
                              { label: "Coerenza", value: ws.coherence },
                              { label: "Completezza", value: ws.taskAchievement },
                            ].map(item => (
                              <div key={item.label} className="bg-muted/50 rounded-md p-2">
                                <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
                                <div className="text-xs mt-0.5">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {speakingScores.some(Boolean) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="mb-10">
              <Card data-testid="card-speaking-detail">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Dettaglio Speaking
                  </h3>
                  <div className="space-y-6">
                    {speakingTasks.map((task, i) => {
                      const ss = speakingScores[i];
                      if (!ss) return null;
                      return (
                        <div key={i} className="border-b last:border-0 pb-4 last:pb-0" data-testid={`speaking-detail-${i}`}>
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <span className="text-sm font-semibold">Task {i + 1} ({task.level})</span>
                            <Badge className={`bg-gradient-to-r ${levelInfo[ss.level]?.bgColor || "from-gray-500 to-gray-600"} text-white border-0`}>{ss.level} - {ss.score}/100</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ss.feedback}</p>
                          {speakingTranscriptions[i] && (
                            <div className="bg-muted/50 rounded-md p-3 mb-3">
                              <div className="text-xs font-semibold text-muted-foreground mb-1">Trascrizione</div>
                              <div className="text-sm italic">"{speakingTranscriptions[i]}"</div>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: "Fluenza", value: ss.fluency },
                              { label: "Grammatica", value: ss.grammar },
                              { label: "Vocabolario", value: ss.vocabulary },
                              { label: "Pronuncia", value: ss.pronunciation },
                              { label: "Coerenza", value: ss.coherence },
                            ].map(item => (
                              <div key={item.label} className="bg-muted/50 rounded-md p-2">
                                <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
                                <div className="text-xs mt-0.5">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }} className="mb-10">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Corsi Consigliati per Te
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <Link key={i} href={rec.link}>
                  <Card className="h-full hover-elevate cursor-pointer group" data-testid={`card-recommendation-${i}`}>
                    <CardContent className="p-5">
                      <h4 className="font-bold group-hover:text-primary transition-colors mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        Scopri di piu
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Button variant="outline" onClick={handlePrint} data-testid="button-print-results">
              <Printer className="mr-2 h-4 w-4" />
              Stampa Risultati
            </Button>
            <Button variant="outline" onClick={onRestart} data-testid="button-restart-test">
              <RotateCcw className="mr-2 h-4 w-4" />
              Rifai il Test
            </Button>
            <Button
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.href = "/#contact";
              }}
              data-testid="button-contact-after-test"
            >
              Parla con un Consulente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
