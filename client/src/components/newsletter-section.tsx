import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Loader2, CheckCircle2, ArrowRight, Users, Shield, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";

const newsletterFormSchema = insertNewsletterSchema.extend({
  email: insertNewsletterSchema.shape.email,
});

type NewsletterFormData = InsertNewsletter;

const trustIndicators = [
  { icon: Users, label: "2.500+ iscritti", testId: "text-newsletter-subscribers" },
  { icon: Shield, label: "Privacy garantita", testId: "text-newsletter-privacy" },
  { icon: Sparkles, label: "Contenuti esclusivi", testId: "text-newsletter-exclusive" },
];

export function NewsletterSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [gdprError, setGdprError] = useState(false);
  const formLoadTime = useRef(Date.now());
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const hpField = document.getElementById("nl_hp_field") as HTMLInputElement | null;
      const response = await apiRequest("POST", "/api/newsletter", {
        ...data,
        _hp: hpField?.value || "",
        _ts: formLoadTime.current,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Iscrizione completata!",
        description: "Riceverai le nostre ultime novità.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    if (!gdprAccepted) {
      setGdprError(true);
      return;
    }
    setGdprError(false);
    mutation.mutate(data);
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
            animate={{
              x: [0, 40, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none"
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-[shimmer_3s_ease-in-out_infinite]" style={{ backgroundSize: "200% 100%" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20"
            animate={{ boxShadow: ["0 0 20px rgba(255,255,255,0.1)", "0 0 40px rgba(255,255,255,0.2)", "0 0 20px rgba(255,255,255,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Mail className="h-7 w-7 text-white" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Resta Aggiornato
          </h2>
          <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto leading-relaxed">
            Iscriviti alla newsletter per ricevere novità sui corsi, offerte esclusive e consigli per la tua formazione.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="p-3 rounded-full bg-white/20"
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white font-semibold text-xl"
              >
                Grazie per l'iscrizione!
              </motion.span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/70 text-sm"
              >
                Controlla la tua casella email per confermare.
              </motion.p>
            </motion.div>
          ) : (
            <>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-3 max-w-lg mx-auto"
                >
                  <div style={{ overflow: "hidden", height: 0, width: 0, margin: 0, padding: 0 }} aria-hidden="true">
                    <input
                      type="text"
                      id="nl_hp_field"
                      name="nl_hp_field"
                      tabIndex={-1}
                      autoComplete="new-password"
                      defaultValue=""
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nome"
                              className="h-14 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 backdrop-blur-sm shadow-lg shadow-black/10"
                              data-testid="input-newsletter-firstname"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-white/80" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Cognome"
                              className="h-14 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 backdrop-blur-sm shadow-lg shadow-black/10"
                              data-testid="input-newsletter-lastname"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-white/80" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="La tua email"
                            className="h-14 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 backdrop-blur-sm shadow-lg shadow-black/10"
                            {...field}
                            data-testid="input-newsletter-email"
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="h-14 text-base rounded-xl bg-primary-foreground text-primary shadow-lg shadow-black/10"
                    disabled={mutation.isPending}
                    data-testid="button-newsletter-submit"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Iscriviti
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  </div>
                </form>
              </Form>

              <div className="flex items-start gap-3 max-w-lg mx-auto mt-4">
                <Checkbox
                  id="newsletter-gdpr"
                  checked={gdprAccepted}
                  onCheckedChange={(checked) => { setGdprAccepted(checked === true); if (checked) setGdprError(false); }}
                  className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-primary mt-0.5"
                  data-testid="checkbox-newsletter-gdpr"
                />
                <label htmlFor="newsletter-gdpr" className={`text-sm leading-snug cursor-pointer ${gdprError ? "text-red-300" : "text-white/70"}`}>
                  Acconsento al{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white underline hover:no-underline">trattamento dei dati personali</a>{" "}
                  ai sensi del GDPR (Reg. UE 2016/679) *
                </label>
              </div>
              {gdprError && <p className="text-xs text-red-300 mt-1 text-center">Devi accettare il trattamento dei dati personali</p>}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-6 mt-8"
              >
                {trustIndicators.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-2 text-white/70"
                    data-testid={item.testId}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              <p className="mt-4 text-sm text-white/50">Nessuno spam, solo contenuti utili</p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
