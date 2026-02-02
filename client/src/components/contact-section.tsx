import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, MessageSquare, Calendar, Headphones } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    title: "Chat con Noi",
    description: "Risposta immediata",
    action: "Scrivi ora",
  },
  {
    icon: Calendar,
    title: "Prenota una Call",
    description: "Consulenza gratuita",
    action: "Prenota",
  },
  {
    icon: Headphones,
    title: "Supporto Telefonico",
    description: "Lun-Ven 9:00-18:00",
    action: "+39 02 1234 5678",
  },
];

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
      const response = await apiRequest("POST", "/api/contact", data);
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
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
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
            <Card className="h-full">
              <CardContent className="p-6 sm:p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                      <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Grazie!</h3>
                    <p className="text-muted-foreground mb-6">
                      Abbiamo ricevuto il tuo messaggio. Ti ricontatteremo presto!
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Invia un altro messaggio
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                  <SelectItem value="inglese">Inglese</SelectItem>
                                  <SelectItem value="tedesco">Tedesco</SelectItem>
                                  <SelectItem value="italiano">Italiano per Stranieri</SelectItem>
                                  <SelectItem value="digital">Competenze Digitali</SelectItem>
                                  <SelectItem value="speaking">Public Speaking</SelectItem>
                                  <SelectItem value="personal">Sviluppo Personale</SelectItem>
                                  <SelectItem value="altro">Altro</SelectItem>
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

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactOptions.map((option, index) => (
              <Card 
                key={option.title} 
                className="hover-elevate cursor-pointer"
                data-testid={`card-contact-option-${index}`}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{option.action}</span>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-primary to-accent text-white border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Test di Livello Gratuito</h3>
                <p className="text-white/80 mb-4">
                  Scopri il tuo livello attuale con un test gratuito e ricevi consigli personalizzati.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-primary-foreground text-primary"
                  data-testid="button-free-test"
                >
                  Fai il Test Ora
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
