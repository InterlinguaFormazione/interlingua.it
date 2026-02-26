import { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  CreditCard,
  Shield,
  ArrowRight,
  Loader2,
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalInitialized = useRef(false);

  const purchaseMutation = useMutation({
    mutationFn: async (data: { paypalOrderId: string; name: string; email: string; password: string }) => {
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

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Campi obbligatori", description: "Compila tutti i campi.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password troppo corta", description: "La password deve avere almeno 6 caratteri.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password non coincidono", description: "Le password inserite non corrispondono.", variant: "destructive" });
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
                  name,
                  email,
                  password,
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
      <main className="pt-28 pb-20">
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
                        <span className="text-sm text-muted-foreground">52 sessioni all'anno</span>
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
                        <span className="text-sm text-muted-foreground">Moderatore madrelingua</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        <span>Pagamento sicuro via PayPal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Accetta Visa, Mastercard, PayPal</span>
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
                        <div className="space-y-2">
                          <Label htmlFor="purchase-name">Nome e Cognome</Label>
                          <Input
                            id="purchase-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Mario Rossi"
                            required
                            data-testid="input-purchase-name"
                          />
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
                          <Input
                            id="purchase-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimo 6 caratteri"
                            required
                            data-testid="input-purchase-password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="purchase-confirm-password">Conferma Password</Label>
                          <Input
                            id="purchase-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ripeti la password"
                            required
                            data-testid="input-purchase-confirm-password"
                          />
                        </div>
                        <Button type="submit" className="w-full" size="lg" data-testid="button-continue-payment">
                          Continua al pagamento
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === "payment" && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
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
                            <p className="text-sm text-muted-foreground">{name} ({email})</p>
                          </div>
                          <span className="text-2xl font-bold text-foreground" data-testid="text-payment-amount">€200</span>
                        </div>
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
                              setStep("details");
                            }}
                            data-testid="button-back-details"
                          >
                            ← Torna ai dati
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
