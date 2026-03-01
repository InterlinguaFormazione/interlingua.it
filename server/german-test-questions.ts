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
  q("A0", "grammar", "articles", "Das ist ___ Buch.", ["ein", "eine", "einen", "einem"], "ein"),
  q("A0", "grammar", "articles", "Das ist ___ Katze.", ["eine", "ein", "einen", "einem"], "eine"),
  q("A0", "grammar", "verb_conjugation", "Ich ___ Schüler.", ["bin", "bist", "ist", "sind"], "bin"),

  q("A1", "grammar", "verb_conjugation", "Er ___ jeden Tag zur Arbeit.", ["geht", "gehe", "gehen", "gehst"], "geht"),
  q("A1", "grammar", "articles", "Ich sehe ___ Mann.", ["den", "der", "dem", "des"], "den"),
  q("A1", "grammar", "separable_verbs", "Wann ___ du morgens ___?", ["stehst ... auf", "aufstehst ... ", "stehst ... ab", "auf ... stehst"], "stehst ... auf"),

  q("A2", "grammar", "dativ", "Ich gebe ___ Kind einen Ball.", ["dem", "den", "der", "das"], "dem"),
  q("A2", "grammar", "perfekt", "Wir ___ gestern ins Kino gegangen.", ["sind", "haben", "werden", "waren"], "sind"),
  q("A2", "grammar", "word_order", "Gestern ___ ich einen Film gesehen.", ["habe", "bin", "hatte", "war"], "habe"),

  q("B1", "grammar", "konjunktiv_ii", "Wenn ich reich ___, würde ich reisen.", ["wäre", "bin", "war", "sei"], "wäre"),
  q("B1", "grammar", "relative_clauses", "Das ist der Mann, ___ ich gestern getroffen habe.", ["den", "der", "dem", "dessen"], "den"),
  q("B1", "grammar", "passive", "Das Haus ___ letztes Jahr gebaut.", ["wurde", "wird", "war", "hat"], "wurde"),

  q("B2", "grammar", "genitiv", "Trotz ___ schlechten Wetters gingen wir spazieren.", ["des", "dem", "den", "der"], "des"),
  q("B2", "grammar", "konjunktiv_i", "Er sagte, er ___ keine Zeit.", ["habe", "hat", "hätte", "hatte"], "habe"),
  q("B2", "grammar", "partizip", "Die ___ Aufgabe war sehr schwer.", ["gestellte", "stellende", "gestellende", "gestellt"], "gestellte"),

  q("C1", "grammar", "konjunktiv_ii", "Hätte er früher ___, wäre er nicht zu spät gekommen.", ["angefangen", "anfangen", "anfängt", "angefängt"], "angefangen"),
  q("C1", "grammar", "nominalisierung", "Das ___ des Vertrags dauerte drei Stunden.", ["Aushandeln", "Ausgehandelt", "Aushandelnd", "Aushandlung"], "Aushandeln"),
  q("C1", "grammar", "passiv_ersatz", "Diese Aufgabe ___ sich leicht lösen.", ["lässt", "kann", "wird", "hat"], "lässt"),
];

const vocabularyQuestions: QuestionDef[] = [
  q("A0", "vocabulary", "alltag", "Ein 'Stuhl' ist zum ___.", ["Sitzen", "Essen", "Schlafen", "Lesen"], "Sitzen"),
  q("A0", "vocabulary", "essen", "In der 'Küche' kann man ___.", ["kochen", "schlafen", "schwimmen", "fahren"], "kochen"),
  q("A0", "vocabulary", "reisen", "Mit dem 'Bus' kann man ___.", ["fahren", "fliegen", "schwimmen", "kochen"], "fahren"),

  q("A1", "vocabulary", "alltag", "Ich muss den Bus ___, um zur Arbeit zu kommen.", ["nehmen", "kochen", "bauen", "pflanzen"], "nehmen"),
  q("A1", "vocabulary", "essen", "Die Suppe schmeckt zu ___. Sie braucht mehr Salz.", ["fade", "laut", "hell", "schwer"], "fade"),
  q("A1", "vocabulary", "arbeit", "Mein Bruder ___ in einem Büro.", ["arbeitet", "kocht", "schläft", "schwimmt"], "arbeitet"),

  q("A2", "vocabulary", "reisen", "Der Flug wurde wegen schlechtem Wetter ___.", ["verspätet", "gelöscht", "gestrichen", "vergessen"], "verspätet"),
  q("A2", "vocabulary", "umwelt", "Luft___ ist ein großes Problem in Großstädten.", ["verschmutzung", "verbesserung", "veränderung", "verdünnung"], "verschmutzung"),
  q("A2", "vocabulary", "kultur", "Das ___ zieht Tausende von Besuchern an.", ["Festival", "Fabrik", "Büro", "Krankenhaus"], "Festival"),

  q("B1", "vocabulary", "arbeit", "Sie hat eine sehr ___ Persönlichkeit und findet leicht Freunde.", ["aufgeschlossene", "geschlossene", "verschlossene", "abgeschlossene"], "aufgeschlossene"),
  q("B1", "vocabulary", "umwelt", "Die Regierung hat neue Gesetze zum ___ der Tierwelt eingeführt.", ["Schutz", "Schatz", "Schmerz", "Schnitt"], "Schutz"),
  q("B1", "vocabulary", "kultur", "Das Gemälde gilt als ein ___ der Renaissance.", ["Meisterwerk", "Handwerk", "Bauwerk", "Netzwerk"], "Meisterwerk"),

  q("B2", "vocabulary", "alltag", "Die neuen Regeln hatten einen ___ Einfluss auf das Leben der Menschen.", ["tiefgreifenden", "oberflächlichen", "flüchtigen", "nebensächlichen"], "tiefgreifenden"),
  q("B2", "vocabulary", "umwelt", "Die Abholzung hat ___ Folgen für die Tierwelt.", ["verheerende", "erfreuliche", "unbedeutende", "nebensächliche"], "verheerende"),
  q("B2", "vocabulary", "arbeit", "Das Unternehmen plant, eine neue Version der App zu ___.", ["veröffentlichen", "verstecken", "vergessen", "verbieten"], "veröffentlichen"),

  q("C1", "vocabulary", "kultur", "Der Komponist machte einen ___ Gebrauch von Stille.", ["bedachten", "hastigen", "nachlässigen", "oberflächlichen"], "bedachten"),
  q("C1", "vocabulary", "umwelt", "Die ___ Auswirkungen des Klimawandels werden immer deutlicher.", ["schädlichen", "erfreulichen", "erwünschten", "harmlosen"], "schädlichen"),
  q("C1", "vocabulary", "alltag", "Ihre ___ Bemerkungen beleidigten mehrere Kollegen.", ["bissigen", "freundlichen", "sanften", "höflichen"], "bissigen"),
];

const useOfLanguageQuestions: QuestionDef[] = [
  q("A0", "use_of_language", "alltag", "'Guten Morgen' sagt man, um ___ zu sagen.", ["Hallo", "Tschüss", "Danke", "Entschuldigung"], "Hallo"),
  q("A0", "use_of_language", "essen", "'Wie viel kostet das?' fragt nach dem ___.", ["Preis", "Wetter", "Namen", "Alter"], "Preis"),
  q("A0", "use_of_language", "alltag", "'Auf Wiedersehen' sagt man zum ___.", ["Abschied", "Gruß", "Dank", "Essen"], "Abschied"),

  q("A1", "use_of_language", "alltag", "Welche ist eine gute Art, eine freundliche E-Mail zu beenden?", ["Liebe Grüße", "Sehr geehrte Damen und Herren", "An wen es betrifft", "Hochachtungsvoll"], "Liebe Grüße"),
  q("A1", "use_of_language", "reisen", "'Entschuldigung, wo ist die nächste U-Bahn?' ist eine Art, ___.", ["nach dem Weg zu fragen", "Essen zu bestellen", "sich vorzustellen", "ein Ticket zu kaufen"], "nach dem Weg zu fragen"),
  q("A1", "use_of_language", "essen", "'Die Rechnung, bitte' sagt man am Ende eines ___.", ["Essens", "Films", "Spiels", "Buches"], "Essens"),

  q("A2", "use_of_language", "alltag", "'Ich wäre Ihnen dankbar, wenn...' ist eine höfliche Art, ___.", ["eine Bitte zu äußern", "einen Befehl zu geben", "Ärger auszudrücken", "sich zu verabschieden"], "eine Bitte zu äußern"),
  q("A2", "use_of_language", "reisen", "'Einchecken' im Hotel bedeutet, ___.", ["seine Ankunft anzumelden", "die Rechnung zu bezahlen", "das Zimmer zu reinigen", "das Hotel zu verlassen"], "seine Ankunft anzumelden"),
  q("A2", "use_of_language", "arbeit", "'Überstunden machen' bedeutet, ___ als normal zu arbeiten.", ["länger", "kürzer", "weniger", "langsamer"], "länger"),

  q("B1", "use_of_language", "alltag", "Die Redewendung 'um den heißen Brei herumreden' bedeutet ___.", ["nicht direkt zur Sache kommen", "über Essen sprechen", "sich beschweren", "laut reden"], "nicht direkt zur Sache kommen"),
  q("B1", "use_of_language", "arbeit", "'Benutzerfreundlich' bedeutet, dass etwas ___ ist.", ["leicht zu bedienen", "kostenlos", "sehr teuer", "handgemacht"], "leicht zu bedienen"),
  q("B1", "use_of_language", "umwelt", "'CO2-Fußabdruck' bezieht sich auf die Menge an ___.", ["Treibhausgasen, die durch Aktivitäten entstehen", "Kohlenstoff im Boden", "Fußabdrücken auf Kohle", "Kohlenstoff in Lebensmitteln"], "Treibhausgasen, die durch Aktivitäten entstehen"),

  q("B2", "use_of_language", "kultur", "'Zwischen den Zeilen lesen' bedeutet, ___.", ["die versteckte Bedeutung verstehen", "sehr langsam lesen", "laut vorlesen", "Absätze überspringen"], "die versteckte Bedeutung verstehen"),
  q("B2", "use_of_language", "umwelt", "'Greenwashing' ist, wenn ein Unternehmen ___.", ["fälschlicherweise behauptet, umweltfreundlich zu sein", "grüne Farbe verwendet", "die Umwelt reinigt", "seine Produkte recycelt"], "fälschlicherweise behauptet, umweltfreundlich zu sein"),
  q("B2", "use_of_language", "alltag", "'Des Teufels Advokat spielen' bedeutet, ___.", ["die Gegenposition in einer Diskussion einnehmen", "den Teufel unterstützen", "in einem Spiel betrügen", "ein schlechter Mensch sein"], "die Gegenposition in einer Diskussion einnehmen"),

  q("C1", "use_of_language", "kultur", "'Zeitgeist' bezieht sich auf ___.", ["den Geist oder die Stimmung einer bestimmten Epoche", "eine Uhr", "den neuesten Modetrend", "ein politisches System"], "den Geist oder die Stimmung einer bestimmten Epoche"),
  q("C1", "use_of_language", "alltag", "Eine 'Zwickmühle' beschreibt eine Situation, in der ___.", ["man durch widersprüchliche Bedingungen gefangen ist", "man etwas Wertvolles fängt", "man zweimal gewinnt", "man alles verliert"], "man durch widersprüchliche Bedingungen gefangen ist"),
  q("C1", "use_of_language", "arbeit", "'Auf Augenhöhe verhandeln' bedeutet, ___.", ["gleichberechtigt zu verhandeln", "im Stehen zu verhandeln", "über Augen zu sprechen", "nur kurz zu sprechen"], "gleichberechtigt zu verhandeln"),
];

const readingQuestions: QuestionDef[] = [
  q("A0", "reading", "alltag", "Was sagt das Schild?", ["Das Geschäft ist heute geschlossen", "Der Park ist geöffnet", "Hier kann man essen", "Die Schule beginnt um 8 Uhr"],
    "Das Geschäft ist heute geschlossen",
    "HINWEIS\nDieses Geschäft ist heute geschlossen.\nWir entschuldigen uns für die Unannehmlichkeiten.\nMorgen sind wir ab 9 Uhr wieder für Sie da."),
  q("A0", "reading", "essen", "Was kostet die Suppe?", ["Zwei Euro", "Fünf Euro", "Zehn Euro", "Die Suppe ist gratis"],
    "Zwei Euro",
    "TAGESKARTE\nSuppe: 2,00 €\nSandwich: 3,50 €\nKaffee: 1,50 €"),
  q("A0", "reading", "reisen", "Wann fährt der Zug ab?", ["Um 10 Uhr", "Um Mitternacht", "Am Sonntag", "Nie"],
    "Um 10 Uhr",
    "FAHRPLAN\nBerlin nach München: 10:00 Uhr\nGleis 3"),

  q("A1", "reading", "alltag", "Worum geht es in der Nachricht?", ["Eine Einladung zu einer Geburtstagsfeier", "Eine Absage", "Eine Beschwerde", "Eine Bitte um Hilfe"],
    "Eine Einladung zu einer Geburtstagsfeier",
    "Hallo Max,\nich feiere am Samstag meinen Geburtstag bei mir zu Hause um 18 Uhr. Kommst du? Es gibt Kuchen und Musik!\nBis dann,\nLisa"),
  q("A1", "reading", "reisen", "Was sagt das Schild über das Hotel?", ["Frühstück ist inklusive", "Der Pool ist geschlossen", "Es gibt keine Zimmer", "Auschecken ist um 8 Uhr"],
    "Frühstück ist inklusive",
    "WILLKOMMEN IM HOTEL ALPENBLICK\nFrühstück inklusive: 7:00 - 10:00 Uhr\nWLAN: Kostenlos in allen Zimmern\nAuschecken: 11:00 Uhr"),
  q("A1", "reading", "essen", "Was denkt der Bewerter über das Restaurant?", ["Das Essen war toll, aber teuer", "Der Service war schlecht", "Das Restaurant war geschlossen", "Die Musik war zu laut"],
    "Das Essen war toll, aber teuer",
    "Restaurantbewertung: Zur Alten Mühle\nDie Schnitzel waren fantastisch und die Desserts großartig. Aber die Preise sind ziemlich hoch. Ein Hauptgericht kostet etwa 25 Euro. Für einen besonderen Abend lohnt es sich."),

  q("A2", "reading", "alltag", "Was ist der Hauptratschlag des Autors?", ["So früh wie möglich mit dem Sparen beginnen", "Geld für Erlebnisse ausgeben", "Bankkonten vermeiden", "Von Freunden leihen"],
    "So früh wie möglich mit dem Sparen beginnen",
    "Geldtipps für junge Erwachsene\nEines der klügsten Dinge, die man tun kann, ist so früh wie möglich mit dem Sparen zu beginnen. Selbst kleine monatliche Beträge machen langfristig einen großen Unterschied. Die meisten Experten empfehlen, mindestens 10 % des Einkommens zu sparen."),
  q("A2", "reading", "umwelt", "Was sagt der Bericht?", ["Plastikmüll in den Ozeanen hat sich in zehn Jahren verdoppelt", "Die Ozeane werden sauberer", "Plastik ist kein Problem mehr", "Fischbestände wachsen"],
    "Plastikmüll in den Ozeanen hat sich in zehn Jahren verdoppelt",
    "Umweltbericht\nLaut einem neuen UN-Bericht hat sich der Plastikmüll in den Weltmeeren in den letzten zehn Jahren verdoppelt. Etwa 8 Millionen Tonnen Plastik gelangen jedes Jahr in die Ozeane und bedrohen die Meeresfauna. Der Bericht fordert dringendes Handeln."),
  q("A2", "reading", "arbeit", "Was ändert sich?", ["Neue Sprachanforderung für alle Schüler", "Kürzere Schultage", "Mehr Hausaufgaben", "Weniger Prüfungen"],
    "Neue Sprachanforderung für alle Schüler",
    "An: Alle Schüler und Eltern\nBetreff: Neue Sprachpolitik\nAb September müssen alle Schüler bis zum 16. Lebensjahr mindestens zwei Fremdsprachen lernen. Dies spiegelt unser Ziel wider, Schüler auf eine zunehmend globale Welt vorzubereiten."),

  q("B1", "reading", "alltag", "Was ist die Hauptaussage des Artikels?", ["Dass 30 Minuten Gehen täglich die psychische Gesundheit verbessern kann", "Dass Laufen besser ist als Gehen", "Dass Sport sinnlos ist", "Dass nur junge Menschen Sport treiben sollten"],
    "Dass 30 Minuten Gehen täglich die psychische Gesundheit verbessern kann",
    "Eine Studie im Deutschen Ärzteblatt begleitete 10.000 Erwachsene über drei Jahre und stellte fest, dass diejenigen, die mindestens 30 Minuten pro Tag zügig spazieren gingen, 40 % weniger Symptome von Angst und Depression hatten als diejenigen, die das nicht taten. Die Forscher sagten, dass selbst mäßige Aktivität bei regelmäßiger Durchführung einen großen Einfluss auf das psychische Wohlbefinden haben kann."),
  q("B1", "reading", "umwelt", "Welche Lösung wird vorgeschlagen?", ["Grünflächen in Städten schaffen, um die Luftverschmutzung zu bekämpfen", "Mehr Autobahnen bauen", "Alle Fabriken schließen", "Alle aufs Land ziehen"],
    "Grünflächen in Städten schaffen, um die Luftverschmutzung zu bekämpfen",
    "Initiative Grüne Städte\nImmer mehr Forschung unterstützt die Schaffung von Grünflächen in Städten als Mittel zur Bekämpfung der Luftverschmutzung. Bäume und Pflanzen filtern auf natürliche Weise Schadstoffe, und Studien zeigen, dass Stadtviertel mit mehr Grünflächen 20 % niedrigere Feinstaubwerte aufweisen."),
  q("B1", "reading", "kultur", "Was argumentiert der Artikel?", ["Dass Zweisprachigkeit Vorteile für das Gehirn hat, die bis ins Alter anhalten", "Dass Sprachenlernen Zeitverschwendung ist", "Dass Einsprachige klüger sind", "Dass Kinder nur eine Sprache lernen sollten"],
    "Dass Zweisprachigkeit Vorteile für das Gehirn hat, die bis ins Alter anhalten",
    "Das zweisprachige Gehirn\nForschung in der Zeitschrift Neurologie zeigt, dass Menschen, die zwei oder mehr Sprachen sprechen, im Durchschnitt 4,5 Jahre später Demenzsymptome entwickeln als Einsprachige. Wissenschaftler glauben, dass der regelmäßige Wechsel zwischen Sprachen die Fähigkeit des Gehirns stärkt, sich zu konzentrieren, Probleme zu lösen und flexibel zu bleiben."),

  q("B2", "reading", "alltag", "Welches Paradoxon beschreibt der Artikel?", ["Dass mehr Vernetzung zu mehr Einsamkeit geführt hat", "Dass Telefone kleiner werden", "Dass Menschen mehr schlafen", "Dass soziale Medien abnehmen"],
    "Dass mehr Vernetzung zu mehr Einsamkeit geführt hat",
    "Das Einsamkeitsparadoxon\nIn einer Zeit ständiger digitaler Vernetzung ist Einsamkeit zu einer Epidemie geworden. Eine große Studie der Deutschen Psychologischen Gesellschaft ergab, dass trotz durchschnittlich 338 Online-Verbindungen 46 % der Erwachsenen angeben, sich regelmäßig einsam zu fühlen. Psychologen machen die oberflächliche Natur digitaler Interaktionen verantwortlich."),
  q("B2", "reading", "umwelt", "Wovor warnt der Bericht?", ["Dass der steigende Meeresspiegel bis 2050 200 Millionen Menschen vertreiben wird", "Dass Eisberge wachsen", "Dass die Verschmutzung weltweit sinkt", "Dass Wälder sich ausbreiten"],
    "Dass der steigende Meeresspiegel bis 2050 200 Millionen Menschen vertreiben wird",
    "Klimabericht: Die steigende Flut\nDer neueste IPCC-Bericht zeichnet ein düsteres Bild: Ohne entschiedenes Handeln wird der steigende Meeresspiegel bis 2050 etwa 200 Millionen Menschen aus ihren Häusern vertreiben. Tief liegende Länder wie Bangladesch und die Malediven sind existenziell bedroht."),
  q("B2", "reading", "arbeit", "Welches ethische Dilemma wird diskutiert?", ["Ob KI lebensrettende Entscheidungen im Gesundheitswesen treffen sollte", "Wie man alte Computer repariert", "Welche Programmiersprache die beste ist", "Wie man das Internet beschleunigt"],
    "Ob KI lebensrettende Entscheidungen im Gesundheitswesen treffen sollte",
    "Die Ethik der KI in der Medizin\nWährend KI-Systeme bei der Diagnose von Krankheiten besser werden als menschliche Ärzte, stellt sich eine große ethische Frage: Sollten Algorithmen lebens- und todentscheidende medizinische Entscheidungen treffen dürfen? Ein aktueller Fall, bei dem eine KI einen seltenen Krebs korrekt erkannte, den drei Spezialisten übersehen hatten, hat die Debatte angeheizt."),

  q("C1", "reading", "alltag", "Welchen gesellschaftlichen Wandel analysiert der Artikel?", ["Die Erosion der Privatsphäre im digitalen Zeitalter und ihre Auswirkungen auf die Demokratie", "Wie man sein Passwort schützt", "Die Beliebtheit von Smart Homes", "Tipps fürs Online-Shopping"],
    "Die Erosion der Privatsphäre im digitalen Zeitalter und ihre Auswirkungen auf die Demokratie",
    "Das Ende der Privatsphäre?\nPrivatsphäre, wie frühere Generationen sie verstanden, wird obsolet. Der Überwachungskapitalismus – die Monetarisierung persönlicher Daten durch Technologiekonzerne – hat eine Wirtschaft geschaffen, in der jeder Klick, jeder Kauf und jede Bewegung wertvolle Informationen generiert. Die Auswirkungen gehen über den Handel hinaus: Wenn Menschen wissen, dass sie beobachtet werden, zensieren sie sich selbst, und der demokratische Diskurs leidet."),
  q("C1", "reading", "kultur", "Was untersucht der Essay?", ["Wie die Idee der 'Wahrheit' in der Post-Wahrheits-Ära destabilisiert wurde", "Wie man bessere Aufsätze schreibt", "Die Geschichte des Buchdrucks", "Beliebte Buchempfehlungen"],
    "Wie die Idee der 'Wahrheit' in der Post-Wahrheits-Ära destabilisiert wurde",
    "Wahrheit in der Post-Wahrheits-Ära\nDie objektive Wahrheit, einst das Fundament des aufklärerischen Denkens, ist zutiefst erschüttert worden. Die Flut von Informationsquellen, die Möglichkeit für jeden, Inhalte zu erstellen, und die gezielte Verbreitung von Desinformation haben eine Umgebung geschaffen, in der die Unterscheidung von Fakten und Fiktion mentale Ressourcen erfordert, die die meisten Menschen nicht haben."),
  q("C1", "reading", "umwelt", "Welche grundlegende Spannung untersucht der Artikel?", ["Ob Wirtschaftswachstum und ökologische Nachhaltigkeit koexistieren können", "Wie man Papier recycelt", "Tipps zum Stromsparen", "Die Kosten von Solaranlagen"],
    "Ob Wirtschaftswachstum und ökologische Nachhaltigkeit koexistieren können",
    "Wachstum gegen den Planeten\nDas vorherrschende Wirtschaftsmodell geht davon aus, dass endloses Wachstum sowohl möglich als auch wünschenswert ist. Aber wachsende Beweise deuten darauf hin, dass die Ökosysteme des Planeten eine unendliche Expansion schlicht nicht aushalten können. Die Hoffnung, dass Wirtschaftswachstum durch Technologie vom Ressourcenverbrauch 'entkoppelt' werden kann, hat sich im erforderlichen Maßstab weitgehend nicht erfüllt."),
];

const listeningQuestions: QuestionDef[] = [
  q("A0", "listening", "alltag", "Woher kommt Hans?", ["Berlin", "Paris", "Rom", "London"], "Berlin",
    "Sie hören:\nMann: Hallo! Mein Name ist Hans. Ich komme aus Berlin."),
  q("A0", "listening", "reisen", "Wann fährt der Zug ab?", ["Um 9 Uhr", "Um 10 Uhr", "Um 8 Uhr", "Um 7 Uhr"], "Um 9 Uhr",
    "Sie hören:\nDurchsage: Der Zug nach München fährt um 9 Uhr von Gleis 3 ab."),
  q("A0", "listening", "essen", "Was fragt der Kellner?", ["Nach einem Getränk", "Nach einer Mahlzeit", "Nach der Rechnung", "Nach einem Tisch"], "Nach einem Getränk",
    "Sie hören:\nKellner: Guten Morgen. Möchten Sie Tee oder Kaffee?"),

  q("A1", "listening", "alltag", "Um wie viel Uhr steht diese Person auf?", ["Um 7 Uhr", "Um 6 Uhr", "Um 8 Uhr", "Um 9 Uhr"], "Um 7 Uhr",
    "Sie hören:\nFrau: Wie sieht dein Tagesablauf aus?\nMann: Ich stehe normalerweise um 7 Uhr auf, frühstücke schnell und nehme den Bus zur Arbeit."),
  q("A1", "listening", "reisen", "Was ist mit dem Flug passiert?", ["Er ist verspätet", "Er wurde gestrichen", "Er kam früher an", "Er hat das Ziel geändert"], "Er ist verspätet",
    "Sie hören:\nDurchsage: Achtung bitte. Flug 302 nach Paris ist um zwei Stunden verspätet. Wir entschuldigen uns für die Unannehmlichkeiten."),
  q("A1", "listening", "essen", "Was bestellt die Frau?", ["Einen Salat und Orangensaft", "Einen Burger und Pommes", "Ein Sandwich und Tee", "Pizza und Cola"], "Einen Salat und Orangensaft",
    "Sie hören:\nKellner: Was darf es sein?\nFrau: Ich nehme den Hähnchensalat und einen Orangensaft, bitte."),

  q("A2", "listening", "alltag", "Warum wurde das Meeting verschoben?", ["Der Raum war nicht verfügbar", "Der Sprecher war krank", "Es waren zu viele Leute", "Die Technik war kaputt"], "Der Raum war nicht verfügbar",
    "Sie hören:\nChef: Entschuldigung, aber das Meeting wurde von 14 auf 16 Uhr verschoben. Der Raum war vorher nicht frei.\nKollege: Kein Problem. Ich passe meinen Kalender an."),
  q("A2", "listening", "reisen", "Was sagt der Mann über das Hotel?", ["Die Lage war toll, aber die Zimmer waren klein", "Es war zu teuer", "Das Essen war schlecht", "Es war wegen Renovierung geschlossen"], "Die Lage war toll, aber die Zimmer waren klein",
    "Sie hören:\nFrau: Wie war das Hotel?\nMann: Die Lage war super, mitten im Zentrum. Die Zimmer waren etwas klein, aber für den Preis kann man sich nicht beschweren."),
  q("A2", "listening", "umwelt", "Was prognostiziert der Wissenschaftler?", ["Einen Temperaturanstieg von 2 Grad bis 2050", "Die Temperaturen werden sinken", "Keinen Klimawandel", "Eine Eiszeit bis 2050"], "Einen Temperaturanstieg von 2 Grad bis 2050",
    "Sie hören:\nWissenschaftler: Unsere Daten zeigen, dass bei diesem Tempo die globalen Temperaturen bis 2050 um 2 Grad steigen werden. Das wird schwerwiegende Folgen haben."),

  q("B1", "listening", "alltag", "Was erzählt der Soziologe?", ["Dass die Schere zwischen Arm und Reich wächst", "Dass alle gleich verdienen", "Dass Armut kein Problem ist", "Dass Reichtum unwichtig ist"], "Dass die Schere zwischen Arm und Reich wächst",
    "Sie hören:\nSoziologe: Die Kluft zwischen Arm und Reich wächst stetig. Die oberen zehn Prozent besitzen mehr als die Hälfte des Gesamtvermögens. Das hat ernsthafte Auswirkungen auf den sozialen Zusammenhalt."),
  q("B1", "listening", "arbeit", "Was empfiehlt die Expertin?", ["Eine bessere Work-Life-Balance", "Mehr Überstunden", "Weniger Urlaub", "Längere Arbeitszeiten"], "Eine bessere Work-Life-Balance",
    "Sie hören:\nModeratorin: Was können Unternehmen tun?\nExpertin: Es geht um eine bessere Work-Life-Balance. Studien zeigen, dass Mitarbeiter, die genug Freizeit haben, deutlich produktiver sind."),
  q("B1", "listening", "kultur", "Welcher Vorteil des Sprachenlernens wird genannt?", ["Andere Kulturen verstehen", "Ein höheres Gehalt bekommen", "Günstiger reisen", "Mehr Freunde online finden"], "Andere Kulturen verstehen",
    "Sie hören:\nSprecher: Eine andere Sprache zu lernen öffnet Türen zu anderen Kulturen und anderen Denkweisen. Es verändert wirklich, wie man die Welt sieht."),

  q("B2", "listening", "umwelt", "Was argumentiert die Aktivistin?", ["Dass individuelles Handeln ohne systemischen Wandel nicht ausreicht", "Dass Recycling alles löst", "Dass Einzelpersonen voll verantwortlich sind", "Dass Regierungen nicht helfen können"], "Dass individuelles Handeln ohne systemischen Wandel nicht ausreicht",
    "Sie hören:\nAktivistin: Ich bin es leid, dass die Verantwortung für den Klimawandel auf Einzelpersonen abgewälzt wird. Klar, weniger Plastik verwenden, mit dem Fahrrad zur Arbeit fahren. Aber 100 Unternehmen sind für 71 % der globalen Emissionen verantwortlich. Ohne systemischen Wandel auf Unternehmens- und politischer Ebene ist individuelles Handeln nur Kosmetik."),
  q("B2", "listening", "arbeit", "Was sagt der Kommentator über Homeoffice?", ["Es hat Vorteile, aber die spontane Zusammenarbeit leidet", "Es sollte verboten werden", "Alle lieben es", "Es ist immer besser als Büroarbeit"], "Es hat Vorteile, aber die spontane Zusammenarbeit leidet",
    "Sie hören:\nKommentator: Homeoffice hat zweifellos Vorteile: weniger Pendeln, mehr Flexibilität. Aber etwas geht verloren. Die spontanen Gespräche am Kaffeeautomaten, die zufälligen Ideen – das passiert im Homeoffice einfach nicht. Die Kreativität leidet unter der räumlichen Trennung."),
  q("B2", "listening", "kultur", "Was ist die Argumentation des Professors?", ["Dass Einsamkeit inzwischen eine Krise der öffentlichen Gesundheit ist", "Dass Menschen gerne allein sind", "Dass die Medizin Einsamkeit gelöst hat", "Dass soziale Medien helfen"], "Dass Einsamkeit inzwischen eine Krise der öffentlichen Gesundheit ist",
    "Sie hören:\nProfessor: Wir müssen anfangen, Einsamkeit als Krise der öffentlichen Gesundheit zu behandeln, denn genau das ist sie. Chronische Einsamkeit hat die gleichen gesundheitlichen Auswirkungen wie das Rauchen von 15 Zigaretten pro Tag. Und es wird schlimmer, besonders unter jungen Menschen, was im Zeitalter der sozialen Medien zutiefst widersprüchlich ist."),

  q("C1", "listening", "alltag", "Was behauptet der Philosoph über Entscheidungen?", ["Die meisten Entscheidungen werden von Vorurteilen gesteuert, die wir nicht kennen", "Alle Entscheidungen sind rational", "Wir sollten keine Entscheidungen treffen", "Rationalität hilft immer"], "Die meisten Entscheidungen werden von Vorurteilen gesteuert, die wir nicht kennen",
    "Sie hören:\nPhilosoph: Die Vorstellung, dass wir rationale Entscheidungen treffen, ist im Grunde eine Illusion. Jahrzehnte der Forschung zeigen, dass die meisten unserer Entscheidungen von kognitiven Verzerrungen gesteuert werden, derer wir uns überhaupt nicht bewusst sind.\nModerator: Also ist der freie Wille eine Illusion?\nPhilosoph: Unser Gefühl rationaler Überlegung ist es jedenfalls."),
  q("C1", "listening", "kultur", "Was argumentiert der Historiker über Nationalküchen?", ["Sie sind erfundene Traditionen, keine authentischen", "Alles Essen ist überall gleich", "Essen war vor 200 Jahren besser", "Einwanderung hat die Esskultur ruiniert"], "Sie sind erfundene Traditionen, keine authentischen",
    "Sie hören:\nEssenshistoriker: Die ganze Idee von Nationalküchen ist größtenteils eine Erfindung des 19. Jahrhunderts, verknüpft mit dem Nationalismus. Was wir als 'traditionelle' Gerichte betrachten, ist in der Regel das Ergebnis globaler Handelsrouten, des Kolonialismus und der Einwanderergemeinden, die ihr Essen mitbrachten. Authentizität? Ein Mythos."),
  q("C1", "listening", "umwelt", "Welche Spannung besteht bei klimatischen Kipppunkten?", ["Die Wissenschaft ist real, aber die Sprache des Untergangs kann Menschen resignieren lassen", "Wissenschaftler sind zu optimistisch", "Regierungen und Wissenschaftler reden nicht", "Wirtschaft und Politik kollidieren immer"], "Die Wissenschaft ist real, aber die Sprache des Untergangs kann Menschen resignieren lassen",
    "Sie hören:\nKlimawissenschaftler: Kipppunkte sind wissenschaftlich real und entscheidend wichtig zu verstehen. Aber hier liegt das Problem: Wenn man Wörter wie 'unumkehrbar' und 'Point of no Return' verwendet, können die Menschen tatsächlich fatalistisch werden, anstatt motiviert zu sein. Wenn sie glauben, dass es bereits zu spät ist, hören sie auf, es zu versuchen."),
];

export function getGermanTestQuestions(): InsertBeQuestion[] {
  const all = [...grammarQuestions, ...vocabularyQuestions, ...useOfLanguageQuestions, ...readingQuestions, ...listeningQuestions];
  return all.map(q => ({
    language: "german",
    level: q.level,
    skillType: q.skillType,
    section: q.skillType,
    topic: q.topic,
    question: q.question,
    options: JSON.stringify(q.options),
    correctAnswer: q.correctAnswer,
    passage: q.passage || null,
    audioUrl: null,
    explanation: null,
    difficulty: q.difficulty,
    discrimination: q.discrimination,
    calibrationStatus: "calibrated",
    calibrationNotes: null,
  }));
}

export function getAllQuestions(): InsertBeQuestion[] {
  return getGermanTestQuestions();
}
