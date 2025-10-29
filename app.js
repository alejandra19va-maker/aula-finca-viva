// Aula Finca Viva - versión final (lista ya con 3 lecciones y voz de niño)
const STORAGE_KEY = "aula_finca_viva_final_v3";
let state = {
  student: { name: "Juan Miguel" },
  progress: { stories: [], lessons: [], experiments: [], games: [] },
  messages: []
};

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderProgress(); }
function loadState(){ const s = localStorage.getItem(STORAGE_KEY); if(s) state = JSON.parse(s); }
load();

// Mensajes diarios por defecto (máximo editable desde Zona Madre)
const DEFAULT_MESSAGES = [
  "Recuerda, pequeño explorador, cada semilla es una promesa de vida.",
  "El sol siempre vuelve a brillar, incluso después de la lluvia.",
  "La curiosidad es la semilla del conocimiento.",
  "Cada pequeño esfuerzo cuenta, como la abeja que trabaja por su colmena.",
  "Aprende del río: sigue tu camino, pero nunca olvides de dónde vienes."
];

// Contenidos completos: 3 lecciones, cuentos y experimentos
const STORIES = [
  { id: "s1", title: "El árbol que soñaba con volar", text: "Había una vez un pequeño árbol que soñaba con tocar las nubes. Cada día crecía un poquito gracias al agua, el sol y el cariño de la tierra." },
  { id: "s2", title: "La semilla viajera", text: "Una semilla rodó por la finca hasta encontrar un lugar suave donde brotar. Con paciencia y cuidado, se convirtió en una planta fuerte." }
];

const LESSONS = [
  { id: "l1", title: "La Huerta Viva", content: "Observa las semillas: planta una semilla de fríjol en algodón o tierra, mantén húmedo y registra cambios cada día. Dibuja lo que ves." },
  { id: "l2", title: "Los Animales de la Finca", content: "Observa las cabritas, gallinas y el mini pig. ¿Qué comen? ¿Cómo cuidan sus crías? Haz una lista de cuidados." },
  { id: "l3", title: "El Agua y la Vida", content: "Experimenta filtrando agua con arena y carbón. Observa cuál agua se ve más clara y por qué." }
];

const EXPERIMENTS = [
  { id: "e1", title: "Germinación en algodón", materials: ["Semillas","Algodón","Vaso"], steps: ["Moja el algodón","Coloca semillas entre capas","Observa y anota durante 7 días"] },
  { id: "e2", title: "Filtrar agua", materials: ["Botella","Arena","Carbón","Tela"], steps: ["Corta botella","Hace capas: tela, carbón, arena","Vierte agua y observa"] }
];

// UTIL: TTS - voz niño (prioriza es-CO infantil si existe)
function speak(text){
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-CO';
    u.rate = 0.95;
    const voices = speechSynthesis.getVoices();
    // preferir voz con 'child' o 'kid' o es-CO
    let v = voices.find(v=>/child|kid|infant/i.test(v.name)) || voices.find(v=>v.lang && v.lang.toLowerCase().includes('es-co')) || voices[0];
    if(v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch(e){
    console.warn('TTS no disponible', e);
  }
}

// RENDER INICIAL
function renderInitial(){
  document.getElementById('welcome-text').textContent = Hola hijo 🌞;
  const msg = getTodaysMessage();
  document.getElementById('daily-msg').textContent = msg;
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click', navHandler));
  document.getElementById('start-btn').addEventListener('click', startAdventure);
  document.getElementById('mother-login').addEventListener('click', motherLogin);
  document.getElementById('save-messages').addEventListener('click', saveMotherMessages);
}

// Mensaje del día (rotativo)
function getTodaysMessage(){
  const saved = localStorage.getItem('aula_messages');
  const list = saved ? saved.split('\n').filter(Boolean) : DEFAULT_MESSAGES;
  const idx = (new Date().getDate() - 1) % list.length;
  return list[idx] || DEFAULT_MESSAGES[0];
}

function startAdventure(){
  document.getElementById('nav').style.display = 'flex';
  document.getElementById('content').style.display = 'block';
  speak(Hola ${state.student.name}, la madre tierra y mamá te dan la bienvenida a tu Aula Finca Viva. Muy bien, pequeño explorador, ¿listo para comenzar la aventura?);
  renderStories();
  renderLessons();
  renderExps();
  renderProgress();
}

// Navegación entre secciones
function navHandler(e){
  const sec = e.currentTarget.dataset.section;
  document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));
  const el = document.getElementById(sec);
  if(el) el.classList.add('active');
}

// Cuentos
function renderStories(){
  const c = document.getElementById('cuentos');
  c.innerHTML = '<h2>Cuentos</h2>';
  STORIES.forEach(s=>{
    const d = document.createElement('div'); d.className='story-card';
    d.innerHTML = <h3>${s.title}</h3><p>${s.text.slice(0,160)}...</p><button class="play" data-id="${s.id}">🔊 Escuchar</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.play').forEach(b=>b.addEventListener('click', e=>{
    const id = e.target.dataset.id; const s = STORIES.find(x=>x.id===id);
    if(s){ speak(s.text); markProgress('story', id); speak('¡Excelente trabajo, pequeño explorador!'); }
  }));
}

// Lecciones
function renderLessons(){
  const c = document.getElementById('huerta');
  c.innerHTML = '<h2>Huerta y Naturaleza</h2>';
  LESSONS.forEach(l=>{
    const d = document.createElement('div'); d.className='lesson-card';
    d.innerHTML = <h3>${l.title}</h3><p>${l.content}</p><button class="done" data-id="${l.id}">✅ Marcar completado</button> <button class="listen" data-id="${l.id}">🔊 Escuchar</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.done').forEach(b=>b.addEventListener('click', e=>{ markProgress('lesson', e.target.dataset.id); alert('Lección marcada como completada.'); }));
  c.querySelectorAll('.listen').forEach(b=>b.addEventListener('click', e=>{ const id=e.target.dataset.id; const l=LESSONS.find(x=>x.id===id); if(l) { speak(l.content); } }));
}

// Experimentos
function renderExps(){
  const c = document.getElementById('ciencia');
  c.innerHTML = '<h2>Experimentos</h2>';
  EXPERIMENTS.forEach(x=>{
    const d=document.createElement('div'); d.className='exp-card';
    d.innerHTML = <h3>${x.title}</h3><p>Materiales: ${x.materials.join(', ')}</p><button class="view" data-id="${x.id}">Ver pasos</button> <button class="done" data-id="${x.id}">✅ Hecho</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.view').forEach(b=>b.addEventListener('click', e=>{ const id=e.target.dataset.id; const ex=EXPERIMENTS.find(x=>x.id===id); alert('Pasos:\\n' + ex.steps.join('\\n')); }));
  c.querySelectorAll('.done').forEach(b=>b.addEventListener('click', e=>{ markProgress('exp', e.target.dataset.id); alert('Experimento marcado.'); }));
}

// Progreso
function markProgress(type,id,extra){
  if(type==='story'){ if(!state.progress.stories.includes(id)) state.progress.stories.push(id); }
  if(type==='lesson'){ if(!state.progress.lessons.includes(id)) state.progress.lessons.push(id); }
  if(type==='exp'){ if(!state.progress.experiments.includes(id)) state.progress.experiments.push(id); }
  if(type==='game'){ if(!state.progress.games.includes(id)) state.progress.games.push(id); }
  if(extra) state.messages = state.messages || [];
  saveState();
}

function renderProgress(){
  const p = document.getElementById('progreso');
  p.innerHTML = `<h2>Progreso</h2>
    <p>Cuentos leídos: ${state.progress.stories.length}</p>
    <p>Lecciones completadas: ${state.progress.lessons.length}</p>
    <p>Experimentos: ${state.progress.experiments.length}</p>
    <p>Juegos: ${state.progress.games.length}</p>
    <button id="export-progress">Descargar progreso</button>`;
  const btn = document.getElementById('export-progress');
  if(btn) btn.onclick = ()=>{ const data = JSON.stringify(state, null, 2); const blob=new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='progreso_juan_miguel.json'; a.click(); };
}

// Zona Madre
function motherLogin(){
  const p = document.getElementById('mother-pass').value;
  if(p === 'madretierra'){ document.getElementById('mother-panel').style.display='block'; document.getElementById('mother-messages').value = localStorage.getItem('aula_messages') || DEFAULT_MESSAGES.join('\\n'); } else { alert('Contraseña incorrecta'); }
}
function saveMotherMessages(){
  const txt = document.getElementById('mother-messages').value;
  localStorage.setItem('aula_messages', txt);
  alert('Mensajes guardados');
}

// INIT
document.addEventListener('DOMContentLoaded', ()=>{
  renderInitial();
});
