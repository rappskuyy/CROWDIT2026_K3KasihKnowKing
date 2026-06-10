/* ============== ROUTER ============== */
const ROUTE_FILES={
  "overview": "../../index.html",
  "educational": "../educational/educational.html",
  "gadget-time": "gadget-time.html",
  "hydration": "../hydration/hydration.html",
  "sleep": "../sleep/sleep.html",
  "breathing": "../breathing/breathing.html",
  "reports": "../reports/reports.html",
  "counseling": "../counseling/counseling.html",
  "settings": "../settings/settings.html"
};
const CURRENT_ROUTE='gadget-time';
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
    drawMoodChart();
    renderScreenTimeChart();
    setTimeout(()=>{
      const sb=document.getElementById('stressBar');
      if(sb) sb.style.width='30%';
    },50);
  }
  if(r==='hydration'){ drawHydWeek(); }
  if(r==='sleep'){ drawSleepArch(); }
  if(r==='breathing'){ drawWeeklyMood(); }
  if(r==='reports'){ renderReports(); }
}
document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.route)));

/* ============== TOAST ============== */
function showToast(msg,type='info'){
  const c=document.getElementById('toast');
  if(!c) return;
  const t=document.createElement('div');
  t.className='toast-item '+type;
  t.innerHTML='<span class="material-symbols-outlined" style="font-size:18px">'+(type==='success'?'check_circle':type==='error'?'error':'info')+'</span>'+msg;
  c.appendChild(t);
  setTimeout(()=>{
    t.classList.add('out');
    setTimeout(()=>t.remove(),300);
  },3000);
}

/* ============== MODALS ============== */
function openModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.add('open');
}
function closeModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('open');
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));
});
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{
  if(e.target===m) m.classList.remove('open');
}));

function openCheckin(){ openModal('checkinModal'); }
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
document.querySelectorAll('#moodSelectors button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#moodSelectors button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
  currentMood=+b.dataset.mood;
  drawMoodChart();
  showToast('Mood updated','success');
}));

/* ============== DEVICE BREAKDOWN CHART (localStorage-aware) ============== */
const DEVICE_COLORS=['#106399','#5a9bd5','#a5d8ff','#c4b5fd'];
const DEVICE_LABELS=['Laptop','Ponsel','Tablet','Lainnya'];

function gtDayKey(daysAgo=0){
  const d=new Date();
  d.setDate(d.getDate()-daysAgo);
  return `gt_${d.getFullYear()}_${String(d.getMonth()).padStart(2,'0')}_${String(d.getDate()).padStart(2,'0')}`;
}
function fmtHMGt(min){
  const h=Math.floor(min/60),m=min%60;
  return h>0?`${h}h ${String(m).padStart(2,'0')}m`:`${m}m`;
}

function loadGadgetDataFromLS(){
  try{
    const raw=localStorage.getItem('gadget_today');
    if(!raw) return null;
    const data=JSON.parse(raw);
    if(data.date!==gtDayKey()) return null;
    return data;
  }catch(e){return null;}
}

function getDefaultGadgetData(){
  return {date:gtDayKey(),devices:[0,0,0,0],totalMin:0};
}

function saveGadgetData(data){
  try{
    const raw=localStorage.getItem('gadget_today');
    if(raw){
      const old=JSON.parse(raw);
      if(old.date&&old.date!==data.date) localStorage.setItem('gadget_yesterday',raw);
    }
    data.totalSec=(data.totalMin||0)*60;
    localStorage.setItem('gadget_today',JSON.stringify(data));
  }catch(e){}
}

function loadGadgetDataYesterday(){
  try{
    const raw=localStorage.getItem('gadget_yesterday');
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){return null;}
}

function getDeviceData(){
  const ls=loadGadgetDataFromLS()||getDefaultGadgetData();
  return DEVICE_LABELS.map((label,i)=>({label,minutes:ls.devices[i]||0,color:DEVICE_COLORS[i]}));
}

/* === TAMBAH +15 MENIT PER PERANGKAT === */
function addDeviceTime(idx){
  const ls=loadGadgetDataFromLS()||getDefaultGadgetData();
  ls.devices[idx]=(ls.devices[idx]||0)+15;
  ls.totalMin=ls.devices.reduce((a,b)=>a+b,0);
  saveGadgetData(ls);
  renderScreenTimeChart();
  updateDeviceInputLabels();
  showToast(`+15 menit ditambahkan ke ${DEVICE_LABELS[idx]}`,'success');
}

function resetGadgetTime(){
  document.getElementById('confirmTitle').textContent='Reset waktu gadget?';
  document.getElementById('confirmMsg').textContent='Semua data waktu hari ini akan dihapus dan dimulai dari nol.';
  document.getElementById('confirmOk').onclick=()=>{
    const fresh=getDefaultGadgetData();
    saveGadgetData(fresh);
    closeModal('confirmModal');
    renderScreenTimeChart();
    updateDeviceInputLabels();
    showToast('Data direset ke nol','info');
  };
  openModal('confirmModal');
}

function updateDeviceInputLabels(){
  const ls=loadGadgetDataFromLS()||getDefaultGadgetData();
  DEVICE_LABELS.forEach((_,i)=>{
    const el=document.getElementById('dev-label-'+i);
    if(el) el.textContent=fmtHMGt(ls.devices[i]||0);
  });
}

function updateGtHeader(){
  const ls=loadGadgetDataFromLS()||getDefaultGadgetData();
  const totalMin=ls.totalMin||0;
  const hours=totalMin/60;
  const timeEl=document.getElementById('gtTotalTime');
  const pillEl=document.getElementById('gtChangePill');
  if(timeEl){
    timeEl.textContent=fmtHMGt(totalMin);
    if(totalMin===0) timeEl.style.color='#41474f';
    else if(hours>=5) timeEl.style.color='#ba1a1a';
    else if(hours>=3) timeEl.style.color='#d97706';
    else timeEl.style.color='#1c6c3f';
  }
  const yday=loadGadgetDataYesterday();
  if(pillEl){
    if(totalMin===0){
      pillEl.textContent='Belum dimulai';
      pillEl.style.cssText='background:#e5eeff;color:#106399';
    } else if(yday&&yday.totalMin>0){
      const diff=totalMin-yday.totalMin;
      const pct=Math.round(Math.abs(diff)/yday.totalMin*100);
      if(diff>0){
        pillEl.textContent=`+${pct}% dari kemarin`;
        pillEl.style.cssText='background:#ffdad6;color:#93000a';
      } else {
        pillEl.textContent=`-${pct}% dari kemarin`;
        pillEl.style.cssText='background:#d1fae5;color:#1c6c3f';
      }
    } else {
      pillEl.textContent=hours>=5?'Perlu Istirahat!':hours>=3?'Sedang':'Baik ✓';
      if(hours>=5) pillEl.style.cssText='background:#ffdad6;color:#93000a';
      else if(hours>=3) pillEl.style.cssText='background:#fff3c4;color:#8a6500';
      else pillEl.style.cssText='background:#d1fae5;color:#1c6c3f';
    }
  }
  const barPct=Math.min(96,(hours/8)*100);
  const cursorWrap=document.getElementById('gtCursorWrap');
  if(cursorWrap) cursorWrap.style.left=barPct+'%';
  updateLegend();
  updateDeviceInputLabels();
}

function updateLegend(){
  const data=getDeviceData();
  const legend=document.getElementById('deviceLegend');
  if(!legend) return;
  legend.innerHTML=data.map(d=>{
    const label=fmtHMGt(d.minutes);
    return `<div class="flex items-center gap-2 text-xs"><span class="w-3 h-3 rounded-full inline-block" style="background:${d.color}"></span><span>${d.label}: ${label}</span></div>`;
  }).join('');
}

let currentChartType='donut';

function renderScreenTimeChart(){
  updateGtHeader();
  drawDonut();
}

function drawDonut(){
  const DEVICE_DATA=getDeviceData();
  const realTotal=DEVICE_DATA.reduce((s,d)=>s+d.minutes,0);
  const TOTAL_MIN=realTotal||1;
  const w=280,h=220,cx=140,cy=110,r=80,strokeW=22;
  const circ=2*Math.PI*r;
  let offset=0;
  let slices='';
  if(realTotal===0){
    slices=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e5eeff" stroke-width="${strokeW}"/>`;
  } else {
    DEVICE_DATA.forEach((d,idx)=>{
      if(d.minutes===0) return;
      const pct=d.minutes/TOTAL_MIN;
      const dash=circ*pct;
      const gap=circ*(1-pct);
      const rotate=-90+(offset/TOTAL_MIN*360);
      const animDelay=idx*0.15;
      slices+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${strokeW}"
        stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${dash}" 
        transform="rotate(${rotate} ${cx} ${cy})" stroke-linecap="butt"
        style="transition:stroke-dashoffset 0.8s ease ${animDelay}s">
        <title>${d.label}: ${fmtHMGt(d.minutes)}</title>
      </circle>`;
      offset+=d.minutes;
    });
  }
  const timeText=realTotal===0?'0m':fmtHMGt(realTotal);
  const svgHTML=`<div class="flex flex-col items-center gap-4 py-2">
    <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e5eeff" stroke-width="${strokeW}"/>
      ${slices}
      <text x="${cx}" y="${cy-10}" text-anchor="middle" font-size="24" font-weight="800" fill="#0b1c30">${timeText}</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="12" fill="#41474f">Total Hari Ini</text>
    </svg>
    <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm w-full max-w-xs">
      ${DEVICE_DATA.map(d=>{const lbl=fmtHMGt(d.minutes);return `
        <div class="flex items-center gap-2">
          <span style="width:12px;height:12px;border-radius:50%;background:${d.color};display:inline-block;flex-shrink:0"></span>
          <span class="font-semibold">${d.label}</span>
          <span class="text-on-surface-variant ml-auto">${lbl}</span>
        </div>`;}).join('')}
    </div>
  </div>`;
  document.getElementById('screenTimeChart').innerHTML=svgHTML;
  setTimeout(()=>{
    document.querySelectorAll('#screenTimeChart circle[stroke-dashoffset]').forEach(c=>{
      const da=c.getAttribute('stroke-dasharray').split(' ')[0];
      c.style.strokeDashoffset='0';
    });
  },50);
}

function drawDonutAlias(){ renderScreenTimeChart(); }

/* ============== SLEEP TABS (dashboard card) ============== */
document.querySelectorAll('#sleepTabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#sleepTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  const m={awake:[40,30,30],rem:[20,50,30],deep:[15,25,60]}[b.dataset.st];
  document.getElementById('sleepSegA').style.width=m[0]+'%';
  document.getElementById('sleepSegR').style.width=m[1]+'%';
  document.getElementById('sleepSegD').style.width=m[2]+'%';
}));

/* ============== HYDRATION (localStorage sync) ============== */
function getHydTodayKey(){
  const d=new Date();
  return `hyd_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}
function loadCupsFromLS(){
  try{
    const raw=localStorage.getItem('hydration_today');
    if(!raw) return 0;
    const data=JSON.parse(raw);
    if(data.date!==getHydTodayKey()) return 0;
    return data.cups||0;
  }catch(e){return 0;}
}
function saveCupsToLS(c){
  localStorage.setItem('hydration_today',JSON.stringify({date:getHydTodayKey(),cups:c}));
}
let cups=loadCupsFromLS();
function renderHyd(){
  const cupCountEl=document.getElementById('cupCount');
  const hydDashEl=document.getElementById('hydDashCount');
  if(cupCountEl) cupCountEl.textContent=cups;
  if(hydDashEl) hydDashEl.textContent=cups;
  const pct=cups/8*100;
  const cupBar=document.getElementById('cupBar');
  if(cupBar) cupBar.style.width=pct+'%';
  const bf=document.getElementById('bottleFill');
  if(bf){bf.setAttribute('y',12+(116*(1-pct/100)));bf.setAttribute('height',116*pct/100);}
  const bpct=document.getElementById('bottlePct');
  if(bpct) bpct.textContent=Math.round(pct)+'%';
  const seg=document.getElementById('hydSegments');
  if(seg){seg.innerHTML='';for(let i=0;i<8;i++){const d=document.createElement('div');d.className='flex-1 h-3 rounded-full '+(i<cups?'bg-primary':'bg-surface-container');seg.appendChild(d);}}
  const hydMsg=document.getElementById('hydMsg');
  if(hydMsg) hydMsg.textContent=cups>=8?'Goal reached! Stay hydrated.':cups>=6?`You're doing great! Just ${8-cups} more cups to reach your optimal energy levels.`:'Keep drinking — you can do it!';
}
function changeCup(d){
  cups=Math.max(0,Math.min(8,cups+d));
  saveCupsToLS(cups);
  renderHyd();
  const bf=document.getElementById('bottleFill');if(bf){bf.style.transition='all .5s ease';}
  showToast(d>0?'Cup added':'Cup removed','success');
}
const FACTS=['Just a 2% drop in hydration can cause significant fatigue and reduced alertness.','Your brain is ~75% water — staying hydrated improves memory.','Drinking water before meals can improve digestion and energy.'];
let factIdx=0;
function cycleFact(){factIdx=(factIdx+1)%FACTS.length;document.getElementById('factText').textContent=FACTS[factIdx];}
function toggleAccordion(id){document.getElementById(id).classList.toggle('hidden');}
function drawHydWeek(){
  const data=[3,5,4,6,8,5,4],days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let svg='';
  data.forEach((v,i)=>{const x=20+i*42,h=v*12,y=120-h;const color=i===4?'#106399':'#dce9ff';svg+=`<rect x="${x}" y="${y}" width="28" height="${h}" rx="6" fill="${color}"><title>${days[i]}: ${v}</title></rect><text x="${x+14}" y="135" text-anchor="middle" font-size="10" fill="#41474f">${days[i]}</text>`;});
  const hw = document.getElementById('hydWeekChart');
  if(hw) hw.innerHTML=svg;
}
const hwt = document.querySelectorAll('#hydWeekTabs button');
if(hwt) hwt.forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#hydWeekTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');drawHydWeek();}));
function downloadReport(){const blob=new Blob(['Hydration Report\nCups today: '+cups],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hydration_report.txt';a.click();showToast('Report downloaded','success');}

/* ============== GADGET TIME ============== */
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
function incStretch(){if(stretchCount<6){stretchCount++;document.getElementById('stretchCount').textContent=stretchCount;showToast('Peregangan dicatat','success');}}
function startStretchSession(){
  openModal('stretchModal');
  let s=5*60;
  document.getElementById('stretchSessionTime').textContent='05:00';
  clearInterval(window._stretchSession);
  window._stretchSession=setInterval(()=>{
    s--;if(s<=0){clearInterval(window._stretchSession);closeModal('stretchModal');showToast('Sesi peregangan selesai!','success');return;}
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
  const sac = document.getElementById('sleepArchChart');
  if(sac) sac.innerHTML=svg;
}
function toggleTrendLine(){drawSleepArch();}
document.querySelectorAll('#sleepRangeTabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#sleepRangeTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');drawSleepArch();showToast('Range: '+b.textContent,'info');}));
document.querySelectorAll('#morningMoods button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#morningMoods button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');document.getElementById('morningMoodMsg').textContent='Mood logged: '+b.dataset.mm;moodHistory.push(b.dataset.mm);}));
function openScheduleModal(){openModal('scheduleModal');}
let medPlaying=false,medT=0,medInt=null;
function startMeditationPlayer(){document.getElementById('medPlayer').classList.remove('hidden');if(medInt)clearInterval(medInt);medPlaying=true;medT=0;document.getElementById('medPlayIcon').textContent='pause';medInt=setInterval(medTick,1000);}
function toggleMedPlay(){medPlaying=!medPlaying;document.getElementById('medPlayIcon').textContent=medPlaying?'pause':'play_arrow';}
function medTick(){if(!medPlaying)return;medT++;if(medT>=600){clearInterval(medInt);medPlaying=false;document.getElementById('medPlayIcon').textContent='play_arrow';showToast('Meditation complete','success');return;}document.getElementById('medProg').style.width=(medT/600*100)+'%';document.getElementById('medTime').textContent=Math.floor(medT/60)+':'+String(medT%60).padStart(2,'0');}

/* ============== BREATHING ============== */
let breathTimings={Inhale:4,Hold1:2,Exhale:4,Hold2:2};
let breathRunning=false,breathPhaseIdx=0,breathTimer=null,sessionN=1,streak=5,roundCount=0;
const PHASES=[{n:'INHALE',k:'Inhale',inst:s=>`Inhale for ${s} seconds`,size:220,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},{n:'HOLD',k:'Hold1',inst:s=>`Hold for ${s} seconds`,size:220,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},{n:'EXHALE',k:'Exhale',inst:s=>`Exhale for ${s} seconds`,size:160,bg:'radial-gradient(circle,#5a9bd5,#106399)'},{n:'HOLD',k:'Hold2',inst:s=>`Hold for ${s} seconds`,size:160,bg:'radial-gradient(circle,#5a9bd5,#106399)'}];
function runBreathPhase(){
  if(!breathRunning)return;
  const p=PHASES[breathPhaseIdx],dur=breathTimings[p.k];
  const bp = document.getElementById('breathPhase');
  if(bp) bp.textContent=p.n;
  const bi = document.getElementById('breathInstruction');
  if(bi) bi.textContent=p.inst(dur);
  const c=document.getElementById('breathCircle');
  if(c){
    c.style.transition=`all ${dur}s ease-in-out`;
    c.style.width=p.size+'px';c.style.height=p.size+'px';c.style.background=p.bg;
  }
  breathTimer=setTimeout(()=>{
    breathPhaseIdx=(breathPhaseIdx+1)%4;
    if(breathPhaseIdx===0){roundCount++;showToast('Round complete! <i class="fa-solid fa-award"></i>','success');if(roundCount>=1){sessionN=Math.min(5,sessionN+1);document.getElementById('sessionNum').textContent=sessionN;streak++;document.getElementById('streakCount').textContent=streak;}}
    runBreathPhase();
  },dur*1000);
}
function toggleBreath(){
  breathRunning=!breathRunning;
  document.getElementById('breathBtn').textContent=breathRunning?'Pause Session':'Resume Session';
  if(breathRunning)runBreathPhase();else clearTimeout(breathTimer);
}
function openBreathCustomize(){
  const c=document.getElementById('phaseControls');
  if(!c) return;
  c.innerHTML='';
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
  const wmc = document.getElementById('weeklyMoodChart');
  if(wmc) wmc.innerHTML=svg;
}
let feelHistory=[];
document.querySelectorAll('#feelChips button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#feelChips button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');document.getElementById('feelMsg').textContent='Feeling logged ✓ — '+b.dataset.feel;feelHistory.push(b.dataset.feel);document.getElementById('feelTimeline').innerHTML=feelHistory.map(()=>'<span class="w-2 h-2 rounded-full bg-primary"></span>').join('');}));

/* ============== SAFETY ============== */
function submitReport(e){e.preventDefault();e.target.reset();showToast('Report submitted anonymously','success');}

/* ============== REPORTS ============== */
const REPORTS_ALL=[];
const TYPES=['Bullying','Cyberbullying','Physical Threat','Other'];const LOCS=['East Corridor','Cafeteria','Gym','Library','Lab 2','Schoolyard','Bus Stop'];const STATUS=['Open','Resolved','Pending'];
for(let i=1;i<=24;i++)REPORTS_ALL.push({id:'R-'+String(1000+i),date:`2024-06-${String((i%28)+1).padStart(2,'0')}`,type:TYPES[i%4],loc:LOCS[i%LOCS.length],status:STATUS[i%3]});
let reportPage=1;
function renderReports(){
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
  const c=document.getElementById('notifList');if(!c)return;c.innerHTML='';
  Object.entries(notifSettings).forEach(([k,v])=>{
    const row=document.createElement('div');row.className='flex items-center justify-between';
    row.innerHTML=`<span class="text-sm">${k}</span><div class="toggle ${v?'on':''}"></div>`;
    row.querySelector('.toggle').addEventListener('click',e=>{notifSettings[k]=!notifSettings[k];e.target.classList.toggle('on');showToast(k+': '+(notifSettings[k]?'ON':'OFF'),'info');});
    c.appendChild(row);
  });
}
let moodHistory=[];
function downloadData(){const blob=new Blob([JSON.stringify({profile:{name:'Alex Johnson',grade:'11-A'},cups,moodHistory,feelHistory,notifSettings},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='my_data.json';a.click();showToast('Data downloaded','success');}
function clearMoodHistory(){document.getElementById('confirmTitle').textContent='Clear mood history?';document.getElementById('confirmMsg').textContent='This cannot be undone.';document.getElementById('confirmOk').onclick=()=>{moodHistory=[];feelHistory=[];closeModal('confirmModal');showToast('Mood history cleared','success');};openModal('confirmModal');}

const I18N={en:{brand:'SafeSchoolHub',dashTitle:'Student Wellness',settings:'Settings'},id:{brand:'SafeSchoolHub',dashTitle:'Kesejahteraan Siswa',settings:'Pengaturan'}};
function setLang(l){
  LangSystem.setLang(l);
  showToast(l==='id'?'Bahasa: Indonesia':'Language: English','info');
}

/* ============== INIT ============== */
renderHyd();
initPage();
if(CURRENT_ROUTE==='gadget-time'){
  renderScreenTimeChart();
  updateDeviceInputLabels();
  setInterval(()=>{
    renderScreenTimeChart();
    updateDeviceInputLabels();
  },10000);
}
