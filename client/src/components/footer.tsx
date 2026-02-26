import { Link, useLocation } from "wouter";
import { Facebook, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, ArrowUp, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/SKILLCRAFT-INTERLINGUA_1769354785857.png";

const footerLinks = {
  corsi: [
    { label: "AI & Competenze Digitali", href: "#courses" },
    { label: "Competenze Trasversali", href: "#courses" },
    { label: "Management & Organizzazione", href: "#courses" },
    { label: "Formazione Esperienziale", href: "#courses" },
    { label: "Business & Strategia", href: "#courses" },
    { label: "Lingue e Interculturalità", href: "#courses" },
  ],
  azienda: [
    { label: "Chi Siamo", href: "/chi-siamo" },
    { label: "Il Nostro Team", href: "/chi-siamo" },
    { label: "Testimonianze", href: "#testimonials" },
    { label: "Lavora con Noi", href: "#contact" },
  ],
  supporto: [
    { label: "Contatti", href: "#contact" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const [, setLocation] = useLocation();
  
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("/")) {
      setLocation(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6" data-testid="link-footer-home">
              <img 
                src={logoImage} 
                alt="SkillCraft Interlingua" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Dal 1993, formazione professionale a 360 gradi. 
              Intelligenza artificiale, competenze digitali, soft skills, management e lingue. Ente accreditato Regione Veneto.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Vicenza e Thiene (VI)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+39 0444 321 654</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>infocorsi@skillcraft.interlingua.it</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Corsi</h3>
            <ul className="space-y-3">
              {footerLinks.corsi.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Azienda</h3>
            <ul className="space-y-3">
              {footerLinks.azienda.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Supporto</h3>
            <ul className="space-y-3">
              {footerLinks.supporto.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillCraft-Interlingua. Tutti i diritti riservati.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  window.dispatchEvent(new Event("open-cookie-settings"));
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                data-testid="button-cookie-preferences"
              >
                <Cookie className="h-3.5 w-3.5" />
                Preferenze Cookie
              </button>
              <p className="text-sm text-muted-foreground">
                Ente accreditato Regione Veneto
              </p>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToTop}
                data-testid="button-back-to-top"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
