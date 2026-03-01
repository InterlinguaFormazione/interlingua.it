import { useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TerminiECondizioniPage() {
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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-page-title">Termini e Condizioni</h1>
          </div>

          <p className="text-muted-foreground text-sm mb-2">
            Condizioni Generali di Vendita e di Utilizzo dei Servizi
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Ultimo aggiornamento: 1 marzo 2026
          </p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-bold mb-3">1. Identificazione del Venditore</h2>
              <div className="p-5 rounded-xl bg-muted/50 border border-border/50 text-sm space-y-2">
                <p className="text-muted-foreground"><strong className="text-foreground">Ragione sociale:</strong> Interlingua Formazione S.r.l.</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Sede legale:</strong> Viale Giuseppe Mazzini 27, 36100 Vicenza (VI), Italia</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Sede operativa:</strong> Corso Garibaldi 174, 36016 Thiene (VI), Italia</p>
                <p className="text-muted-foreground"><strong className="text-foreground">P. IVA:</strong> 03828240246</p>
                <p className="text-muted-foreground"><strong className="text-foreground">C.F.:</strong> 03828240246</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Codice Destinatario:</strong> M5UXCR1</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Registro Imprese:</strong> Camera di Commercio di Vicenza — VI-357313</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Capitale Sociale:</strong> € 10.000 i.v.</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Email:</strong> infocorsi@skillcraft.interlingua.it</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Telefono:</strong> +39 0444 321601 (Vicenza) / +39 0445 382744 (Thiene)</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Ambito di Applicazione</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le presenti Condizioni Generali di Vendita si applicano a tutti gli acquisti effettuati tramite il sito web <strong className="text-foreground">skillcraft.interlingua.it</strong> (di seguito "il Sito"), gestito da Interlingua Formazione S.r.l. (di seguito "il Venditore"). L'acquisto di servizi attraverso il Sito comporta l'integrale accettazione delle presenti condizioni.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                I servizi offerti tramite il Sito includono, a titolo esemplificativo e non esaustivo:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
                <li>Corsi di formazione linguistica individuali e di gruppo, in presenza e online</li>
                <li>Programmi Full Immersion</li>
                <li>Corsi e-learning e piattaforme digitali</li>
                <li>Abbonamenti annuali Speaker's Corner</li>
                <li>Certificazioni linguistiche</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Tutti i servizi offerti sono erogati in presenza presso le nostre sedi di Vicenza e Thiene, oppure online. Non è prevista la vendita o la spedizione di prodotti fisici.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Modalità di Acquisto</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'acquisto avviene attraverso la procedura guidata presente sul Sito. Il Cliente è tenuto a fornire dati veritieri, completi e aggiornati al momento dell'ordine. Interlingua Formazione S.r.l. si riserva il diritto di rifiutare ordini contenenti dati manifestamente errati o incompleti.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il contratto si intende concluso nel momento in cui il Cliente riceve conferma dell'avvenuto pagamento e dell'attivazione del servizio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Prezzi e Pagamenti</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Tutti i prezzi indicati sul Sito sono espressi in Euro (€) e si intendono comprensivi di IVA, ove applicabile. Il Venditore si riserva il diritto di modificare i prezzi in qualsiasi momento, senza preavviso. Il prezzo applicato sarà quello indicato al momento della conferma dell'ordine.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il pagamento avviene tramite <strong className="text-foreground">PayPal</strong>, che consente il pagamento con conto PayPal, carta di credito e carte prepagate. Il pagamento viene processato al momento dell'ordine. Il Cliente è responsabile di eventuali commissioni applicate dal proprio istituto bancario o da PayPal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Iscrizione e Frequenza ai Corsi</h2>

              <div className="space-y-5 mt-4">
                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">5.1 Corsi Individuali (Lezioni One-to-One)</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Le lezioni individuali possono essere recuperate <strong className="text-foreground">esclusivamente</strong> se vengono cancellate con un preavviso di almeno <strong className="text-foreground">24 ore</strong> rispetto all'orario previsto della lezione. La cancellazione deve essere comunicata per iscritto (email o messaggio) e si considera valida solo dopo aver ricevuto <strong className="text-foreground">conferma di ricezione da parte di Interlingua Formazione</strong>.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                    Le lezioni individuali cancellate senza il rispetto del preavviso di 24 ore, o senza conferma di ricezione della cancellazione, saranno considerate come <strong className="text-foreground">effettuate</strong> e non potranno essere recuperate né rimborsate.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">5.2 Corsi di Gruppo</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Le lezioni di gruppo perse per qualsiasi motivo (assenza, ritardo, impedimenti personali) <strong className="text-foreground">non sono recuperabili</strong>. Il corso prosegue secondo il calendario stabilito e non è previsto il rimborso parziale delle lezioni non frequentate.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                    Il Venditore si riserva il diritto di annullare o riprogrammare una lezione di gruppo in caso di forza maggiore, indisponibilità del docente o numero insufficiente di partecipanti. In tal caso, la lezione sarà recuperata in una data concordata.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">5.3 Speaker's Corner</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    L'abbonamento annuale a Speaker's Corner dà diritto alla partecipazione settimanale alle sessioni di conversazione, previa prenotazione del posto. La mancata partecipazione a una sessione prenotata non dà diritto a rimborso o recupero. L'abbonamento ha validità di 12 mesi dalla data di attivazione e non è rinnovabile automaticamente.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                  <h3 className="font-bold text-lg mb-3">5.4 Programmi Full Immersion</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    I programmi Full Immersion seguono un calendario fisso e intensivo. La cancellazione dell'iscrizione è possibile fino a <strong className="text-foreground">14 giorni</strong> prima dell'inizio del programma, con rimborso integrale. Cancellazioni successive comportano il pagamento del 50% della quota. La mancata partecipazione senza preavviso non dà diritto ad alcun rimborso.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Servizi Digitali e E-Learning</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'acquisto di corsi e-learning, piattaforme digitali e contenuti digitali disponibili nello Shop comporta l'accesso immediato al contenuto. Ai sensi dell'<strong className="text-foreground">art. 59, comma 1, lettera o) del Codice del Consumo</strong> (D.lgs. 206/2005), il diritto di recesso è escluso per la fornitura di contenuto digitale mediante un supporto non materiale se l'esecuzione è iniziata con l'accordo espresso del consumatore e con la sua accettazione del fatto che in tal caso avrebbe perso il diritto di recesso.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Al momento dell'acquisto di contenuti digitali, il Cliente acconsente espressamente all'inizio immediato della fornitura del servizio, rinunciando al diritto di recesso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Diritto di Recesso</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ai sensi degli artt. 52 e seguenti del <strong className="text-foreground">Codice del Consumo</strong> (D.lgs. 206/2005), il Cliente consumatore ha diritto di recedere dal contratto entro <strong className="text-foreground">14 giorni</strong> dalla data di conclusione del contratto, senza dover fornire alcuna motivazione.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Per esercitare il diritto di recesso, il Cliente deve inviare una comunicazione scritta a:
              </p>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm mt-3 space-y-1">
                <p className="text-muted-foreground"><strong className="text-foreground">Email:</strong> infocorsi@skillcraft.interlingua.it</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Oggetto:</strong> Richiesta di recesso — [Nome e Cognome] — [Numero ordine]</p>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il rimborso verrà effettuato entro 14 giorni dalla ricezione della comunicazione di recesso, utilizzando lo stesso mezzo di pagamento usato per la transazione iniziale.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                <strong className="text-foreground">Esclusioni dal diritto di recesso:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
                <li>Corsi e-learning o contenuti digitali con accesso già attivato (art. 59, co. 1, lett. o)</li>
                <li>Corsi di formazione (in presenza o online) già iniziati con il consenso del Cliente</li>
                <li>Percorsi formativi personalizzati o su misura per il Cliente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Rimborsi</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In caso di rimborso approvato, il Venditore provvederà al rimborso tramite PayPal entro 14 giorni lavorativi dalla conferma. Il rimborso sarà effettuato sullo stesso metodo di pagamento utilizzato per l'acquisto.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Non sono previsti rimborsi per:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
                <li>Lezioni individuali non cancellate nel rispetto dei termini di cui all'art. 5.1</li>
                <li>Lezioni di gruppo non frequentate</li>
                <li>Sessioni Speaker's Corner non utilizzate durante il periodo di abbonamento</li>
                <li>Corsi e-learning o contenuti digitali con accesso già attivato</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Proprietà Intellettuale</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Tutti i contenuti presenti sul Sito e i materiali didattici forniti durante i corsi (testi, immagini, video, audio, dispense, presentazioni, esercizi) sono di proprietà esclusiva di Interlingua Formazione S.r.l. o dei rispettivi autori e sono protetti dalle leggi italiane e internazionali sul diritto d'autore.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                È vietata la riproduzione, distribuzione, pubblicazione, trasmissione o cessione a terzi dei materiali didattici, in qualsiasi forma e con qualsiasi mezzo, senza il previo consenso scritto del Venditore. La registrazione audio o video delle lezioni è severamente vietata salvo espressa autorizzazione scritta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Test di Livello</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I test di livello disponibili sul Sito sono offerti a titolo gratuito e hanno finalità orientativa. Il risultato del test costituisce una stima indicativa del livello linguistico del partecipante secondo il Quadro Comune Europeo di Riferimento (QCER) e non ha valore certificatorio.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                I dati forniti durante il test (nome, email, risposte) vengono trattati in conformità con la nostra <Link href="/privacy-policy" className="text-primary hover:underline" data-testid="link-privacy-from-terms">Dichiarazione sulla Privacy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Responsabilità</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Interlingua Formazione S.r.l. si impegna a erogare i servizi con la massima professionalità e competenza. Tuttavia, non garantisce il raggiungimento di specifici risultati di apprendimento, che dipendono anche dall'impegno personale del partecipante.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il Venditore non è responsabile per:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
                <li>Interruzioni temporanee del servizio dovute a manutenzione o cause di forza maggiore</li>
                <li>Malfunzionamenti delle piattaforme di terze parti (PayPal, piattaforme e-learning esterne)</li>
                <li>Problemi tecnici legati alla connessione internet o ai dispositivi del Cliente</li>
                <li>Danni indiretti derivanti dall'utilizzo o dall'impossibilità di utilizzo del Sito</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">12. Protezione dei Dati Personali</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il trattamento dei dati personali dei Clienti avviene in conformità al <strong className="text-foreground">Regolamento UE 2016/679</strong> (GDPR) e al <strong className="text-foreground">D.lgs. 196/2003</strong> come modificato dal D.lgs. 101/2018.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Per informazioni dettagliate sul trattamento dei dati personali, si rinvia alla nostra <Link href="/privacy-policy" className="text-primary hover:underline" data-testid="link-privacy-from-terms-2">Dichiarazione sulla Privacy</Link> e alla <Link href="/cookie-policy" className="text-primary hover:underline" data-testid="link-cookie-from-terms">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">13. Modifiche alle Condizioni</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il Venditore si riserva il diritto di modificare le presenti Condizioni Generali in qualsiasi momento. Le modifiche saranno efficaci dalla data di pubblicazione sul Sito. Si consiglia di consultare periodicamente la presente pagina. L'utilizzo del Sito o l'acquisto di servizi dopo la pubblicazione delle modifiche implica l'accettazione delle nuove condizioni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">14. Legge Applicabile e Foro Competente</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le presenti Condizioni Generali sono regolate dalla <strong className="text-foreground">legge italiana</strong>. Per qualsiasi controversia derivante dall'interpretazione, esecuzione o risoluzione delle presenti condizioni, sarà competente in via esclusiva il <strong className="text-foreground">Foro di Vicenza</strong>, salvo il foro del consumatore previsto dall'art. 66-bis del Codice del Consumo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">15. Risoluzione Online delle Controversie (ODR)</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ai sensi del <strong className="text-foreground">Regolamento UE 524/2013</strong>, si informa il consumatore che, in caso di controversia, potrà presentare un reclamo attraverso la piattaforma ODR (Online Dispute Resolution) dell'Unione Europea, accessibile al seguente indirizzo:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-odr-platform"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">16. Contatti</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Per qualsiasi informazione, richiesta o reclamo relativo alle presenti Condizioni Generali, il Cliente può contattare Interlingua Formazione S.r.l. ai seguenti recapiti:
              </p>
              <div className="p-5 rounded-xl bg-muted/50 border border-border/50 text-sm mt-3 space-y-2">
                <p className="text-muted-foreground"><strong className="text-foreground">Email:</strong> infocorsi@skillcraft.interlingua.it</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Telefono Vicenza:</strong> +39 0444 321601</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Telefono Thiene:</strong> +39 0445 382744</p>
                <p className="text-muted-foreground"><strong className="text-foreground">Sede legale:</strong> Viale Giuseppe Mazzini 27, 36100 Vicenza (VI)</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
