/* ============== ROUTER ============== */
const ROUTE_FILES={
  "overview": "dashboard.html", 
  "safety": "pages/safety/safety.html", 
  "gadget-time": "pages/gadget-time/gadget-time.html", 
  "hydration": "pages/hydration/hydration.html", 
  "sleep": "pages/sleep/sleep.html", 
  "breathing": "pages/breathing/breathing.html", 
  "reports": "pages/reports/reports.html", 
  "counseling": "pages/counseling/counseling.html", 
  "settings": "pages/settings/settings.html",
  "educational": "pages/educational/educational.html"
};
const CURRENT_ROUTE='overview';

function navigate(r){
  if(r==='dashboard') r='overview';
  if(ROUTE_FILES[r] && r!==CURRENT_ROUTE){
    location.href=ROUTE_FILES[r];
    return;
  }
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.toggle('active',n.dataset.route===r));
  window.scrollTo({top:0,behavior:'smooth'});
  initPage();
}

function initPage(){
  const r=CURRENT_ROUTE;
  if(r==='overview'){
    // Restore mood dari localStorage
    const savedMood = loadMoodToday();
    if(savedMood !== null){
      currentMood = savedMood;
      document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
      const btn = document.querySelector(`#moodSelectors button[data-mood="${savedMood}"]`);
      if(btn) btn.classList.add('selected');
    }
    drawMoodChart();
    drawDonut();
    renderHyd();
    renderGadgetDash();
    renderSleepDash();
    setTimeout(()=>{ updateStressFromMood(currentMood); }, 50);
  }
  if(r==='sleep'){drawSleepArch();}
  if(r==='breathing'){drawWeeklyMood();}
  if(r==='reports'){renderReports();}
}
document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.route)));

/* ============== TOAST ============== */
/* ============== TOAST ============== */
function showToast(msg, type='info') {
  const c = document.getElementById('toast');
  if(!c) return;
  
  // Clean up HTML tags from message if any (like <i>)
  const cleanMsg = msg.replace(/<[^>]*>/g, '');

  const t = document.createElement('div');
  t.className = 'toast-item ' + type;
  
  let title = 'Information';
  let icon = 'info';
  if (type === 'success') {
    title = 'Success';
    icon = 'check_circle';
  } else if (type === 'error') {
    title = 'Error';
    icon = 'error';
  } else if (type === 'warning') {
    title = 'Warning';
    icon = 'warning';
  }
  
  t.innerHTML = `
    <div class="toast-icon-container">
      <span class="material-symbols-outlined">${icon}</span>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${cleanMsg}</div>
    </div>
    <button class="toast-close-btn" onclick="this.parentElement.classList.add('out'); setTimeout(()=>this.parentElement.remove(), 300)">
      <span class="material-symbols-outlined" style="font-size:16px;">close</span>
    </button>
  `;
  c.appendChild(t);
  setTimeout(() => {
    if (t.parentNode) {
      t.classList.add('out');
      setTimeout(() => t.remove(), 300);
    }
  }, 4000);
}

/* ============== MODALS ============== */
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));});
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));

function openCheckin(){openModal('checkinModal');}
let checkinMood=null;

function confirmLogout(){
  document.getElementById('confirmTitle').textContent='Log out?';
  document.getElementById('confirmMsg').textContent='You will be returned to the dashboard.';
  document.getElementById('confirmOk').onclick=()=>{closeModal('confirmModal');navigate('overview');showToast('Logged out','info');};
  openModal('confirmModal');
}
document.getElementById('sidebar-logout').addEventListener('click',confirmLogout);

/* ============== MOOD TRACKER (dengan localStorage) ============== */
const MOOD_LABELS = ['Stressed','Low','Neutral','Good','Great'];
const MOOD_ICONS  = ['<i class="fa-solid fa-face-angry"></i>','<i class="fa-solid fa-face-frown"></i>','<i class="fa-solid fa-face-meh"></i>','<i class="fa-solid fa-face-smile"></i>','<i class="fa-solid fa-face-laugh-beam"></i>'];
const MOOD_UNICODES = ['\uf556', '\uf119', '\uf11a', '\uf118', '\uf59a'];
const STRESS_LEVELS = [90, 65, 30, 15, 5]; // % stress bar per mood
const STRESS_TEXTS  = ['High Stress','Moderate','Low Stress','Calm','Excellent'];
const STRESS_COLORS = ['bg-error','bg-error','bg-secondary','bg-secondary','bg-secondary'];

function getMoodStorageKey(){
  const d=new Date();
  return `mood_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}
function getDayMoodKey(daysAgo){
  const d=new Date(); d.setDate(d.getDate()-daysAgo);
  return `mood_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}
function saveMoodToday(moodIdx){
  localStorage.setItem('mood_today', JSON.stringify({ date: getMoodStorageKey(), mood: moodIdx }));
  // juga simpan ke histori mingguan
  const history = getMoodHistory();
  history[getMoodStorageKey()] = moodIdx;
  localStorage.setItem('mood_history', JSON.stringify(history));
}
function loadMoodToday(){
  try {
    const raw = localStorage.getItem('mood_today');
    if(!raw) return null;
    const data = JSON.parse(raw);
    if(data.date !== getMoodStorageKey()) return null;
    return data.mood;
  } catch(e){ return null; }
}
function getMoodHistory(){
  try { return JSON.parse(localStorage.getItem('mood_history') || '{}'); }
  catch(e){ return {}; }
}
// Data chart minggu ini (0-4 = mood index, null = belum diisi)
function getWeekMoodData(){
  const history = getMoodHistory();
  const data = [];
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date().getDay();
  for(let i=0;i<7;i++){
    const key = getDayMoodKey(today - i > 0 ? today - i : today - i + 7 - 7 + (today-i < 0 ? 7 : 0));
    // Hitung berapa hari lalu hari i (0=Sun..6=Sat) dari hari ini
    let daysAgo = today - i;
    if(daysAgo < 0) daysAgo += 7;
    const k = getDayMoodKey(daysAgo);
    data[i] = history[k] !== undefined ? history[k] : null;
  }
  return data;
}

let currentMood = loadMoodToday();
if(currentMood === null) currentMood = 2; // default neutral

function drawMoodChart(){
  const weekData = getWeekMoodData();
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const w=420, h=180, pad=28;
  const todayIdx = new Date().getDay();

  // Buat titik: hanya hari yang sudah ada data
  const pts = [];
  for(let i=0;i<7;i++){
    if(weekData[i] !== null){
      const x = pad + i*(w-2*pad)/6;
      const y = h - pad - (weekData[i])*(h-2*pad)/4;
      pts.push({x, y, i, v: weekData[i]});
    }
  }

  const xs = days.map((_,i)=> pad + i*(w-2*pad)/6);

  let svg = `<svg viewBox="0 0 ${w} ${h}" class="w-full h-44">`;

  // Grid lines
  for(let i=0;i<=4;i++){
    const y=pad+i*(h-2*pad)/4;
    svg+=`<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="#e5eeff" stroke-width="1"/>`;
    const moodLabel=['Great','Good','Neutral','Low','Stressed'][i];
    svg+=`<text x="${pad-4}" y="${y+4}" text-anchor="end" font-size="8" fill="#c1c7d1">${moodLabel}</text>`;
  }

  // Line jika ada ≥2 titik
  if(pts.length>=2){
    let d='M'+pts[0].x+','+pts[0].y;
    for(let i=1;i<pts.length;i++){
      const cx=(pts[i-1].x+pts[i].x)/2;
      d+=` Q${cx},${pts[i-1].y} ${cx},${(pts[i-1].y+pts[i].y)/2} T${pts[i].x},${pts[i].y}`;
    }
    // Area fill di bawah garis
    const areaD = d + ` L${pts[pts.length-1].x},${h-pad} L${pts[0].x},${h-pad} Z`;
    svg+=`<path d="${areaD}" fill="url(#moodGradFill)" opacity="0.15"/>`;
    svg+=`<defs><linearGradient id="moodGradFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#106399"/><stop offset="100%" stop-color="#106399" stop-opacity="0"/></linearGradient></defs>`;
    svg+=`<path d="${d}" fill="none" stroke="#106399" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="800" stroke-dashoffset="800"><animate attributeName="stroke-dashoffset" to="0" dur="0.8s" fill="freeze"/></path>`;
  }

  // Titik-titik hari
  xs.forEach((x,i)=>{
    const isToday = i===todayIdx;
    const v = weekData[i];
    const hasMood = v !== null;
    const y = hasMood ? h-pad-(v)*(h-2*pad)/4 : h-pad;

    if(hasMood){
      svg+=`<circle cx="${x}" cy="${y}" r="${isToday?6:4}" fill="${isToday?'#106399':'#5a9bd5'}" stroke="white" stroke-width="2"><title>${days[i]}: ${MOOD_LABELS[v]}</title></circle>`;
      if(isToday){
        svg+=`<text x="${x}" y="${y-12}" text-anchor="middle" font-family="'Font Awesome 6 Free'" font-weight="900" font-size="13" fill="#106399">${MOOD_UNICODES[v]}</text>`;
      }
    } else {
      // Titik abu-abu jika belum ada data (hari mendatang atau belum log)
      if(i<=todayIdx){
        svg+=`<circle cx="${x}" cy="${h-pad-10}" r="3" fill="#e5eeff"><title>${days[i]}: belum dilog</title></circle>`;
      }
    }
    svg+=`<text x="${x}" y="${h-4}" text-anchor="middle" font-size="10" fill="${isToday?'#106399':'#41474f'}" font-weight="${isToday?'700':'500'}">${days[i].substring(0,1)}</text>`;
  });

  svg+=`</svg>`;
  document.getElementById('moodChart').innerHTML=svg;
}

function updateStressFromMood(moodIdx){
  const bar = document.getElementById('stressBar');
  const stressTitle = document.querySelector('.card .text-secondary.font-bold.text-xl');
  const stressSubtitle = document.querySelector('.italic.text-sm.text-on-surface-variant');

  if(bar){
    bar.style.transition='width 1s ease';
    bar.style.width = STRESS_LEVELS[moodIdx]+'%';
    bar.className = 'h-full rounded-full transition-all duration-1000 '+(moodIdx<=1?'bg-error':moodIdx===2?'bg-primary-container':'bg-secondary');
  }
  if(stressTitle) stressTitle.textContent = STRESS_TEXTS[moodIdx];
  if(stressSubtitle) stressSubtitle.textContent = `Reflecting '${MOOD_LABELS[moodIdx]}'`;
}

// Init mood selectors
document.querySelectorAll('#moodSelectors button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  currentMood = +b.dataset.mood;
  saveMoodToday(currentMood);
  drawMoodChart();
  updateStressFromMood(currentMood);
  showToast('Mood tersimpan: '+MOOD_LABELS[currentMood]+' '+MOOD_ICONS[currentMood],'success');
}));

// Init checkin moods
document.querySelectorAll('#checkinMoods button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#checkinMoods button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  checkinMood=b.dataset.cmood;
}));

function submitCheckin(){
  const selectedCheckin = document.querySelector('#checkinMoods button.selected');
  if(selectedCheckin){
    const moodMap={'Stressed':0,'Low':1,'Neutral':2,'Good':3,'Great':4};
    const mIdx = moodMap[selectedCheckin.dataset.cmood];
    if(mIdx !== undefined){
      currentMood = mIdx;
      saveMoodToday(mIdx);
      document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
      const dashBtn = document.querySelector(`#moodSelectors button[data-mood="${mIdx}"]`);
      if(dashBtn) dashBtn.classList.add('selected');
      drawMoodChart();
      updateStressFromMood(mIdx);
    }
  }
  closeModal('checkinModal');
  showToast('Check-in tersimpan'+(checkinMood?' : '+checkinMood:''),'success');
  document.getElementById('checkinNote').value='';
}

/* ============== DONUT ============== */
function drawDonut(){
  const r=60,c=2*Math.PI*r,pct=85/199;
  document.getElementById('donutWrap').innerHTML=`<svg viewBox="0 0 160 160" class="w-44 h-44">
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#dce9ff" stroke-width="16"/>
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#106399" stroke-width="16" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 80 80)"><animate attributeName="stroke-dashoffset" to="${c*(1-pct)}" dur="1s" fill="freeze"/></circle>
    <text x="80" y="78" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1c30">85</text>
    <text x="80" y="98" text-anchor="middle" font-size="11" fill="#41474f">/ 199</text>
  </svg>`;
}

/* ============== SLEEP TABS (dashboard card) ============== */
if (document.querySelectorAll('#sleepTabs button').length > 0) {
  document.querySelectorAll('#sleepTabs button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#sleepTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const m={awake:[40,30,30],rem:[20,50,30],deep:[15,25,60]}[b.dataset.st];
    document.getElementById('sleepSegA').style.width=m[0]+'%';
    document.getElementById('sleepSegR').style.width=m[1]+'%';
    document.getElementById('sleepSegD').style.width=m[2]+'%';
  }));
}

/* ============== HYDRATION ============== */
function getTodayKey() {
  const d = new Date();
  return `hyd_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}
function getHydrationCups() {
  try {
    const raw = localStorage.getItem('hydration_today');
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return 0;
    return data.cups || 0;
  } catch(e) { return 0; }
}
let cups = getHydrationCups();
function renderHyd(){
  cups = getHydrationCups();
  if (document.getElementById('hydDashCount')) {
    document.getElementById('hydDashCount').textContent = cups;
  }
  const seg = document.getElementById('hydSegments');
  if(seg){
    seg.innerHTML='';
    for(let i=0;i<8;i++){
      const d=document.createElement('div');
      d.className='flex-1 h-3 rounded-full transition-all duration-300 '+(i<cups?'bg-primary':'bg-surface-container');
      seg.appendChild(d);
    }
  }
  const pill = document.getElementById('hydStatusPill');
  const txt = document.getElementById('hydStatusText');
  const msg = document.getElementById('hydDashMsg');
  if (pill && txt) {
    if(cups >= 8){
      pill.className='stat-pill-green pill px-3 py-1 text-xs font-bold flex items-center gap-1';
      txt.textContent=`Goal tercapai! (${cups}/8)`;
      if(msg) msg.textContent='Luar biasa! Kamu sudah mencapai target hidrasi hari ini.';
    } else if(cups >= 5){
      pill.className='stat-pill-green pill px-3 py-1 text-xs font-bold flex items-center gap-1';
      txt.textContent=`${cups}/8 - Hampir!`;
      if(msg) msg.textContent=`Tinggal ${8-cups} gelas lagi untuk mencapai target harianmu.`;
    } else if(cups >= 1){
      pill.className='stat-pill-yellow pill px-3 py-1 text-xs font-bold flex items-center gap-1';
      txt.textContent=`${cups}/8 - Terus minum`;
      if(msg) msg.textContent=`Kamu sudah minum ${cups} gelas. Terus semangat!`;
    } else {
      pill.className='bg-surface-container text-on-surface-variant pill px-3 py-1 text-xs font-bold flex items-center gap-1';
      txt.textContent='Belum minum';
      if(msg) msg.textContent='Minum gelas pertama untuk memulai hari hidrasimu.';
    }
  }
}
setInterval(renderHyd, 10000);

/* ============== GADGET TIME DASHBOARD CARD ============== */
function gtDayKey(daysAgo=0){
  const d=new Date();d.setDate(d.getDate()-daysAgo);
  return `gt_${d.getFullYear()}_${String(d.getMonth()).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
}
function fmtHMGt(sec){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return h>0?`${h}h ${String(m).padStart(2,'0')}m`:`${m}m`;}
function renderGadgetDash(){
  try {
    const raw=localStorage.getItem('gadget_today');
    let totalSec=0;
    if(raw){const data=JSON.parse(raw);if(data.date===gtDayKey())totalSec=data.totalSec||0;}
    const timeEl=document.getElementById('gtDashTime');
    const barEl=document.getElementById('gtDashBar');
    const pillEl=document.getElementById('gtDashPill');
    const titleEl=document.getElementById('gtDashTitle');
    const msgEl=document.getElementById('gtDashMsg');
    if(!timeEl)return;
    timeEl.textContent=fmtHMGt(totalSec);
    const hours=totalSec/3600;
    const pct=Math.min(100,(hours/8)*100);
    if(barEl){barEl.style.width=pct+'%';barEl.style.background=hours>=5?'#ef4444':hours>=3?'#f59e0b':'#22c55e';}
    if(pillEl){
      if(hours>=5){pillEl.textContent='BURUK';pillEl.className='stat-pill-red pill px-2 py-1 text-xs font-bold';}
      else if(hours>=3){pillEl.textContent='SEDANG';pillEl.className='stat-pill-yellow pill px-2 py-1 text-xs font-bold';}
      else if(totalSec>0){pillEl.textContent='BAIK';pillEl.className='stat-pill-green pill px-2 py-1 text-xs font-bold';}
      else{pillEl.textContent='—';pillEl.className='bg-surface-container text-on-surface-variant pill px-2 py-1 text-xs font-bold';}
    }
    if(titleEl)titleEl.textContent=hours>=5?'Perlu Istirahat':hours>=3?'Lakukan Peregangan':totalSec>0?'Tracking Aktif ✓':'Mulai Tracking';
    if(msgEl){
      if(totalSec===0)msgEl.textContent='Buka Gadget Time untuk mulai memantau screen time hari ini.';
      else if(hours>=5)msgEl.textContent=`${fmtHMGt(totalSec)} screen time hari ini. Istirahat sekarang!`;
      else if(hours>=3)msgEl.textContent=`${fmtHMGt(totalSec)} — di zona sedang. Peregangan sangat disarankan.`;
      else msgEl.textContent=`${fmtHMGt(totalSec)} screen time hari ini. Tetap pantau ya!`;
    }
  } catch(e){}
}
setInterval(renderGadgetDash, 5000);

/* ============== SLEEP DASHBOARD CARD ============== */
function sleepDayKeyIdx(){
  const d=new Date();
  return `sleep_${d.getFullYear()}_${String(d.getMonth()).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
}
function fmtDurSleep(min){const h=Math.floor(min/60),m=min%60;return h>0?`${h}j ${m}m`:`${m}m`;}
function renderSleepDash(){
  try{
    const hist=JSON.parse(localStorage.getItem('sleep_history')||'{}');
    const today=hist[sleepDayKeyIdx()];
    const scoreEl=document.getElementById('sleepDashScore');
    const pillEl=document.getElementById('sleepDashPill');
    const barEl=document.getElementById('sleepDashBar');
    const totalEl=document.getElementById('sleepDashTotal');
    if(!scoreEl)return;
    if(today){
      const sc=today.score||0;
      scoreEl.textContent=sc;
      if(barEl){barEl.style.width=sc+'%';barEl.style.background=sc>=75?'#1c6c3f':sc>=50?'#f59e0b':'#ef4444';}
      if(pillEl){
        pillEl.textContent=sc>=75?'BAIK ✓':sc>=50?'CUKUP':'KURANG';
        pillEl.className=`pill px-2 py-1 text-xs font-bold mb-1 ${sc>=75?'stat-pill-green':sc>=50?'stat-pill-yellow':'stat-pill-red'}`;
      }
      if(totalEl)totalEl.textContent=`${fmtDurSleep(today.durationMin)} · ${today.start}–${today.end}`;
      const q=today.quality||3;
      const aW=Math.max(5,30-q*3);
      const rW=15+q*3;
      const dW=100-aW-rW;
      const segA=document.getElementById('sleepSegA');
      const segR=document.getElementById('sleepSegR');
      const segD=document.getElementById('sleepSegD');
      if(segA)segA.style.width=aW+'%';
      if(segR)segR.style.width=rW+'%';
      if(segD)segD.style.width=dW+'%';
    } else {
      scoreEl.textContent='—';
      if(barEl)barEl.style.width='0%';
      if(pillEl){pillEl.textContent='Belum dicatat';pillEl.className='bg-surface-container text-on-surface-variant pill px-2 py-1 text-xs font-bold mb-1';}
      if(totalEl)totalEl.textContent='Catat tidurmu di halaman Sleep';
    }
  }catch(e){}
}
setInterval(renderSleepDash,8000);

/* ============== GADGET TIME (stretch countdown) ============== */
let stretchSec=15*60;
function tickStretch(){
  stretchSec=stretchSec<=0?15*60:stretchSec-1;
  const h=String(Math.floor(stretchSec/3600)).padStart(2,'0');
  const m=String(Math.floor((stretchSec%3600)/60)).padStart(2,'0');
  const s=String(stretchSec%60).padStart(2,'0');
  const el=document.getElementById('stretchCountdown');if(el)el.textContent=`${h}:${m}:${s}`;
}
setInterval(tickStretch,1000);
let stretchCount=4;
function incStretch(){if(stretchCount<6){stretchCount++;document.getElementById('stretchCount').textContent=stretchCount;showToast('Stretch logged','success');}}
function startStretchSession(){
  openModal('stretchModal');
  let s=5*60;
  document.getElementById('stretchSessionTime').textContent='05:00';
  clearInterval(window._stretchSession);
  window._stretchSession=setInterval(()=>{
    s--;if(s<=0){clearInterval(window._stretchSession);closeModal('stretchModal');showToast('Stretch session complete!','success');return;}
    const m=String(Math.floor(s/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');
    document.getElementById('stretchSessionTime').textContent=`${m}:${ss}`;
  },1000);
}

/* ============== SLEEP ============== */
function drawSleepArch(){
  const groups=5,colors=['#003151','#106399','#c4b5fd','#fb7185'];
  const stages=[[40,30,15,5],[35,35,20,5],[30,40,25,5],[25,35,30,5],[10,20,15,5]];
  const labels=['12AM','2AM','4AM','6AM','8AM'];
  let svg='';
  stages.forEach((s,i)=>{
    const gx=20+i*60;let y=20;
    s.forEach((v,k)=>{svg+=`<rect x="${gx}" y="${y}" width="40" height="${v*1.5}" fill="${colors[k]}"><title>${['Deep','Light','REM','Awake'][k]}: ${v}m</title></rect>`;y+=v*1.5;});
    svg+=`<text x="${gx+20}" y="175" text-anchor="middle" font-size="10" fill="#41474f">${labels[i]}</text>`;
  });
  if(document.getElementById('trendToggle')?.classList.contains('on')){
    let pts=stages.map((s,i)=>(20+i*60+20)+','+(20+s.reduce((a,b)=>a+b,0)*1.5*.6));
    svg+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#106399" stroke-width="2" stroke-dasharray="4 3"/>`;
  }
  if(document.getElementById('sleepArchChart')) document.getElementById('sleepArchChart').innerHTML=svg;
}

/* ============== BREATHING ============== */
let breathTimings={Inhale:4,Hold1:2,Exhale:4,Hold2:2};
let breathRunning=false,breathPhaseIdx=0,breathTimer=null,sessionN=1,streak=5,roundCount=0;
const PHASES=[{n:'INHALE',k:'Inhale',inst:s=>`Inhale for ${s} seconds`,size:220,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},{n:'HOLD',k:'Hold1',inst:s=>`Hold for ${s} seconds`,size:220,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},{n:'EXHALE',k:'Exhale',inst:s=>`Exhale for ${s} seconds`,size:160,bg:'radial-gradient(circle,#5a9bd5,#106399)'},{n:'HOLD',k:'Hold2',inst:s=>`Hold for ${s} seconds`,size:160,bg:'radial-gradient(circle,#5a9bd5,#106399)'}];
function runBreathPhase(){
  if(!breathRunning)return;
  const p=PHASES[breathPhaseIdx],dur=breathTimings[p.k];
  document.getElementById('breathPhase').textContent=p.n;
  document.getElementById('breathInstruction').textContent=p.inst(dur);
  const c=document.getElementById('breathCircle');
  c.style.transition=`all ${dur}s ease-in-out`;
  c.style.width=p.size+'px';c.style.height=p.size+'px';c.style.background=p.bg;
  breathTimer=setTimeout(()=>{
    breathPhaseIdx=(breathPhaseIdx+1)%4;
    if(breathPhaseIdx===0){roundCount++;showToast('Round complete!','success');if(roundCount>=1){sessionN=Math.min(5,sessionN+1);document.getElementById('sessionNum').textContent=sessionN;streak++;document.getElementById('streakCount').textContent=streak;}}
    runBreathPhase();
  },dur*1000);
}
function toggleBreath(){
  breathRunning=!breathRunning;
  document.getElementById('breathBtn').textContent=breathRunning?'Pause Session':'Resume Session';
  if(breathRunning)runBreathPhase();else clearTimeout(breathTimer);
}
function openBreathCustomize(){
  const c=document.getElementById('phaseControls');c.innerHTML='';
  ['Inhale','Hold1','Exhale','Hold2'].forEach(k=>{
    const row=document.createElement('div');row.className='flex items-center justify-between gap-2';
    row.innerHTML=`<span class="font-semibold text-sm">${k.replace(/\d/,'')}</span><div class="flex items-center gap-2"><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',-1)">−</button><span id="ph-${k}" class="font-bold w-8 text-center">${breathTimings[k]}s</span><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',1)">+</button></div>`;
    c.appendChild(row);
  });
  openModal('breathCustomize');
}
function changePhase(k,d){breathTimings[k]=Math.max(1,Math.min(10,breathTimings[k]+d));document.getElementById('ph-'+k).textContent=breathTimings[k]+'s';}
function startRoutine(min){navigate('breathing');if(!breathRunning){toggleBreath();}showToast('Routine started — '+min+' min','info');}
function drawWeeklyMood(){
  const data=[3,4,3,5,4,6,7],days=['M','T','W','T','F','S','S'];let svg='';
  data.forEach((v,i)=>{const x=20+i*40,h=v*12,y=110-h;const c=i===6?'#fff':'#5a9bd5';svg+=`<rect x="${x}" y="${y}" width="24" height="${h}" rx="6" fill="${c}"/><text x="${x+12}" y="125" text-anchor="middle" font-size="10" fill="#fff">${days[i]}</text>`;});
  if(document.getElementById('weeklyMoodChart')) document.getElementById('weeklyMoodChart').innerHTML=svg;
}
let feelHistory=[];

/* ============== SAFETY ============== */
function submitReport(e){e.preventDefault();e.target.reset();showToast('Report submitted anonymously','success');}

/* ============== REPORTS ============== */
const REPORTS_ALL=[];
const TYPES=['Bullying','Cyberbullying','Physical Threat','Other'];const LOCS=['East Corridor','Cafeteria','Gym','Library','Lab 2','Schoolyard','Bus Stop'];const STATUS=['Open','Resolved','Pending'];
for(let i=1;i<=24;i++)REPORTS_ALL.push({id:'R-'+String(1000+i),date:`2024-06-${String((i%28)+1).padStart(2,'0')}`,type:TYPES[i%4],loc:LOCS[i%LOCS.length],status:STATUS[i%3]});
let reportPage=1;
function renderReports(){
  if(!document.getElementById('reportFilter')) return;
  const filter=document.getElementById('reportFilter').value;
  let data=REPORTS_ALL.filter(r=>filter==='all'||r.status===filter);
  const per=8,total=Math.max(1,Math.ceil(data.length/per));reportPage=Math.min(reportPage,total);
  document.getElementById('reportPager').textContent=reportPage+' / '+total;
  data=data.slice((reportPage-1)*per,reportPage*per);
  const pill=s=>s==='Open'?'stat-pill-yellow':s==='Resolved'?'stat-pill-green':'bg-surface-container-high text-primary';
  document.getElementById('reportsBody').innerHTML=data.map(r=>`
    <tr class="border-t border-outline-variant hover:bg-surface-container-low cursor-pointer">
      <td class="p-3 font-bold" onclick="openReport('${r.id}')">${r.id}</td>
      <td class="p-3">${r.date}</td><td class="p-3">${r.type}</td><td class="p-3">${r.loc}</td>
      <td class="p-3"><span class="pill px-2 py-1 text-xs font-bold ${pill(r.status)}">${r.status}</span></td>
      <td class="p-3"><button class="btn-ghost text-xs" onclick="resolveReport('${r.id}')">Resolve</button></td>
    </tr>`).join('');
}
function openReport(id){const r=REPORTS_ALL.find(x=>x.id===id);document.getElementById('reportDetailBody').innerHTML=`<div class="space-y-2"><div><b>ID:</b> ${r.id}</div><div><b>Date:</b> ${r.date}</div><div><b>Type:</b> ${r.type}</div><div><b>Location:</b> ${r.loc}</div><div><b>Status:</b> ${r.status}</div><p class="text-on-surface-variant">Detailed narrative would appear here.</p></div>`;openModal('reportDetail');}
function resolveReport(id){const r=REPORTS_ALL.find(x=>x.id===id);if(r){r.status='Resolved';renderReports();showToast('Report resolved','success');}}
function exportCSV(){const rows=[['ID','Date','Type','Location','Status'],...REPORTS_ALL.map(r=>[r.id,r.date,r.type,r.loc,r.status])];const csv=rows.map(r=>r.join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='reports.csv';a.click();showToast('CSV exported','success');}

/* ============== SETTINGS ============== */
const notifSettings={'Push Notifications':true,'Email Reminders':true,'Hydration Reminders':true,'Sleep Alerts':false,'Stress Check-ins':true};
function renderNotifs(){
  const c=document.getElementById('notifList');
  if(!c) return;
  c.innerHTML='';
  Object.entries(notifSettings).forEach(([k,v])=>{
    const row=document.createElement('div');row.className='flex items-center justify-between';
    row.innerHTML=`<span class="text-sm">${k}</span><div class="toggle ${v?'on':''}"></div>`;
    row.querySelector('.toggle').addEventListener('click',e=>{notifSettings[k]=!notifSettings[k];e.target.classList.toggle('on');showToast(k+': '+(notifSettings[k]?'ON':'OFF'),'info');});
    c.appendChild(row);
  });
}
function downloadData(){
  const blob=new Blob([JSON.stringify({
    profile:{name:'Naa',grade:'11-A'},
    hydration:{cups, date: getTodayKey()},
    mood:{today: MOOD_LABELS[currentMood], history: getMoodHistory()},
    notifSettings
  },null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my_data.json';a.click();
  showToast('Data downloaded','success');
}
function clearMoodHistory(){
  document.getElementById('confirmTitle').textContent='Hapus riwayat mood?';
  document.getElementById('confirmMsg').textContent='Tindakan ini tidak dapat dibatalkan.';
  document.getElementById('confirmOk').onclick=()=>{
    localStorage.removeItem('mood_history');
    localStorage.removeItem('mood_today');
    currentMood=2;
    document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
    document.querySelector('#moodSelectors button[data-mood="2"]')?.classList.add('selected');
    drawMoodChart();
    updateStressFromMood(2);
    closeModal('confirmModal');
    showToast('Riwayat mood dihapus','success');
  };
  openModal('confirmModal');
}

const I18N={en:{brand:'SafeSchoolHub',dashTitle:'Student Wellness',settings:'Settings'},id:{brand:'SafeSchoolHub',dashTitle:'Kesejahteraan Siswa',settings:'Pengaturan'}};
function setLang(l){document.querySelectorAll('[data-i18n]').forEach(el=>{const v=I18N[l][el.dataset.i18n];if(v)el.textContent=v;});showToast('Language: '+l.toUpperCase(),'info');}

/* ============== INIT ============== */
renderNotifs();
initPage();

/* ===== PROFILE SIDEBAR INIT ===== */
(function(){
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name=localStorage.getItem('profileName')|| user.name || 'Naa';
  const grade=localStorage.getItem('profileGrade')|| user.role || 'Grade 11-A';
  const sn=document.getElementById('sidebarName');if(sn)sn.textContent=name;
  const sg=document.getElementById('sidebarGrade');if(sg)sg.textContent=grade;
  const mb=document.getElementById('mobileAvatarBadge');
  if(mb)mb.textContent=name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
})();
