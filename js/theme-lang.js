// ============================================================
// Global Theme & Language System — theme-lang.js
// Included in every page. Apply theme before DOMContentLoaded
// to avoid flash-of-wrong-theme (FOUT).
// ============================================================

// ---------- I18N strings ----------
const GLOBAL_I18N = {
  en: {
    brand: 'SafeSchoolHub', dashTitle: 'Student Wellness', settings: 'Settings',
    overview: 'Overview', educational: 'Educational', gadgetTime: 'Wellness Tracking',
    hydration: 'Hydration', sleep: 'Sleep', breathing: 'Breathing', reports: 'Report Incident',
    helpCenter: 'Help Center', logout: 'Log Out',
    appearance: 'Appearance', language: 'Language', theme: 'Theme', notifications: 'Notifications',
    privacy: 'Privacy & Data', downloadData: 'Download My Data', clearMoodHistory: 'Clear Mood History',
    account: 'Account', changePassword: 'Change Password', updatePassword: 'Update Password',
    currentPassword: 'Current password', newPassword: 'New password', passwordUpdated: 'Password updated',
    lightTheme: 'Light', darkTheme: 'Dark', languageChanged: 'Language: English', themeChanged: 'Theme: {0}'
  },
  id: {
    brand: 'SafeSchoolHub', dashTitle: 'Kesejahteraan Siswa', settings: 'Pengaturan',
    overview: 'Ikhtisar', educational: 'Pendidikan', gadgetTime: 'Pelacakan Kesehatan',
    hydration: 'Hidrasi', sleep: 'Tidur', breathing: 'Pernapasan', reports: 'Laporkan Insiden',
    helpCenter: 'Pusat Bantuan', logout: 'Keluar',
    appearance: 'Tampilan', language: 'Bahasa', theme: 'Tema', notifications: 'Notifikasi',
    privacy: 'Privasi & Data', downloadData: 'Unduh Data Saya', clearMoodHistory: 'Hapus Riwayat Suasana Hati',
    account: 'Akun', changePassword: 'Ubah Kata Sandi', updatePassword: 'Perbarui Kata Sandi',
    currentPassword: 'Kata sandi saat ini', newPassword: 'Kata sandi baru', passwordUpdated: 'Kata sandi diperbarui',
    lightTheme: 'Terang', darkTheme: 'Gelap', languageChanged: 'Bahasa: Indonesia', themeChanged: 'Tema: {0}'
  }
};

// ---------- Theme System ----------
window.ThemeSystem = (function () {
  const THEME_KEY = 'appTheme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function apply(theme) {
    const html = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      html.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark-mode', 'dark-theme');
        body.classList.remove('light-mode', 'light-theme');
      }
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      html.style.colorScheme = 'light';
      if (body) {
        body.classList.add('light-mode', 'light-theme');
        body.classList.remove('dark-mode', 'dark-theme');
      }
    }

    localStorage.setItem(THEME_KEY, theme);
  }

  function setTheme(theme) {
    apply(theme);
    // Notify any page-specific theme handlers
    if (typeof window.onThemeChange === 'function') {
      window.onThemeChange(theme);
    }
  }

  // Apply immediately (before DOMContentLoaded) to prevent flash
  apply(getTheme());

  // Re-apply after DOM loads to handle body classes
  document.addEventListener('DOMContentLoaded', function () {
    apply(getTheme());
  });

  return {
    getTheme,
    setTheme,
    apply,
    getCurrent: getTheme
  };
})();

// ---------- Lang System ----------
window.LangSystem = (function () {
  const LANG_KEY = 'appLang';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'id';
  }

  function applyLang(lang) {
    const safelang = GLOBAL_I18N[lang] ? lang : 'id';
    localStorage.setItem(LANG_KEY, safelang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = GLOBAL_I18N[safelang][key];
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-placeholder]').forEach(el => {
      const key = el.dataset.placeholder;
      const val = GLOBAL_I18N[safelang][key];
      if (val !== undefined) el.placeholder = val;
    });

    if (typeof updatePageLanguage === 'function') {
      updatePageLanguage(safelang);
    }
  }

  function setLang(lang) {
    applyLang(lang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang());
  });

  return { getLang, setLang, applyLang };
})();

// ---------- Backwards-compat globals ----------
function getGlobalTheme() { return ThemeSystem.getTheme(); }
function getGlobalLang()  { return LangSystem.getLang(); }
function initGlobalTheme() { ThemeSystem.apply(ThemeSystem.getTheme()); }
function applyGlobalTheme(theme) { ThemeSystem.setTheme(theme); }
function setGlobalLang(lang) { LangSystem.setLang(lang); }
