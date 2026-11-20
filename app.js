// --- INICIALIZACIÓN SEGURA DEL MAPA LEAFLET ---
let map = null;
let capaOSM = null;
let capaTopo = null;
let capaActual = 'osm';

if (typeof L !== 'undefined' && document.getElementById('map')) {
  try {
    map = L.map('map').setView([41.6894, 2.4922], 12);
    capaOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    });
    capaTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap'
    });
    capaOSM.addTo(map);
  } catch (e) {
    console.warn('Mapa no disponible:', e);
  }
}

let marcador = null;
let circuloPrecision = null;
let marcadorCentro = null;
let indiceEscenario = 0;
let escenarioActual = null;
let segundos = 0;
let intervaloReloj = null;
let sonidoActivo = true;
let unidadesDespachadas = [];

// --- GUARDIA DE 12 HORAS (43200 s) · LLAMADA CADA 15 MIN (900 s) ---
const DURACION_GUARDIA_SEG = 12 * 60 * 60;
const INTERVALO_LLAMADA_SEG = 15 * 60;
let guardiaActiva = false;
let segundosGuardia = 0;
let proximoDisparoGuardia = INTERVALO_LLAMADA_SEG;
let intervaloGuardiaTick = null;
let velocidadGuardia = 15;
let colaLlamadas = [];

let modoConversacion = null;
let centroActivoObj = null;

const ESTADOS_UNIDAD = ['ACTIVADA', 'EN RUTA', 'EN LUGAR'];

const RESPUESTAS_CAPS = {
  'CAP de Sala': "CAP de Sala CAT112, dime operador. ¿Qué novedad o apoyo necesitas en el expediente?",
  'CAP 061': "Central de Coordinació Sanitària 061 SEM, adelante. Indícanos ubicación, estado clínico del paciente y constantes si las hay.",
  'CAP Mossos': "Sala Regional de Comandament Mossos d'Esquadra, diga. ¿Requiere dotación de seguridad ciudadana o tráfico?",
  'CAP Bombers': "Sala de Control Bombers de la Generalitat, adelante. Confirme localización, acceso y si hay riesgo de propagación o atrapados.",
  'CAP Protecció Civil': "CECAT Protecció Civil de Catalunya, le escuchamos. ¿Qué incidencia o activación de plan se reporta?"
};

function reproducirTono(frecuencia = 740, duracion = 0.14, tipo = 'sine') {
  if (!sonidoActivo) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracion);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duracion);
  } catch (_) {}
}

function tonoRadio(apertura = true) {
  if (!sonidoActivo) return;
  if (apertura) {
    reproducirTono(1050, 0.07, 'square');
    setTimeout(() => reproducirTono(1350, 0.07, 'square'), 75);
  } else {
    reproducirTono(900, 0.11, 'triangle');
  }
}

function toggleSonido() {
  sonidoActivo = !sonidoActivo;
  const btn = document.getElementById('btnSonido');
  if (btn) btn.innerText = sonidoActivo ? '🔊 ON' : '🔇 OFF';
}

function formatoCrono(totalSeg) {
  const min = String(Math.floor(totalSeg / 60)).padStart(2, '0');
  const sec = String(totalSeg % 60).padStart(2, '0');
  return `${min}:${sec}`;
}

function formatoHorasMinutos(totalSeg) {
  const h = String(Math.floor(totalSeg / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeg % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}`;
}

function log(mensaje) {
  const div = document.getElementById('logOperativo');
  if (!div) return;
  div.innerHTML += `<div><span class="text-slate-500">[${formatoHorasMinutos(segundosGuardia)} · ${formatoCrono(segundos)}]</span> ${mensaje}</div>`;
  div.scrollTop = div.scrollHeight;
}

function actualizarBadgeRiesgo() {
  const prioEl = document.getElementById('prioridad');
  const badge = document.getElementById('badgeRiesgo');
  if (!prioEl || !badge) return;
  const prio = prioEl.value;
  badge.classList.remove('hidden');
  if (prio === 'ALTA') {
    badge.className = 'px-2 py-0.5 rounded font-bold text-[10px] bg-red-950 text-red-300 border border-red-700';
    badge.innerText = 'P1 · CRÍTICA';
  } else if (prio === 'MEDIA') {
    badge.className = 'px-2 py-0.5 rounded font-bold text-[10px] bg-amber-950 text-amber-300 border border-amber-700';
    badge.innerText = 'P2 · URGENTE';
  } else {
    badge.className = 'px-2 py-0.5 rounded font-bold text-[10px] bg-sky-950 text-sky-300 border border-sky-700';
    badge.innerText = 'P3 · LEVE';
  }
}

function validarLocalizacionManual() {
  const dirEl = document.getElementById('direccion');
  const estadoEl = document.getElementById('estadoDireccion');
  if (!dirEl || !estadoEl) return;
  const dir = dirEl.value.trim();
  if (!dir) {
    estadoEl.innerHTML = '<span class="text-amber-400">Introduce ubicación antes de validar.</span>';
    return;
  }
  estadoEl.innerHTML = `<span class="text-emerald-400 font-semibold">✓ Ubicación validada: ${dir}</span>`;
  log(`Ubicación validada: "${dir}"`);
  reproducirTono(880, 0.1, 'triangle');
}

function cambiarCapaMapa() {
  if (!map || !capaOSM || !capaTopo) return;
  if (capaActual === 'osm') {
    map.removeLayer(capaOSM);
    capaTopo.addTo(map);
    capaActual = 'topo';
  } else {
    map.removeLayer(capaTopo);
    capaOSM.addTo(map);
    capaActual = 'osm';
  }
}

function centrarEnIncidente() {
  if (!map || !escenarioActual) return;
  map.setView(escenarioActual.coords, 15);
}

function sintetizarVoz(texto, rate = 1.06) {
  if (!('speechSynthesis' in window) || !texto) return;
  try {
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    const idiomaEl = document.getElementById('idiomaSelect');
    voz.lang = idiomaEl ? idiomaEl.value : 'es-ES';
    voz.rate = rate;
    window.speechSynthesis.speak(voz);
  } catch (_) {}
}

function hablarEnLinea(etiqueta, texto) {
  const chat = document.getElementById('chatLog');
  if (chat) {
    chat.innerHTML += `<div class="text-amber-300"><strong class="text-amber-400">${etiqueta}:</strong> ${texto}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }
  sintetizarVoz(texto, 1.06);
}

function iniciarCronometroSiNoActivo() {
  if (intervaloReloj) return;
  segundos = 0;
  const relojEl = document.getElementById('cronometro');
  if (relojEl) {
    relojEl.classList.remove('text-red-500');
    relojEl.innerText = '00:00';
  }
  intervaloReloj = setInterval(() => {
    segundos++;
    const r = document.getElementById('cronometro');
    if (r) {
      r.innerText = formatoCrono(segundos);
      if (segundos >= 60) r.classList.add('text-red-500');
    }
  }, 1000);
}

// --- GUARDIA DE 12 HORAS ---
function sincronizarBotonesGuardia() {
  const textoBtn = guardiaActiva ? '⏸ Pausar Guardia' : '▶ Iniciar Guardia 12h';
  const textoReloj = `${formatoHorasMinutos(segundosGuardia)} / 12:00`;

  const btnDesk = document.getElementById('btnGuardia');
  if (btnDesk) {
    btnDesk.textContent = textoBtn;
    btnDesk.className = guardiaActiva
      ? 'touch-manipulation bg-amber-600 hover:bg-amber-500 text-white font-bold px-2.5 py-1 rounded shadow'
      : 'touch-manipulation bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded shadow';
  }

  const btnMovil = document.getElementById('btnGuardiaMovil');
  if (btnMovil) {
    btnMovil.textContent = textoBtn;
    btnMovil.className = guardiaActiva
      ? 'touch-manipulation bg-amber-600 active:bg-amber-500 text-white font-bold px-3 py-1.5 rounded shadow text-xs'
      : 'touch-manipulation bg-emerald-600 active:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded shadow text-xs';
  }

  const relojDesk = document.getElementById('relojGuardia');
  if (relojDesk) relojDesk.textContent = textoReloj;

  const relojMovil = document.getElementById('relojGuardiaMovil');
  if (relojMovil) relojMovil.textContent = textoReloj;
}

function actualizarVelocidadGuardia() {
  const sel = document.getElementById('velocidadGuardia');
  velocidadGuardia = sel ? (parseInt(sel.value, 10) || 15) : 15;
  log(`Velocidad de guardia: ${velocidadGuardia}x.`);
}

function actualizarIndicadoresGuardia() {
  const proxEl = document.getElementById('proxLlamadaBadge');
  if (proxEl) {
    const faltan = Math.max(0, proximoDisparoGuardia - segundosGuardia);
    proxEl.textContent = guardiaActiva ? `+${formatoHorasMinutos(faltan)}` : '--:--';
  }

  const colaEl = document.getElementById('colaLlamadasBadge');
  if (colaEl) {
    colaEl.textContent = String(colaLlamadas.length);
  }

  const btnCola = document.getElementById('btnAtenderCola');
  if (btnCola) {
    btnCola.classList.toggle('hidden', colaLlamadas.length === 0);
  }

  sincronizarBotonesGuardia();
}

function iniciarTickGuardia() {
  if (intervaloGuardiaTick) clearInterval(intervaloGuardiaTick);
  intervaloGuardiaTick = setInterval(() => {
    if (!guardiaActiva) return;

    segundosGuardia += velocidadGuardia;

    if (segundosGuardia >= DURACION_GUARDIA_SEG) {
      segundosGuardia = DURACION_GUARDIA_SEG;
      actualizarIndicadoresGuardia();
      finalizarGuardia12h();
      return;
    }

    if (segundosGuardia >= proximoDisparoGuardia) {
      proximoDisparoGuardia += INTERVALO_LLAMADA_SEG;
      dispararLlamadaProgramada();
    }

    actualizarIndicadoresGuardia();
  }, 1000);
}

function toggleGuardia12h() {
  if (!guardiaActiva) {
    guardiaActiva = true;
    if (segundosGuardia === 0) {
      proximoDisparoGuardia = INTERVALO_LLAMADA_SEG;
    }
    log('GUARDIA DE 12H INICIADA. Llamadas automáticas cada 15 minutos.');
    reproducirTono(780, 0.14, 'triangle');
    actualizarIndicadoresGuardia();
    iniciarTickGuardia();
  } else {
    guardiaActiva = false;
    if (intervaloGuardiaTick) {
      clearInterval(intervaloGuardiaTick);
      intervaloGuardiaTick = null;
    }
    log(`GUARDIA PAUSADA en ${formatoHorasMinutos(segundosGuardia)}.`);
    actualizarIndicadoresGuardia();
  }
}

function finalizarGuardia12h() {
  guardiaActiva = false;
  if (intervaloGuardiaTick) {
    clearInterval(intervaloGuardiaTick);
    intervaloGuardiaTick = null;
  }
  reproducirTono(520, 0.25, 'sine');
  log('FIN DE LA GUARDIA DE 12 HORAS (12:00).');
  actualizarIndicadoresGuardia();
}

function obtenerSiguienteEscenario() {
  if (typeof ESCENARIOS_112 === 'undefined' || !Array.isArray(ESCENARIOS_112) || ESCENARIOS_112.length === 0) {
    return null;
  }
  const esc = ESCENARIOS_112[indiceEscenario % ESCENARIOS_112.length];
  indiceEscenario++;
  return esc;
}

function dispararLlamadaProgramada() {
  const esc = obtenerSiguienteEscenario();
  if (!esc) return;

  reproducirTono(660, 0.16, 'sine');
  setTimeout(() => reproducirTono(880, 0.16, 'sine'), 180);

  if (modoConversacion !== null) {
    colaLlamadas.push(esc);
    log(`LLAMADA 112 EN COLA (${esc.id}) a las ${formatoHorasMinutos(segundosGuardia)} de guardia.`);
    actualizarIndicadoresGuardia();
    return;
  }

  cargarLlamadaEnConsola(esc);
  log(`Llamada automática de guardia (${esc.id}) a las ${formatoHorasMinutos(segundosGuardia)}.`);
}

function atenderSiguienteEnCola() {
  if (colaLlamadas.length === 0) return;
  const siguiente = colaLlamadas.shift();
  actualizarIndicadoresGuardia();
  cargarLlamadaEnConsola(siguiente);
  log(`Atendida llamada en espera (${siguiente.id}).`);
}

function cargarLlamadaEnConsola(esc) {
  escenarioActual = esc;
  unidadesDespachadas = [];
  renderUnidades();

  modoConversacion = 'REQUIRENTE';
  centroActivoObj = null;
  const lineaBadge = document.getElementById('lineaActivaBadge');
  const estadoLlamada = document.getElementById('estadoLlamada');
  const btnHablar = document.getElementById('btnHablar');
  const btnColgar = document.getElementById('btnColgar');
  const chatLog = document.getElementById('chatLog');

  if (lineaBadge) lineaBadge.innerText = '112 · REQUIRENTE';
  if (estadoLlamada) estadoLlamada.innerHTML = '<span class="text-emerald-400 blink">● EN LLAMADA (112)</span>';
  if (btnHablar) btnHablar.disabled = false;
  if (btnColgar) btnColgar.disabled = false;
  if (chatLog) chatLog.innerHTML = '';

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setText('idIncidente', esc.id);
  setVal('telAlertante', esc.telefono);
  setVal('amlStatus', esc.aml);
  setVal('direccion', esc.direccionSugerida || '');
  setVal('tipologia', esc.tipologia || '');
  setVal('prioridad', esc.prioridad || 'ALTA');
  actualizarBadgeRiesgo();

  if (Array.isArray(esc.coords) && esc.coords.length === 2) {
    const [lat, lng] = esc.coords;
    if (map) {
      map.setView([lat, lng], 15);
      if (marcador) map.removeLayer(marcador);
      if (circuloPrecision) map.removeLayer(circuloPrecision);

      circuloPrecision = L.circle([lat, lng], {
        radius: esc.radioMetros || 25,
        color: '#38bdf8',
        fillColor: '#38bdf8',
        fillOpacity: 0.15,
        weight: 1.5
      }).addTo(map);

      marcador = L.circleMarker([lat, lng], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.75,
        radius: 9
      }).addTo(map).bindPopup(`<b>${esc.id}</b><br>${esc.aml}`).openPopup();
    }
    setText('coordsText', `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  }

  clearInterval(intervaloReloj);
  intervaloReloj = null;
  iniciarCronometroSiNoActivo();

  hablarEnLinea('Requirente', esc.saludoInicial);
}

function iniciarLlamada() {
  reproducirTono(660, 0.16, 'sine');
  setTimeout(() => reproducirTono(880, 0.16, 'sine'), 180);
  const esc = obtenerSiguienteEscenario();
  if (!esc) {
    log('No hay escenarios cargados en ESCENARIOS_112.');
    return;
  }
  cargarLlamadaEnConsola(esc);
  log(`Llamada 112 iniciada manualmente (${esc.id}).`);
}

// --- CAPs Y DIRECTORIO CATALUNYA ---
function llamarCAP(nombreCAP) {
  reproducirTono(720, 0.14, 'sine');
  setTimeout(() => reproducirTono(720, 0.14, 'sine'), 220);

  modoConversacion = nombreCAP;
  centroActivoObj = null;
  const lineaBadge = document.getElementById('lineaActivaBadge');
  const estadoLlamada = document.getElementById('estadoLlamada');
  const btnHablar = document.getElementById('btnHablar');
  const btnColgar = document.getElementById('btnColgar');

  if (lineaBadge) lineaBadge.innerText = nombreCAP.toUpperCase();
  if (estadoLlamada) estadoLlamada.innerHTML = `<span class="text-amber-400 blink">● CONECTADO · ${nombreCAP}</span>`;
  if (btnHablar) btnHablar.disabled = false;
  if (btnColgar) btnColgar.disabled = false;

  if (!intervaloReloj) iniciarCronometroSiNoActivo();

  const saludoCAP = RESPUESTAS_CAPS[nombreCAP] || `${nombreCAP}, adelante.`;
  log(`Llamada telefónica establecida con ${nombreCAP}.`);
  hablarEnLinea(nombreCAP, saludoCAP);
}

function actualizarListaCentros() {
  const catEl = document.getElementById('categoriaDirectorio');
  const select = document.getElementById('centroDirectorio');
  if (!catEl || !select) return;
  const cat = catEl.value;
  const lista = (typeof DIRECTORIO_CATALUNYA !== 'undefined' && DIRECTORIO_CATALUNYA[cat]) || [];

  select.innerHTML = lista.map((c, idx) =>
    `<option value="${idx}">${c.nombre}</option>`
  ).join('');
}

function llamarCentroSeleccionado() {
  const catEl = document.getElementById('categoriaDirectorio');
  const selEl = document.getElementById('centroDirectorio');
  if (!catEl || !selEl) return;
  const cat = catEl.value;
  const idx = parseInt(selEl.value, 10);
  const centro = (typeof DIRECTORIO_CATALUNYA !== 'undefined' && DIRECTORIO_CATALUNYA[cat]) ? DIRECTORIO_CATALUNYA[cat][idx] : null;
  if (!centro) return;

  reproducirTono(720, 0.14, 'sine');
  setTimeout(() => reproducirTono(720, 0.14, 'sine'), 220);

  modoConversacion = centro.nombre;
  centroActivoObj = { categoria: cat, ...centro };

  const lineaBadge = document.getElementById('lineaActivaBadge');
  const estadoLlamada = document.getElementById('estadoLlamada');
  const btnHablar = document.getElementById('btnHablar');
  const btnColgar = document.getElementById('btnColgar');

  if (lineaBadge) lineaBadge.innerText = centro.id;
  if (estadoLlamada) estadoLlamada.innerHTML = `<span class="text-emerald-400 blink">● EN LÍNEA · ${centro.id}</span>`;
  if (btnHablar) btnHablar.disabled = false;
  if (btnColgar) btnColgar.disabled = false;

  if (!intervaloReloj) iniciarCronometroSiNoActivo();

  if (Array.isArray(centro.coords) && centro.coords.length === 2) {
    const [lat, lng] = centro.coords;
    if (map) {
      map.setView([lat, lng], 15);
      if (marcadorCentro) map.removeLayer(marcadorCentro);
      marcadorCentro = L.circleMarker([lat, lng], {
        color: '#38bdf8',
        fillColor: '#0284c7',
        fillOpacity: 0.85,
        radius: 8
      }).addTo(map).bindPopup(`<b>${centro.nombre}</b>`).openPopup();
    }
    const coordsEl = document.getElementById('coordsText');
    if (coordsEl) coordsEl.innerText = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  log(`Llamada a ${centro.nombre} (${centro.id}).`);
  hablarEnLinea(centro.nombre, centro.saludo);
}

function generarRespuestaVoz(textoUsuario) {
  const lower = textoUsuario.toLowerCase();
  const expEl = document.getElementById('idIncidente');
  const dirEl = document.getElementById('direccion');
  const exp = expEl ? expEl.innerText : 'SIN ASIGNAR';
  const dir = (dirEl && dirEl.value) ? dirEl.value : 'la ubicación indicada';

  if (modoConversacion === 'REQUIRENTE') {
    const r = (escenarioActual && escenarioActual.respuestas) || {};
    if (lower.includes("respira") || lower.includes("respirar") || lower.includes("satur")) {
      return r.respira || r.defecto || "No estoy seguro de cómo respira.";
    }
    if (lower.includes("consciente") || lower.includes("responde") || lower.includes("ojos") || lower.includes("glasgow") || lower.includes("avdi")) {
      return r.consciente || r.defecto || "No responde bien al hablarle.";
    }
    if (lower.includes("dónde") || lower.includes("donde") || lower.includes("dirección") || lower.includes("calle") || lower.includes("ubic") || lower.includes("on ")) {
      return r.donde || r.defecto || `Estamos en ${dir}.`;
    }
    if (lower.includes("tensión") || lower.includes("tension") || lower.includes("pulso") || lower.includes("frecuencia") || lower.includes("temperatura") || lower.includes("constantes")) {
      return r.constantes || r.defecto || "No tengo aparato de medición aquí, solo veo su estado.";
    }
    if (lower.includes("sangr") || lower.includes("hemorrag")) {
      return r.sangrado || r.defecto || "Hay sangrado visible.";
    }
    if (lower.includes("masaje") || lower.includes("rcp") || lower.includes("pecho") || lower.includes("instruc")) {
      const chk = document.getElementById('chkIpaDada');
      if (chk) chk.checked = true;
      return r.rcp || r.defecto || "Entendido, sigo tus instrucciones.";
    }
    return r.defecto || `Te escucho, estamos en ${dir}.`;
  }

  if (centroActivoObj && centroActivoObj.categoria === 'HOSPITALES') {
    return `Preaviso registrado en ${centroActivoObj.nombre} para el expediente ${exp}. Urgencias alertadas para recepción de paciente.`;
  }
  if (centroActivoObj && centroActivoObj.categoria === 'MOSSOS') {
    return `Comissaria de Mossos d'Esquadra enterada en ${dir}, expediente ${exp}. Coordinamos dotación.`;
  }
  if (centroActivoObj && centroActivoObj.categoria === 'BOMBERS') {
    return `Parc de Bombers recibido aviso en ${dir}, expediente ${exp}. Valoramos dotación y acceso.`;
  }
  if (centroActivoObj && centroActivoObj.categoria === 'PROTECCIO_CIVIL') {
    return `Protecció Civil anotada la incidencia en ${dir}, expediente ${exp}. Queda en seguimiento.`;
  }

  return `Recibido en ${modoConversacion || 'central'} para el expediente ${exp} en ${dir}.`;
}

function activarMicrofono() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition