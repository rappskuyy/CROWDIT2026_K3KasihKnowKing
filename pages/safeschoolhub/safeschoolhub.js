/* ============== ROUTER ============== */
const ROUTES = ['overview', 'safety', 'gadget-time', 'hydration', 'sleep', 'breathing', 'reports', 'settings'];

function navigate(route) {
  if (route === 'dashboard') route = 'overview';
  if (!ROUTES.includes(route)) route = 'overview';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + route);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(n => n.classList.toggle('active', n.dataset.route === route));
  document.querySelectorAll('.bn-item').forEach(n => n.classList.toggle('active', n.dataset.route === route));
  if (location.hash !== '#' + route) location.hash = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // page-specific
  if (route === 'overview') {
    drawMoodChart();
    drawDonut();
    setTimeout(() => {
      const sb = document.getElementById('stressBar');
      if (sb) sb.style.width = '30%';
    }, 50);
  }
  if (route === 'hydration') { drawHydWeek(); }
  if (route === 'sleep') { drawSleepArch(); }
  if (route === 'breathing') { drawWeeklyMood(); }
  if (route === 'reports') { renderReports(); }
}

window.addEventListener('hashchange', () => navigate(location.hash.replace('#', '') || 'overview'));
document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.route)));

/* ============== TOAST ============== */
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast-item ' + type;
  t.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">' +
    (type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info') +
    '</span>' + msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ============== MODALS ============== */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
});
document.querySelectorAll('.modal-backdrop').forEach(m => m.addEventListener('click', e => {
  if (e.target === m) m.classList.remove('open');
}));

function openCheckin() { openModal('checkinModal'); }
let checkinMood = null;
document.querySelectorAll('#checkinMoods button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#checkinMoods button').forEach(x => x.classList.remove('selected'));
  b.classList.add('selected');
  checkinMood = b.dataset.cmood;
}));
function submitCheckin() {
  closeModal('checkinModal');
  showToast('Check-in submitted' + (checkinMood ? ': ' + checkinMood : ''), 'success');
  const cn = document.getElementById('checkinNote');
  if (cn) cn.value = '';
}

function confirmLogout() {
  const confirmModal = document.getElementById('confirmModal');
  if (confirmModal) {
    document.getElementById('confirmTitle').textContent = 'Keluar?';
    document.getElementById('confirmMsg').textContent = 'Apakah Anda yakin ingin keluar dari SafeSchool?';
    document.getElementById('confirmOk').onclick = () => {
      closeModal('confirmModal');
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('user');
      window.location.replace('../../safeschool-landing.html');
    };
    openModal('confirmModal');
  } else {
    if (confirm('Apakah Anda yakin ingin keluar dari SafeSchool?')) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('user');
      window.location.replace('../../safeschool-landing.html');
    }
  }
}
const logoutBtn = document.getElementById('sidebar-logout');
if (logoutBtn) logoutBtn.addEventListener('click', confirmLogout);

/* ============== MOOD CHART ============== */
const moodData = { 0: [1, 2, 1, 2, 1, 2, 1], 1: [2, 3, 2, 3, 2, 3, 2], 2: [3, 4, 3, 5, 4, 4, 3], 3: [4, 5, 4, 5, 4, 5, 4], 4: [5, 5, 5, 5, 5, 5, 5] };
let currentMood = 2;
function drawMoodChart() {
  const chartEl = document.getElementById('moodChart');
  if (!chartEl) return;
  const data = moodData[currentMood], w = 420, h = 180, pad = 24;
  const xs = data.map((_, i) => pad + i * (w - 2 * pad) / 6);
  const ys = data.map(v => h - pad - (v - 1) * (h - 2 * pad) / 4);
  let d = 'M' + xs[0] + ',' + ys[0];
  for (let i = 1; i < xs.length; i++) { const cx = (xs[i - 1] + xs[i]) / 2; d += ' Q' + cx + ',' + ys[i - 1] + ' ' + cx + ',' + (ys[i - 1] + ys[i]) / 2 + ' T' + xs[i] + ',' + ys[i]; }
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let svg = `<svg viewBox="0 0 ${w} ${h}" class="w-full h-44">`;
  for (let i = 1; i <= 4; i++) { const y = pad + i * (h - 2 * pad) / 5; svg += `<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="#e5eeff" stroke-width="1"/>`; }
  svg += `<path d="${d}" fill="none" stroke="#106399" stroke-width="3" stroke-linecap="round" stroke-dasharray="800" stroke-dashoffset="800"><animate attributeName="stroke-dashoffset" to="0" dur="0.8s" fill="freeze"/></path>`;
  xs.forEach((x, i) => { svg += `<circle cx="${x}" cy="${ys[i]}" r="4" fill="#106399"><title>${days[i]}: ${data[i]}</title></circle>`; });
  xs.forEach((x, i) => { svg += `<text x="${x}" y="${h-4}" text-anchor="middle" font-size="10" fill="#41474f">${days[i]}</text>`; });
  svg += `</svg>`;
  chartEl.innerHTML = svg;
}
document.querySelectorAll('#moodSelectors button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#moodSelectors button').forEach(x => x.classList.remove('selected'));
  b.classList.add('selected'); currentMood = +b.dataset.mood; drawMoodChart(); showToast('Mood updated', 'success');
}));

/* ============== DONUT ============== */
function drawDonut() {
  const dWrap = document.getElementById('donutWrap');
  if (!dWrap) return;
  const r = 60, c = 2 * Math.PI * r, pct = 85 / 199;
  dWrap.innerHTML = `<svg viewBox="0 0 160 160" class="w-44 h-44">
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#dce9ff" stroke-width="16"/>
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#106399" stroke-width="16" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 80 80)"><animate attributeName="stroke-dashoffset" to="${c * (1 - pct)}" dur="1s" fill="freeze"/></circle>
    <text x="80" y="78" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1c30">85</text>
    <text x="80" y="98" text-anchor="middle" font-size="11" fill="#41474f">/ 199</text>
  </svg>`;
}

/* ============== SLEEP TABS (dashboard card) ============== */
document.querySelectorAll('#sleepTabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#sleepTabs button').forEach(x => x.classList.remove('active')); b.classList.add('active');
  const m = { awake: [40, 30, 30], rem: [20, 50, 30], deep: [15, 25, 60] }[b.dataset.st];
  document.getElementById('sleepSegA').style.width = m[0] + '%';
  document.getElementById('sleepSegR').style.width = m[1] + '%';
  document.getElementById('sleepSegD').style.width = m[2] + '%';
}));

/* ============== HYDRATION ============== */
let cups = 6;
function renderHyd() {
  const cupC = document.getElementById('cupCount');
  if (!cupC) return;
  cupC.textContent = cups;
  document.getElementById('hydDashCount').textContent = cups;
  const pct = cups / 8 * 100;
  document.getElementById('cupBar').style.width = pct + '%';
  document.getElementById('bottleFill').setAttribute('y', 12 + (116 * (1 - pct / 100)));
  document.getElementById('bottleFill').setAttribute('height', 116 * pct / 100);
  document.getElementById('bottlePct').textContent = Math.round(pct) + '%';
  // hyd dash segments
  const seg = document.getElementById('hydSegments');
  if (seg) { seg.innerHTML = ''; for (let i = 0; i < 8; i++) { const d = document.createElement('div'); d.className = 'flex-1 h-3 rounded-full ' + (i < cups ? 'bg-primary' : 'bg-surface-container'); seg.appendChild(d); } }
  document.getElementById('hydMsg').textContent = cups >= 8 ? 'Goal reached! Stay hydrated.' : cups >= 6 ? `You're doing great! Just ${8 - cups} more cups to reach your optimal energy levels.` : 'Keep drinking — you can do it!';
}
function changeCup(d) {
  cups = Math.max(0, Math.min(8, cups + d)); renderHyd();
  const bf = document.getElementById('bottleFill'); if (bf) { bf.style.transition = 'all .5s ease'; }
  showToast(d > 0 ? 'Cup added' : 'Cup removed', 'success');
}
const FACTS = ['Just a 2% drop in hydration can cause significant fatigue and reduced alertness.', 'Your brain is ~75% water — staying hydrated improves memory.', 'Drinking water before meals can improve digestion and energy.'];
let factIdx = 0;
function cycleFact() { factIdx = (factIdx + 1) % FACTS.length; document.getElementById('factText').textContent = FACTS[factIdx]; }
function toggleAccordion(id) { document.getElementById(id).classList.toggle('hidden'); }
function drawHydWeek() {
  const chart = document.getElementById('hydWeekChart');
  if (!chart) return;
  const data = [3, 5, 4, 6, 8, 5, 4], days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let svg = '';
  data.forEach((v, i) => { const x = 20 + i * 42, h = v * 12, y = 120 - h; const color = i === 4 ? '#106399' : '#dce9ff'; svg += `<rect x="${x}" y="${y}" width="28" height="${h}" rx="6" fill="${color}"><title>${days[i]}: ${v}</title></rect><text x="${x + 14}" y="135" text-anchor="middle" font-size="10" fill="#41474f">${days[i]}</text>`; });
  chart.innerHTML = svg;
}
document.querySelectorAll('#hydWeekTabs button').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('#hydWeekTabs button').forEach(x => x.classList.remove('active')); b.classList.add('active'); drawHydWeek(); }));
function downloadReport() { const blob = new Blob(['Hydration Report\nCups today: ' + cups], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hydration_report.txt'; a.click(); showToast('Report downloaded', 'success'); }

/* ============== GADGET TIME ============== */
let stretchSec = 15 * 60;
function tickStretch() {
  stretchSec = stretchSec <= 0 ? 15 * 60 : stretchSec - 1;
  const h = String(Math.floor(stretchSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((stretchSec % 3600)/60)).padStart(2, '0');
  const s = String(stretchSec % 60).padStart(2, '0');
  const el = document.getElementById('stretchCountdown'); if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(tickStretch, 1000);
let stretchCount = 4;
function incStretch() { if (stretchCount < 6) { stretchCount++; document.getElementById('stretchCount').textContent = stretchCount; showToast('Stretch logged', 'success'); } }
function startStretchSession() {
  openModal('stretchModal');
  let s = 5 * 60;
  document.getElementById('stretchSessionTime').textContent = '05:00';
  clearInterval(window._stretchSession);
  window._stretchSession = setInterval(() => {
    s--; if (s <= 0) { clearInterval(window._stretchSession); closeModal('stretchModal'); showToast('Stretch session complete!', 'success'); return; }
    const m = String(Math.floor(s / 60)).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
    document.getElementById('stretchSessionTime').textContent = `${m}:${ss}`;
  }, 1000);
}

/* ============== SLEEP ============== */
function drawSleepArch() {
  const chart = document.getElementById('sleepArchChart');
  if (!chart) return;
  const groups = 5, colors = ['#003151', '#106399', '#c4b5fd', '#fb7185'];
  const stages = [[40, 30, 15, 5], [35, 35, 20, 5], [30, 40, 25, 5], [25, 35, 30, 5], [10, 20, 15, 5]];
  const labels = ['12AM', '2AM', '4AM', '6AM', '8AM'];
  let svg = '';
  stages.forEach((s, i) => {
    const gx = 20 + i * 60; let y = 20;
    s.forEach((v, k) => { svg += `<rect x="${gx}" y="${y}" width="40" height="${v * 1.5}" fill="${colors[k]}"><title>${['Deep', 'Light', 'REM', 'Awake'][k]}: ${v}m</title></rect>`; y += v * 1.5; });
    svg += `<text x="${gx + 20}" y="175" text-anchor="middle" font-size="10" fill="#41474f">${labels[i]}</text>`;
  });
  if (document.getElementById('trendToggle')?.classList.contains('on')) {
    let pts = stages.map((s, i) => (20 + i * 60 + 20) + ',' + (20 + s.reduce((a, b) => a + b, 0) * 1.5 * .6));
    svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="#106399" stroke-width="2" stroke-dasharray="4 3"/>`;
  }
  chart.innerHTML = svg;
}
function toggleTrendLine() { drawSleepArch(); }
document.querySelectorAll('#sleepRangeTabs button').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('#sleepRangeTabs button').forEach(x => x.classList.remove('active')); b.classList.add('active'); drawSleepArch(); showToast('Range: ' + b.textContent, 'info'); }));
document.querySelectorAll('#morningMoods button').forEach(b => b.addEventListener('click', () => { document.querySelectorAll('#morningMoods button').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); document.getElementById('morningMoodMsg').textContent = 'Mood logged: ' + b.dataset.mm; moodHistory.push(b.dataset.mm); }));
function openScheduleModal() { openModal('scheduleModal'); }
let medPlaying = false, medT = 0, medInt = null;
function startMeditationPlayer() { document.getElementById('medPlayer').classList.remove('hidden'); if (medInt) clearInterval(medInt); medPlaying = true; medT = 0; document.getElementById('medPlayIcon').textContent = 'pause'; medInt = setInterval(medTick, 1000); }
function toggleMedPlay() { medPlaying = !medPlaying; document.getElementById('medPlayIcon').textContent = medPlaying ? 'pause' : 'play_arrow'; }
function medTick() { if (!medPlaying) return; medT++; if (medT >= 600) { clearInterval(medInt); medPlaying = false; document.getElementById('medPlayIcon').textContent = 'play_arrow'; showToast('Meditation complete', 'success'); return; } document.getElementById('medProg').style.width = (medT / 600 * 100) + '%'; document.getElementById('medTime').textContent = Math.floor(medT / 60) + ':' + String(medT % 60).padStart(2, '0'); }

/* ============== BREATHING ============== */
let breathTimings = { Inhale: 4, Hold1: 2, Exhale: 4, Hold2: 2 };
let breathRunning = false, breathPhaseIdx = 0, breathTimer = null, sessionN = 1, streak = 5, roundCount = 0;
const PHASES = [{ n: 'INHALE', k: 'Inhale', inst: s => `Inhale for ${s} seconds`, size: 220, bg: 'radial-gradient(circle,#a5d8ff,#5a9bd5)' }, { n: 'HOLD', k: 'Hold1', inst: s => `Hold for ${s} seconds`, size: 220, bg: 'radial-gradient(circle,#a5d8ff,#5a9bd5)' }, { n: 'EXHALE', k: 'Exhale', inst: s => `Exhale for ${s} seconds`, size: 160, bg: 'radial-gradient(circle,#5a9bd5,#106399)' }, { n: 'HOLD', k: 'Hold2', inst: s => `Hold for ${s} seconds`, size: 160, bg: 'radial-gradient(circle,#5a9bd5,#106399)' }];
function runBreathPhase() {
  if (!breathRunning) return;
  const p = PHASES[breathPhaseIdx], dur = breathTimings[p.k];
  document.getElementById('breathPhase').textContent = p.n;
  document.getElementById('breathInstruction').textContent = p.inst(dur);
  const c = document.getElementById('breathCircle');
  c.style.transition = `all ${dur}s ease-in-out`;
  c.style.width = p.size + 'px'; c.style.height = p.size + 'px'; c.style.background = p.bg;
  breathTimer = setTimeout(() => {
    breathPhaseIdx = (breathPhaseIdx + 1) % 4;
    if (breathPhaseIdx === 0) { roundCount++; showToast('Round complete! <i class="fa-solid fa-award"></i>', 'success'); if (roundCount >= 1) { sessionN = Math.min(5, sessionN + 1); document.getElementById('sessionNum').textContent = sessionN; streak++; document.getElementById('streakCount').textContent = streak; } }
    runBreathPhase();
  }, dur * 1000);
}
function toggleBreath() {
  breathRunning = !breathRunning;
  document.getElementById('breathBtn').textContent = breathRunning ? 'Pause Session' : 'Resume Session';
  if (breathRunning) runBreathPhase(); else clearTimeout(breathTimer);
}
function openBreathCustomize() {
  const c = document.getElementById('phaseControls'); c.innerHTML = '';
  ['Inhale', 'Hold1', 'Exhale', 'Hold2'].forEach(k => {
    const row = document.createElement('div'); row.className = 'flex items-center justify-between gap-2';
    row.innerHTML = `<span class="font-semibold text-sm">${k.replace(/\d/, '')}</span><div class="flex items-center gap-2"><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',-1)">−</button><span id="ph-${k}" class="font-bold w-8 text-center">${breathTimings[k]}s</span><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',1)">+</button></div>`;
    c.appendChild(row);
  });
  openModal('breathCustomize');
}
function changePhase(k, d) { breathTimings[k] = Math.max(1, Math.min(10, breathTimings[k] + d)); document.getElementById('ph-' + k).textContent = breathTimings[k] + 's'; }
function startRoutine(min) { navigate('breathing'); if (!breathRunning) { toggleBreath(); } showToast('Routine started — ' + min + ' min', 'info'); }
function drawWeeklyMood() {
  const chart = document.getElementById('weeklyMoodChart');
  if (!chart) return;
  const data = [3, 4, 3, 5, 4, 6, 7], days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; let svg = '';
  data.forEach((v, i) => { const x = 20 + i * 40, h = v * 12, y = 110 - h; const c = i === 6 ? '#fff' : '#5a9bd5'; svg += `<rect x="${x}" y="${y}" width="24" height="${h}" rx="6" fill="${c}"/><text x="${x + 12}" y="125" text-anchor="middle" font-size="10" fill="#fff">${days[i]}</text>`; });
  chart.innerHTML = svg;
}

/* ============== REPORTS ============== */
const REPORTS_ALL = [];
const TYPES = ['Bullying', 'Cyberbullying', 'Physical Threat', 'Other']; const LOCS = ['East Corridor', 'Cafeteria', 'Gym', 'Library', 'Lab 2', 'Schoolyard', 'Bus Stop']; const STATUS = ['Open', 'Resolved', 'Pending'];
for (let i = 1; i <= 24; i++) REPORTS_ALL.push({ id: 'R-' + String(1000 + i), date: `2024-06-${String((i % 28) + 1).padStart(2, '0')}`, type: TYPES[i % 4], loc: LOCS[i % LOCS.length], status: STATUS[i % 3] });
let reportPage = 1;
function renderReports() {
  const tableBody = document.getElementById('reportsBody');
  if (!tableBody) return;
  const filter = document.getElementById('reportFilter').value;
  let data = REPORTS_ALL.filter(r => filter === 'all' || r.status === filter);
  const per = 8, total = Math.max(1, Math.ceil(data.length / per)); reportPage = Math.min(reportPage, total);
  document.getElementById('reportPager').textContent = reportPage + ' / ' + total;
  data = data.slice((reportPage - 1) * per, reportPage * per);
  const pill = s => s === 'Open' ? 'stat-pill-yellow' : s === 'Resolved' ? 'stat-pill-green' : 'bg-surface-container-high text-primary';
  tableBody.innerHTML = data.map(r => `
    <tr class="border-t border-outline-variant hover:bg-surface-container-low cursor-pointer">
      <td class="p-3 font-bold" onclick="openReport('${r.id}')">${r.id}</td>
      <td class="p-3">${r.date}</td><td class="p-3">${r.type}</td><td class="p-3">${r.loc}</td>
      <td class="p-3"><span class="pill px-2 py-1 text-xs font-bold ${pill(r.status)}">${r.status}</span></td>
      <td class="p-3"><button class="btn-ghost text-xs" onclick="resolveReport('${r.id}')">Resolve</button></td>
    </tr>`).join('');
}
function openReport(id) { const r = REPORTS_ALL.find(x => x.id === id); document.getElementById('reportDetailBody').innerHTML = `<div class="space-y-2"><div><b>ID:</b> ${r.id}</div><div><b>Date:</b> ${r.date}</div><div><b>Type:</b> ${r.type}</div><div><b>Location:</b> ${r.loc}</div><div><b>Status:</b> ${r.status}</div><p class="text-on-surface-variant">Detailed narrative would appear here.</p></div>`; openModal('reportDetail'); }
function resolveReport(id) { const r = REPORTS_ALL.find(x => x.id === id); if (r) { r.status = 'Resolved'; renderReports(); showToast('Report resolved', 'success'); } }
function exportCSV() { const rows = [['ID', 'Date', 'Type', 'Location', 'Status'], ...REPORTS_ALL.map(r => [r.id, r.date, r.type, r.loc, r.status])]; const csv = rows.map(r => r.join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reports.csv'; a.click(); showToast('CSV exported', 'success'); }

/* ============== SETTINGS ============== */
const notifSettings = { 'Push Notifications': true, 'Email Reminders': true, 'Hydration Reminders': true, 'Sleep Alerts': false, 'Stress Check-ins': true };
function renderNotifs() {
  const c = document.getElementById('notifList'); if (!c) return; c.innerHTML = '';
  Object.entries(notifSettings).forEach(([k, v]) => {
    const row = document.createElement('div'); row.className = 'flex items-center justify-between';
    row.innerHTML = `<span class="text-sm">${k}</span><div class="toggle ${v ? 'on' : ''}"></div>`;
    row.querySelector('.toggle').addEventListener('click', e => { notifSettings[k] = !notifSettings[k]; e.target.classList.toggle('on'); showToast(k + ': ' + (notifSettings[k] ? 'ON' : 'OFF'), 'info'); });
    c.appendChild(row);
  });
}
let feelHistory = [];
function downloadData() { const blob = new Blob([JSON.stringify({ profile: { name: 'Alex Johnson', grade: '11-A' }, cups, moodHistory, feelHistory, notifSettings }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my_data.json'; a.click(); showToast('Data downloaded', 'success'); }
function clearMoodHistory() { document.getElementById('confirmTitle').textContent = 'Clear mood history?'; document.getElementById('confirmMsg').textContent = 'This cannot be undone.'; document.getElementById('confirmOk').onclick = () => { moodHistory = []; feelHistory = []; closeModal('confirmModal'); showToast('Mood history cleared', 'success'); }; openModal('confirmModal'); }

function setLang(l) {
  if (window.LangSystem) {
    LangSystem.setLang(l);
  }
  showToast(l === 'id' ? 'Bahasa: Indonesia' : 'Language: English', 'info');
}

/* ============== INIT ============== */
window.addEventListener('load', () => {
  renderHyd(); renderNotifs();
  navigate(location.hash.replace('#', '') || 'overview');
});

/* ============== XP & AVATAR SYSTEM ============== */
function loadXPMain() { try { return parseInt(localStorage.getItem('edu_xp') || '320', 10); } catch (e) { return 320; } }
function saveXPMain(v) { try { localStorage.setItem('edu_xp', String(v)); } catch (e) { } }
let mainXP = loadXPMain();
function updateSidebarXP() {
  const el = document.getElementById('sidebarXP');
  if (el) el.textContent = mainXP + ' XP';
  const shopEl = document.getElementById('avatarShopXP');
  if (shopEl) shopEl.textContent = mainXP + ' XP';
}

const BASE_AVATARS = ['fa-solid fa-user', 'fa-solid fa-user-ninja', 'fa-solid fa-user-astronaut', 'fa-solid fa-child', 'fa-solid fa-user-tie', 'fa-solid fa-user-nurse', 'fa-solid fa-user-secret', 'fa-solid fa-user-doctor', 'fa-solid fa-hands-raised', 'fa-solid fa-face-smile'];
const ACCESSORIES = [
  { id: 'hat_grad', emoji: '<i class="fa-solid fa-graduation-cap"></i>', name: 'Topi Wisuda', slot: 'hat', cost: 100, desc: 'Tampil seperti lulusan terbaik!' },
  { id: 'hat_top', emoji: 'fa-solid fa-hat-cowboy', name: 'Top Hat', slot: 'hat', cost: 150, desc: 'Gaya klasik yang elegan.' },
  { id: 'hat_crown', emoji: '<i class="fa-solid fa-crown"></i>', name: 'Mahkota', slot: 'hat', cost: 300, desc: 'Jadilah raja/ratu sekolah!' },
  { id: 'hat_party', emoji: '<i class="fa-solid fa-gifts"></i>', name: 'Topi Pesta', slot: 'hat', cost: 80, desc: 'Rayakan setiap pencapaian!' },
  { id: 'glasses_cool', emoji: '<i class="fa-solid fa-glasses"></i>', name: 'Kacamata Keren', slot: 'glasses', cost: 120, desc: 'Penampilan super keren.' },
  { id: 'glasses_nerd', emoji: '<i class="fa-solid fa-glasses"></i>', name: 'Kacamata Pelajar', slot: 'glasses', cost: 60, desc: 'Tampil cerdas dan serius!' },
  { id: 'badge_star', emoji: '<i class="fa-solid fa-star"></i>', name: 'Badge Bintang', slot: 'badge', cost: 200, desc: 'Penghargaan pencapaian top.' },
  { id: 'badge_fire', emoji: '<i class="fa-solid fa-fire"></i>', name: 'Badge On Fire', slot: 'badge', cost: 180, desc: 'Kamu sedang on fire!' },
];

function loadAvatarState() {
  try { return JSON.parse(localStorage.getItem('avatar_state') || 'null'); } catch (e) { return null; }
}
function saveAvatarState(s) { try { localStorage.setItem('avatar_state', JSON.stringify(s)); } catch (e) { } }
function loadOwnedAccessories() { try { return JSON.parse(localStorage.getItem('owned_acc') || '[]'); } catch (e) { return []; } }
function saveOwnedAccessories(a) { try { localStorage.setItem('owned_acc', JSON.stringify(a)); } catch (e) { } }

let avatarState = loadAvatarState() || { base: 'fa-solid fa-user', hat: null, glasses: null, badge: null };
let ownedAccessories = loadOwnedAccessories();

function applySidebarAvatar() {
  const emojiEl = document.getElementById('sidebarAvatarEmoji');
  const hatEl = document.getElementById('sidebarHatBadge');
  if (emojiEl) emojiEl.textContent = avatarState.base;
  if (hatEl) {
    if (avatarState.hat) {
      const acc = ACCESSORIES.find(a => a.id === avatarState.hat);
      hatEl.textContent = acc ? acc.emoji : '';
      hatEl.classList.toggle('hidden', !avatarState.hat);
    } else {
      hatEl.classList.add('hidden');
    }
  }
}

function applyPreviewAvatar() {
  const circle = document.getElementById('avatarPreviewCircle');
  const hatPrev = document.getElementById('avatarHatPreview');
  const glassesPrev = document.getElementById('avatarGlassesPreview');
  if (!circle) return;
  circle.textContent = avatarState.base;
  if (hatPrev) {
    const acc = avatarState.hat ? ACCESSORIES.find(a => a.id === avatarState.hat) : null;
    hatPrev.textContent = acc ? acc.emoji : '';
    hatPrev.classList.toggle('hidden', !avatarState.hat);
  }
  if (glassesPrev) {
    const acc = avatarState.glasses ? ACCESSORIES.find(a => a.id === avatarState.glasses) : null;
    glassesPrev.textContent = acc ? acc.emoji : '';
    glassesPrev.classList.toggle('hidden', !avatarState.glasses);
  }
}

function openAvatarShop() {
  mainXP = loadXPMain();
  updateSidebarXP();
  const grid = document.getElementById('baseAvatarGrid');
  if (grid) {
    grid.innerHTML = BASE_AVATARS.map(e => `
      <button onclick="selectBase('${e}')" class="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${avatarState.base === e ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}" style="font-size:22px">${e}</button>
    `).join('');
  }
  const shopGrid = document.getElementById('accessoryShopGrid');
  if (shopGrid) {
    shopGrid.innerHTML = ACCESSORIES.map(acc => {
      const owned = ownedAccessories.includes(acc.id);
      const equipped = avatarState[acc.slot] === acc.id;
      const canAfford = mainXP >= acc.cost;
      return `<div class="rounded-xl p-3 flex items-center gap-3 border ${equipped ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-surface-container-lowest'}">
        <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">${acc.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm">${acc.name}</div>
          <div class="text-xs text-on-surface-variant">${acc.desc}</div>
          ${owned ? `<div class="text-xs text-primary font-semibold mt-0.5"><i class="fa-solid fa-circle-check"></i> Sudah dimiliki</div>` : `<div class="text-xs font-bold mt-0.5" style="color:${canAfford ? '#f59e0b' : '#ba1a1a'}"><i class="fa-solid fa-coins"></i> ${acc.cost} XP</div>`}
        </div>
        <div>
          ${owned
            ? `<button onclick="toggleEquip('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${equipped ? 'bg-primary text-white' : 'border border-primary text-primary'}">${equipped ? 'Dipakai' : 'Pakai'}</button>`
            : `<button onclick="buyAccessory('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${canAfford ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}" ${!canAfford ? 'disabled' : ''}>Beli</button>`
          }
        </div>
      </div>`;
    }).join('');
  }
  applyPreviewAvatar();
  openModal('avatarShopModal');
}

function selectBase(emoji) {
  avatarState.base = emoji;
  saveAvatarState(avatarState);
  applySidebarAvatar();
  applyPreviewAvatar();
  document.querySelectorAll('#baseAvatarGrid button').forEach((btn, i) => {
    const e = BASE_AVATARS[i];
    btn.className = `w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${e === emoji ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}`;
  });
}

function buyAccessory(id) {
  const acc = ACCESSORIES.find(a => a.id === id);
  if (!acc) return;
  mainXP = loadXPMain();
  if (mainXP < acc.cost) { showToast('XP tidak cukup! Tonton video/artikel untuk mendapatkan lebih banyak XP.', 'error'); return; }
  mainXP -= acc.cost;
  saveXPMain(mainXP);
  ownedAccessories.push(id);
  saveOwnedAccessories(ownedAccessories);
  avatarState[acc.slot] = id;
  saveAvatarState(avatarState);
  updateSidebarXP();
  applySidebarAvatar();
  showToast('<i class="fa-solid fa-award"></i> ' + acc.name + ' berhasil dibeli & dipakai!', 'success');
  openAvatarShop();
}

function toggleEquip(id) {
  const acc = ACCESSORIES.find(a => a.id === id);
  if (!acc) return;
  if (avatarState[acc.slot] === id) {
    avatarState[acc.slot] = null;
    showToast(acc.name + ' dilepas.', 'info');
  } else {
    avatarState[acc.slot] = id;
    showToast(acc.emoji + ' ' + acc.name + ' dipakai!', 'success');
  }
  saveAvatarState(avatarState);
  applySidebarAvatar();
  applyPreviewAvatar();
  openAvatarShop();
}

applySidebarAvatar();
updateSidebarXP();

function updateDashAvatar() {
  const xp = loadXPMain();
  const dash = document.getElementById('dashAvatarCircle');
  if (dash) dash.textContent = avatarState.base;
  const dashXP = document.getElementById('dashXPDisplay');
  if (dashXP) dashXP.textContent = xp + ' XP';
  const bar = document.getElementById('dashXPBar');
  if (bar) bar.style.width = Math.min(100, (xp / 1000) * 100) + '%';
}
updateDashAvatar();
document.addEventListener('visibilitychange', () => { if (!document.hidden) { mainXP = loadXPMain(); updateSidebarXP(); updateDashAvatar(); } });
