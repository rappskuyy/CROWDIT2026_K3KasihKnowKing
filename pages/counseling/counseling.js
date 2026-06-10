/* ============== ROUTER ============== */
const ROUTE_FILES = {
  "overview": "../../index.html",
  "educational": "../educational/educational.html",
  "gadget-time": "../gadget-time/gadget-time.html",
  "hydration": "../hydration/hydration.html",
  "sleep": "../sleep/sleep.html",
  "breathing": "../breathing/breathing.html",
  "counseling": "counseling.html",
  "settings": "../settings/settings.html",
  "reports": "../reports/reports.html"
};
const CURRENT_ROUTE = 'counseling';

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

/* ============== CHAT ============== */
window.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput') || document.querySelector('input[placeholder="Type your message..."]');
  const sendBtn = document.getElementById('sendMsgBtn');
  const messageArea = document.getElementById('chatMessages');

  const chatbotReplies = {
    id: [
      "Halo! Saya asisten kesehatan SafeSchool. Ingatlah bahwa Anda tidak sendirian di sini.",
      "Kecemasan menghadapi ujian sangat wajar. Coba tarik napas dalam-dalam selama 4 detik, tahan 4 detik, dan hembuskan 4 detik.",
      "Penting juga untuk menjaga hidrasi dan tidur yang cukup. Apakah tidur Anda cukup semalam?",
      "Terima kasih telah berbagi cerita. Anda dapat menjadwalkan sesi langsung dengan Dr. Sarah atau Mr. David menggunakan tombol 'Book Session'.",
      "Kesehatan mental Anda sangat berharga. Jika Anda butuh bantuan segera, silakan hubungi hotline bantuan kami."
    ],
    en: [
      "Hello! I am the SafeSchool wellness assistant. Remember that you are not alone here.",
      "Exam stress is completely natural. Try breathing in for 4 seconds, holding for 4, and exhaling for 4.",
      "It is also important to maintain hydration and get enough sleep. Did you sleep well last night?",
      "Thank you for sharing your thoughts. You can schedule a direct session with Dr. Sarah or Mr. David using the 'Book Session' buttons.",
      "Your mental health is highly valuable. If you need immediate support, please contact our helpline."
    ]
  };
  let replyIndex = 0;

  function sendMessage() {
    if (!chatInput || !messageArea) return;
    const text = chatInput.value.trim();
    if (text !== '') {
      // User message
      const userMsg = document.createElement('div');
      userMsg.className = 'flex items-start gap-2 max-w-[80%] ml-auto flex-row-reverse';
      userMsg.innerHTML = `
        <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm">
          <p class="text-sm">${text}</p>
          <span class="text-[10px] opacity-70 mt-1 block text-right">Just now</span>
        </div>`;
      messageArea.appendChild(userMsg);
      chatInput.value = '';
      messageArea.scrollTop = messageArea.scrollHeight;

      // Typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.id = 'typingIndicator';
      typingIndicator.className = 'flex items-start gap-2 max-w-[80%]';
      typingIndicator.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary-container icon-fill" style="font-size:14px">support_agent</span>
        </div>
        <div class="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10 text-xs italic text-on-surface-variant flex items-center gap-1">
          Typing<span class="animate-pulse">...</span>
        </div>`;
      
      setTimeout(() => {
        messageArea.appendChild(typingIndicator);
        messageArea.scrollTop = messageArea.scrollHeight;
        
        setTimeout(() => {
          typingIndicator.remove();
          const lang = localStorage.getItem('appLang') === 'id' ? 'id' : 'en';
          const replies = chatbotReplies[lang] || chatbotReplies.en;
          const replyText = replies[replyIndex];
          replyIndex = (replyIndex + 1) % replies.length;

          const botMsg = document.createElement('div');
          botMsg.className = 'flex items-start gap-2 max-w-[80%]';
          botMsg.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-primary-container shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-on-primary-container icon-fill" style="font-size:14px">support_agent</span>
            </div>
            <div class="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-none shadow-sm border border-outline-variant/10">
              <p class="text-sm">${replyText}</p>
              <span class="text-[10px] text-on-surface-variant mt-1 block">Just now</span>
            </div>`;
          messageArea.appendChild(botMsg);
          messageArea.scrollTop = messageArea.scrollHeight;
        }, 1200);
      }, 500);
    }
  }

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  }

  document.querySelectorAll('.book-session-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.glass-card');
      const name = card ? card.querySelector('h5').textContent : 'Sarah Jenkins';
      const lang = localStorage.getItem('appLang') === 'id' ? 'id' : 'en';
      const msg = lang === 'id' ? `✅ Permintaan sesi dengan ${name} telah dikirim!` : `✅ Session request sent for ${name}!`;
      showToast(msg, 'success');
    });
  });

  document.getElementById('mindfulnessBtn')?.addEventListener('click', () => {
    const lang = localStorage.getItem('appLang') === 'id' ? 'id' : 'en';
    const msg = lang === 'id' ? 'Latihan pernapasan kesadaran (mindfulness) dimulai... Tarik napas secara perlahan.' : 'Mindfulness exercise started — breathe in...';
    showToast(msg, 'info');
  });
});

/* ===== AVATAR SYSTEM ===== */
const BASE_AVATARS = ['fa-solid fa-user','fa-solid fa-user-ninja','fa-solid fa-user-astronaut','fa-solid fa-child','fa-solid fa-user-tie','fa-solid fa-user-nurse','fa-solid fa-user-secret','fa-solid fa-user-doctor','fa-solid fa-hands-raised','fa-solid fa-face-smile'];
const ACCESSORIES = [
  { id: 'hat_grad', emoji: '<i class="fa-solid fa-graduation-cap"></i>', name: 'Topi Wisuda', slot: 'hat', cost: 100, desc: 'Tampil seperti lulusan terbaik!' },
  { id: 'hat_top', emoji: 'fa-solid fa-hat-cowboy', name: 'Top Hat', slot: 'hat', cost: 150, desc: 'Gaya klasik yang elegan.' },
  { id: 'hat_crown', emoji: '<i class="fa-solid fa-crown"></i>', name: 'Mahkota', slot: 'hat', cost: 300, desc: 'Jadilah raja/ratu sekolah!' },
  { id: 'hat_party', emoji: '<i class="fa-solid fa-gifts"></i>', name: 'Topi Pesta', slot: 'hat', cost: 80, desc: 'Rayakan setiap pencapaian!' },
  { id: 'glasses_cool', emoji: '<i class="fa-solid fa-glasses"></i>', name: 'Kacamata Keren', slot: 'glasses', cost: 120, desc: 'Penampilan super keren.' },
  { id: 'glasses_nerd', emoji: '<i class="fa-solid fa-glasses"></i>', name: 'Kacamata Pelajar', slot: 'glasses', cost: 60, desc: 'Tampil cerdas dan serius!' },
  { id: 'badge_star', emoji: '<i class="fa-solid fa-star"></i>', name: 'Badge Bintang', slot: 'badge', cost: 200, desc: 'Penghargaan pencapaian top.' },
  { id: 'badge_fire', emoji: '<i class="fa-solid fa-fire"></i>', name: 'Badge On Fire', slot: 'badge', cost: 180, desc: 'Kamu sedang on fire!' },
];

function loadXPLocal() { try { return parseInt(localStorage.getItem('edu_xp') || '320', 10); } catch (e) { return 320; } }
function saveXPLocal(v) { try { localStorage.setItem('edu_xp', String(v)); } catch (e) { } }
function loadAvatarState() { try { return JSON.parse(localStorage.getItem('avatar_state') || 'null'); } catch (e) { return null; } }
function saveAvatarState(s) { try { localStorage.setItem('avatar_state', JSON.stringify(s)); } catch (e) { } }
function loadOwnedAccessories() { try { return JSON.parse(localStorage.getItem('owned_acc') || '[]'); } catch (e) { return []; } }
function saveOwnedAccessories(a) { try { localStorage.setItem('owned_acc', JSON.stringify(a)); } catch (e) { } }

let avatarState = loadAvatarState() || { base: 'fa-solid fa-user', hat: null, glasses: null, badge: null };
let ownedAccessories = loadOwnedAccessories();

function applySidebarAvatar() {
  const e = document.getElementById('sidebarAvatarEmoji'), h = document.getElementById('sidebarHatBadge');
  if (e) e.textContent = avatarState.base;
  if (h) { if (avatarState.hat) { const a = ACCESSORIES.find(x => x.id === avatarState.hat); h.textContent = a ? a.emoji : ''; h.classList.toggle('hidden', !avatarState.hat); } else h.classList.add('hidden'); }
  const xEl = document.getElementById('sidebarXP'); if (xEl) xEl.textContent = loadXPLocal() + ' XP';
}

function applyPreviewAvatar() {
  const c = document.getElementById('avatarPreviewCircle'), hp = document.getElementById('avatarHatPreview'), gp = document.getElementById('avatarGlassesPreview');
  if (!c) return; c.textContent = avatarState.base;
  if (hp) { const a = avatarState.hat ? ACCESSORIES.find(x => x.id === avatarState.hat) : null; hp.textContent = a ? a.emoji : ''; hp.classList.toggle('hidden', !avatarState.hat); }
  if (gp) { const a = avatarState.glasses ? ACCESSORIES.find(x => x.id === avatarState.glasses) : null; gp.textContent = a ? a.emoji : ''; gp.classList.toggle('hidden', !avatarState.glasses); }
}

function openAvatarShop() {
  const xp = loadXPLocal();
  const xs = document.getElementById('avatarShopXP'); if (xs) xs.textContent = xp + ' XP';
  const grid = document.getElementById('baseAvatarGrid');
  if (grid) grid.innerHTML = BASE_AVATARS.map(em => `<button onclick="selectBase('${em}')" class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${avatarState.base === em ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}" style="font-size:22px">${em}</button>`).join('');
  const sg = document.getElementById('accessoryShopGrid');
  if (sg) sg.innerHTML = ACCESSORIES.map(acc => {
    const owned = ownedAccessories.includes(acc.id), equipped = avatarState[acc.slot] === acc.id, canAfford = xp >= acc.cost;
    return `<div class="rounded-xl p-3 flex items-center gap-3 border ${equipped ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-surface-container-lowest'}"><div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">${acc.emoji}</div><div class="flex-1 min-w-0"><div class="font-bold text-sm">${acc.name}</div><div class="text-xs text-on-surface-variant">${acc.desc}</div>${owned ? '<div class="text-xs text-primary font-semibold mt-0.5"><i class="fa-solid fa-circle-check"></i> Sudah dimiliki</div>' : `<div class="text-xs font-bold mt-0.5" style="color:${canAfford ? '#f59e0b' : '#ba1a1a'}"><i class="fa-solid fa-coins"></i> ${acc.cost} XP</div>`}</div><div>${owned ? `<button onclick="toggleEquip('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full ${equipped ? 'bg-primary text-white' : 'border border-primary text-primary'}">${equipped ? 'Dipakai' : 'Pakai'}</button>` : `<button onclick="buyAccessory('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full ${canAfford ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}" ${!canAfford ? 'disabled' : ''}>Beli</button>`}</div></div>`;
  }).join('');
  applyPreviewAvatar();
  document.getElementById('avatarShopModal').classList.add('open');
}

function selectBase(emoji) {
  avatarState.base = emoji; saveAvatarState(avatarState); applySidebarAvatar(); applyPreviewAvatar();
  document.querySelectorAll('#baseAvatarGrid button').forEach((btn, i) => { const e = BASE_AVATARS[i]; btn.className = `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${e === emoji ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}`; btn.style.fontSize = '22px'; });
}

function buyAccessory(id) {
  const acc = ACCESSORIES.find(a => a.id === id); if (!acc) return;
  let xp = loadXPLocal();
  if (xp < acc.cost) { if (typeof showToast !== 'undefined') showToast('XP tidak cukup! Kunjungi Educational untuk mendapatkan XP.', 'error'); return; }
  xp -= acc.cost; saveXPLocal(xp); ownedAccessories.push(id); saveOwnedAccessories(ownedAccessories);
  avatarState[acc.slot] = id; saveAvatarState(avatarState); applySidebarAvatar();
  if (typeof showToast !== 'undefined') showToast('<i class="fa-solid fa-award"></i> ' + acc.name + ' berhasil dibeli & dipakai!', 'success');
  openAvatarShop();
}

function toggleEquip(id) {
  const acc = ACCESSORIES.find(a => a.id === id); if (!acc) return;
  if (avatarState[acc.slot] === id) { avatarState[acc.slot] = null; if (typeof showToast !== 'undefined') showToast(acc.name + ' dilepas.', 'info'); }
  else { avatarState[acc.slot] = id; if (typeof showToast !== 'undefined') showToast(acc.emoji + ' ' + acc.name + ' dipakai!', 'success'); }
  saveAvatarState(avatarState); applySidebarAvatar(); applyPreviewAvatar(); openAvatarShop();
}

applySidebarAvatar();
