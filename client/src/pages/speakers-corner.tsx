import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
} from "lucide-react";
const speakersCornerImage = "/images/speakers-corner.png";

export default function SpeakersCornerPage() {
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
    },
    {
      icon: Globe,
      title: "Temi Attuali",
      description: "Ogni settimana un argomento diverso: attualità, cultura, viaggi, tecnologia e molto altro.",
    },
    {
      icon: Users,
      title: "Piccoli Gruppi",
      description: "Massimo 12 partecipanti per sessione per garantire a tutti la possibilità di parlare.",
    },
    {
      icon: Award,
      title: "Moderatore Esperto",
      description: "Un insegnante madrelingua guida la conversazione e fornisce correzioni utili.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4" variant="secondary" data-testid="badge-sc-label">
                  <Mic className="w-3 h-3 mr-1" />
                  Servizio in Abbonamento
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-sc-title">
                  Speaker's Corner
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-sc-description">
                  Il tuo appuntamento settimanale con la conversazione in inglese. 
                  Ogni <strong>venerdì alle 18:30</strong>, un'ora di pratica guidata 
                  per migliorare la tua fluenza e sicurezza nel parlare.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Ogni Venerdì</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>18:30 - 19:30</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Max 12 persone</span>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground" data-testid="text-sc-price">€200</span>
                  <span className="text-muted-foreground">/anno</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" onClick={() => setLocation("/speakers-corner/acquista")} data-testid="button-sc-purchase">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Acquista Abbonamento
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-sc-login-scroll">
                    Accedi al tuo account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button size="lg" variant="ghost" onClick={() => document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-sc-info-scroll">
                    Scopri di più
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src={speakersCornerImage}
                  alt="Speaker's Corner - Conversazione in inglese"
                  className="rounded-2xl w-full max-w-lg mx-auto"
                  data-testid="img-sc-hero"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="info-section" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-sc-benefits-title">
                Perché scegliere Speaker's Corner?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Un format unico pensato per chi vuole fare pratica reale di conversazione in inglese.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center" data-testid={`card-benefit-${index}`}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-sc-how-title">
                  Come Funziona
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Abbonati",
                    description: "Scegli il piano che fa per te e ricevi le tue credenziali di accesso alla piattaforma.",
                  },
                  {
                    step: "2",
                    title: "Ricevi l'invito",
                    description: "Ogni martedì ricevi un'email con il tema della sessione del venerdì e il link per prenotarti.",
                  },
                  {
                    step: "3",
                    title: "Prenota il tuo posto",
                    description: "Accedi alla tua area riservata e prenota la sessione. I posti sono limitati a 12 per garantire qualità.",
                  },
                  {
                    step: "4",
                    title: "Partecipa e Parla!",
                    description: "Vieni il venerdì alle 18:30 e goditi un'ora di conversazione stimolante in inglese.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start" data-testid={`step-sc-${index}`}>
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="overflow-hidden" data-testid="card-sc-email-info">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Email Settimanale del Martedì</h3>
                      <p className="text-muted-foreground">
                        Ogni martedì, tutti gli abbonati attivi ricevono un'email di invito con:
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 ml-16">
                    {[
                      "Il tema di conversazione della sessione del venerdì",
                      "Eventuali materiali di preparazione o spunti di riflessione",
                      "Il link diretto per prenotare il tuo posto",
                      "Aggiornamenti sulle prossime sessioni speciali",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="login-section" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <Card data-testid="card-sc-login">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Area Abbonati</CardTitle>
                  <CardDescription>
                    Accedi con le credenziali ricevute al momento dell'iscrizione per prenotare le sessioni.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="la-tua@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="input-sc-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="La tua password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="input-sc-password"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                      data-testid="button-sc-login"
                    >
                      {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Non sei ancora abbonato?{" "}
                      <button 
                        onClick={() => document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-primary font-medium hover:underline"
                        data-testid="link-sc-info"
                      >
                        Scopri come funziona
                      </button>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Per abbonarti, contattaci al{" "}
                      <a href="tel:+390461231151" className="text-primary font-medium hover:underline">
                        0461 231151
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-sc-cta-title">
              Vuoi provare Speaker's Corner?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Contattaci per conoscere i piani di abbonamento e prenotare la tua prima sessione di prova.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild data-testid="button-sc-contact">
                <a href="tel:+390461231151">
                  Chiama: 0461 231151
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild data-testid="button-sc-email-contact">
                <a href="mailto:info@interlingua.it">
                  info@interlingua.it
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
