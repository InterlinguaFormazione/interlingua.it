import { useEffect } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeft, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CodiceEticoPage() {
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
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-codice-etico-title">Codice Etico</h1>
          </div>

          <p className="text-muted-foreground text-sm mb-2">
            Ai sensi del D.Lgs. 231/2001 e successive modifiche
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Interlingua Formazione S.r.l. — P.IVA 03828240246
          </p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-bold mb-3">Nota preliminare</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il presente codice etico disciplina l'attività della società INTERLINGUA FORMAZIONE SRL nell'ambito dell'impresa dalla stessa svolta, con riferimento ai reati "presupposto" di cui al decr. legisl. 231/01 e succ. modif. ed in genere in relazione allo svolgimento della attività e ai rapporti con terzi.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il presente codice etico tiene conto delle indicazioni di cui alle linee guida di Confindustria (aggiornamento al 30.3.2008).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Premessa</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                INTERLINGUA FORMAZIONE SRL, corrente in Viale Mazzini, 27, Vicenza cod. fisc. e part. Iva 03828240246, (di seguito denominato anche Ente o Società) svolge l'attività di progettazione, organizzazione, coordinamento e commercializzazione di interventi e piani formativi, nonché il servizio di traduzioni e interpretariato.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                La Società è un'istituzione indipendente costituitasi in Italia nel 1993 e giuridicamente riconosciuta dal 2 maggio 2013 come Società a Responsabilità Limitata a Socio Unico.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Nel febbraio del 2003, è stata inserita dalla Regione Veneto nell'elenco degli Organismi di Formazione accreditati per l'ambito della Formazione Continua, quindi reinserita, successivamente al conferimento in Società a Responsabilità Limitata, con nuovo codice ente nel 2013.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                La Formazione Continua costituisce la finalità principale della Scuola. Inizialmente rivolta al miglioramento della didattica delle lingue straniere attraverso la realizzazione di interventi formativi indirizzati ai lavoratori, si è poi evoluta e sviluppata attraverso l'approccio diretto alle Aziende e alle istituzioni. Iniziative importanti hanno riguardato la formazione linguistica legata ad ambiti specialistici della comunicazione aziendale. Altro aspetto originale della proposta formativa dell'Ente riguarda quegli aspetti di integrazione di competenze manageriali per operatori del Commercio che sono divenute sempre più importanti per il raggiungimento degli obiettivi delle aziende Venete.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Interlingua Formazione ha sempre mirato alla progettazione di programmi didattici customizzati di tutti i corsi erogati, rendendoli specialistici e mirati a seconda delle esigenze e creando un'organizzazione che è la forza dell'azienda: un sistema di collaborazione tra formatori e Coordinamento, in grado di garantire per ogni azienda Cliente che un team selezionato si prenda cura di tutte le esigenze formative linguistiche dell'azienda stessa, assicurandole la continuità di linguaggio nel corso degli anni, la precisione linguistica tecnica e l'assoluta specificità dei programmi di formazione.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                L'Ente, oltre a rispettare, nello svolgimento della propria attività, le leggi ed i regolamenti vigenti, intende osservare elevati standard etici nella conduzione quotidiana del proprio lavoro: tali standard ed i loro principi ispiratori, sono raccolti nel presente codice etico (di seguito indicato anche come codice).
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il codice è uno strumento integrativo delle norme di legge o regolamentari. La società infatti ritiene che le decisioni aziendali ed i comportamenti del proprio personale siano basati su regole etiche, anche nei casi in cui esse non dovessero essere codificate da normative specifiche.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Con il termine personale si intende l'insieme delle persone che lavorano per l'Ente o per esso: dipendenti, amministratori e collaboratori a titolo diverso (ad esempio collaboratori continuativi od occasionali, professionisti e simili).
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il codice esprime gli impegni e le responsabilità etiche assunti da quanti, a vario titolo, collaborano alla realizzazione degli obiettivi dell'Ente nei confronti di: possessori del capitale, dipendenti, collaboratori, consulenti esterni, fornitori, clienti ed altri soggetti, in quanto portatori di interessi legati all'attività dell'Ente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">1. Principi di comportamento per l'organizzazione</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I principi di seguito elencati sono ritenuti fondamentali, per cui l'Ente si impegna a rispettarli nei confronti di chiunque. D'altra parte, la Società pretende che tali principi vengano rispettati da tutti i soggetti, interni ed esterni, che intrattengono rapporti di qualsiasi natura con la stessa.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Rispetto di leggi e regolamenti</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente opera nel rispetto della legge e si adopera affinché tutto il personale agisca in tale senso: le persone devono tenere un comportamento conforme alla legge, quali che siano il contesto e le attività svolte. Tale impegno deve valere anche per i consulenti, fornitori, clienti e per chiunque abbia rapporti con la società.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Integrità di comportamento</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente si impegna a fornire servizi di qualità ed a competere sul mercato secondo principi di equa e libera concorrenza e trasparenza, mantenendo rapporti corretti con le istituzioni pubbliche, governative ed amministrative, con la cittadinanza e con le imprese terze.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Discriminazione</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nelle decisioni che influiscono sulle relazioni con i suoi stakeholders (scelta dei clienti, rapporti con i possessori del capitale, gestione del personale e organizzazione del lavoro, selezione e gestione dei fornitori, rapporti con la comunità circostante e con le istituzioni che la rappresentano), l'Ente evita ogni discriminazione in base all'età, al sesso, alla sessualità, allo stato di salute, alla razza, alla nazionalità, alle opinioni politiche ed alle credenze religiose dei suoi interlocutori.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                Il medesimo criterio viene adottato nella scelta di assunzione o di rapporti con il personale.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Valorizzazione delle risorse umane</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente riconosce che le risorse umane costituiscono un fattore di fondamentale importanza per il proprio sviluppo, per cui garantisce un ambiente di lavoro sicuro, tale da agevolare l'assolvimento del lavoro e valorizzare le attitudini professionali di ciascuno. L'ambiente di lavoro, ispirato al rispetto, alla correttezza ed alla collaborazione, deve permettere il coinvolgimento e la responsabilizzazione delle persone, con riguardo agli specifici obiettivi da raggiungere ed alle modalità per perseguirli.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                L'Ente rifiuta ogni forma di lavoro coatto o svolto da minori in violazione della legge e non tollera violazioni dei diritti umani.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Equità dell'autorità</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nelle relazioni con vincolo gerarchico, l'Ente si impegna a fare in modo che sia evitata ogni forma di abuso. La società eviterà abusi di posizione dominante.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Tutela di salute, sicurezza e ambiente</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente intende condurre la sua attività in maniera corretta dal punto di vista ambientale. Ha cura inoltre di diffondere corrette e veritiere informazioni riguardanti la propria attività.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Correttezza in ambito contrattuale</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I contratti e gli incarichi di lavoro devono essere eseguiti secondo quanto stabilito consapevolmente dalle parti: l'Ente si impegna a non sfruttare condizioni di ignoranza o di incapacità delle proprie controparti.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Tutela della concorrenza</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente intende tutelare il valore della concorrenza leale, astenendosi da comportamenti collusivi, predatori e di abuso di posizione. Pertanto, tutti i soggetti che a vario titolo operano con l'Ente non potranno partecipare ad accordi in contrasto con le regole che disciplinano la libera e leale concorrenza tra imprese.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Trasparenza e completezza dell'informazione</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente è tenuto a fornire informazioni complete, trasparenti, comprensibili ed accurate, in modo tale che, nell'impostare i rapporti con l'azienda, gli stakeholders siano in grado di prendere decisioni autonome e consapevoli degli interessi coinvolti, delle alternative e delle conseguenze rilevanti.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Protezione dei dati personali</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente raccoglie e tratta dati personali di clienti, possessori del capitale, collaboratori, dipendenti e di altri soggetti. L'Ente si impegna a trattare tali dati nei limiti ed in conformità a quanto previsto dalla normativa vigente in materia di privacy, con specifico riferimento al Dlgs 196/2003 ("Codice della privacy") e relativi allegati, nonché le prescrizioni del garante per la protezione dei dati personali.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Principi di comportamento cui deve attenersi il personale</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone (amministratori, dipendenti e collaboratori), nel comportamento da tenere nei confronti dell'Ente devono osservare i principi seguenti:
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Professionalità</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ciascuna persona svolge la propria attività lavorativa e le proprie prestazioni con diligenza, efficienza e correttezza, utilizzando al meglio gli strumenti ed il tempo a propria disposizione ed assumendosi le responsabilità connesse agli adempimenti.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Lealtà e onestà</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone sono tenute ad essere leali nei confronti della società. Nell'ambito della loro attività lavorativa, le persone sono tenute a conoscere e rispettare con diligenza il modello organizzativo e le leggi vigenti. In nessun caso il perseguimento dell'interesse dell'Ente può giustificare una condotta non onesta o non rispettosa delle normative.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Correttezza</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone non utilizzano a fini personali – se non nei limiti autorizzati – informazioni, beni ed attrezzature, di cui dispongono nello svolgimento della funzione o degli incarichi loro assegnati. Ciascuna persona non accetta né effettua, per sé o per altri, pressioni, raccomandazioni o segnalazioni, che possano recare pregiudizio all'Ente o indebiti vantaggi per sé, all'Ente o a terzi.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Riservatezza</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone assicurano la massima riservatezza relativamente a notizie ed informazioni costituenti il patrimonio aziendale o inerenti l'attività della società, nel rispetto delle disposizioni di legge, dei regolamenti vigenti e delle procedure interne.
              </p>

              <h3 className="text-base font-semibold mt-6 mb-2">Conflitti di interesse</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone informano senza ritardo i propri superiori o referenti delle situazioni o attività nelle quali vi potrebbe essere un interesse in conflitto con quello dell'Ente, diretto o indiretto ed in ogni altro caso in cui ricorrano rilevanti ragioni di convenienza. Le persone rispettano le decisioni che in proposito sono assunte dall'Ente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Criteri di condotta</h2>

              <h3 className="text-lg font-semibold mt-6 mb-2">3.1. Relazioni con il personale</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Selezione del personale</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                La valutazione del personale da assumere è effettuata in base alla corrispondenza dei profili dei candidati, rispetto a quelli attesi ed alle esigenze aziendali, nel rispetto delle pari opportunità per tutti i soggetti interessati, nonché nel rispetto delle normative vigenti (in particolare artt. 4 e 8 legge 300/70).
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Costituzione del rapporto di lavoro</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il personale è assunto con regolare contratto di lavoro o collaborazione. Non è tollerata alcuna forma di lavoro irregolare. Alla costituzione del rapporto di lavoro la persona riceve dettagliate informazioni in merito a: caratteristiche della funzione e delle mansioni da svolgere, elementi normativi e retributivi, norme e procedure da adottare al fine di evitare i possibili rischi per la salute associati all'attività lavorativa.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Gestione del personale</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente si impegna a tutelare l'integrità morale e la dignità delle persone, garantendo il diritto a condizioni di lavoro rispettose della loro dignità. Tutti debbono essere trattati con lo stesso rispetto e dignità ed hanno diritto alle stesse possibilità di sviluppo professionale e di carriera. L'Ente evita qualsiasi forma di discriminazione nei confronti del proprio personale.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Integrità e tutela della persona</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente salvaguarda i lavoratori da atti di violenza psicologica e contrasta qualsiasi atteggiamento o comportamento discriminatorio. L'Ente non tollera alcun atto di discriminazione o molestia: le persone che si renderanno protagoniste di tali atti incorreranno in sanzioni disciplinari che possono arrivare anche al licenziamento.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Valorizzazione e formazione delle risorse</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I responsabili utilizzano e valorizzano pienamente tutte le professionalità presenti nella struttura, mediante l'attivazione delle leve disponibili per favorire lo sviluppo e la crescita delle persone: per esempio affiancamenti a personale esperto, esperienze finalizzate alla copertura di incarichi di maggiore responsabilità, corsi di formazione.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Sicurezza e salute</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente si impegna ad offrire un ambiente di lavoro in grado di proteggere la salute e la sicurezza del proprio personale. Tutte le persone devono rispettare le norme e procedure interne in materia di prevenzione dei rischi e di tutela della salute e della sicurezza e segnalare tempestivamente le eventuali carenze o il mancato rispetto delle norme applicabili.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Tutela della privacy</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nel trattamento dei dati personali del proprio personale, l'Ente si attiene alle disposizioni contenute nel Dlgs 196/2003. Alle persone viene consegnata un'informativa sulla tutela dei dati personali che individua: finalità e modalità del trattamento, eventuali soggetti ai quali i dati vengono comunicati, nonché informazioni necessarie all'esercizio del diritto di accesso. E' esclusa qualsiasi indagine sulle idee, le preferenze, i gusti personali e, in generale, la vita privata dei dipendenti e dei collaboratori.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.2. Doveri del personale</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone devono agire lealmente, al fine di rispettare gli obblighi sottoscritti nel contratto di lavoro e quanto previsto dal codice etico, assicurando le prestazioni richieste.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Gestione delle informazioni</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le persone devono conoscere ed attuare quanto previsto dalle politiche aziendali, in tema di sicurezza delle informazioni, per garantirne l'integrità, la riservatezza e la disponibilità. Esse sono tenute ad elaborare i propri documenti utilizzando un linguaggio chiaro, oggettivo ed esaustivo.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Riservatezza delle informazioni aziendali</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Informazioni e know-how aziendali devono essere tutelati con la massima riservatezza. Sia durante, che dopo lo scioglimento del rapporto d'impiego con l'Ente, le persone potranno utilizzare i dati riservati in loro possesso esclusivamente nell'interesse dell'Ente e mai a beneficio proprio o di terzi.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Conflitto di interessi</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Tutte le persone dell'Ente sono tenute ad evitare situazioni in cui si possono manifestare conflitti di interesse e ad astenersi dall'avvantaggiarsi personalmente di opportunità di affari, di cui sono venute a conoscenza nel corso dello svolgimento delle proprie funzioni.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Compensi illeciti, omaggi, spese di rappresentanza</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Al personale dell'Ente è imposto il divieto di accettare o ricevere qualunque dono, gratifica o altro omaggio con un valore monetario non modico, da parte di fornitori, clienti o altri soggetti con cui è in corso un rapporto di natura professionale o di impresa. In particolare, le persone non devono accettare doni e servizi che possano influire sulle azioni da intraprendere nello svolgimento delle loro mansioni lavorative.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Utilizzo dei beni aziendali</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Ogni persona è tenuta ad operare con diligenza per tutelare i beni aziendali, attraverso comportamenti responsabili ed in linea con le procedure operative predisposte per regolamentarne l'utilizzo. In particolare ogni persona deve utilizzare con scrupolo i beni affidati, evitare utilizzi impropri dei beni aziendali e custodire adeguatamente le risorse a lei affidate.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.3. Relazioni con i clienti</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Imparzialità</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente si impegna a non discriminare arbitrariamente i propri clienti, nel rispetto peraltro delle proprie decisioni aziendali.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Contratti e comunicazioni ai clienti</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I contratti e le comunicazioni ai clienti dell'Ente devono essere: chiari e semplici; conformi alle normative vigenti, tali da non configurare pratiche elusive o comunque scorrette; completi, così da non trascurare alcun elemento rilevante ai fini della decisione del cliente.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Stile di comportamento del personale verso i clienti</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Lo stile di comportamento delle persone della Società, nei confronti della clientela, deve essere improntato alla disponibilità, al rispetto ed alla cortesia, nell'ottica di un rapporto collaborativo e di elevata professionalità, a tutti i livelli.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.4. Rapporti con i fornitori</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Scelta del fornitore</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I processi di acquisto sono improntati alla ricerca del massimo vantaggio per l'Ente, alla concessione delle pari opportunità ai fornitori, alla lealtà ed all'imparzialità: la selezione dei fornitori e la determinazione delle condizioni d'acquisto sono basate su una valutazione obiettiva della qualità e del prezzo del bene o servizio, nonché delle garanzie di assistenza e di tempestività.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Tutela degli aspetti etici nelle forniture</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nella prospettiva di conformare l'attività di approvvigionamento ai principi etici adottati, l'Ente si impegna ad introdurre, per particolari forniture, requisiti di tipo sociale: per esempio, la presenza di un sistema di gestione ambientale o di tutela dei lavoratori.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.5. Relazioni con gli azionisti</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Trasparenza contabile</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Al fine di assicurare trasparenza e completezza dell'informazione contabile è necessario che la documentazione dei fatti da riportare in contabilità a supporto della registrazione sia chiara, completa, corretta e che venga archiviata per eventuali verifiche.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Tutela del patrimonio sociale</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le risorse disponibili devono essere impiegate, nel rispetto delle legge vigenti, dello statuto e del codice, per accrescere e rafforzare il patrimonio sociale, a tutela dell'Ente stesso, dei possessori del capitale, dei creditori e del mercato.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.6. Rapporti con le pubbliche amministrazioni</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Correttezza e lealtà</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente intende condurre rapporti con la pubblica amministrazione con la massima trasparenza ed eticità di comportamento: tali rapporti, che devono avvenire nel rispetto della normativa vigente, sono informati ai principi generali di correttezza e di lealtà, in modo da non compromettere l'integrità di entrambe le parti.
              </p>

              <h4 className="text-base font-semibold mt-4 mb-2">Regali, omaggi e benefici</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Nessuna persona dell'Ente può elargire denaro, oppure offrire vantaggi economici o altre tipologie di benefici a soggetti della pubblica amministrazione allo scopo di ottenere vantaggi personali o per l'Ente. Non è ammessa alcuna forma di regalo che possa essere interpretata come eccedente le normali pratiche commerciali o di cortesia o comunque rivolta ad acquisire trattamenti di favore.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.7. Rapporti con la collettività</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente non finanzia partiti politici sia in Italia che all'estero, loro rappresentanti o candidati, né effettua sponsorizzazioni di congressi o feste che abbiano un fine esclusivo di propaganda meramente politica. L'Ente si astiene tassativamente dall'assoggettarsi a qualsiasi pressione, diretta o indiretta, da esponenti politici.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                L'Ente può aderire alle richieste di contributi limitatamente alle proposte provenienti da enti e associazioni dichiaratamente senza fini di lucro, con regolari statuti ed atti costitutivi, che siano di valore sportivo, culturale o benefico o che coinvolgano un elevato numero di cittadini.
              </p>

              <h3 className="text-lg font-semibold mt-8 mb-2">3.8. Diffusione di informazioni</h3>

              <h4 className="text-base font-semibold mt-4 mb-2">Comunicazione all'esterno</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                La comunicazione dell'Ente verso i soggetti portatori di interessi è improntata al rispetto del diritto all'informazione; in nessun caso è permesso divulgare notizie o commenti falsi o tendenziosi. Ogni attività di comunicazione rispetta le leggi, le regole, le pratiche di condotta professionale ed è realizzata con chiarezza, trasparenza e tempestività.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Meccanismi applicativi del codice etico</h2>

              <h3 className="text-lg font-semibold mt-6 mb-2">4.1. Diffusione e comunicazione</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                L'Ente si impegna a diffondere il codice etico, utilizzando tutti i mezzi di comunicazione e le opportunità a disposizione come, ad esempio, il sito internet aziendale, comunicazioni specifiche, le riunioni di informazione e la formazione del personale. Tutte le persone interessate devono essere in grado di accedere al codice etico, conoscerne i contenuti ed osservare quanto è in esso prescritto.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">4.2. Vigilanza in materia di attuazione del codice etico</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il compito di verificare l'attuazione e l'applicazione del codice etico ricade su: dirigenti e/o funzioni direttive dell'Ente; consiglio di amministrazione o amministratore unico; organismo di vigilanza, il quale, oltre a monitorare il rispetto del codice etico, avendo a tale fine accesso a tutte le fonti di informazione dell'Ente, suggerisce gli opportuni aggiornamenti del codice anche sulla base delle segnalazioni ricevute dal personale o dei terzi.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">4.3. Segnalazione di problemi o sospette violazioni</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Chiunque venga a conoscenza o sia ragionevolmente convinto dell'esistenza di una violazione del presente codice, di una determinata legge o delle procedure aziendali, ha il dovere di informare immediatamente il proprio responsabile o referente e/o l'organismo di vigilanza.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                La segnalazione deve avvenire per iscritto ed in forma non anonima. L'Ente pone in essere i necessari accorgimenti che tutelino i segnalatori da qualsiasi tipo di ritorsione. E', a tal fine, assicurata la riservatezza dell'identità del segnalante, fatti salvi gli obblighi di legge.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">4.4. Procedure operative e protocolli decisionali</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Allo scopo di prevenire violazioni delle normative vigenti, nonché del codice etico, l'Ente ha previsto l'adozione di procedure specifiche da parte di tutti coloro che intervengono nel processo operativo, finalizzate all'identificazione dei soggetti responsabili dei processi di decisione, autorizzazione e svolgimento delle operazioni. Tutte le azioni e le operazioni dell'Ente devono avere una registrazione adeguata e deve essere possibile la verifica del processo di decisione, autorizzazione e svolgimento delle operazioni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Provvedimenti disciplinari conseguenti alle violazioni</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Le disposizioni del presente codice sono parte integrante delle obbligazioni contrattuali assunte dal personale, nonché dai soggetti aventi relazioni d'affari con l'Ente. La violazione dei principi e dei comportamenti indicati nel codice etico compromette il rapporto fiduciario tra l'Ente e gli autori della violazione siano essi amministratori, dipendenti, consulenti, collaboratori, clienti o fornitori e potrà dare luogo a sanzioni di vario genere.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.1. Dipendenti (quadri, impiegati e operai)</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I provvedimenti adottabili in relazione alla gravità delle violazioni, alla tipologia della regola violata, alle modalità dei fatti, agli eventuali precedenti ed a ogni altra circostanza, vengono mutuati dal CCNL applicabile al rapporto di lavoro e sono indicati all'interno del modello.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.2. Dirigenti</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In caso di violazione, da parte di dirigenti dell'Ente delle regole del codice etico, si provvederà ad applicare nei confronti dei responsabili le misure più idonee in conformità a quanto previsto dal contratto collettivo nazionale di lavoro dei dirigenti industriali.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.3. Amministratori e Sindaci</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In caso di violazione del codice etico da parte di amministratori e/o sindaci dell'Ente, l'OdV informerà l'intero consiglio di amministrazione ed il collegio sindacale dello stesso, al fine di assumere le opportune iniziative. Qualora l'OdV ritenga che la violazione sia tale da comportare la revoca del mandato si procederà alla convocazione dell'assemblea dei soci per deliberare in merito.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.4. Collaboratori e consulenti esterni</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I soggetti legati all'Ente da rapporti di collaborazione o di consulenza che pongano in essere comportamenti in contrasto con le disposizioni contenute nel codice potranno essere sanzionati con l'interruzione del relativo rapporto, sulla base di apposite clausole risolutive espresse inserite nei contratti stipulati con tali soggetti.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.5. Clienti e fornitori</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                I soggetti legati all'Ente da rapporti commerciali che pongano in essere comportamenti in contrasto con le disposizioni contenute nel codice etico potranno essere sanzionati nei casi più gravi con richiami, diffide oppure con l'interruzione del relativo rapporto, sulla base di apposite clausole risolutive espresse inserite nei contratti stipulati con tali soggetti.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.6. Organismo di Vigilanza</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                In caso di comportamenti in contrasto con le disposizioni contenute nel codice etico della Società da parte dell'organismo di vigilanza o da parte di qualcuno dei membri, il consiglio di amministrazione potrà provvedere a richiami o diffide e, nei casi più gravi, anche a promuovere iniziative necessarie per la revoca o la cessazione dell'incarico.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">5.7. Norme generali</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il sistema sanzionatorio qui previsto verrà reso noto ai soggetti interessati secondo le disposizioni di legge per quanto concerne i dipendenti (affissione ex art. 7 legge 300/70) e comunque, per tutti, con idonei mezzi di comunicazione. Nell'applicazione delle sanzioni si terrà conto del principio di proporzionalità, in relazione alla oggettiva gravità del fatto, alla posizione del soggetto, alla intenzionalità del comportamento o al grado di colpa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Disposizioni finali</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Il presente codice etico viene approvato dal consiglio di amministrazione o amministratore unico della Società e verrà adeguatamente aggiornato. Ogni variazione e/o integrazione del presente codice etico sarà approvata dal consiglio di amministrazione o amministratore unico, previa consultazione dell'organo di vigilanza e diffusa tempestivamente ai destinatari interessati.
              </p>
            </section>

            <section className="border-t pt-8 mt-8">
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                Interlingua Formazione S.r.l. (unipersonale) — Capitale Sociale € 10.000,00 i.v. — P.IVA e Cod. Fiscale 03828240246 — Iscrizione CCIAA R.E.A. VI-357313
              </p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed mt-1">
                Sede Legale: Viale Mazzini, 27 — 36100 Vicenza — Tel/Fax 0444 321601
              </p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed mt-1">
                Sedi operative: Viale Mazzini, 27 — 36100 Vicenza | Corso Garibaldi 174 — 36016 Thiene (VI)
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
