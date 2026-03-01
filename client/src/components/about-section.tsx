import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import aboutTeam from "@assets/marketing-vendite-clienti_1771623200419.webp";

const locations = [
  {
    name: "Sede Vicenza",
    address: "Viale Mazzini, 27",
    city: "36100 Vicenza (VI)",
    phone: "+39 0444 321601",
    email: "infocorsi@skillcraft.interlingua.it",
    hours: [
      { days: "Lun - Gio", time: "8:30-12:30 / 15:30-20:00" },
      { days: "Venerdì", time: "8:30-12:30 / 15:30-19:00" },
      { days: "Sab - Dom", time: "Chiuso" },
    ],
  },
  {
    name: "Sede Thiene",
    address: "Corso Garibaldi, 174",
    city: "36016 Thiene (VI)",
    phone: "+39 0445 382744",
    email: "infocorsi@skillcraft.interlingua.it",
    hours: [
      { days: "Lun - Ven", time: "14:00 - 20:00" },
      { days: "Sab - Dom", time: "Chiuso" },
    ],
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/5 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 relative rounded-2xl overflow-hidden">
          <img 
            src={aboutTeam} 
            alt="Il nostro team di formatori" 
            className="w-full h-64 md:h-96 object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <Badge variant="secondary" className="mb-2">Il Nostro Team</Badge>
            <h3 className="text-2xl font-bold drop-shadow-lg text-[#0f0f0f]">Professionisti Dedicati alla Tua Crescita</h3>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent mb-4" />
            <Badge variant="secondary" className="mb-4">
              Chi Siamo
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Due Realtà,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Un'Unica Missione
              </span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">SkillCraft-Interlingua</strong> è il tuo centro 
                di formazione professionale a 360 gradi. Siamo specializzati in <strong className="text-foreground">intelligenza 
                artificiale applicata</strong>, competenze digitali, soft skills, management, crescita personale e lingue straniere.
              </p>
              <p>
                Dal 1993 formiamo persone che vogliono crescere: dalle competenze più innovative 
                come <strong className="text-foreground">AI e automazione</strong>, al 
                <strong className="text-foreground"> digital marketing</strong>, dalla 
                <strong className="text-foreground">leadership</strong> al{" "}
                <strong className="text-foreground">project management</strong>, fino alle lingue straniere.
              </p>
              <p>
                Il nostro approccio combina <strong className="text-foreground">metodologie pratiche 
                e innovative</strong> con docenti esperti in ogni disciplina, per risultati concreti 
                e immediatamente applicabili nella vita personale e professionale.
              </p>
              <p>
                Siamo <strong className="text-foreground">Ente accreditato Regione Veneto</strong>, 
                con sedi a Vicenza e Thiene. Corsi in presenza e online per privati.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-3xl font-extrabold text-primary">30+</span>
                <span className="text-sm font-medium text-muted-foreground">Anni di Esperienza</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-3xl font-extrabold text-accent">4.8</span>
                <span className="text-sm font-medium text-muted-foreground">Stelle su Google</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {locations.map((location, index) => (
              <Card key={index} className="hover-elevate relative" data-testid={`card-location-${index}`}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-md bg-gradient-to-r from-primary to-accent" />
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/10">
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
                    <h4 className="font-medium mb-3">Orari Segreteria</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {location.hours.map((h, i) => (
                        <div key={i} className="contents">
                          <div className="text-muted-foreground">{h.days}</div>
                          <div>{h.time}</div>
                        </div>
                      ))}
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
