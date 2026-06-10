/* ============== ROUTER ============== */
const ROUTE_FILES = {
  "overview": "../../index.html",
  "educational": "../educational/educational.html",
  "gadget-time": "../gadget-time/gadget-time.html",
  "hydration": "../hydration/hydration.html",
  "sleep": "../sleep/sleep.html",
  "breathing": "../breathing/breathing.html",
  "counseling": "../counseling/counseling.html",
  "settings": "../settings/settings.html",
  "reports": "reports.html"
};
const CURRENT_ROUTE = 'reports';

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
  if (!c) return;
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
document.querySelectorAll('.modal-backdrop').forEach(m =>
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); })
);

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

/* ============== REPORTS TABLE ============== */
const REPORTS_ALL = [];
const TYPES = ['Bullying', 'Cyberbullying', 'Physical Threat', 'Other'];
const LOCS = ['East Corridor', 'Cafeteria', 'Gym', 'Library', 'Lab 2', 'Schoolyard', 'Bus Stop'];
const STATUS = ['Open', 'Resolved', 'Pending'];

for (let i = 1; i <= 24; i++) {
  REPORTS_ALL.push({
    id: 'R-' + String(1000 + i),
    date: `2024-06-${String((i % 28) + 1).padStart(2, '0')}`,
    type: TYPES[i % 4],
    loc: LOCS[i % LOCS.length],
    status: STATUS[i % 3]
  });
}

let reportPage = 1;

function renderReports() {
  const tableBody = document.getElementById('reportsBody');
  if (!tableBody) return;
  const filterVal = document.getElementById('reportFilter');
  const filter = filterVal ? filterVal.value : 'all';
  let data = REPORTS_ALL.filter(r => filter === 'all' || r.status === filter);
  const per = 8, total = Math.max(1, Math.ceil(data.length / per));
  reportPage = Math.min(reportPage, total);
  const pager = document.getElementById('reportPager');
  if (pager) pager.textContent = reportPage + ' / ' + total;
  data = data.slice((reportPage - 1) * per, reportPage * per);
  const pill = s => s === 'Open' ? 'stat-pill-yellow' : s === 'Resolved' ? 'stat-pill-green' : 'bg-surface-container-high text-primary';
  tableBody.innerHTML = data.map(r => `
    <tr class="border-t border-outline-variant hover:bg-surface-container-low cursor-pointer">
      <td class="p-3 font-bold" onclick="openReport('${r.id}')">${r.id}</td>
      <td class="p-3">${r.date}</td>
      <td class="p-3">${r.type}</td>
      <td class="p-3">${r.loc}</td>
      <td class="p-3"><span class="pill px-2 py-1 text-xs font-bold ${pill(r.status)}">${r.status}</span></td>
      <td class="p-3"><button class="btn-ghost text-xs" onclick="resolveReport('${r.id}')">Resolve</button></td>
    </tr>`).join('');
}

function openReport(id) {
  const r = REPORTS_ALL.find(x => x.id === id);
  document.getElementById('reportDetailBody').innerHTML = `
    <div class="space-y-2">
      <div><b>ID:</b> ${r.id}</div>
      <div><b>Date:</b> ${r.date}</div>
      <div><b>Type:</b> ${r.type}</div>
      <div><b>Location:</b> ${r.loc}</div>
      <div><b>Status:</b> ${r.status}</div>
      <p class="text-on-surface-variant">Detailed narrative would appear here.</p>
    </div>`;
  openModal('reportDetail');
}

function resolveReport(id) {
  const r = REPORTS_ALL.find(x => x.id === id);
  if (r) {
    r.status = 'Resolved';
    renderReports();
    showToast('Report resolved', 'success');
  }
}

function exportCSV() {
  const rows = [['ID', 'Date', 'Type', 'Location', 'Status'],
    ...REPORTS_ALL.map(r => [r.id, r.date, r.type, r.loc, r.status])];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'reports.csv';
  a.click();
  showToast('CSV exported', 'success');
}

/* ============== ANONYMOUS REPORT FORM ============== */
let currentStep = 1;
const totalSteps = 3;

function selectCategory(category) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-primary/10', 'border-primary');
  });
  event.currentTarget.classList.add('bg-primary/10', 'border-primary');
  setTimeout(() => nextStep(2), 300);
}

function nextStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove('active-step');
  document.getElementById(`step-${currentStep}`).classList.add('hidden-step');
  setTimeout(() => {
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.remove('hidden-step');
    document.getElementById(`step-${currentStep}`).classList.add('active-step');
    updateProgress();
  }, 300);
}

function prevStep(step) {
  document.getElementById(`step-${currentStep}`).classList.remove('active-step');
  document.getElementById(`step-${currentStep}`).classList.add('hidden-step');
  setTimeout(() => {
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.remove('hidden-step');
    document.getElementById(`step-${currentStep}`).classList.add('active-step');
    updateProgress();
  }, 300);
}

function updateProgress() {
  for (let i = 1; i <= totalSteps; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    if (i <= currentStep) {
      dot.classList.add('bg-primary', 'text-on-primary');
      dot.classList.remove('bg-surface-container-highest', 'text-on-surface-variant');
    } else {
      dot.classList.remove('bg-primary', 'text-on-primary');
      dot.classList.add('bg-surface-container-highest', 'text-on-surface-variant');
    }
  }
  document.getElementById('progress-bar-1').style.width = currentStep > 1 ? '100%' : '0%';
  document.getElementById('progress-bar-2').style.width = currentStep > 2 ? '100%' : '0%';
}

function submitReport() {
  const btn = event.currentTarget;
  btn.innerHTML = 'Submitting...';
  btn.disabled = true;
  setTimeout(() => {
    const rid = '#' + Math.floor(10000 + Math.random() * 90000);
    const idDisp = document.getElementById('reportIdDisplay');
    if (idDisp) idDisp.textContent = rid;
    showToast('Report ' + rid + ' submitted successfully!', 'success');
    btn.innerHTML = 'Submit Report <span class="material-symbols-outlined ml-2">send</span>';
    btn.disabled = false;
    currentStep = 1;
    document.querySelectorAll('.step-transition').forEach(s => {
      s.classList.remove('active-step');
      s.classList.add('hidden-step');
    });
    document.getElementById('step-1').classList.remove('hidden-step');
    document.getElementById('step-1').classList.add('active-step');
    updateProgress();
  }, 1500);
}

/* ============== DROP ZONE ============== */
window.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.querySelector('.border-dashed');
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        dropZone.classList.add('bg-primary/10', 'border-primary');
      }, false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        dropZone.classList.remove('bg-primary/10', 'border-primary');
      }, false);
    });
  }
  renderReports();
});
