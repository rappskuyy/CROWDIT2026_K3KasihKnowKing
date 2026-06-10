/**
 * lang.js — SafeSchoolHub Centralized Translation, Theme, and Modal Injection System
 */

// ── THEME RETRIEVAL & INITIALIZATION (RUNS IMMEDIATELY) ──
const initialTheme = localStorage.getItem('appTheme') || 'light';
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = 'dark';
} else {
  document.documentElement.classList.remove('dark');
  document.documentElement.style.colorScheme = 'light';
}

const TRANSLATIONS = {
  en: {
    /* ── GLOBAL / NAVIGATION ── */
    brand:              'SafeSchoolHub',
    studentWellness:    'STUDENT WELLNESS',
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
    editProfile:        'Edit Profile',

    /* ── DASHBOARD / INDEX ── */
    dashTitle:          'Student Wellness',
    dashSubtitle:       "Hello, {name}. Let's take a look at your well-being journey this week.",
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
    sleepQVeryBad:      'Very Bad',
    sleepQBad:          'Bad',
    sleepQFair:         'Fair',
    sleepQGood:         'Good',
    sleepQVeryGood:     'Very Good',

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
    breathEduTitle:     'Education & Importance of Maintaining Respiration',
    breathArt1Title:    'The Importance of Diaphragmatic Breathing',
    breathArt1Desc:     'Breathing with the diaphragm (belly) helps lower the stress hormone cortisol, stabilize blood pressure, and optimize your lung capacity.',
    breathArt2Title:    'The Connection Between Breathing and Study Focus',
    breathArt2Desc:     'When oxygen intake to the brain is maximized through correct breathing techniques, study focus, memory, and retention of academic material will increase dramatically.',
    breathArt3Title:    'Box Breathing Technique to Relieve Anxiety',
    breathArt3Desc:     'Box Breathing is a tactical breathing technique used to instantly relax the nervous system when facing exam anxiety or acute stress.',

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

    /* ── FOOTER & MODALS ── */
    footerPrivacy:      'Privacy Policy',
    footerTerms:        'Terms of Service',
    footerAccessibility:'Accessibility',
    footerContact:      'Contact Support',
    footerTagline:      'Promoting digital well-being for the next generation of learners.',
    footerCopyright:    '© 2024 SafeSchoolHub. All rights reserved.',
    footerCopyrightLong:'© 2024 SafeSchoolHub. All rights reserved. Built for student safety and emotional well-being.',

    /* ── NAV ALIASES ── */
    navWellnessTracking:'Wellness Tracking',
    navHelpCenter:      'Help Center',
    userName:           'Alex Johnson',
    userGrade:          'Grade 11-A',
    bnHome:             'Home',
    bnWellness:         'Wellness',

    /* ── CHECK-IN MODAL ── */
    checkinModalTitle:  'Daily Check-In',
    checkinNow:         'Check-in Now',
    submitCheckin:      'Submit Check-In',
    moodGreat:          'Great',
    moodGood:           'Good',
    moodNeutral:        'Neutral',
    moodLow:            'Low',
    moodStressed:       'Stressed',
    stressLow:          'Low',

    /* ── HYDRATION EXTENDED ── */
    hydTitle:           'Hydration Tracker',
    addCup:             'Add Cup',
    removeCup:          'Remove Cup',
    resetToday:         'Reset Today',
    setExactCups:       'Set Exact Cups',
    dailyGoal2L:        '2L Daily Goal',
    hydTip1:            'Drinking water boosts brain performance by up to 14%.',
    hydFact1:           'Even mild dehydration can impair concentration and memory.',
    hydFact2:           'Students who drink enough water perform 10% better on exams.',
    hydFirstCup:        'Log your first cup to get started!',
    hydStudy1:          'Drinking enough water keeps your body hydrated, improves focus, boosts energy levels, and helps prevent headaches or fatigue.',
    hydStudy2:          'Drinking enough water keeps your body hydrated, improves focus, boosts energy levels, and helps prevent headaches or fatigue.',
    hydLearnDesc:       'Understand why drinking water is essential for your body and brain.',
    hydLearnDescShort:  'Learn how staying hydrated impacts your health and learning.',
    peHydration:        'Tips for Daily Hydration',
    peHydDesc:          'Simple habits to make sure you drink enough water every day.',
    peHydDescShort:     'Quick tips to maintain your daily hydration.',
    peHydDetail:        'Keep a reusable water bottle near you, set daily reminders, and eat water-rich fruits like watermelon or oranges to stay refreshed.',
    recessHydration:    'Recess Hydration',
    waterCognitive:     'Importance of Drinking Enough Water',

    /* ── SLEEP EXTENDED ── */
    totalSleep:         'Total Sleep',
    totalTidur:         'Total Sleep',
    riwayatTidur:       'Sleep History',
    catatTidur:         'Log Sleep',
    simpanLog:          'Save Log',
    adjustSleepSchedule:'Adjust Sleep Schedule',
    aturJadwal:         'Set Schedule',
    sleepSubtitleID:    'Monitor your sleep patterns',
    nightlyInsights:    'Nightly Insights',
    nightlyTrends:      'Nightly Trends',
    sleepBreath:        'Sleep & Breathing',
    sleepCtatNote:      'Note: Sleep quality is recorded based on your self-assessment.',

    /* ── BREATHING EXTENDED ── */
    breathTitle:        'Breathing Exercise',
    breathSubtitle:     'Calm your mind with guided breathing',
    breathReady:        'Ready to begin',
    breathPhaseInhale:  'Inhale deeply',
    boxBreathing:       'Box Breathing',
    boxBreathingDesc:   'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Great for anxiety relief.',
    focusBreath:        'Focus Breathing',
    focusBreathDesc:    'Deep, rhythmic breathing to enhance concentration.',
    deepCalm:           'Deep Calm',
    deepCalmDesc:       'Extended exhale technique for deep relaxation.',
    customizeBreathing: 'Customize Breathing',
    customizeBtn:       'Customize',
    breathingCard:      'Breathing Exercises',
    startMeditation:    'Start Meditation',
    meditationTip:      'Regular meditation improves focus and reduces stress.',
    meditationAccess:   'Access Meditation',

    /* ── GADGET-TIME EXTENDED ── */
    gadgetTime:         'Gadget Time',
    totalScreenTime:    'Total Screen Time',
    highUsageAlert:     'High usage detected today. Consider a break.',
    screenActiveAlert:  'Screen time is above recommended levels.',
    screenTip:          'Limit screen time to 2 hours for better sleep.',
    startTimer:         'Start Timer',
    startStretch:       'Start Stretching',
    nextStretch:        'Next Stretch',
    stretchSession:     'Stretch Session',
    stretchInstruction: 'Follow the stretching exercise below.',
    dailyStretches:     'Daily Stretches',
    dailyRoutines:      'Daily Routines',
    mulaiTracking:      'Start Tracking',
    bukaGadgetTime:     'Open Gadget Time',
    mindfulnessDesc:    'Take a moment to practice mindfulness.',

    /* ── REPORTS EXTENDED ── */
    reportAnIncident:   'Report an Incident',
    reportIntro:        'All reports are anonymous and confidential.',
    reportDetails:      'Report Details',
    whatToReport:       'What would you like to report?',
    tellUsWhat:         'Tell us what happened',
    dateOfIncident:     'Date of Incident',
    locationOfIncident: 'Location of Incident',
    attachEvidence:     'Attach Evidence',
    attachDesc:         'Upload photos or documents as evidence.',
    uploadFiles:        'Upload Files',
    submitAnonReport:   'Submit Anonymous Report',
    anonymous:          'Anonymous',
    anonDesc:           'Your identity will remain completely hidden.',
    totalAnonymity:     'Total Anonymity',
    trackReport:        'Track Report',
    checkReportStatus:  'Check Report Status',
    yourReportId:       'Your Report ID',
    downloadReport:     'Download Report',
    statusOpen:         'Open',
    statusResolved:     'Resolved',

    /* ── COUNSELING EXTENDED ── */
    counselingIntro:    'Connect with our licensed professionals in a secure, private environment.',
    availableProfessionals:'Available Professionals',
    bookSession:        'Book Session',
    onlineNow:          'Online Now',
    confidential:       '100% Confidential',
    encryptedDesc:      'End-to-end encrypted messaging and private video consultations.',
    wellnessChat:       'Wellness Support Chat',
    secureConfidential: 'Secure & Confidential',
    counselorGreeting:  'Hi there! How are you feeling today? I\'m here if you want to talk about anything.',
    sessionScheduler:   'Session Scheduler',
    confirmAppointment: 'Confirm Appointment',
    mindfulnessBreak:   'Mindfulness Break',
    startExercise:      'Start Exercise',
    calmMindNow:        'Calm your mind now',
    support247:         '24/7 support available',
    counselingServices: 'Counseling Services',

    /* ── COMMON UI ── */
    viewAll:            'View All',
    viewDetails:        'View Details',
    lihatDetail:        'View Details',
    detailLink:         'Details',
    details:            'Details',
    actions:            'Actions',
    category:           'Category',
    type:               'Type',
    status:             'Status',
    location:           'Location',
    date:               'Date',
    description:        'Description',
    daily:              'Daily',
    weekly:             'Weekly',
    monthly:            'Monthly',
    lastWeek:           'Last Week',
    weeklyScore:        'Weekly Score',
    activeAlerts:       'Active Alerts',
    proTip:             'Pro Tip',
    themeLight:         'Light',
    privacyData:        'Privacy & Data',
    saveBtn:            'Save',
    cancelBtn:          'Cancel',
    confirmBtn:         'Confirm',
    applyBtn:           'Apply',
    backBtn:            'Back',
    nextBtn:            'Next',
    continueBtn:        'Continue'
  },

  id: {
    /* ── GLOBAL / NAVIGATION ── */
    brand:              'SafeSchoolHub',
    studentWellness:    'KESEJAHTERAN SISWA',
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
    editProfile:        'Edit Profil',

    /* ── DASHBOARD / INDEX ── */
    dashTitle:          'Kesejahteraan Siswa',
    dashSubtitle:       'Halo, {name}. Mari lihat perjalanan kesehatanmu minggu ini.',
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
    sleepQVeryBad:      'Sangat Buruk',
    sleepQBad:          'Buruk',
    sleepQFair:         'Cukup',
    sleepQGood:         'Baik',
    sleepQVeryGood:     'Sangat Baik',

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
    breathEduTitle:     'Edukasi & Pentingnya Menjaga Pernapasan',
    breathArt1Title:    'Pentingnya Bernapas dengan Diafragma',
    breathArt1Desc:     'Bernapas dengan diafragma (perut) membantu menurunkan hormon stres kortisol, menstabilkan tekanan darah, dan meningkatkan kapasitas paru-paru Anda secara optimal.',
    breathArt2Title:    'Kaitan Pernapasan dengan Konsentrasi Belajar',
    breathArt2Desc:     'Ketika asupan oksigen ke otak maksimal melalui teknik pernapasan yang benar, fokus belajar, daya ingat, dan retensi materi akademis Anda akan meningkat drastis.',
    breathArt3Title:    'Teknik Box Breathing untuk Meredakan Kecemasan',
    breathArt3Desc:     'Box Breathing adalah teknik pernapasan taktis yang digunakan untuk merilekskan sistem saraf secara instan saat menghadapi kecemasan atau stres ujian.',

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

    /* ── FOOTER & MODALS ── */
    footerPrivacy:      'Kebijakan Privasi',
    footerTerms:        'Ketentuan Layanan',
    footerAccessibility:'Aksesibilitas',
    footerContact:      'Hubungi Dukungan',
    footerTagline:      'Mempromosikan kesejahteraan digital bagi generasi pelajar berikutnya.',
    footerCopyright:    '© 2024 SafeSchoolHub. Hak Cipta Dilindungi.',
    footerCopyrightLong:'© 2024 SafeSchoolHub. Hak Cipta Dilindungi. Dibangun untuk keselamatan dan kesejahteraan emosional siswa.',

    /* ── NAV ALIASES ── */
    navWellnessTracking:'Pemantauan Kesehatan',
    navHelpCenter:      'Pusat Bantuan',
    userName:           'Alex Johnson',
    userGrade:          'Kelas 11-A',
    bnHome:             'Beranda',
    bnWellness:         'Kesehatan',

    /* ── CHECK-IN MODAL ── */
    checkinModalTitle:  'Check-In Harian',
    checkinNow:         'Check-in Sekarang',
    submitCheckin:      'Kirim Check-In',
    moodGreat:          'Sangat Baik',
    moodGood:           'Baik',
    moodNeutral:        'Biasa',
    moodLow:            'Kurang Baik',
    moodStressed:       'Stres',
    stressLow:          'Rendah',

    /* ── HYDRATION EXTENDED ── */
    hydTitle:           'Pelacak Hidrasi',
    addCup:             'Tambah Gelas',
    removeCup:          'Kurangi Gelas',
    resetToday:         'Reset Hari Ini',
    setExactCups:       'Atur Jumlah Gelas',
    dailyGoal2L:        'Target Harian 2L',
    hydTip1:            'Minum air meningkatkan kinerja otak hingga 14%.',
    hydFact1:           'Dehidrasi ringan saja dapat mengganggu konsentrasi dan daya ingat.',
    hydFact2:           'Siswa yang cukup minum tampil 10% lebih baik di ujian.',
    hydFirstCup:        'Catat gelas pertamamu untuk memulai!',
    hydStudy1:          'Minum air yang cukup menjaga tubuh tetap terhidrasi, meningkatkan fokus, menambah tingkat energi, serta membantu mencegah sakit kepala atau kelelahan.',
    hydStudy2:          'Minum air yang cukup menjaga tubuh tetap terhidrasi, meningkatkan fokus, menambah tingkat energi, serta membantu mencegah sakit kepala atau kelelahan.',
    hydLearnDesc:       'Pahami mengapa minum air sangat penting bagi tubuh dan otak Anda.',
    hydLearnDescShort:  'Pelajari bagaimana menjaga hidrasi berdampak pada kesehatan dan belajar.',
    peHydration:        'Tips Menjaga Hidrasi Harian',
    peHydDesc:          'Kebiasaan sederhana untuk memastikan Anda minum cukup air setiap hari.',
    peHydDescShort:     'Tips cepat untuk menjaga hidrasi harian Anda.',
    peHydDetail:        'Bawa selalu botol minum sendiri, pasang pengingat harian, dan konsumsi buah-buahan kaya air seperti semangka atau jeruk agar tetap segar.',
    recessHydration:    'Hidrasi Saat Istirahat',
    waterCognitive:     'Pentingnya Minum Air Cukup',

    /* ── SLEEP EXTENDED ── */
    totalSleep:         'Total Tidur',
    totalTidur:         'Total Tidur',
    riwayatTidur:       'Riwayat Tidur',
    catatTidur:         'Catat Tidur',
    simpanLog:          'Simpan Catatan',
    adjustSleepSchedule:'Atur Jadwal Tidur',
    aturJadwal:         'Atur Jadwal',
    sleepSubtitleID:    'Pantau pola tidurmu',
    nightlyInsights:    'Wawasan Malam',
    nightlyTrends:      'Tren Tidur Malam',
    sleepBreath:        'Tidur & Pernapasan',
    sleepCtatNote:      'Catatan: Kualitas tidur dicatat berdasarkan penilaian mandiri Anda.',

    /* ── BREATHING EXTENDED ── */
    breathTitle:        'Latihan Pernapasan',
    breathSubtitle:     'Tenangkan pikiranmu dengan panduan pernapasan',
    breathReady:        'Siap untuk memulai',
    breathPhaseInhale:  'Tarik napas dalam',
    boxBreathing:       'Box Breathing',
    boxBreathingDesc:   'Tarik 4d, Tahan 4d, Hembuskan 4d, Tahan 4d. Bagus untuk meredakan kecemasan.',
    focusBreath:        'Napas Fokus',
    focusBreathDesc:    'Pernapasan berirama untuk meningkatkan konsentrasi.',
    deepCalm:           'Ketenangan Dalam',
    deepCalmDesc:       'Teknik hembusan panjang untuk relaksasi mendalam.',
    customizeBreathing: 'Atur Pernapasan',
    customizeBtn:       'Sesuaikan',
    breathingCard:      'Latihan Pernapasan',
    startMeditation:    'Mulai Meditasi',
    meditationTip:      'Meditasi rutin meningkatkan fokus dan mengurangi stres.',
    meditationAccess:   'Akses Meditasi',

    /* ── GADGET-TIME EXTENDED ── */
    gadgetTime:         'Waktu Gadget',
    totalScreenTime:    'Total Waktu Layar',
    highUsageAlert:     'Penggunaan tinggi terdeteksi hari ini. Pertimbangkan istirahat.',
    screenActiveAlert:  'Waktu layar melebihi batas yang direkomendasikan.',
    screenTip:          'Batasi waktu layar 2 jam untuk tidur lebih baik.',
    startTimer:         'Mulai Timer',
    startStretch:       'Mulai Peregangan',
    nextStretch:        'Peregangan Berikutnya',
    stretchSession:     'Sesi Peregangan',
    stretchInstruction: 'Ikuti latihan peregangan di bawah ini.',
    dailyStretches:     'Peregangan Harian',
    dailyRoutines:      'Rutinitas Harian',
    mulaiTracking:      'Mulai Pemantauan',
    bukaGadgetTime:     'Buka Waktu Gadget',
    mindfulnessDesc:    'Luangkan waktu untuk berlatih kesadaran penuh.',

    /* ── REPORTS EXTENDED ── */
    reportAnIncident:   'Laporkan Insiden',
    reportIntro:        'Semua laporan bersifat anonim dan rahasia.',
    reportDetails:      'Detail Laporan',
    whatToReport:       'Apa yang ingin Anda laporkan?',
    tellUsWhat:         'Ceritakan apa yang terjadi',
    dateOfIncident:     'Tanggal Kejadian',
    locationOfIncident: 'Lokasi Kejadian',
    attachEvidence:     'Lampirkan Bukti',
    attachDesc:         'Unggah foto atau dokumen sebagai bukti.',
    uploadFiles:        'Unggah File',
    submitAnonReport:   'Kirim Laporan Anonim',
    anonymous:          'Anonim',
    anonDesc:           'Identitas Anda akan tetap tersembunyi sepenuhnya.',
    totalAnonymity:     'Anonimitas Total',
    trackReport:        'Lacak Laporan',
    checkReportStatus:  'Periksa Status Laporan',
    yourReportId:       'ID Laporan Anda',
    downloadReport:     'Unduh Laporan',
    statusOpen:         'Terbuka',
    statusResolved:     'Selesai',

    /* ── COUNSELING EXTENDED ── */
    counselingIntro:    'Terhubung dengan profesional berlisensi kami dalam lingkungan yang aman dan privat.',
    availableProfessionals:'Profesional yang Tersedia',
    bookSession:        'Pesan Sesi',
    onlineNow:          'Online Sekarang',
    confidential:       '100% Rahasia',
    encryptedDesc:      'Pesan terenkripsi end-to-end dan konsultasi video privat.',
    wellnessChat:       'Chat Dukungan Kesehatan',
    secureConfidential: 'Aman & Rahasia',
    counselorGreeting:  'Halo! Bagaimana perasaanmu hari ini? Saya di sini jika kamu ingin berbicara tentang apa saja.',
    sessionScheduler:   'Jadwal Sesi',
    confirmAppointment: 'Konfirmasi Janji Temu',
    mindfulnessBreak:   'Istirahat Kesadaran',
    startExercise:      'Mulai Latihan',
    calmMindNow:        'Tenangkan pikiranmu sekarang',
    support247:         'Dukungan 24/7 tersedia',
    counselingServices: 'Layanan Konseling',

    /* ── COMMON UI ── */
    viewAll:            'Lihat Semua',
    viewDetails:        'Lihat Detail',
    lihatDetail:        'Lihat Detail',
    detailLink:         'Detail',
    details:            'Detail',
    actions:            'Tindakan',
    category:           'Kategori',
    type:               'Jenis',
    status:             'Status',
    location:           'Lokasi',
    date:               'Tanggal',
    description:        'Deskripsi',
    daily:              'Harian',
    weekly:             'Mingguan',
    monthly:            'Bulanan',
    lastWeek:           'Minggu Lalu',
    weeklyScore:        'Skor Mingguan',
    activeAlerts:       'Peringatan Aktif',
    proTip:             'Tips Pro',
    themeLight:         'Terang',
    privacyData:        'Privasi & Data',
    saveBtn:            'Simpan',
    cancelBtn:          'Batal',
    confirmBtn:         'Konfirmasi',
    applyBtn:           'Terapkan',
    backBtn:            'Kembali',
    nextBtn:            'Berikutnya',
    continueBtn:        'Lanjutkan'
  }
};

const LangSystem = {
  getLang() {
    return 'id';
  },

  setLang(lang) {
    localStorage.setItem('appLang', 'id');
    this._applyAll('id');
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: 'id' } }));
  },

  t(key) {
    const lang = 'id';
    return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
  },

  _applyAll(lang) {
    const dict = TRANSLATIONS['id'] || TRANSLATIONS['en'];

    let firstName = 'Alex';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const fullName = user.name || localStorage.getItem('profileName') || 'Alex';
      firstName = fullName.split(' ')[0];
    } catch(e) {}

    document.querySelectorAll('[data-i18n]').forEach(el => {
      let v = dict[el.dataset.i18n];
      if (v !== undefined) {
        if (typeof v === 'string') v = v.replace(/{name}/g, firstName);
        el.textContent = v;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      let v = dict[el.dataset.i18nPlaceholder];
      if (v !== undefined) {
        if (typeof v === 'string') v = v.replace(/{name}/g, firstName);
        el.placeholder = v;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      let v = dict[el.dataset.i18nHtml];
      if (v !== undefined) {
        if (typeof v === 'string') v = v.replace(/{name}/g, firstName);
        el.innerHTML = v;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      let v = dict[el.dataset.i18nTitle];
      if (v !== undefined) {
        if (typeof v === 'string') v = v.replace(/{name}/g, firstName);
        el.title = v;
      }
    });

    document.documentElement.lang = 'id';
  },

  init() {
    this._applyAll('id');
  }
};

// ── THEME MANAGEMENT FUNCTIONS FOR APP-WIDE USE ──
const ThemeSystem = {
  getTheme() {
    return localStorage.getItem('appTheme') || 'light';
  },
  setTheme(theme) {
    localStorage.setItem('appTheme', theme);
    this.apply(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  },
  apply(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (document.body) {
        document.body.classList.add('dark-theme');
        document.body.style.backgroundColor = '#0f1419';
        document.body.style.color = '#e3e7ee';
      }
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      if (document.body) {
        document.body.classList.remove('dark-theme');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
      document.documentElement.style.colorScheme = 'light';
    }
  },
  init() {
    this.apply(this.getTheme());
  }
};

// Auto-run theme application when document body is ready
if (document.body) {
  ThemeSystem.init();
} else {
  document.addEventListener('DOMContentLoaded', () => ThemeSystem.init());
}

// ── DOM SETUP, MODAL INJECTION & MOBILE HAMBURGER MENU ──
document.addEventListener('DOMContentLoaded', () => {
  // Prepend style sheet
  if (!document.getElementById('langSystemInjectedStyles')) {
    const style = document.createElement('style');
    style.id = 'langSystemInjectedStyles';
    style.textContent = `
      .mobile-sidebar-backdrop {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .mobile-sidebar-backdrop.open {
        opacity: 1;
        display: block !important;
      }
      .mobile-sidebar-backdrop.open .mobile-sidebar {
        transform: translateX(0);
      }
      .mobile-sidebar {
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
      }
      body.dark-theme .modal-card {
        background-color: #1a1f2e !important;
        color: #e3e7ee !important;
        border: 1px solid #3a4550 !important;
      }
      body.dark-theme .modal-card h3,
      body.dark-theme .modal-card h4,
      body.dark-theme .modal-card label {
        color: #e3e7ee !important;
      }
      body.dark-theme .modal-card p,
      body.dark-theme .modal-card span {
        color: #c1c7d1 !important;
      }
      body.dark-theme .modal-card .bg-surface-container-lowest {
        background-color: #0f1419 !important;
        border-color: #3a4550 !important;
      }
      body.dark-theme .modal-card select,
      body.dark-theme .modal-card textarea,
      body.dark-theme .modal-card input {
        background-color: #0f1419 !important;
        color: #e3e7ee !important;
        border-color: #3a4550 !important;
      }
      body.dark-theme .mobile-sidebar {
        background-color: #1a1f2e !important;
        color: #e3e7ee !important;
        border-color: #3a4550 !important;
      }
      body.dark-theme .mobile-sidebar .nav-link {
        color: #c1c7d1 !important;
      }
      body.dark-theme .mobile-sidebar .nav-link:hover {
        background-color: #282e39 !important;
      }
      body.dark-theme .mobile-sidebar .nav-link.active {
        background-color: #282e39 !important;
        color: var(--primary) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 1. Initialize translation
  LangSystem.init();

  // 2. Inject help center and footer modals if they don't exist
  if (!document.getElementById('helpCenterModal')) {
    const backdropContainer = document.createElement('div');
    backdropContainer.innerHTML = `
      <!-- Help Center Modal -->
      <div class="modal-backdrop" id="helpCenterModal" onclick="if(event.target===this)closeHelpCenter()">
        <div class="modal-card max-w-[500px] w-full bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4 border-b pb-3 border-outline-variant">
            <h3 class="font-extrabold text-xl flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined">help</span>
              <span data-i18n="navHelp">Help Center</span>
            </h3>
            <button onclick="closeHelpCenter()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2" style="scrollbar-width:thin;">
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
              <h4 class="font-bold text-sm text-primary">Apa itu SafeSchoolHub?</h4>
              <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">SafeSchoolHub adalah dasbor kesehatan terintegrasi untuk membantu memantau asupan air harian (hidrasi), kualitas tidur harian, waktu layar, latihan pernapasan, serta konsultasi konseling online secara aman dan rahasia.</p>
            </div>
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
              <h4 class="font-bold text-sm text-primary">Bagaimana data saya dilacak?</h4>
              <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Semua data pelacakan disimpan sepenuhnya di perangkat pribadi Anda secara lokal (Local Storage browser). Tidak ada data pelacakan kesehatan pribadi Anda yang dikirim ke server luar.</p>
            </div>
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest">
              <h4 class="font-bold text-sm text-primary">Bagaimana cara melaporkan insiden secara anonim?</h4>
              <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Anda dapat mengklik tombol "Report Incident" untuk mengisi detail insiden tanpa menginput identitas diri Anda. Laporan akan terkirim secara anonim langsung ke konselor sekolah.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Policy Modal -->
      <div class="modal-backdrop" id="privacyPolicyModal" onclick="if(event.target===this)closePrivacyPolicy()">
        <div class="modal-card max-w-[500px] w-full bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4 border-b pb-3 border-outline-variant">
            <h3 class="font-extrabold text-xl flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined">privacy_tip</span>
              <span data-i18n="footerPrivacy">Privacy Policy</span>
            </h3>
            <button onclick="closePrivacyPolicy()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="text-xs text-on-surface-variant space-y-3 max-h-[60vh] overflow-y-auto pr-2" style="scrollbar-width:thin; line-height: 1.6;">
            <p class="font-semibold text-on-surface">Terakhir Diperbarui: Juni 2026</p>
            <p>SafeSchoolHub menjaga kerahasiaan data Anda secara ketat. Seluruh informasi kesehatan pribadi (seperti volume hidrasi, statistik tidur, suasana hati, dll.) disimpan sepenuhnya pada Local Storage browser perangkat lokal Anda dan tidak dikirim ke server mana pun.</p>
            <p>Laporan insiden yang dikirimkan menggunakan fitur pelaporan diproses secara anonim guna melindungi privasi pelapor di lingkungan sekolah.</p>
          </div>
        </div>
      </div>

      <!-- Terms of Service Modal -->
      <div class="modal-backdrop" id="termsOfServiceModal" onclick="if(event.target===this)closeTermsOfService()">
        <div class="modal-card max-w-[500px] w-full bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4 border-b pb-3 border-outline-variant">
            <h3 class="font-extrabold text-xl flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined">gavel</span>
              <span data-i18n="footerTerms">Terms of Service</span>
            </h3>
            <button onclick="closeTermsOfService()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="text-xs text-on-surface-variant space-y-3 max-h-[60vh] overflow-y-auto pr-2" style="scrollbar-width:thin; line-height: 1.6;">
            <p class="font-semibold text-on-surface">Terakhir Diperbarui: Juni 2026</p>
            <p>Dengan mengakses SafeSchoolHub, Anda menyetujui Ketentuan Layanan ini. Dasbor ini disediakan bagi siswa untuk memantau kesehatan mental dan fisik secara mandiri demi meningkatkan kesejahteraan belajar.</p>
            <p>Platform ini bukan pengganti diagnosis medis profesional. Harap hubungi konselor sekolah atau tenaga kesehatan profesional apabila Anda membutuhkan bantuan darurat.</p>
          </div>
        </div>
      </div>

      <!-- Accessibility Modal -->
      <div class="modal-backdrop" id="accessibilityModal" onclick="if(event.target===this)closeAccessibility()">
        <div class="modal-card max-w-[500px] w-full bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4 border-b pb-3 border-outline-variant">
            <h3 class="font-extrabold text-xl flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined">accessibility</span>
              <span data-i18n="footerAccessibility">Accessibility</span>
            </h3>
            <button onclick="closeAccessibility()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="text-xs text-on-surface-variant space-y-3 max-h-[60vh] overflow-y-auto pr-2" style="scrollbar-width:thin; line-height: 1.6;">
            <p>Kami berupaya keras memastikan SafeSchoolHub dapat diakses dengan mudah oleh seluruh kalangan siswa tanpa terkecuali.</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Mendukung keterbacaan dengan tingkat kontras warna yang aman.</li>
              <li>Responsif dan ramah pembaca layar (screen readers).</li>
              <li>Navigasi keyboard yang ramah aksesibilitas.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contact Support Modal -->
      <div class="modal-backdrop" id="contactSupportModal" onclick="if(event.target===this)closeContactSupport()">
        <div class="modal-card max-w-[420px] w-full bg-surface-container-lowest rounded-2xl p-6 shadow-2xl relative" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4 border-b pb-3 border-outline-variant">
            <h3 class="font-extrabold text-xl flex items-center gap-2 text-primary">
              <span class="material-symbols-outlined">mail</span>
              <span data-i18n="footerContact">Contact Support</span>
            </h3>
            <button onclick="closeContactSupport()" class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form onsubmit="submitContactSupport(event)" class="space-y-4">
            <div>
              <label class="text-[10px] font-bold text-on-surface-variant mb-1 block">TOPIK / MASALAH</label>
              <select class="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold bg-surface-container-lowest outline-none focus:border-primary" id="supportTopic">
                <option>Pertanyaan Umum</option>
                <option>Masalah Sistem / Bug</option>
                <option>Saran Fitur</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold text-on-surface-variant mb-1 block">PESAN ANDA</label>
              <textarea required class="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold bg-surface-container-lowest outline-none focus:border-primary h-24 resize-none" id="supportMessage" placeholder="Bagaimana kami bisa membantu Anda?"></textarea>
            </div>
            <button type="submit" class="btn-primary w-full justify-center">Kirim Tiket Dukungan</button>
          </form>
        </div>
      </div>
    `;
    while (backdropContainer.firstElementChild) {
      document.body.appendChild(backdropContainer.firstElementChild);
    }
  }

  // 3. Inject accessibility link to footer
  document.querySelectorAll('footer').forEach(footer => {
    const linkContainer = footer.querySelector('.flex.flex-wrap.gap-4') || footer.querySelector('.flex.gap-4') || footer;
    if (linkContainer && !linkContainer.querySelector('[data-i18n="footerAccessibility"]')) {
      const accLink = document.createElement('a');
      accLink.className = 'hover:text-primary cursor-pointer transition-colors';
      accLink.setAttribute('data-i18n', 'footerAccessibility');
      accLink.textContent = LangSystem.t('footerAccessibility');
      accLink.onclick = (e) => { e.preventDefault(); openAccessibility(); };
      
      // Try to insert before Contact or just append
      const contactLink = linkContainer.querySelector('[data-i18n="footerContact"]') || linkContainer.querySelector('a:last-child');
      if (contactLink) {
        linkContainer.insertBefore(accLink, contactLink);
      } else {
        linkContainer.appendChild(accLink);
      }
    }
  });

  // Re-translate newly added dynamic elements
  LangSystem._applyAll(LangSystem.getLang());

  // 4. Bind events to any help or footer links that exist statically
  document.querySelectorAll('a, button').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    const i18n = el.getAttribute('data-i18n');
    
    if (i18n === 'navHelp' || i18n === 'navHelpCenter' || text === 'help center' || text === 'pusat bantuan' || el.querySelector('[data-i18n="navHelp"]') || el.querySelector('[data-i18n="navHelpCenter"]')) {
      el.onclick = (e) => { e.preventDefault(); openHelpCenter(); };
      el.style.cursor = 'pointer';
    } else if (i18n === 'footerPrivacy' || text === 'privacy policy' || text === 'kebijakan privasi') {
      el.onclick = (e) => { e.preventDefault(); openPrivacyPolicy(); };
      el.style.cursor = 'pointer';
    } else if (i18n === 'footerTerms' || text === 'terms of service' || text === 'ketentuan layanan') {
      el.onclick = (e) => { e.preventDefault(); openTermsOfService(); };
      el.style.cursor = 'pointer';
    } else if (i18n === 'footerAccessibility' || text === 'accessibility' || text === 'aksesibilitas') {
      el.onclick = (e) => { e.preventDefault(); openAccessibility(); };
      el.style.cursor = 'pointer';
    } else if (i18n === 'footerContact' || text === 'contact support' || text === 'hubungi dukungan') {
      el.onclick = (e) => { e.preventDefault(); openContactSupport(); };
      el.style.cursor = 'pointer';
    }
  });

  // 5. Prepend hamburger button to top mobile bars
  document.querySelectorAll('.top-bar-mobile').forEach(header => {
    if (!header.querySelector('.mobile-menu-btn')) {
      const btn = document.createElement('button');
      btn.className = 'mobile-menu-btn text-on-surface-variant flex items-center justify-center mr-3 focus:outline-none';
      btn.style.marginRight = '12px';
      btn.setAttribute('aria-label', 'Toggle Menu');
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 28px;">menu</span>';
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleMobileSidebar();
      };
      
      const firstChild = header.firstElementChild;
      if (firstChild && firstChild.classList.contains('flex')) {
        firstChild.insertBefore(btn, firstChild.firstElementChild);
      } else {
        header.insertBefore(btn, header.firstElementChild);
      }
    }
  });

  // 6. Inject Mobile Sidebar Drawer Overlay
  if (!document.getElementById('mobileSidebarBackdrop')) {
    // Determine active route based on active links in desktop sidebar
    let activeRoute = '';
    const desktopLinks = document.querySelectorAll('.sidebar-desktop nav a');
    desktopLinks.forEach(link => {
      if (link.classList.contains('active')) {
        const routeAttr = link.getAttribute('data-route') || link.getAttribute('href')?.replace('.html', '');
        if (routeAttr) activeRoute = routeAttr;
      }
    });

    const sidebarBackdrop = document.createElement('div');
    sidebarBackdrop.id = 'mobileSidebarBackdrop';
    sidebarBackdrop.className = 'mobile-sidebar-backdrop fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm z-50 hidden';
    sidebarBackdrop.onclick = toggleMobileSidebar;

    sidebarBackdrop.innerHTML = `
      <aside class="mobile-sidebar fixed top-0 left-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col transform -translate-x-full transition-transform duration-300 ease-in-out" onclick="event.stopPropagation()">
        <div class="px-5 py-5 flex items-center justify-between border-b border-outline-variant flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span class="material-symbols-outlined icon-fill" style="font-size:18px">shield</span>
            </div>
            <span class="font-extrabold text-on-surface" data-i18n="brand">SafeSchoolHub</span>
          </div>
          <button class="text-on-surface-variant flex items-center justify-center" onclick="toggleMobileSidebar()">
            <span class="material-symbols-outlined" style="font-size: 22px;">close</span>
          </button>
        </div>
        <nav class="px-3 py-4 flex flex-col gap-1 overflow-y-auto flex-1">
          <a class="nav-link ${activeRoute === 'overview' || activeRoute === 'index' ? 'active' : ''}" href="index.html" data-route="overview"><span class="material-symbols-outlined">dashboard</span><span data-i18n="navDashboard">Dashboard</span></a>
          <a class="nav-link ${activeRoute === 'educational' ? 'active' : ''}" href="educational.html" data-route="educational"><span class="material-symbols-outlined">school</span><span data-i18n="navEducational">Educational</span></a>
          <a class="nav-link ${activeRoute === 'gadget-time' ? 'active' : ''}" href="gadget-time.html" data-route="gadget-time"><span class="material-symbols-outlined">monitor_heart</span><span data-i18n="navWellness">Wellness Tracking</span></a>
          <a class="nav-link ${activeRoute === 'hydration' ? 'active' : ''}" href="hydration.html" data-route="hydration"><span class="material-symbols-outlined">water_drop</span><span data-i18n="navHydration">Hydration</span></a>
          <a class="nav-link ${activeRoute === 'sleep' ? 'active' : ''}" href="sleep.html" data-route="sleep"><span class="material-symbols-outlined">bedtime</span><span data-i18n="navSleep">Sleep</span></a>
          <a class="nav-link ${activeRoute === 'breathing' ? 'active' : ''}" href="breathing.html" data-route="breathing"><span class="material-symbols-outlined">self_improvement</span><span data-i18n="navBreathing">Breathing</span></a>
          <a class="nav-link ${activeRoute === 'counseling' ? 'active' : ''}" href="counseling.html" data-route="counseling"><span class="material-symbols-outlined">support_agent</span><span data-i18n="navCounseling">Digital Counseling</span></a>
          <a class="nav-link ${activeRoute === 'settings' ? 'active' : ''}" href="settings.html" data-route="settings"><span class="material-symbols-outlined">settings</span><span data-i18n="navSettings">Settings</span></a>
          <div style="flex-grow: 1; min-height: 20px;"></div>
          <a class="nav-link" id="mobile-help-btn"><span class="material-symbols-outlined">help_outline</span><span data-i18n="navHelp">Help Center</span></a>
          <a class="nav-link" id="mobile-logout-btn"><span class="material-symbols-outlined">logout</span><span data-i18n="navLogout">Log Out</span></a>
        </nav>
      </aside>
    `;
    document.body.appendChild(sidebarBackdrop);

    // Apply active route styling
    sidebarBackdrop.querySelectorAll('.nav-link').forEach(link => {
      if (link.classList.contains('active')) {
        link.classList.add('bg-surface-container-high', 'text-primary', 'font-bold');
        link.querySelector('.material-symbols-outlined')?.classList.add('icon-fill');
      }
    });

    // Translate mobile sidebar
    LangSystem._applyAll(LangSystem.getLang());

    // Bind events
    const mobLogout = document.getElementById('mobile-logout-btn');
    if (mobLogout) {
      mobLogout.onclick = (e) => {
        e.preventDefault();
        toggleMobileSidebar();
        const logoutBtn = document.getElementById('sidebar-logout');
        if (logoutBtn) {
          logoutBtn.click();
        } else {
          // Fallback logout behavior
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('user');
          window.location.replace('safeschool-landing.html');
        }
      };
    }

    const mobHelp = document.getElementById('mobile-help-btn');
    if (mobHelp) {
      mobHelp.onclick = (e) => {
        e.preventDefault();
        toggleMobileSidebar();
        openHelpCenter();
      };
    }
  }
});

// ── GLOBAL UTILITY FUNCTIONS FOR MODAL TOGGLES ──
window.toggleMobileSidebar = function() {
  const backdrop = document.getElementById('mobileSidebarBackdrop');
  if (backdrop) {
    if (backdrop.classList.contains('hidden')) {
      backdrop.classList.remove('hidden');
      backdrop.offsetHeight; // force reflow
      backdrop.classList.add('open');
    } else {
      backdrop.classList.remove('open');
      setTimeout(() => {
        if (!backdrop.classList.contains('open')) {
          backdrop.classList.add('hidden');
        }
      }, 300);
    }
  }
};

window.openHelpCenter = function() {
  const modal = document.getElementById('helpCenterModal');
  if (modal) modal.classList.add('open');
};
window.closeHelpCenter = function() {
  const modal = document.getElementById('helpCenterModal');
  if (modal) modal.classList.remove('open');
};

window.openPrivacyPolicy = function() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.classList.add('open');
};
window.closePrivacyPolicy = function() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.classList.remove('open');
};

window.openTermsOfService = function() {
  const modal = document.getElementById('termsOfServiceModal');
  if (modal) modal.classList.add('open');
};
window.closeTermsOfService = function() {
  const modal = document.getElementById('termsOfServiceModal');
  if (modal) modal.classList.remove('open');
};

window.openAccessibility = function() {
  const modal = document.getElementById('accessibilityModal');
  if (modal) modal.classList.add('open');
};
window.closeAccessibility = function() {
  const modal = document.getElementById('accessibilityModal');
  if (modal) modal.classList.remove('open');
};

window.openContactSupport = function() {
  const modal = document.getElementById('contactSupportModal');
  if (modal) modal.classList.add('open');
};
window.closeContactSupport = function() {
  const modal = document.getElementById('contactSupportModal');
  if (modal) modal.classList.remove('open');
};

window.submitContactSupport = function(e) {
  e.preventDefault();
  if (typeof showToast === 'function') {
    showToast(LangSystem.getLang() === 'id' ? '✅ Tiket dukungan terkirim!' : '✅ Support ticket submitted!', 'success');
  } else {
    alert(LangSystem.getLang() === 'id' ? '✅ Tiket dukungan terkirim!' : '✅ Support ticket submitted!');
  }
  closeContactSupport();
  e.target.reset();
};
