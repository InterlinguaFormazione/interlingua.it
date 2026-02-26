import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

function generateSessionId(): string {
  const stored = localStorage.getItem("sc-cookie-session");
  if (stored) return stored;
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem("sc-cookie-session", id);
  return id;
}

async function logConsent(prefs: CookiePreferences, action: string) {
  try {
    await apiRequest("POST", "/api/cookie-consent", {
      sessionId: generateSessionId(),
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      preferences: prefs.preferences,
      consentAction: action,
    });
  } catch (e) {
    console.error("Failed to log cookie consent:", e);
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const openBanner = useCallback(() => {
    const stored = localStorage.getItem("sc-cookie-consent");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPrefs({ necessary: true, ...parsed });
      } catch {}
    }
    setShowSettings(true);
    setVisible(true);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem("sc-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handler = () => openBanner();
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, [openBanner]);

  const saveAndClose = (preferences: CookiePreferences, action: string) => {
    localStorage.setItem("sc-cookie-consent", JSON.stringify(preferences));
    localStorage.setItem("sc-cookie-consent-date", new Date().toISOString());
    logConsent(preferences, action);
    setVisible(false);
  };

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true, preferences: true };
    setPrefs(allAccepted);
    saveAndClose(allAccepted, "accept_all");
  };

  const rejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false, preferences: false };
    setPrefs(onlyNecessary);
    saveAndClose(onlyNecessary, "reject_all");
  };

  const saveCustom = () => {
    saveAndClose(prefs, "custom");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
          data-testid="cookie-banner"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Informativa Cookie</h3>
                </div>
                <button
                  onClick={rejectAll}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-cookie-close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. I cookie necessari sono sempre attivi.
                Puoi scegliere quali cookie opzionali attivare.{" "}
                <Link
                  href="/cookie-policy"
                  className="text-primary hover:underline font-medium"
                  data-testid="link-cookie-policy"
                >
                  Leggi la nostra Cookie Policy
                </Link>
              </p>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 mb-5 p-4 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Cookie Necessari</p>
                          <p className="text-xs text-muted-foreground">Essenziali per il funzionamento del sito</p>
                        </div>
                        <Switch checked disabled data-testid="switch-cookie-necessary" />
                      </div>

                      <div className="h-px bg-border/50" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Cookie Analitici</p>
                          <p className="text-xs text-muted-foreground">Ci aiutano a capire come usi il sito</p>
                        </div>
                        <Switch
                          checked={prefs.analytics}
                          onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                          data-testid="switch-cookie-analytics"
                        />
                      </div>

                      <div className="h-px bg-border/50" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Cookie di Marketing</p>
                          <p className="text-xs text-muted-foreground">Per mostrarti contenuti e pubblicità pertinenti</p>
                        </div>
                        <Switch
                          checked={prefs.marketing}
                          onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                          data-testid="switch-cookie-marketing"
                        />
                      </div>

                      <div className="h-px bg-border/50" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Cookie di Preferenza</p>
                          <p className="text-xs text-muted-foreground">Ricordano le tue scelte e preferenze</p>
                        </div>
                        <Switch
                          checked={prefs.preferences}
                          onCheckedChange={(v) => setPrefs((p) => ({ ...p, preferences: v }))}
                          data-testid="switch-cookie-preferences"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="gap-2"
                  data-testid="button-cookie-settings"
                >
                  <Settings className="h-4 w-4" />
                  {showSettings ? "Nascondi Dettagli" : "Personalizza"}
                </Button>

                {showSettings && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCustom}
                    data-testid="button-cookie-save-custom"
                  >
                    Salva Preferenze
                  </Button>
                )}

                <div className="flex-1" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectAll}
                  data-testid="button-cookie-reject"
                >
                  Rifiuta Opzionali
                </Button>

                <Button
                  size="sm"
                  onClick={acceptAll}
                  data-testid="button-cookie-accept"
                >
                  Accetta Tutti
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
