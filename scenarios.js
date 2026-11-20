const ESCENARIOS_112 = [
  {
    id: "EXP-2026-0112",
    telefono: "644 218 903",
    aml: "AML Precisión ~12 m · GPS Activo",
    coords: [41.6894, 2.4922],
    radioMetros: 15,
    direccionSugerida: "Av. del Montseny, 48, Sant Celoni",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "¡Por favor, ayuda! Un hombre de unos 62 años se ha desplomado en la acera y cuesta que reaccione.",
    respuestas: {
      respira: "Respira de forma entrecortada y con ruidos raros, no parece normal.",
      consciente: "Apenas abre los ojos cuando le hablo fuerte, no contesta con claridad.",
      donde: "Estamos en la avenida del Montseny número 48, en Sant Celoni, cerca de la farmacia.",
      constantes: "No tengo tensiómetro ni pulsioxímetro aquí, pero está muy pálido y sudoroso.",
      sangrado: "No tiene heridas sangrantes visibles.",
      rcp: "Vale, pongo las manos en el centro del pecho y sigo el ritmo que me digas.",
      defecto: "Estoy aquí con él en Sant Celoni, dime qué debo hacer."
    }
  },
  {
    id: "EXP-2026-0113",
    telefono: "689 504 117",
    aml: "AML Precisión ~25 m · Red + GPS",
    coords: [41.6961, 2.4558],
    radioMetros: 25,
    direccionSugerida: "Carrer Major, 14, Santa Maria de Palautordera",
    tipologia: "SANITARIO",
    prioridad: "ALTA",
    saludoInicial: "Hola, mi madre tiene un dolor muy fuerte en el centro del pecho que se le va hacia el brazo izquierdo y falta de aire.",
    respuestas: {
      respira: "Respira rápido y dice que le cuesta coger aire, está sentada en una silla.",
      consciente: "Está consciente y orientada, aunque muy asustada y con náuseas.",
      donde: "En Santa Maria de Palautordera, calle Major 14, primer piso.",
      constantes: "No tenemos aparatos en casa, solo notamos la piel fría y pegajosa.",
      sangrado: "No sangra por ningún lado.",
      rcp: "De acuerdo, la mantengo sentada y sin darle nada de beber hasta que llegue la ambulancia.",
      defecto: "Sigue con el dolor en el pecho aquí en la calle Major."
    }
  },
  {
    id: "EXP-2026-0114",
    telefono: "612 773 490",
    aml: "AML Precisión ~20 m · AP-7 PK 112",
    coords: [41.6782, 2.4885],
    radioMetros: 20,
    direccionSugerida: "AP-7 PK 112, sentido Girona, término Sant Celoni",
    tipologia: "TRAFICO",
    prioridad: "ALTA",
    saludoInicial: "¡Ha habido un choque entre dos turismos en la AP-7! Hay humo en el capó de uno de los coches y una persona que no sale.",
    respuestas: {
      respira: "La persona del coche delantero respira, pero se queja mucho del pecho.",
      consciente: "Está consciente pero aturdida, responde con frases cortas.",
      donde: "En la autopista AP-7, punto kilométrico 112 sentido Girona, en el carril derecho.",
      constantes: "No puedo medir constantes, estamos en el arcén apartados del tráfico.",
      sangrado: "Tiene un corte en la frente que sangra un poco.",
      rcp: "Entendido, no intentamos moverla del coche y avisamos a los demás para que no se acerquen.",
      defecto: "Seguimos en el PK 112 de la AP-7, se ve humo blanco del motor."
    }
  },
  {
    id: "EXP-2026-0115",
    telefono: "655 190 822",
    aml: "AML Precisión ~18 m · GPS Activo",
    coords: [41.4298, 2.1812],
    radioMetros: 18,
    direccionSugerida: "Passeig de la Vall d'Hebron, 119, Barcelona",
    tipologia: "INCENDIO",
    prioridad: "ALTA",
    saludoInicial: "Emergencias, está saliendo mucho humo negro por la ventana de un tercer piso y suena la alarma de incendios.",
    respuestas: {
      respira: "En el rellano huele fuerte a humo, los vecinos están bajando por las escaleras.",
      consciente: "Por ahora todos los que bajan están conscientes, pero hay una persona mayor en el segundo.",
      donde: "Passeig de la Vall d'Hebron 119, en Barcelona.",
      constantes: "No tenemos mediciones, hay bastante humo en la escalera.",
      sangrado: "Nadie sangra por el momento.",
      rcp: "De acuerdo, no usamos el ascensor y bajamos con cuidado.",
      defecto: "El humo sigue saliendo por la ventana del tercer piso."
    }
  },
  {
    id: "EXP-2026-0116",
    telefono: "671 334 908",
    aml: "AML Precisión ~30 m · Cobertura Celda",
    coords: [41.7345, 2.4410],
    radioMetros: 30,
    direccionSugerida: "Ctra. BV-5114 PK 6, Montseny",
    tipologia: "PROT_CIVIL",
    prioridad: "MEDIA",
    saludoInicial: "Buenas, hay una rama grande y un árbol caído ocupando casi toda la carretera con lluvia intensa y poca visibilidad.",
    respuestas: {
      respira: "Yo estoy bien dentro del coche, no hay heridos.",
      consciente: "Totalmente consciente, solo bloqueado por el árbol en la calzada.",
      donde: "Carretera BV-5114, alrededor del kilómetro 6, zona del Montseny.",
      constantes: "Sin novedades médicas, solo lluvia fuerte y niebla.",
      sangrado: "Sin heridos ni sangrados.",
      rcp: "No hace falta RCP, no hay personas afectadas.",
      defecto: "El árbol sigue cruzado en la BV-5114 y pasan pocos coches."
    }
  },
  {
    id: "EXP-2026-0117",
    telefono: "690 842 156",
    aml: "AML Precisión ~15 m · GPS Activo",
    coords: [41.3879, 2.1699],
    radioMetros: 15,
    direccionSugerida: "Plaça de Catalunya, 1, Barcelona",
    tipologia: "SEGURIDAD",
    prioridad: "MEDIA",
    saludoInicial: "Hola, hay un joven mareado y desorientado sentado en un banco de la plaza que no sabe dónde está ni qué día es.",
    respuestas: {
      respira: "Respira con normalidad, a un ritmo tranquilo.",
      consciente: "Responde cuando le hablas, pero está desorientado en tiempo y lugar.",
      donde: "En Plaça de Catalunya número 1, Barcelona, cerca de la fuente.",
      constantes: "No tengo equipo médico, parece tener calor o bajada de azúcar.",
      sangrado: "No tiene golpes ni sangrado.",
      rcp: "No está en parada, respira bien.",
      defecto: "Sigo aquí con él en Plaça de Catalunya esperando ayuda."
    }
  }
];
