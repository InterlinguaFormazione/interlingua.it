import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProductReviewsSection } from "@/components/product-reviews";
import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Mic, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  CheckCircle, 
  Star,
  MessageCircle,
  Globe,
  Award,
  ArrowRight,
  CreditCard,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
const speakersCornerImage = "/images/speakers-corner.png";

export default function SpeakersCornerPage() {
  useSEO({
    title: "Speaker's Corner | Conversazione Inglese Vicenza | SkillCraft-Interlingua",
    description: "Speaker's Corner: pratica la conversazione in inglese a Vicenza. Sessioni settimanali con insegnanti qualificati. Migliora il tuo speaking in modo naturale.",
    canonical: "/speakers-corner",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/speakers-corner/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("sc_subscriber", JSON.stringify(data.subscriber));
        setLocation("/speakers-corner/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Errore di accesso",
        description: error.message.includes("401") 
          ? "Email o password non corretti" 
          : error.message.includes("403")
          ? "Il tuo abbonamento non è attivo o è scaduto"
          : "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Campi obbligatori",
        description: "Inserisci email e password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const benefits = [
    {
      icon: MessageCircle,
      title: "Conversazione Libera",
      description: "Pratica il tuo inglese in un ambiente rilassato e informale con altri partecipanti.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: Globe,
      title: "Temi Attuali",
      description: "Ogni settimana un argomento diverso: attualità, cultura, viaggi, tecnologia e molto altro.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
    },
    {
      icon: Users,
      title: "Piccoli Gruppi",
      description: "Gruppi ridotti per sessione per garantire a tutti la possibilità di parlare.",
      gradient: "from-violet-500/20 to-purple-500/20",
      iconColor: "text-violet-500",
    },
    {
      icon: Award,
      title: "Moderatore Esperto",
      description: "Un insegnante qualificato guida la conversazione e fornisce correzioni utili.",
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Abbonati",
      description: "Acquista il tuo abbonamento online e ricevi subito le credenziali di accesso.",
      icon: CreditCard,
    },
    {
      step: "2",
      title: "Ricevi l'invito",
      description: "Ogni martedì ricevi un'email con il tema della sessione del venerdì e il link per prenotarti.",
      icon: Mail,
    },
    {
      step: "3",
      title: "Prenota il tuo posto",
      description: "Accedi alla tua area riservata e prenota la sessione con un click.",
      icon: Calendar,
    },
    {
      step: "4",
      title: "Partecipa e Parla!",
      description: "Vieni il venerdì alle 18:30 e goditi un'ora di conversazione stimolante in inglese.",
      icon: Volume2,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="relative pt-36 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/3 to-transparent" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary" data-testid="badge-sc-label">Servizio in Abbonamento</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]" data-testid="text-sc-title">
                  Speaker's
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-blue-400 bg-clip-text text-transparent">
                    Corner
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl" data-testid="text-sc-description">
                  Il tuo appuntamento settimanale con la conversazione in inglese. 
                  Ogni <strong className="text-foreground">venerdì alle 18:30</strong>, un'ora di pratica guidata 
                  per migliorare la tua fluenza e sicurezza.
                </p>

                <div className="flex flex-wrap gap-6 mb-10">
                  <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-border/50 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quando</p>
                      <p className="font-semibold text-foreground">Ogni Venerdì</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-border/50 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Orario</p>
                      <p className="font-semibold text-foreground">18:30 - 19:30</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-5xl font-bold text-foreground" data-testid="text-sc-price">€200</span>
                  <span className="text-lg text-muted-foreground">/anno</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="h-14 px-8 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" onClick={() => setLocation("/speakers-corner/acquista")} data-testid="button-sc-purchase">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Acquista Abbonamento
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-sc-login-scroll">
                    Accedi al tuo account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="relative lg:pl-8">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-primary/5 to-blue-400/20 rounded-3xl blur-2xl" />
                  <img
                    src={speakersCornerImage}
                    alt="Speaker's Corner - Conversazione in inglese"
                    className="relative rounded-3xl w-full max-w-lg mx-auto shadow-2xl shadow-primary/10 border border-white/20"
                    data-testid="img-sc-hero"
                  />
                  <div className="absolute -bottom-12 -left-6 bg-card rounded-2xl shadow-xl border border-border/50 p-4 backdrop-blur-sm hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Sessione Live</p>
                        <p className="text-xs text-muted-foreground">Ogni venerdì sera</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-4 bg-card rounded-2xl shadow-xl border border-border/50 p-4 backdrop-blur-sm hidden sm:block">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-bold text-primary">A</div>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-card flex items-center justify-center text-xs font-bold text-emerald-600">B</div>
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-card flex items-center justify-center text-xs font-bold text-amber-600">C</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="info-section" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                I Vantaggi
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-sc-benefits-title">
                Perché scegliere Speaker's Corner?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un format unico pensato per chi vuole fare pratica reale di conversazione in inglese.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1" 
                  data-testid={`card-benefit-${index}`}
                >
                  <CardContent className="pt-8 pb-6 text-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mx-auto mb-5`}>
                        <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-foreground mb-2 text-lg">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <ArrowRight className="w-3 h-3 mr-1" />
                  4 Semplici Passi
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-sc-how-title">
                  Come Funziona
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative flex gap-5 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                    data-testid={`step-sc-${index}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md shadow-primary/25">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
                        <item.icon className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden border-primary/20 shadow-xl shadow-primary/5" data-testid="card-sc-email-info">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-1">
                  <CardContent className="p-8 md:p-10 bg-card rounded-lg">
                    <div className="flex items-start gap-5 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">Email Settimanale del Martedì</h3>
                        <p className="text-muted-foreground text-lg">
                          Ogni martedì, tutti gli abbonati attivi ricevono un'email di invito con:
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 ml-0 md:ml-[76px]">
                      {[
                        "Il tema di conversazione del venerdì",
                        "Materiali di preparazione e spunti",
                        "Link diretto per prenotare",
                        "News sulle sessioni speciali",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="login-section" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-muted/40" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-md mx-auto">
              <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden" data-testid="card-sc-login">
                <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-blue-400" />
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Mic className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Area Abbonati</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Accedi con le tue credenziali per prenotare le sessioni.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="la-tua@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl"
                        data-testid="input-sc-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="La tua password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl"
                        data-testid="input-sc-password"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/25" 
                      disabled={loginMutation.isPending}
                      data-testid="button-sc-login"
                    >
                      {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>
                  <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Non sei ancora abbonato?{" "}
                      <button 
                        onClick={() => setLocation("/speakers-corner/acquista")}
                        className="text-primary font-semibold hover:underline"
                        data-testid="link-sc-info"
                      >
                        Abbonati ora
                      </button>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hai bisogno di aiuto?{" "}
                      <a href="tel:+390461231151" className="text-primary font-semibold hover:underline">
                        0461 231151
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <Sparkles className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white/90">Inizia Oggi</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" data-testid="text-sc-cta-title">
                Vuoi provare Speaker's Corner?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Unisciti alla nostra community di conversazione in inglese. Migliora la tua fluenza settimana dopo settimana.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-base rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl" onClick={() => setLocation("/speakers-corner/acquista")} data-testid="button-sc-cta-purchase">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Acquista Abbonamento
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild data-testid="button-sc-contact">
                  <a href="tel:+390461231151">
                    Chiama: 0461 231151
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild data-testid="button-sc-email-contact">
                  <a href="mailto:info@interlingua.it">
                    info@interlingua.it
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <ProductReviewsSection productSlugs={["speakers-corner"]} />
      </main>
      <Footer />
    </div>
  );
}
