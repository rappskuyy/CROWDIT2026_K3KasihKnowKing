/* ===== STATE ===== */
const TARGET = 8;
const ML_PER_CUP = 250;

/* ===== LOCALSTORAGE PERSISTENCE ===== */
function getTodayKey() {
  const d = new Date();
  return `hyd_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function saveState() {
  const today = getTodayKey();
  const data = {
    cups: cups,
    logTimes: logTimes.map(t => t.toISOString()),
    date: today
  };
  localStorage.setItem('hydration_today', JSON.stringify(data));
}

function loadState() {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem('hydration_today');
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.date !== today) {
      savePreviousDayToHistory(data);
      localStorage.removeItem('hydration_today');
      return 0;
    }
    if (Array.isArray(data.logTimes)) {
      data.logTimes.forEach(t => logTimes.push(new Date(t)));
    }
    return data.cups || 0;
  } catch(e) { return 0; }
}

function savePreviousDayToHistory(data) {
  try {
    const prev = JSON.parse(localStorage.getItem('hydration_history') || '{}');
    prev[data.date] = data.cups;
    localStorage.setItem('hydration_history', JSON.stringify(prev));
  } catch(e) {}
}

function getHistoryCups(dateKey) {
  try {
    const prev = JSON.parse(localStorage.getItem('hydration_history') || '{}');
    return prev[dateKey] !== undefined ? prev[dateKey] : null;
  } catch(e) { return null; }
}

function getDayKey(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `hyd_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

let cups = 0;
const logTimes = [];
cups = loadState();

/* ===== CUP GRID BUILD ===== */
function buildGrid(){
  const input = document.getElementById('cupInput');
  if(input) input.value = cups;
}

function buildCupSVG(filled, idx){
  const waterH = filled ? 28 : 0;
  const waterY = filled ? 16 : 44;
  const glassColor = filled ? '#dce9ff' : '#f0f4ff';
  const strokeColor = filled ? '#5a9bd5' : '#c1c7d1';

  const wavePath = filled
    ? `<path class="wave-path" style="animation-delay:${idx*0.18}s" d="M1,4 Q10,0 20,4 Q30,8 40,4 L40,32 L0,32 Z" fill="#5a9bd5" opacity="0.35" clip-path="url(#cc${idx})"/>`
    : '';

  return `
    <defs>
      <clipPath id="cc${idx}"><path d="M2,0 L38,0 L34,44 L6,44 Z"/></clipPath>
      <linearGradient id="wg${idx}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#5a9bd5"/>
        <stop offset="100%" stop-color="#106399"/>
      </linearGradient>
    </defs>
    <path d="M2,0 L38,0 L34,44 L6,44 Z" fill="${glassColor}" stroke="${strokeColor}" stroke-width="1.5" stroke-linejoin="round"/>
    <rect class="water-fill" x="1" y="${waterY}" width="38" height="${waterH}" fill="url(#wg${idx})" clip-path="url(#cc${idx})"/>
    ${wavePath}
    <path d="M34,10 Q44,10 44,20 Q44,30 34,30" fill="none" stroke="${strokeColor}" stroke-width="1.5" stroke-linecap="round"/>
    ${filled ? '<line x1="9" y1="4" x2="9" y2="34" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>' : ''}
    <circle cx="20" cy="22" r="8" fill="${filled?'rgba(255,255,255,0.25)':'rgba(16,99,153,0.07)'}"/>
    <text x="20" y="26" text-anchor="middle" font-size="7" font-weight="700" fill="${filled?'#fff':'#717880'}" font-family="Plus Jakarta Sans,sans-serif">${idx+1}</text>
  `;
}

function tapCup(idx){
  if(idx < cups){
    changeCup(-1, true);
  } else if(idx === cups){
    changeCup(1, true);
  } else {
    const toAdd = idx + 1 - cups;
    for(let i=0;i<toAdd;i++) changeCup(1, i===toAdd-1);
  }
}

function changeCup(delta, silent=false){
  const prev = cups;
  cups = Math.max(0, Math.min(TARGET, cups + delta));
  if(cups === prev) return;

  if(delta > 0){
    logTimes.push(new Date());
    updateTimeLogged();
  } else {
    logTimes.pop();
  }

  saveState();
  renderHyd(delta);
  if(!silent) showToast(delta > 0 ? '<i class="fa-solid fa-droplet"></i> Cup added!' : 'Cup removed', delta > 0 ? 'success' : 'info');
}

function setCupsFromInput(){
  const input = document.getElementById('cupInput');
  if(!input) return;
  let value = parseInt(input.value, 10);
  if(Number.isNaN(value)) value = cups;
  value = Math.max(0, Math.min(TARGET, value));
  const prev = cups;
  cups = value;
  if(cups > prev){
    for(let i=0;i<cups-prev;i++) logTimes.push(new Date());
    updateTimeLogged();
  } else if(cups < prev){
    logTimes.splice(cups);
  }
  saveState();
  renderHyd(0);
  showToast('Hydration count updated','success');
}

function renderHyd(delta=1){
  const pct = cups / TARGET;
  const pctRound = Math.round(pct * 100);
  const ml = cups * ML_PER_CUP;
  const remain = (TARGET * ML_PER_CUP) - ml;

  document.getElementById('cupCountBig').textContent = cups;
  document.getElementById('mlCount').textContent = ml > 0 ? `${ml} ml` : '0 ml';
  document.getElementById('mlRemain').textContent = `${remain} ml`;
  document.getElementById('progressLabel').textContent = pctRound + '%';
  document.getElementById('cupBar').style.width = pctRound + '%';

  animateBottle(pct);
  document.getElementById('bottlePctLabel').textContent = pctRound + '%';

  const badge = document.getElementById('goalBadge');
  if(cups >= TARGET){
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    if(!badge.dataset.fired){
      badge.dataset.fired = '1';
      triggerConfetti();
      showToast('<i class="fa-solid fa-award"></i> Daily goal reached! Amazing!', 'success');
    }
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
    delete badge.dataset.fired;
  }

  updateStatus();

  const activeTab = document.querySelector('#hydWeekTabs button.active');
  if(activeTab && activeTab.dataset.w === 'current') drawHydWeek('current');

  buildGrid();
  if(delta > 0) rippleBottle();
}

function animateBottle(pct){
  const totalH = 136;
  const fillH = totalH * pct;
  const fillY = 144 - fillH;

  const fillEl = document.getElementById('bigWaterFill');
  fillEl.style.transition = 'height 0.6s cubic-bezier(.34,1.4,.64,1), y 0.6s cubic-bezier(.34,1.4,.64,1)';
  fillEl.setAttribute('y', fillY);
  fillEl.setAttribute('height', fillH);

  const wp = document.getElementById('bigWavePath');
  wp.setAttribute('d', `M15,${fillY} Q45,${fillY-4} 75,${fillY} L75,${144} L15,${144} Z`);
  wp.style.transition = 'd 0.6s ease';
}

function rippleBottle(){
  const g = document.getElementById('rippleGroup');
  const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
  circle.setAttribute('cx','45');
  circle.setAttribute('cy','90');
  circle.setAttribute('r','0');
  circle.setAttribute('fill','none');
  circle.setAttribute('stroke','#5a9bd5');
  circle.setAttribute('stroke-width','2');
  circle.setAttribute('opacity','0.6');
  circle.classList.add('ripple-circle');
  g.appendChild(circle);
  setTimeout(()=>circle.remove(), 800);
}

function triggerConfetti(){
  const btn = document.querySelector('.btn-primary');
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const colors = ['#5a9bd5','#106399','#a5f4bb','#1c6c3f','#fbbf24','#f87171'];
  for(let i=0;i<18;i++){
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    const angle = (i/18)*360*Math.PI/180;
    const dist = 60 + Math.random()*60;
    dot.style.setProperty('--tx', Math.cos(angle)*dist+'px');
    dot.style.setProperty('--ty', Math.sin(angle)*dist+'px');
    dot.style.left = cx+'px';
    dot.style.top = cy+'px';
    dot.style.position = 'fixed';
    dot.style.background = colors[i%colors.length];
    dot.style.zIndex = 9998;
    dot.style.animationDelay = (Math.random()*0.2)+'s';
    document.body.appendChild(dot);
    setTimeout(()=>dot.remove(), 1200);
  }
}

function updateStatus(){
  const badge = document.getElementById('statusBadge');
  const msg = document.getElementById('hydMsg');
  let icon, text, statusMsg, cls;

  if(cups === 0){
    icon='water_drop'; text='Start hydrating!'; cls='text-on-surface-variant';
    statusMsg='Drink your first cup of water to begin your hydration journey today.';
  } else if(cups < 3){
    icon='priority_high'; text='Low hydration'; cls='text-error';
    statusMsg=`You've had ${cups} cup${cups>1?'s':''}. Your brain needs water to focus — keep going!`;
  } else if(cups < 6){
    icon='water_drop'; text='Getting there'; cls='text-on-surface-variant';
    statusMsg=`${cups} cups done — great start! Just ${TARGET-cups} more to reach your optimal energy levels.`;
  } else if(cups < TARGET){
    icon='check_circle'; text='Almost there!'; cls='text-secondary';
    statusMsg=`You're doing great! Just ${TARGET-cups} more cup${TARGET-cups>1?'s':''} to reach your goal. Keep it up!`;
  } else {
    icon='emoji_events'; text='Goal reached! <i class="fa-solid fa-trophy"></i>'; cls='text-secondary';
    statusMsg='Incredible! You\'ve hit your daily hydration goal. Your focus and energy are at their peak!';
  }

  badge.className = `font-bold flex items-center gap-1 ${cls}`;
  badge.innerHTML = `<span class="material-symbols-outlined icon-fill" style="font-size:18px">${icon}</span><span>${text}</span>`;
  msg.textContent = statusMsg;
}

function updateTimeLogged(){
  const el = document.getElementById('timeLogged');
  if(logTimes.length === 0){ el.textContent=''; return; }
  const last = logTimes[logTimes.length-1];
  const h = last.getHours().toString().padStart(2,'0');
  const m = last.getMinutes().toString().padStart(2,'0');
  el.textContent = `Last: ${h}:${m}`;
}

function resetCups(){
  cups = 0;
  logTimes.length = 0;
  saveState();
  document.getElementById('timeLogged').textContent = '';
  renderHyd(0);
  drawHydWeek('current');
  showToast('Reset to 0 cups', 'info');
}

const FACTS=[
  'Just a 2% drop in hydration can cause significant fatigue and reduced alertness.',
  'Your brain is ~75% water — staying hydrated improves memory and mood.',
  'Drinking water before meals can improve digestion and energy.',
  'Students who drink water regularly perform better on cognitive tests.',
  'Cold water is absorbed faster — great for post-PE hydration!'
];
let factIdx=0;
function cycleFact(){
  factIdx=(factIdx+1)%FACTS.length;
  const el=document.getElementById('factText');
  el.style.opacity='0';
  setTimeout(()=>{el.textContent=FACTS[factIdx];el.style.opacity='1';el.style.transition='opacity .3s';},150);
}

function toggleAccordion(id){
  const el=document.getElementById(id);
  el.classList.toggle('open');
}

function getWeekData(isCurrentWeek) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const data = [];
  const today = new Date();
  const todayDayOfWeek = today.getDay();

  for (let i = 0; i < 7; i++) {
    let daysAgo;
    if (isCurrentWeek) {
      daysAgo = todayDayOfWeek - i;
    } else {
      daysAgo = todayDayOfWeek - i + 7;
    }
    const key = getDayKey(daysAgo);
    if (!isCurrentWeek) {
      const v = getHistoryCups(key);
      data.push(v !== null ? v : 0);
    } else {
      if (daysAgo === 0) {
        data.push(cups);
      } else if (daysAgo < 0) {
        data.push(0);
      } else {
        const v = getHistoryCups(key);
        data.push(v !== null ? v : 0);
      }
    }
  }
  return data;
}

function drawHydWeek(key='current'){
  const isCurrentWeek = key === 'current';
  const data = getWeekData(isCurrentWeek);
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let svg='';
  data.forEach((v,i)=>{
    const x=14+i*43,h=v*13,y=120-h;
    const isToday=i===new Date().getDay()&&key==='current';
    const color=isToday?'var(--primary)':'var(--surface-container-high)';
    const textColor=isToday?'var(--primary)':'var(--on-surface-variant)';
    svg+=`<rect x="${x}" y="${y}" width="28" height="${h}" rx="6" fill="${color}"><title>${days[i]}: ${v} cups</title></rect>`;
    svg+=`<text x="${x+14}" y="136" text-anchor="middle" font-size="9.5" fill="${textColor}" font-weight="${isToday?'700':'500'}">${days[i]}</text>`;
    svg+=`<text x="${x+14}" y="${y-4}" text-anchor="middle" font-size="9" fill="${textColor}" font-weight="600">${v}</text>`;
  });
  const goalY=120-8*13;
  svg+=`<line x1="10" y1="${goalY}" x2="314" y2="${goalY}" stroke="var(--primary-container)" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>`;
  svg+=`<text x="308" y="${goalY-3}" text-anchor="end" font-size="8" fill="var(--primary-container)" font-weight="600">goal</text>`;
  document.getElementById('hydWeekChart').innerHTML=svg;
}
document.querySelectorAll('#hydWeekTabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#hydWeekTabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  drawHydWeek(b.dataset.w);
}));

function downloadReport(){
  const blob=new Blob([`Hydration Report\nDate: ${new Date().toLocaleDateString()}\nCups today: ${cups}/${TARGET}\nVolume: ${cups*ML_PER_CUP}ml / ${TARGET*ML_PER_CUP}ml`],{type:'text/plain'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='hydration_report.txt';a.click();
  showToast('Report downloaded','success');
}

function updateNextReminder(){
  const now=new Date();
  const times=['08:00','10:45','12:30','14:00','15:45','17:30'];
  const labels=['Morning Hydration','Recess Break Hydration','Lunch Hydration','Afternoon Hydration','After PE Hydration','Evening Hydration'];
  for(let i=0;i<times.length;i++){
    const [h,m]=times[i].split(':').map(Number);
    const t=new Date();t.setHours(h,m,0,0);
    if(t>now){
      document.getElementById('nextReminder').textContent=times[i].replace(':',':')+' '+(h<12?'AM':'PM');
      document.querySelector('#nextReminder+div').textContent=labels[i];
      return;
    }
  }
  document.getElementById('nextReminder').textContent='Tomorrow';
  document.querySelector('#nextReminder+div').textContent='Morning Hydration';
}

/* ===== INIT ===== */
buildGrid();
renderHyd(0);
drawHydWeek('current');
updateNextReminder();
if(logTimes.length > 0) updateTimeLogged();



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
