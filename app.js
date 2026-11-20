(function () {
  const DURACION_GUARDIA_SEG = 12 * 60 * 60;
  const INTERVALO_LLAMADA_SEG = 15 * 60;
  const ESTADOS_UNIDAD = ['ACTIVADA', 'EN RUTA', 'EN LUGAR'];

  const RESPUESTAS_CAPS = {
    'CAP de Sala': "CAP de Sala CAT112, dime operador. ¿Qué novedad o apoyo necesitas en el expediente?",
    'CAP 061': "Central de Coordinació Sanitària 061 SEM, adelante. Indícanos ubicación, estado clínico y constantes.",
    'CAP Mossos': "Sala Regional de Comandament Mossos d'Esquadra, diga. ¿Requiere dotación de seguridad o tráfico?",
    'CAP Bombers': "Sala de Control Bombers de la Generalitat, adelante. Confirme localización, acceso y riesgos.",
    'CAP Protecció Civil': "CECAT Protecció Civil de Catalunya, le escuchamos. ¿Qué incidencia o plan se reporta?"
  };

  let map = null;
  let capaOSM = null;
  let capaTopo = null;
  let capaActual = 'osm';
  let marcador = null;
  let circuloPrecision = null;
  let marcadorCentro = null;

  let indiceEscenario = 0;
  let escenarioActual = null;
  let segundosAtencion = 0;
  let intervaloAtencion = null;
  let sonidoActivo = true;
  let unidadesDespachadas = [];

  let guardiaActiva = false;
  let segundosGuardia = 0;
  let proximoDisparoGuardia = INTERVALO_LLAMADA_SEG;
  let intervaloGuardia = null;
  let velocidadGuardia = 15;
  let colaLlamadas = [];

  let modoConversacion = null;
  let centroActivoObj = null;
  let audioCtx = null;
  let ultimoToque = 0;

  function obtenerEscenarios() {
    if (Array.isArray(window.ESCENARIOS_112) && window.ESCENARIOS_112.length > 0) {
      return window.ESCENARIOS_112;
    }
    if (typeof ESCENARIOS_112 !== 'undefined' && Array.isArray(ESCENARIOS_112) && ESCENARIOS_112.length > 0) {
      return ESCENARIOS_112;
    }
    return [];
  }

  function obtenerDirectorio() {
    if (typeof DIRECTORIO_CATALUNYA !== 'undefined' && DIRECTORIO_CATALUNYA) {
      return DIRECTORIO_CATALUNYA;
    }
    return {};
  }

  function formatoCrono(totalSeg) {
    const min = String(Math.floor(Math.max(0, totalSeg) / 60)).padStart(2, '0');
    const sec = String(Math.floor(Math.max(0, totalSeg) % 60)).padStart(2, '0');
    return `${min}:${sec}`;
  }

  function formatoGuardia(totalSeg) {
    const h = String(Math.floor(Math.max(0, totalSeg) / 3600)).padStart(2, '0');
    const m = String(Math.floor((Math.max(0, totalSeg) % 3600) / 60)).padStart(2, '0');
    return `${h}:${m}`;
  }

  function logOperativo(mensaje) {
    const div = document.getElementById('logOperativo');
    if (!div) return;
    const linea = document.createElement('div');
    linea.innerHTML = `<span class="text-slate-500">[${formatoGuardia(segundosGuardia)} · ${formatoCrono(segundosAtencion)}]</span> ${mensaje}`;
    div.appendChild(linea);
    div.scrollTop = div.scrollHeight;
  }

  function asegurarAudioContext() {
    if (!sonidoActivo) return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function reproducirTono(frecuencia = 740, duracion = 0.14, tipo = 'sine') {
    if (!sonidoActivo) return;
    try {
      const ctx = asegurarAudioContext();
      if (!ctx) return;
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

  function sintetizarVoz(texto, rate = 1.06) {
    if (!sonidoActivo || !texto || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(texto);
      const selIdioma = document.getElementById('idiomaSelect');
      utter.lang = selIdioma ? selIdioma.value : 'es-ES';
      utter.rate = rate;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  function hablarEnLinea(etiqueta, texto) {
    const chat = document.getElementById('chatLog');
    if (chat) {
      const item = document.createElement('div');
      item.className = 'text-amber-300';
      item.innerHTML = `<strong class="text-amber-400">${etiqueta}:</strong> ${texto}`;
      chat.appendChild(item);
      chat.scrollTop = chat.scrollHeight;
    }
    sintetizarVoz(texto, 1.06);
  }

  function inicializarMapa() {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;
    try {
      map = L.map('map').setView([41.6894, 2.4922], 12);
      capaOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      });
      capaTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap'
      });
      capaOSM.addTo(map);
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 250);
    } catch (_) {}
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
    if (!map || !escenarioActual || !Array.isArray(escenarioActual.coords)) return;
    map.setView(escenarioActual.coords, 15);
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

  function pintarCronoAtencion() {
    const el = document.getElementById('cronometro');
    if (!el) return;
    el.textContent = formatoCrono(segundosAtencion);
    if (segundosAtencion >= 60) {
      el.classList.add('text-red-500');
    } else {
      el.classList.remove('text-red-500');
    }
  }

  function iniciarCronometroAtencion(reiniciar = true) {
    if (reiniciar) {
      segundosAtencion = 0;
    }
    pintarCronoAtencion();
    if (intervaloAtencion) clearInterval(intervaloAtencion);
    intervaloAtencion = setInterval(() => {
      segundosAtencion += 1;
      pintarCronoAtencion();
    }, 1000);
  }

  function pintarGuardia() {
    const textoReloj = `${formatoGuardia(segundosGuardia)} / 12:00`;
    const textoBtn = guardiaActiva ? '⏸ Pausar Guardia' : '▶ Iniciar Guardia 12h';

    const r1 = document.getElementById('relojGuardia');
    const r2 = document.getElementById('relojGuardiaMovil');
    if (r1) r1.textContent = textoReloj;
    if (r2) r2.textContent = textoReloj;

    const b1 = document.getElementById('btnGuardia');
    if (b1) {
      b1.textContent = textoBtn;
      b1.className = guardiaActiva
        ? 'touch-manipulation bg-amber-600 hover:bg-amber-500 text-white font-bold px-2.5 py-1 rounded shadow'
        : 'touch-manipulation bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded shadow';
    }

    const b2 = document.getElementById('btnGuardiaMovil');
    if (b2) {
      b2.textContent = textoBtn;
      b2.className = guardiaActiva
        ? 'touch-manipulation bg-amber-600 active:bg-amber-500 text-white font-bold px-3 py-1.5 rounded shadow text-xs'
        : 'touch-manipulation bg-emerald-600 active:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded shadow text-xs';
    }

    const prox = document.getElementById('proxLlamadaBadge');
    if (prox) {
      const faltan = Math.max(0, proximoDisparoGuardia - segundosGuardia);
      prox.textContent = guardiaActiva ? `+${formatoGuardia(faltan)}` : '--:--';
    }

    const colaEl = document.getElementById('colaLlamadasBadge');
    if (colaEl) colaEl.textContent = String(colaLlamadas.length);

    const btnCola = document.getElementById('btnAtenderCola');
    if (btnCola) btnCola.classList.toggle('hidden', colaLlamadas.length === 0);
  }

  function obtenerSiguienteEscenario() {
    const lista = obtenerEscenarios();
    if (lista.length === 0) return null;
    const esc = lista[indiceEscenario % lista.length];
    indiceEscenario += 1;
    return esc;
  }

  function cargarLlamadaEnConsola(esc) {
    if (!esc) return;
    escenarioActual = esc;
    unidadesDespachadas = [];
    renderUnidades();

    modoConversacion = 'REQUIRENTE';
    centroActivoObj = null;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setText('idIncidente', esc.id || 'EXP-112');
    setText('lineaActivaBadge', '112 · REQUIRENTE');
    setVal('telAlertante', esc.telefono || '600 000 000');
    setVal('amlStatus', esc.aml || 'AML Activo');
    setVal('direccion', esc.direccionSugerida || '');
    setVal('tipologia', esc.tipologia || '');
    setVal('prioridad', esc.prioridad || 'ALTA');
    actualizarBadgeRiesgo();

    const estadoLlamada = document.getElementById('estadoLlamada');
    if (estadoLlamada) {
      estadoLlamada.innerHTML = '<span class="text-emerald-400">● EN LLAMADA (112)</span>';
    }

    const btnHablar = document.getElementById('btnHablar');
    const btnColgar = document.getElementById('btnColgar');
    if (btnHablar) btnHablar.disabled = false;
    if (btnColgar) btnColgar.disabled = false;

    const chat = document.getElementById('chatLog');
    if (chat) chat.innerHTML = '';

    if (Array.isArray(esc.coords) && esc.coords.length === 2) {
      const [lat, lng] = esc.coords;
      setText('coordsText', `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      if (map) {
        try {
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
            fillOpacity: 0.8,
            radius: 9
          }).addTo(map).bindPopup(`<b>${esc.id}</b><br>${esc.aml || ''}`).openPopup();
        } catch (_) {}
      }
    }

    iniciarCronometroAtencion(true);
    hablarEnLinea('Requirente', esc.saludoInicial || 'Emergencias 112, necesito ayuda.');
  }

  function dispararLlamadaProgramada() {
    const esc = obtenerSiguienteEscenario();
    if (!esc) return;

    reproducirTono(660, 0.16, 'sine');
    setTimeout(() => reproducirTono(880, 0.16, 'sine'), 180);

    if (modoConversacion !== null) {
      colaLlamadas.push(esc);
      logOperativo(`LLAMADA 112 EN COLA (${esc.id}) en guardia ${formatoGuardia(segundosGuardia)}.`);
      pintarGuardia();
      return;
    }

    cargarLlamadaEnConsola(esc);
    logOperativo(`Llamada automática de guardia (${esc.id}) en ${formatoGuardia(segundosGuardia)}.`);
  }

  function atenderSiguienteEnCola() {
    if (colaLlamadas.length === 0) return;
    const esc = colaLlamadas.shift();
    pintarGuardia();
    cargarLlamadaEnConsola(esc);
    logOperativo(`Atendida llamada en espera (${esc.id}).`);
  }

  function iniciarLlamadaManual() {
    reproducirTono(660, 0.16, 'sine');
    setTimeout(() => reproducirTono(880, 0.16, 'sine'), 180);
    const esc = obtenerSiguienteEscenario();
    if (!esc) {
      logOperativo('No hay escenarios disponibles en ESCENARIOS_112.');
      return;
    }
    cargarLlamadaEnConsola(esc);
    logOperativo(`Llamada 112 activada (${esc.id}).`);
  }

  function arrancarIntervaloGuardia() {
    if (intervaloGuardia) clearInterval(intervaloGuardia);
    intervaloGuardia = setInterval(() => {
      if (!guardiaActiva) return;
      segundosGuardia += velocidadGuardia;

      if (segundosGuardia >= DURACION_GUARDIA_SEG) {
        segundosGuardia = DURACION_GUARDIA_SEG;
        guardiaActiva = false;
        clearInterval(intervaloGuardia);
        intervaloGuardia = null;
        pintarGuardia();
        logOperativo('FIN DE GUARDIA DE 12 HORAS (12:00).');
        return;
      }

      if (segundosGuardia >= proximoDisparoGuardia) {
        proximoDisparoGuardia += INTERVALO_LLAMADA_SEG;
        dispararLlamadaProgramada();
      }

      pintarGuardia();
    }, 1000);
  }

  function iniciarGuardiaAutomatica() {
    if (guardiaActiva) return;
    guardiaActiva = true;
    proximoDisparoGuardia = segundosGuardia + INTERVALO_LLAMADA_SEG;
    pintarGuardia();
    arrancarIntervaloGuardia();
    logOperativo('Guardia de 12h iniciada automáticamente.');
  }

  function toggleGuardia() {
    if (!guardiaActiva) {
      guardiaActiva = true;
      if (segundosGuardia === 0) {
        proximoDisparoGuardia = INTERVALO_LLAMADA_SEG;
      }
      reproducirTono(780, 0.14, 'triangle');
      pintarGuardia();
      arrancarIntervaloGuardia();
      logOperativo('Guardia de 12h en marcha.');
    } else {
      guardiaActiva = false;
      if (intervaloGuardia) {
        clearInterval(intervaloGuardia);
        intervaloGuardia = null;
      }
      pintarGuardia();
      logOperativo(`Guardia pausada en ${formatoGuardia(segundosGuardia)}.`);
    }
  }

  function llamarCAP(nombreCAP) {
    reproducirTono(720, 0.14, 'sine');
    modoConversacion = nombreCAP;
    centroActivoObj = null;

    const lineaBadge = document.getElementById('lineaActivaBadge');
    const estadoLlamada = document.getElementById('estadoLlamada');
    const btnHablar = document.getElementById('btnHablar');
    const btnColgar = document.getElementById('btnColgar');

    if (lineaBadge) lineaBadge.textContent = nombreCAP.toUpperCase();
    if (estadoLlamada) estadoLlamada.innerHTML = `<span class="text-amber-400">● CONECTADO · ${nombreCAP}</span>`;
    if (btnHablar) btnHablar.disabled = false;
    if (btnColgar) btnColgar.disabled = false;

    iniciarCronometroAtencion(false);
    logOperativo(`Conectado con ${nombreCAP}.`);
    hablarEnLinea(nombreCAP, RESPUESTAS_CAPS[nombreCAP] || `${nombreCAP}, adelante.`);
  }

  function actualizarListaCentros() {
    const catEl = document.getElementById('categoriaDirectorio');
    const sel = document.getElementById('centroDirectorio');
    if (!catEl || !sel) return;
    const dir = obtenerDirectorio();
    const lista = dir[catEl.value] || [];
    sel.innerHTML = lista.map((c, idx) => `<option value="${idx}">${c.nombre}</option>`).join('');
  }

  function llamarCentroSeleccionado() {
    const catEl = document.getElementById('categoriaDirectorio');
    const selEl = document.getElementById('centroDirectorio');
    if (!catEl || !selEl) return;
    const dir = obtenerDirectorio();
    const lista = dir[catEl.value] || [];
    const centro = lista[parseInt(selEl.value, 10)];
    if (!centro) return;

    reproducirTono(720, 0.14, 'sine');
    modoConversacion = centro.nombre;
    centroActivoObj = { categoria: catEl.value, ...centro };

    const lineaBadge = document.getElementById('lineaActivaBadge');
    const estadoLlamada = document.getElementById('estadoLlamada');
    const btnHablar = document.getElementById('btnHablar');
    const btnColgar = document.getElementById('btnColgar');

    if (lineaBadge) lineaBadge.textContent = centro.id || centro.nombre;
    if (estadoLlamada) estadoLlamada.innerHTML = `<span class="text-emerald-400">● EN LÍNEA · ${centro.id || centro.nombre}</span>`;
    if (btnHablar) btnHablar.disabled = false;
    if (btnColgar) btnColgar.disabled = false;

    iniciarCronometroAtencion(false);

    if (Array.isArray(centro.coords) && centro.coords.length === 2 && map) {
      const [lat, lng] = centro.coords;
      const coordsEl = document.getElementById('coordsText');
      if (coordsEl) coordsEl.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        map.setView([lat, lng], 15);
        if (marcadorCentro) map.removeLayer(marcadorCentro);
        marcadorCentro = L.circleMarker([lat, lng], {
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.85,
          radius: 8
        }).addTo(map).bindPopup(`<b>${centro.nombre}</b>`).openPopup();
      } catch (_) {}
    }

    logOperativo(`Llamada a ${centro.nombre}.`);
    hablarEnLinea(centro.nombre, centro.saludo || `${centro.nombre}, adelante.`);
  }

  function generarRespuestaVoz(textoUsuario) {
    const lower = (textoUsuario || '').toLowerCase();
    const expEl = document.getElementById('idIncidente');
    const dirEl = document.getElementById('direccion');
    const exp = expEl ? expEl.textContent : 'EXP-112';
    const dir = (dirEl && dirEl.value) ? dirEl.value : 'la ubicación indicada';

    if (modoConversacion === 'REQUIRENTE') {
      const r = (escenarioActual && escenarioActual.respuestas) || {};
      if (lower.includes('respira') || lower.includes('respirar') || lower.includes('aire')) {
        return r.respira || r.defecto || 'Respira con dificultad.';
      }
      if (lower.includes('consciente') || lower.includes('responde') || lower.includes('ojos')) {
        return r.consciente || r.defecto || 'Responde con dificultad.';
      }
      if (lower.includes('dónde') || lower.includes('donde') || lower.includes('dirección') || lower.includes('calle')) {
        return r.donde || r.defecto || `Estamos en ${dir}.`;
      }
      if (lower.includes('constantes') || lower.includes('tensión') || lower.includes('pulso')) {
        return r.constantes || r.defecto || 'No tengo equipo de medición aquí.';
      }
      if (lower.includes('sangr') || lower.includes('hemorrag')) {
        return r.sangrado || r.defecto || 'No veo sangrado grave.';
      }
      if (lower.includes('rcp') || lower.includes('masaje') || lower.includes('pecho')) {
        const chk = document.getElementById('chkIpaDada');
        if (chk) chk.checked = true;
        return r.rcp || r.defecto || 'De acuerdo, sigo las instrucciones.';
      }
      return r.defecto || `Estamos en ${dir}.`;
    }

    return `Recibido en ${modoConversacion || 'central'} para el expediente ${exp} en ${dir}.`;
  }

  function activarMicrofono() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      logOperativo('Reconocimiento de voz no disponible en este navegador.');
      return;
    }
    try {
      const rec = new SpeechRec();
      const idiomaEl = document.getElementById('idiomaSelect');
      rec.lang = idiomaEl ? idiomaEl.value : 'es-ES';
      const btn = document.getElementById('btnHablar');
      if (btn) btn.textContent = '🛑 Escuchando...';

      rec.onresult = (ev) => {
        const texto = ev.results[0][0].transcript;
        const chat = document.getElementById('chatLog');
        if (chat) {
          chat.innerHTML += `<div class="text-sky-300">