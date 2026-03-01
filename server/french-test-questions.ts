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
  q("A0", "grammar", "conjugaison", "Je ___ un étudiant.", ["suis", "es", "est", "sommes"], "suis"),
  q("A0", "grammar", "articles", "Elle a ___ chat.", ["un", "une", "des", "le"], "un"),
  q("A0", "grammar", "conjugaison", "Nous ___ contents.", ["sommes", "sont", "êtes", "suis"], "sommes"),
  q("A1", "grammar", "conjugaison", "Il ___ au bureau chaque matin.", ["va", "vas", "vais", "vont"], "va"),
  q("A1", "grammar", "articles", "Je mange ___ pain.", ["du", "de la", "des", "le"], "du"),
  q("A1", "grammar", "prépositions", "Elle habite ___ Paris.", ["à", "en", "au", "dans"], "à"),
  q("A2", "grammar", "passé_composé", "Hier, nous ___ au cinéma.", ["sommes allés", "avons allé", "sont allés", "êtes allés"], "sommes allés"),
  q("A2", "grammar", "imparfait", "Quand j'étais petit, je ___ beaucoup.", ["jouais", "joué", "jouer", "jouai"], "jouais"),
  q("A2", "grammar", "pronoms", "Ce livre, je ___ ai lu.", ["l'", "le", "la", "les"], "l'"),
  q("A2", "grammar", "négation", "Il ne mange ___ de viande.", ["jamais", "toujours", "souvent", "beaucoup"], "jamais"),
  q("B1", "grammar", "subjonctif", "Il faut que tu ___ tes devoirs.", ["fasses", "fais", "fait", "fera"], "fasses"),
  q("B1", "grammar", "conditionnel", "Si j'avais le temps, je ___ en vacances.", ["partirais", "pars", "partirai", "partais"], "partirais"),
  q("B1", "grammar", "pronoms_relatifs", "La femme ___ je t'ai parlé est médecin.", ["dont", "que", "qui", "où"], "dont"),
  q("B1", "grammar", "pronoms_en_y", "J'___ pense souvent.", ["y", "en", "lui", "le"], "y"),
  q("B2", "grammar", "subjonctif", "Bien qu'il ___ malade, il est venu travailler.", ["soit", "est", "était", "sera"], "soit"),
  q("B2", "grammar", "conditionnel_passé", "Si nous avions su, nous ___ plus tôt.", ["serions partis", "sommes partis", "partirons", "partions"], "serions partis"),
  q("B2", "grammar", "concordance_des_temps", "Il a dit qu'il ___ le lendemain.", ["viendrait", "vient", "venait", "est venu"], "viendrait"),
  q("C1", "grammar", "subjonctif_passé", "Je doute qu'elle ___ la vérité avant-hier.", ["ait dit", "a dit", "avait dit", "dira"], "ait dit"),
];

const vocabularyQuestions: QuestionDef[] = [
  q("A0", "vocabulary", "vie_quotidienne", "Comment dit-on 'house' en français ?", ["Maison", "Voiture", "École", "Jardin"], "Maison"),
  q("A0", "vocabulary", "nourriture", "Quel mot désigne un fruit rouge ?", ["Fraise", "Carotte", "Pomme de terre", "Salade"], "Fraise"),
  q("A0", "vocabulary", "vie_quotidienne", "Quel est le contraire de 'grand' ?", ["Petit", "Gros", "Long", "Large"], "Petit"),
  q("A1", "vocabulary", "nourriture", "Au petit-déjeuner, on mange souvent du ___.", ["pain", "poisson", "riz", "fromage"], "pain"),
  q("A1", "vocabulary", "voyages", "Pour prendre l'avion, on va à ___.", ["l'aéroport", "la gare", "le port", "la station"], "l'aéroport"),
  q("A1", "vocabulary", "travail", "Une personne qui travaille dans un hôpital est un ___.", ["médecin", "avocat", "ingénieur", "professeur"], "médecin"),
  q("A2", "vocabulary", "culture", "Le 14 juillet est la fête ___.", ["nationale", "de Noël", "du travail", "de la musique"], "nationale"),
  q("A2", "vocabulary", "environnement", "Le tri sélectif consiste à ___ les déchets.", ["séparer", "brûler", "enterrer", "mélanger"], "séparer"),
  q("A2", "vocabulary", "voyages", "Pour réserver une chambre, on va à ___.", ["la réception", "la cuisine", "le salon", "le garage"], "la réception"),
  q("B1", "vocabulary", "travail", "Envoyer sa candidature signifie ___ pour un poste.", ["postuler", "démissionner", "licencier", "embaucher"], "postuler"),
  q("B1", "vocabulary", "environnement", "L'effet de serre est lié au ___.", ["réchauffement climatique", "tremblement de terre", "tsunami", "volcanisme"], "réchauffement climatique"),
  q("B1", "vocabulary", "culture", "Un roman policier raconte une histoire de ___.", ["crime et enquête", "voyage et découverte", "cuisine et gastronomie", "sport et compétition"], "crime et enquête"),
  q("B2", "vocabulary", "travail", "Le mot 'proactivité' désigne la capacité à ___.", ["anticiper les situations", "réagir tardivement", "ignorer les problèmes", "suivre les ordres"], "anticiper les situations"),
  q("B2", "vocabulary", "environnement", "La biodiversité désigne ___.", ["la variété des espèces vivantes", "la pollution des océans", "le réchauffement climatique", "la déforestation"], "la variété des espèces vivantes"),
  q("C1", "vocabulary", "culture", "Le terme 'ubiquité' signifie ___.", ["la capacité d'être partout à la fois", "la difficulté de se déplacer", "l'impossibilité de communiquer", "le désir de voyager"], "la capacité d'être partout à la fois"),
];

const useOfLanguageQuestions: QuestionDef[] = [
  q("A0", "use-of-language", "salutations", "Pour dire bonjour le matin, on dit ___.", ["Bonjour", "Bonsoir", "Bonne nuit", "Au revoir"], "Bonjour"),
  q("A0", "use-of-language", "politesse", "Pour remercier quelqu'un, on dit ___.", ["Merci", "Pardon", "S'il vous plaît", "De rien"], "Merci"),
  q("A0", "use-of-language", "présentations", "Pour demander le nom de quelqu'un, on dit : ___", ["Comment vous appelez-vous ?", "Où habitez-vous ?", "Quel âge avez-vous ?", "D'où venez-vous ?"], "Comment vous appelez-vous ?"),
  q("A1", "use-of-language", "directions", "Pour demander son chemin, on dit : ___", ["Excusez-moi, où est la gare ?", "Combien ça coûte ?", "Quelle heure est-il ?", "Vous avez l'heure ?"], "Excusez-moi, où est la gare ?"),
  q("A1", "use-of-language", "achats", "Au marché, pour demander le prix, on dit : ___", ["C'est combien ?", "Où est-ce ?", "Quelle heure est-il ?", "Comment allez-vous ?"], "C'est combien ?"),
  q("A1", "use-of-language", "restaurant", "Pour commander au restaurant, on dit : ___", ["Je voudrais un café, s'il vous plaît.", "Je suis fatigué.", "Il fait beau.", "J'habite à Paris."], "Je voudrais un café, s'il vous plaît."),
  q("A2", "use-of-language", "opinions", "Pour exprimer son accord, on peut dire : ___", ["Je suis tout à fait d'accord.", "Je n'en sais rien.", "Ça m'est égal.", "Je refuse."], "Je suis tout à fait d'accord."),
  q("A2", "use-of-language", "téléphone", "Pour répondre au téléphone, on dit souvent : ___", ["Allô, qui est à l'appareil ?", "Au revoir et bonne journée.", "Enchanté de vous connaître.", "Bon appétit."], "Allô, qui est à l'appareil ?"),
  q("A2", "use-of-language", "excuses", "Pour s'excuser d'être en retard, on dit : ___", ["Excusez-moi du retard.", "Félicitations !", "Bonne chance !", "À vos souhaits !"], "Excusez-moi du retard."),
  q("B1", "use-of-language", "argumentation", "Pour introduire une opposition, on utilise : ___", ["Cependant", "Ensuite", "Par exemple", "En effet"], "Cependant"),
  q("B1", "use-of-language", "conseil", "Pour donner un conseil, on peut dire : ___", ["Tu devrais y réfléchir.", "Je m'en fiche.", "C'est pas mon problème.", "Tant pis pour toi."], "Tu devrais y réfléchir."),
  q("B1", "use-of-language", "hypothèse", "Pour exprimer une hypothèse, on utilise : ___", ["Si j'étais à ta place...", "C'est évident que...", "Il est certain que...", "Sans aucun doute..."], "Si j'étais à ta place..."),
  q("B2", "use-of-language", "nuances", "L'expression 'avoir le cafard' signifie ___.", ["être triste ou déprimé", "avoir très faim", "être en colère", "avoir peur"], "être triste ou déprimé"),
  q("B2", "use-of-language", "registre_soutenu", "Dans un registre soutenu, 'néanmoins' est synonyme de ___.", ["toutefois", "ensuite", "donc", "parce que"], "toutefois"),
  q("C1", "use-of-language", "expressions_idiomatiques", "L'expression 'couper les cheveux en quatre' signifie ___.", ["être trop méticuleux", "aller chez le coiffeur", "être généreux", "parler très vite"], "être trop méticuleux"),
];

const readingQuestions: QuestionDef[] = [
  q("A0", "reading", "vie_quotidienne", "Que fait Marie le matin ?", ["Elle mange un croissant.", "Elle joue au tennis.", "Elle va au cinéma.", "Elle lit un roman."],
    "Elle mange un croissant.",
    "Marie se lève à sept heures. Le matin, elle mange un croissant et boit un café. Puis elle va à l'école."),
  q("A0", "reading", "vie_quotidienne", "Où va Marie après le petit-déjeuner ?", ["À l'école", "Au parc", "Au cinéma", "À la maison"],
    "À l'école",
    "Marie se lève à sept heures. Le matin, elle mange un croissant et boit un café. Puis elle va à l'école."),
  q("A0", "reading", "nourriture", "Qu'est-ce que Pierre achète ?", ["Du lait et du pain", "Des fleurs", "Un livre", "Un téléphone"],
    "Du lait et du pain",
    "Pierre va au supermarché. Il achète du lait et du pain. Il paie à la caisse et rentre chez lui."),
  q("A1", "reading", "voyages", "Comment Paul va-t-il au travail ?", ["En métro", "En avion", "À vélo", "À pied"],
    "En métro",
    "Paul habite à Paris. Chaque matin, il prend le métro pour aller au travail. Le trajet dure vingt minutes. Il travaille dans un bureau près de la Tour Eiffel."),
  q("A1", "reading", "vie_quotidienne", "Où travaille Paul ?", ["Près de la Tour Eiffel", "À la gare", "À l'aéroport", "Dans un restaurant"],
    "Près de la Tour Eiffel",
    "Paul habite à Paris. Chaque matin, il prend le métro pour aller au travail. Le trajet dure vingt minutes. Il travaille dans un bureau près de la Tour Eiffel."),
  q("A1", "reading", "nourriture", "Quand le marché est-il ouvert ?", ["Le samedi matin", "Tous les jours", "Le dimanche soir", "Le lundi après-midi"],
    "Le samedi matin",
    "Dans notre village, il y a un marché le samedi matin. On peut acheter des fruits, des légumes et du fromage frais. C'est très agréable."),
  q("A2", "reading", "culture", "Pourquoi Sophie aime-t-elle la bibliothèque ?", ["Parce qu'elle peut emprunter des livres gratuitement.", "Parce qu'elle y mange.", "Parce qu'elle y dort.", "Parce qu'elle y travaille."],
    "Parce qu'elle peut emprunter des livres gratuitement.",
    "Sophie adore la lecture. Elle va à la bibliothèque municipale tous les mercredis. Elle peut emprunter des livres gratuitement et les garder pendant trois semaines. Elle préfère les romans d'aventure."),
  q("A2", "reading", "environnement", "Que fait la ville pour l'environnement ?", ["Elle installe des pistes cyclables.", "Elle construit des autoroutes.", "Elle coupe des arbres.", "Elle augmente le trafic."],
    "Elle installe des pistes cyclables.",
    "La ville de Lyon veut réduire la pollution. Elle installe des pistes cyclables et encourage les habitants à utiliser les transports en commun. Le maire a aussi planté 500 arbres dans le centre-ville."),
  q("A2", "reading", "travail", "Combien d'heures par semaine travaille Julien ?", ["Trente-cinq heures", "Quarante heures", "Vingt heures", "Cinquante heures"],
    "Trente-cinq heures",
    "Julien travaille dans une entreprise informatique. Il travaille trente-cinq heures par semaine. Il a deux semaines de congés en été. Il aime son travail parce que ses collègues sont sympathiques."),
  q("B1", "reading", "culture", "Selon le texte, quel est l'avantage principal du télétravail ?", ["Un meilleur équilibre entre vie professionnelle et personnelle", "Un salaire plus élevé", "Moins de responsabilités", "Plus de réunions"],
    "Un meilleur équilibre entre vie professionnelle et personnelle",
    "Le télétravail s'est généralisé en France depuis 2020. De nombreuses entreprises proposent désormais deux à trois jours de travail à distance par semaine. Les employés apprécient la flexibilité et un meilleur équilibre entre vie professionnelle et personnelle. Cependant, certains regrettent le manque de contacts humains et la difficulté à séparer travail et vie privée."),
  q("B1", "reading", "environnement", "Quel problème le texte soulève-t-il ?", ["Le gaspillage alimentaire est un enjeu majeur.", "Les supermarchés ferment.", "Les agriculteurs sont en vacances.", "La nourriture est trop chère."],
    "Le gaspillage alimentaire est un enjeu majeur.",
    "En France, environ dix millions de tonnes de nourriture sont gaspillées chaque année. Le gaspillage alimentaire est un enjeu majeur tant sur le plan économique qu'environnemental. La loi interdit désormais aux supermarchés de jeter les invendus alimentaires. Ils doivent les donner à des associations caritatives."),
  q("B1", "reading", "travail", "Que cherchent les jeunes diplômés selon le texte ?", ["Un travail qui a du sens", "Le salaire le plus élevé possible", "Un travail à l'étranger", "Le moins de travail possible"],
    "Un travail qui a du sens",
    "Les jeunes diplômés français cherchent de plus en plus un travail qui a du sens. Selon une récente étude, 70% d'entre eux privilégient la mission de l'entreprise plutôt que le salaire. Ils souhaitent contribuer positivement à la société et sont attirés par les entreprises engagées dans la transition écologique."),
  q("B2", "reading", "culture", "Quelle est la thèse principale de l'auteur ?", ["La culture numérique transforme notre rapport au savoir.", "Les livres vont disparaître.", "Internet est dangereux.", "Les jeunes ne lisent plus."],
    "La culture numérique transforme notre rapport au savoir.",
    "La culture numérique transforme profondément notre rapport au savoir. Alors que la connaissance était autrefois l'apanage des institutions académiques, elle est désormais accessible à tous via Internet. Cette démocratisation soulève néanmoins des questions essentielles : comment distinguer l'information fiable de la désinformation ? Comment développer un esprit critique face à la surabondance de contenus ?"),
  q("B2", "reading", "environnement", "Quel paradoxe l'auteur met-il en évidence ?", ["L'écotourisme peut nuire aux écosystèmes qu'il prétend protéger.", "Le tourisme est toujours bénéfique.", "Les animaux aiment les touristes.", "L'écotourisme n'existe pas."],
    "L'écotourisme peut nuire aux écosystèmes qu'il prétend protéger.",
    "L'écotourisme connaît un essor considérable. Paradoxalement, l'afflux de visiteurs dans des zones naturelles fragiles peut contribuer à la dégradation des écosystèmes que cette forme de tourisme prétend protéger. La surfréquentation des parcs nationaux, le dérangement de la faune et l'érosion des sentiers sont autant de défis que les gestionnaires doivent relever."),
  q("C1", "reading", "culture", "Quel phénomène linguistique l'auteur analyse-t-il ?", ["L'évolution de la langue française sous l'influence du numérique", "La disparition du français", "L'apprentissage du latin", "La traduction automatique"],
    "L'évolution de la langue française sous l'influence du numérique",
    "La langue française subit des mutations profondes sous l'influence du numérique. L'émergence de néologismes, l'hybridation avec l'anglais et la transformation des pratiques d'écriture via les réseaux sociaux témoignent d'une évolution inéluctable. Les puristes y voient un appauvrissement linguistique tandis que les sociolinguistes considèrent ces transformations comme la manifestation naturelle de la vitalité d'une langue vivante. Cette tension entre préservation et innovation constitue le cœur du débat linguistique contemporain."),
];

const listeningQuestions: QuestionDef[] = [
  q("A0", "listening", "vie_quotidienne", "Où va la femme ?", ["Au supermarché", "À la plage", "Au cinéma", "À l'école"], "Au supermarché",
    "Vous entendrez :\nFemme : Bonjour, je vais au supermarché. J'ai besoin de lait et de pain."),
  q("A0", "listening", "nourriture", "Que veut l'homme ?", ["Un café", "Un jus d'orange", "De l'eau", "Du thé"], "Un café",
    "Vous entendrez :\nHomme : Bonjour, je voudrais un café, s'il vous plaît."),
  q("A0", "listening", "vie_quotidienne", "Comment s'appelle la fille ?", ["Sophie", "Marie", "Julie", "Claire"], "Sophie",
    "Vous entendrez :\nFille : Bonjour, je m'appelle Sophie. J'ai huit ans."),
  q("A1", "listening", "voyages", "Comment Pierre va-t-il au travail ?", ["En bus", "En voiture", "À pied", "En vélo"], "En bus",
    "Vous entendrez :\nPierre : Chaque matin, je prends le bus pour aller au travail. Le trajet dure environ quinze minutes."),
  q("A1", "listening", "travail", "À quelle heure commence le cours ?", ["À neuf heures", "À huit heures", "À dix heures", "À midi"], "À neuf heures",
    "Vous entendrez :\nProfesseur : Le cours de français commence à neuf heures. N'oubliez pas vos cahiers."),
  q("A1", "listening", "nourriture", "Que commande la femme ?", ["Une salade et de l'eau", "Un steak et du vin", "Une pizza et un café", "Un sandwich et un jus"], "Une salade et de l'eau",
    "Vous entendrez :\nFemme : Pour moi, ce sera une salade verte et une carafe d'eau, s'il vous plaît."),
  q("A2", "listening", "voyages", "Pourquoi le train est-il en retard ?", ["À cause d'un problème technique", "À cause de la neige", "À cause d'une grève", "À cause d'un accident"], "À cause d'un problème technique",
    "Vous entendrez :\nAnnonce : Mesdames et messieurs, le train à destination de Lyon aura un retard de vingt minutes en raison d'un problème technique. Nous nous excusons pour la gêne occasionnée."),
  q("A2", "listening", "travail", "Que propose le collègue ?", ["De déjeuner ensemble", "De partir en vacances", "De changer de bureau", "De travailler le week-end"], "De déjeuner ensemble",
    "Vous entendrez :\nCollègue : Salut Claire, ça te dit de déjeuner ensemble à midi ? Il y a un nouveau restaurant italien qui vient d'ouvrir à côté du bureau."),
  q("A2", "listening", "culture", "Quel jour est le concert ?", ["Samedi soir", "Dimanche matin", "Vendredi après-midi", "Lundi soir"], "Samedi soir",
    "Vous entendrez :\nAmie : Tu sais quoi ? Il y a un concert gratuit samedi soir au parc municipal. On y va ensemble ?"),
  q("B1", "listening", "environnement", "Quelle solution le maire propose-t-il ?", ["Interdire les voitures dans le centre-ville", "Construire plus de parkings", "Augmenter le prix de l'essence", "Fermer les écoles"], "Interdire les voitures dans le centre-ville",
    "Vous entendrez :\nMaire : Face à la pollution croissante, nous avons décidé d'interdire les voitures dans le centre-ville à partir du mois prochain. Des navettes électriques gratuites seront mises en place pour faciliter les déplacements des habitants."),
  q("B1", "listening", "travail", "Quel est le principal changement annoncé ?", ["Le passage au télétravail trois jours par semaine", "L'augmentation des salaires", "La réduction des équipes", "Le déménagement des bureaux"], "Le passage au télétravail trois jours par semaine",
    "Vous entendrez :\nDirectrice : Suite aux résultats de notre enquête interne, nous avons décidé de généraliser le télétravail à raison de trois jours par semaine. Cette mesure prendra effet dès le mois prochain. Nous sommes convaincus que cela améliorera votre qualité de vie au travail."),
  q("B1", "listening", "culture", "Que critique le journaliste ?", ["Le manque de diversité dans les musées", "Le prix des billets de cinéma", "La qualité de la nourriture", "Le bruit dans les rues"], "Le manque de diversité dans les musées",
    "Vous entendrez :\nJournaliste : Les musées français font face à une critique récurrente : le manque de diversité dans leurs collections. Malgré les efforts récents, les œuvres exposées ne reflètent pas suffisamment la richesse des cultures du monde. Plusieurs associations militent pour une représentation plus inclusive."),
  q("B2", "listening", "environnement", "Quel dilemme le scientifique expose-t-il ?", ["L'énergie nucléaire est décarbonée mais présente des risques.", "Le solaire est trop cher.", "Le vent ne souffle pas assez.", "Le charbon est propre."], "L'énergie nucléaire est décarbonée mais présente des risques.",
    "Vous entendrez :\nScientifique : Le débat sur l'énergie nucléaire illustre parfaitement les dilemmes de la transition écologique. D'un côté, le nucléaire est une source d'énergie décarbonée qui contribue à la lutte contre le réchauffement climatique. De l'autre, la gestion des déchets radioactifs et le risque d'accident restent des préoccupations majeures."),
  q("B2", "listening", "travail", "Quel phénomène la sociologue décrit-elle ?", ["La perte de sens au travail chez les cadres", "La hausse des salaires", "La diminution du chômage", "L'augmentation du temps libre"], "La perte de sens au travail chez les cadres",
    "Vous entendrez :\nSociologue : On observe un phénomène croissant de perte de sens au travail, particulièrement chez les cadres. De plus en plus de professionnels qualifiés quittent des postes bien rémunérés pour se reconvertir dans des métiers qu'ils jugent plus utiles à la société. Ce phénomène, que certains appellent la 'grande démission', interroge profondément notre modèle économique."),
  q("C1", "listening", "culture", "Quelle thèse le philosophe défend-il ?", ["Que la vitesse de l'information nuit à la réflexion critique", "Que la technologie résout tous les problèmes", "Que les réseaux sociaux sont bénéfiques", "Que la lecture est inutile"], "Que la vitesse de l'information nuit à la réflexion critique",
    "Vous entendrez :\nPhilosophe : Nous vivons dans une ère de l'immédiat où l'information circule à une vitesse vertigineuse. Cette accélération permanente laisse de moins en moins de place à la réflexion critique. Le temps de la pensée, celui qui permet de prendre du recul, d'analyser et de nuancer, est en train de disparaître au profit d'une réaction instantanée et souvent superficielle."),
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
