import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const agents = [
  {
    name: "Giulia",
    role: "Interlingua Vicenza, Corsi online e Traduzioni",
    number: "393332084517",
    image: "/images/team/giulia-vicenza.webp",
  },
  {
    name: "Elena",
    role: "Interlingua Thiene e Corsi online",
    number: "393333216902",
    image: "/images/team/elena-thiene.webp",
  },
  {
    name: "Giulia",
    role: "Formazione Corporate e Finanziata",
    number: "393474323542",
    image: "/images/team/giulia-corporate.webp",
  },
  {
    name: "Michela",
    role: "Formazione Corporate e Finanziata",
    number: "393332084508",
    image: "/images/team/michela-corporate.webp",
  },
];

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-72 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden mb-2"
          >
            <div className="bg-[#25D366] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SiWhatsapp className="w-5 h-5" />
                <span className="font-semibold text-sm">Contattaci su WhatsApp</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
                data-testid="button-close-whatsapp-panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground">
              Possiamo aiutarti? Scrivi a uno dei nostri consulenti!
            </p>
            <div className="px-2 pb-3 space-y-1">
              {agents.map((agent, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${agent.number}?text=Ciao!%20Vorrei%20informazioni%20sui%20vostri%20corsi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors"
                  data-testid={`link-whatsapp-agent-${i}`}
                >
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-[#25D366] text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Contattaci su WhatsApp"
        data-testid="button-whatsapp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <SiWhatsapp className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
