import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { Send, Loader2, CheckCircle2, MessageSquare, Calendar, Headphones, Sparkles, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema, type InsertContact } from "@shared/schema";

const contactFormSchema = insertContactSchema.extend({
  name: insertContactSchema.shape.name.min(2, "Il nome deve avere almeno 2 caratteri"),
  message: insertContactSchema.shape.message.min(10, "Il messaggio deve avere almeno 10 caratteri"),
});

type ContactFormData = InsertContact;

const contactOptions = [
  {
    icon: MessageSquare,
    title: "Scrivici",
    description: "infocorsi@skillcraft.interlingua.it",
    action: "Invia email",
  },
  {
    icon: Calendar,
    title: "Prenota una Call",
    description: "Consulenza gratuita",
    action: "Prenota",
  },
  {
    icon: Headphones,
    title: "Chiamaci",
    description: "Lun-Ven 9:00-18:00",
    action: "+39 0444 321601",
  },
];

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [gdprError, setGdprError] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formLoadTime = useRef(Date.now());
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseInterest: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", {
        ...data,
        _hp: honeypot,
        _ts: formLoadTime.current,
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Messaggio inviato!",
        description: "Ti ricontatteremo al più presto.",
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

  const onSubmit = (data: ContactFormData) => {
    if (!gdprAccepted) {
      setGdprError(true);
      return;
    }
    setGdprError(false);
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/[0.06] dark:bg-primary/[0.04] blur-[100px] pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-accent/[0.06] dark:bg-accent/[0.04] blur-[100px] pointer-events-none"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4" />
          <Badge variant="secondary" className="mb-4">
            Contattaci
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Inizia il Tuo{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Percorso
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compila il form o contattaci direttamente. Siamo qui per aiutarti a raggiungere i tuoi obiettivi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-md bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
              <Card className="relative h-full shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="relative mb-6"
                      >
                        <div className="absolute inset-0 rounded-full bg-green-400/20 dark:bg-green-400/10 blur-xl scale-150" />
                        <div className="relative p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold mb-2"
                      >
                        Grazie!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground mb-6"
                      >
                        Abbiamo ricevuto il tuo messaggio. Ti ricontatteremo presto!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button onClick={() => setIsSubmitted(false)} variant="outline">
                          Invia un altro messaggio
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}>
                          <label htmlFor="website_url">Website</label>
                          <input
                            type="text"
                            id="website_url"
                            name="website_url"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Mario Rossi" 
                                    {...field} 
                                    data-testid="input-contact-name"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="mario@email.com" 
                                    {...field}
                                    data-testid="input-contact-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefono</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="tel" 
                                    placeholder="+39 123 456 7890" 
                                    {...field}
                                    value={field.value ?? ""}
                                    data-testid="input-contact-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="courseInterest"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Corso di Interesse</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-course-interest">
                                      <SelectValue placeholder="Seleziona un corso" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="AI & Competenze Digitali">AI & Competenze Digitali</SelectItem>
                                    <SelectItem value="Management & Organizzazione">Management & Organizzazione</SelectItem>
                                    <SelectItem value="Competenze Trasversali">Competenze Trasversali</SelectItem>
                                    <SelectItem value="Business & Strategia">Business & Strategia</SelectItem>
                                    <SelectItem value="Formazione Esperienziale">Formazione Esperienziale</SelectItem>
                                    <SelectItem value="Lingue e Interculturalità">Lingue e Interculturalità</SelectItem>
                                    <SelectItem value="Altro">Altro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Messaggio *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Raccontaci i tuoi obiettivi e come possiamo aiutarti..."
                                  className="min-h-32 resize-none"
                                  {...field}
                                  data-testid="textarea-contact-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="contact-gdpr"
                            checked={gdprAccepted}
                            onCheckedChange={(checked) => { setGdprAccepted(checked === true); if (checked) setGdprError(false); }}
                            data-testid="checkbox-contact-gdpr"
                          />
                          <label htmlFor="contact-gdpr" className={`text-sm leading-snug cursor-pointer ${gdprError ? "text-destructive" : "text-muted-foreground"}`}>
                            Acconsento al{" "}
                            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">trattamento dei dati personali</a>{" "}
                            ai sensi del GDPR (Reg. UE 2016/679) *
                          </label>
                        </div>
                        {gdprError && <p className="text-xs text-destructive ml-7">Devi accettare il trattamento dei dati personali</p>}

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full relative overflow-visible"
                          disabled={mutation.isPending}
                          data-testid="button-contact-submit"
                        >
                          {mutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Invio in corso...
                            </>
                          ) : (
                            <>
                              Invia Richiesta
                              <Send className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card 
                  className="hover-elevate cursor-pointer group"
                  data-testid={`card-contact-option-${index}`}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ visibility: "visible" }} />
                      <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/10 transition-colors duration-300">
                        <option.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{option.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{option.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-sm font-medium text-primary">{option.action}</span>
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ visibility: "visible" }} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-primary via-primary/90 to-accent text-white border-0 relative overflow-visible">
                <div className="absolute inset-0 rounded-md bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
                <div className="absolute inset-0 rounded-md bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
                <motion.div
                  className="absolute -top-3 -right-3 p-2 rounded-full bg-accent shadow-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2">Test di Livello Gratuito</h3>
                  <p className="text-white/80 mb-4">
                    Scopri il tuo livello attuale con un test gratuito e ricevi consigli personalizzati.
                  </p>
                  <Link href="/english-test">
                    <Button 
                      variant="secondary" 
                      className="w-full bg-primary-foreground text-primary"
                      data-testid="button-free-test"
                    >
                      Fai il Test Ora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
