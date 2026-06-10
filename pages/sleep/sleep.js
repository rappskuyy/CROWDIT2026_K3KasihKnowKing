/* ============== ROUTER ============== */
const ROUTE_FILES={
  "overview": "../dashboard/dashboard.html",
  "educational": "../educational/educational.html",
  "gadget-time": "../gadget-time/gadget-time.html",
  "hydration": "../hydration/hydration.html",
  "sleep": "sleep.html",
  "breathing": "../breathing/breathing.html",
  "reports": "../reports/reports.html",
  "counseling": "../counseling/counseling.html",
  "settings": "../settings/settings.html"
};
const CURRENT_ROUTE='sleep';
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
  if(r==='sleep'){ renderSleepPage(); }
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
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));
});
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{
  if(e.target===m) m.classList.remove('open');
}));

function openCheckin(){openModal('checkinModal');}
let checkinMood=null;
document.querySelectorAll('#checkinMoods button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#checkinMoods button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  checkinMood=b.dataset.cmood;
}));
function submitCheckin(){
  closeModal('checkinModal');
  showToast('Check-in submitted'+(checkinMood?': '+checkinMood:''),'success');
  const cn = document.getElementById('checkinNote');
  if(cn) cn.value='';
}

function confirmLogout(){
  document.getElementById('confirmTitle').textContent='Log out?';
  document.getElementById('confirmMsg').textContent='You will be returned to the dashboard.';
  document.getElementById('confirmOk').onclick=()=>{
    closeModal('confirmModal');
    navigate('overview');
    showToast('Logged out','info');
  };
  openModal('confirmModal');
}
const logoutBtn = document.getElementById('sidebar-logout');
if(logoutBtn) logoutBtn.addEventListener('click',confirmLogout);

/* ============== MOOD CHART ============== */
const moodData={0:[1,2,1,2,1,2,1],1:[2,3,2,3,2,3,2],2:[3,4,3,5,4,4,3],3:[4,5,4,5,4,5,4],4:[5,5,5,5,5,5,5]};
let currentMood=2;
function drawMoodChart(){
  const data=moodData[currentMood], w=420, h=180, pad=24;
  const xs=data.map((_,i)=>pad+i*(w-2*pad)/6);
  const ys=data.map(v=>h-pad-(v-1)*(h-2*pad)/4);
  let d='M'+xs[0]+','+ys[0];
  for(let i=1;i<xs.length;i++){
    const cx=(xs[i-1]+xs[i])/2;
    d+=' Q'+cx+','+ys[i-1]+' '+cx+','+(ys[i-1]+ys[i])/2+' T'+xs[i]+','+ys[i];
  }
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let svg=`<svg viewBox="0 0 ${w} ${h}" class="w-full h-44">`;
  for(let i=1;i<=4;i++){
    const y=pad+i*(h-2*pad)/5;
    svg+=`<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="#e5eeff" stroke-width="1"/>`;
  }
  svg+=`<path d="${d}" fill="none" stroke="#106399" stroke-width="3" stroke-linecap="round" stroke-dasharray="800" stroke-dashoffset="800"><animate attributeName="stroke-dashoffset" to="0" dur="0.8s" fill="freeze"/></path>`;
  xs.forEach((x,i)=>{svg+=`<circle cx="${x}" cy="${ys[i]}" r="4" fill="#106399"><title>${days[i]}: ${data[i]}</title></circle>`;});
  xs.forEach((x,i)=>{svg+=`<text x="${x}" y="${h-4}" text-anchor="middle" font-size="10" fill="#41474f">${days[i]}</text>`;});
  svg+=`</svg>`;
  const mc = document.getElementById('moodChart');
  if(mc) mc.innerHTML=svg;
}
const msb = document.querySelectorAll('#moodSelectors button');
if(msb) msb.forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');currentMood=+b.dataset.mood;drawMoodChart();showToast('Mood updated','success');
}));

/* ============== DONUT ============== */
function drawDonut(){
  const r=60,c=2*Math.PI*r,pct=85/199;
  const dw = document.getElementById('donutWrap');
  if(dw) dw.innerHTML=`<svg viewBox="0 0 160 160" class="w-44 h-44">
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#dce9ff" stroke-width="16"/>
    <circle cx="80" cy="80" r="${r}" fill="none" stroke="#106399" stroke-width="16" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 80 80)"><animate attributeName="stroke-dashoffset" to="${c*(1-pct)}" dur="1s" fill="freeze"/></circle>
    <text x="80" y="78" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1c30">85</text>
    <text x="80" y="98" text-anchor="middle" font-size="11" fill="#41474f">/ 199</text>
  </svg>`;
}

/* ============== SLEEP TABS (dashboard card) ============== */
document.querySelectorAll('#sleepTabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#sleepTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  const m={awake:[40,30,30],rem:[20,50,30],deep:[15,25,60]}[b.dataset.st];
  document.getElementById('sleepSegA').style.width=m[0]+'%';
  document.getElementById('sleepSegR').style.width=m[1]+'%';
  document.getElementById('sleepSegD').style.width=m[2]+'%';
}));

/* ============== GADGET TIME (noop) ============== */
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

/* ============== SLEEP — LOCALSTORAGE SYSTEM ============== */

// ---- Key helpers ----
function sleepDayKey(daysAgo=0){
  const d=new Date();d.setDate(d.getDate()-daysAgo);
  return `sleep_${d.getFullYear()}_${String(d.getMonth()).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
}
function sleepLoadHistory(){
  try{return JSON.parse(localStorage.getItem('sleep_history')||'{}');}catch(e){return{};}
}
function sleepSaveHistory(hist){
  localStorage.setItem('sleep_history',JSON.stringify(hist));
}
function sleepTodayKey(){return sleepDayKey(0);}

// ---- State ----
let selectedQuality=0;
let morningMoodVal=null;

// ---- Init date label ----
(function(){
  const el=document.getElementById('sleepDateLabel');
  if(el){const d=new Date();el.textContent=d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'});}
})();

// ---- Quality selector ----
const QUALITY_LABELS=['','sleepQVeryBad','sleepQBad','sleepQFair','sleepQGood','sleepQVeryGood'];
function selectQuality(q){
  selectedQuality=q;
  document.querySelectorAll('#sleepQualityBtns button').forEach(b=>{
    const isActive=+b.dataset.q===q;
    b.style.borderColor=isActive?'#106399':'';
    b.style.background=isActive?'#dce9ff':'';
    b.style.transform=isActive?'scale(1.1)':'';
  });
  const el=document.getElementById('qualityLabel');
  if(el)el.textContent=LangSystem.t(QUALITY_LABELS[q])||'';
}

// ---- Calculate duration ----
function calcDuration(start,end){
  const [sh,sm]=start.split(':').map(Number);
  const [eh,em]=end.split(':').map(Number);
  let startMin=sh*60+sm, endMin=eh*60+em;
  if(endMin<=startMin)endMin+=24*60; // crossed midnight
  return endMin-startMin; // in minutes
}
function fmtDuration(min){
  const h=Math.floor(min/60),m=min%60;
  return h>0?`${h}j ${m}m`:`${m}m`;
}
function calcScore(durationMin,quality){
  let score=0;
  if(durationMin>=480) score=50; // 8h = 50pts
  else if(durationMin>=420) score=45;
  else if(durationMin>=360) score=35;
  else if(durationMin>=300) score=25;
  else score=15;
  score += (quality||1)*9;
  return Math.min(100,score);
}

// ---- Save log ----
function saveSleepLog(){
  const start=document.getElementById('sleepStart').value;
  const end=document.getElementById('sleepEnd').value;
  if(!start||!end){showToast('Isi jam tidur dan bangun dulu!','error');return;}
  if(!selectedQuality){showToast('Pilih kualitas tidur dulu!','error');return;}
  const dur=calcDuration(start,end);
  const score=calcScore(dur,selectedQuality);
  const note=document.getElementById('sleepNote').value.trim();
  const entry={date:sleepTodayKey(),start,end,durationMin:dur,quality:selectedQuality,score,note,mood:morningMoodVal,savedAt:new Date().toISOString()};
  const hist=sleepLoadHistory();
  hist[sleepTodayKey()]=entry;
  sleepSaveHistory(hist);
  showToast('<i class="fa-solid fa-circle-check"></i> Log tidur tersimpan!','success');
  renderSleepPage();
}

// ---- Render all sleep UI ----
function renderSleepPage(){
  const hist=sleepLoadHistory();
  const today=hist[sleepTodayKey()];

  const scorePill=document.getElementById('sleepScorePill');
  if(today){
    const sc=today.score;
    if(scorePill){
      scorePill.textContent=sc>=75?'Tidur Baik ✓':sc>=50?'Cukup':'Perlu Istirahat Lebih';
      scorePill.className=`pill px-3 py-1 text-xs font-bold inline-block mb-2 ${sc>=75?'stat-pill-green':sc>=50?'stat-pill-yellow':'stat-pill-red'}`;
    }
    const totalEl = document.getElementById('statTotal');
    if (totalEl) totalEl.textContent=fmtDuration(today.durationMin);
    const sr=document.getElementById('smartRoutineText');
    if(sr){
      if(today.durationMin>=480) sr.textContent='Luar biasa! Kamu tidur '+fmtDuration(today.durationMin)+' malam ini. Pertahankan jadwal ini!';
      else if(today.durationMin>=360) sr.textContent='Kamu tidur '+fmtDuration(today.durationMin)+'. Coba tidur 30 menit lebih awal untuk mencapai 8 jam ideal.';
      else sr.textContent='Kamu hanya tidur '+fmtDuration(today.durationMin)+'. Usahakan tidur sebelum jam 22.00 malam ini.';
    }
  } else {
    if(scorePill){
      scorePill.textContent='Belum dicatat';
      scorePill.className='pill px-3 py-1 text-xs font-bold inline-block mb-2 bg-surface-container text-on-surface-variant';
    }
    const st = document.getElementById('statTotal');
    if(st) st.textContent='—';
  }

  let totalMin=0,cnt=0;
  for(let i=0;i<7;i++){const k=sleepDayKey(i);if(hist[k]){totalMin+=hist[k].durationMin;cnt++;}}
  const avg=cnt?Math.round(totalMin/cnt):0;
  const avgEl=document.getElementById('statAvg');
  if(avgEl) avgEl.textContent=avg?fmtDuration(avg):'—';
  const weekAvgEl=document.getElementById('weekSleepAvgLabel');
  if(weekAvgEl) weekAvgEl.textContent=avg?`Rata-rata: ${fmtDuration(avg)}/hari`:'';

  drawSleepArch();
  drawSleepWeekChart();
  renderSleepHistory();

  syncSleepToIndex(today,avg);
}

function syncSleepToIndex(today,avgMin){
  const payload={date:sleepTodayKey(),today:today||null,avgMin:avgMin||0};
  localStorage.setItem('sleep_dashboard',JSON.stringify(payload));
}

function drawSleepArch(){}

function drawSleepWeekChart(){
  const hist=sleepLoadHistory();
  const days=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const baseY=130,maxH=110,barW=32;
  const maxMin=480; 
  let svg='';

  const goalY=baseY-(420/maxMin)*maxH;
  svg+=`<line x1="10" y1="${goalY}" x2="310" y2="${goalY}" stroke="#22c55e" stroke-width="1" stroke-dasharray="4 3" opacity="0.7"/>`;
  svg+=`<text x="308" y="${goalY-3}" text-anchor="end" font-size="8" fill="#22c55e">7j</text>`;

  for(let i=6;i>=0;i--){
    const k=sleepDayKey(i);
    const entry=hist[k];
    const dur=entry?entry.durationMin:0;
    const x=15+(6-i)*42;
    const h=Math.max(2,(Math.min(dur,maxMin)/maxMin)*maxH);
    const y=baseY-h;
    const col=dur>=420?'#1c6c3f':dur>=300?'#f59e0b':'#ef4444';
    const isToday=i===0;
    const d=new Date();d.setDate(d.getDate()-i);
    const lbl=days[d.getDay()];
    if(dur>0){
      svg+=`<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="5" fill="${col}" opacity="${isToday?1:0.65}"><title>${lbl}: ${fmtDuration(dur)}</title></rect>`;
      svg+=`<text x="${x+barW/2}" y="${y-4}" text-anchor="middle" font-size="9" font-weight="700" fill="${col}">${fmtDuration(dur)}</text>`;
    } else {
      svg+=`<rect x="${x}" y="${baseY-4}" width="${barW}" height="4" rx="2" fill="#e5eeff"/>`;
    }
    svg+=`<text x="${x+barW/2}" y="148" text-anchor="middle" font-size="10" fill="${isToday?'#106399':'#41474f'}" font-weight="${isToday?'700':'500'}">${lbl}</text>`;
  }
  const el=document.getElementById('sleepWeekChart');
  if(el)el.innerHTML=svg;
}

function renderSleepHistory(){
  const hist=sleepLoadHistory();
  const el=document.getElementById('sleepHistoryList');
  if(!el)return;
  const entries=Object.values(hist).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7);
  if(!entries.length){el.innerHTML='<div class="text-on-surface-variant text-xs">Belum ada riwayat.</div>';return;}
  el.innerHTML=entries.map(e=>{
    const d=new Date(e.savedAt||e.date);
    const dateStr=d.toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short'});
    const col=e.score>=75?'stat-pill-green':e.score>=50?'stat-pill-yellow':'stat-pill-red';
    return `<div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
      <div>
        <div class="font-semibold text-sm">${dateStr}</div>
        <div class="text-xs text-on-surface-variant">${e.start} – ${e.end} · ${fmtDuration(e.durationMin)} · ${LangSystem.t(QUALITY_LABELS[e.quality])||''}</div>
        ${e.note?`<div class="text-xs text-on-surface-variant italic mt-0.5">${e.note}</div>`:''}
      </div>
      <span class="${col} pill px-2 py-0.5 text-xs font-bold">${e.score}</span>
    </div>`;
  }).join('');
}

function clearSleepHistory(){
  document.getElementById('confirmTitle').textContent='Hapus riwayat tidur?';
  document.getElementById('confirmMsg').textContent='Semua data tidur akan dihapus permanen.';
  document.getElementById('confirmOk').onclick=()=>{
    localStorage.removeItem('sleep_history');
    localStorage.removeItem('sleep_dashboard');
    closeModal('confirmModal');
    showToast('Riwayat tidur dihapus','success');
    renderSleepPage();
  };
  openModal('confirmModal');
}

const mmb = document.querySelectorAll('#morningMoods button');
if (mmb) mmb.forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#morningMoods button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  morningMoodVal=b.dataset.mm;
  document.getElementById('morningMoodMsg').textContent='Mood tercatat: '+b.textContent;
  const hist=sleepLoadHistory();
  if(hist[sleepTodayKey()]){hist[sleepTodayKey()].mood=morningMoodVal;sleepSaveHistory(hist);}
  showToast('Mood pagi tercatat ✓','success');
}));

const srtb = document.querySelectorAll('#sleepRangeTabs button');
if(srtb) srtb.forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#sleepRangeTabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  drawSleepArch();
  showToast('Tampilan: '+b.textContent,'info');
}));

function toggleTrendLine(){drawSleepArch();}

let medPlaying=false,medT=0,medInt=null;
const MED_PHASES=['Tarik napas perlahan...','Tahan sejenak...','Hembuskan perlahan...','Rileks...'];
function startMeditationPlayer(){
  document.getElementById('medPlayer').classList.remove('hidden');
  if(medInt)clearInterval(medInt);
  medPlaying=true;medT=0;
  document.getElementById('medPlayIcon').textContent='pause';
  medInt=setInterval(medTick,1000);
}
function toggleMedPlay(){
  medPlaying=!medPlaying;
  document.getElementById('medPlayIcon').textContent=medPlaying?'pause':'play_arrow';
}
function medTick(){
  if(!medPlaying)return;
  medT++;
  if(medT>=600){clearInterval(medInt);medPlaying=false;document.getElementById('medPlayIcon').textContent='play_arrow';showToast('Meditasi selesai <i class="fa-solid fa-moon"></i>','success');return;}
  document.getElementById('medProg').style.width=(medT/600*100)+'%';
  document.getElementById('medTime').textContent=Math.floor(medT/60)+':'+String(medT%60).padStart(2,'0');
  const phaseEl=document.getElementById('medPhaseLabel');
  if(phaseEl)phaseEl.textContent=MED_PHASES[Math.floor(medT/10)%4];
}

let watchConnected=false;
function toggleWatchConnection(){
  const btn=document.getElementById('connectWatchBtn');
  const status=document.getElementById('watchStatus');
  if(!btn||!status) return;
  watchConnected=!watchConnected;
  if(watchConnected){
    btn.textContent='Disconnect';
    status.textContent='Smartwatch “FitTrack 2.0” connected.';
    showToast('Smartwatch connected','success');
  } else {
    btn.textContent='Connect';
    status.textContent='No smartwatch connected.';
    showToast('Smartwatch disconnected','info');
  }
}

/* ============== INIT SLEEP PAGE ============== */
renderSleepPage();

/* ============== HYDRATION (noop — handled by hydration.html) ============== */
let cups=0;
function renderHyd(){}
function changeCup(){}

/* ============== INIT ============== */
function renderNotifs(){const c=document.getElementById('notifList');if(!c)return;}
renderNotifs();
initPage();
