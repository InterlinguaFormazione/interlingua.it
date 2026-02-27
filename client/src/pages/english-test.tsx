import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, CheckCircle, ChevronRight, Loader2, Mic, MicOff, PenTool, Volume2, BookOpen, Brain, MessageSquare, Shield, Clock, ArrowRight, User, Mail, Phone, Building2, MapPin, Map } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type Phase = "registration" | "self-assessment" | "mc-questions" | "writing" | "speaking" | "results";

interface QuestionData {
  id: number;
  question: string;
  options: string[];
  skillType: string;
  level: string;
  passage?: string;
  audioUrl?: string;
}

interface SectionResult {
  sectionName: string;
  cefrLevel: string | null;
  accuracy: number | null;
}

interface TestResults {
  finalLevel: string;
  mcLevel: string;
  writingLevel?: string;
  speakingLevel?: string;
  sectionResults: SectionResult[];
  writingFeedback?: string;
  speakingFeedback?: string;
  competencyReport?: {
    writing?: { grammar: number; vocabulary: number; coherence: number; taskCompletion: number };
    speaking?: { grammar: number; vocabulary: number; coherence: number; taskCompletion: number };
  };
}

const registrationSchema = z.object({
  firstName: z.string().min(1, "Campo obbligatorio"),
  lastName: z.string().min(1, "Campo obbligatorio"),
  email: z.string().email("Email non valida"),
  phone: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const CEFR_DESCRIPTIONS: Record<string, { label: string; desc: string }> = {
  A1: { label: "A1 - Beginner", desc: "I can understand very basic phrases and introduce myself in simple situations." },
  A2: { label: "A2 - Elementary", desc: "I can handle simple everyday conversations and write short messages." },
  B1: { label: "B1 - Intermediate", desc: "I can talk about familiar topics, understand the main points of clear texts, and write simple connected texts." },
  B2: { label: "B2 - Upper Intermediate", desc: "I can engage in detailed discussions, understand complex texts, and write clear essays on a wide range of topics." },
  C1: { label: "C1 - Advanced", desc: "I can express myself fluently and spontaneously, understand demanding texts, and produce well-structured, detailed writing." },
};

const SKILL_LABELS: Record<string, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  use_of_english: "Use of English",
  reading: "Reading Comprehension",
  listening: "Listening Comprehension",
};

const SKILL_ICONS: Record<string, typeof Brain> = {
  grammar: Brain,
  vocabulary: BookOpen,
  reading: BookOpen,
  listening: Volume2,
  use_of_english: MessageSquare,
};

export default function BusinessEnglishTestPage() {
  const [phase, setPhase] = useState<Phase>("registration");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [currentSkill, setCurrentSkill] = useState<string>("grammar");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theta, setTheta] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("B1");
  const [confidence, setConfidence] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [writingPrompt, setWritingPrompt] = useState("");
  const [writingResponse, setWritingResponse] = useState("");
  const [speakingPrompt, setSpeakingPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [results, setResults] = useState<TestResults | null>(null);
  const [writingScores, setWritingScores] = useState<any>(null);
  const [speakingScores, setSpeakingScores] = useState<any>(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [sectionTransition, setSectionTransition] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", company: "", city: "", province: "" },
  });

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && phase === "mc-questions") {
        setTabSwitchCount(prev => prev + 1);
        toast({ title: "Tab switch detected", description: "Please stay on this page during the test.", variant: "destructive" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [phase, toast]);

  useEffect(() => {
    if (phase === "mc-questions") {
      const preventCopy = (e: ClipboardEvent) => e.preventDefault();
      const preventContext = (e: MouseEvent) => e.preventDefault();
      document.addEventListener("copy", preventCopy);
      document.addEventListener("paste", preventCopy);
      document.addEventListener("cut", preventCopy);
      document.addEventListener("contextmenu", preventContext);
      return () => {
        document.removeEventListener("copy", preventCopy);
        document.removeEventListener("paste", preventCopy);
        document.removeEventListener("cut", preventCopy);
        document.removeEventListener("contextmenu", preventContext);
      };
    }
  }, [phase]);

  const handleRegistration = async (data: z.infer<typeof registrationSchema>) => {
    setRegistrationData(data);
    setPhase("self-assessment");
  };

  const handleSelfAssessment = async (level: string) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/english-test/start", {
        ...registrationData,
        selfAssessedLevel: level,
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setTheta(data.currentTheta);
        setCurrentLevel(data.currentLevel);
        setCurrentQuestion(data.question);
        setCurrentSkill(data.currentSkill);
        setCurrentSectionIndex(data.currentSectionIndex);
        setQuestionStartTime(Date.now());
        setPhase("mc-questions");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to start the test", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleAnswer = async () => {
    if (!selectedAnswer || !currentQuestion || !sessionId) return;
    setIsSubmitting(true);
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);

    try {
      const res = await apiRequest("POST", "/api/english-test/answer", {
        sessionId,
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        timeSpent,
      });
      const data = await res.json();

      if (data.success) {
        setTheta(data.newTheta);
        setCurrentLevel(data.newLevel);
        setConfidence(data.confidence);
        setTotalAnswered(prev => prev + 1);

        if (data.mcPhaseComplete) {
          setWritingPrompt(data.writingPrompt);
          setPhase("writing");
        } else {
          if (data.sectionAdvanced && data.currentSkill !== currentSkill) {
            setSectionTransition(SKILL_LABELS[data.currentSkill] || data.currentSkill);
            setTimeout(() => setSectionTransition(null), 2000);
          }
          setCurrentQuestion(data.question);
          setCurrentSkill(data.currentSkill);
          setCurrentSectionIndex(data.currentSectionIndex);
          setSelectedAnswer(null);
          setQuestionStartTime(Date.now());
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit answer", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleWritingSubmit = async () => {
    if (!writingResponse.trim() || !sessionId) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/english-test/submit-writing", {
        sessionId,
        response: writingResponse,
        prompt: writingPrompt,
      });
      const data = await res.json();
      if (data.success) {
        setWritingScores(data.writingScores);
        setSpeakingPrompt(data.speakingPrompt);
        setPhase("speaking");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit writing", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
        audioContext.close();
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(60);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(avg / 255 * 100);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast({ title: "Microphone unavailable", description: "You can skip the speaking section.", variant: "destructive" });
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const handleSpeakingSubmit = async () => {
    if (!audioBlob || !sessionId) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("sessionId", sessionId.toString());
      formData.append("prompt", speakingPrompt);

      const res = await fetch("/api/english-test/submit-speaking", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSpeakingScores(data.speakingScores);
        await completeTest();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit speaking", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleSkipSpeaking = async () => {
    if (!sessionId) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/english-test/complete-without-speaking", { sessionId });
      const data = await res.json();
      if (data.success) {
        setResults({
          finalLevel: data.finalLevel,
          mcLevel: data.mcLevel,
          writingLevel: data.writingLevel,
          sectionResults: data.sectionResults || [],
        });
        setPhase("results");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to complete test", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const completeTest = async () => {
    if (!sessionId) return;
    try {
      const res = await apiRequest("POST", "/api/english-test/complete", { sessionId });
      const data = await res.json();
      if (data.success) {
        setResults({
          finalLevel: data.finalLevel,
          mcLevel: data.mcLevel,
          writingLevel: data.writingLevel,
          speakingLevel: data.speakingLevel,
          sectionResults: data.sectionResults || [],
          writingFeedback: data.writingFeedback,
          speakingFeedback: data.speakingFeedback,
          competencyReport: data.competencyReport,
        });
        setPhase("results");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to complete test", variant: "destructive" });
    }
  };

  const wordCount = writingResponse.trim().split(/\s+/).filter(Boolean).length;

  const levelColor = (level: string) => {
    const colors: Record<string, string> = {
      A0: "bg-gray-500", A1: "bg-red-500", A2: "bg-orange-500",
      B1: "bg-yellow-500", B2: "bg-blue-500", C1: "bg-green-600",
    };
    return colors[level] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            General English Adaptive Test
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
            English Proficiency Assessment
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Powered by Computerized Adaptive Testing (CAT) with IRT
          </p>
        </div>

        {phase !== "registration" && phase !== "self-assessment" && phase !== "results" && (
          <div className="mb-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-600 dark:text-slate-400" data-testid="text-current-level">
                  Level: <span className={`inline-block px-2 py-0.5 rounded text-white text-xs font-bold ${levelColor(currentLevel)}`}>{currentLevel}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400" data-testid="text-questions-answered">
                  Questions: {totalAnswered}/25
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-slate-500 text-xs">Proctored</span>
              </div>
            </div>
            {phase === "mc-questions" && (
              <div className="mt-3">
                <div className="flex gap-1">
                  {["grammar", "vocabulary", "use_of_english", "reading", "listening"].map((skill, idx) => (
                    <div
                      key={skill}
                      className={`flex-1 h-2 rounded-full ${
                        idx + 1 < currentSectionIndex ? "bg-green-500" :
                        idx + 1 === currentSectionIndex ? "bg-blue-500" :
                        "bg-slate-200 dark:bg-slate-700"
                      }`}
                      data-testid={`progress-section-${skill}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-500">
                  {["Grammar", "Vocab", "Use of Eng", "Reading", "Listening"].map((label, idx) => (
                    <span key={idx} className={idx + 1 === currentSectionIndex ? "text-blue-600 font-medium" : ""}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "registration" && (
          <div className="max-w-2xl mx-auto" data-testid="card-registration">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Benvenuto al Test di Inglese</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md mx-auto">
                Compila i tuoi dati per iniziare la valutazione. Il test si adatta al tuo livello in tempo reale.
              </p>
            </div>

            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200/80 dark:border-slate-700/80 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardContent className="p-6 pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Nome *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-first-name" placeholder="Il tuo nome" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Cognome *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-last-name" placeholder="Il tuo cognome" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input type="email" {...field} data-testid="input-email" placeholder="la-tua@email.com" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Telefono</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-phone" placeholder="Numero di telefono" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Azienda</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-company" placeholder="Nome azienda" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Citta</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-city" placeholder="La tua citta" className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="province" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">Provincia (sigla)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input {...field} data-testid="input-province" placeholder="es. VI" maxLength={2} className="pl-10 h-11 uppercase border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 rounded-lg" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200" data-testid="button-start-test">
                        Inizia il Test <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-1 text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Dati protetti</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~20 minuti</span>
                      <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Gratuito</span>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {phase === "self-assessment" && (
          <div className="max-w-2xl mx-auto" data-testid="card-self-assessment">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Come valuti il tuo inglese?</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Seleziona il livello che meglio descrive le tue competenze attuali.
              </p>
            </div>
            <div className="space-y-3">
              {Object.entries(CEFR_DESCRIPTIONS).map(([level, { label, desc }]) => (
                <button
                  key={level}
                  onClick={() => handleSelfAssessment(level)}
                  disabled={isSubmitting}
                  className="w-full text-left p-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-600/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:shadow-md hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 disabled:opacity-50 group"
                  data-testid={`button-level-${level}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{label}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-4" />
                  </div>
                </button>
              ))}
              {isSubmitting && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Preparazione del test...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "mc-questions" && (
          <>
            {sectionTransition && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" data-testid="section-transition">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Section Complete</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Moving to: {sectionTransition}</p>
                </div>
              </div>
            )}

            {currentQuestion ? (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl" data-testid="card-question">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = SKILL_ICONS[currentSkill] || Brain;
                        return <Icon className="w-5 h-5 text-blue-600" />;
                      })()}
                      <span className="font-medium text-blue-700 dark:text-blue-400">
                        {SKILL_LABELS[currentSkill] || currentSkill}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      Section {currentSectionIndex}/5
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentQuestion.passage && (
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700" data-testid="text-passage">
                      <div className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">Reading Passage</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{currentQuestion.passage}</div>
                    </div>
                  )}

                  <div className="text-lg font-medium text-slate-800 dark:text-white" data-testid="text-question">
                    {currentQuestion.question}
                  </div>

                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAnswer === option
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-slate-200 dark:border-slate-600 hover:border-blue-300"
                          }`}
                          data-testid={`option-${idx}`}
                        >
                          <RadioGroupItem value={option} />
                          <span className="text-slate-700 dark:text-slate-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  <Button
                    onClick={handleAnswer}
                    disabled={!selectedAnswer || isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-submit-answer"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                    ) : (
                      <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
          </>
        )}

        {phase === "writing" && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl" data-testid="card-writing">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-400">Writing Task</span>
              </div>
              <CardTitle className="text-xl">Writing Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800" data-testid="text-writing-prompt">
                <div className="text-xs uppercase tracking-wider text-blue-600 mb-2 font-medium">Prompt</div>
                <p className="text-slate-800 dark:text-slate-200">{writingPrompt}</p>
              </div>

              <div>
                <Textarea
                  value={writingResponse}
                  onChange={(e) => setWritingResponse(e.target.value)}
                  rows={10}
                  className="resize-none"
                  placeholder="Write your response here..."
                  data-testid="textarea-writing"
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span data-testid="text-word-count">{wordCount} words</span>
                  <span>{wordCount < 50 ? "Aim for at least 50 words" : "Good length"}</span>
                </div>
              </div>

              <Button
                onClick={handleWritingSubmit}
                disabled={wordCount < 10 || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="button-submit-writing"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Scoring with AI...</>
                ) : (
                  <>Submit Writing <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "speaking" && (
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl" data-testid="card-speaking">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-700 dark:text-purple-400">Speaking Task</span>
              </div>
              <CardTitle className="text-xl">Speaking Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800" data-testid="text-speaking-prompt">
                <div className="text-xs uppercase tracking-wider text-purple-600 mb-2 font-medium">Prompt</div>
                <p className="text-slate-800 dark:text-slate-200">{speakingPrompt}</p>
              </div>

              <div className="text-center space-y-4">
                {!audioBlob && !isRecording && (
                  <Button
                    onClick={startRecording}
                    className="bg-purple-600 hover:bg-purple-700 h-16 px-8 text-lg rounded-2xl"
                    data-testid="button-start-recording"
                  >
                    <Mic className="w-6 h-6 mr-3" /> Start Recording
                  </Button>
                )}

                {isRecording && (
                  <div className="space-y-4">
                    <div className={`text-5xl font-bold tabular-nums ${recordingTime <= 10 ? "text-red-500 animate-pulse" : "text-slate-800 dark:text-white"}`} data-testid="text-countdown">
                      0:{recordingTime.toString().padStart(2, "0")}
                    </div>

                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" data-testid="vu-meter">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-100"
                        style={{ width: `${Math.min(audioLevel, 100)}%` }}
                      />
                    </div>

                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="h-14 px-8 text-lg rounded-2xl"
                      data-testid="button-stop-recording"
                    >
                      <MicOff className="w-5 h-5 mr-2" /> Stop Recording
                    </Button>
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Recording complete</span>
                    </div>
                    <Button
                      onClick={handleSpeakingSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      data-testid="button-submit-speaking"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Transcribing and scoring...</>
                      ) : (
                        <>Submit Recording <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleSkipSpeaking}
                  disabled={isSubmitting}
                  className="text-slate-500 hover:text-slate-700"
                  data-testid="button-skip-speaking"
                >
                  Skip speaking section (microphone unavailable)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "results" && results && (
          <div className="space-y-6" data-testid="section-results">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center text-white">
                <p className="text-blue-100 text-sm mb-3 uppercase tracking-wider">Your English Level</p>
                <div className="text-7xl font-bold mb-2" data-testid="text-final-level">{results.finalLevel}</div>
                <p className="text-blue-200">CEFR Level</p>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">MC Phase</div>
                    <div className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${levelColor(results.mcLevel)}`} data-testid="text-mc-level">
                      {results.mcLevel}
                    </div>
                  </div>
                  {results.writingLevel && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="text-sm text-slate-500 mb-1">Writing</div>
                      <div className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${levelColor(results.writingLevel)}`} data-testid="text-writing-level">
                        {results.writingLevel}
                      </div>
                    </div>
                  )}
                  {results.speakingLevel && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="text-sm text-slate-500 mb-1">Speaking</div>
                      <div className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${levelColor(results.speakingLevel)}`} data-testid="text-speaking-level">
                        {results.speakingLevel}
                      </div>
                    </div>
                  )}
                </div>

                {results.sectionResults.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Section Breakdown</h3>
                    <div className="space-y-2">
                      {results.sectionResults.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg" data-testid={`section-result-${s.sectionName}`}>
                          <span className="text-slate-700 dark:text-slate-300 capitalize">{s.sectionName.replace(/_/g, " ")}</span>
                          <div className="flex items-center gap-4">
                            {s.accuracy !== null && (
                              <span className="text-sm text-slate-500">{s.accuracy}% accuracy</span>
                            )}
                            {s.cefrLevel && (
                              <span className={`px-2 py-0.5 rounded text-white text-xs font-bold ${levelColor(s.cefrLevel)}`}>
                                {s.cefrLevel}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.competencyReport?.writing && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Writing Competency</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Grammar", val: results.competencyReport.writing.grammar },
                        { label: "Vocabulary", val: results.competencyReport.writing.vocabulary },
                        { label: "Coherence", val: results.competencyReport.writing.coherence },
                        { label: "Task Completion", val: results.competencyReport.writing.taskCompletion },
                      ].map(({ label, val }) => (
                        <div key={label} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xs text-blue-600 mb-1">{label}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={val} className="flex-1 h-2" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {results.writingFeedback && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-writing-feedback">
                        {results.writingFeedback}
                      </p>
                    )}
                  </div>
                )}

                {results.competencyReport?.speaking && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Speaking Competency</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Grammar", val: results.competencyReport.speaking.grammar },
                        { label: "Vocabulary", val: results.competencyReport.speaking.vocabulary },
                        { label: "Coherence", val: results.competencyReport.speaking.coherence },
                        { label: "Task Completion", val: results.competencyReport.speaking.taskCompletion },
                      ].map(({ label, val }) => (
                        <div key={label} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-xs text-purple-600 mb-1">{label}</div>
                          <div className="flex items-center gap-2">
                            <Progress value={val} className="flex-1 h-2" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {results.speakingFeedback && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-speaking-feedback">
                        {results.speakingFeedback}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 dark:text-green-300 font-medium">Test Complete</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your results have been sent. Our team will contact you with personalized course recommendations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
