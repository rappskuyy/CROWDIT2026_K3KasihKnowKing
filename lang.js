/**
 * lang.js — SafeSchoolHub Centralized Translation System
 * 
 * Cara pakai:
 * 1. Tambahkan <script src="js/lang.js"></script> di <head> setiap halaman
 * 2. Tambahkan atribut data-i18n="key" pada elemen HTML yang ingin diterjemahkan
 * 3. Panggil LangSystem.init() saat halaman dimuat
 * 4. Tambahkan tombol/dropdown language switcher (lihat contoh di bawah)
 */

const TRANSLATIONS = {
  en: {
    /* ── GLOBAL / NAVIGATION ── */
    brand:              'SafeSchoolHub',
    navDashboard:       'Dashboard',
    navEducational:     'Educational',
    navWellness:        'Wellness Tracking',
    navHydration:       'Hydration',
    navSleep:           'Sleep',
    navBreathing:       'Breathing',
    navReports:         'Report Incident',
    navCounseling:      'Digital Counseling',
    navSettings:        'Settings',
    navHelp:            'Help Center',
    navLogout:          'Log Out',

    /* ── SETTINGS PAGE ── */
    settings:           'Settings',
    appearance:         'Appearance',
    language:           'Language',
    theme:              'Theme',
    lightTheme:         'Light',
    darkTheme:          'Dark',
    notifications:      'Notifications',
    privacy:            'Privacy & Data',
    downloadData:       'Download My Data',
    clearMoodHistory:   'Clear Mood History',
    account:            'Account',
    changePassword:     'Change Password',
    logout:             'Log Out',
    updatePassword:     'Update Password',
    currentPassword:    'Current password',
    newPassword:        'New password',
    passwordUpdated:    'Password updated',
    languageChanged:    'Language: English',
    themeChanged:       'Theme: {0}',

    /* ── DASHBOARD / INDEX ── */
    dashTitle:          'Student Wellness',
    dashSubtitle:       "Hello, Alex. Let's take a look at your well-being journey this week.",
    checkinBtn:         'Check-in Now',
    moodTracker:        'Mood Tracker',
    thisWeek:           'This Week',
    stressLevel:        'Stress Level',
    dailyGoals:         'Daily Goals',
    recentActivity:     'Recent Activity',

    /* ── HYDRATION PAGE ── */
    hydrationTitle:     'Hydration Tracker',
    hydrationSubtitle:  'Track your daily water intake',
    addWater:           'Add Water',
    dailyGoal:          'Daily Goal',
    cupsToday:          'Cups Today',
    hydrationTip:       'Staying hydrated improves focus and energy levels.',

    /* ── SLEEP PAGE ── */
    sleepTitle:         'Sleep Tracker',
    sleepSubtitle:      'Monitor your sleep patterns',
    logSleep:           'Log Sleep',
    bedtime:            'Bedtime',
    wakeTime:           'Wake Time',
    sleepDuration:      'Sleep Duration',
    sleepQuality:       'Sleep Quality',
    sleepTip:           'Aim for 8–10 hours of sleep each night for optimal health.',

    /* ── BREATHING PAGE ── */
    breathingTitle:     'Breathing Exercise',
    breathingSubtitle:  'Calm your mind with guided breathing',
    startSession:       'Start Session',
    pauseSession:       'Pause Session',
    resumeSession:      'Resume Session',
    customizePhases:    'Customize Phases',
    inhale:             'Inhale',
    hold:               'Hold',
    exhale:             'Exhale',
    roundComplete:      'Round complete! 🎉',
    sessionStreak:      'Streak',

    /* ── EDUCATIONAL PAGE ── */
    educationalTitle:   'Educational Resources',
    educationalSubtitle:'Learn about wellness and healthy habits',
    readMore:           'Read More',
    watchVideo:         'Watch Video',

    /* ── GADGET / WELLNESS TRACKING PAGE ── */
    gadgetTitle:        'Wellness Tracking',
    gadgetSubtitle:     'Monitor your screen time and wellness habits',
    screenTime:         'Screen Time',
    todayUsage:         'Today\'s Usage',
    weeklyAverage:      'Weekly Average',
    setLimit:           'Set Limit',

    /* ── REPORTS PAGE ── */
    reportsTitle:       'Report an Incident',
    reportsSubtitle:    'All reports are submitted anonymously',
    submitReport:       'Submit Report',
    reportType:         'Incident Type',
    reportLocation:     'Location',
    reportDescription:  'Description',
    reportAnonymous:    'Your identity will remain anonymous',
    exportCSV:          'Export CSV',
    filterAll:          'All',
    filterOpen:         'Open',
    filterResolved:     'Resolved',
    filterPending:      'Pending',

    /* ── COUNSELING PAGE ── */
    counselingTitle:    'Digital Counseling',
    counselingSubtitle: 'Talk to a counselor or AI assistant',
    startChat:          'Start Chat',
    sendMessage:        'Send',
    typePlaceholder:    'Type your message…',

    /* ── SAFE SCHOOL HUB PAGE ── */
    safeTitle:          'Safe School Hub',
    safeSubtitle:       'Your safety is our priority',

    /* ── COMMON ACTIONS ── */
    save:               'Save',
    cancel:             'Cancel',
    confirm:            'Confirm',
    delete:             'Delete',
    edit:               'Edit',
    close:              'Close',
    back:               'Back',
    next:               'Next',
    done:               'Done',
    loading:            'Loading…',
    errorMsg:           'Something went wrong. Please try again.',
  },

  id: {
    /* ── GLOBAL / NAVIGATION ── */
    brand:              'SafeSchoolHub',
    navDashboard:       'Dasbor',
    navEducational:     'Edukasi',
    navWellness:        'Pemantauan Kesehatan',
    navHydration:       'Hidrasi',
    navSleep:           'Tidur',
    navBreathing:       'Pernapasan',
    navReports:         'Laporkan Insiden',
    navCounseling:      'Konseling Digital',
    navSettings:        'Pengaturan',
    navHelp:            'Pusat Bantuan',
    navLogout:          'Keluar',

    /* ── SETTINGS PAGE ── */
    settings:           'Pengaturan',
    appearance:         'Tampilan',
    language:           'Bahasa',
    theme:              'Tema',
    lightTheme:         'Terang',
    darkTheme:          'Gelap',
    notifications:      'Notifikasi',
    privacy:            'Privasi & Data',
    downloadData:       'Unduh Data Saya',
    clearMoodHistory:   'Hapus Riwayat Suasana Hati',
    account:            'Akun',
    changePassword:     'Ubah Kata Sandi',
    logout:             'Keluar',
    updatePassword:     'Perbarui Kata Sandi',
    currentPassword:    'Kata sandi saat ini',
    newPassword:        'Kata sandi baru',
    passwordUpdated:    'Kata sandi diperbarui',
    languageChanged:    'Bahasa: Indonesia',
    themeChanged:       'Tema: {0}',

    /* ── DASHBOARD / INDEX ── */
    dashTitle:          'Kesejahteraan Siswa',
    dashSubtitle:       'Halo, Alex. Mari lihat perjalanan kesehatanmu minggu ini.',
    checkinBtn:         'Check-in Sekarang',
    moodTracker:        'Pelacak Suasana Hati',
    thisWeek:           'Minggu Ini',
    stressLevel:        'Tingkat Stres',
    dailyGoals:         'Target Harian',
    recentActivity:     'Aktivitas Terbaru',

    /* ── HYDRATION PAGE ── */
    hydrationTitle:     'Pelacak Hidrasi',
    hydrationSubtitle:  'Pantau asupan air harianmu',
    addWater:           'Tambah Air',
    dailyGoal:          'Target Harian',
    cupsToday:          'Gelas Hari Ini',
    hydrationTip:       'Minum cukup air meningkatkan fokus dan tingkat energi.',

    /* ── SLEEP PAGE ── */
    sleepTitle:         'Pelacak Tidur',
    sleepSubtitle:      'Pantau pola tidurmu',
    logSleep:           'Catat Tidur',
    bedtime:            'Jam Tidur',
    wakeTime:           'Jam Bangun',
    sleepDuration:      'Durasi Tidur',
    sleepQuality:       'Kualitas Tidur',
    sleepTip:           'Targetkan 8–10 jam tidur setiap malam untuk kesehatan optimal.',

    /* ── BREATHING PAGE ── */
    breathingTitle:     'Latihan Pernapasan',
    breathingSubtitle:  'Tenangkan pikiranmu dengan panduan pernapasan',
    startSession:       'Mulai Sesi',
    pauseSession:       'Jeda Sesi',
    resumeSession:      'Lanjutkan Sesi',
    customizePhases:    'Atur Fase',
    inhale:             'Tarik Napas',
    hold:               'Tahan',
    exhale:             'Hembuskan',
    roundComplete:      'Putaran selesai! 🎉',
    sessionStreak:      'Streak',

    /* ── EDUCATIONAL PAGE ── */
    educationalTitle:   'Sumber Edukasi',
    educationalSubtitle:'Pelajari kesehatan dan kebiasaan hidup sehat',
    readMore:           'Baca Selengkapnya',
    watchVideo:         'Tonton Video',

    /* ── GADGET / WELLNESS TRACKING PAGE ── */
    gadgetTitle:        'Pemantauan Kesehatan',
    gadgetSubtitle:     'Pantau waktu layar dan kebiasaan kesehatanmu',
    screenTime:         'Waktu Layar',
    todayUsage:         'Penggunaan Hari Ini',
    weeklyAverage:      'Rata-rata Mingguan',
    setLimit:           'Atur Batas',

    /* ── REPORTS PAGE ── */
    reportsTitle:       'Laporkan Insiden',
    reportsSubtitle:    'Semua laporan dikirim secara anonim',
    submitReport:       'Kirim Laporan',
    reportType:         'Jenis Insiden',
    reportLocation:     'Lokasi',
    reportDescription:  'Deskripsi',
    reportAnonymous:    'Identitasmu akan tetap anonim',
    exportCSV:          'Ekspor CSV',
    filterAll:          'Semua',
    filterOpen:         'Terbuka',
    filterResolved:     'Selesai',
    filterPending:      'Menunggu',

    /* ── COUNSELING PAGE ── */
    counselingTitle:    'Konseling Digital',
    counselingSubtitle: 'Bicara dengan konselor atau asisten AI',
    startChat:          'Mulai Chat',
    sendMessage:        'Kirim',
    typePlaceholder:    'Ketik pesanmu…',

    /* ── SAFE SCHOOL HUB PAGE ── */
    safeTitle:          'Safe School Hub',
    safeSubtitle:       'Keselamatanmu adalah prioritas kami',

    /* ── COMMON ACTIONS ── */
    save:               'Simpan',
    cancel:             'Batal',
    confirm:            'Konfirmasi',
    delete:             'Hapus',
    edit:               'Edit',
    close:              'Tutup',
    back:               'Kembali',
    next:               'Berikutnya',
    done:               'Selesai',
    loading:            'Memuat…',
    errorMsg:           'Terjadi kesalahan. Silakan coba lagi.',
  }
};

/* ─────────────────────────────────────────
   LangSystem — Public API
───────────────────────────────────────── */
const LangSystem = {

  /** Kembalikan bahasa aktif saat ini ('en' atau 'id') */
  getLang() {
    return localStorage.getItem('appLang') || 'en';
  },

  /** Simpan pilihan bahasa */
  setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    localStorage.setItem('appLang', lang);
    this._applyAll(lang);

    // Sync dropdown jika ada
    const sel = document.getElementById('langSel');
    if (sel) sel.value = lang;

    // Sync tombol flag jika ada
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    // Dispatch event supaya script lain bisa bereaksi
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  },

  /** Ambil teks terjemahan berdasarkan key */
  t(key) {
    const lang = this.getLang();
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key])
      || (TRANSLATIONS['en'] && TRANSLATIONS['en'][key])
      || key;
  },

  /** Terapkan terjemahan ke semua elemen bertanda data-i18n di halaman ini */
  _applyAll(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    // Teks biasa
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });

    // Placeholder input
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = dict[el.dataset.i18nPlaceholder];
      if (v !== undefined) el.placeholder = v;
    });

    // HTML inner (untuk konten yang mengandung tag)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = dict[el.dataset.i18nHtml];
      if (v !== undefined) el.innerHTML = v;
    });

    // Atribut title / aria-label
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const v = dict[el.dataset.i18nTitle];
      if (v !== undefined) el.title = v;
    });

    // Update tag <html lang="">
    document.documentElement.lang = lang;
  },

  /** Inject CSS select translate — dipanggil otomatis sekali */
  _injectCSS() {
    if (document.getElementById('lang-style')) return;
    const s = document.createElement('style');
    s.id = 'lang-style';
    s.textContent = `
      .lang-select{background:transparent;border:1.5px solid var(--outline-variant,#c1c7d1);border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;color:var(--on-surface-variant,#41474f);outline:none;transition:border-color .15s,color .15s}
      .lang-select:hover,.lang-select:focus{border-color:var(--primary,#106399);color:var(--primary,#106399)}
      .lang-select.sm{padding:2px 6px;font-size:10px;border-radius:6px}
    `;
    document.head.appendChild(s);
  },

  /** Inisialisasi — panggil sekali saat DOMContentLoaded atau di akhir <body> */
  init() {
    this._injectCSS();
    const lang = this.getLang();
    this._applyAll(lang);

    // Sync semua select langSel dan langSelMobile
    document.querySelectorAll('#langSel, #langSelMobile').forEach(sel => {
      sel.value = lang;
      sel.addEventListener('change', e => this.setLang(e.target.value));
    });
  }
};

// Auto-init saat DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LangSystem.init());
} else {
  LangSystem.init();
}
