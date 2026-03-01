import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, useParams } from "wouter";
import { getProductBySlug, getEffectivePrice } from "@shared/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiPaypal, SiVisa, SiMastercard } from "react-icons/si";
import {
  CheckCircle,
  CreditCard,
  Shield,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  Briefcase,
  Building2,
  ShoppingBag,
  Clock,
  Lock,
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

export default function ShopCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [buyingForOther, setBuyingForOther] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [tipoFatturazione, setTipoFatturazione] = useState<"privato" | "professionista" | "azienda">("privato");
  const [codiceFiscale, setCodiceFiscale] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [cap, setCap] = useState("");
  const [citta, setCitta] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ragioneSociale, setRagioneSociale] = useState("");
  const [partitaIva, setPartitaIva] = useState("");
  const [codiceSdi, setCodiceSdi] = useState("");
  const [pec, setPec] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState<"details" | "billing" | "payment" | "success">("details");
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalInitialized = useRef(false);

  const effectivePrice = product ? getEffectivePrice(product, selectedOptions) : "0";
  const hasRequiredOptions = product?.options
    ? product.options.every((opt) => selectedOptions[opt.name])
    : true;

  const purchaseMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", "/api/shop/purchase", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.customerToken) {
          localStorage.setItem("shop_customer_token", data.customerToken);
        }
        setStep("success");
        toast({
          title: "Acquisto completato!",
          description: "Riceverai una conferma via email.",
        });
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

  const createOrder = async () => {
    const response = await fetch("/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: effectivePrice,
        currency: "EUR",
        intent: "CAPTURE",
      }),
    });
    const output = await response.json();
    return { orderId: output.id };
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasRequiredOptions) {
      toast({ title: "Opzioni mancanti", description: "Seleziona tutte le opzioni del corso.", variant: "destructive" });
      return;
    }
    if (!customerFirstName || !customerLastName || !customerEmail) {
      toast({ title: "Campi obbligatori", description: "Inserisci nome, cognome e email.", variant: "destructive" });
      return;
    }
    if (buyingForOther && (!studentFirstName.trim() || !studentLastName.trim())) {
      toast({ title: "Dati studente obbligatori", description: "Inserisci nome e cognome dello studente.", variant: "destructive" });
      return;
    }
    if (buyingForOther && studentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      toast({ title: "Email studente non valida", description: "Inserisci un indirizzo email valido per lo studente.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      toast({ title: "Email non valida", description: "Inserisci un indirizzo email valido.", variant: "destructive" });
      return;
    }
    if (customerPassword && customerPassword.length < 6) {
      toast({ title: "Password troppo corta", description: "La password deve avere almeno 6 caratteri.", variant: "destructive" });
      return;
    }
    setStep("billing");
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codiceFiscale || !indirizzo || !cap || !citta || !provincia) {
      toast({ title: "Campi obbligatori", description: "Compila tutti i campi di fatturazione obbligatori.", variant: "destructive" });
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
        toast({ title: "SDI o PEC obbligatorio", description: "Inserisci il Codice SDI oppure la PEC.", variant: "destructive" });
        return;
      }
    }
    if (tipoFatturazione === "azienda") {
      if (!ragioneSociale) {
        toast({ title: "Ragione Sociale obbligatoria", description: "Inserisci la Ragione Sociale.", variant: "destructive" });
        return;
      }
      if (!partitaIva) {
        toast({ title: "Partita IVA obbligatoria", description: "Inserisci la Partita IVA.", variant: "destructive" });
        return;
      }
      if (!codiceSdi && !pec) {
        toast({ title: "SDI o PEC obbligatorio", description: "Inserisci il Codice SDI oppure la PEC.", variant: "destructive" });
        return;
      }
    }
    if (cap.length !== 5) {
      toast({ title: "CAP non valido", description: "Il CAP deve essere di 5 cifre.", variant: "destructive" });
      return;
    }
    if (provincia.length !== 2) {
      toast({ title: "Provincia non valida", description: "Inserisci la sigla (es. VI, MI, RM).", variant: "destructive" });
      return;
    }
    if (!acceptTerms) {
      toast({ title: "Termini e Condizioni", description: "Devi accettare i Termini e Condizioni per procedere.", variant: "destructive" });
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
                const optionsSummary = Object.entries(selectedOptions)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ");
                purchaseMutation.mutate({
                  paypalOrderId: data.orderId,
                  productSlug: product!.slug,
                  selectedOptions: JSON.stringify(selectedOptions),
                  customerFirstName,
                  customerLastName,
                  customerEmail,
                  customerPhone,
                  customerPassword,
                  studentFirstName: buyingForOther ? studentFirstName : "",
                  studentLastName: buyingForOther ? studentLastName : "",
                  studentEmail: buyingForOther ? studentEmail : "",
                  codiceFiscale,
                  billingCodiceFiscale: codiceFiscale,
                  billingIndirizzo: indirizzo,
                  billingCap: cap,
                  billingCitta: citta,
                  billingProvincia: provincia,
                  billingPartitaIva: partitaIva,
                  billingCodiceSdi: codiceSdi,
                  billingPec: pec,
                  notes: optionsSummary ? `[${optionsSummary}] ${notes}` : notes,
                });
              } else {
                setProcessing(false);
                toast({
                  title: "Pagamento non completato",
                  description: "Il pagamento non è stato completato. Riprova.",
                  variant: "destructive",
                });
              }
            } catch {
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

        const paypalButton = document.getElementById("shop-paypal-button");
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
        console.error("Failed to initialize PayPal:", e);
      }
    };

    loadPayPalSDK();
  }, [step]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Prodotto non trovato</h1>
            <Button onClick={() => setLocation("/shop")} data-testid="button-back-shop">
              Torna allo Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stepLabels = [
    { key: "details", label: "Dati Personali", num: 1 },
    { key: "billing", label: "Fatturazione", num: 2 },
    { key: "payment", label: "Pagamento", num: 3 },
  ];

  const currentStepNum = step === "details" ? 1 : step === "billing" ? 2 : step === "payment" ? 3 : 4;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {step !== "success" && (
            <>
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-3">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Checkout
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-checkout-title">
                  Acquista: {product.name}
                </h1>
              </div>

              <div className="flex items-center justify-center gap-2 mb-10">
                {stepLabels.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      currentStepNum >= s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <span>{s.num}</span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`w-8 h-0.5 ${currentStepNum > s.num ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {step !== "success" && (
              <div className="lg:col-span-1 order-first lg:order-last">
                <Card className="sticky top-32">
                  <CardContent className="p-5">
                    <h3 className="font-bold mb-3">Riepilogo Ordine</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{product.duration}</span>
                      </div>
                      <ul className="space-y-1">
                        {product.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-primary shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      {product.options && Object.keys(selectedOptions).length > 0 && (
                        <div className="space-y-1 text-xs text-muted-foreground border-t pt-2">
                          {Object.entries(selectedOptions).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{product.options!.find(o => o.name === key)?.label || key}:</span>
                              <span className="font-medium text-foreground">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">Totale</span>
                          <div>
                            <span className="text-2xl font-bold text-primary">&euro;{parseFloat(effectivePrice).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <SiPaypal className="w-8 h-5 text-[#003087]" />
                        <SiVisa className="w-8 h-5 text-[#1A1F71]" />
                        <SiMastercard className="w-8 h-5 text-[#EB001B]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Pagamento sicuro e protetto</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className={step !== "success" ? "lg:col-span-2" : "lg:col-span-3"}>
              {step === "details" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Dati Personali</h2>
                        <p className="text-sm text-muted-foreground">Inserisci i tuoi dati di contatto</p>
                      </div>
                    </div>
                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      {product.options && product.options.length > 0 && (
                        <div className="space-y-4 pb-4 border-b">
                          <p className="text-sm font-medium text-muted-foreground">Configura il tuo corso</p>
                          {product.options.map((opt) => (
                            <div key={opt.name}>
                              <Label htmlFor={`option-${opt.name}`}>{opt.label} *</Label>
                              <Select
                                value={selectedOptions[opt.name] || ""}
                                onValueChange={(val) =>
                                  setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))
                                }
                              >
                                <SelectTrigger className="mt-1" id={`option-${opt.name}`} data-testid={`select-option-${opt.name}`}>
                                  <SelectValue placeholder={`Seleziona ${opt.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {opt.values.map((v) => (
                                    <SelectItem key={v} value={v} data-testid={`option-${opt.name}-${v}`}>
                                      {v}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                          {product.variations && product.variations.length > 0 && (
                            <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between">
                              <span className="text-sm font-medium">Prezzo</span>
                              <span className="text-xl font-bold text-primary">&euro;{parseFloat(effectivePrice).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="customerFirstName">Nome *</Label>
                          <Input
                            id="customerFirstName"
                            value={customerFirstName}
                            onChange={(e) => setCustomerFirstName(e.target.value)}
                            className="mt-1"
                            data-testid="input-customer-first-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerLastName">Cognome *</Label>
                          <Input
                            id="customerLastName"
                            value={customerLastName}
                            onChange={(e) => setCustomerLastName(e.target.value)}
                            className="mt-1"
                            data-testid="input-customer-last-name"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="customerEmail">Email *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="mt-1"
                          data-testid="input-customer-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerPhone">Telefono</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="mt-1"
                          data-testid="input-customer-phone"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id="buyingForOther"
                          checked={buyingForOther}
                          onCheckedChange={(checked) => {
                            setBuyingForOther(checked === true);
                            if (!checked) {
                              setStudentFirstName("");
                              setStudentLastName("");
                              setStudentEmail("");
                            }
                          }}
                          data-testid="checkbox-buying-for-other"
                        />
                        <Label htmlFor="buyingForOther" className="text-sm cursor-pointer">
                          Il corso è per un'altra persona
                        </Label>
                      </div>
                      {buyingForOther && (
                        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="studentFirstName">Nome studente *</Label>
                              <Input
                                id="studentFirstName"
                                value={studentFirstName}
                                onChange={(e) => setStudentFirstName(e.target.value)}
                                placeholder="Nome"
                                className="mt-1"
                                data-testid="input-student-first-name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="studentLastName">Cognome studente *</Label>
                              <Input
                                id="studentLastName"
                                value={studentLastName}
                                onChange={(e) => setStudentLastName(e.target.value)}
                                placeholder="Cognome"
                                className="mt-1"
                                data-testid="input-student-last-name"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="studentEmail">Email studente</Label>
                            <Input
                              id="studentEmail"
                              type="email"
                              value={studentEmail}
                              onChange={(e) => setStudentEmail(e.target.value)}
                              placeholder="Email dello studente"
                              className="mt-1"
                              data-testid="input-student-email"
                            />
                          </div>
                        </div>
                      )}
                      <div className="border-t pt-4 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-primary" />
                          <Label htmlFor="customerPassword" className="font-medium">Crea il tuo account</Label>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Inserisci una password per accedere alla tua area clienti dopo l'acquisto, dove troverai i materiali del corso.
                        </p>
                        <Input
                          id="customerPassword"
                          type="password"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          placeholder="Minimo 6 caratteri"
                          className="mt-1"
                          data-testid="input-customer-password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Note aggiuntive</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="Livello attuale, obiettivi, orari preferiti..."
                          className="mt-1"
                          data-testid="input-notes"
                        />
                      </div>
                      <Button type="submit" className="w-full" data-testid="button-next-billing">
                        Continua
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "billing" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Dati di Fatturazione</h2>
                        <p className="text-sm text-muted-foreground">Per la fattura fiscale</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                      {[
                        { key: "privato" as const, label: "Privato", icon: User },
                        { key: "professionista" as const, label: "Professionista", icon: Briefcase },
                        { key: "azienda" as const, label: "Azienda", icon: Building2 },
                      ].map(({ key, label, icon: Icon }) => (
                        <Button
                          key={key}
                          type="button"
                          variant={tipoFatturazione === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTipoFatturazione(key)}
                          className="flex-1"
                          data-testid={`button-billing-${key}`}
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          {label}
                        </Button>
                      ))}
                    </div>

                    <form onSubmit={handleBillingSubmit} className="space-y-4">
                      {tipoFatturazione === "azienda" && (
                        <div>
                          <Label htmlFor="ragioneSociale">Ragione Sociale *</Label>
                          <Input id="ragioneSociale" value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} className="mt-1" data-testid="input-ragione-sociale" />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                        <Input id="codiceFiscale" value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())} maxLength={16} className="mt-1" data-testid="input-codice-fiscale" />
                      </div>

                      {(tipoFatturazione === "professionista" || tipoFatturazione === "azienda") && (
                        <>
                          <div>
                            <Label htmlFor="partitaIva">Partita IVA *</Label>
                            <Input id="partitaIva" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} className="mt-1" data-testid="input-partita-iva" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="codiceSdi">Codice SDI</Label>
                              <Input id="codiceSdi" value={codiceSdi} onChange={(e) => setCodiceSdi(e.target.value.toUpperCase())} maxLength={7} className="mt-1" data-testid="input-codice-sdi" />
                            </div>
                            <div>
                              <Label htmlFor="pec">PEC</Label>
                              <Input id="pec" type="email" value={pec} onChange={(e) => setPec(e.target.value)} className="mt-1" data-testid="input-pec" />
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor="indirizzo">Indirizzo *</Label>
                        <Input id="indirizzo" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} className="mt-1" data-testid="input-indirizzo" />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cap">CAP *</Label>
                          <Input id="cap" value={cap} onChange={(e) => setCap(e.target.value)} maxLength={5} className="mt-1" data-testid="input-cap" />
                        </div>
                        <div>
                          <Label htmlFor="citta">Città *</Label>
                          <Input id="citta" value={citta} onChange={(e) => setCitta(e.target.value)} className="mt-1" data-testid="input-citta" />
                        </div>
                        <div>
                          <Label htmlFor="provincia">Prov. *</Label>
                          <Input id="provincia" value={provincia} onChange={(e) => setProvincia(e.target.value.toUpperCase())} maxLength={2} placeholder="VI" className="mt-1" data-testid="input-provincia" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl border bg-muted/30">
                        <Checkbox
                          id="acceptTerms"
                          checked={acceptTerms}
                          onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                          data-testid="checkbox-accept-terms"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
                          Ho letto e accetto i{" "}
                          <a href="/termini-e-condizioni" className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                            Termini e Condizioni
                          </a>{" "}
                          di vendita di Interlingua Formazione S.r.l. *
                        </Label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setStep("details")} data-testid="button-back-details">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Indietro
                        </Button>
                        <Button type="submit" className="flex-1" data-testid="button-next-payment">
                          Continua al Pagamento
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Pagamento</h2>
                        <p className="text-sm text-muted-foreground">Paga con PayPal, Visa o Mastercard</p>
                      </div>
                    </div>

                    {processing ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-lg font-medium">Elaborazione in corso...</p>
                        <p className="text-sm text-muted-foreground">Non chiudere questa pagina.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{product.name}</span>
                            <span className="font-medium">&euro;{parseFloat(effectivePrice).toFixed(2)}</span>
                          </div>
                          {Object.keys(selectedOptions).length > 0 && (
                            <div className="space-y-1 text-xs text-muted-foreground">
                              {Object.entries(selectedOptions).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{product.options?.find(o => o.name === key)?.label || key}</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Totale</span>
                            <span className="text-primary">&euro;{parseFloat(effectivePrice).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                          {!paypalReady && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Caricamento PayPal...</span>
                            </div>
                          )}
                          <button
                            id="shop-paypal-button"
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                              paypalReady
                                ? "bg-[#0070ba] hover:bg-[#003087] cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!paypalReady}
                            data-testid="button-paypal-pay"
                          >
                            <SiPaypal className="w-5 h-5" />
                            Paga &euro;{parseFloat(effectivePrice).toFixed(2)} con PayPal
                          </button>
                          <p className="text-xs text-muted-foreground text-center">
                            Puoi pagare con il tuo conto PayPal oppure con carta Visa/Mastercard
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            paypalInitialized.current = false;
                            setStep("billing");
                          }}
                          data-testid="button-back-billing"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Indietro
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === "success" && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3" data-testid="text-success-title">Acquisto Completato!</h2>
                  <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                    Grazie per aver acquistato <strong>{product.name}</strong>.
                  </p>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Riceverai una conferma via email a <strong>{customerEmail}</strong> con tutti i dettagli del corso.
                    Il nostro team ti contatterà per organizzare l'inizio delle lezioni.
                  </p>
                  {customerPassword && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8 max-w-md mx-auto">
                      <p className="text-sm font-medium mb-1">Il tuo account è stato creato!</p>
                      <p className="text-xs text-muted-foreground">
                        Accedi alla tua <strong>Area Clienti</strong> per visualizzare i corsi acquistati e scaricare i materiali didattici.
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {customerPassword && (
                      <Button onClick={() => setLocation("/shop/dashboard")} data-testid="button-go-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Area Clienti
                      </Button>
                    )}
                    <Button onClick={() => setLocation("/shop")} variant="outline" data-testid="button-continue-shopping">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continua gli Acquisti
                    </Button>
                    <Button onClick={() => setLocation("/")} variant="outline" data-testid="button-home">
                      Torna alla Home
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
