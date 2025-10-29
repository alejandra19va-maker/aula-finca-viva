// Aula Finca Viva - versión final (lista para Vercel)
const STORAGE_KEY = "aula_finca_viva_final_v2";
let state = {
  student: { name: "Juan Miguel" },
  progress: { stories: [], lessons: [], experiments: [], games: [] },
  messages: []
};

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderProgress(); }
function loadState(){ const s = localStorage.getItem(STORAGE_KEY); if(s) state = JSON.parse(s); }
load();

// Mensajes diarios (si la mamá los edita, se guardan en localStorage)
const DEFAULT_MESSAGES = [
  "Recuerda, pequeño explorador, cada semilla es una promesa de vida.",
  "El sol siempre vuelve a brillar, incluso después de la lluvia.",
  "La curiosidad es la semilla del conocimiento.",
  "Cada pequeño esfuerzo cuenta, como la abeja que trabaja por su colmena.",
  "Aprende del río: sigue tu camino, pero nunca olvides de dónde vienes."
];

// Contenidos: cuentos, lecciones, experimentos
const STORIES = [
  { id: "s1", title: "El árbol que soñaba con volar", text: "Había una vez un pequeño árbol que soñaba con tocar las nubes..." },
  { id: "s2", title: "La semilla viajera", text: "Una semilla viajó por la finca hasta encontrar su lugar..." },
  { id: "s3", title: "El río y las luciérnagas", text: "En la noche el río brillaba junto a las luciérnagas..." }
];

const LESSONS = [
  { id: "l1", title: "Partes de una planta", content: "Raíz, tallo, hojas, flores y frutos. Observa y dibuja." },
  { id: "l2", title: "Qué necesitan las plantas", content: "Agua, luz, aire y nutrientes." },
  { id: "l3", title: "Germinación en algodón", content: "Coloca semillas entre algodón húmedo y observa." }
];

const EXPERIMENTS = [
  { id: "e1", title: "Filtrar agua con arena y carbón", materials: ["Botella","Arena","Carbón","Tela"], steps: ["Corta la botella","Apila capas: tela, carbón, arena","Vierte agua y observa"] },
  { id: "e2", title: "Crear compost", materials: ["Restos orgánicos","Caja","Tierra"], steps: ["Mezclar restos con tierra","Mantener humedad","Revisar en semanas"] }
];

// RENDERERS
function renderInitial(){
  document.getElementById('welcome-text').textContent = Hola hijo 🌞;
  const msg = getTodaysMessage();
  document.getElementById('daily-msg').textContent = msg;
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click', navHandler));
  document.getElementById('start-btn').addEventListener('click', startAdventure);
  document.getElementById('mother-login').addEventListener('click', motherLogin);
  document.getElementById('save-messages').addEventListener('click', saveMotherMessages);
}

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

function navHandler(e){
  const sec = e.currentTarget.dataset.section;
  document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));
  const el = document.getElementById(sec);
  if(el) el.classList.add('active');
}

// STORIES
function renderStories(){
  const c = document.getElementById('cuentos');
  c.innerHTML = '<h2>Cuentos</h2>';
  STORIES.forEach(s=>{
    const d = document.createElement('div');
    d.className = 'story-card';
    d.innerHTML = <h3>${s.title}</h3><p>${s.text.slice(0,120)}...</p><button data-id="${s.id}" class="play">🔊 Escuchar</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.play').forEach(b=>b.addEventListener('click', e=>{
    const id = e.target.dataset.id;
    const s = STORIES.find(x=>x.id===id);
    if(s){ speak(s.text); markProgress('story', id); speak('¡Excelente trabajo, pequeño explorador!'); }
  }));
}

// LESSONS
function renderLessons(){
  const c = document.getElementById('huerta');
  c.innerHTML = '<h2>Huerta y Naturaleza</h2>';
  LESSONS.forEach(l=>{
    const d = document.createElement('div');
    d.className='lesson-card';
    d.innerHTML = <h3>${l.title}</h3><p>${l.content}</p><button data-id="${l.id}" class="done">✅ Marcar completado</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.done').forEach(b=>b.addEventListener('click', e=>{
    markProgress('lesson', e.target.dataset.id);
    alert('Lección marcada como completada.');
  }));
}

// EXPERIMENTS
function renderExps(){
  const c = document.getElementById('ciencia');
  c.innerHTML = '<h2>Experimentos</h2>';
  EXPERIMENTS.forEach(x=>{
    const d=document.createElement('div'); d.className='exp-card';
    d.innerHTML = <h3>${x.title}</h3><p>Materiales: ${x.materials.join(', ')}</p><button data-id="${x.id}" class="view">Ver</button><button data-id="${x.id}" class="done">✅ Hecho</button>;
    c.appendChild(d);
  });
  c.querySelectorAll('.view').forEach(b=>b.addEventListener('click', e=>{
    const id=e.target.dataset.id; const ex=EXPERIMENTS.find(x=>x.id===id);
    alert('Pasos:\\n' + ex.steps.join('\\n'));
  }));
  c.querySelectorAll('.done').forEach(b=>b.addEventListener('click', e=>{ markProgress('exp', e.target.dataset.id); alert('Experimento marcado.'); }));
}

// PROGRESS
function markProgress(type,id,extra){
  if(type==='story'){ if(!state.progress.stories.includes(id)) state.progress.stories.push(id); }
  if(type==='lesson'){ if(!state.progress.lessons.includes(id)) state.progress.lessons.push(id); }
  if(type==='exp'){ if(!state.progress.experiments.includes(id)) state.progress.experiments.push(id); }
  if(type==='game'){ if(!state.progress.games.includes(id)) state.progress.games.push(id); }
  if(extra) state.logs = state.logs || [];
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

// MOTHER PANEL
function motherLogin(){
  const p = document.getElementById('mother-pass').value;
  if(p === 'madretierra'){ document.getElementById('mother-panel').style.display='block'; document.getElementById('mother-messages').value = localStorage.getItem('aula_messages') || DEFAULT_MESSAGES.join('\\n'); } else { alert('Contraseña incorrecta'); }
}
function saveMotherMessages(){
  const txt = document.getElementById('mother-messages').value;
  localStorage.setItem('aula_messages', txt);
  alert('Mensajes guardados');
}

// TEXT-TO-SPEECH (voz natural colombiana si está disponible)
function speak(text){
  try{
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-CO';
    utter.rate = 0.95;
    const vlist = speechSynthesis.getVoices();
    let chosen = vlist.find(v=>v.lang && v.lang.toLowerCase().includes('es-co')) || vlist.find(v=>/child|kid|infant/i.test(v.name)) || vlist[0];
    if(chosen) utter.voice = chosen;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }catch(e){
    console.warn('TTS no disponible', e);
  }
}

// INIT
document.addEventListener('DOMContentLoaded', ()=>{
  renderInitial();
});
    } else {
        resultado.textContent = `No exactamente. La respuesta correcta era ${correcto}. 🌻`;
    }
}
