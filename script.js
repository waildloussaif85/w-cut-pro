const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const canvasBox = document.getElementById('canvasBox');
const bgVideo = document.getElementById('bgVideo');
const bgAudio = document.getElementById('bgAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const timeDisplay = document.getElementById('timeDisplay');
const mediaCounter = document.getElementById('mediaCounter');

// إدارة شاشة الترحيب (Welcome Screen)
const welcomeScreen = document.getElementById('welcomeScreen');
const editorApp = document.getElementById('editorApp');

function openEditorWithRatio(ratio) {
  welcomeScreen.classList.add('hidden');
  editorApp.classList.remove('hidden');
  if (ratio) {
    document.getElementById('ratioSelect').value = ratio;
    applyAspectRatio(ratio);
  }
}

document.getElementById('startNewBtn').addEventListener('click', () => openEditorWithRatio('9:16'));
document.querySelectorAll('.ratio-card').forEach(card => {
  card.addEventListener('click', () => openEditorWithRatio(card.dataset.ratio));
});
document.getElementById('backHomeBtn').addEventListener('click', () => {
  bgAudio.pause(); bgVideo.pause(); isPlaying = false; playPauseBtn.textContent = '▶️';
  editorApp.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

// قاموس اللغات
const i18n = {
  en: {
    dir: 'ltr', welcomeSub: 'Next-Gen AI Video & Beat Studio', newProject: '✨ + New Project',
    featuresTag: '⚡ Kids Privacy AI • DJ Halo • Auto Lyrics • 60FPS',
    export: 'Save HD ⬇️', rendering: '🔴 Rendering...',
    importMedia: 'Videos/Photos', importAudio: 'Audio/Music', importLogo: 'Add Logo',
    titlePh: 'Top Title (Optional)', lyricsPh: 'Write lyrics (Auto-wraps to 2 lines)...',
    kidsGuard: '👶 Guard: OFF', kidsGuardOn: '👶 Guard: ON',
    clearMasks: '🗑️ Reset', kidsNote: 'Auto-detects child faces or tap any face on screen to cover.',
    vfxZoom: '🔊 Bass Zoom', vfxShake: '📳 Cam Shake', vfxGlitch: '👾 RGB Glitch',
    vfxRelight: '💡 AI Relight', vfxWave: '📊 Visualizer',
    tabMedia: '📁 Media', tabText: '🔤 Text', tabKids: '👶 Kids AI', tabVfx: '✨ Pro VFX',
    bgOff: '⬜ BG: OFF', bgOn: '⬛ BG: ON', slantOff: '📐 Slant: OFF', slantOn: '📐 Slant: ON',
    videoReady: '✅ Video Ready!', downloadFile: '⬇️ Save to Device', shareFile: '📤 Share / Gallery', closeBtn: 'Close'
  },
  ar: {
    dir: 'rtl', welcomeSub: 'استوديو المونتاج الذكي والـ DJ الاحترافي', newProject: '✨ + مشروع جديد',
    featuresTag: '⚡ حماية الأطفال • لوغو نابض • كاريوكي تلقائي',
    export: 'حفظ HD ⬇️', rendering: '🔴 جاري الحفظ...',
    importMedia: 'فيديو / صور', importAudio: 'غناية / صوت', importLogo: 'إضافة لوغو',
    titlePh: 'عنوان فوقاني (اختياري)', lyricsPh: 'اكتب الكلمات (الجمل الطويلة تنقسم لسطرين)...',
    kidsGuard: '👶 حماية: معطّل', kidsGuardOn: '👶 حماية: مفعّل',
    clearMasks: '🗑️ مسح', kidsNote: 'يكتشف وجوه الأطفال تلقائياً أو انقر على أي وجه لتغطيته.',
    vfxZoom: '🔊 زوم الباص', vfxShake: '📳 اهتزاز', vfxGlitch: '👾 جليتش',
    vfxRelight: '💡 إضاءة AI', vfxWave: '📊 موجات',
    tabMedia: '📁 الوسائط', tabText: '🔤 النصوص', tabKids: '👶 الأطفال', tabVfx: '✨ مؤثرات',
    bgOff: '⬜ خلفية: لا', bgOn: '⬛ خلفية: نعم', slantOff: '📐 مائل: لا', slantOn: '📐 مائل: نعم',
    videoReady: '✅ الفيديو جاهز!', downloadFile: '⬇️ حفظ في الهاتف', shareFile: '📤 مشاركة / الاستوديو', closeBtn: 'إغلاق'
  },
  fr: {
    dir: 'ltr', welcomeSub: 'Studio Vidéo & Rythme IA Nouvelle Génération', newProject: '✨ + Nouveau Projet',
    featuresTag: '⚡ Protection Enfants • Logo DJ • Paroles Auto',
    export: 'Enregistrer ⬇️', rendering: '🔴 Exportation...',
    importMedia: 'Vidéos/Photos', importAudio: 'Audio/Musique', importLogo: 'Ajouter Logo',
    titlePh: 'Titre supérieur (Optionnel)', lyricsPh: 'Paroles (Division auto sur 2 lignes)...',
    kidsGuard: '👶 Garde: OFF', kidsGuardOn: '👶 Garde: ON',
    clearMasks: '🗑️ Effacer', kidsNote: 'Détecte les visages ou touchez un visage pour le masquer.',
    vfxZoom: '🔊 Zoom Basse', vfxShake: '📳 Secousse', vfxGlitch: '👾 Glitch RGB',
    vfxRelight: '💡 Éclairage IA', vfxWave: '📊 Ondes',
    tabMedia: '📁 Médias', tabText: '🔤 Texte', tabKids: '👶 Enfants', tabVfx: '✨ Effets',
    bgOff: '⬜ Fond: NON', bgOn: '⬛ Fond: OUI', slantOff: '📐 Incliné: NON', slantOn: '📐 Incliné: OUI',
    videoReady: '✅ Vidéo Prête !', downloadFile: '⬇️ Sauvegarder', shareFile: '📤 Partager / Galerie', closeBtn: 'Fermer'
  },
  es: {
    dir: 'ltr', welcomeSub: 'Estudio de Video y Ritmo con IA', newProject: '✨ + Nuevo Proyecto',
    featuresTag: '⚡ Protección Niños • Logo DJ • Letras Auto',
    export: 'Guardar HD ⬇️', rendering: '🔴 Renderizando...',
    importMedia: 'Videos/Fotos', importAudio: 'Audio/Música', importLogo: 'Añadir Logo',
    titlePh: 'Título superior (Opcional)', lyricsPh: 'Escribe la letra (División auto en 2 líneas)...',
    kidsGuard: '👶 Guardia: OFF', kidsGuardOn: '👶 Guardia: ON',
    clearMasks: '🗑️ Limpiar', kidsNote: 'Detecta rostros o toca una cara para cubrirla.',
    vfxZoom: '🔊 Zoom Bajo', vfxShake: '📳 Vibración', vfxGlitch: '👾 Glitch RGB',
    vfxRelight: '💡 Luz IA', vfxWave: '📊 Ondas',
    tabMedia: '📁 Medios', tabText: '🔤 Texto', tabKids: '👶 Niños', tabVfx: '✨ Efectos',
    bgOff: '⬜ Fondo: NO', bgOn: '⬛ Fondo: SÍ', slantOff: '📐 Inclinado: NO', slantOn: '📐 Inclinado: SÍ',
    videoReady: '✅ ¡Video Listo!', downloadFile: '⬇️ Guardar', shareFile: '📤 Compartir / Galería', closeBtn: 'Cerrar'
  }
};

let currentLang = 'en';
document.getElementById('welcomeLangSelect').addEventListener('change', (e) => {
  currentLang = e.target.value;
  const lang = i18n[currentLang];
  document.getElementById('htmlRoot').dir = lang.dir;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (k === 'kidsGuard') el.textContent = kidsGuardActive ? lang.kidsGuardOn : lang.kidsGuard;
    else if (lang[k]) el.textContent = lang[k];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = lang[el.dataset.i18nPlaceholder];
  });
  document.getElementById('titleBgBtn').textContent = titleHasBg ? lang.bgOn : lang.bgOff;
  document.getElementById('textSlantBtn').textContent = isSlanted ? lang.slantOn : lang.slantOff;
});

// حفظ مسودة النصوص والإعدادات في ذاكرة الهاتف (Save Draft)
document.getElementById('saveDraftBtn').addEventListener('click', () => {
  const draft = {
    title: document.getElementById('topTitleInput').value,
    lyrics: document.getElementById('lyricsInput').value,
    fontSize: fontSize
  };
  localStorage.setItem('wcut_draft', JSON.stringify(draft));
  alert(currentLang === 'ar' ? '✅ تم حفظ المسودة بنجاح!' : '✅ Project draft saved!');
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('wcut_draft');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      if (d.title) document.getElementById('topTitleInput').value = d.title;
      if (d.lyrics) document.getElementById('lyricsInput').value = d.lyrics;
      if (d.fontSize) { fontSize = d.fontSize; document.getElementById('fontSizeSlider').value = d.fontSize; }
    } catch (e) {}
  }
});

let mediaPlaylist = [];
let currentMediaIdx = 0;
let slideshowTimer = 0;
let transitionAlpha = 1;
let isPlaying = false;

let logoImg = null;
let logoPos = { x: 270, y: 780 };
let logoSize = 150;
let logoHalo = true;
let logoRemoveBlack = false;

let kidsGuardActive = false;
let maskModes = ['blur', 'emoji', 'pixel'];
let maskModeIdx = 0;
let faceDetector = null;
let detectedFaces = [];
let manualMasks = [];

if ('FaceDetector' in window) {
  try { faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 10 }); } catch (e) {}
}

let lyricPos = { x: 270, y: 580 };
let titlePos = { x: 270, y: 120 };
let draggingTarget = null;
let fontSize = 42;
let titleHasBg = false;
let isSlanted = false;

const fonts = [
  { name: '✒️ Calligraphic', family: "'Aref Ruqaa', serif" },
  { name: '✒️ Modern', family: "'Cairo', sans-serif" },
  { name: '✒️ Classic', family: "'Amiri', serif" }
];
let fontIdx = 0;

const textAnims = [
  { name: '✨ Wave', type: 'wave' },
  { name: '✨ Pulse', type: 'pulse' },
  { name: '✨ Slide', type: 'slide' },
  { name: '✨ Static', type: 'none' }
];
let animIdx = 0;

const textStyles = [
  { name: '🎨 Yellow', fill: '#FFD700', stroke: '#000000' },
  { name: '🎨 White', fill: '#FFFFFF', stroke: '#000000' },
  { name: '🎨 Neon', fill: '#00FFCC', stroke: '#000000' }
];
let styleIdx = 0;

const vfxState = { bassZoom: true, shake: false, glitch: false, relight: false, visualizer: true };
const filters = [
  { name: '🎞️ Normal', css: 'none' },
  { name: '🎞️ Cinema', css: 'contrast(1.3) saturate(1.4)' },
  { name: '🎞️ Night', css: 'brightness(0.85) contrast(1.25)' },
  { name: '🎞️ B&W', css: 'grayscale(1) contrast(1.3)' }
];
let filterIdx = 0;
const speeds = [1.0, 1.5, 2.0, 0.5];
let speedIdx = 0;

document.getElementById('logoInput').addEventListener('change', (e) => {
  const file = e.target.files.item(0);
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    logoImg = img;
    logoPos = { x: canvas.width / 2, y: canvas.height * 0.8 };
    document.getElementById('logoControls').classList.remove('hidden');
  };
  img.src = URL.createObjectURL(file);
});
document.getElementById('logoRingBtn').addEventListener('click', (e) => { logoHalo = !logoHalo; e.target.classList.toggle('active', logoHalo); });
document.getElementById('logoBlendBtn').addEventListener('click', (e) => { logoRemoveBlack = !logoRemoveBlack; e.target.classList.toggle('active', logoRemoveBlack); });
document.getElementById('logoRemoveBtn').addEventListener('click', () => { logoImg = null; document.getElementById('logoControls').classList.add('hidden'); });
document.getElementById('logoSizeSlider').addEventListener('input', (e) => { logoSize = parseInt(e.target.value); });

document.getElementById('titleBgBtn').addEventListener('click', (e) => { titleHasBg = !titleHasBg; e.target.textContent = titleHasBg ? i18n[currentLang].bgOn : i18n[currentLang].bgOff; });
document.getElementById('fontFamilyBtn').addEventListener('click', (e) => { fontIdx = (fontIdx + 1) % fonts.length; e.target.textContent = fonts[fontIdx].name; });
document.getElementById('textAnimBtn').addEventListener('click', (e) => { animIdx = (animIdx + 1) % textAnims.length; e.target.textContent = textAnims[animIdx].name; });
document.getElementById('textSlantBtn').addEventListener('click', (e) => { isSlanted = !isSlanted; e.target.textContent = isSlanted ? i18n[currentLang].slantOn : i18n[currentLang].slantOff; e.target.classList.toggle('active', isSlanted); });
document.getElementById('textStyleBtn').addEventListener('click', (e) => { styleIdx = (styleIdx + 1) % textStyles.length; e.target.textContent = textStyles[styleIdx].name; });
document.getElementById('fontSizeSlider').addEventListener('input', (e) => { fontSize = parseInt(e.target.value); });

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.remove('hidden');
  });
});

document.getElementById('kidsGuardBtn').addEventListener('click', (e) => {
  kidsGuardActive = !kidsGuardActive; e.target.classList.toggle('active', kidsGuardActive);
  e.target.textContent = kidsGuardActive ? i18n[currentLang].kidsGuardOn : i18n[currentLang].kidsGuard;
  if (!kidsGuardActive) detectedFaces = [];
});
document.getElementById('maskTypeBtn').addEventListener('click', (e) => { maskModeIdx = (maskModeIdx + 1) % maskModes.length; e.target.textContent = ['🌫️ Blur', '😎 Emoji', '🟦 Pixel'][maskModeIdx]; });
document.getElementById('clearMasksBtn').addEventListener('click', () => { manualMasks = []; detectedFaces = []; });

document.querySelectorAll('.vfx-btn[data-vfx]').forEach(btn => {
  btn.addEventListener('click', () => { const k = btn.dataset.vfx; vfxState[k] = !vfxState[k]; btn.classList.toggle('active', vfxState[k]); });
});

function applyAspectRatio(v) {
  if (v === '9:16') { canvas.width = 540; canvas.height = 960; canvasBox.style.aspectRatio = '9/16'; }
  if (v === '1:1')  { canvas.width = 720; canvas.height = 720; canvasBox.style.aspectRatio = '1/1'; }
  if (v === '16:9') { canvas.width = 960; canvas.height = 540; canvasBox.style.aspectRatio = '16/9'; }
  lyricPos = { x: canvas.width / 2, y: canvas.height * 0.6 };
  titlePos = { x: canvas.width / 2, y: canvas.height * 0.14 };
  logoPos = { x: canvas.width / 2, y: canvas.height * 0.82 };
}
document.getElementById('ratioSelect').addEventListener('change', (e) => applyAspectRatio(e.target.value));

document.getElementById('speedBtn').addEventListener('click', (e) => {
  speedIdx = (speedIdx + 1) % speeds.length; const s = speeds[speedIdx];
  bgVideo.playbackRate = s; bgAudio.playbackRate = s; e.target.textContent = `⚡ ${s}x`;
});
document.getElementById('filterBtn').addEventListener('click', (e) => { filterIdx = (filterIdx + 1) % filters.length; e.target.textContent = filters[filterIdx].name; });
let audioCtx, analyser, dataArray, audioSource;
function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    audioSource = audioCtx.createMediaElementSource(bgAudio);
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

document.getElementById('bgInput').addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  mediaPlaylist = []; currentMediaIdx = 0;
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('video/')) mediaPlaylist.push({ type: 'video', url: url });
    else if (file.type.startsWith('image/')) {
      const img = new Image(); img.src = url;
      mediaPlaylist.push({ type: 'image', img: img });
    }
  });
  if (mediaPlaylist.length > 0) { mediaCounter.classList.remove('hidden'); loadPlaylistItem(0); }
});

function loadPlaylistItem(index) {
  if (!mediaPlaylist.length) return;
  currentMediaIdx = index % mediaPlaylist.length;
  transitionAlpha = 0.2;
  mediaCounter.textContent = `${currentMediaIdx + 1} / ${mediaPlaylist.length}`;
  const item = mediaPlaylist[currentMediaIdx];
  if (item.type === 'video') {
    bgVideo.src = item.url;
    bgVideo.onloadeddata = () => { bgVideo.play(); isPlaying = true; playPauseBtn.textContent = '⏸️'; };
  } else {
    bgVideo.pause(); bgVideo.removeAttribute('src'); bgVideo.load();
  }
}

bgVideo.addEventListener('ended', () => {
  if (mediaPlaylist.length > 1) loadPlaylistItem(currentMediaIdx + 1);
  else { bgVideo.currentTime = 0; bgVideo.play(); }
});

document.getElementById('audioInput').addEventListener('change', (e) => {
  const file = e.target.files.item(0);
  if (!file) return;
  bgAudio.src = URL.createObjectURL(file);
  initAudio();
  bgAudio.play().then(() => {
    if (mediaPlaylist[currentMediaIdx] && mediaPlaylist[currentMediaIdx].type === 'video') bgVideo.play();
    isPlaying = true; playPauseBtn.textContent = '⏸️';
  }).catch(() => {});
});

playPauseBtn.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  const item = mediaPlaylist[currentMediaIdx];
  if (isPlaying) {
    bgAudio.pause(); if (item && item.type === 'video') bgVideo.pause();
    playPauseBtn.textContent = '▶️';
  } else {
    if (bgAudio.src) bgAudio.play(); if (item && item.type === 'video') bgVideo.play();
    playPauseBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
});

bgAudio.addEventListener('timeupdate', () => {
  if (bgAudio.duration) {
    seekBar.value = (bgAudio.currentTime / bgAudio.duration) * 100;
    const fmt = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
    timeDisplay.textContent = `${fmt(bgAudio.currentTime)} / ${fmt(bgAudio.duration)}`;
  }
});

seekBar.addEventListener('input', () => {
  if (bgAudio.duration) bgAudio.currentTime = (seekBar.value / 100) * bgAudio.duration;
});

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches.item(0) : (e.changedTouches ? e.changedTouches.item(0) : e);
  return {
    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
    y: (touch.clientY - rect.top) * (canvas.height / rect.height)
  };
}

let touchStartPos = null;
canvas.addEventListener('touchstart', (e) => {
  const pos = getCanvasCoords(e); touchStartPos = pos;
  if (logoImg && Math.hypot(pos.x - logoPos.x, pos.y - logoPos.y) < logoSize * 0.6) draggingTarget = 'logo';
  else if (Math.hypot(pos.x - lyricPos.x, pos.y - lyricPos.y) < 120) draggingTarget = 'lyric';
  else if (Math.hypot(pos.x - titlePos.x, pos.y - titlePos.y) < 90) draggingTarget = 'title';
});
canvas.addEventListener('touchmove', (e) => {
  if (!draggingTarget) return; e.preventDefault();
  const pos = getCanvasCoords(e);
  if (draggingTarget === 'logo') logoPos = pos;
  if (draggingTarget === 'lyric') lyricPos = pos;
  if (draggingTarget === 'title') titlePos = pos;
});
canvas.addEventListener('touchend', (e) => {
  if (!draggingTarget && touchStartPos && kidsGuardActive) {
    const endPos = getCanvasCoords(e);
    if (Math.hypot(endPos.x - touchStartPos.x, endPos.y - touchStartPos.y) < 15) {
      const idx = manualMasks.findIndex(m => Math.hypot(m.x - endPos.x, m.y - endPos.y) < m.r);
      if (idx !== -1) manualMasks.splice(idx, 1);
      else manualMasks.push({ x: endPos.x, y: endPos.y, r: 55 });
    }
  }
  draggingTarget = null; touchStartPos = null;
});

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      lines.push(line.trim()); line = words[n] + ' ';
    } else { line = testLine; }
  }
  lines.push(line.trim());
  const totalH = (lines.length - 1) * lineHeight;
  lines.forEach((l, i) => {
    const lineY = y - totalH / 2 + i * lineHeight;
    ctx.strokeText(l, x, lineY);
    ctx.fillText(l, x, lineY);
  });
}

let frameCount = 0;
async function runFaceDetection() {
  if (!kidsGuardActive || !faceDetector) return;
  try {
    const faces = await faceDetector.detect(canvas);
    detectedFaces = faces.map(f => ({
      x: f.boundingBox.x + f.boundingBox.width / 2,
      y: f.boundingBox.y + f.boundingBox.height / 2,
      r: Math.max(f.boundingBox.width, f.boundingBox.height) * 0.6
    }));
  } catch (err) {}
}

function drawFaceMask(face) {
  const mode = maskModes[maskModeIdx];
  ctx.save();
  if (mode === 'blur') {
    ctx.beginPath(); ctx.arc(face.x, face.y, face.r, 0, Math.PI * 2); ctx.clip();
    ctx.filter = 'blur(18px)'; ctx.drawImage(canvas, 0, 0);
  } else if (mode === 'emoji') {
    ctx.font = `${Math.round(face.r * 1.8)}px system-ui`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('😎', face.x, face.y);
  } else {
    ctx.fillStyle = 'rgba(20, 20, 30, 0.92)';
    ctx.beginPath(); ctx.arc(face.x, face.y, face.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
let lastTime = 0;
function render(timestamp) {
  const dt = (timestamp - lastTime) / 1000 || 0;
  lastTime = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (transitionAlpha < 1) transitionAlpha = Math.min(1, transitionAlpha + dt * 2.5);

  const item = mediaPlaylist[currentMediaIdx];
  if (item && item.type === 'image' && mediaPlaylist.length > 1 && isPlaying) {
    slideshowTimer += dt;
    const dur = bgAudio.duration ? (bgAudio.duration / mediaPlaylist.length) : 3.5;
    if (slideshowTimer >= dur) { slideshowTimer = 0; loadPlaylistItem(currentMediaIdx + 1); }
  }

  let bass = 0;
  if (analyser && dataArray && isPlaying) {
    analyser.getByteFrequencyData(dataArray);
    bass = (dataArray.at(0) + dataArray.at(1) + dataArray.at(2)) / 3;
  }

  let scale = item && item.type === 'image' ? 1.0 + (slideshowTimer * 0.03) : 1.0;
  let shakeX = 0, shakeY = 0;
  if (vfxState.bassZoom && bass > 135) scale += ((bass - 135) / 120) * 0.09;
  if (vfxState.shake && bass > 150) { shakeX = (Math.random() - 0.5) * 16; shakeY = (Math.random() - 0.5) * 16; }

  ctx.save();
  ctx.globalAlpha = transitionAlpha;
  let activeFilter = filters[filterIdx].css;
  if (vfxState.relight) activeFilter = (activeFilter === 'none' ? '' : activeFilter) + ' brightness(1.18) contrast(1.12)';
  ctx.filter = activeFilter;
  ctx.translate(canvas.width / 2 + shakeX, canvas.height / 2 + shakeY);
  ctx.scale(scale, scale);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  if (item && item.type === 'video' && bgVideo.readyState >= 2) {
    drawCover(bgVideo, bgVideo.videoWidth, bgVideo.videoHeight);
  } else if (item && item.type === 'image' && item.img.complete && item.img.naturalWidth > 0) {
    drawCover(item.img, item.img.naturalWidth, item.img.naturalHeight);
  } else {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();

  frameCount++;
  if (kidsGuardActive && frameCount % 15 === 0) runFaceDetection();
  if (kidsGuardActive) [...detectedFaces, ...manualMasks].forEach(face => drawFaceMask(face));

  if (vfxState.glitch && bass > 165) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255, 0, 80, 0.25)'; ctx.fillRect(12, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.25)'; ctx.fillRect(-12, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  if (vfxState.visualizer && dataArray && isPlaying) {
    const barCount = 24;
    const barWidth = (canvas.width * 0.7) / barCount;
    const startX = canvas.width * 0.15;
    ctx.fillStyle = 'rgba(255, 215, 0, 0.75)';
    for (let i = 0; i < barCount; i++) {
      const barH = ((dataArray.at(i) || 8) / 255) * 85;
      ctx.fillRect(startX + i * barWidth, canvas.height * 0.45 - barH / 2, barWidth - 3, barH);
    }
  }

  if (logoImg && logoImg.complete) {
    ctx.save();
    const logoPulse = 1 + (bass > 130 ? ((bass - 130) / 125) * 0.16 : 0);
    ctx.translate(logoPos.x, logoPos.y);
    ctx.scale(logoPulse, logoPulse);

    if (logoHalo) {
      ctx.beginPath();
      ctx.arc(0, 0, logoSize * 0.54, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4 + (bass > 140 ? 4 : 0);
      ctx.shadowColor = '#FF8C00';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (logoRemoveBlack) ctx.globalCompositeOperation = 'screen';
    const aspect = logoImg.naturalWidth / (logoImg.naturalHeight || 1);
    const drawW = aspect >= 1 ? logoSize : logoSize * aspect;
    const drawH = aspect >= 1 ? logoSize / aspect : logoSize;
    ctx.drawImage(logoImg, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  const topTitle = document.getElementById('topTitleInput').value.trim();
  if (topTitle) {
    ctx.save();
    ctx.translate(titlePos.x, titlePos.y);
    if (isSlanted) ctx.rotate(-0.08);
    ctx.font = `bold 28px ${fonts[fontIdx].family}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (titleHasBg) {
      const w = ctx.measureText(topTitle).width;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(-w / 2 - 14, -22, w + 28, 42);
    } else {
      ctx.strokeStyle = '#000'; ctx.lineWidth = 6;
      ctx.strokeText(topTitle, 0, 0);
    }
    ctx.fillStyle = '#fff';
    ctx.fillText(topTitle, 0, 0);
    ctx.restore();
  }

  const rawLyrics = document.getElementById('lyricsInput').value.trim();
  if (rawLyrics) {
    const lines = rawLyrics.split('\n').filter(l => l.trim() !== '');
    let currentLine = lines.at(0) || '';
    if (bgAudio.duration && lines.length > 1) {
      const idx = Math.min(Math.floor((bgAudio.currentTime / bgAudio.duration) * lines.length), lines.length - 1);
      currentLine = lines.at(idx) || '';
    }

    const st = textStyles[styleIdx];
    const anim = textAnims[animIdx].type;
    let animScale = 1, offsetX = 0, offsetY = 0;

    if (anim === 'wave') { offsetY = Math.sin(timestamp / 250) * 8; animScale = 1 + Math.sin(timestamp / 300) * 0.04; }
    else if (anim === 'pulse') { animScale = 1 + (bass > 140 ? 0.12 : Math.abs(Math.sin(timestamp / 200)) * 0.05); }
    else if (anim === 'slide') { offsetX = Math.sin(timestamp / 400) * 18; }

    ctx.save();
    ctx.translate(lyricPos.x + offsetX, lyricPos.y + offsetY);
    if (isSlanted) ctx.rotate(-0.09);
    ctx.scale(animScale, animScale);

    const italicPrefix = isSlanted ? 'italic ' : '';
    ctx.font = `${italicPrefix}bold ${fontSize}px ${fonts[fontIdx].family}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.strokeStyle = st.stroke; ctx.lineWidth = 9; ctx.lineJoin = 'round';
    ctx.fillStyle = st.fill;

    drawWrappedText(currentLine, 0, 0, canvas.width - 70, fontSize * 1.3);
    ctx.restore();
  }

  requestAnimationFrame(render);
}

function drawCover(media, mw, mh) {
  const cr = canvas.width / canvas.height, mr = mw / mh;
  let dw, dh, ox, oy;
  if (mr > cr) { dh = canvas.height; dw = mw * (canvas.height / mh); ox = (canvas.width - dw) / 2; oy = 0; }
  else { dw = canvas.width; dh = mh * (canvas.width / mw); ox = 0; oy = (canvas.height - dh) / 2; }
  ctx.drawImage(media, ox, oy, dw, dh);
}

let lastExportedBlob = null;

document.getElementById('exportBtn').addEventListener('click', () => {
  if (!bgAudio.src && !mediaPlaylist.length) {
    alert('Please import videos/photos or audio first!');
    return;
  }

  const stream = canvas.captureStream(30);
  let tracks = [...stream.getVideoTracks()];

  if (bgAudio.src) {
    initAudio();
    const dest = audioCtx.createMediaStreamDestination();
    audioSource.connect(dest);
    tracks = [...tracks, ...dest.stream.getAudioTracks()];
  }

  const combined = new MediaStream(tracks);
  const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
    ? { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 5000000 }
    : { mimeType: 'video/webm' };

  const recorder = new MediaRecorder(combined, options);
  const chunks = [];

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.onstop = () => {
    lastExportedBlob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(lastExportedBlob);

    document.getElementById('recordingBadge').classList.add('hidden');
    document.getElementById('exportedPreview').src = url;
    const dlLink = document.getElementById('directDownloadLink');
    dlLink.href = url;
    dlLink.download = 'W-Cut-Pro.webm';
    dlLink.click();

    document.getElementById('saveModal').classList.remove('hidden');
  };

  currentMediaIdx = 0; slideshowTimer = 0;
  if (mediaPlaylist.length) loadPlaylistItem(0);

  if (bgAudio.src) {
    bgAudio.currentTime = 0;
    bgAudio.play();
  }
  isPlaying = true;
  recorder.start();
  document.getElementById('recordingBadge').classList.remove('hidden');

  if (bgAudio.src) {
    bgAudio.onended = () => { if (recorder.state === 'recording') recorder.stop(); };
  } else {
    setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 10000);
  }
});

document.getElementById('nativeShareBtn').addEventListener('click', async () => {
  if (!lastExportedBlob) return;
  const file = new File([lastExportedBlob], 'W-Cut-Pro.webm', { type: 'video/webm' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'W-Cut Pro Video' });
    } catch (e) {}
  } else {
    document.getElementById('directDownloadLink').click();
  }
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('saveModal').classList.add('hidden');
});

requestAnimationFrame(render);


