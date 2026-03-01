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
  q("A0", "grammar", "conjugaison", "Je ___ un etudiant.", ["suis", "es", "est", "sommes"], "suis"),
  q("A0", "grammar", "articles", "Elle a ___ chat.", ["un", "une", "des", "le"], "un"),
  q("A0", "grammar", "conjugaison", "Nous ___ contents.", ["sommes", "sont", "etes", "suis"], "sommes"),
  q("A1", "grammar", "conjugaison", "Il ___ au bureau chaque matin.", ["va", "vas", "vais", "vont"], "va"),
  q("A1", "grammar", "articles", "Je mange ___ pain.", ["du", "de la", "des", "le"], "du"),
  q("A1", "grammar", "prepositions", "Elle habite ___ Paris.", ["a", "en", "au", "dans"], "a"),
  q("A2", "grammar", "passe_compose", "Hier, nous ___ au cinema.", ["sommes alles", "avons alle", "sont alles", "etes alles"], "sommes alles"),
  q("A2", "grammar", "imparfait", "Quand j'etais petit, je ___ beaucoup.", ["jouais", "joue", "jouer", "jouai"], "jouais"),
  q("A2", "grammar", "pronoms", "Ce livre, je ___ ai lu.", ["l'", "le", "la", "les"], "l'"),
  q("B1", "grammar", "subjonctif", "Il faut que tu ___ tes devoirs.", ["fasses", "fais", "fait", "fera"], "fasses"),
  q("B1", "grammar", "conditionnel", "Si j'avais le temps, je ___ en vacances.", ["partirais", "pars", "partirai", "partais"], "partirais"),
  q("B1", "grammar", "pronoms_relatifs", "La femme ___ je t'ai parle est medecin.", ["dont", "que", "qui", "ou"], "dont"),
  q("B2", "grammar", "subjonctif", "Bien qu'il ___ malade, il est venu travailler.", ["soit", "est", "etait", "sera"], "soit"),
  q("B2", "grammar", "conditionnel_passe", "Si nous avions su, nous ___ plus tot.", ["serions partis", "sommes partis", "partirons", "partions"], "serions partis"),
  q("C1", "grammar", "subjonctif_passe", "Je doute qu'elle ___ la verite avant hier.", ["ait dit", "a dit", "avait dit", "dira"], "ait dit"),
];

const vocabularyQuestions: QuestionDef[] = [
  q("A0", "vocabulary", "vie_quotidienne", "Comment dit-on 'house' en francais ?", ["Maison", "Voiture", "Ecole", "Jardin"], "Maison"),
  q("A0", "vocabulary", "nourriture", "Quel mot designe un fruit rouge ?", ["Fraise", "Carotte", "Pomme de terre", "Salade"], "Fraise"),
  q("A0", "vocabulary", "vie_quotidienne", "Quel est le contraire de 'grand' ?", ["Petit", "Gros", "Long", "Large"], "Petit"),
  q("A1", "vocabulary", "nourriture", "Au petit-dejeuner, on mange souvent du ___.", ["pain", "poisson", "riz", "fromage"], "pain"),
  q("A1", "vocabulary", "voyages", "Pour prendre l'avion, on va a ___.", ["l'aeroport", "la gare", "le port", "la station"], "l'aeroport"),
  q("A1", "vocabulary", "travail", "Une personne qui travaille dans un hopital est un ___.", ["medecin", "avocat", "ingenieur", "professeur"], "medecin"),
  q("A2", "vocabulary", "culture", "Le 14 juillet est la fete ___.", ["nationale", "de Noel", "du travail", "de la musique"], "nationale"),
  q("A2", "vocabulary", "environnement", "Le tri selectif consiste a ___ les dechets.", ["separer", "bruler", "enterrer", "melanger"], "separer"),
  q("A2", "vocabulary", "voyages", "Pour reserver une chambre, on va a ___.", ["la reception", "la cuisine", "le salon", "le garage"], "la reception"),
  q("B1", "vocabulary", "travail", "Envoyer sa candidature signifie ___ pour un poste.", ["postuler", "demissionner", "licencier", "embaucher"], "postuler"),
  q("B1", "vocabulary", "environnement", "L'effet de serre est lie au ___.", ["rechauffement climatique", "tremblement de terre", "tsunami", "volcanisme"], "rechauffement climatique"),
  q("B1", "vocabulary", "culture", "Un roman policier raconte une histoire de ___.", ["crime et enquete", "voyage et decouverte", "cuisine et gastronomie", "sport et competition"], "crime et enquete"),
  q("B2", "vocabulary", "travail", "Le mot 'proactivite' designe la capacite a ___.", ["anticiper les situations", "reagir tardivement", "ignorer les problemes", "suivre les ordres"], "anticiper les situations"),
  q("B2", "vocabulary", "environnement", "La biodiversite designe ___.", ["la variete des especes vivantes", "la pollution des oceans", "le rechauffement climatique", "la deforestation"], "la variete des especes vivantes"),
  q("C1", "vocabulary", "culture", "Le terme 'ubiquite' signifie ___.", ["la capacite d'etre partout a la fois", "la difficulte de se deplacer", "l'impossibilite de communiquer", "le desir de voyager"], "la capacite d'etre partout a la fois"),
];

const useOfLanguageQuestions: QuestionDef[] = [
  q("A0", "use-of-language", "salutations", "Pour dire bonjour le matin, on dit ___.", ["Bonjour", "Bonsoir", "Bonne nuit", "Au revoir"], "Bonjour"),
  q("A0", "use-of-language", "politesse", "Pour remercier quelqu'un, on dit ___.", ["Merci", "Pardon", "S'il vous plait", "De rien"], "Merci"),
  q("A0", "use-of-language", "presentations", "Pour demander le nom de quelqu'un, on dit : ___", ["Comment vous appelez-vous ?", "Ou habitez-vous ?", "Quel age avez-vous ?", "D'ou venez-vous ?"], "Comment vous appelez-vous ?"),
  q("A1", "use-of-language", "directions", "Pour demander son chemin, on dit : ___", ["Excusez-moi, ou est la gare ?", "Combien ca coute ?", "Quelle heure est-il ?", "Vous avez l'heure ?"], "Excusez-moi, ou est la gare ?"),
  q("A1", "use-of-language", "achats", "Au marche, pour demander le prix, on dit : ___", ["C'est combien ?", "Ou est-ce ?", "Quelle heure est-il ?", "Comment allez-vous ?"], "C'est combien ?"),
  q("A1", "use-of-language", "restaurant", "Pour commander au restaurant, on dit : ___", ["Je voudrais un cafe, s'il vous plait.", "Je suis fatigue.", "Il fait beau.", "J'habite a Paris."], "Je voudrais un cafe, s'il vous plait."),
  q("A2", "use-of-language", "opinions", "Pour exprimer son accord, on peut dire : ___", ["Je suis tout a fait d'accord.", "Je n'en sais rien.", "Ca m'est egal.", "Je refuse."], "Je suis tout a fait d'accord."),
  q("A2", "use-of-language", "telephone", "Pour repondre au telephone, on dit souvent : ___", ["Allo, qui est a l'appareil ?", "Au revoir et bonne journee.", "Enchante de vous connaitre.", "Bon appetit."], "Allo, qui est a l'appareil ?"),
  q("A2", "use-of-language", "excuses", "Pour s'excuser d'etre en retard, on dit : ___", ["Excusez-moi du retard.", "Felicitations !", "Bonne chance !", "A vos souhaits !"], "Excusez-moi du retard."),
  q("B1", "use-of-language", "argumentation", "Pour introduire une opposition, on utilise : ___", ["Cependant", "Ensuite", "Par exemple", "En effet"], "Cependant"),
  q("B1", "use-of-language", "conseil", "Pour donner un conseil, on peut dire : ___", ["Tu devrais y reflechir.", "Je m'en fiche.", "C'est pas mon probleme.", "Tant pis pour toi."], "Tu devrais y reflechir."),
  q("B1", "use-of-language", "hypothese", "Pour exprimer une hypothese, on utilise : ___", ["Si j'etais a ta place...", "C'est evident que...", "Il est certain que...", "Sans aucun doute..."], "Si j'etais a ta place..."),
  q("B2", "use-of-language", "nuances", "L'expression 'avoir le cafard' signifie ___.", ["etre triste ou deprime", "avoir tres faim", "etre en colere", "avoir peur"], "etre triste ou deprime"),
  q("B2", "use-of-language", "registre_soutenu", "Dans un registre soutenu, 'neanmoins' est synonyme de ___.", ["toutefois", "ensuite", "donc", "parce que"], "toutefois"),
  q("C1", "use-of-language", "expressions_idiomatiques", "L'expression 'couper les cheveux en quatre' signifie ___.", ["etre trop meticuleux", "aller chez le coiffeur", "etre genereux", "parler tres vite"], "etre trop meticuleux"),
];

const readingQuestions: QuestionDef[] = [
  q("A0", "reading", "vie_quotidienne", "Que fait Marie le matin ?", ["Elle mange un croissant.", "Elle joue au tennis.", "Elle va au cinema.", "Elle lit un roman."],
    "Elle mange un croissant.",
    "Marie se leve a sept heures. Le matin, elle mange un croissant et boit un cafe. Puis elle va a l'ecole."),
  q("A0", "reading", "vie_quotidienne", "Ou va Marie apres le petit-dejeuner ?", ["A l'ecole", "Au parc", "Au cinema", "A la maison"],
    "A l'ecole",
    "Marie se leve a sept heures. Le matin, elle mange un croissant et boit un cafe. Puis elle va a l'ecole."),
  q("A0", "reading", "nourriture", "Qu'est-ce que Pierre achete ?", ["Du lait et du pain", "Des fleurs", "Un livre", "Un telephone"],
    "Du lait et du pain",
    "Pierre va au supermarche. Il achete du lait et du pain. Il paie a la caisse et rentre chez lui."),
  q("A1", "reading", "voyages", "Comment Paul va-t-il au travail ?", ["En metro", "En avion", "A velo", "A pied"],
    "En metro",
    "Paul habite a Paris. Chaque matin, il prend le metro pour aller au travail. Le trajet dure vingt minutes. Il travaille dans un bureau pres de la Tour Eiffel."),
  q("A1", "reading", "vie_quotidienne", "Ou travaille Paul ?", ["Pres de la Tour Eiffel", "A la gare", "A l'aeroport", "Dans un restaurant"],
    "Pres de la Tour Eiffel",
    "Paul habite a Paris. Chaque matin, il prend le metro pour aller au travail. Le trajet dure vingt minutes. Il travaille dans un bureau pres de la Tour Eiffel."),
  q("A1", "reading", "nourriture", "Quand le marche est-il ouvert ?", ["Le samedi matin", "Tous les jours", "Le dimanche soir", "Le lundi apres-midi"],
    "Le samedi matin",
    "Dans notre village, il y a un marche le samedi matin. On peut acheter des fruits, des legumes et du fromage frais. C'est tres agreable."),
  q("A2", "reading", "culture", "Pourquoi Sophie aime-t-elle la bibliotheque ?", ["Parce qu'elle peut emprunter des livres gratuitement.", "Parce qu'elle y mange.", "Parce qu'elle y dort.", "Parce qu'elle y travaille."],
    "Parce qu'elle peut emprunter des livres gratuitement.",
    "Sophie adore la lecture. Elle va a la bibliotheque municipale tous les mercredis. Elle peut emprunter des livres gratuitement et les garder pendant trois semaines. Elle prefere les romans d'aventure."),
  q("A2", "reading", "environnement", "Que fait la ville pour l'environnement ?", ["Elle installe des pistes cyclables.", "Elle construit des autoroutes.", "Elle coupe des arbres.", "Elle augmente le trafic."],
    "Elle installe des pistes cyclables.",
    "La ville de Lyon veut reduire la pollution. Elle installe des pistes cyclables et encourage les habitants a utiliser les transports en commun. Le maire a aussi plante 500 arbres dans le centre-ville."),
  q("A2", "reading", "travail", "Combien d'heures par semaine travaille Julien ?", ["Trente-cinq heures", "Quarante heures", "Vingt heures", "Cinquante heures"],
    "Trente-cinq heures",
    "Julien travaille dans une entreprise informatique. Il travaille trente-cinq heures par semaine. Il a deux semaines de conges en ete. Il aime son travail parce que ses collegues sont sympathiques."),
  q("B1", "reading", "culture", "Selon le texte, quel est l'avantage principal du teletravail ?", ["Un meilleur equilibre entre vie professionnelle et personnelle", "Un salaire plus eleve", "Moins de responsabilites", "Plus de reunions"],
    "Un meilleur equilibre entre vie professionnelle et personnelle",
    "Le teletravail s'est generalise en France depuis 2020. De nombreuses entreprises proposent desormais deux a trois jours de travail a distance par semaine. Les employes apprecient la flexibilite et un meilleur equilibre entre vie professionnelle et personnelle. Cependant, certains regrettent le manque de contacts humains et la difficulte a separer travail et vie privee."),
  q("B1", "reading", "environnement", "Quel probleme le texte souleve-t-il ?", ["Le gaspillage alimentaire est un enjeu majeur.", "Les supermarches ferment.", "Les agriculteurs sont en vacances.", "La nourriture est trop chere."],
    "Le gaspillage alimentaire est un enjeu majeur.",
    "En France, environ dix millions de tonnes de nourriture sont gaspillees chaque annee. Le gaspillage alimentaire est un enjeu majeur tant sur le plan economique qu'environnemental. La loi interdit desormais aux supermarches de jeter les invendus alimentaires. Ils doivent les donner a des associations caritatives."),
  q("B1", "reading", "travail", "Que cherchent les jeunes diplomes selon le texte ?", ["Un travail qui a du sens", "Le salaire le plus eleve possible", "Un travail a l'etranger", "Le moins de travail possible"],
    "Un travail qui a du sens",
    "Les jeunes diplomes francais cherchent de plus en plus un travail qui a du sens. Selon une recente etude, 70% d'entre eux privilegient la mission de l'entreprise plutot que le salaire. Ils souhaitent contribuer positivement a la societe et sont attires par les entreprises engagees dans la transition ecologique."),
  q("B2", "reading", "culture", "Quelle est la these principale de l'auteur ?", ["La culture numerique transforme notre rapport au savoir.", "Les livres vont disparaitre.", "Internet est dangereux.", "Les jeunes ne lisent plus."],
    "La culture numerique transforme notre rapport au savoir.",
    "La culture numerique transforme profondement notre rapport au savoir. Alors que la connaissance etait autrefois l'apanage des institutions acadmiques, elle est desormais accessible a tous via Internet. Cette democratisation souleve neanmoins des questions essentielles : comment distinguer l'information fiable de la desinformation ? Comment developper un esprit critique face a la surabondance de contenus ?"),
  q("B2", "reading", "environnement", "Quel paradoxe l'auteur met-il en evidence ?", ["L'ecotourisme peut nuire aux ecosystemes qu'il pretend proteger.", "Le tourisme est toujours benefique.", "Les animaux aiment les touristes.", "L'ecotourisme n'existe pas."],
    "L'ecotourisme peut nuire aux ecosystemes qu'il pretend proteger.",
    "L'ecotourisme connait un essor considerable. Paradoxalement, l'afflux de visiteurs dans des zones naturelles fragiles peut contribuer a la degradation des ecosystemes que cette forme de tourisme pretend proteger. La surfenquentation des parcs nationaux, le derangement de la faune et l'erosion des sentiers sont autant de defis que les gestionnaires doivent relever."),
  q("C1", "reading", "culture", "Quel phenomene linguistique l'auteur analyse-t-il ?", ["L'evolution de la langue francaise sous l'influence du numerique", "La disparition du francais", "L'apprentissage du latin", "La traduction automatique"],
    "L'evolution de la langue francaise sous l'influence du numerique",
    "La langue francaise subit des mutations profondes sous l'influence du numerique. L'emergence de neologismes, l'hybridation avec l'anglais et la transformation des pratiques d'ecriture via les reseaux sociaux temoignent d'une evolution ineluctable. Les puristes y voient un appauvrissement linguistique tandis que les sociolinguistes considerent ces transformations comme la manifestation naturelle de la vitalite d'une langue vivante. Cette tension entre preservation et innovation constitue le coeur du debat linguistique contemporain."),
];

const listeningQuestions: QuestionDef[] = [
  q("A0", "listening", "vie_quotidienne", "Ou va la femme ?", ["Au supermarche", "A la plage", "Au cinema", "A l'ecole"], "Au supermarche",
    "Vous entendrez :\nFemme : Bonjour, je vais au supermarche. J'ai besoin de lait et de pain."),
  q("A0", "listening", "nourriture", "Que veut l'homme ?", ["Un cafe", "Un jus d'orange", "De l'eau", "Du the"], "Un cafe",
    "Vous entendrez :\nHomme : Bonjour, je voudrais un cafe, s'il vous plait."),
  q("A0", "listening", "vie_quotidienne", "Comment s'appelle la fille ?", ["Sophie", "Marie", "Julie", "Claire"], "Sophie",
    "Vous entendrez :\nFille : Bonjour, je m'appelle Sophie. J'ai huit ans."),
  q("A1", "listening", "voyages", "Comment Pierre va-t-il au travail ?", ["En bus", "En voiture", "A pied", "En velo"], "En bus",
    "Vous entendrez :\nPierre : Chaque matin, je prends le bus pour aller au travail. Le trajet dure environ quinze minutes."),
  q("A1", "listening", "travail", "A quelle heure commence le cours ?", ["A neuf heures", "A huit heures", "A dix heures", "A midi"], "A neuf heures",
    "Vous entendrez :\nProfesseur : Le cours de francais commence a neuf heures. N'oubliez pas vos cahiers."),
  q("A1", "listening", "nourriture", "Que commande la femme ?", ["Une salade et de l'eau", "Un steak et du vin", "Une pizza et un cafe", "Un sandwich et un jus"], "Une salade et de l'eau",
    "Vous entendrez :\nFemme : Pour moi, ce sera une salade verte et une carafe d'eau, s'il vous plait."),
  q("A2", "listening", "voyages", "Pourquoi le train est-il en retard ?", ["A cause d'un probleme technique", "A cause de la neige", "A cause d'une greve", "A cause d'un accident"], "A cause d'un probleme technique",
    "Vous entendrez :\nAnnonce : Mesdames et messieurs, le train a destination de Lyon aura un retard de vingt minutes en raison d'un probleme technique. Nous nous excusons pour la gene occasionnee."),
  q("A2", "listening", "travail", "Que propose le collegue ?", ["De dejeuner ensemble", "De partir en vacances", "De changer de bureau", "De travailler le week-end"], "De dejeuner ensemble",
    "Vous entendrez :\nCollegue : Salut Claire, ca te dit de dejeuner ensemble a midi ? Il y a un nouveau restaurant italien qui vient d'ouvrir a cote du bureau."),
  q("A2", "listening", "culture", "Quel jour est le concert ?", ["Samedi soir", "Dimanche matin", "Vendredi apres-midi", "Lundi soir"], "Samedi soir",
    "Vous entendrez :\nAmie : Tu sais quoi ? Il y a un concert gratuit samedi soir au parc municipal. On y va ensemble ?"),
  q("B1", "listening", "environnement", "Quelle solution le maire propose-t-il ?", ["Interdire les voitures dans le centre-ville", "Construire plus de parkings", "Augmenter le prix de l'essence", "Fermer les ecoles"], "Interdire les voitures dans le centre-ville",
    "Vous entendrez :\nMaire : Face a la pollution croissante, nous avons decide d'interdire les voitures dans le centre-ville a partir du mois prochain. Des navettes electriques gratuites seront mises en place pour faciliter les deplacements des habitants."),
  q("B1", "listening", "travail", "Quel est le principal changement annonce ?", ["Le passage au teletravail trois jours par semaine", "L'augmentation des salaires", "La reduction des equipes", "Le demenagement des bureaux"], "Le passage au teletravail trois jours par semaine",
    "Vous entendrez :\nDirectrice : Suite aux resultats de notre enquete interne, nous avons decide de generaliser le teletravail a raison de trois jours par semaine. Cette mesure prendra effet des le mois prochain. Nous sommes convaincus que cela ameliorera votre qualite de vie au travail."),
  q("B1", "listening", "culture", "Que critique le journaliste ?", ["Le manque de diversite dans les musees", "Le prix des billets de cinema", "La qualite de la nourriture", "Le bruit dans les rues"], "Le manque de diversite dans les musees",
    "Vous entendrez :\nJournaliste : Les musees francais font face a une critique recurrente : le manque de diversite dans leurs collections. Malgre les efforts recents, les oeuvres exposees ne refletent pas suffisamment la richesse des cultures du monde. Plusieurs associations militent pour une representation plus inclusive."),
  q("B2", "listening", "environnement", "Quel dilemme le scientifique expose-t-il ?", ["L'energie nucleaire est decarbonee mais presente des risques.", "Le solaire est trop cher.", "Le vent ne souffle pas assez.", "Le charbon est propre."], "L'energie nucleaire est decarbonee mais presente des risques.",
    "Vous entendrez :\nScientifique : Le debat sur l'energie nucleaire illustre parfaitement les dilemmes de la transition ecologique. D'un cote, le nucleaire est une source d'energie decarbonee qui contribue a la lutte contre le rechauffement climatique. De l'autre, la gestion des dechets radioactifs et le risque d'accident restent des preoccupations majeures."),
  q("B2", "listening", "travail", "Quel phenomene la sociologue decrit-elle ?", ["La perte de sens au travail chez les cadres", "La hausse des salaires", "La diminution du chomage", "L'augmentation du temps libre"], "La perte de sens au travail chez les cadres",
    "Vous entendrez :\nSociologue : On observe un phenomene croissant de perte de sens au travail, particulierement chez les cadres. De plus en plus de professionnels qualifies quittent des postes bien remuneres pour se reconvertir dans des metiers qu'ils jugent plus utiles a la societe. Ce phenomene, que certains appellent la 'grande demission', interroge profondement notre modele economique."),
  q("C1", "listening", "culture", "Quelle these le philosophe defend-il ?", ["Que la vitesse de l'information nuit a la reflexion critique", "Que la technologie resout tous les problemes", "Que les reseaux sociaux sont benefiques", "Que la lecture est inutile"], "Que la vitesse de l'information nuit a la reflexion critique",
    "Vous entendrez :\nPhilosophe : Nous vivons dans une ere de l'immediat ou l'information circule a une vitesse vertigineuse. Cette acceleration permanente laisse de moins en moins de place a la reflexion critique. Le temps de la pensee, celui qui permet de prendre du recul, d'analyser et de nuancer, est en train de disparaitre au profit d'une reaction instantanee et souvent superficielle."),
];

export function getFrenchTestQuestions(): InsertBeQuestion[] {
  const all = [...grammarQuestions, ...vocabularyQuestions, ...useOfLanguageQuestions, ...readingQuestions, ...listeningQuestions];
  return all.map(q => {
    return {
      language: "french",
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
    };
  });
}

export function getAllQuestions(): InsertBeQuestion[] {
  return getFrenchTestQuestions();
}
