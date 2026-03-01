import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AudioTask {
  language: string;
  level: string;
  index: number;
  text: string;
  outputPath: string;
}

function extractSpokenText(passage: string, prefix: string): string {
  let text = passage;
  if (text.startsWith(prefix)) {
    text = text.substring(prefix.length).trim();
  }
  text = text.replace(/\n[A-ZÀ-Ÿa-zà-ÿ]+\s*:\s*/g, "\n");
  text = text.replace(/^\s*:\s*/, "");
  return text.trim();
}

const italianListening = [
  { level: "A0", passage: "Ascolterai:\nRagazzo: Ciao! Mi chiamo Marco. Ho dieci anni." },
  { level: "A0", passage: "Ascolterai:\nBambina: Mamma, voglio un gelato al cioccolato, per favore!" },
  { level: "A0", passage: "Ascolterai:\nInsegnante: Buongiorno ragazzi! Oggi è lunedì, iniziamo la lezione." },
  { level: "A1", passage: "Ascolterai:\nSignore: Scusi, mi può dire come arrivare alla stazione? Devo prendere il treno delle dieci." },
  { level: "A1", passage: "Ascolterai:\nCameriere: Buonasera, cosa desidera?\nSignora: Una pizza margherita e un'acqua minerale, per favore." },
  { level: "A1", passage: "Ascolterai:\nAnna: Mi sveglio alle sette, faccio colazione e poi vado a scuola a piedi." },
  { level: "A2", passage: "Ascolterai:\nAnnuncio: Attenzione, il treno regionale per Bologna delle ore 14:30 è in ritardo di venti minuti a causa di un guasto tecnico. Ci scusiamo per il disagio." },
  { level: "A2", passage: "Ascolterai:\nRoberto: Lavoro in una scuola media. Insegno matematica da cinque anni. Mi piace molto stare con i ragazzi e spiegare le cose difficili in modo semplice." },
  { level: "A2", passage: "Ascolterai:\nRagazza: Non trovo più le chiavi di casa! Le avevo nella borsa, ma adesso non ci sono più. Devo chiamare il fabbro." },
  { level: "B1", passage: "Ascolterai:\nGuida: Molti pensano che l'arte contemporanea sia incomprensibile, ma non è così. Ogni opera racconta una storia, e con la giusta spiegazione diventa accessibile a tutti. Il nostro compito come guide è proprio quello di costruire ponti tra l'artista e il pubblico." },
  { level: "B1", passage: "Ascolterai:\nGiornalista: Secondo un recente sondaggio, il sessanta per cento degli italiani ha difficoltà a trovare un equilibrio tra vita professionale e vita privata. Il problema non è solo il numero di ore lavorate, ma anche la pressione costante delle email e dei messaggi fuori dall'orario d'ufficio." },
  { level: "B2", passage: "Ascolterai:\nProfessore: I dialetti italiani non sono versioni corrotte della lingua nazionale, ma sistemi linguistici autonomi con una propria grammatica e un proprio lessico. Rappresentano una ricchezza culturale inestimabile che rischiamo di perdere. Ogni dialetto porta con sé secoli di storia, tradizioni e un modo unico di vedere il mondo." },
  { level: "B2", passage: "Ascolterai:\nPsicologa: Viviamo nell'era della connessione digitale, eppure i livelli di solitudine percepita sono in aumento costante. Il paradosso è evidente: siamo più connessi che mai, ma le relazioni superficiali dei social media non sostituiscono i legami autentici. La solitudine è diventata una vera emergenza sociale." },
  { level: "C1", passage: "Ascolterai:\nEconomista: Il PIL misura l'attività economica, ma non dice nulla sul benessere delle persone. Un incidente stradale fa aumentare il PIL per via delle spese mediche e delle riparazioni. Un genitore che si dedica alla cura dei figli non contribuisce al PIL. Stiamo usando uno strumento inadeguato per orientare le nostre politiche, e poi ci stupiamo se la qualità della vita non migliora." },
  { level: "C1", passage: "Ascolterai:\nSociologo: La narrazione meritocratica suggerisce che il successo dipenda esclusivamente dall'impegno individuale. Tuttavia, questa visione ignora completamente le disuguaglianze strutturali di partenza: chi nasce in una famiglia agiata ha accesso a reti sociali, istruzione di qualità e opportunità che altri semplicemente non hanno. La meritocrazia, così come viene raccontata, è un mito che serve a giustificare le disuguaglianze esistenti." },
];

const germanListening = [
  { level: "A0", passage: "Sie hören:\nMann: Hallo! Mein Name ist Hans. Ich komme aus Berlin." },
  { level: "A0", passage: "Sie hören:\nDurchsage: Der Zug nach München fährt um 9 Uhr von Gleis 3 ab." },
  { level: "A0", passage: "Sie hören:\nKellner: Guten Morgen. Möchten Sie Tee oder Kaffee?" },
  { level: "A1", passage: "Sie hören:\nFrau: Wie sieht dein Tagesablauf aus?\nMann: Ich stehe normalerweise um 7 Uhr auf, frühstücke schnell und nehme den Bus zur Arbeit." },
  { level: "A1", passage: "Sie hören:\nDurchsage: Achtung bitte. Flug 302 nach Paris ist um zwei Stunden verspätet. Wir entschuldigen uns für die Unannehmlichkeiten." },
  { level: "A1", passage: "Sie hören:\nKellner: Was darf es sein?\nFrau: Ich nehme den Hähnchensalat und einen Orangensaft, bitte." },
  { level: "A2", passage: "Sie hören:\nChef: Entschuldigung, aber das Meeting wurde von 14 auf 16 Uhr verschoben. Der Raum war vorher nicht frei.\nKollege: Kein Problem. Ich passe meinen Kalender an." },
  { level: "A2", passage: "Sie hören:\nFrau: Wie war das Hotel?\nMann: Die Lage war super, mitten im Zentrum. Die Zimmer waren etwas klein, aber für den Preis kann man sich nicht beschweren." },
  { level: "A2", passage: "Sie hören:\nWissenschaftler: Unsere Daten zeigen, dass bei diesem Tempo die globalen Temperaturen bis 2050 um 2 Grad steigen werden. Das wird schwerwiegende Folgen haben." },
  { level: "B1", passage: "Sie hören:\nSoziologe: Die Kluft zwischen Arm und Reich wächst stetig. Die oberen zehn Prozent besitzen mehr als die Hälfte des Gesamtvermögens. Das hat ernsthafte Auswirkungen auf den sozialen Zusammenhalt." },
  { level: "B1", passage: "Sie hören:\nModeratorin: Was können Unternehmen tun?\nExpertin: Es geht um eine bessere Work-Life-Balance. Studien zeigen, dass Mitarbeiter, die genug Freizeit haben, deutlich produktiver sind." },
  { level: "B1", passage: "Sie hören:\nSprecher: Eine andere Sprache zu lernen öffnet Türen zu anderen Kulturen und anderen Denkweisen. Es verändert wirklich, wie man die Welt sieht." },
  { level: "B2", passage: "Sie hören:\nAktivistin: Ich bin es leid, dass die Verantwortung für den Klimawandel auf Einzelpersonen abgewälzt wird. Klar, weniger Plastik verwenden, mit dem Fahrrad zur Arbeit fahren. Aber 100 Unternehmen sind für 71 % der globalen Emissionen verantwortlich. Ohne systemischen Wandel auf Unternehmens- und politischer Ebene ist individuelles Handeln nur Kosmetik." },
  { level: "B2", passage: "Sie hören:\nKommentator: Homeoffice hat zweifellos Vorteile: weniger Pendeln, mehr Flexibilität. Aber etwas geht verloren. Die spontanen Gespräche am Kaffeeautomaten, die zufälligen Ideen – das passiert im Homeoffice einfach nicht. Die Kreativität leidet unter der räumlichen Trennung." },
  { level: "B2", passage: "Sie hören:\nProfessor: Wir müssen anfangen, Einsamkeit als Krise der öffentlichen Gesundheit zu behandeln, denn genau das ist sie. Chronische Einsamkeit hat die gleichen gesundheitlichen Auswirkungen wie das Rauchen von 15 Zigaretten pro Tag. Und es wird schlimmer, besonders unter jungen Menschen, was im Zeitalter der sozialen Medien zutiefst widersprüchlich ist." },
  { level: "C1", passage: "Sie hören:\nPhilosoph: Die Vorstellung, dass wir rationale Entscheidungen treffen, ist im Grunde eine Illusion. Jahrzehnte der Forschung zeigen, dass die meisten unserer Entscheidungen von kognitiven Verzerrungen gesteuert werden, derer wir uns überhaupt nicht bewusst sind.\nModerator: Also ist der freie Wille eine Illusion?\nPhilosoph: Unser Gefühl rationaler Überlegung ist es jedenfalls." },
  { level: "C1", passage: "Sie hören:\nEssenshistoriker: Die ganze Idee von Nationalküchen ist größtenteils eine Erfindung des 19. Jahrhunderts, verknüpft mit dem Nationalismus. Was wir als 'traditionelle' Gerichte betrachten, ist in der Regel das Ergebnis globaler Handelsrouten, des Kolonialismus und der Einwanderergemeinden, die ihr Essen mitbrachten. Authentizität? Ein Mythos." },
  { level: "C1", passage: "Sie hören:\nKlimawissenschaftler: Kipppunkte sind wissenschaftlich real und entscheidend wichtig zu verstehen. Aber hier liegt das Problem: Wenn man Wörter wie 'unumkehrbar' und 'Point of no Return' verwendet, können die Menschen tatsächlich fatalistisch werden, anstatt motiviert zu sein. Wenn sie glauben, dass es bereits zu spät ist, hören sie auf, es zu versuchen." },
];

const frenchListening = [
  { level: "A0", passage: "Vous entendrez :\nFemme : Bonjour, je vais au supermarché. J'ai besoin de lait et de pain." },
  { level: "A0", passage: "Vous entendrez :\nHomme : Bonjour, je voudrais un café, s'il vous plaît." },
  { level: "A0", passage: "Vous entendrez :\nFille : Bonjour, je m'appelle Sophie. J'ai huit ans." },
  { level: "A1", passage: "Vous entendrez :\nPierre : Chaque matin, je prends le bus pour aller au travail. Le trajet dure environ quinze minutes." },
  { level: "A1", passage: "Vous entendrez :\nProfesseur : Le cours de français commence à neuf heures. N'oubliez pas vos cahiers." },
  { level: "A1", passage: "Vous entendrez :\nFemme : Pour moi, ce sera une salade verte et une carafe d'eau, s'il vous plaît." },
  { level: "A2", passage: "Vous entendrez :\nAnnonce : Mesdames et messieurs, le train à destination de Lyon aura un retard de vingt minutes en raison d'un problème technique. Nous nous excusons pour la gêne occasionnée." },
  { level: "A2", passage: "Vous entendrez :\nCollègue : Salut Claire, ça te dit de déjeuner ensemble à midi ? Il y a un nouveau restaurant italien qui vient d'ouvrir à côté du bureau." },
  { level: "A2", passage: "Vous entendrez :\nAmie : Tu sais quoi ? Il y a un concert gratuit samedi soir au parc municipal. On y va ensemble ?" },
  { level: "B1", passage: "Vous entendrez :\nMaire : Face à la pollution croissante, nous avons décidé d'interdire les voitures dans le centre-ville à partir du mois prochain. Des navettes électriques gratuites seront mises en place pour faciliter les déplacements des habitants." },
  { level: "B1", passage: "Vous entendrez :\nDirectrice : Suite aux résultats de notre enquête interne, nous avons décidé de généraliser le télétravail à raison de trois jours par semaine. Cette mesure prendra effet dès le mois prochain. Nous sommes convaincus que cela améliorera votre qualité de vie au travail." },
  { level: "B1", passage: "Vous entendrez :\nJournaliste : Les musées français font face à une critique récurrente : le manque de diversité dans leurs collections. Malgré les efforts récents, les œuvres exposées ne reflètent pas suffisamment la richesse des cultures du monde. Plusieurs associations militent pour une représentation plus inclusive." },
  { level: "B2", passage: "Vous entendrez :\nScientifique : Le débat sur l'énergie nucléaire illustre parfaitement les dilemmes de la transition écologique. D'un côté, le nucléaire est une source d'énergie décarbonée qui contribue à la lutte contre le réchauffement climatique. De l'autre, la gestion des déchets radioactifs et le risque d'accident restent des préoccupations majeures." },
  { level: "B2", passage: "Vous entendrez :\nSociologue : On observe un phénomène croissant de perte de sens au travail, particulièrement chez les cadres. De plus en plus de professionnels qualifiés quittent des postes bien rémunérés pour se reconvertir dans des métiers qu'ils jugent plus utiles à la société. Ce phénomène, que certains appellent la 'grande démission', interroge profondément notre modèle économique." },
  { level: "C1", passage: "Vous entendrez :\nPhilosophe : Nous vivons dans une ère de l'immédiat où l'information circule à une vitesse vertigineuse. Cette accélération permanente laisse de moins en moins de place à la réflexion critique. Le temps de la pensée, celui qui permet de prendre du recul, d'analyser et de nuancer, est en train de disparaître au profit d'une réaction instantanée et souvent superficielle." },
];

const spanishListening = [
  { level: "A0", passage: "Escucharás:\nHombre: ¡Hola! Me llamo Juan. Soy de Madrid." },
  { level: "A0", passage: "Escucharás:\nCamarero: Buenos días. ¿Qué desea tomar? ¿Café o té?" },
  { level: "A0", passage: "Escucharás:\nMujer: Perdone, ¿dónde está el hotel?\nHombre: Está al lado del banco, en la calle Mayor." },
  { level: "A1", passage: "Escucharás:\nMujer: ¿Cómo es tu rutina diaria?\nHombre: Normalmente me levanto a las 7, desayuno algo rápido y cojo el autobús para ir al trabajo." },
  { level: "A1", passage: "Escucharás:\nAnuncio: Atención por favor. El vuelo 302 a Barcelona tiene un retraso de dos horas. Disculpen las molestias." },
  { level: "A1", passage: "Escucharás:\nHombre: ¿Qué tipo de comida te gusta?\nMujer: Me encanta la comida mexicana, especialmente los tacos y las enchiladas. Son mis favoritos." },
  { level: "A2", passage: "Escucharás:\nMujer: Mañana tienes la entrevista, ¿no? Prepárate bien, investiga sobre la empresa y llega unos minutos antes.\nHombre: Sí, tienes razón. Estoy un poco nervioso." },
  { level: "A2", passage: "Escucharás:\nGuía: Estamos en Pamplona durante las fiestas de San Fermín. Estas fiestas se celebran cada julio y son famosas por los encierros de toros. Miles de personas vienen de todo el mundo." },
  { level: "B1", passage: "Escucharás:\nMujer: El mayor reto hoy en día es la conciliación. Muchos trabajadores, especialmente las madres, tienen que elegir entre su carrera profesional y el cuidado de sus hijos. Las empresas necesitan ofrecer más flexibilidad horaria y opciones de teletrabajo." },
  { level: "B1", passage: "Escucharás:\nExperto: Cada año, ocho millones de toneladas de plástico acaban en los océanos. Debemos reducir drásticamente el uso de plásticos de un solo uso. Los gobiernos deben prohibir las bolsas de plástico y fomentar alternativas reutilizables." },
  { level: "B2", passage: "Escucharás:\nHistoriador: La idea de las cocinas nacionales es en gran parte una invención del siglo XIX, vinculada al nacionalismo. Lo que consideramos platos 'tradicionales' son normalmente el resultado de rutas comerciales globales, el colonialismo y las comunidades inmigrantes que trajeron su comida. La autenticidad es un mito." },
  { level: "B2", passage: "Escucharás:\nInvestigadora: La automatización y la inteligencia artificial van a transformar radicalmente el mercado laboral. Se estima que el 40% de los empleos actuales podrían desaparecer en las próximas dos décadas. Y aunque se crearán nuevos puestos, la transición será dolorosa para millones de trabajadores que no tienen las habilidades digitales necesarias." },
  { level: "C1", passage: "Escucharás:\nPsicólogo: Hay una hermosa ironía en la búsqueda de la felicidad. Cuanto más directamente la persigues, más tiende a eludirte. Las personas que reportan mayor satisfacción vital son aquellas que se centran en el sentido y el propósito en lugar de la felicidad en sí misma. Es como si la felicidad tuviera que ser un subproducto, no un objetivo." },
  { level: "C1", passage: "Escucharás:\nCientífica climática: Los puntos de inflexión son científicamente reales y cruciales de entender. Pero aquí está el problema: cuando usas palabras como 'irreversible' y 'punto de no retorno', la gente puede volverse fatalista en lugar de motivarse. Si creen que ya es demasiado tarde, dejan de intentarlo." },
  { level: "C1", passage: "Escucharás:\nEconomista: El PIB mide la actividad económica, pero no dice nada sobre el bienestar, la sostenibilidad o la igualdad. Un vertido de petróleo en realidad aumenta el PIB por los costes de limpieza. Un padre que cría a su hijo en casa no contribuye nada al PIB. Estamos usando una regla para medir la temperatura, y luego nos preguntamos por qué nuestras políticas no mejoran la vida de la gente." },
];

const voiceMap: Record<string, string> = {
  italian: "nova",
  german: "onyx",
  french: "shimmer",
  spanish: "nova",
};

const prefixMap: Record<string, string> = {
  italian: "Ascolterai:",
  german: "Sie hören:",
  french: "Vous entendrez :",
  spanish: "Escucharás:",
};

async function generateAudio(task: AudioTask): Promise<void> {
  const dir = path.dirname(task.outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(task.outputPath)) {
    console.log(`  SKIP (exists): ${task.outputPath}`);
    return;
  }

  const spokenText = extractSpokenText(task.text, prefixMap[task.language]);
  console.log(`  Generating: ${task.outputPath}`);
  console.log(`    Text: ${spokenText.substring(0, 80)}...`);

  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: voiceMap[task.language] as any,
    input: spokenText,
    response_format: "mp3",
    speed: task.level.startsWith("A") ? 0.9 : 1.0,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(task.outputPath, buffer);
  console.log(`  DONE: ${task.outputPath} (${buffer.length} bytes)`);
}

async function main() {
  const basePath = path.join(process.cwd(), "client", "public", "audio");

  const languages: Record<string, typeof italianListening> = {
    italian: italianListening,
    german: germanListening,
    french: frenchListening,
    spanish: spanishListening,
  };

  const tasks: AudioTask[] = [];

  for (const [lang, questions] of Object.entries(languages)) {
    const langDir = path.join(basePath, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    questions.forEach((q, idx) => {
      tasks.push({
        language: lang,
        level: q.level,
        index: idx,
        text: q.passage,
        outputPath: path.join(langDir, `listening_${q.level}_${idx.toString().padStart(3, "0")}.mp3`),
      });
    });
  }

  console.log(`\nTotal audio files to generate: ${tasks.length}`);
  console.log("Languages:", Object.keys(languages).join(", "));
  console.log("");

  for (const [lang, questions] of Object.entries(languages)) {
    console.log(`\n=== ${lang.toUpperCase()} (${questions.length} files) ===`);
    const langTasks = tasks.filter(t => t.language === lang);

    for (let i = 0; i < langTasks.length; i += 3) {
      const batch = langTasks.slice(i, i + 3);
      await Promise.all(batch.map(t => generateAudio(t)));
      if (i + 3 < langTasks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  console.log("\n=== SUMMARY ===");
  for (const lang of Object.keys(languages)) {
    const langDir = path.join(basePath, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith(".mp3"));
    console.log(`${lang}: ${files.length} audio files`);
  }
  console.log("\nAll audio files generated successfully!");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
