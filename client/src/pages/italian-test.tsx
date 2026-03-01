import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, CheckCircle, ChevronRight, Loader2, PenTool, Volume2, BookOpen, Brain, MessageSquare, Shield, Clock, ArrowRight, ArrowLeft, User, Mail, Phone, Building2, MapPin, Map } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type Phase = "registration" | "self-assessment" | "mc-questions" | "writing" | "results";

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
  sectionResults: SectionResult[];
  writingFeedback?: string;
  competencyReport?: {
    writing?: { grammar: number; vocabulary: number; coherence: number; taskCompletion: number };
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
  A1: { label: "A1 - Principiante", desc: "Riesco a capire frasi molto semplici e a presentarmi in situazioni basilari in italiano." },
  A2: { label: "A2 - Elementare", desc: "Riesco a gestire semplici conversazioni quotidiane e a scrivere brevi messaggi in italiano." },
  B1: { label: "B1 - Intermedio", desc: "Riesco a parlare di argomenti familiari, capire i punti principali di testi chiari e scrivere testi semplici e coerenti in italiano." },
  B2: { label: "B2 - Intermedio Superiore", desc: "Riesco a partecipare a discussioni dettagliate, capire testi complessi e scrivere saggi chiari su una vasta gamma di argomenti in italiano." },
  C1: { label: "C1 - Avanzato", desc: "Riesco ad esprimermi in modo fluente e spontaneo, capire testi impegnativi e produrre testi ben strutturati e dettagliati in italiano." },
};

const SKILL_LABELS: Record<string, string> = {
  grammar: "Grammatica",
  vocabulary: "Vocabolario",
  use_of_english: "Uso della Lingua",
  reading: "Comprensione Scritta",
  listening: "Comprensione Orale",
};

const SKILL_ICONS: Record<string, typeof Brain> = {
  grammar: Brain,
  vocabulary: BookOpen,
  reading: BookOpen,
  listening: Volume2,
  use_of_english: MessageSquare,
};

export default function ItalianTestPage() {
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
  const [results, setResults] = useState<TestResults | null>(null);
  const [writingScores, setWritingScores] = useState<any>(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [sectionTransition, setSectionTransition] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);

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
      const res = await apiRequest("POST", "/api/italian-test/start", {
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
      } else {
        toast({ title: "Error", description: data.message || "Failed to start the test", variant: "destructive" });
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
      const res = await apiRequest("POST", "/api/italian-test/answer", {
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
            setTimeout(() => setSectionTransition(null), 1000);
          }
          setCurrentQuestion(data.question);
          setCurrentSkill(data.currentSkill);
          setCurrentSectionIndex(data.currentSectionIndex);
          setSelectedAnswer(null);
          setQuestionStartTime(Date.now());
        }
      } else {
        toast({ title: "Error", description: data.message || "Failed to submit answer", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit answer", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleWritingSubmit = async () => {
    if (!sessionId) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/italian-test/submit-writing", {
        sessionId,
        response: writingResponse,
        prompt: writingPrompt,
      });
      const data = await res.json();
      if (data.success) {
        setWritingScores(data.writingScores);
        const skipRes = await apiRequest("POST", "/api/italian-test/complete-without-speaking", { sessionId });
        const skipData = await skipRes.json();
        if (skipData.success) {
          setResults({
            finalLevel: skipData.finalLevel,
            mcLevel: skipData.mcLevel,
            writingLevel: skipData.writingLevel,
            sectionResults: skipData.sectionResults || [],
            writingFeedback: skipData.writingFeedback,
            competencyReport: skipData.competencyReport,
          });
          setPhase("results");
        } else {
          toast({ title: "Error", description: skipData.message || "Failed to complete test", variant: "destructive" });
        }
      } else {
        toast({ title: "Error", description: data.message || "Failed to submit writing", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit writing", variant: "destructive" });
    }
    setIsSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-violet-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 dark:bg-blue-800/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-200/25 dark:bg-indigo-800/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-3xl" />
      </div>
      <div className="relative container mx-auto px-4 py-10 max-w-4xl">
        {(phase === "registration" || phase === "self-assessment") && (
          <div className="mb-6">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna alla home
            </a>
          </div>
        )}
        {(phase === "registration" || phase === "self-assessment") && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-blue-700 dark:text-blue-300 px-5 py-2 rounded-full text-sm font-medium mb-5 border border-blue-100 dark:border-blue-800/40 shadow-sm">
              <GraduationCap className="w-4 h-4" />
              Test Adattivo di Italiano
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent leading-normal pb-2" data-testid="text-page-title">
              Scopri il Tuo Livello<br className="hidden md:block" /> di Italiano
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-base max-w-lg mx-auto">
              Un test gratuito e intelligente che si adatta alle tue risposte per valutare con precisione le tue competenze linguistiche.
            </p>
          </div>
        )}
        {phase !== "registration" && phase !== "self-assessment" && (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="text-page-title">
              Test di Italiano
            </h1>
          </div>
        )}

        {phase !== "registration" && phase !== "self-assessment" && phase !== "results" && (
          <div className="mb-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-600 dark:text-slate-400" data-testid="text-current-level">
                  Level: <span className={`inline-block px-2 py-0.5 rounded text-white text-xs font-bold ${levelColor(currentLevel)}`}>{currentLevel}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400" data-testid="text-questions-answered">
                  Questions: {totalAnswered}
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
                  {["Gramm", "Vocab", "Uso", "Lettura", "Ascolto"].map((label, idx) => (
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
          <div className="max-w-xl mx-auto" data-testid="card-registration">
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-white/80 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center">Adattivo</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-white/80 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center">Gratuito</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-white/80 dark:border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center">~20 min</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border border-white/90 dark:border-slate-700/60 shadow-2xl shadow-blue-900/5 dark:shadow-black/20 overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Inserisci i tuoi dati</h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">I campi contrassegnati con * sono obbligatori</p>
              </div>
              <div className="px-8 pb-8 pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Nome *</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                              <Input {...field} data-testid="input-first-name" placeholder="Il tuo nome" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Cognome *</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                              <Input {...field} data-testid="input-last-name" placeholder="Il tuo cognome" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Email *</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                            <Input type="email" {...field} data-testid="input-email" placeholder="la-tua@email.com" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Telefono</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                              <Input {...field} data-testid="input-phone" placeholder="Numero di telefono" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Azienda</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                              <Input {...field} data-testid="input-company" placeholder="Nome azienda" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      <div className="col-span-3">
                        <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Citta</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <Input {...field} data-testid="input-city" placeholder="La tua citta" className="pl-11 h-12 bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <div className="col-span-2">
                        <FormField control={form.control} name="province" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">Provincia</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <Input {...field} data-testid="input-province" placeholder="es. VI" maxLength={2} className="pl-11 h-12 uppercase bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-600/60 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <div className="pt-3">
                      <Button type="submit" className="w-full h-13 text-base bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200" data-testid="button-start-test">
                        Inizia il Test
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
                      I tuoi dati sono trattati in conformita con il GDPR.
                    </p>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}

        {phase === "self-assessment" && (
          <div className="max-w-xl mx-auto" data-testid="card-self-assessment">
            <div className="rounded-3xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border border-white/90 dark:border-slate-700/60 shadow-2xl shadow-blue-900/5 dark:shadow-black/20 overflow-hidden">
              <div className="px-8 pt-8 pb-4 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Come valuti il tuo italiano?</h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  Questo ci aiuta a calibrare il test sul tuo livello.
                </p>
              </div>
              <div className="px-6 pb-8 space-y-2.5">
                {Object.entries(CEFR_DESCRIPTIONS).map(([level, { label, desc }]) => {
                  const dotColors: Record<string, string> = {
                    A1: "bg-emerald-500",
                    A2: "bg-teal-500",
                    B1: "bg-blue-500",
                    B2: "bg-violet-500",
                    C1: "bg-amber-500",
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => handleSelfAssessment(level)}
                      disabled={isSubmitting}
                      className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-600/40 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-100/40 dark:hover:shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 group"
                      data-testid={`button-level-${level}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${dotColors[level] || "bg-gray-500"} flex-shrink-0 group-hover:scale-125 transition-transform`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-sm">{label}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
                {isSubmitting && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Preparazione del test...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === "mc-questions" && (
          <>
            {sectionTransition && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" data-testid="section-transition">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-2xl">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sezione Completata</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Prossima sezione: {sectionTransition}</p>
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
                      Sezione {currentSectionIndex}/5
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentQuestion.passage && (
                    <div className={`rounded-xl p-4 border ${
                      currentQuestion.skillType === "listening"
                        ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    }`} data-testid="text-passage">
                      <div className="flex items-center gap-2 mb-2">
                        {currentQuestion.skillType === "listening" ? (
                          <>
                            <BookOpen className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs uppercase tracking-wider text-indigo-500 font-medium">Trascrizione Ascolto (Modalità Lettura)</span>
                          </>
                        ) : (
                          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Brano di Lettura</span>
                        )}
                      </div>
                      <div className={`text-sm whitespace-pre-line leading-relaxed ${
                        currentQuestion.skillType === "listening"
                          ? "text-indigo-900 dark:text-indigo-200 italic"
                          : "text-slate-700 dark:text-slate-300"
                      }`}>{currentQuestion.passage}</div>
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
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Elaborazione...</>
                    ) : (
                      <>Avanti <ArrowRight className="w-4 h-4 ml-2" /></>
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
                <span className="font-medium text-blue-700 dark:text-blue-400">Prova di Scrittura</span>
              </div>
              <CardTitle className="text-xl">Prova di Scrittura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800" data-testid="text-writing-prompt">
                <div className="text-xs uppercase tracking-wider text-blue-600 mb-2 font-medium">Traccia</div>
                <p className="text-slate-800 dark:text-slate-200">{writingPrompt}</p>
              </div>

              <div>
                <Textarea
                  value={writingResponse}
                  onChange={(e) => setWritingResponse(e.target.value)}
                  rows={10}
                  className="resize-none"
                  placeholder="Scrivi la tua risposta qui..."
                  data-testid="textarea-writing"
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span data-testid="text-word-count">{wordCount} parole</span>
                  <span>{wordCount < 20 ? "Scrivi quanto riesci" : wordCount < 50 ? "Buon inizio, continua se vuoi" : "Ottima lunghezza"}</span>
                </div>
              </div>

              <Button
                onClick={handleWritingSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="button-submit-writing"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Valutazione con AI...</>
                ) : (
                  <>Invia Scrittura <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "results" && results && (
          <div className="space-y-6" data-testid="section-results">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center text-white">
                <p className="text-blue-100 text-sm mb-3 uppercase tracking-wider">Il Tuo Livello di Italiano</p>
                <div className="text-7xl font-bold mb-2" data-testid="text-final-level">{results.finalLevel}</div>
                <p className="text-blue-200">Livello QCER</p>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-sm text-slate-500 mb-1">Fase MC</div>
                    <div className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${levelColor(results.mcLevel)}`} data-testid="text-mc-level">
                      {results.mcLevel}
                    </div>
                  </div>
                  {results.writingLevel && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <div className="text-sm text-slate-500 mb-1">Scrittura</div>
                      <div className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${levelColor(results.writingLevel)}`} data-testid="text-writing-level">
                        {results.writingLevel}
                      </div>
                    </div>
                  )}
                </div>

                {results.sectionResults.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Dettaglio per Sezione</h3>
                    <div className="space-y-2">
                      {results.sectionResults.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg" data-testid={`section-result-${s.sectionName}`}>
                          <span className="text-slate-700 dark:text-slate-300 capitalize">{s.sectionName.replace(/_/g, " ")}</span>
                          <div className="flex items-center gap-4">
                            {s.accuracy !== null && (
                              <span className="text-sm text-slate-500">{s.accuracy}% accuratezza</span>
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
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Competenza Scrittura</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Grammatica", val: results.competencyReport.writing.grammar },
                        { label: "Vocabolario", val: results.competencyReport.writing.vocabulary },
                        { label: "Coerenza", val: results.competencyReport.writing.coherence },
                        { label: "Completamento Compito", val: results.competencyReport.writing.taskCompletion },
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

                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 dark:text-green-300 font-medium">Test Completato</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    I tuoi risultati sono stati inviati. Il nostro team ti contatterà con raccomandazioni personalizzate sui corsi.
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
