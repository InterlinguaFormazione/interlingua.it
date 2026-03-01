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
  q("A0", "grammar", "vida_cotidiana", "Yo ___ estudiante.", ["soy", "es", "eres", "ser"], "soy"),
  q("A0", "grammar", "viajes", "Ella ___ de Italia.", ["es", "soy", "eres", "ser"], "es"),
  q("A0", "grammar", "comida", "Ellos ___ hambre.", ["tienen", "tiene", "tengo", "tener"], "tienen"),

  q("A1", "grammar", "vida_cotidiana", "Ella ___ al trabajo en autobús todos los días.", ["va", "ir", "voy", "vas"], "va"),
  q("A1", "grammar", "trabajo", "Nosotros ___ en una oficina grande.", ["trabajamos", "trabajan", "trabajo", "trabajas"], "trabajamos"),
  q("A1", "grammar", "comida", "La cafetería ___ a las 7 de la mañana.", ["abre", "abrir", "abres", "abren"], "abre"),

  q("A2", "grammar", "vida_cotidiana", "Ayer yo ___ un mensaje a mi amigo.", ["envié", "enviar", "envío", "enviando"], "envié"),
  q("A2", "grammar", "viajes", "La semana pasada nosotros ___ sobre el viaje.", ["hablamos", "hablar", "hablando", "hablan"], "hablamos"),
  q("A2", "grammar", "comida", "El pastel ___ hecho por mi abuela.", ["fue", "es", "ser", "siendo"], "fue"),

  q("B1", "grammar", "vida_cotidiana", "Si hubiéramos salido antes, ___ el tren.", ["habríamos cogido", "cogemos", "cogimos", "cogeremos"], "habríamos cogido"),
  q("B1", "grammar", "trabajo", "El informe ___ por la directora ayer.", ["fue presentado", "presenta", "presentando", "es presentado"], "fue presentado"),
  q("B1", "grammar", "cultura", "El libro, ___ fue publicado en 1990, sigue siendo popular.", ["que", "quien", "donde", "cual"], "que"),

  q("B2", "grammar", "vida_cotidiana", "Es fundamental que cada empleado ___ las normas de seguridad.", ["cumpla", "cumple", "cumplir", "cumplió"], "cumpla"),
  q("B2", "grammar", "medio_ambiente", "No solo ___ el gobierno responsable, sino también las empresas.", ["es", "son", "fue", "siendo"], "es"),
  q("B2", "grammar", "trabajo", "Si yo ___ más tiempo, habría terminado el proyecto.", ["hubiera tenido", "tengo", "tendría", "tuve"], "hubiera tenido"),

  q("C1", "grammar", "vida_cotidiana", "Apenas ___ la noticia cuando la gente empezó a comentarla.", ["se hubo difundido", "se difundió", "difundiéndose", "se difunde"], "se hubo difundido"),
  q("C1", "grammar", "cultura", "Por muy difícil que ___ la situación, no debemos rendirnos.", ["sea", "es", "fue", "siendo"], "sea"),
  q("C1", "grammar", "trabajo", "De no ___ sido por su intervención, el proyecto habría fracasado.", ["haber", "ser", "estar", "tener"], "haber"),
];

const vocabularyQuestions: QuestionDef[] = [
  q("A0", "vocabulary", "vida_cotidiana", "Una 'casa' es un lugar donde la gente ___.", ["vive", "trabaja", "nada", "vuela"], "vive"),
  q("A0", "vocabulary", "comida", "Una 'cocina' es la habitación donde se ___.", ["prepara comida", "duerme", "nada", "conduce"], "prepara comida"),
  q("A0", "vocabulary", "viajes", "Un 'autobús' sirve para ___ personas.", ["transportar", "cocinar", "lavar", "enseñar"], "transportar"),

  q("A1", "vocabulary", "vida_cotidiana", "Necesito ___ el autobús para ir al trabajo.", ["coger", "cocinar", "construir", "cultivar"], "coger"),
  q("A1", "vocabulary", "viajes", "Tenemos que ___ una habitación de hotel para las vacaciones.", ["reservar", "hornear", "plantar", "nadar"], "reservar"),
  q("A1", "vocabulary", "comida", "La sopa está muy ___. Necesita más sal.", ["sosa", "ruidosa", "brillante", "pesada"], "sosa"),

  q("A2", "vocabulary", "trabajo", "Mi jefe me pidió que ___ el informe antes del viernes.", ["entregara", "comiera", "nadara", "pintara"], "entregara"),
  q("A2", "vocabulary", "cultura", "El ___ es un edificio donde se exhiben obras de arte.", ["museo", "hospital", "mercado", "estadio"], "museo"),
  q("A2", "vocabulary", "medio_ambiente", "La ___ es la destrucción de los bosques.", ["deforestación", "contaminación", "inundación", "migración"], "deforestación"),

  q("B1", "vocabulary", "trabajo", "La empresa decidió ___ a veinte nuevos empleados.", ["contratar", "despedir", "jubilarse", "renunciar"], "contratar"),
  q("B1", "vocabulary", "medio_ambiente", "El ___ de gases de efecto invernadero está aumentando.", ["nivel", "color", "sabor", "sonido"], "nivel"),
  q("B1", "vocabulary", "cultura", "La ___ es una celebración tradicional con música y baile.", ["fiesta", "oficina", "fábrica", "biblioteca"], "fiesta"),

  q("B2", "vocabulary", "trabajo", "El ___ es una reunión formal para evaluar a un candidato.", ["entrevista", "fiesta", "clase", "paseo"], "entrevista"),
  q("B2", "vocabulary", "medio_ambiente", "La ___ sostenible busca satisfacer las necesidades del presente sin comprometer el futuro.", ["desarrollo", "destrucción", "abandono", "retroceso"], "desarrollo"),
  q("B2", "vocabulary", "cultura", "'Patrimonio cultural' se refiere a los bienes que una sociedad ___.", ["hereda de sus antepasados", "compra en el mercado", "destruye intencionalmente", "ignora por completo"], "hereda de sus antepasados"),

  q("C1", "vocabulary", "trabajo", "La ___ empresarial implica la capacidad de adaptarse a cambios del mercado.", ["resiliencia", "negligencia", "indiferencia", "rigidez"], "resiliencia"),
  q("C1", "vocabulary", "medio_ambiente", "'Antropoceno' se refiere a la era definida por ___.", ["el impacto significativo del ser humano en la Tierra", "las formaciones rocosas antiguas", "las edades de hielo", "la actividad volcánica"], "el impacto significativo del ser humano en la Tierra"),
  q("C1", "vocabulary", "cultura", "'Idiosincrasia' se refiere a ___.", ["los rasgos distintivos de una persona o pueblo", "una enfermedad rara", "un tipo de comida", "un estilo arquitectónico"], "los rasgos distintivos de una persona o pueblo"),
];

const useOfLanguageQuestions: QuestionDef[] = [
  q("A0", "use_of_language", "vida_cotidiana", "¿Qué significa 'buenos días'?", ["Un saludo por la mañana", "Un saludo por la noche", "Una despedida", "Una disculpa"], "Un saludo por la mañana"),
  q("A0", "use_of_language", "comida", "Si alguien dice '¡Buen provecho!', ¿qué quiere decir?", ["Que disfrutes la comida", "Que la comida está mala", "Que el restaurante está cerrado", "Que es hora de irse"], "Que disfrutes la comida"),

  q("A1", "use_of_language", "vida_cotidiana", "'Estar hecho polvo' significa estar muy ___.", ["cansado", "contento", "hambriento", "rico"], "cansado"),
  q("A1", "use_of_language", "viajes", "'Hacer las maletas' significa ___ para un viaje.", ["preparar el equipaje", "comprar ropa", "perder el avión", "cancelar la reserva"], "preparar el equipaje"),
  q("A1", "use_of_language", "comida", "'Tener buen diente' significa ___.", ["comer mucho y con gusto", "tener dientes bonitos", "ir al dentista", "no comer nada"], "comer mucho y con gusto"),

  q("A2", "use_of_language", "trabajo", "'Echar una mano' significa ___.", ["ayudar a alguien", "tirar algo", "perder algo", "golpear a alguien"], "ayudar a alguien"),
  q("A2", "use_of_language", "cultura", "'Ir de tapas' en España significa ___.", ["comer pequeñas porciones en varios bares", "ir de compras", "visitar museos", "hacer deporte"], "comer pequeñas porciones en varios bares"),
  q("A2", "use_of_language", "vida_cotidiana", "'Quedarse en blanco' significa ___.", ["no poder recordar algo", "pintar de blanco", "estar muy limpio", "usar ropa blanca"], "no poder recordar algo"),

  q("B1", "use_of_language", "trabajo", "'Ponerse las pilas' significa ___.", ["empezar a trabajar con más energía", "comprar pilas nuevas", "ir a la tienda", "descansar un rato"], "empezar a trabajar con más energía"),
  q("B1", "use_of_language", "cultura", "'Estar en las nubes' significa ___.", ["estar distraído o soñando despierto", "estar en un avión", "estar muy alto", "estar triste"], "estar distraído o soñando despierto"),
  q("B1", "use_of_language", "vida_cotidiana", "'No tener pelos en la lengua' significa ___.", ["hablar con total franqueza", "estar calvo", "no poder hablar", "tener problemas de salud"], "hablar con total franqueza"),

  q("B2", "use_of_language", "medio_ambiente", "'Lavado verde' (greenwashing) es cuando una empresa ___.", ["finge falsamente ser ecológica", "usa pintura verde", "limpia el medio ambiente", "recicla sus productos"], "finge falsamente ser ecológica"),
  q("B2", "use_of_language", "cultura", "'Hacer de abogado del diablo' significa ___.", ["argumentar la posición contraria para fomentar el debate", "ser un mal abogado", "engañar en un juego", "ser mala persona"], "argumentar la posición contraria para fomentar el debate"),

  q("C1", "use_of_language", "trabajo", "'Tener la sartén por el mango' significa ___.", ["tener el control de una situación", "cocinar muy bien", "ser camarero", "estar en la cocina"], "tener el control de una situación"),
  q("C1", "use_of_language", "cultura", "'Ser pan comido' significa que algo es ___.", ["muy fácil de hacer", "muy difícil", "imposible", "peligroso"], "muy fácil de hacer"),
  q("C1", "use_of_language", "medio_ambiente", "'Ser una gota en el océano' significa que algo es ___.", ["tan pequeño que casi no hace diferencia", "muy húmedo", "como nadar", "extremadamente importante"], "tan pequeño que casi no hace diferencia"),
];

const readingQuestions: QuestionDef[] = [
  q("A0", "reading", "vida_cotidiana", "¿Qué dice el aviso?", ["La tienda está cerrada hoy", "El parque está abierto todo el día", "Puedes comprar almuerzo aquí", "La escuela empieza a las 8"],
    "La tienda está cerrada hoy",
    "AVISO\nEsta tienda está cerrada hoy.\nDisculpe las molestias.\nAbrimos mañana a las 9:00."),
  q("A0", "reading", "comida", "¿Qué dice el menú?", ["La sopa cuesta dos euros", "La pizza es gratis", "El restaurante está cerrado", "No hay comida hoy"],
    "La sopa cuesta dos euros",
    "MENÚ DEL DÍA\nSopa: 2,00 €\nBocadillo: 3,50 €\nCafé: 1,50 €"),
  q("A0", "reading", "viajes", "¿Cuándo sale el tren?", ["A las 10 de la mañana", "Por la noche", "El domingo", "Nunca"],
    "A las 10 de la mañana",
    "HORARIO DE TRENES\nMadrid a Sevilla: 10:00\nAndén 2\nDuración: 2 horas y 30 minutos"),

  q("A1", "reading", "viajes", "¿Cuándo sale el autobús?", ["A las 10 de la mañana", "Por la noche", "El domingo", "Nunca"],
    "A las 10 de la mañana",
    "HORARIO DE AUTOBUSES\nMadrid a Toledo: 10:00\nAndén 5\nDuración: 1 hora"),
  q("A1", "reading", "vida_cotidiana", "¿Cuál es el hobby de María?", ["Le gusta pintar", "Le gusta cocinar", "Le gusta nadar", "Le gusta cantar"],
    "Le gusta pintar",
    "Me llamo María. Tengo 12 años. Me gusta pintar. Pinto todos los fines de semana."),
  q("A1", "reading", "medio_ambiente", "¿Qué debemos hacer?", ["Ahorrar agua", "Comprar más agua", "Usar agua caliente", "Beber solo agua"],
    "Ahorrar agua",
    "AHORRA AGUA\nPor favor, cierra el grifo cuando te laves los dientes.\nCada gota cuenta."),

  q("A2", "reading", "trabajo", "¿Qué busca la empresa?", ["Un recepcionista con experiencia", "Un cocinero", "Un médico", "Un profesor"],
    "Un recepcionista con experiencia",
    "OFERTA DE EMPLEO\nSe busca recepcionista con experiencia mínima de 2 años.\nHorario: lunes a viernes, 9:00-17:00.\nSalario: según convenio.\nEnviar CV a empleo@hotel.es"),
  q("A2", "reading", "cultura", "¿Cuándo es la fiesta?", ["El sábado por la noche", "El lunes por la mañana", "El viernes por la tarde", "Todos los días"],
    "El sábado por la noche",
    "FIESTAS DEL PUEBLO\nSábado 15 de agosto\nMúsica en vivo desde las 21:00\nPlaza Mayor\nEntrada gratuita"),
  q("A2", "reading", "comida", "¿Qué recomienda el artículo?", ["Comer más frutas y verduras", "Comer solo carne", "No desayunar", "Beber solo refrescos"],
    "Comer más frutas y verduras",
    "Alimentación saludable\nLos expertos recomiendan comer al menos cinco porciones de frutas y verduras al día. También es importante beber mucha agua y reducir el consumo de azúcar y sal. Una dieta equilibrada ayuda a mantener un peso saludable y prevenir enfermedades."),

  q("B1", "reading", "medio_ambiente", "¿Qué dice el artículo sobre los coches eléctricos?", ["Son más ecológicos en general pero la fabricación necesita mejorar", "Son peores para el medio ambiente que los de gasolina", "Son perfectos y no tienen inconvenientes", "Nadie quiere comprarlos"],
    "Son más ecológicos en general pero la fabricación necesita mejorar",
    "¿Son realmente ecológicos los coches eléctricos?\nLos coches eléctricos no producen emisiones al circular, pero la fabricación de las baterías requiere la extracción de metales raros, lo cual causa daño ambiental. Sin embargo, a lo largo de su vida útil, los coches eléctricos producen un 50% menos de emisiones que los de gasolina. El reto ahora es hacer que la producción de baterías sea más limpia."),
  q("B1", "reading", "trabajo", "¿Qué tendencia describe el artículo?", ["El teletrabajo ha aumentado pero no es posible para todos", "Todos los empleados trabajan desde casa", "Las oficinas han desaparecido", "El teletrabajo ha disminuido"],
    "El teletrabajo ha aumentado pero no es posible para todos",
    "El teletrabajo en España\nDesde la pandemia, el teletrabajo se ha consolidado en muchos sectores. Sin embargo, solo el 20% de los trabajadores españoles puede trabajar desde casa. Los empleados del sector servicios, la sanidad y la industria siguen necesitando ir presencialmente. Los expertos señalan que el teletrabajo ha ampliado la brecha entre diferentes tipos de trabajadores."),
  q("B1", "reading", "cultura", "¿Qué dice el artículo sobre el turismo en España?", ["Que el turismo masivo está dañando los lugares más visitados", "Que España no recibe turistas", "Que todos los turistas son respetuosos", "Que el turismo ha desaparecido"],
    "Que el turismo masivo está dañando los lugares más visitados",
    "El turismo masivo en España\nDesde Barcelona hasta Mallorca, los destinos más populares de España están sufriendo las consecuencias del turismo masivo. Los residentes locales se quejan del ruido, la subida de los alquileres y la pérdida de identidad cultural. Algunas ciudades han empezado a limitar los pisos turísticos y a cobrar tasas a los visitantes, pero muchos creen que estas medidas no son suficientes."),

  q("B2", "reading", "cultura", "¿Qué fenómeno explora el artículo?", ["La tensión entre globalización y conservación de lenguas minoritarias", "La popularidad del español en el mundo", "Por qué todos deberían aprender chino", "Cómo escribir un diccionario"],
    "La tensión entre globalización y conservación de lenguas minoritarias",
    "Lenguas en peligro\nLos lingüistas estiman que cada dos semanas muere una lengua. De las aproximadamente 7.000 lenguas que se hablan hoy, casi la mitad están en peligro. La globalización, la urbanización y el dominio de unas pocas lenguas mayoritarias como el inglés, el mandarín y el español están impulsando este declive. Cada lengua perdida representa no solo una forma de comunicarse, sino una manera única de ver el mundo."),
  q("B2", "reading", "medio_ambiente", "¿Qué advierte el informe?", ["Que la subida del nivel del mar desplazará a 200 millones de personas para 2050", "Que los icebergs están creciendo", "Que la contaminación está disminuyendo globalmente", "Que los bosques se están expandiendo"],
    "Que la subida del nivel del mar desplazará a 200 millones de personas para 2050",
    "Informe climático: la marea que sube\nEl último informe del IPCC presenta un panorama sombrío: sin medidas drásticas, la subida del nivel del mar obligará a unas 200 millones de personas a abandonar sus hogares para 2050. Países de baja altitud como Bangladesh, las Maldivas y Tuvalu enfrentan amenazas existenciales. Incluso las naciones ricas están gastando miles de millones en defensas contra inundaciones para ciudades costeras."),
  q("B2", "reading", "trabajo", "¿Qué paradoja describe el artículo?", ["Que más conectividad ha llevado a más soledad", "Que los teléfonos son más pequeños", "Que la gente duerme más", "Que las redes sociales están en declive"],
    "Que más conectividad ha llevado a más soledad",
    "La paradoja de la soledad\nEn una era de conectividad digital constante, la soledad se ha convertido en una epidemia. Un estudio importante encontró que, a pesar de tener una media de 300 conexiones en línea, el 46% de los adultos dice sentirse solo con regularidad. Los psicólogos culpan a la naturaleza superficial de las interacciones digitales, que a menudo reemplazan, en lugar de complementar, las relaciones cara a cara."),

  q("C1", "reading", "trabajo", "¿Qué dilema ético se discute?", ["Si la inteligencia artificial debería tomar decisiones de vida o muerte en la sanidad", "Cómo reparar ordenadores viejos", "Qué lenguaje de programación es mejor", "Cómo acelerar internet"],
    "Si la inteligencia artificial debería tomar decisiones de vida o muerte en la sanidad",
    "La ética de la IA en la medicina\nA medida que los sistemas de inteligencia artificial superan a los médicos humanos en el diagnóstico de enfermedades, surge una gran cuestión ética: ¿deberían los algoritmos tomar decisiones médicas de vida o muerte? Un caso reciente en el que una IA detectó correctamente un cáncer raro que tres especialistas habían pasado por alto ha avivado el debate. Aunque la precisión diagnóstica de la IA es impresionante, los críticos señalan que reducir a los pacientes a datos despoja a la medicina de su humanidad."),
  q("C1", "reading", "cultura", "¿Qué argumenta el artículo?", ["Que la nostalgia es realmente una insatisfacción con el presente", "Que el pasado era genuinamente mejor", "Que la nostalgia es un trastorno mental", "Que todos deberíamos olvidar el pasado"],
    "Que la nostalgia es realmente una insatisfacción con el presente",
    "La trampa de la nostalgia\nLa nostalgia nunca trata realmente del pasado. Es un comentario sobre el presente. Es una forma de expresar insatisfacción con cómo son las cosas, proyectada sobre una versión idealizada de cómo eran. La edad de oro que la gente añora nunca existió realmente. Los historiadores culturales señalan que cada generación ha creído que la anterior vivió mejor, un patrón que se repite desde la antigua Grecia."),
];

const listeningQuestions: QuestionDef[] = [
  q("A0", "listening", "vida_cotidiana", "¿De dónde es Juan?", ["De Madrid", "De París", "De Roma", "De Berlín"], "De Madrid",
    "Escucharás:\nHombre: ¡Hola! Me llamo Juan. Soy de Madrid."),
  q("A0", "listening", "comida", "¿Qué pregunta el camarero?", ["Qué quiere beber", "Qué quiere comer", "La cuenta", "Una mesa"], "Qué quiere beber",
    "Escucharás:\nCamarero: Buenos días. ¿Qué desea tomar? ¿Café o té?"),
  q("A0", "listening", "viajes", "¿Dónde está el hotel?", ["Al lado del banco", "Al lado de la escuela", "Al lado del parque", "Al lado de la tienda"], "Al lado del banco",
    "Escucharás:\nMujer: Perdone, ¿dónde está el hotel?\nHombre: Está al lado del banco, en la calle Mayor."),

  q("A1", "listening", "vida_cotidiana", "¿A qué hora se levanta esta persona?", ["A las 7", "A las 6", "A las 8", "A las 9"], "A las 7",
    "Escucharás:\nMujer: ¿Cómo es tu rutina diaria?\nHombre: Normalmente me levanto a las 7, desayuno algo rápido y cojo el autobús para ir al trabajo."),
  q("A1", "listening", "viajes", "¿Qué ha pasado con el vuelo?", ["Está retrasado", "Está cancelado", "Llegó antes", "Cambió de destino"], "Está retrasado",
    "Escucharás:\nAnuncio: Atención por favor. El vuelo 302 a Barcelona tiene un retraso de dos horas. Disculpen las molestias."),
  q("A1", "listening", "comida", "¿Qué tipo de comida le gusta a esta persona?", ["Comida mexicana", "Comida china", "Comida italiana", "Comida india"], "Comida mexicana",
    "Escucharás:\nHombre: ¿Qué tipo de comida te gusta?\nMujer: Me encanta la comida mexicana, especialmente los tacos y las enchiladas. Son mis favoritos."),

  q("A2", "listening", "trabajo", "¿Qué consejo da la mujer?", ["Que prepare bien la entrevista", "Que llegue tarde", "Que no vaya", "Que cambie de trabajo"], "Que prepare bien la entrevista",
    "Escucharás:\nMujer: Mañana tienes la entrevista, ¿no? Prepárate bien, investiga sobre la empresa y llega unos minutos antes.\nHombre: Sí, tienes razón. Estoy un poco nervioso."),
  q("A2", "listening", "cultura", "¿Qué celebran?", ["Las fiestas de San Fermín", "La Navidad", "Un cumpleaños", "Una boda"], "Las fiestas de San Fermín",
    "Escucharás:\nGuía: Estamos en Pamplona durante las fiestas de San Fermín. Estas fiestas se celebran cada julio y son famosas por los encierros de toros. Miles de personas vienen de todo el mundo."),

  q("B1", "listening", "trabajo", "¿Qué problema describe el hablante?", ["La dificultad de conciliar vida laboral y personal", "Que gana poco dinero", "Que su oficina es pequeña", "Que no le gusta su jefe"], "La dificultad de conciliar vida laboral y personal",
    "Escucharás:\nMujer: El mayor reto hoy en día es la conciliación. Muchos trabajadores, especialmente las madres, tienen que elegir entre su carrera profesional y el cuidado de sus hijos. Las empresas necesitan ofrecer más flexibilidad horaria y opciones de teletrabajo."),
  q("B1", "listening", "medio_ambiente", "¿Qué propone el experto?", ["Reducir el consumo de plástico de un solo uso", "Usar más plástico", "No reciclar", "Comprar más productos"], "Reducir el consumo de plástico de un solo uso",
    "Escucharás:\nExperto: Cada año, ocho millones de toneladas de plástico acaban en los océanos. Debemos reducir drásticamente el uso de plásticos de un solo uso. Los gobiernos deben prohibir las bolsas de plástico y fomentar alternativas reutilizables."),

  q("B2", "listening", "cultura", "¿Qué argumenta el historiador?", ["Que las cocinas nacionales son tradiciones inventadas", "Que toda la comida es igual", "Que la comida era mejor hace 200 años", "Que la inmigración arruinó la cultura gastronómica"], "Que las cocinas nacionales son tradiciones inventadas",
    "Escucharás:\nHistoriador: La idea de las cocinas nacionales es en gran parte una invención del siglo XIX, vinculada al nacionalismo. Lo que consideramos platos 'tradicionales' son normalmente el resultado de rutas comerciales globales, el colonialismo y las comunidades inmigrantes que trajeron su comida. La autenticidad es un mito."),
  q("B2", "listening", "trabajo", "¿Qué preocupación expresa la investigadora?", ["Que la automatización eliminará muchos empleos sin crear suficientes nuevos", "Que los robots son demasiado caros", "Que la tecnología es aburrida", "Que las empresas no usan ordenadores"], "Que la automatización eliminará muchos empleos sin crear suficientes nuevos",
    "Escucharás:\nInvestigadora: La automatización y la inteligencia artificial van a transformar radicalmente el mercado laboral. Se estima que el 40% de los empleos actuales podrían desaparecer en las próximas dos décadas. Y aunque se crearán nuevos puestos, la transición será dolorosa para millones de trabajadores que no tienen las habilidades digitales necesarias."),

  q("C1", "listening", "cultura", "¿Qué paradoja describe el psicólogo?", ["Que perseguir la felicidad directamente suele ser contraproducente", "Que todos pueden ser felices todo el tiempo", "Que el dinero siempre trae felicidad", "Que la felicidad es genética"], "Que perseguir la felicidad directamente suele ser contraproducente",
    "Escucharás:\nPsicólogo: Hay una hermosa ironía en la búsqueda de la felicidad. Cuanto más directamente la persigues, más tiende a eludirte. Las personas que reportan mayor satisfacción vital son aquellas que se centran en el sentido y el propósito en lugar de la felicidad en sí misma. Es como si la felicidad tuviera que ser un subproducto, no un objetivo."),
  q("C1", "listening", "medio_ambiente", "¿Qué tensión existe respecto a los puntos de inflexión climáticos?", ["La ciencia es real pero el lenguaje catastrofista puede hacer que la gente se rinda", "Los científicos son demasiado optimistas", "Los gobiernos y los científicos no se comunican", "La economía y la política siempre chocan"], "La ciencia es real pero el lenguaje catastrofista puede hacer que la gente se rinda",
    "Escucharás:\nCientífica climática: Los puntos de inflexión son científicamente reales y cruciales de entender. Pero aquí está el problema: cuando usas palabras como 'irreversible' y 'punto de no retorno', la gente puede volverse fatalista en lugar de motivarse. Si creen que ya es demasiado tarde, dejan de intentarlo."),
  q("C1", "listening", "trabajo", "¿Qué argumenta el economista sobre el PIB?", ["Que mide las cosas equivocadas y engaña a las políticas públicas", "Que el PIB es la mejor medida que tenemos", "Que el crecimiento económico debería ser más rápido", "Que todos los países deberían centrarse en el PIB"], "Que mide las cosas equivocadas y engaña a las políticas públicas",
    "Escucharás:\nEconomista: El PIB mide la actividad económica, pero no dice nada sobre el bienestar, la sostenibilidad o la igualdad. Un vertido de petróleo en realidad aumenta el PIB por los costes de limpieza. Un padre que cría a su hijo en casa no contribuye nada al PIB. Estamos usando una regla para medir la temperatura, y luego nos preguntamos por qué nuestras políticas no mejoran la vida de la gente."),
];

export function getSpanishTestQuestions(): InsertBeQuestion[] {
  const all = [...grammarQuestions, ...vocabularyQuestions, ...useOfLanguageQuestions, ...readingQuestions, ...listeningQuestions];
  let listeningIdx = 0;
  return all.map(q => {
    let audioUrl: string | null = null;
    if (q.skillType === "listening") {
      const idx = listeningIdx++;
      audioUrl = `/audio/spanish/listening_${q.level}_${idx.toString().padStart(3, "0")}.mp3`;
    }
    return {
      language: "spanish",
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
  return getSpanishTestQuestions();
}
