import { useState } from "react";
import { Phone, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const agents = [
  {
    name: "Giulia",
    role: "Vicenza, Corsi online e Traduzioni",
    number: "393332084517",
    image: "/images/team/giulia-vicenza.webp",
  },
  {
    name: "Elena",
    role: "Thiene e Corsi online",
    number: "393333216902",
    image: "/images/team/elena-thiene.webp",
  },
  {
    name: "Giulia",
    role: "Formazione Corporate",
    number: "393474323542",
    image: "/images/team/giulia-corporate.webp",
  },
  {
    name: "Michela",
    role: "Formazione Corporate",
    number: "393332084508",
    image: "/images/team/michela-corporate.webp",
  },
];

export function MobileCTA() {
  const [showAgents, setShowAgents] = useState(false);

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <>
      <AnimatePresence>
        {showAgents && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-14 left-0 right-0 z-40 md:hidden bg-background border-t border-border rounded-t-2xl shadow-2xl"
          >
            <div className="bg-[#25D366] text-white px-4 py-2.5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <SiWhatsapp className="w-4 h-4" />
                <span className="font-semibold text-sm">Scrivi su WhatsApp</span>
              </div>
              <button onClick={() => setShowAgents(false)} data-testid="button-close-mobile-agents">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {agents.map((agent, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${agent.number}?text=Ciao!%20Vorrei%20informazioni%20sui%20vostri%20corsi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors"
                  data-testid={`link-mobile-whatsapp-agent-${i}`}
                >
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground leading-tight truncate">{agent.role}</p>
                  </div>
                  <SiWhatsapp className="w-5 h-5 text-[#25D366] shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 p-2 flex items-center gap-2">
        <Button
          className="flex-1 gap-2"
          onClick={scrollToContact}
          data-testid="button-mobile-contact"
        >
          <Phone className="w-4 h-4" />
          Contattaci
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-[#25D366] text-[#25D366] px-4"
          onClick={() => setShowAgents(!showAgents)}
          data-testid="button-mobile-whatsapp"
        >
          <SiWhatsapp className="w-5 h-5" />
          WhatsApp
        </Button>
      </div>
    </>
  );
}
