import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { PROVINCES } from "@shared/provinces";
import { COUNTRIES } from "@shared/countries";
import { SiPaypal, SiVisa, SiMastercard } from "react-icons/si";
import {
  Mic,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  CreditCard,
  Shield,
  ArrowRight,
  Loader2,
  User,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function SpeakersCornerPurchase() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tipoFatturazione, setTipoFatturazione] = useState<"privato" | "professionista" | "azienda">("privato");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [cap, setCap] = useState("");
  const [citta, setCitta] = useState("");
  const [provincia, setProvincia] = useState("");
  const [paese, setPaese] = useState("IT");
  const [comuniList, setComuniList] = useState<Array<{ nome: string; cap: string[] }>>([]);
  const [loadingComuni, setLoadingComuni] = useState(false);
  const [capList, setCapList] = useState<string[]>([]);
  const [acceptGdpr, setAcceptGdpr] = useState(false);
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [codiceSdi, setCodiceSdi] = useState("");
  const [pec, setPec] = useState("");
  const [step, setStep] = useState<"details" | "billing" | "payment" | "success">("details");
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalInitialized = useRef(false);

  const purchaseMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", "/api/speakers-corner/purchase", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("sc_subscriber", JSON.stringify(data.subscriber));
        setStep("success");
        toast({
          title: "Acquisto completato!",
          description: "Il tuo abbonamento è attivo. Verrai reindirizzato alla dashboard.",
        });
        setTimeout(() => setLocation("/speakers-corner/dashboard"), 3000);
      }
    },
    onError: (error: Error) => {
      setProcessing(false);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'acquisto.",
        variant: "destructive",
      });
    },
  });

  const isItaly = paese === "IT";

  useEffect(() => {
    if (isItaly && provincia) {
      setLoadingComuni(true);
      setCitta("");
      setCap("");
      setCapList([]);
      fetch(`/api/comuni/${provincia}`)
        .then((r) => r.json())
        .then((data) => setComuniList(data))
        .catch(() => setComuniList([]))
        .finally(() => setLoadingComuni(false));
    } else {
      setComuniList([]);
      setCapList([]);
    }
  }, [provincia, isItaly]);

  const handleComuneChange = (comune: string) => {
    setCitta(comune);
    const found = comuniList.find((c) => c.nome === comune);
    const caps = found?.cap || [];
    setCapList(caps);
    if (caps.length === 1) {
      setCap(caps[0]);
    } else {
      setCap("");
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cognome || !email || !password || !confirmPassword) {
      toast({ title: "Campi obbligatori", description: "Compila tutti i campi.", variant: "destructive" });
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      toast({ title: "Password troppo debole", description: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password non coincidono", description: "Le password inserite non corrispondono.", variant: "destructive" });
      return;
    }
    setStep("billing");
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indirizzo || !cap || !citta) {
      toast({ title: "Campi obbligatori", description: "Compila tutti i campi di fatturazione obbligatori.", variant: "destructive" });
      return;
    }
    if (isItaly) {
      if (!codiceFiscale || !provincia) {
        toast({ title: "Campi obbligatori", description: "Per l'Italia, Codice Fiscale e Provincia sono obbligatori.", variant: "destructive" });
        return;
      }
      if (tipoFatturazione === "privato" && codiceFiscale.length !== 16) {
        toast({ title: "Codice Fiscale non valido", description: "Il codice fiscale deve essere di 16 caratteri.", variant: "destructive" });
        return;
      }
      if (tipoFatturazione === "professionista") {
        if (codiceFiscale.length !== 16) {
          toast({ title: "Codice Fiscale non valido", description: "Il codice fiscale deve essere di 16 caratteri.", variant: "destructive" });
          return;
        }
        if (!partitaIva) {
          toast({ title: "Partita IVA obbligatoria", description: "Inserisci la Partita IVA.", variant: "destructive" });
          return;
        }
        if (!codiceSdi && !pec) {
          toast({ title: "SDI o PEC obbligatorio", description: "Inserisci il Codice SDI oppure la PEC per la fatturazione elettronica.", variant: "destructive" });
          return;
        }
      }
      if (tipoFatturazione === "azienda") {
        if (!ragioneSociale) {
          toast({ title: "Ragione Sociale obbligatoria", description: "Inserisci la Ragione Sociale dell'azienda.", variant: "destructive" });
          return;
        }
        if (!partitaIva) {
          toast({ title: "Partita IVA obbligatoria", description: "Inserisci la Partita IVA dell'azienda.", variant: "destructive" });
          return;
        }
        if (!codiceSdi && !pec) {
          toast({ title: "SDI o PEC obbligatorio", description: "Inserisci il Codice SDI oppure la PEC per la fatturazione elettronica.", variant: "destructive" });
          return;
        }
      }
      if (cap.length !== 5) {
        toast({ title: "CAP non valido", description: "Il CAP deve essere di 5 cifre.", variant: "destructive" });
        return;
      }
    }
    if (!acceptGdpr) {
      toast({ title: "Consenso Privacy", description: "Devi acconsentire al trattamento dei dati personali per procedere.", variant: "destructive" });
      return;
    }
    setStep("payment");
  };

  useEffect(() => {
    if (step !== "payment" || paypalInitialized.current) return;
    paypalInitialized.current = true;

    const loadPayPalSDK = async () => {
      try {
        if (!(window as any).paypal) {
          const script = document.createElement("script");
          script.src = import.meta.env.PROD
            ? "https://www.paypal.com/web-sdk/v6/core"
            : "https://www.sandbox.paypal.com/web-sdk/v6/core";
          script.async = true;
          script.onload = () => initPayPal();
          document.body.appendChild(script);
        } else {
          await initPayPal();
        }
      } catch (e) {
        console.error("Failed to load PayPal SDK", e);
      }
    };

    const initPayPal = async () => {
      try {
        const clientToken: string = await fetch("/paypal/setup")
          .then((res) => res.json())
          .then((data) => data.clientToken);

        const sdkInstance = await (window as any).paypal.createInstance({
          clientToken,
          components: ["paypal-payments"],
        });

        const paypalCheckout = sdkInstance.createPayPalOneTimePaymentSession({
          onApprove: async (data: any) => {
            setProcessing(true);
            try {
              const captureRes = await fetch(`/paypal/order/${data.orderId}/capture`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              const captureData = await captureRes.json();

              if (captureData.status === "COMPLETED") {
                purchaseMutation.mutate({
                  paypalOrderId: data.orderId,
                  nome,
                  cognome,
                  email,
                  password,
                  tipoFatturazione,
                  codiceFiscale,
                  indirizzo,
                  cap,
                  citta,
                  provincia,
                  paese,
                  ragioneSociale,
                  partitaIva,
                  codiceSdi,
                  pec,
                });
              } else {
                setProcessing(false);
                toast({
                  title: "Pagamento non completato",
                  description: "Il pagamento non è stato completato. Riprova.",
                  variant: "destructive",
                });
              }
            } catch (err) {
              setProcessing(false);
              toast({
                title: "Errore",
                description: "Errore durante la cattura del pagamento.",
                variant: "destructive",
              });
            }
          },
          onCancel: () => {
            toast({
              title: "Pagamento annullato",
              description: "Hai annullato il pagamento. Puoi riprovare quando vuoi.",
            });
          },
          onError: (err: any) => {
            console.error("PayPal error:", err);
            toast({
              title: "Errore PayPal",
              description: "Si è verificato un errore con PayPal. Riprova.",
              variant: "destructive",
            });
          },
        });

        const onClick = async () => {
          try {
            const checkoutOptionsPromise = createOrder();
            await paypalCheckout.start(
              { paymentFlow: "auto" },
              checkoutOptionsPromise,
            );
          } catch (e) {
            console.error(e);
          }
        };

        const paypalButton = document.getElementById("paypal-button");
        if (paypalButton) {
          paypalButton.addEventListener("click", onClick);
        }

        setPaypalReady(true);

        return () => {
          if (paypalButton) {
            paypalButton.removeEventListener("click", onClick);
          }
        };
      } catch (e) {
        console.error("PayPal init error:", e);
      }
    };

    const createOrder = async () => {
      const response = await fetch("/paypal/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: "200.00",
          currency: "EUR",
          intent: "CAPTURE",
        }),
      });
      const output = await response.json();
      return { orderId: output.id };
    };

    loadPayPalSDK();
  }, [step]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-36 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary" data-testid="badge-purchase-label">
                <Mic className="w-3 h-3 mr-1" />
                Abbonamento Annuale
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-purchase-title">
                Acquista Speaker's Corner
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-purchase-subtitle">
                Un anno intero di conversazione in inglese per migliorare la tua fluenza
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2">
                <Card className="sticky top-28">
                  <CardHeader>
                    <CardTitle data-testid="text-product-title">Speaker's Corner</CardTitle>
                    <CardDescription>Abbonamento Annuale</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-4">
                      <span className="text-5xl font-bold text-foreground" data-testid="text-price">€200</span>
                      <span className="text-muted-foreground">/anno</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">Sessioni settimanali ogni venerdì</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">40 sessioni all'anno</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">1 ora di pratica (18:30–19:30)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">Piccoli gruppi (max 12 persone)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mic className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground">Moderatore qualificato</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Pagamento sicuro</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 py-2">
                        <SiPaypal className="w-10 h-10 text-[#003087]" />
                        <SiVisa className="w-10 h-10 text-[#1A1F71]" />
                        <SiMastercard className="w-10 h-10 text-[#EB001B]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                {step === "details" && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <CardTitle>I tuoi dati</CardTitle>
                          <CardDescription>Crea il tuo account per accedere alle sessioni</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDetailsSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="purchase-nome">Nome</Label>
                            <Input
                              id="purchase-nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              placeholder="Mario"
                              required
                              data-testid="input-purchase-nome"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="purchase-cognome">Cognome</Label>
                            <Input
                              id="purchase-cognome"
                              value={cognome}
                              onChange={(e) => setCognome(e.target.value)}
                              placeholder="Rossi"
                              required
                              data-testid="input-purchase-cognome"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchase-email">Email</Label>
                          <Input
                            id="purchase-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mario@email.com"
                            required
                            data-testid="input-purchase-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchase-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="purchase-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Min. 8 caratteri, maiuscola, numero, speciale"
                              required
                              className="pr-10"
                              data-testid="input-purchase-password"
                            />
                            <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-0 h-full px-3 text-muted-foreground" data-testid="button-toggle-password">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {password && (
                            <div className="space-y-1">
                              <p className={`text-xs ${password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}>
                                {password.length >= 8 ? "✓" : "○"} Almeno 8 caratteri
                              </p>
                              <p className={`text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                {/[A-Z]/.test(password) ? "✓" : "○"} Una lettera maiuscola
                              </p>
                              <p className={`text-xs ${/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                {/[a-z]/.test(password) ? "✓" : "○"} Una lettera minuscola
                              </p>
                              <p className={`text-xs ${/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                {/[0-9]/.test(password) ? "✓" : "○"} Un numero
                              </p>
                              <p className={`text-xs ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} Un carattere speciale (!@#$...)
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchase-confirm-password">Conferma Password</Label>
                          <div className="relative">
                            <Input
                              id="purchase-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Ripeti la password"
                              required
                              className="pr-10"
                              data-testid="input-purchase-confirm-password"
                            />
                            <button type="button" tabIndex={-1} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-0 h-full px-3 text-muted-foreground" data-testid="button-toggle-confirm-password">
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-destructive">Le password non coincidono</p>
                          )}
                          {confirmPassword && password === confirmPassword && (
                            <p className="text-xs text-green-600">✓ Le password coincidono</p>
                          )}
                        </div>
                        <Button type="submit" className="w-full" size="lg" data-testid="button-continue-billing">
                          Continua
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === "billing" && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <CardTitle>Dati di Fatturazione</CardTitle>
                          <CardDescription>Dati necessari per l'emissione della fattura</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleBillingSubmit} className="space-y-5">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Tipo di fatturazione *</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => setTipoFatturazione("privato")}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${tipoFatturazione === "privato" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}
                              data-testid="button-tipo-privato"
                            >
                              <User className={`w-6 h-6 ${tipoFatturazione === "privato" ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`text-sm font-medium ${tipoFatturazione === "privato" ? "text-primary" : "text-muted-foreground"}`}>Privato</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTipoFatturazione("professionista")}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${tipoFatturazione === "professionista" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}
                              data-testid="button-tipo-professionista"
                            >
                              <Briefcase className={`w-6 h-6 ${tipoFatturazione === "professionista" ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`text-sm font-medium ${tipoFatturazione === "professionista" ? "text-primary" : "text-muted-foreground"}`}>Professionista</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setTipoFatturazione("azienda")}
                              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${tipoFatturazione === "azienda" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/30"}`}
                              data-testid="button-tipo-azienda"
                            >
                              <Building2 className={`w-6 h-6 ${tipoFatturazione === "azienda" ? "text-primary" : "text-muted-foreground"}`} />
                              <span className={`text-sm font-medium ${tipoFatturazione === "azienda" ? "text-primary" : "text-muted-foreground"}`}>Azienda</span>
                            </button>
                          </div>
                        </div>

                        {isItaly && tipoFatturazione === "azienda" && (
                          <div className="space-y-2">
                            <Label htmlFor="purchase-ragione">Ragione Sociale *</Label>
                            <Input
                              id="purchase-ragione"
                              value={ragioneSociale}
                              onChange={(e) => setRagioneSociale(e.target.value)}
                              placeholder="Nome dell'azienda"
                              required
                              data-testid="input-purchase-ragione"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="purchase-paese">Paese *</Label>
                          <Select value={paese} onValueChange={(v) => { setPaese(v); if (v !== "IT") { setTipoFatturazione("privato"); setProvincia(""); setCitta(""); setCap(""); } }}>
                            <SelectTrigger data-testid="select-purchase-paese">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((c) => (
                                <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {isItaly && (
                          <div className="space-y-2">
                            <Label htmlFor="purchase-cf">Codice Fiscale *</Label>
                            <Input
                              id="purchase-cf"
                              value={codiceFiscale}
                              onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())}
                              placeholder={tipoFatturazione === "privato" || tipoFatturazione === "professionista" ? "RSSMRA85M01H501Z" : "01234567890"}
                              required
                              maxLength={16}
                              data-testid="input-purchase-cf"
                            />
                            <p className="text-xs text-muted-foreground">
                              {tipoFatturazione === "azienda" ? "Codice fiscale dell'azienda (11 cifre)" : "16 caratteri alfanumerici"}
                            </p>
                          </div>
                        )}

                        {isItaly && (tipoFatturazione === "professionista" || tipoFatturazione === "azienda") && (
                          <div className="space-y-2">
                            <Label htmlFor="purchase-piva">Partita IVA *</Label>
                            <Input
                              id="purchase-piva"
                              value={partitaIva}
                              onChange={(e) => setPartitaIva(e.target.value.replace(/\D/g, "").slice(0, 11))}
                              placeholder="01234567890"
                              required
                              maxLength={11}
                              data-testid="input-purchase-piva"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="purchase-indirizzo">Indirizzo *</Label>
                          <Input
                            id="purchase-indirizzo"
                            value={indirizzo}
                            onChange={(e) => setIndirizzo(e.target.value)}
                            placeholder="Via Roma 1"
                            required
                            data-testid="input-purchase-indirizzo"
                          />
                        </div>

                        <div className={`grid ${isItaly ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
                          {isItaly && (
                            <div className="space-y-2">
                              <Label htmlFor="purchase-provincia">Provincia *</Label>
                              <Select value={provincia} onValueChange={setProvincia}>
                                <SelectTrigger data-testid="select-purchase-provincia">
                                  <SelectValue placeholder="Seleziona..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROVINCES.map((p) => (
                                    <SelectItem key={p.sigla} value={p.sigla}>{p.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="purchase-citta">{isItaly ? "Comune" : "Città"} *</Label>
                            {isItaly && provincia && comuniList.length > 0 ? (
                              <Select value={citta} onValueChange={handleComuneChange}>
                                <SelectTrigger data-testid="select-purchase-citta">
                                  <SelectValue placeholder={loadingComuni ? "Caricamento..." : "Seleziona comune..."} />
                                </SelectTrigger>
                                <SelectContent>
                                  {comuniList.map((c) => (
                                    <SelectItem key={c.nome} value={c.nome}>{c.nome}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id="purchase-citta"
                                value={citta}
                                onChange={(e) => setCitta(e.target.value)}
                                placeholder={isItaly && provincia ? "Caricamento..." : ""}
                                required
                                data-testid="input-purchase-citta"
                              />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="purchase-cap">{isItaly ? "CAP" : "Codice Postale"} *</Label>
                            {isItaly && capList.length > 1 ? (
                              <Select value={cap} onValueChange={setCap}>
                                <SelectTrigger data-testid="select-purchase-cap">
                                  <SelectValue placeholder="Seleziona CAP..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {capList.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id="purchase-cap"
                                value={cap}
                                onChange={(e) => setCap(e.target.value)}
                                maxLength={isItaly ? 5 : 10}
                                required
                                readOnly={isItaly && capList.length === 1}
                                data-testid="input-purchase-cap"
                              />
                            )}
                          </div>
                        </div>

                        {isItaly && (tipoFatturazione === "professionista" || tipoFatturazione === "azienda") && (
                          <div className="pt-3 border-t space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">
                              Fatturazione elettronica (inserisci almeno uno) *
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="purchase-sdi">Codice SDI</Label>
                                <Input
                                  id="purchase-sdi"
                                  value={codiceSdi}
                                  onChange={(e) => setCodiceSdi(e.target.value.toUpperCase())}
                                  placeholder="XXXXXXX"
                                  maxLength={7}
                                  data-testid="input-purchase-sdi"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="purchase-pec">PEC</Label>
                                <Input
                                  id="purchase-pec"
                                  type="email"
                                  value={pec}
                                  onChange={(e) => setPec(e.target.value)}
                                  placeholder="nome@pec.it"
                                  data-testid="input-purchase-pec"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/30">
                          <Checkbox
                            id="acceptGdpr"
                            checked={acceptGdpr}
                            onCheckedChange={(checked) => setAcceptGdpr(checked === true)}
                            data-testid="checkbox-accept-gdpr"
                          />
                          <Label htmlFor="acceptGdpr" className="text-sm leading-relaxed cursor-pointer">
                            Acconsento al{" "}
                            <a href="/privacy-policy" className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                              trattamento dei dati personali
                            </a>{" "}
                            ai sensi del GDPR (Reg. UE 2016/679) *
                          </Label>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setStep("details")}
                            data-testid="button-back-details-from-billing"
                          >
                            ← Indietro
                          </Button>
                          <Button type="submit" className="flex-1" size="lg" data-testid="button-continue-payment">
                            Continua al pagamento
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === "payment" && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <CardTitle>Pagamento</CardTitle>
                          <CardDescription>Completa l'acquisto con PayPal o carta di credito</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-foreground">Speaker's Corner — Abbonamento Annuale</p>
                            <p className="text-sm text-muted-foreground">{nome} {cognome} ({email})</p>
                          </div>
                          <span className="text-2xl font-bold text-foreground" data-testid="text-payment-amount">€200</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-5 py-2">
                        <SiPaypal className="w-9 h-9 text-[#003087]" />
                        <SiVisa className="w-9 h-9 text-[#1A1F71]" />
                        <SiMastercard className="w-9 h-9 text-[#EB001B]" />
                      </div>

                      {processing ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <p className="text-muted-foreground">Elaborazione del pagamento in corso...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {!paypalReady && (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                              <span className="text-muted-foreground">Caricamento metodi di pagamento...</span>
                            </div>
                          )}
                          <div style={{ display: paypalReady ? "block" : "none" }}>
                            <paypal-button id="paypal-button" data-testid="button-paypal-pay"></paypal-button>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                              paypalInitialized.current = false;
                              setStep("billing");
                            }}
                            data-testid="button-back-billing"
                          >
                            ← Torna ai dati di fatturazione
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {step === "success" && (
                  <Card>
                    <CardContent className="py-16 text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-success-title">
                          Acquisto completato!
                        </h2>
                        <p className="text-muted-foreground">
                          Benvenuto/a, {name}! Il tuo abbonamento annuale è ora attivo.
                        </p>
                        <p className="text-muted-foreground mt-2">
                          Verrai reindirizzato/a alla tua dashboard tra pochi secondi...
                        </p>
                      </div>
                      <Button onClick={() => setLocation("/speakers-corner/dashboard")} data-testid="button-go-dashboard">
                        Vai alla Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
