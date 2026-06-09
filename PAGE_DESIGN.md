# SafeSchoolHub Page Design

## Ringkasan Umum
SafeSchoolHub adalah aplikasi wellness sekolah dengan tampilan dashboard modern, konsisten, dan fokus pada pengalaman siswa.

- Font: `Plus Jakarta Sans`
- Warna utama: biru `#106399`
- Warna sekunder: hijau `#1c6c3f`
- Tema visual: card-based layout, white surface, rounded corners, shadow lembut, dan animasi transisi ringan
- Struktur UI umum:
  - sidebar desktop tetap di sebelah kiri
  - top bar mobile sticky untuk layar kecil
  - halaman utama dengan `main` content dan card-grid
  - toast notification sebagai overlay global

## Komponen Global
- Sidebar dengan daftar page: Dashboard, Educational, Wellness Tracking, Hydration, Sleep, Breathing, Digital Counseling, Settings
- User card di bawah sidebar: menampilkan nama pengguna dan kelas
- Mobile top bar dengan branding dan avatar ringkas
- Button style konsisten:
  - `.btn-primary`: rounded full, background biru, teks putih
  - `.btn-ghost`: border lembut, background transparan, hover surface
- Tab dan pill UI untuk filter, fase, dan status
- Responsive layout: grid responsif, hidden sidebar pada mobile, bottom nav pada beberapa page

## `index.html` — Student Wellness Dashboard
### Tujuan
Halaman utama untuk ringkasan kesehatan siswa: mood tracker, stres, tidur, hidrasi, dan rekomendasi cepat.

### Desain
- Header besar dengan judul dan tombol `Check-in Now`
- Grid utama 12 kolom dengan kartu:
  - Mood Tracker dengan pilihan emoji dan chart
  - Stress Level card dengan progress bar dan CTA ke breathing
  - Sleep Quality card dengan tabs untuk awake/REM/deep
  - Hydration card ringkas dengan jumlah gelas dan status
  - Breathing shortcuts dengan box breathing / sleep breath
- Bottom nav mobile hadir untuk akses cepat
- Page juga mendukung modal check-in, customize breathing, stretch session, dll.

### Pengalaman
Siswa bisa melihat kondisi wellness harian secara ringkas, memilih mood, dan langsung menuju fitur pendukung.

## `educational.html` — Educational Hub
### Tujuan
Menjadi pusat pembelajaran untuk video, artikel, seminar, dan quiz keamanan.

### Desain
- Header dengan badge XP dan sertifikat
- Banner sertifikat dengan informasi reward
- Section tab: Video Learning, Artikel Terbaru, Seminar, Safety Quiz
- Featured video card dengan overlay play, durasi, badge sertifikat
- Grid video learning yang dinamis
- Tab articles dengan filter kategori
- UI video card dengan thumbnail, badge, dan informasi ringkas

### Pengalaman
Memberikan elemen gamifikasi (XP, sertifikat), sehingga siswa terpacu mempelajari materi kesehatan dan keselamatan.

## `reports.html` — Report an Incident
### Tujuan
Halaman pelaporan insiden dengan flow multi-step untuk kategori, detail, dan bukti.

### Desain
- Sidebar tetap, layout dua kolom: form besar + info panel
- Stepper multi-step dengan progress bar dan ikon
- Step 1: pemilihan kategori insiden
- Step 2: input lokasi, tanggal, dan deskripsi
- Step 3: upload bukti optional
- Sidebar kanan berisi tracking ID, anonimity info, dan CTA check status

### Pengalaman
Menyediakan alur pelaporan yang aman, terstruktur, dan anonim sehingga siswa merasa aman melapor.

## `breathing.html` — Breathing & Mindfulness
### Tujuan
Memberi latihan pernapasan dan mindfulness untuk menurunkan stres.

### Desain
- Hero dengan status mindfullness dan streak
- Dua kolom: visualizer pernapasan di kiri, routines dan summary di kanan
- Circle breathing animation besar sebagai fokus visual
- Buttons `Start Session` dan `Customize`
- Daily routines list dengan durasi dan tombol start
- Weekly mood summary dengan chart dan tips

### Pengalaman
Fokus pada interaksi ritual pernapasan dengan visual yang menenangkan dan rutinitas singkat.

## `counseling.html` — Digital Counseling
### Tujuan
Menampilkan profesional konseling, chat secure, dan jadwal sesi.

### Desain
- Hero dengan headline support confidential
- Grid tiga kolom: counselor list, chat interface, scheduler sidebar
- Counselor cards dengan status online, spesialisasi, tombol book
- Chat interface: chat history dan input pesan
- Sidebar scheduler untuk sesi, ringkasan, dan konfirmasi

### Pengalaman
Menampilkan rasa aman, cepat, dan user-friendly untuk layanan konseling digital.

## `gadget-time.html` — Gadget Time & Posture Monitor
### Tujuan
Melacak waktu screen time per perangkat dan mengingatkan istirahat.

### Desain
- Hero card dengan total screen time dan status alert
- Progress bar segment-based untuk zona aman/moderate/high
- Device time buttons untuk menambah 15 menit per perangkat
- Chart toggle bar/donut untuk breakdown perangkat
- Countdown stretch dan animasi SVG postur

### Pengalaman
Memberi kontrol visual atas penggunaan gadget dan reminder untuk bergerak.

## `hydration.html` — Hydration Tracker
### Tujuan
Mendorong minum air secara teratur dengan animasi gelas dan goal tracking.

### Desain
- Hero stat card dengan total gelas dan progress ring
- Glass grid interactive untuk melacak setiap gelas
- Big bottle illustration dengan animasi gelombang air
- Goals, stats, dan badge target
- Accordion / tips hydration untuk edukasi

### Pengalaman
UI fun dan visual membuat target hidrasi lebih mudah dipahami serta interaktif.

## `sleep.html` — Sleep Insights
### Tujuan
Memfasilitasi pencatatan tidur dan analisis kualitas tidur.

### Desain
- Header dengan sleep status pill dan judul
- Tabs range: harian, mingguan, bulanan
- Sleep log card input bedtime, wake time, kualitas, catatan
- Sleep architecture chart dan score bar
- Stat grid: total tidur, efisiensi, perasaan pagi, rata-rata 7 hari
- Smart routine recommendation dan morning mood selector

### Pengalaman
Memberi siswa alat sederhana untuk memantau tidur, mendapatkan skor, dan melihat trend.

## `settings.html` — Settings
### Tujuan
Opsi personalisasi, notifikasi, tema, bahasa, dan akun.

### Desain
- Profile card editable dengan nama dan kelas
- Notifications section list
- Appearance section dengan language dropdown dan theme switch
- Privacy & Data action buttons
- Account section dengan change password dan logout
- Modal overlay untuk check-in dan breathing customize

### Pengalaman
Menyediakan kontrol personal atas pengalaman pengguna dan preferensi data.

## Catatan Tambahan
- `admin.html` sudah dihapus dari workspace sesuai permintaan.
- Semua halaman memakai bahasa campuran English/Indonesia untuk teks UI.
- Struktur konsisten memudahkan pengembangan dan navigasi antar page.
- Halaman dengan chart, animasi, dan progress indicator mengedepankan feedback visual.
