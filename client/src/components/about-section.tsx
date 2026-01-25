import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import aboutTeam from "@/assets/images/about-team.jpg";

const locations = [
  {
    name: "Sede Principale",
    address: "Via della Formazione, 42",
    city: "Milano, MI 20121",
    phone: "+39 02 1234 5678",
    email: "info@skillcraft-interlingua.it",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 relative rounded-2xl overflow-hidden">
          <img 
            src={aboutTeam} 
            alt="Il nostro team di formatori" 
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge variant="secondary" className="mb-2">Il Nostro Team</Badge>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">Professionisti Dedicati alla Tua Crescita</h3>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              Chi Siamo
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Due Realtà, Una{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Visione
              </span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">SkillCraft-Interlingua</strong> nasce 
                dall'unione di due eccellenze nel campo della formazione: 
                Interlingua Formazione e SkillCraft.
              </p>
              <p>
                Da oltre 15 anni, <strong className="text-foreground">Interlingua</strong> è 
                sinonimo di eccellenza nell'insegnamento delle lingue, con un metodo 
                consolidato che ha formato migliaia di studenti.
              </p>
              <p>
                <strong className="text-foreground">SkillCraft</strong> porta l'innovazione 
                digitale e le competenze trasversali, creando percorsi formativi 
                all'avanguardia per il mondo moderno.
              </p>
              <p>
                Insieme, offriamo un'esperienza formativa completa e personalizzata, 
                pensata per chi vuole crescere professionalmente e personalmente.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                <span className="text-2xl font-bold text-primary">15+</span>
                <span className="text-sm text-muted-foreground">Anni di Esperienza</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10">
                <span className="text-2xl font-bold text-accent">5000+</span>
                <span className="text-sm text-muted-foreground">Studenti Formati</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {locations.map((location, index) => (
              <Card key={index} className="hover-elevate" data-testid="card-location">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">Centro di Formazione</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{location.address}</p>
                        <p className="text-sm text-muted-foreground">{location.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={`tel:${location.phone.replace(/\s/g, "")}`}
                        className="font-medium hover:text-primary transition-colors"
                        data-testid="link-phone"
                      >
                        {location.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a 
                        href={`mailto:${location.email}`}
                        className="font-medium hover:text-primary transition-colors"
                        data-testid="link-email"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Orari di Apertura</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Lun - Ven</div>
                      <div>09:00 - 20:00</div>
                      <div className="text-muted-foreground">Sabato</div>
                      <div>09:00 - 13:00</div>
                      <div className="text-muted-foreground">Domenica</div>
                      <div>Chiuso</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
