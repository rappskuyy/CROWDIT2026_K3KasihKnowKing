/* ============== ROUTER ============== */
const ROUTE_FILES = {
  "overview": "index.html",
  "safety": "safety.html",
  "gadget-time": "gadget-time.html",
  "hydration": "hydration.html",
  "sleep": "sleep.html",
  "breathing": "breathing.html",
  "reports": "reports.html",
  "counseling": "counseling.html",
  "settings": "settings.html"
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

function confirmLogout() {
  document.getElementById('confirmTitle').textContent = 'Log out?';
  document.getElementById('confirmMsg').textContent = 'You will be returned to the dashboard.';
  document.getElementById('confirmOk').onclick = () => {
    closeModal('confirmModal');
    location.href = 'index.html';
  };
  openModal('confirmModal');
}

document.getElementById('sidebar-logout').addEventListener('click', confirmLogout);

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
      "Terima kasih telah berbagi cerita. Anda dapat menjadwalkan sesi langsung dengan Dr. Sarah atau Mr. David menggunakan kalender di sebelah kanan.",
      "Kesehatan mental Anda sangat berharga. Jika Anda butuh bantuan segera, silakan hubungi hotline bantuan kami."
    ],
    en: [
      "Hello! I am the SafeSchool wellness assistant. Remember that you are not alone here.",
      "Exam stress is completely natural. Try breathing in for 4 seconds, holding for 4, and exhaling for 4.",
      "It is also important to maintain hydration and get enough sleep. Did you sleep well last night?",
      "Thank you for sharing your thoughts. You can schedule a direct session with Dr. Sarah or Mr. David using the scheduler on the right.",
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
        <div class="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none shadow-sm">
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
