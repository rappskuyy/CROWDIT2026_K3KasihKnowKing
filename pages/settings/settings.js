/* ============== ROUTER ============== */
const ROUTE_FILES = {
  "overview": "../../index.html",
  "educational": "../educational/educational.html",
  "gadget-time": "../gadget-time/gadget-time.html",
  "hydration": "../hydration/hydration.html",
  "sleep": "../sleep/sleep.html",
  "breathing": "../breathing/breathing.html",
  "counseling": "../counseling/counseling.html",
  "settings": "settings.html",
  "reports": "../reports/reports.html"
};
const CURRENT_ROUTE = 'settings';

function navigate(r) {
  if (r === 'dashboard') r = 'overview';
  if (ROUTE_FILES[r] && r !== CURRENT_ROUTE) {
    location.href = ROUTE_FILES[r];
    return;
  }
}

document.querySelectorAll('[data-route]').forEach(el =>
  el.addEventListener('click', () => navigate(el.dataset.route))
);

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
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
});

document.querySelectorAll('.modal-backdrop').forEach(m => m.addEventListener('click', e => {
  if (e.target === m) m.classList.remove('open');
}));

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

/* ============== SETTINGS ============== */
const notifSettingsData = { 'pushNotif': true, 'emailReminder': true, 'hydrationReminder': true, 'sleepAlert': false, 'stressCheckIn': true };
const I18N_NOTIF = {
  en: { 'pushNotif': 'Push Notifications', 'emailReminder': 'Email Reminders', 'hydrationReminder': 'Hydration Reminders', 'sleepAlert': 'Sleep Alerts', 'stressCheckIn': 'Stress Check-ins' },
  id: { 'pushNotif': 'Pemberitahuan Push', 'emailReminder': 'Pengingat Email', 'hydrationReminder': 'Pengingat Hidrasi', 'sleepAlert': 'Peringatan Tidur', 'stressCheckIn': 'Pemeriksaan Stres' }
};

function renderNotifs() {
  const c = document.getElementById('notifList');
  if (!c) return;
  c.innerHTML = '';
  const lang = getCurrentLang();
  Object.entries(notifSettingsData).forEach(([k, v]) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between';
    const label = I18N_NOTIF[lang][k] || k;
    row.innerHTML = `<span class="text-sm">${label}</span><div class="toggle ${v ? 'on' : ''}"></div>`;
    row.querySelector('.toggle').addEventListener('click', e => {
      notifSettingsData[k] = !notifSettingsData[k];
      e.target.classList.toggle('on');
      const onOff = notifSettingsData[k] ? 'ON' : 'OFF';
      const msg = `${label}: ${onOff}`;
      showToast(msg, 'info');
    });
    c.appendChild(row);
  });
}

let moodHistory = [];
let feelHistory = [];
let cups = 0;

function downloadData() {
  const blob = new Blob([JSON.stringify({ profile: { name: 'Naa', grade: '11-A' }, cups, moodHistory, feelHistory, notifSettingsData }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'my_data.json';
  a.click();
  showToast('Data downloaded', 'success');
}

function clearMoodHistory() {
  document.getElementById('confirmTitle').textContent = 'Clear mood history?';
  document.getElementById('confirmMsg').textContent = 'This cannot be undone.';
  document.getElementById('confirmOk').onclick = () => {
    moodHistory = [];
    feelHistory = [];
    closeModal('confirmModal');
    showToast('Mood history cleared', 'success');
  };
  openModal('confirmModal');
}

const I18N = {
  en: {
    brand: 'SafeSchoolHub', dashTitle: 'Student Wellness', settings: 'Settings',
    appearance: 'Appearance', language: 'Language', theme: 'Theme', notifications: 'Notifications',
    privacy: 'Privacy & Data', downloadData: 'Download My Data', clearMoodHistory: 'Clear Mood History',
    account: 'Account', changePassword: 'Change Password', logout: 'Log Out', updatePassword: 'Update Password',
    currentPassword: 'Current password', newPassword: 'New password', passwordUpdated: 'Password updated',
    lightTheme: 'Light', darkTheme: 'Dark', languageChanged: 'Language: English', themeChanged: 'Theme: {0}'
  },
  id: {
    brand: 'SafeSchoolHub', dashTitle: 'Kesejahteraan Siswa', settings: 'Pengaturan',
    appearance: 'Tampilan', language: 'Bahasa', theme: 'Tema', notifications: 'Notifikasi',
    privacy: 'Privasi & Data', downloadData: 'Unduh Data Saya', clearMoodHistory: 'Hapus Riwayat Suasana Hati',
    account: 'Akun', changePassword: 'Ubah Kata Sandi', logout: 'Keluar', updatePassword: 'Perbarui Kata Sandi',
    currentPassword: 'Kata sandi saat ini', newPassword: 'Kata sandi baru', passwordUpdated: 'Kata sandi diperbarui',
    lightTheme: 'Terang', darkTheme: 'Gelap', languageChanged: 'Bahasa: Indonesia', themeChanged: 'Tema: {0}'
  }
};

let currentTheme = 'light';

function getCurrentLang() { return (window.LangSystem && LangSystem.getLang()) || 'id'; }
function getCurrentTheme() { return (window.ThemeSystem && ThemeSystem.getTheme()) || 'light'; }

function initTheme() {
  currentTheme = getCurrentTheme();
  if (window.ThemeSystem) {
    ThemeSystem.apply(currentTheme);
  }
  updateThemeUI();
}

function applyTheme(theme) {
  currentTheme = theme;
  if (window.ThemeSystem) {
    ThemeSystem.setTheme(theme);
  }
  updateThemeUI();
}

function updateThemeUI() {
  const switcher = document.getElementById('themeSwitcher');
  const label = document.getElementById('themeLabel');
  if (switcher) {
    switcher.classList.toggle('on', currentTheme === 'dark');
  }
  if (label) {
    const lang = getCurrentLang();
    label.setAttribute('data-i18n', currentTheme === 'dark' ? 'darkTheme' : 'lightTheme');
    label.textContent = currentTheme === 'dark' ? I18N[lang].darkTheme : I18N[lang].lightTheme;
  }
}

function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  const lang = getCurrentLang();
  const themeName = newTheme === 'dark' ? I18N[lang].darkTheme : I18N[lang].lightTheme;
  showToast(I18N[lang].themeChanged.replace('{0}', themeName), 'success');
}

function setLang(l) {
  if (window.LangSystem) {
    LangSystem.setLang(l);
  }
  renderNotifs();
  const msg = l === 'id' ? I18N[l].languageChanged : I18N[l].languageChanged;
  showToast(msg, 'info');
}

/* ============== SETTINGS PROFILE SYNC ============== */
function loadSettingsProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = localStorage.getItem('profileName') || user.name || 'Naa';
  const grade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const el = document.getElementById('settingsProfileName'); if (el) el.textContent = name;
  const el2 = document.getElementById('settingsProfileGrade'); if (el2) el2.textContent = grade;
  const av = document.getElementById('settingsAvatarCircle'); if (av) av.textContent = initials;
  const sn = document.getElementById('sidebarName'); if (sn) sn.textContent = name;
  const sg = document.getElementById('sidebarGrade'); if (sg) sg.textContent = grade;
  const mb = document.getElementById('mobileAvatarBadge'); if (mb) mb.textContent = initials;
}

function openProfileEditModal() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = localStorage.getItem('profileName') || user.name || 'Naa';
  const grade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
  const email = localStorage.getItem('profileEmail') || '';
  document.getElementById('settingsNameInput').value = name;
  document.getElementById('settingsGradeInput').value = grade;
  document.getElementById('settingsEmailInput').value = email;
  document.getElementById('profileEditModal').classList.add('open');
}

function closeProfileEditModal() { document.getElementById('profileEditModal').classList.remove('open'); }

function saveSettingsProfile() {
  const name = document.getElementById('settingsNameInput').value.trim() || 'Naa';
  const grade = document.getElementById('settingsGradeInput').value.trim() || 'Grade 11-A';
  const email = document.getElementById('settingsEmailInput').value.trim();
  localStorage.setItem('profileName', name);
  localStorage.setItem('profileGrade', grade);
  if (email) localStorage.setItem('profileEmail', email);
  try {
    let u = JSON.parse(localStorage.getItem('user') || '{}');
    u.name = name;
    u.email = email || u.email;
    u.role = grade;
    localStorage.setItem('user', JSON.stringify(u));
  } catch (e) { }
  loadSettingsProfile();
  closeProfileEditModal();
  showToast('<i class="fa-solid fa-circle-check"></i> Profile saved!', 'success');
}

/* ============== INIT ============== */
function initSettings() {
  const lang = getCurrentLang();
  const langSel = document.getElementById('langSel');
  if (langSel) {
    langSel.value = lang;
  }
  if (window.LangSystem) {
    LangSystem._applyAll(lang);
  }
  renderNotifs();
  initTheme();
  loadSettingsProfile();
}

window.addEventListener('DOMContentLoaded', initSettings);
