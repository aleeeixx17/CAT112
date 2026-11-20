const ESCENARIOS_112 = [
  {
    id: "CASO-01",
    telefono: "644 101 201",
    coords: [41.6881, 2.4895],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Carretera C-35, Sant Celoni",
    tipologia: "TRAFICO",
    prioridad: "ALTA",
    saludoInicial: "¡Emergencia! Un motorista de unos 28 años ha chocado contra un coche y está en el suelo. Sangra mucho por el muslo derecho, tiene la pierna deformada y está muy pálido.",
    respuestas: {
      donde: "Estamos en la carretera en Sant Celoni, justo donde ha ocurrido el choque con el coche.",
      respira: "Respira rápido, a unas 28 respiraciones por minuto, y marca 91% de saturación sin oxígeno.",
      consciente: "Abre los ojos cuando le hablo, dice palabras que no se entienden bien y localiza el dolor.",
      sangrado: "Tiene un sangrado abundante en el muslo derecho y la extremidad está deformada.",
      constantes: "Pulso rápido a 132, tensión baja de 85/55 y temperatura de 35,2 grados.",
      defecto: "Por favor, venid rápido, pierde mucha sangre por el muslo derecho y está pálido y frío."
    }
  },
  {
    id: "CASO-02",
    telefono: "644 102 202",
    coords: [41.6085, 2.2882],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Calle Girona, Granollers",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, por favor, una ambulancia. Una mujer de 62 años tiene un dolor opresivo en el pecho desde hace 40 minutos, está sudorosa, pálida y dice que siente como si se fuera a morir.",
    respuestas: {
      donde: "Estamos en un domicilio en Granollers.",
      consciente: "Está alerta, con los ojos abiertos, habla coherente y obedece órdenes.",
      respira: "Respira a unas 24 por minuto y tiene saturación del 94% al aire.",
      constantes: "Frecuencia cardíaca de 110, tensión arterial de 160/95 y temperatura de 36,5 grados.",
      defecto: "Le aprieta mucho el pecho desde hace 40 minutos, suda frío y está muy asustada."
    }
  },
  {
    id: "CASO-03",
    telefono: "644 103 203",
    coords: [41.3879, 2.1699],
    radioMetros: 18,
    aml: "AML GPS · Precisión 18m",
    direccionSugerida: "Eixample, Barcelona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Ayuda por favor, hemos encontrado a un hombre de 75 años inconsciente en su casa. No vemos golpes ni heridas, respira solo pero hace un ruido raro al respirar.",
    respuestas: {
      respira: "Respira muy despacio, a unas 8 por minuto, con respiración ruidosa y saturación del 86%.",
      consciente: "No abre los ojos, hace sonidos incomprensibles y presenta flexión anormal ante el dolor.",
      constantes: "Pulso lento a 48, tensión de 90/60 y temperatura de 35,8 grados.",
      donde: "En el domicilio del paciente en Barcelona, sin traumatismos visibles.",
      defecto: "No despierta, hace ruido al respirar y está muy bajo de constantes."
    }
  },
  {
    id: "CASO-04",
    telefono: "644 104 204",
    coords: [41.5463, 2.1086],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Centre, Sabadell",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, una chica de 24 años con asma no puede casi ni respirar. Habla entrecortada y usa musculatura accesoria.",
    respuestas: {
      respira: "Respira muy deprisa, a 34 por minuto, saturación de 88% al aire y usa musculatura accesoria.",
      consciente: "Está alerta, ojos abiertos, habla entrecortada pero coherente y obedece órdenes.",
      constantes: "Frecuencia cardíaca de 138, tensión de 145/85 y temperatura de 36,8 grados.",
      defecto: "Tiene asma y está ahogándose, apenas puede terminar las frases."
    }
  },
  {
    id: "CASO-05",
    telefono: "644 105 205",
    coords: [41.9794, 2.8214],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Eixample, Girona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, llamo porque un hombre de 69 años hace unos 25 minutos que tiene desviación de la comisura bucal, pérdida de fuerza en brazo derecho y dificultad para hablar.",
    respuestas: {
      consciente: "Está alerta, abre los ojos espontáneamente, habla con palabras inadecuadas y obedece órdenes sencillas.",
      respira: "Respira bien a 18 por minuto con saturación del 97%.",
      constantes: "Frecuencia cardíaca de 88, tensión alta de 190/105 y temperatura de 36,7 grados.",
      defecto: "Empezó hace 25 minutos con la boca torcida, debilidad en el brazo derecho y alteración del habla."
    }
  },
  {
    id: "CASO-06",
    telefono: "644 106 206",
    coords: [41.1189, 1.2445],
    radioMetros: 25,
    aml: "AML GPS · Precisión 25m",
    direccionSugerida: "Part Baixa, Tarragona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Por favor, una ambulancia urgente. Una mujer de 81 años ha tenido dos episodios de vómitos con sangre. Está muy pálida, sudorosa y mareada.",
    respuestas: {
      constantes: "Frecuencia cardíaca de 125, tensión baja de 82/48 y temperatura de 35,9 grados.",
      respira: "Frecuencia respiratoria de 26 y saturación del 93% al aire.",
      consciente: "Abre los ojos al hablarle, responde con frases confusas y localiza el dolor.",
      defecto: "Ha tenido dos vómitos con sangre, está pálida, sudorosa y mareada."
    }
  },
  {
    id: "CASO-07",
    telefono: "644 107 207",
    coords: [41.6176, 0.6200],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Zona Alta, Lleida",
    tipologia: "SANITARIO",
    prioridad: "MEDIA",
    saludoInicial: "Hola, un hombre de 55 años diabético está desorientado en su casa, con sudoración intensa y temblores. Glucemia capilar de 42 mg/dL.",
    respuestas: {
      consciente: "Abre los ojos al hablarle, conversación confusa y obedece órdenes. Glucemia de 42 mg/dL.",
      respira: "Frecuencia respiratoria de 20 y saturación del 98%.",
      constantes: "Frecuencia cardíaca de 115, tensión de 135/80 y temperatura de 36,2 grados.",
      defecto: "Es diabético, está desorientado con sudoración y temblores, y glucemia de 42 mg/dL."
    }
  },
  {
    id: "CASO-08",
    telefono: "644 108 208",
    coords: [41.5421, 2.4445],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Centre, Mataró",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, una mujer de 73 años tiene fiebre, escalofríos, confusión y sospecha de infección urinaria, con empeoramiento en las últimas horas.",
    respuestas: {
      constantes: "Temperatura de 39,4 grados, frecuencia cardíaca de 128 y tensión de 88/52.",
      respira: "Respira a 30 por minuto con saturación del 92% al aire.",
      consciente: "Está alerta con nueva confusión, ojos abiertos, conversación confusa y obedece órdenes.",
      defecto: "Fiebre, escalofríos y confusión de inicio reciente por sospecha de infección urinaria."
    }
  },
  {
    id: "CASO-09",
    telefono: "644 109 209",
    coords: [41.6910, 2.4920],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Sant Celoni",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Un hombre de 35 años ha caído de una escalera desde tres metros. Presenta herida en región frontal y vómitos.",
    respuestas: {
      consciente: "Abre los ojos al dolor, emite sonidos incomprensibles y presenta extensión anormal al dolor.",
      respira: "Frecuencia respiratoria de 10 y saturación del 89% al aire.",
      constantes: "Frecuencia cardíaca de 52, tensión arterial de 185/100 y temperatura de 36 grados.",
      defecto: "Caída desde tres metros con herida frontal y vómitos."
    }
  },
  {
    id: "CASO-10",
    telefono: "644 110 210",
    coords: [41.3917, 2.1649],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Eixample, Barcelona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Por favor, urgente, una mujer de 32 años presenta urticaria generalizada, hinchazón de labios, sensación de cierre de garganta y dificultad respiratoria tras ingerir frutos secos.",
    respuestas: {
      constantes: "Tensión de 75/40, frecuencia cardíaca de 140 y temperatura de 36,6 grados.",
      respira: "Frecuencia respiratoria de 32 y saturación del 89% al aire.",
      consciente: "Está alerta, habla coherentemente y obedece órdenes.",
      defecto: "Reacción tras frutos secos con urticaria, hinchazón labial, cierre de garganta y dificultad respiratoria."
    }
  },
  {
    id: "CASO-11",
    telefono: "644 111 211",
    coords: [41.6150, 2.2900],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Granollers",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, un varón de 78 años con EPOC conocido presenta disnea progresiva, somnolencia y respiración superficial.",
    respuestas: {
      respira: "Frecuencia respiratoria de 9, respiración superficial y saturación del 84% al aire.",
      consciente: "Abre los ojos al hablarle, conversación confusa y obedece órdenes.",
      constantes: "Frecuencia cardíaca de 115, tensión de 150/90 y temperatura de 37,1 grados.",
      defecto: "EPOC reagudizado con disnea progresiva, somnolencia y respiración superficial."
    }
  },
  {
    id: "CASO-12",
    telefono: "644 112 212",
    coords: [41.3851, 2.1592],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Barcelona",
    tipologia: "INCENDIO",
    prioridad: "ALTA",
    saludoInicial: "Mujer de 40 años rescatada de un incendio doméstico. Presenta quemaduras en brazos y tórax, hollín alrededor de la boca y voz ronca.",
    respuestas: {
      respira: "Frecuencia respiratoria de 30, saturación del 90% al aire, hollín peribucal y voz ronca.",
      constantes: "Frecuencia cardíaca de 125, tensión de 95/60 y temperatura de 35,5 grados.",
      consciente: "Ojos abiertos espontáneamente, conversación coherente y obedece órdenes.",
      defecto: "Rescatada de incendio doméstico con quemaduras en brazos y tórax, hollín y voz ronca."
    }
  },
  {
    id: "CASO-13",
    telefono: "644 113 213",
    coords: [41.6894, 2.4922],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Sant Celoni",
    tipologia: "SANITARIO",
    prioridad: "MEDIA",
    saludoInicial: "Hola, un varón de 48 años tiene dolor abdominal intenso, vómitos y abdomen rígido. Está pálido y con sudoración fría.",
    respuestas: {
      constantes: "Frecuencia cardíaca de 118, tensión de 95/60 y temperatura de 38,1 grados.",
      respira: "Frecuencia respiratoria de 24 y saturación del 96% al aire.",
      consciente: "Ojos abiertos espontáneamente, conversación coherente y obedece órdenes.",
      defecto: "Dolor abdominal intenso, vómitos, abdomen rígido, palidez y sudoración fría."
    }
  },
  {
    id: "CASO-14",
    telefono: "644 114 214",
    coords: [41.5463, 2.1086],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Sabadell",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Mujer de 19 años encontrada tras una crisis convulsiva generalizada. Presenta respiración ruidosa y abundante saliva.",
    respuestas: {
      consciente: "Abre los ojos al dolor, emite sonidos incomprensibles y localiza el dolor.",
      respira: "Frecuencia respiratoria de 12, saturación del 90% al aire, respiración ruidosa y abundante saliva.",
      constantes: "Frecuencia cardíaca de 118, tensión de 145/85 y temperatura de 37,2 grados.",
      defecto: "Post-convulsión generalizada con respiración ruidosa y abundante saliva."
    }
  },
  {
    id: "CASO-15",
    telefono: "644 115 215",
    coords: [41.3413, 2.1072],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "L'Hospitalet de Llobregat",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Varón de 72 años con antecedentes de insuficiencia cardíaca. Presenta disnea, extremidades frías, sudoración y alteración del estado mental.",
    respuestas: {
      constantes: "Tensión de 78/45, frecuencia cardíaca de 125 y temperatura de 35,8 grados, extremidades frías.",
      respira: "Frecuencia respiratoria de 32 y saturación del 88% al aire.",
      consciente: "Abre los ojos al hablarle, conversación confusa y obedece órdenes.",
      defecto: "Disnea, extremidades frías, sudoración y alteración del estado mental."
    }
  },
  {
    id: "CASO-16",
    telefono: "644 116 216",
    coords: [41.9794, 2.8214],
    radioMetros: 18,
    aml: "AML GPS · Precisión 18m",
    direccionSugerida: "Girona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Varón de 27 años encontrado en una habitación con varios envases de medicamentos vacíos. Presenta respiración lenta y pupilas puntiformes.",
    respuestas: {
      respira: "Frecuencia respiratoria de 6 y saturación del 82% al aire.",
      consciente: "No abre los ojos, no emite respuesta verbal y retira ante el dolor. Pupilas puntiformes.",
      constantes: "Frecuencia cardíaca de 48, tensión de 90/55 y temperatura de 35,6 grados.",
      defecto: "Posible intoxicación medicamentosa con respiración lenta y pupilas puntiformes."
    }
  },
  {
    id: "CASO-17",
    telefono: "644 117 217",
    coords: [41.3839, 2.1952],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Ciutat Vella, Barcelona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Varón de 30 años con herida penetrante en el tórax. Presenta dificultad respiratoria, dolor torácico y disminución del murmullo vesicular derecho.",
    respuestas: {
      respira: "Frecuencia respiratoria de 36, saturación del 86% al aire y disminución del murmullo vesicular derecho.",
      constantes: "Frecuencia cardíaca de 135, tensión de 85/50 y temperatura de 36 grados.",
      consciente: "Ojos abiertos espontáneamente, conversación coherente y obedece órdenes.",
      defecto: "Herida penetrante torácica con dificultad respiratoria y dolor torácico."
    }
  },
  {
    id: "CASO-18",
    telefono: "644 118 218",
    coords: [41.7345, 2.4280],
    radioMetros: 30,
    aml: "AML GPS · Precisión 30m",
    direccionSugerida: "Zona Montseny",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Mujer de 67 años encontrada en el exterior tras horas expuesta al frío. Está somnolienta, con piel fría y temblores.",
    respuestas: {
      constantes: "Temperatura de 31,5 grados, frecuencia cardíaca de 45 y tensión de 90/55.",
      respira: "Frecuencia respiratoria de 10 y saturación del 92% al aire.",
      consciente: "Abre los ojos al hablarle, emite palabras incomprensibles y localiza el dolor.",
      defecto: "Exposición al frío con somnolencia, piel fría y temblores."
    }
  },
  {
    id: "CASO-19",
    telefono: "644 119 219",
    coords: [41.1235, 1.2414],
    radioMetros: 20,
    aml: "AML GPS · Precisión 20m",
    direccionSugerida: "Tarragona",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Varón de 80 años con antecedentes cardíacos. Presenta disnea intensa, ortopnea, crepitantes bilaterales y expectoración espumosa.",
    respuestas: {
      respira: "Frecuencia respiratoria de 34, saturación del 85% al aire, ortopnea, crepitantes y expectoración espumosa.",
      constantes: "Frecuencia cardíaca de 120, tensión de 185/105 y temperatura de 36,4 grados.",
      consciente: "Alerta con confusión de nueva aparición, ojos abiertos, conversación confusa y obedece órdenes.",
      defecto: "Disnea intensa con ortopnea, crepitantes bilaterales y expectoración espumosa."
    }
  },
  {
    id: "CASO-20",
    telefono: "644 120 220",
    coords: [41.6176, 0.6200],
    radioMetros: 15,
    aml: "AML GPS · Precisión 15m",
    direccionSugerida: "Lleida",
    tipologia: "TRAFICO",
    prioridad: "ALTA",
    saludoInicial: "Mujer de 26 años atropellada por un vehículo. Presenta deformidad en pelvis, dolor abdominal y sangrado en una pierna.",
    respuestas: {
      constantes: "Frecuencia cardíaca de 145, tensión de 70/40 y temperatura de 35 grados.",
      respira: "Frecuencia respiratoria de 30 y saturación del 90% al aire.",
      consciente: "Abre los ojos al dolor, emite palabras incomprensibles y localiza el dolor.",
      defecto: "Atropello con deformidad en pelvis, dolor abdominal y sangrado en pierna."
    }
  }
];
