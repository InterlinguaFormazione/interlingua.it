import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Users, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import logoImage from "@assets/SKILLCRAFT-INTERLINGUA_1769354785857.png";

const navLinks = [
  { href: "/corsi", label: "Corsi" },
  { href: "/bandi-e-corsi-finanziati", label: "Bandi e Corsi Finanziati" },
  { href: "/speakers-corner", label: "Speaker's Corner" },
  { href: "#features", label: "Perché Noi" },
  { href: "#testimonials", label: "Recensioni" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "#contact", label: "Contatti" },
];

const audienceTabs = [
  { id: "privati", label: "Privati", icon: Users, href: null },
  { id: "aziende", label: "Aziende", icon: Building2, href: "https://skillcraft.it", external: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setLocation(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-muted/80 backdrop-blur-sm border-b border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 h-10">
            {audienceTabs.map((tab) => (
              tab.external ? (
                <a
                  key={tab.id}
                  href={tab.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover-elevate"
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  key={tab.id}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md"
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass border-b border-border/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center group" data-testid="link-home">
            <img 
              src={logoImage} 
              alt="SkillCraft Interlingua" 
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover-elevate"
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              className="hidden md:inline-flex"
              onClick={() => handleNavClick("#contact")}
              data-testid="button-cta-header"
            >
              Inizia Ora
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-menu-toggle"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-2">
                  <Button
                    className="w-full"
                    onClick={() => handleNavClick("#contact")}
                    data-testid="button-cta-mobile"
                  >
                    Inizia Ora
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      </div>
    </header>
  );
}
