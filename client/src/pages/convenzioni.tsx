import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Search, CheckCircle, Gift, ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ConventionInfo {
  id: string;
  companyName: string;
  discountDescription: string | null;
}

interface RegistrationResult {
  discountCode: string;
  companyName: string;
  discountDescription: string | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ConvenzioniPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [companyCode, setCompanyCode] = useState("");
  const [convention, setConvention] = useState<ConventionInfo | null>(null);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyRole, setCompanyRole] = useState("");

  const [formLoadedAt] = useState(() => Date.now());

  const handleLookup = async () => {
    const code = companyCode.trim();
    if (!code) {
      toast({ title: "Inserisci il codice aziendale", variant: "destructive" });
      return;
    }
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/conventions/lookup?code=${encodeURIComponent(code)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Codice non trovato");
      }
      const data = await res.json();
      if (!data.found) {
        toast({
          title: "Codice non trovato",
          description: data.message || "Il codice aziendale inserito non corrisponde a nessuna convenzione attiva.",
          variant: "destructive",
        });
        return;
      }
      setConvention({
        id: data.conventionId,
        companyName: data.companyName,
        discountDescription: data.discountDescription,
      });
      setStep(2);
    } catch (err: any) {
      toast({
        title: "Codice non trovato",
        description: "Il codice aziendale inserito non corrisponde a nessuna convenzione attiva.",
        variant: "destructive",
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleRegister = async () => {
    const hpField = document.getElementById("conv_hp_field") as HTMLInputElement | null;
    if (hpField && hpField.value) return;

    const elapsed = Date.now() - formLoadedAt;
    if (elapsed < 3000) {
      toast({ title: "Attendi qualche secondo prima di inviare", variant: "destructive" });
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({ title: "Compila i campi obbligatori", variant: "destructive" });
      return;
    }

    if (!convention) return;

    setSubmitLoading(true);
    try {
      const payload = {
        companyCode: companyCode.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        companyRole: companyRole.trim() || undefined,
        _hp: hpField?.value || "",
        _ts: String(formLoadedAt),
      };
      const res = await apiRequest("POST", "/api/conventions/register", payload);
      const data = await res.json();
      if (!data.success) {
        toast({ title: "Errore", description: data.message || "Registrazione non riuscita.", variant: "destructive" });
        return;
      }
      setResult({
        discountCode: data.discountCode,
        companyName: data.companyName || convention.companyName,
        discountDescription: convention.discountDescription,
      });
      if (data.alreadyRegistered) {
        toast({ title: "Già registrato/a", description: data.message });
      }
      setStep(3);
    } catch (err: any) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="secondary" className="mb-4" data-testid="badge-convenzioni">
              <Handshake className="w-3.5 h-3.5 mr-1.5" />
              Convenzioni Aziendali
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-convenzioni-title">
              Convenzioni per Dipendenti
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto" data-testid="text-convenzioni-subtitle">
              Se la tua azienda ha una convenzione attiva con SkillCraft-Interlingua,
              inserisci il codice aziendale per accedere agli sconti riservati.
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`stepper-step-${s}`}
                >
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 transition-colors ${
                      step > s ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div {...fadeInUp}>
              <Card className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold" data-testid="text-step1-title">
                    Cerca la tua convenzione
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6" data-testid="text-step1-description">
                  Inserisci il codice aziendale che hai ricevuto dalla tua azienda per verificare la convenzione attiva.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-code">Codice Aziendale</Label>
                    <Input
                      id="company-code"
                      placeholder="es. ACME2024"
                      value={companyCode}
                      onChange={(e) => setCompanyCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                      className="mt-1.5"
                      data-testid="input-company-code"
                    />
                  </div>
                  <Button
                    onClick={handleLookup}
                    disabled={lookupLoading || !companyCode.trim()}
                    className="w-full"
                    data-testid="button-lookup"
                  >
                    {lookupLoading ? "Ricerca in corso..." : "Cerca Convenzione"}
                    {!lookupLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && convention && (
            <motion.div {...fadeInUp}>
              <Card className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold" data-testid="text-step2-title">
                    Convenzione trovata
                  </h2>
                </div>
                <div className="bg-muted/50 rounded-md p-4 mb-6">
                  <p className="font-semibold text-lg" data-testid="text-company-name">
                    {convention.companyName}
                  </p>
                  {convention.discountDescription && (
                    <p className="text-muted-foreground text-sm mt-1" data-testid="text-discount-description">
                      {convention.discountDescription}
                    </p>
                  )}
                </div>

                <h3 className="font-semibold mb-4">Compila i tuoi dati per ricevere il codice sconto</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome *</Label>
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1.5"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label>Cognome *</Label>
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1.5"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label>Telefono</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <Label>Ruolo in Azienda</Label>
                    <Input
                      value={companyRole}
                      onChange={(e) => setCompanyRole(e.target.value)}
                      placeholder="es. Responsabile Marketing"
                      className="mt-1.5"
                      data-testid="input-company-role"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      data-testid="button-back-step1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Indietro
                    </Button>
                    <Button
                      disabled={submitLoading}
                      className="flex-1"
                      data-testid="button-register"
                      onClick={() => handleRegister()}
                    >
                      {submitLoading ? "Registrazione in corso..." : "Registrati e Ottieni Sconto"}
                      {!submitLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div {...fadeInUp}>
              <Card className="p-6 md:p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-step3-title">
                  Registrazione completata!
                </h2>
                <p className="text-muted-foreground mb-6" data-testid="text-step3-subtitle">
                  Ecco il tuo codice sconto riservato ai dipendenti di {result.companyName}
                </p>

                <div className="bg-muted/50 rounded-md p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Il tuo codice sconto</p>
                  <p
                    className="text-3xl font-mono font-bold tracking-widest text-primary"
                    data-testid="text-discount-code"
                  >
                    {result.discountCode}
                  </p>
                  {result.discountDescription && (
                    <p className="text-sm text-muted-foreground mt-3" data-testid="text-discount-info">
                      {result.discountDescription}
                    </p>
                  )}
                </div>

                <div className="bg-muted/30 rounded-md p-4 text-left space-y-2 mb-6">
                  <h3 className="font-semibold text-sm">Come utilizzare il codice:</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Visita il nostro <a href="/shop" className="text-primary hover:underline">Shop Corsi</a></li>
                    <li>Scegli il corso che ti interessa</li>
                    <li>Inserisci il codice sconto durante il checkout</li>
                    <li>Lo sconto verrà applicato automaticamente</li>
                  </ol>
                </div>

                <p className="text-xs text-muted-foreground" data-testid="text-email-notice">
                  Il codice sconto è stato inviato anche al tuo indirizzo email.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
