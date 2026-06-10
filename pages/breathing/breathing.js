/* ===== TOAST ===== */
function showToast(msg,type='info'){
  const c=document.getElementById('toast');
  const t=document.createElement('div');
  t.className='toast-item '+type;
  t.innerHTML='<span class="material-symbols-outlined" style="font-size:18px">'+(type==='success'?'check_circle':type==='error'?'error':'info')+'</span>'+msg;
  c.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},3000);
}
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));});
document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');}));

function openCheckin(){openModal('checkinModal');}
let checkinMood=null;
document.querySelectorAll('#checkinMoods button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#checkinMoods button').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');checkinMood=b.dataset.cmood;
}));
function submitCheckin(){closeModal('checkinModal');showToast('Laporan dikirim'+(checkinMood?': '+checkinMood:''),'success');document.getElementById('checkinNote').value='';}

document.getElementById('sidebar-logout').addEventListener('click',()=>{
  document.getElementById('confirmTitle').textContent='Keluar?';
  document.getElementById('confirmMsg').textContent='Apakah Anda yakin ingin keluar dari SafeSchool?';
  document.getElementById('confirmOk').onclick=()=>{closeModal('confirmModal');location.href='../index.html';};
  openModal('confirmModal');
});

/* ===== BREATHING ===== */
let breathTimings={Inhale:4,Hold1:2,Exhale:4,Hold2:2};
let breathRunning=false,breathPhaseIdx=0,breathTimer=null,sessionN=1,streak=5,roundCount=0;
const PHASES=[
  {n:'TARIK NAPAS',k:'Inhale',inst:s=>`Tarik napas selama ${s} detik`,size:170,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},
  {n:'TAHAN NAPAS',k:'Hold1',inst:s=>`Tahan selama ${s} detik`,size:170,bg:'radial-gradient(circle,#a5d8ff,#5a9bd5)'},
  {n:'HEMBUSKAN',k:'Exhale',inst:s=>`Hembuskan napas selama ${s} detik`,size:110,bg:'radial-gradient(circle,#5a9bd5,#106399)'},
  {n:'TAHAN NAPAS',k:'Hold2',inst:s=>`Tahan selama ${s} detik`,size:110,bg:'radial-gradient(circle,#5a9bd5,#106399)'}
];
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
    if(breathPhaseIdx===0){roundCount++;showToast('Putaran selesai! <i class="fa-solid fa-award"></i>','success');if(roundCount>=1){sessionN=Math.min(5,sessionN+1);document.getElementById('sessionCounter').textContent=sessionN;streak++;document.getElementById('streakCount').textContent=streak;}}
    runBreathPhase();
  },dur*1000);
}
function toggleBreath(){
  breathRunning=!breathRunning;
  document.getElementById('breathBtn').textContent=breathRunning?'Jeda Sesi':'Lanjutkan Sesi';
  if(breathRunning)runBreathPhase();else clearTimeout(breathTimer);
}
function openBreathCustomize(){
  const c=document.getElementById('phaseControls');c.innerHTML='';
  ['Inhale','Hold1','Exhale','Hold2'].forEach(k=>{
    const labelIndo = k === 'Inhale' ? 'Tarik Napas' : k === 'Hold1' ? 'Tahan Napas (1)' : k === 'Exhale' ? 'Hembuskan' : 'Tahan Napas (2)';
    const row=document.createElement('div');row.className='flex items-center justify-between gap-2';
    row.innerHTML=`<span class="font-semibold text-sm">${labelIndo}</span><div class="flex items-center gap-2"><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',-1)">−</button><span id="ph-${k}" class="font-bold w-8 text-center">${breathTimings[k]}detik</span><button class="btn-ghost text-sm px-3" onclick="changePhase('${k}',1)">+</button></div>`;
    c.appendChild(row);
  });
  openModal('breathCustomize');
}
function changePhase(k,d){breathTimings[k]=Math.max(1,Math.min(10,breathTimings[k]+d));document.getElementById('ph-'+k).textContent=breathTimings[k]+'detik';}
function startRoutine(min){if(!breathRunning){toggleBreath();}showToast('Rutinitas dimulai — '+min+' menit','info');}

/* ===== WEEKLY MOOD ===== */
const weeklyMoodData=[
  {day:'S',score:3,minutes:5,summary:'Napas ringan setelah pulang sekolah.'},
  {day:'S',score:4,minutes:7,summary:'Ketenangan pagi sebelum mulai kelas.'},
  {day:'R',score:3,minutes:6,summary:'Pernapasan siang hari untuk meredakan ketegangan.'},
  {day:'K',score:5,minutes:8,summary:'Sesi fokus sebelum melaksanakan ujian.'},
  {day:'J',score:4,minutes:6,summary:'Kembali rileks setelah hari yang sibuk.'},
  {day:'S',score:6,minutes:10,summary:'Napas peregangan di akhir pekan.'},
  {day:'M',score:7,minutes:12,summary:'Relaksasi di malam hari.'}
];
function drawWeeklyMood(){
  const maxM=Math.max(...weeklyMoodData.map(d=>d.minutes),1);
  let svg='';
  weeklyMoodData.forEach((d,i)=>{
    const x=15+i*42,h=Math.round(d.minutes/maxM*80),y=100-h;
    const fill=d.score>=6?'#ffffff':d.score>=4?'#93c5fd':'#5a9bd5';
    svg+=`<g onclick="selectWeeklyMood(${i})" style="cursor:pointer" id="wbar-${i}">
      <rect x="${x}" y="${y}" width="26" height="${h}" rx="6" fill="${fill}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <text x="${x+13}" y="118" text-anchor="middle" font-size="10" fill="#fff">${d.day}</text>
    </g>`;
  });
  document.getElementById('weeklyMoodChart').innerHTML=svg;
  selectWeeklyMood(6);
}
function selectWeeklyMood(idx){
  const d=weeklyMoodData[idx];if(!d)return;
  document.getElementById('weeklyMoodDetails').innerHTML=`<span class="font-semibold">${d.day}</span> — ${d.minutes} menit · Suasana Hati ${d.score}/7 · ${d.summary}`;
  document.querySelectorAll('#weeklyMoodChart rect').forEach((r,i)=>{r.setAttribute('stroke-width',i===idx?2.5:1);r.setAttribute('stroke',i===idx?'#fff':'rgba(255,255,255,0.3)');});
}

drawWeeklyMood();
