import { useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

function CookieTable({ cookies }: { cookies: { name: string; provider: string; purpose: string; type: string; duration: string }[] }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-muted/70">
            <th className="text-left p-3 font-semibold border-b border-border/50">Nome</th>
            <th className="text-left p-3 font-semibold border-b border-border/50">Fornitore</th>
            <th className="text-left p-3 font-semibold border-b border-border/50">Finalità</th>
            <th className="text-left p-3 font-semibold border-b border-border/50">Tipo</th>
            <th className="text-left p-3 font-semibold border-b border-border/50">Durata</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
              <td className="p-3 font-mono text-xs border-b border-border/30">{cookie.name}</td>
              <td className="p-3 text-muted-foreground border-b border-border/30">{cookie.provider}</td>
              <td className="p-3 text-muted-foreground border-b border-border/30">{cookie.purpose}</td>
              <td className="p-3 text-muted-foreground border-b border-border/30">{cookie.type}</td>
              <td className="p-3 text-muted-foreground border-b border-border/30">{cookie.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const openCookieSettings = () => {
    window.dispatchEvent(new Event("open-cookie-settings"));
  };

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
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          </div>

          <p className="text-muted-foreground text-sm mb-8">
            Ultimo aggiornamento: 20 febbraio 2026
          </p>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm flex-1">Puoi modificare le tue preferenze cookie in qualsiasi momento:</p>
            <Button
              variant="outline"
              size="sm"
              onClick={openCookieSettings}
              className="gap-2 shrink-0"
              data-testid="button-open-cookie-settings"
            >
              <Settings className="h-4 w-4" />
              Gestisci Preferenze Cookie
            </Button>
          </div>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-bold mb-3">1. Titolare del Trattamento</h2>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">SkillCraft-Interlingua</strong></p>
                <p>Sedi operative: Vicenza e Thiene (VI), Italia</p>
                <p>Email: infocorsi@skillcraft.interlingua.it</p>
                <p>Sito web: skillcraft.interlingua.it</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-3 text-sm">
                Il Titolare del Trattamento è responsabile della presente Cookie Policy e del trattamento dei dati personali
                raccolti tramite i cookie installati sul sito web skillcraft.interlingua.it (di seguito "Sito").
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Cosa sono i Cookie</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano e registrano sul suo computer o
                dispositivo mobile, per essere poi ritrasmessi agli stessi siti alla visita successiva. Grazie ai cookie, un sito
                ricorda le azioni e le preferenze dell'utente (come login, lingua, dimensione dei caratteri e altre impostazioni
                di visualizzazione) in modo che non debbano essere indicate nuovamente quando l'utente torni a visitare detto sito
                o navighi da una pagina all'altra di esso.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Oltre ai cookie, il presente Sito utilizza anche tecnologie di archiviazione locale del browser (localStorage)
                per memorizzare alcune preferenze dell'utente. Queste tecnologie funzionano in modo simile ai cookie e sono
                soggette alla stessa normativa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Base Giuridica del Trattamento</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In conformità con l'Art. 122 del D.Lgs. 196/2003 (come modificato dal D.Lgs. 101/2018), le Linee Guida del
                Garante Privacy italiano (Provvedimento n. 231 del 10 giugno 2021) e il Regolamento (UE) 2016/679 (GDPR):
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-3 text-sm">
                <li><strong className="text-foreground">Cookie tecnici/necessari:</strong> non richiedono il consenso dell'utente
                  in quanto strettamente necessari alla fornitura del servizio (Art. 122, comma 1, D.Lgs. 196/2003).
                  Base giuridica: legittimo interesse del Titolare (Art. 6(1)(f) GDPR).</li>
                <li><strong className="text-foreground">Cookie analitici, di marketing e di preferenza:</strong> richiedono il
                  consenso preventivo e informato dell'utente prima della loro installazione (Art. 122, comma 1, D.Lgs. 196/2003).
                  Base giuridica: consenso dell'interessato (Art. 6(1)(a) GDPR).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Tipologie di Cookie Utilizzati</h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                Di seguito l'elenco dettagliato dei cookie e delle tecnologie di archiviazione locale utilizzati dal Sito,
                suddivisi per categoria e finalità.
              </p>

              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">SEMPRE ATTIVI</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">4.1 Cookie Tecnici / Necessari</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Questi cookie sono indispensabili per il corretto funzionamento del Sito e non possono essere disattivati.
                    Vengono impostati in risposta ad azioni effettuate dall'utente, come la configurazione delle preferenze
                    sulla privacy, la compilazione di moduli o la navigazione del sito. Senza questi cookie, il Sito
                    non può funzionare correttamente.
                  </p>
                  <CookieTable cookies={[
                    { name: "sc-cookie-consent", provider: "skillcraft.interlingua.it (prima parte)", purpose: "Memorizza le preferenze cookie espresse dall'utente (accettazione/rifiuto per categoria)", type: "localStorage", duration: "12 mesi" },
                    { name: "sc-cookie-consent-date", provider: "skillcraft.interlingua.it (prima parte)", purpose: "Registra la data e l'ora in cui l'utente ha espresso le proprie preferenze cookie", type: "localStorage", duration: "12 mesi" },
                    { name: "sc-cookie-session", provider: "skillcraft.interlingua.it (prima parte)", purpose: "Identificativo di sessione anonimo utilizzato per collegare il consenso al registro di prova", type: "localStorage", duration: "12 mesi" },
                    { name: "skillcraft-theme", provider: "skillcraft.interlingua.it (prima parte)", purpose: "Memorizza la preferenza di tema visivo dell'utente (chiaro/scuro)", type: "localStorage", duration: "Persistente" },
                  ]} />
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Base giuridica:</strong> Legittimo interesse (Art. 6(1)(f) GDPR) — Esenzione dal consenso ai sensi dell'Art. 122, comma 1, D.Lgs. 196/2003
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">CONSENSO RICHIESTO</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">4.2 Cookie Analitici</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Questi cookie ci permettono di contare le visite e le fonti di traffico, in modo da poter misurare e migliorare
                    le prestazioni del Sito. Ci aiutano a sapere quali sono le pagine più e meno visitate e a vedere come i
                    visitatori si muovono all'interno del Sito. Tutte le informazioni raccolte da questi cookie sono aggregate
                    e quindi anonime. Se non consenti questi cookie, non sapremo quando hai visitato il nostro Sito.
                  </p>
                  <CookieTable cookies={[
                    { name: "_ga", provider: "Google Analytics (terza parte — Google Ireland Ltd)", purpose: "Distingue gli utenti unici assegnando un numero generato casualmente come identificatore del client", type: "Cookie HTTP", duration: "2 anni" },
                    { name: "_ga_*", provider: "Google Analytics (terza parte — Google Ireland Ltd)", purpose: "Mantiene lo stato della sessione e raccoglie dati statistici aggregati sul comportamento di navigazione", type: "Cookie HTTP", duration: "2 anni" },
                    { name: "_gid", provider: "Google Analytics (terza parte — Google Ireland Ltd)", purpose: "Distingue gli utenti per scopi statistici nell'arco delle 24 ore", type: "Cookie HTTP", duration: "24 ore" },
                    { name: "_gat", provider: "Google Analytics (terza parte — Google Ireland Ltd)", purpose: "Limita la frequenza delle richieste a Google Analytics per non sovraccaricare il server", type: "Cookie HTTP", duration: "1 minuto" },
                  ]} />
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Base giuridica:</strong> Consenso dell'utente (Art. 6(1)(a) GDPR)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Terza parte:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlanda —{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy di Google</a>
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">CONSENSO RICHIESTO</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">4.3 Cookie di Marketing / Profilazione</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Questi cookie possono essere impostati attraverso il nostro Sito dai nostri partner pubblicitari. Possono essere
                    utilizzati da queste aziende per costruire un profilo dei tuoi interessi e mostrarti annunci pertinenti su altri
                    siti. Non memorizzano direttamente informazioni personali, ma sono basati sull'identificazione univoca del tuo
                    browser e dispositivo internet. Se non consenti questi cookie, vedrai pubblicità meno mirate.
                  </p>
                  <CookieTable cookies={[
                    { name: "_fbp", provider: "Meta Platforms (terza parte — Meta Platforms Ireland Ltd)", purpose: "Traccia le visite attraverso i siti web per mostrare annunci pertinenti su Facebook e Instagram", type: "Cookie HTTP", duration: "3 mesi" },
                    { name: "_gcl_au", provider: "Google Ads (terza parte — Google Ireland Ltd)", purpose: "Memorizza le conversioni pubblicitarie per ottimizzare le campagne Google Ads", type: "Cookie HTTP", duration: "3 mesi" },
                  ]} />
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Base giuridica:</strong> Consenso dell'utente (Art. 6(1)(a) GDPR)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Terze parti:</strong>{" "}
                    Meta Platforms Ireland Ltd —{" "}
                    <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy di Meta</a>
                    {" "} | Google Ireland Ltd —{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy di Google</a>
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">CONSENSO RICHIESTO</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">4.4 Cookie di Preferenza / Funzionalità</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Questi cookie consentono al Sito di ricordare le scelte che hai fatto (come la lingua, la regione in
                    cui ti trovi, o personalizzazioni dell'interfaccia) e di fornire funzionalità avanzate e personalizzate.
                    Se non consenti questi cookie, alcuni o tutti questi servizi potrebbero non funzionare correttamente.
                  </p>
                  <CookieTable cookies={[
                    { name: "NID", provider: "Google Maps (terza parte — Google Ireland Ltd)", purpose: "Cookie impostato da Google Maps embed per ricordare le preferenze di mappa e migliorare l'esperienza utente", type: "Cookie HTTP", duration: "6 mesi" },
                    { name: "CONSENT", provider: "Google (terza parte — Google Ireland Ltd)", purpose: "Memorizza lo stato del consenso dell'utente per i servizi Google utilizzati nel Sito", type: "Cookie HTTP", duration: "2 anni" },
                  ]} />
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Base giuridica:</strong> Consenso dell'utente (Art. 6(1)(a) GDPR)
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Cookie di Terze Parti</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Alcuni cookie presenti sul Sito sono installati da soggetti terzi. Il Titolare non ha il controllo diretto
                su tali cookie. Per maggiori informazioni sulle finalità e sulle modalità del trattamento effettuato
                dai soggetti terzi, si invita l'utente a consultare le rispettive informative sulla privacy:
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Google Ireland Limited</strong> (Google Analytics, Google Ads, Google Maps) —{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>
                    {" — "}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Opt-out Google Analytics</a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Meta Platforms Ireland Ltd</strong> (Facebook Pixel) —{" "}
                    <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>
                    {" — "}
                    <a href="https://www.facebook.com/help/568137493302217" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Gestione preferenze inserzioni</a>
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Trasferimento Dati Extra-UE</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Alcuni dei cookie di terze parti sopra descritti (Google, Meta) possono comportare il trasferimento di dati personali
                verso paesi al di fuori dell'Unione Europea, in particolare verso gli Stati Uniti. Tali trasferimenti avvengono
                sulla base del EU-U.S. Data Privacy Framework (Decisione di adeguatezza della Commissione Europea del 10 luglio 2023)
                o, ove applicabile, di Clausole Contrattuali Standard approvate dalla Commissione Europea ai sensi dell'Art. 46(2)(c) GDPR.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Gestione delle Preferenze Cookie</h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                In conformità con le Linee Guida del Garante Privacy (Provvedimento del 10 giugno 2021), l'utente può
                esprimere e modificare le proprie preferenze sui cookie in qualsiasi momento attraverso:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 text-sm">
                <li>Il <strong className="text-foreground">banner cookie</strong> che appare alla prima visita del Sito</li>
                <li>Il pulsante <strong className="text-foreground">"Preferenze Cookie"</strong> presente nel footer di ogni pagina del Sito</li>
                <li>Il pulsante <strong className="text-foreground">"Gestisci Preferenze Cookie"</strong> presente in questa pagina</li>
              </ul>

              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCookieSettings}
                  className="gap-2"
                  data-testid="button-open-cookie-settings-inline"
                >
                  <Settings className="h-4 w-4" />
                  Modifica Preferenze Cookie
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Gestione Cookie tramite Browser</h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                L'utente può anche gestire i cookie direttamente attraverso le impostazioni del proprio browser.
                Si prega di notare che la disabilitazione totale dei cookie potrebbe compromettere l'utilizzo delle
                funzionalità del Sito. Di seguito i link alle istruzioni per i principali browser:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Apple Safari</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Registro delle Preferenze (Prova del Consenso)</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In conformità con l'Art. 7(1) del GDPR e le Linee Guida del Garante Privacy italiano, il Titolare
                conserva un registro elettronico delle preferenze cookie espresse da ciascun utente come prova
                del consenso raccolto. Tale registro contiene:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3 text-sm">
                <li>Un identificativo di sessione anonimo (non riconducibile all'identità dell'utente)</li>
                <li>La data e l'ora esatte dell'espressione o modifica del consenso</li>
                <li>Le categorie di cookie accettate e/o rifiutate</li>
                <li>L'azione compiuta (accettazione totale, rifiuto, personalizzazione)</li>
                <li>L'indirizzo IP (ai soli fini di prova del consenso)</li>
                <li>Il tipo di browser e dispositivo utilizzato (user agent)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Questi dati vengono conservati per un periodo massimo di <strong className="text-foreground">12 mesi</strong> dalla
                data di raccolta del consenso, dopodiché vengono automaticamente cancellati. Il consenso viene rinnovato
                ogni 6 mesi in conformità con le raccomandazioni del Garante Privacy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Diritti dell'Interessato</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ai sensi degli Artt. 15-22 del GDPR, l'utente ha il diritto di:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-3 text-sm">
                <li><strong className="text-foreground">Accesso</strong> (Art. 15) — ottenere conferma dell'esistenza di un trattamento e accedere ai propri dati</li>
                <li><strong className="text-foreground">Rettifica</strong> (Art. 16) — ottenere la correzione dei dati inesatti</li>
                <li><strong className="text-foreground">Cancellazione</strong> (Art. 17) — ottenere la cancellazione dei propri dati ("diritto all'oblio")</li>
                <li><strong className="text-foreground">Limitazione</strong> (Art. 18) — ottenere la limitazione del trattamento</li>
                <li><strong className="text-foreground">Portabilità</strong> (Art. 20) — ricevere i propri dati in un formato strutturato e leggibile</li>
                <li><strong className="text-foreground">Opposizione</strong> (Art. 21) — opporsi al trattamento dei propri dati</li>
                <li><strong className="text-foreground">Revoca del consenso</strong> (Art. 7(3)) — revocare il consenso in qualsiasi momento senza pregiudicare la liceità del trattamento basato sul consenso prima della revoca</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Per esercitare i propri diritti, l'utente può inviare una richiesta scritta al Titolare del Trattamento
                all'indirizzo email: <strong className="text-foreground">infocorsi@skillcraft.interlingua.it</strong>
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-2">
                L'utente ha inoltre il diritto di proporre reclamo all'Autorità di controllo competente:
              </p>
              <div className="mt-2 p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Garante per la Protezione dei Dati Personali</strong></p>
                <p>Piazza Venezia 11 - 00187 Roma</p>
                <p>Email: garante@gpdp.it — PEC: protocollo@pec.gpdp.it</p>
                <p>Sito web: <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.garanteprivacy.it</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Riferimenti Normativi</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>Regolamento (UE) 2016/679 del 27 aprile 2016 (GDPR)</li>
                <li>D.Lgs. 30 giugno 2003, n. 196 (Codice Privacy) come modificato dal D.Lgs. 10 agosto 2018, n. 101</li>
                <li>Direttiva 2002/58/CE del 12 luglio 2002 (Direttiva ePrivacy)</li>
                <li>Provvedimento del Garante Privacy n. 231 del 10 giugno 2021 — "Linee guida cookie e altri strumenti di tracciamento"</li>
                <li>Decisione di adeguatezza della Commissione Europea del 10 luglio 2023 (EU-U.S. Data Privacy Framework)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">12. Aggiornamenti della Cookie Policy</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                La presente Cookie Policy può essere soggetta a modifiche e aggiornamenti. Eventuali modifiche sostanziali
                saranno comunicate tramite avviso sul Sito. L'utente è invitato a consultare periodicamente questa pagina
                per prendere visione della versione più aggiornata.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">13. Contatti</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Per qualsiasi domanda o chiarimento relativo alla presente Cookie Policy o al trattamento dei dati personali,
                è possibile contattare il Titolare del Trattamento:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-1">
                <p><strong className="text-foreground">SkillCraft-Interlingua</strong></p>
                <p>Email: infocorsi@skillcraft.interlingua.it</p>
                <p>Sedi operative: Vicenza e Thiene (VI), Italia</p>
                <p>Sito web: skillcraft.interlingua.it</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
