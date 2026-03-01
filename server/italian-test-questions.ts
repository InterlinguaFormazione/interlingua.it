import type { InsertBeQuestion } from "@shared/schema";

interface QuestionDef {
  level: string;
  skillType: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  passage?: string;
  difficulty: number;
  discrimination: number;
}

const difficultyCounters: Record<string, number> = {};

function q(level: string, skillType: string, topic: string, question: string, options: string[], correctAnswer: string, passage?: string): QuestionDef {
  const baseDifficulty: Record<string, number> = { A0: -250, A1: -150, A2: -50, B1: 50, B2: 150, C1: 250 };
  const spread = 40;
  const key = `${level}_${skillType}`;
  const idx = difficultyCounters[key] ?? 0;
  difficultyCounters[key] = idx + 1;
  const offset = Math.round((idx / 14) * spread * 2 - spread);
  return {
    level, skillType, topic, question, options, correctAnswer, passage,
    difficulty: (baseDifficulty[level] ?? 0) + offset,
    discrimination: 100,
  };
}

const grammarQuestions: QuestionDef[] = [
  q("A0", "grammar", "verb_conjugation", "Io ___ italiano.", ["sono", "sei", "siamo", "siete"], "sono"),
  q("A0", "grammar", "articles", "Questa ___ una mela.", ["è", "sei", "sono", "siamo"], "è"),
  q("A0", "grammar", "verb_conjugation", "Tu ___ un ragazzo.", ["sei", "sono", "è", "siamo"], "sei"),

  q("A1", "grammar", "verb_conjugation", "Maria ___ il caffè ogni mattina.", ["beve", "bevi", "beviamo", "bevono"], "beve"),
  q("A1", "grammar", "articles", "Ho comprato ___ libro molto bello.", ["un", "uno", "una", "un'"], "un"),
  q("A1", "grammar", "prepositions", "Vado ___ scuola alle otto.", ["a", "in", "di", "da"], "a"),

  q("A2", "grammar", "tenses", "Ieri Maria ___ al supermercato.", ["è andata", "ha andato", "va", "andava"], "è andata"),
  q("A2", "grammar", "pronouns", "Questa borsa è ___. Non toccarla!", ["mia", "mio", "miei", "mie"], "mia"),
  q("A2", "grammar", "prepositions", "Il gatto è nascosto ___ il divano.", ["dietro", "sopra", "dentro", "fra"], "dietro"),

  q("B1", "grammar", "subjunctive", "Penso che Marco ___ ragione.", ["abbia", "ha", "avrebbe", "avrà"], "abbia"),
  q("B1", "grammar", "tenses", "Se avessi più tempo, ___ un corso di cucina.", ["farei", "faccio", "facevo", "farò"], "farei"),
  q("B1", "grammar", "pronouns", "La torta? ___ ho già mangiata tutta!", ["L'", "La", "Le", "Li"], "L'"),

  q("B2", "grammar", "subjunctive", "Magari ___ venire alla festa, ma purtroppo devo lavorare.", ["potessi", "posso", "potevo", "potrò"], "potessi"),
  q("B2", "grammar", "tenses", "Se lo avessi saputo prima, te lo ___.", ["avrei detto", "ho detto", "dicevo", "dirò"], "avrei detto"),

  q("C1", "grammar", "subjunctive", "Benché la situazione ___ complessa, il governo ha trovato una soluzione.", ["fosse", "era", "è", "sarà"], "fosse"),
  q("C1", "grammar", "tenses", "Qualora il candidato ___ i requisiti, verrà convocato per un colloquio.", ["soddisfacesse", "soddisfa", "soddisferà", "soddisfaceva"], "soddisfacesse"),
];

const vocabularyQuestions: QuestionDef[] = [
  q("A0", "vocabulary", "everyday_life", "Come si dice 'house' in italiano?", ["Casa", "Macchina", "Tavolo", "Sedia"], "Casa"),
  q("A0", "vocabulary", "food", "Quale di questi è un frutto?", ["Mela", "Pane", "Latte", "Formaggio"], "Mela"),
  q("A0", "vocabulary", "everyday_life", "Che cos'è una 'sedia'?", ["Un mobile per sedersi", "Un tipo di cibo", "Un animale", "Un colore"], "Un mobile per sedersi"),

  q("A1", "vocabulary", "food", "Al bar ordino un ___ con il latte.", ["cappuccino", "tramezzino", "panino", "gelato"], "cappuccino"),
  q("A1", "vocabulary", "travel", "Per viaggiare in treno devo comprare un ___.", ["biglietto", "giornale", "quaderno", "dizionario"], "biglietto"),
  q("A1", "vocabulary", "everyday_life", "La persona che lavora in un negozio si chiama ___.", ["commesso", "medico", "avvocato", "insegnante"], "commesso"),

  q("A2", "vocabulary", "work", "Il mio ___ mi ha dato un aumento di stipendio.", ["capo", "amico", "vicino", "fratello"], "capo"),
  q("A2", "vocabulary", "culture", "La 'Gioconda' è un famoso ___ di Leonardo da Vinci.", ["dipinto", "romanzo", "edificio", "brano musicale"], "dipinto"),
  q("A2", "vocabulary", "travel", "Prima di partire per l'estero devo rinnovare il ___.", ["passaporto", "portafoglio", "ombrello", "telefono"], "passaporto"),

  q("B1", "vocabulary", "work", "Il ___ è la persona responsabile della gestione di un'azienda.", ["dirigente", "operaio", "stagista", "fattorino"], "dirigente"),
  q("B1", "vocabulary", "culture", "Un ___ è uno spettacolo teatrale cantato.", ["opera lirica", "concerto rock", "mostra d'arte", "film documentario"], "opera lirica"),
  q("B1", "vocabulary", "everyday_life", "Essere 'al verde' significa ___.", ["non avere soldi", "essere felice", "avere fame", "essere malato"], "non avere soldi"),

  q("B2", "vocabulary", "work", "L'azienda ha deciso di ___ il contratto per inadempienza.", ["rescindere", "firmare", "rinnovare", "prorogare"], "rescindere"),
  q("B2", "vocabulary", "culture", "Il termine 'chiaroscuro' nella pittura indica ___.", ["il contrasto tra luce e ombra", "una tecnica di scultura", "un tipo di cornice", "un colore primario"], "il contrasto tra luce e ombra"),

  q("C1", "vocabulary", "work", "La ___ è una strategia aziendale per ridurre la struttura organizzativa.", ["ristrutturazione", "inaugurazione", "promozione", "assunzione"], "ristrutturazione"),
];

const useOfLanguageQuestions: QuestionDef[] = [
  q("A0", "use-of-language", "greetings", "Come rispondi quando qualcuno dice 'Ciao'?", ["Ciao!", "Arrivederci!", "Grazie!", "Scusa!"], "Ciao!"),
  q("A0", "use-of-language", "politeness", "Per ringraziare qualcuno dici ___.", ["Grazie", "Prego", "Scusa", "Buongiorno"], "Grazie"),
  q("A0", "use-of-language", "greetings", "La mattina dici ___.", ["Buongiorno", "Buonanotte", "Arrivederci", "A domani"], "Buongiorno"),

  q("A1", "use-of-language", "requests", "Al ristorante dici: 'Potrei avere ___, per favore?'", ["il menu", "la macchina", "il letto", "la finestra"], "il menu"),
  q("A1", "use-of-language", "directions", "Per chiedere indicazioni dici: 'Mi scusi, ___ la stazione?'", ["dov'è", "cos'è", "chi è", "com'è"], "dov'è"),
  q("A1", "use-of-language", "shopping", "Quanto ___ questa maglietta?", ["costa", "pesa", "misura", "dura"], "costa"),

  q("A2", "use-of-language", "opinions", "Qual è l'espressione corretta per esprimere un'opinione?", ["Secondo me, questo film è interessante.", "Secondo io, questo film è interessante.", "Secondo mio, questo film è interessante.", "Per me dire, questo film è interessante."], "Secondo me, questo film è interessante."),
  q("A2", "use-of-language", "suggestions", "Come suggerisci di andare al cinema?", ["Perché non andiamo al cinema?", "Perché andiamo non al cinema?", "Andiamo perché al cinema?", "Non perché andiamo al cinema?"], "Perché non andiamo al cinema?"),
  q("A2", "use-of-language", "complaints", "Per lamentarti di un servizio dici:", ["Vorrei fare un reclamo.", "Vorrei fare un regalo.", "Vorrei fare un complimento.", "Vorrei fare un viaggio."], "Vorrei fare un reclamo."),

  q("B1", "use-of-language", "formal_register", "In una email formale, come inizi?", ["Gentile Dottore,", "Ciao Dottore,", "Ehi Dottore,", "Salve amico,"], "Gentile Dottore,"),
  q("B1", "use-of-language", "idiomatic", "L'espressione 'in bocca al lupo' si usa per ___.", ["augurare buona fortuna", "insultare qualcuno", "descrivere il tempo", "ordinare del cibo"], "augurare buona fortuna"),
  q("B1", "use-of-language", "connectives", "Completa: 'Ho studiato molto, ___ non ho superato l'esame.'", ["tuttavia", "perciò", "inoltre", "cioè"], "tuttavia"),

  q("B2", "use-of-language", "register", "Quale frase è appropriata in un contesto accademico?", ["Si evince dalla ricerca che i risultati sono significativi.", "La ricerca dice che va tutto bene.", "Secondo me la ricerca è ok.", "La ricerca è figa."], "Si evince dalla ricerca che i risultati sono significativi."),
  q("B2", "use-of-language", "idiomatic", "'Avere le mani in pasta' significa ___.", ["essere coinvolto in qualcosa", "cucinare la pasta", "avere le mani sporche", "essere un cuoco"], "essere coinvolto in qualcosa"),

  q("C1", "use-of-language", "rhetoric", "Quale figura retorica usa la frase 'Era un mare di lacrime'?", ["Metafora", "Similitudine", "Ossimoro", "Anafora"], "Metafora"),
];

const readingQuestions: QuestionDef[] = [
  q("A0", "reading", "everyday_life", "Cosa dice il cartello?", ["Vietato fumare", "Parcheggio gratuito", "Entrata libera", "Uscita di emergenza"], "Vietato fumare",
    "Cartello: VIETATO FUMARE IN TUTTI I LOCALI."),
  q("A0", "reading", "food", "Cosa serve questo locale?", ["Pizza e pasta", "Vestiti", "Libri", "Elettronica"], "Pizza e pasta",
    "Menu: Pizzeria Da Luigi - Pizza margherita 7 euro, Spaghetti al pomodoro 8 euro, Tiramisù 5 euro."),
  q("A0", "reading", "travel", "A che ora parte il treno?", ["Alle 9:30", "Alle 10:00", "Alle 8:15", "Alle 12:00"], "Alle 9:30",
    "Avviso: Il treno per Roma parte alle ore 9:30 dal binario 3."),

  q("A1", "reading", "everyday_life", "Dove abita Marco?", ["A Firenze", "A Roma", "A Milano", "A Napoli"], "A Firenze",
    "Mi chiamo Marco e abito a Firenze. Ho 25 anni e lavoro in un ufficio. La sera mi piace leggere e guardare la televisione."),
  q("A1", "reading", "food", "Cosa compra Giulia al mercato?", ["Frutta e verdura", "Vestiti", "Libri", "Scarpe"], "Frutta e verdura",
    "Giulia va al mercato ogni sabato mattina. Compra frutta e verdura fresca per la settimana. Le piacciono molto le fragole e i pomodori."),
  q("A1", "reading", "travel", "Come va Maria al lavoro?", ["In autobus", "In macchina", "A piedi", "In bicicletta"], "In autobus",
    "Maria prende l'autobus ogni mattina per andare al lavoro. La fermata è vicino a casa sua. Il viaggio dura circa venti minuti."),

  q("A2", "reading", "culture", "Perché Venezia è famosa?", ["Per i suoi canali e gondole", "Per le montagne", "Per le spiagge", "Per i vulcani"], "Per i suoi canali e gondole",
    "Venezia è una delle città più belle d'Italia. È famosa in tutto il mondo per i suoi canali e le sue gondole. Ogni anno milioni di turisti visitano la città per ammirare la sua architettura unica e partecipare al famoso Carnevale."),
  q("A2", "reading", "work", "Quali requisiti servono per il lavoro?", ["Laurea ed esperienza", "Solo il diploma", "Nessun requisito", "Solo la patente"], "Laurea ed esperienza",
    "Cercasi impiegato per ufficio commerciale. Requisiti: laurea in economia, esperienza di almeno due anni nel settore vendite, buona conoscenza dell'inglese. Orario: lunedì-venerdì, 9:00-18:00. Inviare CV a info@azienda.it."),

  q("B1", "reading", "culture", "Qual è l'argomento principale del testo?", ["L'importanza della dieta mediterranea", "La storia della pizza", "I ristoranti italiani", "Le ricette tradizionali"], "L'importanza della dieta mediterranea",
    "La dieta mediterranea è stata riconosciuta dall'UNESCO come patrimonio immateriale dell'umanità nel 2010. Questo modello alimentare, basato sul consumo di olio d'oliva, cereali, frutta, verdura e pesce, è associato a numerosi benefici per la salute, tra cui la riduzione del rischio di malattie cardiovascolari."),
  q("B1", "reading", "work", "Cosa critica l'autore?", ["L'eccessivo uso della tecnologia al lavoro", "I bassi stipendi", "Le ferie troppo brevi", "L'orario di lavoro"], "L'eccessivo uso della tecnologia al lavoro",
    "Nell'era digitale, molti lavoratori si trovano costantemente connessi. Le email, le videochiamate e le notifiche continue rendono difficile separare il tempo lavorativo da quello personale. Diversi esperti sostengono che questa iperconnessione riduca la produttività e aumenti lo stress, creando un paradosso tecnologico."),

  q("B2", "reading", "culture", "Qual è la tesi dell'autore?", ["Che il turismo di massa danneggia le città d'arte", "Che il turismo è sempre positivo", "Che le città italiane sono poco visitate", "Che i musei dovrebbero chiudere"], "Che il turismo di massa danneggia le città d'arte",
    "Il turismo di massa rappresenta una delle sfide più significative per le città d'arte italiane. Se da un lato porta evidenti benefici economici, dall'altro contribuisce al degrado del patrimonio storico, all'aumento del costo della vita per i residenti e alla perdita dell'identità culturale dei centri storici. Firenze, Venezia e Roma sono tra le città più colpite da questo fenomeno, con un numero annuo di visitatori che supera di gran lunga la capacità sostenibile."),
  q("B2", "reading", "everyday_life", "Cosa suggerisce l'articolo?", ["Un approccio equilibrato all'uso dei social media", "Eliminare tutti i social media", "Usare i social media il più possibile", "Che i social media non hanno effetti"], "Un approccio equilibrato all'uso dei social media",
    "I social media hanno rivoluzionato il modo in cui comunichiamo, ma emergono crescenti preoccupazioni riguardo al loro impatto sulla salute mentale. Studi recenti dimostrano una correlazione tra l'uso eccessivo dei social e disturbi d'ansia, depressione e problemi di autostima, soprattutto tra i giovani. Tuttavia, gli esperti sottolineano che non si tratta di demonizzare questi strumenti, bensì di promuovere un utilizzo consapevole e bilanciato."),

  q("C1", "reading", "culture", "Qual è il paradosso descritto dall'autore?", ["Che la globalizzazione omologa le culture mentre promette diversità", "Che la tecnologia è troppo costosa", "Che l'Italia non ha cultura", "Che le tradizioni sono inutili"], "Che la globalizzazione omologa le culture mentre promette diversità",
    "La globalizzazione culturale presenta un paradosso fondamentale: mentre promette di avvicinare i popoli e favorire lo scambio interculturale, tende in realtà a omologare le espressioni culturali locali, sostituendole con modelli standardizzati di origine prevalentemente anglosassone. L'Italia, con il suo ricchissimo patrimonio di dialetti, tradizioni culinarie regionali e pratiche artigianali, si trova a dover bilanciare l'apertura verso l'esterno con la preservazione di un'identità culturale millenaria."),
  q("C1", "reading", "work", "Qual è la conclusione dell'autore?", ["Che servono nuove politiche per gestire la transizione digitale del lavoro", "Che il lavoro da remoto è impossibile", "Che le aziende non devono cambiare", "Che la tecnologia non influenza il lavoro"], "Che servono nuove politiche per gestire la transizione digitale del lavoro",
    "La trasformazione digitale del mercato del lavoro italiano solleva interrogativi complessi sul futuro dell'occupazione. L'automazione e l'intelligenza artificiale stanno ridefinendo interi settori produttivi, rendendo obsolete alcune competenze e creandone di nuove. Il sistema formativo italiano, ancora largamente ancorato a modelli novecenteschi, fatica ad adeguarsi alla velocità del cambiamento. È necessario un ripensamento radicale delle politiche del lavoro e della formazione per garantire una transizione equa e inclusiva."),
];

const listeningQuestions: QuestionDef[] = [
  q("A0", "listening", "everyday_life", "Come si chiama il ragazzo?", ["Marco", "Luca", "Paolo", "Giovanni"], "Marco",
    "Ascolterai:\nRagazzo: Ciao! Mi chiamo Marco. Ho dieci anni."),
  q("A0", "listening", "food", "Cosa vuole la bambina?", ["Un gelato", "Una pizza", "Un panino", "Un'arancia"], "Un gelato",
    "Ascolterai:\nBambina: Mamma, voglio un gelato al cioccolato, per favore!"),
  q("A0", "listening", "everyday_life", "Che giorno è oggi?", ["Lunedì", "Martedì", "Mercoledì", "Giovedì"], "Lunedì",
    "Ascolterai:\nInsegnante: Buongiorno ragazzi! Oggi è lunedì, iniziamo la lezione."),

  q("A1", "listening", "travel", "Dove va il signore?", ["Alla stazione", "All'aeroporto", "Al supermercato", "All'ospedale"], "Alla stazione",
    "Ascolterai:\nSignore: Scusi, mi può dire come arrivare alla stazione? Devo prendere il treno delle dieci."),
  q("A1", "listening", "food", "Cosa ordina la signora?", ["Una pizza margherita e un'acqua minerale", "Una pasta e un vino", "Un caffè e una brioche", "Una bistecca e una birra"], "Una pizza margherita e un'acqua minerale",
    "Ascolterai:\nCameriere: Buonasera, cosa desidera?\nSignora: Una pizza margherita e un'acqua minerale, per favore."),
  q("A1", "listening", "everyday_life", "A che ora si sveglia Anna?", ["Alle sette", "Alle sei", "Alle otto", "Alle nove"], "Alle sette",
    "Ascolterai:\nAnna: Mi sveglio alle sette, faccio colazione e poi vado a scuola a piedi."),

  q("A2", "listening", "travel", "Perché il treno è in ritardo?", ["Per un guasto tecnico", "Per il maltempo", "Per uno sciopero", "Per un incidente"], "Per un guasto tecnico",
    "Ascolterai:\nAnnuncio: Attenzione, il treno regionale per Bologna delle ore 14:30 è in ritardo di venti minuti a causa di un guasto tecnico. Ci scusiamo per il disagio."),
  q("A2", "listening", "work", "Che lavoro fa Roberto?", ["L'insegnante di matematica", "Il medico", "L'avvocato", "L'ingegnere"], "L'insegnante di matematica",
    "Ascolterai:\nRoberto: Lavoro in una scuola media. Insegno matematica da cinque anni. Mi piace molto stare con i ragazzi e spiegare le cose difficili in modo semplice."),
  q("A2", "listening", "everyday_life", "Cosa ha perso la ragazza?", ["Le chiavi di casa", "Il portafoglio", "Il telefono", "Gli occhiali"], "Le chiavi di casa",
    "Ascolterai:\nRagazza: Non trovo più le chiavi di casa! Le avevo nella borsa, ma adesso non ci sono più. Devo chiamare il fabbro."),

  q("B1", "listening", "culture", "Qual è l'opinione della guida sull'arte contemporanea?", ["Che è accessibile a tutti se spiegata bene", "Che è solo per esperti", "Che non ha valore", "Che è meglio dell'arte classica"], "Che è accessibile a tutti se spiegata bene",
    "Ascolterai:\nGuida: Molti pensano che l'arte contemporanea sia incomprensibile, ma non è così. Ogni opera racconta una storia, e con la giusta spiegazione diventa accessibile a tutti. Il nostro compito come guide è proprio quello di costruire ponti tra l'artista e il pubblico."),
  q("B1", "listening", "work", "Qual è il problema principale discusso?", ["La difficoltà di trovare un equilibrio tra lavoro e vita privata", "I bassi stipendi", "La mancanza di lavoro", "Gli orari troppo corti"], "La difficoltà di trovare un equilibrio tra lavoro e vita privata",
    "Ascolterai:\nGiornalista: Secondo un recente sondaggio, il sessanta per cento degli italiani ha difficoltà a trovare un equilibrio tra vita professionale e vita privata. Il problema non è solo il numero di ore lavorate, ma anche la pressione costante delle email e dei messaggi fuori dall'orario d'ufficio."),

  q("B2", "listening", "culture", "Qual è la tesi del professore?", ["Che i dialetti sono una ricchezza culturale da preservare", "Che i dialetti sono obsoleti", "Che tutti dovrebbero parlare solo italiano", "Che i dialetti impediscono la comunicazione"], "Che i dialetti sono una ricchezza culturale da preservare",
    "Ascolterai:\nProfessore: I dialetti italiani non sono versioni corrotte della lingua nazionale, ma sistemi linguistici autonomi con una propria grammatica e un proprio lessico. Rappresentano una ricchezza culturale inestimabile che rischiamo di perdere. Ogni dialetto porta con sé secoli di storia, tradizioni e un modo unico di vedere il mondo."),
  q("B2", "listening", "everyday_life", "Cosa sostiene la psicologa?", ["Che la solitudine è un problema sociale crescente", "Che le persone sono troppo sociali", "Che la tecnologia risolve la solitudine", "Che la solitudine non esiste"], "Che la solitudine è un problema sociale crescente",
    "Ascolterai:\nPsicologa: Viviamo nell'era della connessione digitale, eppure i livelli di solitudine percepita sono in aumento costante. Il paradosso è evidente: siamo più connessi che mai, ma le relazioni superficiali dei social media non sostituiscono i legami autentici. La solitudine è diventata una vera emergenza sociale."),

  q("C1", "listening", "culture", "Qual è il paradosso descritto dall'economista?", ["Che il PIL non misura il benessere reale di un paese", "Che l'economia italiana è in crescita", "Che tutti i paesi sono ricchi", "Che il PIL è perfetto"], "Che il PIL non misura il benessere reale di un paese",
    "Ascolterai:\nEconomista: Il PIL misura l'attività economica, ma non dice nulla sul benessere delle persone. Un incidente stradale fa aumentare il PIL per via delle spese mediche e delle riparazioni. Un genitore che si dedica alla cura dei figli non contribuisce al PIL. Stiamo usando uno strumento inadeguato per orientare le nostre politiche, e poi ci stupiamo se la qualità della vita non migliora."),
  q("C1", "listening", "work", "Cosa critica il sociologo?", ["Che la meritocrazia è un mito che ignora le disuguaglianze strutturali", "Che il merito non esiste", "Che tutti hanno le stesse opportunità", "Che il lavoro non è importante"], "Che la meritocrazia è un mito che ignora le disuguaglianze strutturali",
    "Ascolterai:\nSociologo: La narrazione meritocratica suggerisce che il successo dipenda esclusivamente dall'impegno individuale. Tuttavia, questa visione ignora completamente le disuguaglianze strutturali di partenza: chi nasce in una famiglia agiata ha accesso a reti sociali, istruzione di qualità e opportunità che altri semplicemente non hanno. La meritocrazia, così come viene raccontata, è un mito che serve a giustificare le disuguaglianze esistenti."),
];

export function getItalianTestQuestions(): InsertBeQuestion[] {
  const all = [...grammarQuestions, ...vocabularyQuestions, ...useOfLanguageQuestions, ...readingQuestions, ...listeningQuestions];
  let listeningIdx = 0;
  return all.map(q => {
    let audioUrl: string | null = null;
    if (q.skillType === "listening") {
      const idx = listeningIdx++;
      audioUrl = `/audio/italian/listening_${q.level}_${idx.toString().padStart(3, "0")}.mp3`;
    }
    return {
      language: "italian",
      level: q.level,
      skillType: q.skillType,
      section: q.skillType,
      topic: q.topic,
      question: q.question,
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer,
      passage: q.passage || null,
      audioUrl,
      explanation: null,
      difficulty: q.difficulty,
      discrimination: q.discrimination,
      calibrationStatus: "calibrated",
      calibrationNotes: null,
    };
  });
}

export function getAllQuestions(): InsertBeQuestion[] {
  return getItalianTestQuestions();
}
