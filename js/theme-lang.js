// Global Theme and Language Management System
// Mengecek dan menerapkan tema setiap kali halaman apapun dimuat
function applyGlobalTheme(theme){
  globalCurrentTheme = theme;
  localStorage.setItem('appTheme', theme);
  
  if(theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark-theme');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark-theme');
    document.documentElement.style.colorScheme = 'light';
  }
}
// Jalankan langsung saat script di-load
applyGlobalTheme();
const GLOBAL_I18N={
  en:{
    brand:'SafeSchoolHub',dashTitle:'Student Wellness',settings:'Settings',
    overview:'Overview',educational:'Educational',gadgetTime:'Wellness Tracking',
    hydration:'Hydration',sleep:'Sleep',breathing:'Breathing',reports:'Report Incident',
    helpCenter:'Help Center',logout:'Log Out',
    appearance:'Appearance',language:'Language',theme:'Theme',notifications:'Notifications',
    privacy:'Privacy & Data',downloadData:'Download My Data',clearMoodHistory:'Clear Mood History',
    account:'Account',changePassword:'Change Password',updatePassword:'Update Password',
    currentPassword:'Current password',newPassword:'New password',passwordUpdated:'Password updated',
    lightTheme:'Light',darkTheme:'Dark',languageChanged:'Language: English',themeChanged:'Theme: {0}'
  },
  id:{
    brand:'SafeSchoolHub',dashTitle:'Kesejahteraan Siswa',settings:'Pengaturan',
    overview:'Ikhtisar',educational:'Pendidikan',gadgetTime:'Pelacakan Kesehatan',
    hydration:'Hidrasi',sleep:'Tidur',breathing:'Pernapasan',reports:'Laporkan Insiden',
    helpCenter:'Pusat Bantuan',logout:'Keluar',
    appearance:'Tampilan',language:'Bahasa',theme:'Tema',notifications:'Notifikasi',
    privacy:'Privasi & Data',downloadData:'Unduh Data Saya',clearMoodHistory:'Hapus Riwayat Suasana Hati',
    account:'Akun',changePassword:'Ubah Kata Sandi',updatePassword:'Perbarui Kata Sandi',
    currentPassword:'Kata sandi saat ini',newPassword:'Kata sandi baru',passwordUpdated:'Kata sandi diperbarui',
    lightTheme:'Terang',darkTheme:'Gelap',languageChanged:'Bahasa: Indonesia',themeChanged:'Tema: {0}'
  }
};

let globalCurrentTheme='light';

function getGlobalLang(){
  return localStorage.getItem('appLang')||'en';
}

function getGlobalTheme(){
  return localStorage.getItem('appTheme')||'light';
}

function initGlobalTheme(){
  globalCurrentTheme=getGlobalTheme();
  applyGlobalTheme(globalCurrentTheme);
}

function applyGlobalTheme(theme){
  globalCurrentTheme=theme;
  localStorage.setItem('appTheme',theme);
  
  if(theme==='dark'){
    document.documentElement.style.colorScheme='dark';
    document.body.style.backgroundColor='#0f1419';
    document.body.style.color='#e3e7ee';
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    
    // Update all cards and elements
    document.querySelectorAll('.card,.glass-card').forEach(el=>{
      el.style.backgroundColor='#1a1f2e';
      el.style.borderColor='#3a4550';
      el.style.color='#e3e7ee';
    });
    
    document.querySelectorAll('.sidebar-desktop').forEach(el=>{
      el.style.backgroundColor='#1a1f2e';
      el.style.borderColor='#3a4550';
      el.style.color='#e3e7ee';
    });
    
    document.querySelectorAll('.top-bar-mobile').forEach(el=>{
      el.style.backgroundColor='#1a1f2e';
      el.style.borderColor='#3a4550';
      el.style.color='#e3e7ee';
    });
    
    document.querySelectorAll('select, input').forEach(el=>{
      el.style.backgroundColor='#1a1f2e';
      el.style.color='#e3e7ee';
      el.style.borderColor='#3a4550';
    });
  } else {
    document.documentElement.style.colorScheme='light';
    document.body.style.backgroundColor='#f8f9ff';
    document.body.style.color='#0b1c30';
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    
    // Reset styles
    document.querySelectorAll('.card,.glass-card').forEach(el=>{
      el.style.backgroundColor='';
      el.style.borderColor='';
      el.style.color='';
    });
    
    document.querySelectorAll('.sidebar-desktop').forEach(el=>{
      el.style.backgroundColor='';
      el.style.borderColor='';
      el.style.color='';
    });
    
    document.querySelectorAll('.top-bar-mobile').forEach(el=>{
      el.style.backgroundColor='';
      el.style.borderColor='';
      el.style.color='';
    });
    
    document.querySelectorAll('select, input').forEach(el=>{
      el.style.backgroundColor='';
      el.style.color='';
      el.style.borderColor='';
    });
  }
}

function setGlobalLang(lang){
  localStorage.setItem('appLang',lang);
  
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    const val=GLOBAL_I18N[lang][key];
    if(val)el.textContent=val;
  });
  
  // Update placeholders
  document.querySelectorAll('[data-placeholder]').forEach(el=>{
    const key=el.dataset.placeholder;
    const val=GLOBAL_I18N[lang][key];
    if(val)el.placeholder=val;
  });
  
  // Call page-specific language update if exists
  if(typeof updatePageLanguage==='function'){
    updatePageLanguage(lang);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded',()=>{
  initGlobalTheme();
  
  const lang=getGlobalLang();
  setGlobalLang(lang);
  
  // Update language selector if it exists
  const langSel=document.getElementById('langSel');
  if(langSel){
    langSel.value=lang;
  }
});
