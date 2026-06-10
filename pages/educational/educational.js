/* ===== TOAST ===== */
function showToast(msg,type='info'){
  const c=document.getElementById('toast');
  if(!c) return;
  const t=document.createElement('div');t.className='toast-item '+type;
  t.innerHTML='<span class="material-symbols-outlined" style="font-size:18px">'+(type==='success'?'check_circle':type==='error'?'error':'info')+'</span>'+msg;
  c.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},3200);
}

/* ===== XP ===== */
function loadXP(){try{return parseInt(localStorage.getItem('edu_xp')||'320',10);}catch(e){return 320;}}
function saveXP(v){try{localStorage.setItem('edu_xp',String(v));}catch(e){}}
let xp=loadXP();
function addXP(n){xp+=n;saveXP(xp);const el=document.getElementById('xpDisplay');if(el)el.textContent=xp+' XP';const sEl=document.getElementById('sidebarXP');if(sEl)sEl.textContent=xp+' XP';showToast('+'+n+' XP diperoleh! Total: '+xp+' XP','success');}
document.addEventListener('DOMContentLoaded',()=>{const el=document.getElementById('xpDisplay');if(el)el.textContent=xp+' XP';});

/* ===== CERTIFICATES ===== */
let earnedCerts=[];
try{earnedCerts=JSON.parse(localStorage.getItem('edu_certs')||'[]');}catch(e){}
function updateCertCount(){
  const cc = document.getElementById('certCount');
  if(cc) cc.textContent=earnedCerts.length+' / '+(VIDEOS.length+1);
}

function showCertificate(video){
  const already=earnedCerts.find(c=>c.id===video.id);
  if(already){showToast('Kamu sudah punya sertifikat untuk video ini!','info');return;}
  // Save certificate
  const certData={id:video.id,title:video.title,author:video.author,duration:video.duration,date:new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}),certId:'SSH-'+Date.now()};
  earnedCerts.push(certData);
  try{localStorage.setItem('edu_certs',JSON.stringify(earnedCerts));}catch(e){}
  updateCertCount();
  // Show overlay
  document.getElementById('certVideoTitle').textContent=certData.title;
  document.getElementById('certVideoMeta').textContent=certData.author+' · '+certData.duration;
  document.getElementById('certDate').textContent=certData.date;
  document.getElementById('certId').textContent=certData.certId;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentName = localStorage.getItem('profileName') || user.name || 'Alex Johnson';
  const currentGrade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
  const nameEl = document.getElementById('certStudentName'); if (nameEl) nameEl.textContent = currentName;
  const gradeEl = document.getElementById('certStudentGrade'); if (gradeEl) gradeEl.textContent = currentGrade + ' · SafeSchoolHub';
  document.getElementById('certificateOverlay').classList.add('open');
  addXP(50);
}
function closeCertificate(){document.getElementById('certificateOverlay').classList.remove('open');}
function downloadCertificate(){
  const certId = document.getElementById('certId').textContent;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentName = localStorage.getItem('profileName') || user.name || 'Alex Johnson';
  const currentGrade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
  const title = document.getElementById('certVideoTitle').textContent;
  const metaText = document.getElementById('certVideoMeta').textContent;
  const author = metaText.split(' · ')[0] || 'SafeSchoolHub';
  const date = document.getElementById('certDate').textContent;
  
  // Buat kontainer sertifikat asli secara dinamis
  const certContainer = document.createElement('div');
  certContainer.style.position = 'absolute';
  certContainer.style.left = '-9999px';
  certContainer.style.top = '-9999px';
  certContainer.style.width = '842px'; // A5 Landscape ratio (1.414) -> 842px x 595px
  certContainer.style.height = '595px';
  certContainer.style.boxSizing = 'border-box';
  certContainer.style.padding = '50px';
  certContainer.style.backgroundColor = '#ffffff';
  certContainer.style.border = '16px double #106399';
  certContainer.style.fontFamily = "'Plus Jakarta Sans', system-ui, sans-serif";
  certContainer.style.color = '#0b1c30';
  certContainer.style.display = 'flex';
  certContainer.style.flexDirection = 'column';
  certContainer.style.justifyContent = 'space-between';
  certContainer.style.alignItems = 'center';

  certContainer.innerHTML = `
    <!-- Bagian Atas / Header Sertifikat -->
    <div style="text-align: center; width: 100%;">
      <div style="font-size: 11px; letter-spacing: 5px; color: #106399; font-weight: 800; margin-bottom: 6px; text-transform: uppercase;">
        SafeSchoolHub Student Wellness Academy
      </div>
      <div style="width: 120px; height: 3px; background-color: #106399; margin: 0 auto 16px;"></div>
      <h1 style="font-family: Georgia, serif; font-size: 34px; font-weight: bold; color: #003151; margin: 0; letter-spacing: 1.5px; text-transform: uppercase;">
        Sertifikat Kelulusan
      </h1>
      <div style="font-family: Georgia, serif; font-style: italic; font-size: 15px; color: #717880; margin-top: 4px;">
        Certificate of Completion
      </div>
    </div>

    <!-- Bagian Tengah / Penerima Sertifikat -->
    <div style="text-align: center; width: 100%;">
      <p style="font-size: 13px; color: #41474f; margin: 0; font-style: italic;">
        Dengan bangga diberikan kepada siswa:
      </p>
      <h2 style="font-family: Georgia, serif; font-size: 30px; font-weight: 800; color: #106399; margin: 12px 0; border-bottom: 2px solid #bae6fd; display: inline-block; padding-bottom: 6px; min-width: 380px;">
        ${currentName}
      </h2>
      <p style="font-size: 13px; color: #41474f; margin: 0; font-weight: 600;">
        Kelas / Grade: ${currentGrade}
      </p>
    </div>

    <!-- Bagian Keterangan / Deskripsi Kelulusan -->
    <div style="text-align: center; max-width: 650px; width: 100%;">
      <p style="font-size: 13px; line-height: 1.6; color: #41474f; margin: 0;">
        Telah berhasil menyelesaikan dan memahami materi edukasi kesehatan mental dengan topik:
      </p>
      <p style="font-size: 17px; font-weight: 800; color: #0b1c30; margin: 10px 0; font-style: italic;">
        "${title}"
      </p>
      <p style="font-size: 11px; color: #717880; margin: 0; line-height: 1.5;">
        Sebagai wujud partisipasi aktif dalam membangun kesadaran kesehatan mental, empati, dan kesejahteraan diri di lingkungan sekolah digital.
      </p>
    </div>

    <!-- Tanda Tangan & Seal -->
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px; box-sizing: border-box;">
      <!-- Tanda Tangan Kiri (BK / Konselor) -->
      <div style="text-align: center; width: 200px;">
        <div style="font-family: 'Courier New', monospace; font-size: 15px; color: #106399; font-style: italic; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">
          SafeSchoolHub BK
        </div>
        <div style="border-top: 1px solid #717880; margin-top: 4px; padding-top: 4px;">
          <div style="font-size: 12px; font-weight: bold; color: #0b1c30;">Tim Pembimbing BK</div>
          <div style="font-size: 10px; color: #717880;">Konselor SafeSchoolHub</div>
        </div>
      </div>

      <!-- Seal Emas Tengah (Menggunakan SVG langsung agar rendering stabil) -->
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background-color: #fef3c7; border: 3px double #d97706; display: flex; align-items: center; justify-content: center;">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="9" r="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
            <path d="M9 14.5L7 21L12 19L17 21L15 14.5" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6L13.5 9L16.5 9.5L14.25 11.5L15 14.5L12 13L9 14.5L9.75 11.5L7.5 9.5L10.5 9L12 6Z" fill="#d97706"/>
          </svg>
        </div>
        <div style="font-size: 9px; font-weight: bold; color: #d97706; margin-top: 6px; letter-spacing: 1px; font-family: monospace;">
          SSH-SECURED
        </div>
      </div>

      <!-- Tanda Tangan Kanan (Narasumber / Instansi) -->
      <div style="text-align: center; width: 200px;">
        <div style="font-family: 'Courier New', monospace; font-size: 15px; color: #106399; font-style: italic; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">
          ${author}
        </div>
        <div style="border-top: 1px solid #717880; margin-top: 4px; padding-top: 4px;">
          <div style="font-size: 12px; font-weight: bold; color: #0b1c30;">Narasumber Materi</div>
          <div style="font-size: 10px; color: #717880;">Penyedia Konten Edukasi</div>
        </div>
      </div>
    </div>

    <!-- Informasi Tambahan di Kaki Sertifikat -->
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #717880; margin-top: 10px; border-top: 1px solid #f1f5f9; padding-top: 8px; box-sizing: border-box;">
      <div>TANGGAL TERBIT: ${date}</div>
      <div style="font-weight: bold; font-family: monospace;">ID SERTIFIKAT: ${certId}</div>
    </div>
  `;

  document.body.appendChild(certContainer);
  
  const opt = {
    margin:       0,
    filename:     'Sertifikat_' + certId + '.pdf',
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { scale: 2.5, useCORS: true, logging: false },
    jsPDF:        { unit: 'px', format: [842, 595], hotfixes: ['px_scaling'] }
  };
  
  html2pdf().set(opt).from(certContainer).save().then(() => {
    document.body.removeChild(certContainer);
  }).catch(err => {
    console.error(err);
    if (certContainer.parentNode) {
      document.body.removeChild(certContainer);
    }
  });
  
  showToast('Sertifikat berhasil diunduh!','success');
}
const co = document.getElementById('certificateOverlay');
if(co) co.addEventListener('click',e=>{if(e.target===document.getElementById('certificateOverlay'))closeCertificate();});

/* ===== TABS ===== */
function switchTab(tab){
  document.querySelectorAll('.tab-section').forEach(s=>s.classList.add('hidden'));
  document.querySelectorAll('.section-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const el = document.getElementById('tab-'+tab);
  if(el) el.classList.remove('hidden');
  if(tab==='videos')renderVideos();
  if(tab==='articles')renderArticles();
  if(tab==='seminars'){renderSeminars();prefillMhdaForm();}
}

/* ===== VIDEO DATA (6 YouTube videos provided + featured) ===== */
const VIDEOS=[
  {id:'v1',title:'Pentingnya Tidur Cukup bagi Remaja',author:'dr. Tirta Mandira Hudhi',duration:'18 min',durationSec:18*60,views:'45K',category:'health',ytId:'_50igeHW7vw',ytUrl:'https://youtu.be/_50igeHW7vw?si=F6iqiDJh5MjJCZJh',certEligible:true,xp:30},
  {id:'v2',title:'Meditasi dan Relaksasi untuk Remaja',author:'Riliv Indonesia',duration:'12 min',durationSec:12*60,views:'38K',category:'wellbeing',ytId:'oqJh0-71q8U',ytUrl:'https://youtu.be/oqJh0-71q8U?si=EJonCrxPvbETuCFL',certEligible:true,xp:30},
  {id:'v3',title:'Pengaruh Makanan untuk Fungsi Otak',author:'Gizi Remaja Indonesia',duration:'14 min',durationSec:14*60,views:'63K',category:'health',ytId:'g_8wTzrKAT8',ytUrl:'https://youtu.be/g_8wTzrKAT8?si=kU5YIvgSbMVQxpt2',certEligible:true,xp:30},
  {id:'v4',title:'Cara Mengelola Screen Time dengan Bijak',author:'Into The Light Indonesia',duration:'10 min',durationSec:10*60,views:'112K',category:'digital',ytId:'t-sKFvNVqCI',ytUrl:'https://youtu.be/t-sKFvNVqCI?si=fgBAV1b9IidXvSIy',certEligible:true,xp:30},
  {id:'v5',title:'Solusi Mengatasi Stres dan Burnout',author:'Yayasan Pulih Indonesia',duration:'22 min',durationSec:22*60,views:'87K',category:'wellbeing',ytId:'_OSuM0ILOCg',ytUrl:'https://youtu.be/_OSuM0ILOCg?si=k7mKC6G-3GcA2wtt',certEligible:true,xp:30},
  {id:'v6',title:'Cara Melindungi Diri dari Cyberbullying',author:'Kemendikbud RI',duration:'8 min',durationSec:8*60,views:'120K',category:'digital',ytId:'KsCKLIx5xQM',ytUrl:'https://www.youtube.com/watch?v=KsCKLIx5xQM',certEligible:true,xp:30},
];
const FEATURED={id:'featured',title:'Kesehatan Mental untuk Remaja',author:'Into The Light Indonesia',duration:'28 min',durationSec:28*60,views:'12.4K',ytId:'rEfNZtltY_M',ytUrl:'https://youtu.be/rEfNZtltY_M?si=LoWvsKEjbWWnrrQw',certEligible:true,xp:50};

let videoFilter='all';
function filterVideos(f){
  videoFilter=f;
  document.querySelectorAll('#videoFilterBtns button').forEach(b=>b.classList.toggle('active',b.dataset.vf===f));
  renderVideos();
}
function renderVideos(){
  const grid=document.getElementById('videoGrid');
  if(!grid) return;
  const filtered=videoFilter==='all'?VIDEOS:VIDEOS.filter(v=>v.category===videoFilter);
  grid.innerHTML=filtered.map(v=>`
    <div class="video-card" onclick="openVideo('${v.id}')">
      <div class="relative">
        <img class="video-thumb-img"
          src="https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg"
          onerror="this.src='https://img.youtube.com/vi/${v.ytId}/default.jpg'"
          alt="${v.title}" loading="lazy"/>
        <div class="play-overlay">
          <div class="play-btn-yt"><span class="material-symbols-outlined icon-fill text-primary" style="font-size:28px">play_arrow</span></div>
        </div>
        <div class="dur-badge">${v.duration}</div>
        ${v.certEligible?`<div class="cert-eligible"><span class="material-symbols-outlined icon-fill" style="font-size:12px">workspace_premium</span>Eligible</div>`:''}
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-1">
          <span class="seminar-badge" style="background: var(--surface-container-high); color: var(--primary); text-transform: capitalize;">${v.category}</span>
        </div>
        <div class="font-bold leading-snug text-sm">${v.title}</div>
        <div class="text-xs text-on-surface-variant mt-1">${v.author} · ${v.duration} · ${v.views} views</div>
        <div class="text-xs font-semibold mt-1 text-primary">+${v.xp} XP${v.certEligible?' + <i class="fa-solid fa-medal"></i> Sertifikat':''}</div>
      </div>
    </div>
  `).join('');
}

function openVideo(id){
  const v=id==='featured'?FEATURED:VIDEOS.find(x=>x.id===id);
  if(!v)return;
  window.open(v.ytUrl,'_blank','noopener,noreferrer');
  showToast('Membuka video di YouTube...','info');
  addXP(v.xp);
  if(v.certEligible){
    setTimeout(()=>{
      const already=earnedCerts.find(c=>c.id===v.id);
      if(!already){
        document.getElementById('confirmTitle').innerHTML='<i class="fa-solid fa-graduation-cap"></i> Sertifikat Tersedia!';
        document.getElementById('confirmMsg').textContent=`Video "${v.title}" berdurasi ${v.duration} (lebih dari 5 menit). Tandai sebagai selesai ditonton untuk mendapatkan sertifikat?`;
        document.getElementById('confirmOk').textContent='Ya, Saya Sudah Menonton!';
        document.getElementById('confirmOk').onclick=()=>{
          document.getElementById('confirmModal').classList.remove('open');
          showCertificate(v);
        };
        document.getElementById('confirmModal').classList.add('open');
      }
    },1500);
  }
}

/* ===== ARTICLES DATA (12 articles) ===== */
const ARTICLES=[
  {id:0,cat:'mental',title:'5 Tanda Kamu Butuh Istirahat dari Gadget — dan Cara Mengatasinya',author:'Tim SafeSchoolHub',date:'5 Jun 2026',readTime:'6 min',views:'8.2K',icon:'devices_off',color:'#ffdad6',iconColor:'#ba1a1a',
    content:`<p>Di era serba digital ini, layar gadget sudah menjadi bagian tak terpisahkan dari kehidupan pelajar. Namun, terlalu banyak screen time bisa berdampak buruk.</p><h3>1. Matamu Sering Terasa Perih atau Lelah</h3><p>Ini adalah tanda paling awal dari digital eye strain. Jika matamu sering merah atau kering setelah menatap layar, saatnya istirahat sejenak.</p><h3>2. Sulit Fokus Saat Belajar</h3><p>Scroll media sosial terus-menerus melatih otakmu untuk beralih perhatian dengan cepat — ini merusak kemampuan konsentrasi jangka panjang.</p><h3>3. Tidurmu Terganggu</h3><p>Cahaya biru dari layar menekan produksi melatonin. Hindari gadget minimal 1 jam sebelum tidur.</p><h3>4. Kamu Jadi Mudah Cemas Tanpa HP</h3><p>FOMO yang berlebihan adalah tanda kecanduan digital. Cobalah "digital detox" selama 1 hari penuh setiap minggu.</p><h3>5. Postur Tubuhmu Buruk</h3><p>Neck strain sangat umum di kalangan pelajar. Pastikan layar sejajar mata dan lakukan peregangan rutin.</p>`},
  {id:1,cat:'safety',title:'Panduan Lengkap Melaporkan Bullying di Sekolah Secara Aman',author:'Into The Light Indonesia',date:'3 Jun 2026',readTime:'8 min',views:'4.1K',icon:'report',color:'#fff3c4',iconColor:'#8a6500',extUrl:'https://www.intothelightid.org/kenali-jenis-bullying/',
    content:`<p>Bullying bisa terjadi pada siapa saja dan di mana saja. Mengetahui cara melapor adalah langkah pertama yang penting.</p><h3>Langkah Melapor dengan Aman</h3><ul><li>Ceritakan kepada guru BK atau orang dewasa yang dipercaya</li><li>Dokumentasikan kejadian jika memungkinkan</li><li>Hubungi hotline KPAI: 021-319-01556</li></ul>`},
  {id:2,cat:'digital',title:'Privasi Online: Apa yang Boleh dan Tidak Boleh Dibagikan',author:'Kominfo RI',date:'1 Jun 2026',readTime:'5 min',views:'6.7K',icon:'lock',color:'#dce9ff',iconColor:'#106399',extUrl:'https://literasidigital.id',
    content:`<p>Setiap informasi yang kamu bagikan di media sosial meninggalkan jejak digital permanen.</p><h3>Jangan Pernah Bagikan</h3><ul><li>Alamat rumah lengkap dan nomor telepon pribadi</li><li>Nomor KTP atau data identitas resmi</li><li>Password dan PIN akun apapun</li></ul><h3>Aman Dibagikan</h3><ul><li>Nama panggilan, hobi dan minat umum</li><li>Foto di tempat umum (tanpa info lokasi)</li></ul>`},
  {id:3,cat:'nutrition',title:'Sarapan Bergizi = Otak Tajam: Menu Ideal untuk Pelajar',author:'Kemenkes RI',date:'29 Mei 2026',readTime:'4 min',views:'3.2K',icon:'restaurant',color:'#d1fae5',iconColor:'#1c6c3f',extUrl:'https://p2ptm.kemkes.go.id',
    content:`<p>Sarapan adalah bahan bakar otak. Pelajar yang rutin sarapan memiliki konsentrasi 20% lebih baik.</p><h3>Menu Sarapan Ideal</h3><ul><li>Karbohidrat kompleks: nasi merah atau oatmeal</li><li>Protein: telur, tahu, atau tempe</li><li>Buah segar untuk vitamin</li></ul>`},
  {id:4,cat:'mental',title:'Anxiety vs Stres Biasa: Bagaimana Membedakannya?',author:'Yayasan Pulih Indonesia',date:'27 Mei 2026',readTime:'7 min',views:'9.8K',icon:'psychology',color:'#f3e8ff',iconColor:'#7c3aed',extUrl:'https://www.yayasanpulih.org/',
    content:`<p>Tidak semua kekhawatiran adalah anxiety klinis. Memahami perbedaannya penting agar kamu tahu kapan harus mencari bantuan profesional.</p><h3>Stres Biasa</h3><ul><li>Dipicu oleh situasi spesifik (ujian, pertengkaran)</li><li>Hilang setelah situasi selesai</li></ul><h3>Anxiety</h3><ul><li>Rasa khawatir berlebihan tanpa pemicu jelas</li><li>Berlangsung lebih dari 6 bulan</li><li>Disertai gejala fisik: jantung berdebar, sesak napas</li></ul>`},
  {id:5,cat:'digital',title:'Media Sosial dan Kesehatan Mental: Studi Terbaru 2026',author:'WHO & UNICEF',date:'25 Mei 2026',readTime:'10 min',views:'15.3K',icon:'share',color:'#ffe4e6',iconColor:'#e11d48',extUrl:'https://www.who.int/news-room/fact-sheets/detail/mental-health-of-adolescents',
    content:`<p>Penelitian WHO menunjukkan korelasi kuat antara penggunaan media sosial berlebihan (>3 jam/hari) dan peningkatan risiko depresi pada remaja.</p><h3>Tips Sehat Bermedia Sosial</h3><ul><li>Batasi penggunaan maksimal 2 jam/hari</li><li>Unfollow akun yang membuatmu merasa buruk</li><li>Matikan notifikasi di luar jam tertentu</li></ul>`},
  {id:6,cat:'sleep',title:'Tidur 8 Jam vs 6 Jam: Perbedaan Nyata pada Otak Pelajar',author:'Sleep Foundation Indonesia',date:'22 Mei 2026',readTime:'6 min',views:'7.4K',icon:'bedtime',color:'#e0e7ff',iconColor:'#4338ca',
    content:`<p>Kurang tidur hanya 2 jam saja bisa mengurangi kemampuan kognitif setara dengan tidak tidur selama 24 jam penuh.</p><h3>Dampak Kurang Tidur</h3><ul><li>Penurunan daya ingat jangka pendek hingga 40%</li><li>Reaksi lebih lambat dan mudah emosional</li><li>Sistem imun melemah</li></ul><h3>Tips Tidur Berkualitas</h3><ul><li>Tidur pada jam yang sama setiap hari</li><li>Hindari kafein setelah pukul 14.00</li><li>Buat kamar gelap dan sejuk</li></ul>`},
  {id:7,cat:'mental',title:'Cara Meningkatkan Kepercayaan Diri di Sekolah',author:'Tim SafeSchoolHub',date:'20 Mei 2026',readTime:'5 min',views:'11.2K',icon:'emoji_people',color:'#fef9c3',iconColor:'#ca8a04',
    content:`<p>Kepercayaan diri bukan bawaan lahir — itu adalah keterampilan yang bisa dilatih setiap hari.</p><h3>Strategi Membangun Kepercayaan Diri</h3><ul><li>Catat 3 hal positif tentang dirimu setiap pagi</li><li>Mulai dengan langkah kecil, bukan langsung sempurna</li><li>Kelilingi dirimu dengan teman yang mendukung</li><li>Rayakan pencapaian kecil sekalipun</li></ul>`},
  {id:8,cat:'safety',title:'Apa itu Peer Pressure dan Cara Menghadapinya',author:'Into The Light Indonesia',date:'18 Mei 2026',readTime:'7 min',views:'5.6K',icon:'group',color:'#fce7f3',iconColor:'#be185d',extUrl:'https://www.intothelightid.org',
    content:`<p>Tekanan teman sebaya (peer pressure) adalah salah satu tantangan terbesar bagi remaja, terutama di lingkungan sekolah.</p><h3>Jenis Peer Pressure</h3><ul><li>Langsung: teman secara eksplisit meminta kamu melakukan sesuatu</li><li>Tidak langsung: kamu merasa perlu "ikut-ikutan" agar diterima</li></ul><h3>Cara Menghadapinya</h3><ul><li>Kenali nilai-nilai yang penting bagimu</li><li>Latih cara menolak: "Aku tidak mau melakukan itu"</li><li>Cari teman yang menghormati batasan kamu</li></ul>`},
  {id:9,cat:'nutrition',title:'Bahaya Jajan Sembarangan: Fakta yang Perlu Diketahui',author:'Kemenkes RI',date:'15 Mei 2026',readTime:'4 min',views:'4.8K',icon:'warning',color:'#fef3c7',iconColor:'#b45309',
    content:`<p>Jajanan sekolah yang tidak higienis adalah salah satu penyebab utama keracunan makanan pada pelajar Indonesia.</p><h3>Risiko Jajan Sembarangan</h3><ul><li>Bakteri E. coli dan Salmonella dari makanan tidak bersih</li><li>Pewarna tekstil berbahaya pada makanan murah</li><li>Kandungan MSG dan gula berlebih yang merusak konsentrasi</li></ul><h3>Tips Aman</h3><ul><li>Pilih kantin sekolah yang resmi dan terawat</li><li>Bawa bekal dari rumah jika memungkinkan</li></ul>`},
  {id:10,cat:'social',title:'Cara Berkomunikasi Asertif: Bicara Tegas Tanpa Agresif',author:'Yayasan Pulih Indonesia',date:'12 Mei 2026',readTime:'8 min',views:'6.1K',icon:'record_voice_over',color:'#dcfce7',iconColor:'#15803d',extUrl:'https://www.yayasanpulih.org',
    content:`<p>Komunikasi asertif adalah kemampuan mengungkapkan pendapat dan kebutuhan secara langsung, jujur, dan tetap menghormati orang lain.</p><h3>Perbedaan Komunikasi</h3><ul><li><strong>Pasif:</strong> Diam, menghindari konflik, kebutuhan tidak terpenuhi</li><li><strong>Agresif:</strong> Memaksakan kehendak, menyerang orang lain</li><li><strong>Asertif:</strong> Menyampaikan pendapat dengan jelas dan sopan</li></ul><h3>Contoh Kalimat Asertif</h3><ul><li>"Aku merasa tidak nyaman ketika..."</li><li>"Aku butuh... karena..."</li><li>"Aku tidak bisa melakukan itu saat ini"</li></ul>`},
  {id:11,cat:'social',title:'Membangun Pertemanan yang Sehat di Sekolah',author:'Tim SafeSchoolHub',date:'10 Mei 2026',readTime:'5 min',views:'8.9K',icon:'favorite',color:'#fce7f3',iconColor:'#db2777',
    content:`<p>Pertemanan yang sehat adalah fondasi kesehatan mental yang kuat. Tapi bagaimana caranya membedakan pertemanan yang mendukung vs yang toxic?</p><h3>Ciri Pertemanan Sehat</h3><ul><li>Saling mendukung dan menghargai perbedaan</li><li>Bebas menjadi diri sendiri tanpa pura-pura</li><li>Bisa berbicara jujur tanpa takut dihakimi</li></ul><h3>Tanda Pertemanan Toxic</h3><ul><li>Sering merasa lebih buruk setelah bersamanya</li><li>Dimanipulasi atau dikontrol</li><li>Kebutuhanmu selalu dikesampingkan</li></ul>`},
];

function renderArticles(){
  const f=document.getElementById('articleFilter').value;
  const list=document.getElementById('articleList');
  if(!list) return;
  const filtered=f==='all'?ARTICLES.slice(1):ARTICLES.slice(1).filter(a=>a.cat===f);
  if(filtered.length===0){list.innerHTML='<div class="text-center text-on-surface-variant py-8">Tidak ada artikel di kategori ini.</div>';return;}
  list.innerHTML=filtered.map(a=>`
    <div class="article-card" onclick="openArticle(${a.id})">
      <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-surface-container-high">
        <span class="material-symbols-outlined icon-fill text-primary" style="font-size:22px">${a.icon}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold leading-snug">${a.title}</div>
        <div class="text-xs text-on-surface-variant mt-0.5">${a.author} · ${a.date} · ${a.readTime} baca · ${a.views} views</div>
      </div>
      <span class="material-symbols-outlined text-on-surface-variant flex-shrink-0">chevron_right</span>
    </div>
  `).join('');
}

let currentArticleId=null;
let articleFinished=false;
function openArticle(id){
  const a=ARTICLES.find(x=>x.id===id);if(!a)return;
  currentArticleId=id;
  articleFinished=false;
  const extBtn=a.extUrl?`<a href="${a.extUrl}" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.6rem 1rem;border-radius:9999px;border:1px solid var(--outline-variant);color:var(--on-surface);font-weight:600;font-size:.85rem;text-decoration:none;margin-top:1.25rem;"><span class="material-symbols-outlined" style="font-size:16px">open_in_new</span>Baca di Sumber Asli</a>`:'';
  document.getElementById('articleReaderTitle').textContent=a.title;
  document.getElementById('articleXpBadge').textContent='+15 XP';
  document.getElementById('articleReadBar').style.width='0%';
  document.getElementById('articleReadPct').textContent='0%';
  document.getElementById('articleDoneBar').style.display='none';
  document.getElementById('articleContent').innerHTML=`
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;align-items:center;">
      <span style="background: var(--surface-container-high); color: var(--primary); border-radius:9999px;padding:.25rem .75rem;font-size:.75rem;font-weight:700;">${a.cat.toUpperCase()}</span>
      <span style="font-size:.8rem;color:var(--on-surface-variant);">⏱ ${a.readTime} baca</span>
      <span style="font-size:.8rem;color:var(--on-surface-variant);"><i class="fa-solid fa-eye"></i> ${a.views} views</span>
    </div>
    <h1 style="font-size:1.5rem;font-weight:800;line-height:1.3;color:var(--on-surface);margin-bottom:.75rem;">${a.title}</h1>
    <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.75rem;padding-bottom:1.25rem;border-bottom:1px solid var(--outline-variant);">
      <div style="width:36px;height:36px;border-radius:50%;background: var(--surface-container-high);display:flex;align-items:center;justify-content:center;">
        <span class="material-symbols-outlined icon-fill text-primary" style="font-size:18px;">${a.icon}</span>
      </div>
      <div>
        <div style="font-weight:700;font-size:.85rem;">${a.author}</div>
        <div style="font-size:.75rem;color:var(--on-surface-variant);">${a.date}</div>
      </div>
    </div>
    <div style="font-size:.95rem;line-height:1.8;color:var(--on-surface);" class="article-prose">${a.content}</div>
    ${extBtn}
    <div style="height:4rem;"></div>
  `;
  const modal=document.getElementById('articleModal');
  modal.style.display='block';
  modal.scrollTop=0;
  document.body.style.overflow='hidden';
  modal.onscroll=function(){
    const sh=modal.scrollHeight-modal.clientHeight;
    const pct=sh>0?Math.round((modal.scrollTop/sh)*100):100;
    document.getElementById('articleReadBar').style.width=pct+'%';
    document.getElementById('articleReadPct').textContent=pct+'%';
    if(pct>=70&&!articleFinished){
      document.getElementById('articleDoneBar').style.display='block';
    }
  };
}
function closeArticle(){
  document.getElementById('articleModal').style.display='none';
  document.body.style.overflow='';
}
function finishArticle(){
  if(articleFinished)return;
  articleFinished=true;
  document.getElementById('articleDoneBar').style.display='none';
  addXP(15);
  updateSidebarXP();
  closeArticle();
  showToast('<i class="fa-solid fa-circle-check"></i> Artikel selesai dibaca! +15 XP','success');
}

/* ===== SEMINARS ===== */
const SEMINARS=[
  {id:'s_mhda',title:'Pendaftaran Seminar: Kesehatan Mental di Era Digital',speaker:'Dr. Elena Rodriguez — Spesialis Psikologi Kognitif',date:'24 Okt 2024',time:'16.00 EST',duration:'90 min',type:'upcoming',registered:347,topic:'Mental Health',regUrl:'#'},
  {id:'s1',title:'Mindfulness untuk Remaja: Kenali Dirimu Lebih Dalam',speaker:'Into The Light Indonesia',date:'15 Jun 2026',time:'13.00 WIB',duration:'90 min',type:'upcoming',registered:156,topic:'Mental Health',regUrl:'https://www.intothelightid.org/event/'},
  {id:'s2',title:'Pertolongan Pertama Psikologis di Sekolah',speaker:'Yayasan Pulih Indonesia',date:'20 Jun 2026',time:'09.00 WIB',duration:'120 min',type:'upcoming',registered:89,topic:'Safety',regUrl:'https://www.yayasanpulih.org/events/'},
  {id:'s3',title:'Tips Belajar Efektif di Era Digital',speaker:'Kemdikbud RI',date:'28 Mei 2026',time:'',duration:'60 min',type:'recorded',registered:2310,topic:'Digital',watchUrl:'https://youtu.be/_50igeHW7vw'},
  {id:'s4',title:'Screen Time dan Dampaknya pada Perkembangan Otak',speaker:'dr. Tirta Mandira Hudhi',date:'15 Mei 2026',time:'',duration:'75 min',type:'recorded',registered:3420,topic:'Digital',watchUrl:'https://youtu.be/t-sKFvNVqCI'},
  {id:'s5',title:'Komunikasi Sehat Orang Tua dan Remaja',speaker:'Yayasan Pulih Indonesia',date:'5 Jun 2026',time:'15.00 WIB',duration:'90 min',type:'upcoming',registered:210,topic:'Mental Health',regUrl:'https://www.yayasanpulih.org/events/'},
];

let seminarFilter='all';
function filterSeminars(f){
  seminarFilter=f;
  document.querySelectorAll('#seminarFilterBtns button').forEach(b=>b.classList.toggle('active',b.dataset.sf===f));
  renderSeminars();
}
const SEMINAR_ICONS={'Mental Health':'psychology','Safety':'shield','Digital':'devices','Nutrition':'restaurant','Social':'group'};

document.addEventListener('themechange', () => {
  if (document.getElementById('seminarGrid')) {
    renderSeminars();
  }
});

function renderSeminars(){
  const grid=document.getElementById('seminarGrid');
  if(!grid) return;
  const filtered=seminarFilter==='all'?SEMINARS:SEMINARS.filter(s=>s.type===seminarFilter);
  if(filtered.length===0){grid.innerHTML='<div class="text-center text-on-surface-variant py-8 col-span-2">Tidak ada seminar di kategori ini.</div>';return;}
  grid.innerHTML=filtered.map(s=>{
    const ic=SEMINAR_ICONS[s.topic]||'school';
    const bg='var(--surface-container-low)';
    const icColor='var(--primary)';
    const isUpcoming=s.type==='upcoming';
    return `<div class="card overflow-hidden" style="border:1px solid var(--outline-variant);">
      <div class="p-4 flex items-center gap-3" style="background:${bg}; border-bottom: 1px solid var(--outline-variant);">
        <div class="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center flex-shrink-0 shadow-sm">
          <span class="material-symbols-outlined icon-fill" style="color:${icColor};font-size:26px">${ic}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="seminar-badge" style="background:${isUpcoming?'var(--secondary-container);color:var(--on-secondary-container)':'rgba(16,99,153,0.12);color:var(--primary)'};font-size:.65rem;">${isUpcoming?'<i class="fa-solid fa-calendar-days"></i> Upcoming':'<i class="fa-solid fa-circle-play"></i> Recorded'}</span>
            <span class="seminar-badge" style="background:var(--surface-container-lowest);color:var(--primary);font-size:.65rem;">${s.topic}</span>
          </div>
          <div class="font-extrabold text-sm leading-snug mt-1" style="color:var(--on-surface)">${s.title}</div>
        </div>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-outlined text-on-surface-variant" style="font-size:16px">person</span>
          <span class="text-sm font-semibold text-on-surface">${s.speaker}</span>
        </div>
        <div class="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
          <span class="flex items-center gap-1"><span class="material-symbols-outlined" style="font-size:14px">calendar_month</span>${s.date}${s.time?' · '+s.time:''}</span>
          <span class="flex items-center gap-1"><span class="material-symbols-outlined" style="font-size:14px">schedule</span>${s.duration}</span>
        </div>
        <div class="flex items-center justify-between pt-3" style="border-top:1px solid var(--outline-variant)">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-on-surface-variant" style="font-size:14px">${isUpcoming?'groups':'play_circle'}</span>
            <span class="text-xs text-on-surface-variant font-semibold">${s.registered.toLocaleString()} ${isUpcoming?'mendaftar':'ditonton'}</span>
          </div>
          ${isUpcoming
            ?`<button class="btn-primary text-xs py-2 px-4" onclick="registerSeminar('${s.id}','${s.title}')"><i class="fa-solid fa-pen-to-square"></i> Daftar Sekarang</button>`
            :`<button class="btn-ghost text-xs py-2 px-4" onclick="watchSeminar('${s.id}')"><span style="display:flex;align-items:center;gap:4px"><span class="material-symbols-outlined icon-fill" style="font-size:14px;color:var(--primary)">play_arrow</span>Tonton (+25 XP)</span></button>`}
        </div>
      </div>
    </div>`;
  }).join('');
}
/* ===== SEMINAR DETAIL MODAL ===== */
const SEMINAR_DETAILS={
  s_mhda:{
    title:'Pendaftaran Seminar: Kesehatan Mental di Era Digital',
    date:'24 Okt 2024',time:'16.00 EST',
    about:'Di dunia yang saling terhubung saat ini, irisan antara teknologi dan kesejahteraan mental menjadi sangat penting. Seminar komprehensif ini mengeksplorasi nuansa kesehatan digital, dampak psikologis media sosial pada perkembangan remaja, dan strategi praktis untuk menumbuhkan pola pikir yang seimbang.',
    objectives:['Mengidentifikasi efek neurologis dari keterlibatan digital yang berkepanjangan pada pelajar muda','Menerapkan strategi komunikasi berbasis bukti untuk mendiskusikan masalah kesehatan mental digital','Mengenali tanda-tanda peringatan dini kejenuhan digital (burnout) dan kelelahan akademis','Mengembangkan Cetak Biru Keamanan Digital untuk lingkungan rumah dan kelas'],
    speakerName:'Dr. Elena Rodriguez',speakerRole:'Spesialis Psikologi Kognitif',speakerEmoji:'<i class="fa-solid fa-chalkboard-user"></i>',
    spots:347,
  },
  s_featured:{
    title:'Seminar: Bullying di Era Digital: Kenali & Lawan',
    date:'10 Jun 2026',time:'14.00 WIB',
    about:'Seminar eksklusif bersama Psikolog Klinis Dr. Anisa Putri yang membahas cara mengenali, mencegah, dan melawan bullying di era digital. Dilengkapi dengan studi kasus nyata dan strategi intervensi praktis.',
    objectives:['Mengenali berbagai bentuk bullying digital dan fisik','Memahami dampak psikologis bullying pada korban','Belajar cara merespons dan melaporkan bullying','Membangun lingkungan sekolah yang aman dan inklusif'],
    speakerName:'Dr. Anisa Putri, M.Psi',speakerRole:'Psikolog Klinis',speakerEmoji:'<i class="fa-solid fa-user-doctor"></i>',
    spots:266,
  },
  s1:{
    title:'Seminar: Mindfulness untuk Remaja',
    date:'15 Jun 2026',time:'13.00 WIB',
    about:'Dalam webinar ini kita akan menyelami teknik mindfulness yang dirancang khusus untuk remaja, membantu mengenali emosi, mengurangi stres, dan membangun kesadaran diri yang lebih baik di tengah tekanan akademik.',
    objectives:['Memahami apa itu mindfulness dan manfaatnya','Berlatih teknik pernapasan sadar dalam 5 menit','Mengintegrasikan mindfulness dalam rutinitas harian','Mengenali pola pikir negatif dan cara mengatasinya'],
    speakerName:'Into The Light Indonesia',speakerRole:'Konselor Kesehatan Mental',speakerEmoji:'<i class="fa-solid fa-user-doctor"></i>',
    spots:156,
  },
  s2:{
    title:'Seminar: Pertolongan Pertama Psikologis',
    date:'20 Jun 2026',time:'09.00 WIB',
    about:'Pelajari cara memberikan dukungan psikologis pertama kepada teman atau siswa yang sedang dalam krisis. Seminar ini membekali peserta dengan keterampilan mendengar aktif dan respons awal yang tepat.',
    objectives:['Mengenali tanda-tanda krisis psikologis','Memberikan dukungan awal tanpa memperburuk situasi','Merujuk ke profesional yang tepat','Menjaga kesejahteraan diri sebagai pendukung'],
    speakerName:'Yayasan Pulih Indonesia',speakerRole:'Psikolog Klinis',speakerEmoji:'<i class="fa-solid fa-user-doctor"></i>',
    spots:89,
  },
  s5:{
    title:'Seminar: Komunikasi Sehat Orang Tua dan Remaja',
    date:'5 Jun 2026',time:'15.00 WIB',
    about:'Workshop interaktif yang membahas strategi komunikasi terbuka antara remaja dan orang tua. Mencakup teknik berbicara asertif, mengelola konflik, dan membangun kepercayaan dalam keluarga.',
    objectives:['Memahami perbedaan gaya komunikasi','Berlatih teknik komunikasi asertif','Mengelola konflik keluarga secara sehat','Membangun kepercayaan dan keterbukaan'],
    speakerName:'Yayasan Pulih Indonesia',speakerRole:'Konselor Keluarga',speakerEmoji:'<i class="fa-solid fa-people-roof"></i>',
    spots:210,
  },
};
let semRegSpotsCount=47;
function openSeminarRegModal(id){
  const s=SEMINARS.find(x=>x.id===id);
  if(!s)return;
  const det=SEMINAR_DETAILS[id];
  document.getElementById('semRegTitle').textContent=s.title;
  document.getElementById('semRegDate').textContent=s.date;
  document.getElementById('semRegTime').textContent=s.time||'-';
  if(det){
    document.getElementById('semRegAbout').textContent=det.about;
    document.getElementById('semRegObjectives').innerHTML=det.objectives.map(o=>`<div style="display:flex;align-items:flex-start;gap:.5rem;"><div style="flex-shrink:0;width:20px;height:20px;border-radius:50%;background:var(--secondary-container);display:flex;align-items:center;justify-content:center;margin-top:1px;"><span class="material-symbols-outlined" style="font-size:12px;color:var(--on-secondary-container);font-variation-settings:'FILL' 1,'wght' 600">check</span></div><p class="text-sm text-on-surface-variant">${o}</p></div>`).join('');
    document.getElementById('semRegSpeakerName').textContent=det.speakerName;
    document.getElementById('semRegSpeakerRole').textContent=det.speakerRole;
    document.getElementById('semRegSpeakerEmoji').textContent=det.speakerEmoji;
    semRegSpotsCount=det.spots;
    document.getElementById('semRegSpots').textContent=det.spots;
  }
  const savedName=localStorage.getItem('profileName')||'';
  const savedEmail=localStorage.getItem('profileEmail')||'';
  document.getElementById('semRegName').value=savedName;
  document.getElementById('semRegEmail').value=savedEmail;
  document.getElementById('semRegRole').value='';
  document.getElementById('semRegQuestion').value='';
  document.getElementById('semRegFormWrap').style.display='block';
  document.getElementById('semRegSuccess').style.display='none';
  document.getElementById('seminarRegModal').classList.add('open');
}
function closeSeminarRegModal(){document.getElementById('seminarRegModal').classList.remove('open');}
function submitSeminarReg(){
  const name=document.getElementById('semRegName').value.trim();
  const email=document.getElementById('semRegEmail').value.trim();
  const role=document.getElementById('semRegRole').value;
  if(!name){showToast('Nama tidak boleh kosong','error');return;}
  if(!email||!email.includes('@')){showToast('Email tidak valid','error');return;}
  if(!role){showToast('Pilih peran Anda','error');return;}
  localStorage.setItem('profileEmail',email);
  semRegSpotsCount=Math.max(0,semRegSpotsCount-1);
  document.getElementById('semRegSpots').textContent=semRegSpotsCount;
  document.getElementById('semRegFormWrap').style.display='none';
  document.getElementById('semRegSuccess').style.display='block';
  document.getElementById('semRegSuccessTitle').textContent=document.getElementById('semRegTitle').textContent;
  document.getElementById('semRegSuccessDate').textContent=document.getElementById('semRegDate').textContent+' · '+document.getElementById('semRegTime').textContent;
  document.getElementById('semRegSuccessName').textContent=name+' · '+email;
  addXP(20);
  showToast('Pendaftaran berhasil! <i class="fa-solid fa-award"></i>','success');
}
function resetSeminarRegForm(){
  document.getElementById('semRegFormWrap').style.display='block';
  document.getElementById('semRegSuccess').style.display='none';
  document.getElementById('semRegName').value='';
  document.getElementById('semRegEmail').value='';
  document.getElementById('semRegRole').value='';
  document.getElementById('semRegQuestion').value='';
}

/* ===== MHDA INLINE FORM ===== */
function prefillMhdaForm(){
  const n=localStorage.getItem('profileName')||'';
  const e=localStorage.getItem('profileEmail')||'';
  const ni=document.getElementById('mhdaRegName');const ei=document.getElementById('mhdaRegEmail');
  if(ni&&!ni.value)ni.value=n;
  if(ei&&!ei.value)ei.value=e;
}
function submitMhdaReg(){
  const name=document.getElementById('mhdaRegName').value.trim();
  const email=document.getElementById('mhdaRegEmail').value.trim();
  const role=document.getElementById('mhdaRegRole').value;
  if(!name){showToast('Nama wajib diisi','error');return;}
  if(!email||!email.includes('@')){showToast('Email tidak valid','error');return;}
  if(!role){showToast('Silakan pilih peran Anda','error');return;}
  localStorage.setItem('profileEmail',email);
  const spots=parseInt(document.getElementById('mhdaSpots').textContent)||347;
  document.getElementById('mhdaSpots').textContent=Math.max(0,spots-1);
  document.getElementById('mhdaRegFormWrap').style.display='none';
  document.getElementById('mhdaRegSuccess').style.display='block';
  addXP(20);
  showToast('Pendaftaran berhasil! <i class="fa-solid fa-award"></i>','success');
}
function resetMhdaReg(){
  document.getElementById('mhdaRegFormWrap').style.display='block';
  document.getElementById('mhdaRegSuccess').style.display='none';
  document.getElementById('mhdaRegName').value='';
  document.getElementById('mhdaRegEmail').value='';
  document.getElementById('mhdaRegRole').value='';
  document.getElementById('mhdaRegQuestion').value='';
}

function registerSeminar(id,title){
  const s=SEMINARS.find(x=>x.id===id);
  if(SEMINAR_DETAILS[id]){
    openSeminarRegModal(id);
  } else if(s&&s.regUrl){
    window.open(s.regUrl,'_blank');
    showToast('Membuka halaman pendaftaran...','info');
    addXP(20);
  } else {
    showToast('Berhasil mendaftar: '+title,'success');
    addXP(20);
  }
}
function watchSeminar(id){const s=SEMINARS.find(x=>x.id===id);if(s&&s.watchUrl){window.open(s.watchUrl,'_blank');showToast('Membuka seminar...','info');addXP(25);}}

/* ===== QUIZ ===== */
const QUIZ_QUESTIONS=[
  {q:'Apa langkah pertama yang harus dilakukan jika kamu menjadi korban bullying di sekolah?',opts:['Balas dengan kekerasan','Cerita kepada orang dewasa yang dipercaya','Diam saja dan biarkan','Posting di media sosial'],ans:1,cat:'<i class="fa-solid fa-shield-halved"></i> School Safety',exp:'Menceritakan kepada guru, konselor, atau orang tua adalah langkah terpenting.'},
  {q:'Berapa lama waktu screen time yang direkomendasikan untuk remaja per hari?',opts:['Tidak ada batasan','Lebih dari 8 jam','Kurang dari 2 jam untuk rekreasi','Tepat 5 jam'],ans:2,cat:'<i class="fa-solid fa-mobile-screen-button"></i> Digital Wellness',exp:'WHO merekomendasikan maksimal 2 jam screen time rekreasi per hari untuk remaja.'},
  {q:'Mana yang merupakan tanda-tanda seseorang membutuhkan bantuan kesehatan mental?',opts:['Senang bermain dengan teman','Perubahan drastis pada pola makan dan tidur','Aktif berolahraga','Sering membaca buku'],ans:1,cat:'<i class="fa-solid fa-brain"></i> Mental Health',exp:'Perubahan mendadak pada pola makan, tidur, atau perilaku sosial bisa menjadi tanda masalah kesehatan mental.'},
  {q:'Apa yang dimaksud dengan cyberbullying?',opts:['Bermain game online bersama','Perundungan yang dilakukan melalui media digital','Belajar coding di internet','Mencari teman baru di media sosial'],ans:1,cat:'<i class="fa-solid fa-mobile-screen-button"></i> Digital Wellness',exp:'Cyberbullying adalah intimidasi atau perundungan melalui media digital seperti media sosial atau pesan teks.'},
  {q:'Berapa gelas air yang disarankan untuk diminum siswa per hari?',opts:['2-3 gelas','4-5 gelas','8-10 gelas','15+ gelas'],ans:2,cat:'<i class="fa-solid fa-droplet"></i> Health & Hydration',exp:'Rata-rata remaja membutuhkan 8-10 gelas (2-2.5 liter) air per hari.'},
  {q:'Teknik pernapasan "4-7-8" berarti?',opts:['Tarik napas 4 detik, tahan 7, buang 8','Tarik napas 7 detik, tahan 4, buang 8','Tarik napas 8 detik, tahan 4, buang 7','Tarik napas 4, buang 7, tahan 8'],ans:0,cat:'<i class="fa-solid fa-wind"></i> Breathing',exp:'Teknik 4-7-8: tarik napas 4 detik, tahan 7 detik, buang perlahan 8 detik. Efektif mengurangi stres.'},
  {q:'Informasi mana yang TIDAK BOLEH dibagikan secara online?',opts:['Nama panggilan kamu','Hobi favoritmu','Alamat rumah dan nomor HP','Foto wisata keluarga'],ans:2,cat:'<i class="fa-solid fa-lock"></i> Digital Safety',exp:'Alamat rumah dan nomor telepon adalah data pribadi sensitif yang bisa membahayakan keselamatanmu.'},
  {q:'Berapa jam tidur ideal untuk remaja usia 14-17 tahun?',opts:['5-6 jam','6-7 jam','8-10 jam','11-12 jam'],ans:2,cat:'<i class="fa-solid fa-bed"></i> Sleep Health',exp:'National Sleep Foundation merekomendasikan 8-10 jam tidur per malam untuk remaja usia 14-17 tahun.'},
  {q:'Jika temanmu tampak sangat sedih dan menyebut ingin "menghilang", apa yang harus kamu lakukan?',opts:['Anggap itu bercanda','Ceritakan kepada guru atau orang tua segera','Abaikan karena urusan pribadi','Posting di group chat kelas'],ans:1,cat:'<i class="fa-solid fa-brain"></i> Mental Health',exp:'Komentar tentang "ingin menghilang" harus selalu ditanggapi serius. Segera beritahu orang dewasa yang dipercaya.'},
  {q:'Apa manfaat utama olahraga rutin bagi pelajar?',opts:['Hanya membangun otot','Meningkatkan fokus, mood, dan kualitas tidur','Menggantikan kebutuhan tidur','Membuat lebih lelah di sekolah'],ans:1,cat:'<i class="fa-solid fa-dumbbell"></i> Physical Health',exp:'Olahraga melepaskan endorfin yang meningkatkan suasana hati, fokus, membantu tidur, dan mengurangi stres.'},
];
let quizIdx=0,quizScore=0,quizTimer=null,quizTimeLeft=30,quizAnswered=false;
function startQuiz(){quizIdx=0;quizScore=0;quizAnswered=false;document.getElementById('quizIntro').classList.add('hidden');document.getElementById('quizResult').classList.add('hidden');document.getElementById('quizActive').classList.remove('hidden');loadQuestion();}
function loadQuestion(){
  const q=QUIZ_QUESTIONS[quizIdx];quizAnswered=false;quizTimeLeft=30;
  document.getElementById('qNum').textContent=quizIdx+1;
  document.getElementById('qProgress').style.width=((quizIdx+1)/10*100)+'%';
  document.getElementById('qCategory').innerHTML=`<span class="seminar-badge" style="background: var(--surface-container-high);color:#106399;font-size:12px">${q.cat}</span>`;
  document.getElementById('qText').textContent=q.q;
  document.getElementById('qNextBtn').classList.add('hidden');
  document.getElementById('qExplanation').classList.add('hidden');
  document.getElementById('qTimer').textContent=quizTimeLeft;
  document.getElementById('qOptions').innerHTML=q.opts.map((o,i)=>`<button class="quiz-option text-left" onclick="answerQuestion(${i})">${String.fromCharCode(65+i)}. ${o}</button>`).join('');
  clearInterval(quizTimer);
  quizTimer=setInterval(()=>{quizTimeLeft--;document.getElementById('qTimer').textContent=quizTimeLeft;if(quizTimeLeft<=0){clearInterval(quizTimer);if(!quizAnswered)timeOut();}},1000);
}
function answerQuestion(idx){
  if(quizAnswered)return;quizAnswered=true;clearInterval(quizTimer);
  const q=QUIZ_QUESTIONS[quizIdx];
  document.querySelectorAll('.quiz-option').forEach((b,i)=>{b.disabled=true;if(i===q.ans)b.classList.add('correct');else if(i===idx)b.classList.add('wrong');});
  if(idx===q.ans){
    quizScore++;
    xp+=10;
    saveXP(xp);
    const el=document.getElementById('xpDisplay');if(el)el.textContent=xp+' XP';
    const sEl=document.getElementById('sidebarXP');if(sEl)sEl.textContent=xp+' XP';
    showToast('Benar! +10 XP <i class="fa-solid fa-award"></i>','success');
  }
  else showToast('Salah. Jangan menyerah!','error');
  const exp=document.getElementById('qExplanation');exp.innerHTML='<i class="fa-solid fa-lightbulb"></i> '+q.exp;exp.classList.remove('hidden');
  document.getElementById('qNextBtn').classList.remove('hidden');
  document.getElementById('qNextBtn').textContent=quizIdx<9?'Lanjut →':'Lihat Hasil <i class="fa-solid fa-trophy"></i>';
}
function timeOut(){
  quizAnswered=true;
  const q=QUIZ_QUESTIONS[quizIdx];
  document.querySelectorAll('.quiz-option').forEach((b,i)=>{b.disabled=true;if(i===q.ans)b.classList.add('correct');});
  showToast('Waktu habis! <i class="fa-solid fa-clock"></i>','error');
  const exp=document.getElementById('qExplanation');
  exp.innerHTML='<i class="fa-solid fa-clock"></i> Waktu habis. <i class="fa-solid fa-lightbulb"></i> '+q.exp;
  exp.classList.remove('hidden');
  document.getElementById('qNextBtn').classList.remove('hidden');
  document.getElementById('qNextBtn').textContent=quizIdx<9?'Lanjut →':'Lihat Hasil <i class="fa-solid fa-trophy"></i>';
}
function nextQuestion(){quizIdx++;if(quizIdx>=10){showResult();return;}loadQuestion();}
function showResult(){
  document.getElementById('quizActive').classList.add('hidden');document.getElementById('quizResult').classList.remove('hidden');
  const pct=Math.round(quizScore/10*100),circ=2*Math.PI*40;
  const ring=document.getElementById('resultRing');ring.style.strokeDashoffset=circ-(circ*pct/100);ring.style.transition='stroke-dashoffset 1.2s ease';
  document.getElementById('resultScore').textContent=quizScore+'/10';document.getElementById('resultPct').textContent=pct+'%';
  const xpE=quizScore*10;document.getElementById('resultXP').textContent='+'+xpE+' XP';document.getElementById('resultCorrect').textContent=quizScore+' Benar';
  const msgs=['Jangan menyerah! Pelajari materinya dan coba lagi. <i class="fa-solid fa-dumbbell"></i>','Lumayan! Masih banyak yang bisa dipelajari. <i class="fa-solid fa-book-open"></i>','Bagus! Kamu cukup paham keamanan sekolah. <i class="fa-solid fa-thumbs-up"></i>','Hebat! Pengetahuanmu sangat baik! <i class="fa-solid fa-star"></i>','Sempurna! Kamu ahli keamanan sejati! <i class="fa-solid fa-trophy"></i>'];
  const level=Math.min(4,Math.floor(pct/20));
  document.getElementById('resultTitle').textContent=['Terus Belajar!','Hampir!','Bagus Sekali!','Luar Biasa!','Sempurna! <i class="fa-solid fa-trophy"></i>'][level];
  document.getElementById('resultMsg').textContent=msgs[level];
  addXP(xpE);
}
function retryQuiz(){startQuiz();}

/* ===== LOGOUT ===== */
document.getElementById('sidebar-logout').addEventListener('click',()=>{
  if(confirm('Apakah Anda yakin ingin keluar dari SafeSchool?')){
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    location.href='../safeschool-landing.html';
  }
});

// Auto-switch tab if redirected from seminar.html
const gotoTab=localStorage.getItem('edu_goto_tab') || 'videos';
localStorage.removeItem('edu_goto_tab');
updateCertCount();
switchTab(gotoTab);
