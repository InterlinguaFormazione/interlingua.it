import { useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" />
              Torna alla Home
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Dichiarazione sulla Privacy</h1>
          </div>

          <p className="text-muted-foreground text-sm mb-2">
            Informativa ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR)
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Ultimo aggiornamento: 16 giugno 2025
          </p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-bold mb-3">Introduzione</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                La presente informativa è resa ai sensi dell'<strong className="text-foreground">art. 13 del Regolamento UE 2016/679</strong> (Regolamento
                Generale sulla Protezione dei Dati - GDPR) e del <strong className="text-foreground">D.lgs. 196/2003</strong> (Codice in materia di protezione
                dei dati personali) come modificato dal <strong className="text-foreground">D.lgs. 101/2018</strong>. Si applica ai cittadini e ai residenti
                permanenti legali dello Spazio Economico Europeo e della Svizzera e riguarda il trattamento dei dati personali
                attraverso il sito web <strong className="text-foreground">skillcraft.interlingua.it</strong>, di proprietà di Interlingua Formazione srl.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Durante l'elaborazione rispettiamo i requisiti della legislazione sulla privacy. Ciò significa, tra le altre cose, che:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
                <li>comunichiamo chiaramente il motivo per il quale processiamo dati personali attraverso questa dichiarazione sulla privacy</li>
                <li>limitiamo la raccolta di dati personali solo ai dati richiesti per scopi legittimi</li>
                <li>chiediamo il tuo esplicito consenso per processare i tuoi dati personali quando necessario</li>
                <li>adottiamo misure di sicurezza appropriate per proteggere i tuoi dati personali</li>
                <li>rispettiamo il tuo diritto di accesso, correzione o cancellazione dei tuoi dati personali</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">1. Scopo, dati e periodo di conservazione</h2>

              <div className="space-y-5 mt-4">
                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.1 Contatto — Tramite telefono, email e moduli web</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Dati trattati:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        <li>Nome e cognome</li>
                        <li>Indirizzo email</li>
                        <li>Numero di telefono</li>
                        <li>Azienda di appartenenza</li>
                        <li>Ruolo professionale</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Esecuzione di misure precontrattuali adottate su richiesta dell'interessato</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> 36 mesi dalla cessazione del servizio</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Conferimento:</strong> Facoltativo. Il mancato conferimento dei dati comporta l'impossibilità di rispondere alla tua richiesta di contatto.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.2 Analisi dei Fabbisogni Formativi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Dati trattati:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        <li>Dati anagrafici e di contatto</li>
                        <li>Informazioni professionali (ruolo, azienda, settore)</li>
                        <li>Competenze linguistiche e livelli</li>
                        <li>Esigenze formative specifiche</li>
                        <li>Preferenze di modalità e orari di formazione</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Consenso dell'interessato</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> 36 mesi dalla raccolta</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Conferimento:</strong> Facoltativo. Il mancato conferimento dei dati comporta l'impossibilità di elaborare un'analisi personalizzata dei tuoi fabbisogni formativi.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.3 Newsletter</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Dati trattati:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        <li>Nome e cognome</li>
                        <li>Indirizzo email</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Consenso dell'interessato</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> Fino alla revoca del consenso</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Conferimento:</strong> Facoltativo. Il mancato conferimento dei dati comporta l'impossibilità di ricevere la nostra newsletter.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.4 Erogazione servizi formativi</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Dati trattati:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        <li>Dati anagrafici completi</li>
                        <li>Informazioni di contatto</li>
                        <li>Dati di fatturazione</li>
                        <li>Progressi formativi e valutazioni</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Esecuzione del contratto</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> 36 mesi dalla conclusione del servizio</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Conferimento:</strong> Necessario per l'esecuzione del contratto. Il mancato conferimento dei dati comporta l'impossibilità di erogare i servizi formativi richiesti.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.5 Iscrizione a eventi formativi finanziati (FSE)</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Dati trattati:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        <li>Dati anagrafici completi (nome, cognome, data e luogo di nascita, codice fiscale, sesso)</li>
                        <li>Dati di residenza e domicilio</li>
                        <li>Cittadinanza e status immigratorio</li>
                        <li>Informazioni professionali (azienda, ruolo, contratto, settore)</li>
                        <li>Titolo di studio</li>
                        <li>Condizioni di vulnerabilità sociale (disabilità, minoranze, esclusione sociale)</li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Obbligo legale — I dati sono richiesti dalla Regione del Veneto e dal Fondo Sociale Europeo (FSE+) per la partecipazione a progetti formativi finanziati ai sensi del PR VENETO FSE+ 2021-2027</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> Secondo i termini previsti dalla normativa FSE (minimo 10 anni dalla chiusura del progetto)</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Conferimento:</strong> Obbligatorio. Il mancato conferimento comporta l'impossibilità di partecipare agli eventi formativi finanziati.</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">1.6 Adempimento obblighi legali</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground"><strong className="text-foreground">Dati trattati:</strong> Tutti i dati necessari per adempiere agli obblighi fiscali, contabili e normativi</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Base giuridica:</strong> Rispetto di un obbligo legale</p>
                    <p className="text-muted-foreground"><strong className="text-foreground">Periodo di conservazione:</strong> Secondo i termini previsti dalla normativa vigente</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Destinatari dei dati</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I tuoi dati personali sono trattati esclusivamente da personale autorizzato di Interlingua Formazione srl.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                <strong className="text-foreground">Per i dati raccolti tramite moduli di iscrizione FSE:</strong> i dati sono trasmessi alla Regione del Veneto
                e agli enti preposti alla gestione dei fondi FSE+, in conformità agli obblighi previsti dalla normativa
                sui fondi strutturali europei.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3 font-medium">
                I tuoi dati non vengono ceduti a terzi per finalità commerciali o di marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Trasferimenti internazionali</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I tuoi dati personali sono trattati e conservati esclusivamente all'interno dell'Unione Europea.{" "}
                <strong className="text-foreground">Non effettuiamo trasferimenti di dati verso paesi terzi</strong> al di fuori dello Spazio Economico Europeo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Processi decisionali automatizzati</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                <strong className="text-foreground">Non utilizziamo processi decisionali automatizzati</strong>, inclusa la profilazione, che producano
                effetti giuridici o incidano significativamente sulla tua persona.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Trattamento dei dati dei minori</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I nostri servizi formativi sono rivolti principalmente ad aziende e professionisti. In conformità alla normativa
                italiana, l'età minima per il consenso al trattamento dei dati personali in relazione ai servizi della società
                dell'informazione è <strong className="text-foreground">14 anni</strong>. Per i minori di 14 anni, il trattamento è lecito solo con il consenso
                del genitore o tutore legale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Cookie</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il nostro sito web utilizza cookie tecnici necessari per il funzionamento del sito e cookie di analytics per
                migliorare l'esperienza utente. Per ulteriori informazioni sui cookie utilizzati, consulta la nostra{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline font-medium" data-testid="link-cookie-policy-from-privacy">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Sicurezza</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ci impegniamo per la sicurezza dei dati personali. Prendiamo adeguate misure di sicurezza per limitare l'abuso
                e l'accesso non autorizzato ai dati personali. Ciò garantisce che solo le persone autorizzate abbiano accesso ai
                tuoi dati, che l'accesso sia protetto e che le nostre misure di sicurezza vengano regolarmente riviste e aggiornate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. I tuoi diritti</h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                In conformità al GDPR, hai i seguenti diritti riguardo ai tuoi dati personali:
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di informazione:</strong> hai il diritto di sapere quali dati personali trattiamo e come</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di accesso:</strong> hai il diritto di accedere ai tuoi dati personali in nostro possesso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di rettifica:</strong> hai il diritto di correggere, completare o aggiornare i tuoi dati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di cancellazione:</strong> hai il diritto di richiedere la cancellazione dei tuoi dati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di limitazione:</strong> hai il diritto di richiedere la limitazione del trattamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di portabilità:</strong> hai il diritto di ricevere i tuoi dati in formato strutturato</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di opposizione:</strong> hai il diritto di opporti al trattamento dei tuoi dati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Diritto di revoca:</strong> puoi revocare il consenso in qualsiasi momento</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Per esercitare questi diritti, contattaci utilizzando i dati forniti nella sezione contatti.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Modifiche a questa dichiarazione</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ci riserviamo il diritto di apportare modifiche alla presente dichiarazione sulla privacy. Ti consigliamo di
                consultare regolarmente questa pagina per essere informato di eventuali aggiornamenti. Le modifiche significative
                saranno comunicate attraverso il sito web o via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Reclami</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Se non sei soddisfatto di come gestiamo il trattamento dei tuoi dati personali, hai il diritto di presentare
                un reclamo al <strong className="text-foreground">Garante per la protezione dei dati personali</strong>.
              </p>
              <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Garante per la Protezione dei Dati Personali</strong></p>
                <p>Piazza Venezia, 11 - 00187 Roma</p>
                <p>
                  Sito web:{" "}
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.garanteprivacy.it</a>
                </p>
                <p>Email: <a href="mailto:garante@gpdp.it" className="text-primary hover:underline">garante@gpdp.it</a></p>
                <p>PEC: <a href="mailto:protocollo@pec.gpdp.it" className="text-primary hover:underline">protocollo@pec.gpdp.it</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Contatti</h2>

              <h3 className="font-bold mb-2">Titolare del trattamento:</h3>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1 mb-4">
                <p><strong className="text-foreground">Interlingua Formazione srl</strong></p>
                <p>Viale Giuseppe Mazzini 27</p>
                <p>36100 Vicenza (VI), Italia</p>
                <p>P.IVA e C.F.: 03828240246</p>
                <p>Codice Destinatario: M5UXCR1</p>
              </div>

              <h3 className="font-bold mb-2">Contatti per la privacy:</h3>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1">
                <p>Email: <a href="mailto:privacy@interlingua.it" className="text-primary hover:underline">privacy@interlingua.it</a></p>
                <p>Telefono: <a href="tel:+390444321601" className="text-primary hover:underline">+39 0444 321601</a></p>
                <p>
                  Sito web:{" "}
                  <a href="https://skillcraft.interlingua.it" className="text-primary hover:underline">skillcraft.interlingua.it</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
