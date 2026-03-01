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
import { useLocation, Link } from "wouter";
import { useCart } from "@/lib/cart-context";
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
  ShoppingCart,
  Clock,
  Lock,
  Trash2,
  Plus,
  Minus,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
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

export default function CartCheckout() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState<"cart" | "details" | "billing" | "payment" | "success">("cart");
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalInitialized = useRef(false);

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherOpen, setVoucherOpen] = useState(true);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherResult, setVoucherResult] = useState<{
    valid: boolean;
    discount?: string;
    discountedTotal?: string;
    discountType?: string;
    discountValue?: string;
    message?: string;
  } | null>(null);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");

  const displayTotal = voucherResult?.valid && voucherResult.discountedTotal
    ? parseFloat(voucherResult.discountedTotal)
    : totalPrice;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const productSlugs = items.map(item => item.product.slug);
      const res = await apiRequest("POST", "/api/shop/validate-voucher", {
        code: voucherCode.trim(),
        cartTotal: totalPrice.toFixed(2),
        productSlugs,
      });
      const data = await res.json();
      setVoucherResult(data);
      if (data.valid) {
        setAppliedVoucherCode(voucherCode.trim().toUpperCase());
      }
    } catch {
      setVoucherResult({ valid: false, message: "Errore di connessione. Riprova." });
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherResult(null);
    setAppliedVoucherCode("");
    setVoucherCode("");
  };

  const purchaseMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await apiRequest("POST", "/api/shop/purchase-cart", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.customerToken) {
          localStorage.setItem("shop_customer_token", data.customerToken);
        }
        clearCart();
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
        amount: displayTotal.toFixed(2),
        currency: "EUR",
        intent: "CAPTURE",
      }),
    });
    const output = await response.json();
    return { orderId: output.id };
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerFirstName || !customerLastName || !customerEmail) {
      toast({ title: "Campi obbligatori", description: "Inserisci nome, cognome e email.", variant: "destructive" });
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
    if (customerPassword && customerPassword !== confirmPassword) {
      toast({ title: "Le password non coincidono", description: "La password e la conferma devono essere uguali.", variant: "destructive" });
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
                const cartItems = items.map(item => ({
                  productSlug: item.product.slug,
                  selectedOptions: item.selectedOptions,
                  quantity: item.quantity,
                  unitPrice: item.effectivePrice,
                }));
                purchaseMutation.mutate({
                  paypalOrderId: data.orderId,
                  cartItems: JSON.stringify(cartItems),
                  acceptedTerms: "true",
                  customerFirstName,
                  customerLastName,
                  customerEmail,
                  customerPhone,
                  customerPassword,
                  codiceFiscale,
                  billingCodiceFiscale: codiceFiscale,
                  billingIndirizzo: indirizzo,
                  billingCap: cap,
                  billingCitta: citta,
                  billingProvincia: provincia,
                  billingPartitaIva: partitaIva,
                  billingCodiceSdi: codiceSdi,
                  billingPec: pec,
                  notes,
                  ...(appliedVoucherCode ? { discountCode: appliedVoucherCode } : {}),
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

        const paypalButton = document.getElementById("cart-paypal-button");
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

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-32 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Il carrello è vuoto</h1>
            <p className="text-muted-foreground">Esplora il catalogo e aggiungi i corsi che ti interessano.</p>
            <Link href="/shop">
              <Button data-testid="button-back-shop">Vai allo Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stepLabels = [
    { key: "cart", label: "Carrello", num: 1 },
    { key: "details", label: "Dati Personali", num: 2 },
    { key: "billing", label: "Fatturazione", num: 3 },
    { key: "payment", label: "Pagamento", num: 4 },
  ];

  const currentStepNum = step === "cart" ? 1 : step === "details" ? 2 : step === "billing" ? 3 : step === "payment" ? 4 : 5;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {step !== "success" && (
            <>
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-3">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Checkout Carrello
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-cart-checkout-title">
                  {totalItems} {totalItems === 1 ? "articolo" : "articoli"} nel carrello
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

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {step === "cart" && (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Il tuo carrello
                    </h2>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={`${item.product.slug}-${JSON.stringify(item.selectedOptions)}`} className="rounded-xl border bg-card p-4" data-testid={`checkout-cart-item-${index}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-grow min-w-0">
                              <p className="font-semibold leading-tight" data-testid={`checkout-item-name-${index}`}>
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-0.5">{item.product.category}</p>
                              {Object.keys(item.selectedOptions).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-xs">
                                      {key}: {value}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(index)}
                              data-testid={`button-checkout-remove-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                data-testid={`button-checkout-qty-minus-${index}`}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center" data-testid={`text-checkout-qty-${index}`}>{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                data-testid={`button-checkout-qty-plus-${index}`}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-primary" data-testid={`text-checkout-item-price-${index}`}>
                              &euro;{(parseFloat(item.effectivePrice) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex items-center justify-between">
                      <Link href="/shop">
                        <Button variant="outline" data-testid="button-continue-shopping">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Continua lo shopping
                        </Button>
                      </Link>
                      <Button onClick={() => setStep("details")} data-testid="button-proceed-details">
                        Continua
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "details" && (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-6">
                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        I tuoi dati
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nome *</Label>
                          <Input id="firstName" value={customerFirstName} onChange={(e) => setCustomerFirstName(e.target.value)} required data-testid="input-first-name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Cognome *</Label>
                          <Input id="lastName" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} required data-testid="input-last-name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required data-testid="input-email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefono</Label>
                          <Input id="phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} data-testid="input-phone" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password (per Area Clienti)</Label>
                        <Input id="password" type="password" value={customerPassword} onChange={(e) => setCustomerPassword(e.target.value)} placeholder="Min. 6 caratteri" data-testid="input-password" />
                        <p className="text-xs text-muted-foreground">Crea una password per accedere ai tuoi acquisti</p>
                        {customerPassword && (
                          <div className="mt-2">
                            <Label htmlFor="confirmPassword">Conferma password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Ripeti la password"
                              className="mt-1"
                              data-testid="input-confirm-password"
                            />
                            {confirmPassword && customerPassword !== confirmPassword && (
                              <p className="text-xs text-destructive mt-1">Le password non coincidono</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Note aggiuntive</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Obiettivi, orari preferiti, ecc." rows={3} data-testid="input-notes" />
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep("cart")} data-testid="button-back-cart">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Carrello
                        </Button>
                        <Button type="submit" data-testid="button-proceed-billing">
                          Fatturazione
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "billing" && (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-6">
                    <form onSubmit={handleBillingSubmit} className="space-y-6">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Dati di Fatturazione
                      </h2>
                      <div className="space-y-2">
                        <Label>Tipo fatturazione</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["privato", "professionista", "azienda"] as const).map((tipo) => (
                            <button
                              key={tipo}
                              type="button"
                              onClick={() => setTipoFatturazione(tipo)}
                              className={`p-3 rounded-xl border text-sm font-medium transition-colors text-center capitalize ${
                                tipoFatturazione === tipo
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border hover:border-primary/30"
                              }`}
                              data-testid={`button-tipo-${tipo}`}
                            >
                              {tipo === "privato" && <User className="w-4 h-4 mx-auto mb-1" />}
                              {tipo === "professionista" && <Briefcase className="w-4 h-4 mx-auto mb-1" />}
                              {tipo === "azienda" && <Building2 className="w-4 h-4 mx-auto mb-1" />}
                              {tipo}
                            </button>
                          ))}
                        </div>
                      </div>

                      {tipoFatturazione === "azienda" && (
                        <div className="space-y-2">
                          <Label htmlFor="ragioneSociale">Ragione Sociale *</Label>
                          <Input id="ragioneSociale" value={ragioneSociale} onChange={(e) => setRagioneSociale(e.target.value)} data-testid="input-ragione-sociale" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                          <Input id="codiceFiscale" value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value.toUpperCase())} maxLength={16} data-testid="input-codice-fiscale" />
                        </div>
                        {(tipoFatturazione === "professionista" || tipoFatturazione === "azienda") && (
                          <div className="space-y-2">
                            <Label htmlFor="partitaIva">Partita IVA *</Label>
                            <Input id="partitaIva" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} data-testid="input-partita-iva" />
                          </div>
                        )}
                      </div>

                      {(tipoFatturazione === "professionista" || tipoFatturazione === "azienda") && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="codiceSdi">Codice SDI</Label>
                            <Input id="codiceSdi" value={codiceSdi} onChange={(e) => setCodiceSdi(e.target.value)} placeholder="7 caratteri" data-testid="input-codice-sdi" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pec">PEC</Label>
                            <Input id="pec" type="email" value={pec} onChange={(e) => setPec(e.target.value)} data-testid="input-pec" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="indirizzo">Indirizzo *</Label>
                        <Input id="indirizzo" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} data-testid="input-indirizzo" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cap">CAP *</Label>
                          <Input id="cap" value={cap} onChange={(e) => setCap(e.target.value)} maxLength={5} data-testid="input-cap" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="citta">Città *</Label>
                          <Input id="citta" value={citta} onChange={(e) => setCitta(e.target.value)} data-testid="input-citta" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="provincia">Provincia *</Label>
                          <Input id="provincia" value={provincia} onChange={(e) => setProvincia(e.target.value.toUpperCase())} maxLength={2} placeholder="es. VI" data-testid="input-provincia" />
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
                          <Link href="/termini-e-condizioni" className="text-primary underline hover:no-underline" target="_blank">
                            Termini e Condizioni
                          </Link>{" "}
                          di vendita di Interlingua Formazione S.r.l. *
                        </Label>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setStep("details")} data-testid="button-back-details">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Dati Personali
                        </Button>
                        <Button type="submit" data-testid="button-proceed-payment">
                          Pagamento
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-6 space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pagamento
                    </h2>

                    <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">{totalItems} {totalItems === 1 ? "articolo" : "articoli"}</span>
                        {voucherResult?.valid ? (
                          <div className="text-right">
                            <span className="text-sm line-through text-muted-foreground">&euro;{totalPrice.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-primary ml-2" data-testid="text-payment-total">&euro;{displayTotal.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-primary" data-testid="text-payment-total">&euro;{totalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      {voucherResult?.valid && voucherResult.discount && (
                        <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Sconto ({appliedVoucherCode})
                          </span>
                          <span>-&euro;{parseFloat(voucherResult.discount).toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Pagamento sicuro tramite PayPal</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <SiPaypal className="w-8 h-8 text-[#003087]" />
                        <SiVisa className="w-8 h-6 text-[#1a1f71]" />
                        <SiMastercard className="w-8 h-6 text-[#eb001b]" />
                      </div>
                    </div>

                    {processing ? (
                      <div className="flex flex-col items-center gap-3 py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Elaborazione del pagamento in corso...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          id="cart-paypal-button"
                          className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                            paypalReady
                              ? "bg-[#0070ba] hover:bg-[#003087] cursor-pointer shadow-lg hover:shadow-xl"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          disabled={!paypalReady}
                          data-testid="button-paypal-cart"
                        >
                          {paypalReady ? (
                            <span className="flex items-center justify-center gap-2">
                              <Lock className="w-4 h-4" />
                              Paga &euro;{displayTotal.toFixed(2)} con PayPal
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Caricamento PayPal...
                            </span>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button type="button" variant="outline" onClick={() => { setStep("billing"); paypalInitialized.current = false; setPaypalReady(false); }} data-testid="button-back-billing">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Fatturazione
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "success" && (
                <Card className="border-border/50 shadow-lg">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2" data-testid="text-success-title">Acquisto Completato!</h2>
                      <p className="text-muted-foreground">
                        Grazie per il tuo acquisto. Riceverai una conferma via email con tutti i dettagli.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/shop">
                        <Button variant="outline" data-testid="button-back-to-shop">
                          Torna allo Shop
                        </Button>
                      </Link>
                      <Link href="/shop/dashboard">
                        <Button data-testid="button-go-dashboard">
                          Area Clienti
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {step !== "success" && (
              <div className="md:col-span-1">
                <Card className="border-border/50 shadow-lg sticky top-32">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Riepilogo Ordine
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-start justify-between gap-2 text-sm">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.product.name}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                            )}
                          </div>
                          <p className="font-semibold whitespace-nowrap">&euro;{(parseFloat(item.effectivePrice) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 space-y-3">
                      <button
                        type="button"
                        onClick={() => setVoucherOpen(!voucherOpen)}
                        className="flex items-center justify-between w-full text-sm text-muted-foreground"
                        data-testid="button-toggle-voucher"
                      >
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          Hai un codice sconto?
                        </span>
                        {voucherOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {voucherOpen && (
                        <div className="space-y-2">
                          {voucherResult?.valid && appliedVoucherCode ? (
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="secondary" className="text-xs" data-testid="badge-voucher-applied">
                                <Tag className="w-3 h-3 mr-1" />
                                {appliedVoucherCode}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleRemoveVoucher}
                                data-testid="button-remove-voucher"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Input
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                placeholder="Codice sconto"
                                className="text-xs"
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyVoucher(); } }}
                                data-testid="input-voucher-code"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleApplyVoucher}
                                disabled={voucherLoading || !voucherCode.trim()}
                                data-testid="button-apply-voucher"
                              >
                                {voucherLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Applica"}
                              </Button>
                            </div>
                          )}
                          {voucherResult && (
                            <p className={`text-xs ${voucherResult.valid ? "text-green-600 dark:text-green-400" : "text-destructive"}`} data-testid="text-voucher-message">
                              {voucherResult.message}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={voucherResult?.valid ? "text-sm text-muted-foreground" : "font-bold"}>
                          {voucherResult?.valid ? "Subtotale" : "Totale"}
                        </span>
                        <span className={`${voucherResult?.valid ? "text-sm line-through text-muted-foreground" : "text-xl font-bold text-primary"}`} data-testid="text-summary-total">
                          &euro;{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      {voucherResult?.valid && voucherResult.discount && (
                        <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                          <span className="text-sm">Sconto</span>
                          <span className="text-sm font-medium">-&euro;{parseFloat(voucherResult.discount).toFixed(2)}</span>
                        </div>
                      )}
                      {voucherResult?.valid && (
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Totale</span>
                          <span className="text-xl font-bold text-primary" data-testid="text-discounted-total">
                            &euro;{displayTotal.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        Pagamento sicuro
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Accesso immediato
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
