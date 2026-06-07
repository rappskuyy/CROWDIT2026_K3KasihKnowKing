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
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast');
  const t = document.createElement('div');
  t.className = 'toast-item ' + type;
  t.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px">' +
    (type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info') +
    '</span>' + msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
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
  const chatInput = document.querySelector('input[placeholder="Type your message..."]');
  const sendBtn = document.getElementById('sendMsgBtn');
  const messageArea = document.getElementById('chatMessages');

  function sendMessage() {
    if (chatInput.value.trim() !== '') {
      const newMessage = document.createElement('div');
      newMessage.className = 'flex items-start gap-2 max-w-[80%] ml-auto flex-row-reverse';
      newMessage.innerHTML = `
        <div class="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none shadow-sm animate-fade-in-up">
          <p class="text-sm">${chatInput.value}</p>
          <span class="text-[10px] opacity-70 mt-1 block text-right">Just now</span>
        </div>`;
      messageArea.appendChild(newMessage);
      chatInput.value = '';
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  /* ============== CALENDAR ============== */
  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(b => {
        b.classList.remove('border-primary', 'text-primary', 'font-bold', 'bg-primary/5');
        b.classList.add('border-outline-variant/50');
      });
      btn.classList.add('border-primary', 'text-primary', 'font-bold', 'bg-primary/5');
    });
  });

  document.getElementById('confirmAppointmentBtn')?.addEventListener('click', () => {
    showToast('Appointment confirmed!', 'success');
  });

  document.querySelectorAll('.book-session-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('Session request sent!', 'success'));
  });

  document.getElementById('mindfulnessBtn')?.addEventListener('click', () => {
    showToast('Mindfulness exercise started — breathe in...', 'info');
  });
});
