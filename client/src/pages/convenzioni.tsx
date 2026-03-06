import { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Breadcrumb } from "@/components/breadcrumb";
import { Handshake, Search, CheckCircle, Gift, ArrowRight, ArrowLeft, Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SHOP_PRODUCTS, getProductBySlug } from "@shared/products";

interface ConventionDiscount {
  productSlug: string;
  productOptions?: Record<string, string>;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description?: string;
}

interface ConventionInfo {
  id: string;
  companyName: string;
  discounts: ConventionDiscount[];
}

interface RegistrationResult {
  companyName: string;
  discounts: ConventionDiscount[];
  accountCreated: boolean;
  alreadyRegistered: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ConvenzioniPage() {
  useSEO({
    title: "Convenzioni Aziendali | Corsi di Lingue per Aziende | SkillCraft-Interlingua",
    description: "Convenzioni aziendali per corsi di lingue a Vicenza e online. Sconti esclusivi per dipendenti. Inglese, tedesco, francese, spagnolo per le aziende del Veneto.",
    canonical: "/convenzioni",
  });
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        discounts: data.discounts || [],
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

    if (!password || password.length < 6) {
      toast({ title: "La password deve essere di almeno 6 caratteri", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Le password non corrispondono", variant: "destructive" });
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
        password: password,
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
        companyName: data.companyName || convention.companyName,
        discounts: convention.discounts || [],
        accountCreated: !!data.accountCreated,
        alreadyRegistered: !!data.alreadyRegistered,
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
      <Breadcrumb items={[{ label: "Convenzioni", href: "/convenzioni" }]} schemaOnly />
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
                  {convention.discounts.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Sconti riservati:</p>
                      {convention.discounts.map((d, i) => {
                        const product = getProductBySlug(d.productSlug);
                        return (
                          <div key={i} className="flex items-center justify-between text-sm" data-testid={`text-discount-preview-${i}`}>
                            <span>
                              {product?.name || d.productSlug}
                              {d.productOptions && Object.keys(d.productOptions).length > 0 && (
                                <span className="text-muted-foreground ml-1">({Object.values(d.productOptions).join(", ")})</span>
                              )}
                            </span>
                            <Badge variant="secondary">
                              {d.discountType === "percentage" ? `-${d.discountValue}%` : `-€${d.discountValue.toFixed(2)}`}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-4">Registrati per attivare gli sconti al checkout</h3>

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Password *</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimo 6 caratteri"
                          className="pr-10"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label>Conferma Password *</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ripeti la password"
                          className="pr-10"
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-2">
                    Verrà creato un account per accedere all'Area Clienti dove potrai vedere ordini e sconti.
                  </p>

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
                  I tuoi sconti riservati come dipendente di {result.companyName} sono ora attivi
                </p>

                {result.discounts.length > 0 && (
                  <div className="bg-muted/50 rounded-md p-6 mb-6 text-left">
                    <p className="text-sm font-medium mb-3">I tuoi sconti:</p>
                    <div className="space-y-2">
                      {result.discounts.map((d, i) => {
                        const product = getProductBySlug(d.productSlug);
                        return (
                          <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0" data-testid={`text-result-discount-${i}`}>
                            <span>
                              {product?.name || d.productSlug}
                              {d.productOptions && Object.keys(d.productOptions).length > 0 && (
                                <span className="text-muted-foreground ml-1">({Object.values(d.productOptions).join(", ")})</span>
                              )}
                            </span>
                            <Badge variant="secondary" className="font-semibold">
                              {d.discountType === "percentage" ? `-${d.discountValue}%` : `-€${d.discountValue.toFixed(2)}`}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-muted/30 rounded-md p-4 text-left space-y-2 mb-6">
                  <h3 className="font-semibold text-sm">Come funziona:</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Visita il nostro <a href="/shop" className="text-primary underline">Shop Corsi</a></li>
                    <li>Scegli il corso che ti interessa</li>
                    <li>Al checkout, inserisci la stessa email usata per la registrazione</li>
                    <li>Lo sconto verrà applicato automaticamente ai prodotti convenzionati</li>
                  </ol>
                </div>

                <div className="bg-primary/5 rounded-md p-4 text-left mb-6">
                  {result.accountCreated ? (
                    <>
                      <p className="text-sm font-medium mb-1">Il tuo account è stato creato</p>
                      <p className="text-sm text-muted-foreground">
                        Puoi accedere all'<a href="/shop/dashboard" className="text-primary underline" data-testid="link-area-clienti">Area Clienti</a> con la email e la password scelte per visualizzare i tuoi sconti, ordini e materiali.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium mb-1">Hai già un account</p>
                      <p className="text-sm text-muted-foreground">
                        Accedi all'<a href="/shop/dashboard" className="text-primary underline" data-testid="link-area-clienti">Area Clienti</a> con le tue credenziali per visualizzare i tuoi sconti, ordini e materiali.
                      </p>
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground" data-testid="text-email-notice">
                  Ricorda: usa la stessa email ({email}) al checkout per ricevere gli sconti automaticamente.
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
