// Centralized Profile, XP, and Avatar Synchronization System
(function() {
  const BASE_AVATARS = ['🧑','👦','👧','🧒','👨','👩','🧔','👱','🙋','😊'];
  const ACCESSORIES = [
    {id:'hat_grad',emoji:'🎓',name:'Topi Wisuda',slot:'hat',cost:100,desc:'Tampil seperti lulusan terbaik!'},
    {id:'hat_top',emoji:'🎩',name:'Top Hat',slot:'hat',cost:150,desc:'Gaya klasik yang elegan.'},
    {id:'hat_crown',emoji:'👑',name:'Mahkota',slot:'hat',cost:300,desc:'Jadilah raja/ratu sekolah!'},
    {id:'hat_party',emoji:'🥳',name:'Topi Pesta',slot:'hat',cost:80,desc:'Rayakan setiap pencapaian!'},
    {id:'glasses_cool',emoji:'🕶️',name:'Kacamata Keren',slot:'glasses',cost:120,desc:'Penampilan super keren.'},
    {id:'glasses_nerd',emoji:'🤓',name:'Kacamata Pelajar',slot:'glasses',cost:60,desc:'Tampil cerdas dan serius!'},
    {id:'badge_star',emoji:'⭐',name:'Badge Bintang',slot:'badge',cost:200,desc:'Penghargaan pencapaian top.'},
    {id:'badge_fire',emoji:'🔥',name:'Badge On Fire',slot:'badge',cost:180,desc:'Kamu sedang on fire!'},
  ];

  function readXP() {
    return parseInt(localStorage.getItem('edu_xp') || '320', 10);
  }

  function writeXP(v) {
    localStorage.setItem('edu_xp', String(v));
    window.dispatchEvent(new Event('storage'));
  }

  function loadAvatarState() {
    try {
      return JSON.parse(localStorage.getItem('avatar_state') || 'null');
    } catch(e) {
      return null;
    }
  }

  function saveAvatarState(s) {
    localStorage.setItem('avatar_state', JSON.stringify(s));
    window.dispatchEvent(new Event('storage'));
  }

  function loadOwnedAccessories() {
    try {
      return JSON.parse(localStorage.getItem('owned_acc') || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveOwnedAccessories(a) {
    localStorage.setItem('owned_acc', JSON.stringify(a));
    window.dispatchEvent(new Event('storage'));
  }

  function renderAvatar(baseEl, hatEl, glassesEl, state) {
    if (!baseEl) return;
    
    // Render base (always emoji in this turn)
    baseEl.textContent = state.base || '🧑';
    
    // Render hat
    if (hatEl) {
      if (state.hat) {
        const acc = ACCESSORIES.find(a => a.id === state.hat);
        hatEl.textContent = acc ? acc.emoji : '';
        hatEl.classList.remove('hidden');
      } else {
        hatEl.classList.add('hidden');
      }
    }
    
    // Render glasses
    if (glassesEl) {
      if (state.glasses) {
        const acc = ACCESSORIES.find(a => a.id === state.glasses);
        glassesEl.textContent = acc ? acc.emoji : '';
        glassesEl.classList.remove('hidden');
      } else {
        glassesEl.classList.add('hidden');
      }
    }
  }

  function syncProfileUI() {
    // 1. Sync Name and Grade
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = localStorage.getItem('profileName') || user.name || 'Alex Johnson';
    const rawGrade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
    const grade = rawGrade.charAt(0).toUpperCase() + rawGrade.slice(1);
    const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    const sn = document.getElementById('sidebarName'); if (sn) sn.textContent = name;
    const sg = document.getElementById('sidebarGrade'); if (sg) sg.textContent = grade;
    const mb = document.getElementById('mobileAvatarBadge'); if (mb) mb.textContent = initials;
    const sp = document.getElementById('settingsProfileName'); if (sp) sp.textContent = name;
    const spg = document.getElementById('settingsProfileGrade'); if (spg) spg.textContent = grade;
    const sac = document.getElementById('settingsAvatarCircle'); if (sac) sac.textContent = initials;
    
    // Sync inside profile modals
    const dispName = document.getElementById('profileModalDisplayName') || document.getElementById('profileDisplayName');
    if (dispName) dispName.textContent = name;
    
    const dispGrade = document.getElementById('profileModalDisplayGrade') || document.getElementById('profileDisplayGrade');
    if (dispGrade) dispGrade.textContent = grade;

    const dp = document.getElementById('dashProfileNameAndGrade');
    if (dp) dp.textContent = `${name} · ${grade}`;

    // 2. Sync XP
    const xp = readXP();
    const sx = document.getElementById('sidebarXP'); if (sx) sx.textContent = xp + ' XP';
    const ax = document.getElementById('avatarShopXP'); if (ax) ax.textContent = xp + ' XP';
    const dx = document.getElementById('xpDisplay'); if (dx) dx.textContent = xp + ' XP';
    
    const dispXp = document.getElementById('profileModalXP') || document.getElementById('profileDisplayXP');
    if (dispXp) dispXp.textContent = xp + ' XP';

    // 3. Sync Avatar & Accessories
    const avatarState = loadAvatarState() || { base: '🧑', hat: null, glasses: null, badge: null };
    
    // Sync sidebar avatar
    const sidebarBase = document.getElementById('sidebarAvatarEmoji');
    const sidebarHat = document.getElementById('sidebarHatBadge');
    const sidebarGlasses = document.getElementById('sidebarGlassesBadge');
    renderAvatar(sidebarBase, sidebarHat, sidebarGlasses, avatarState);
    
    // Ensure the sidebar avatar circle matches the light blue background design
    const wrap = document.getElementById('sidebarAvatarWrap');
    if (wrap) {
      wrap.style.backgroundColor = '#dce9ff';
      wrap.style.color = '#0b1c30';
      wrap.style.borderColor = 'var(--primary)';
    }

    // Sync profile modal avatar
    const modalBase = document.getElementById('profileModalAvatar') || document.getElementById('profileAvatarCircle');
    const modalHat = document.getElementById('profileModalHatBadge') || document.getElementById('profileHatBadge');
    const modalGlasses = document.getElementById('profileModalGlassesBadge') || document.getElementById('profileGlassesBadge');
    renderAvatar(modalBase, modalHat, modalGlasses, avatarState);

    // Sync safeschoolhub dashboard avatar banner
    const dashBase = document.getElementById('dashAvatarCircle');
    if (dashBase) {
      dashBase.textContent = avatarState.base || '🧑';
    }

    // Update Avatar Shop Preview if open/visible
    const circle = document.getElementById('avatarPreviewCircle');
    const hatPrev = document.getElementById('avatarHatPreview');
    const glassesPrev = document.getElementById('avatarGlassesPreview');
    renderAvatar(circle, hatPrev, glassesPrev, avatarState);
  }

  // Centralized Save Profile
  window.saveProfile = function() {
    const nameInp = document.getElementById('profileNameInput');
    const gradeInp = document.getElementById('profileGradeInput');
    const emailInp = document.getElementById('profileEmailInput');
    
    if (!nameInp || !gradeInp) return;
    
    const name = nameInp.value.trim() || 'Alex Johnson';
    const grade = gradeInp.value.trim() || 'Grade 11-A';
    const email = emailInp ? emailInp.value.trim() : '';
    
    localStorage.setItem('profileName', name);
    localStorage.setItem('profileGrade', grade);
    if (email) localStorage.setItem('profileEmail', email);
    
    try {
      let u = JSON.parse(localStorage.getItem('user') || '{}');
      u.name = name;
      u.email = email || u.email;
      u.role = grade;
      localStorage.setItem('user', JSON.stringify(u));
    } catch(e) {}
    
    syncProfileUI();
    
    // Handle close for different potential modal structures
    const modal = document.getElementById('profileModal') || document.getElementById('profileEditModal');
    if (modal) modal.classList.remove('open');
    if (window.closeProfileModal) window.closeProfileModal();
    if (window.closeProfileEditModal) window.closeProfileEditModal();
    
    if (window.showToast) {
      window.showToast('<i class="fa-solid fa-circle-check"></i> Profil berhasil disimpan!', 'success');
    }
  };

  // Shop management functions
  function openAvatarShop() {
    syncProfileUI();
    const avatarState = loadAvatarState() || { base: '🧑', hat: null, glasses: null, badge: null };
    const ownedAccessories = loadOwnedAccessories();
    const xp = readXP();

    const grid = document.getElementById('baseAvatarGrid');
    if (grid) {
      grid.innerHTML = BASE_AVATARS.map(e => `
        <button onclick="selectBase('${e}')" class="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${avatarState.base === e ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}" style="font-size:22px">${e}</button>
      `).join('');
    }

    const shopGrid = document.getElementById('accessoryShopGrid');
    if (shopGrid) {
      shopGrid.innerHTML = ACCESSORIES.map(acc => {
        const owned = ownedAccessories.includes(acc.id);
        const equipped = avatarState[acc.slot] === acc.id;
        const canAfford = xp >= acc.cost;
        const checkIcon = `<i class="fa-solid fa-circle-check"></i>`;
        const coinIcon = `<i class="fa-solid fa-coins"></i>`;
        return `<div class="rounded-xl p-3 flex items-center gap-3 border ${equipped ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-surface-container-lowest'}">
          <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">${acc.emoji}</div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm">${acc.name}</div>
            <div class="text-xs text-on-surface-variant">${acc.desc}</div>
            ${owned ? `<div class="text-xs text-primary font-semibold mt-0.5">${checkIcon} Sudah dimiliki</div>` : `<div class="text-xs font-bold mt-0.5" style="color:${canAfford ? '#f59e0b' : '#ba1a1a'}">${coinIcon} ${acc.cost} XP</div>`}
          </div>
          <div>
            ${owned ? `<button onclick="toggleEquip('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${equipped ? 'bg-primary text-white' : 'border border-primary text-primary'}">${equipped ? 'Dipakai' : 'Pakai'}</button>` : `<button onclick="buyAccessory('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${canAfford ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant cursor-not-allowed'}" ${!canAfford ? 'disabled' : ''}>Beli</button>`}
          </div>
        </div>`;
      }).join('');
    }

    const modal = document.getElementById('avatarShopModal');
    if (modal) modal.classList.add('open');
  }

  function selectBase(emoji) {
    const avatarState = loadAvatarState() || { base: '🧑', hat: null, glasses: null, badge: null };
    avatarState.base = emoji;
    saveAvatarState(avatarState);
    syncProfileUI();
    document.querySelectorAll('#baseAvatarGrid button').forEach((btn, i) => {
      const e = BASE_AVATARS[i];
      btn.className = `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${e === emoji ? 'border-primary bg-surface-container-high' : 'border-outline-variant bg-surface-container-lowest'}`;
    });
  }

  function buyAccessory(id) {
    const acc = ACCESSORIES.find(a => a.id === id);
    if (!acc) return;
    let xp = readXP();
    if (xp < acc.cost) {
      if (window.showToast) window.showToast('XP tidak cukup! Tonton video/artikel dulu.', 'error');
      return;
    }
    xp -= acc.cost;
    writeXP(xp);
    
    const ownedAccessories = loadOwnedAccessories();
    ownedAccessories.push(id);
    saveOwnedAccessories(ownedAccessories);
    
    const avatarState = loadAvatarState() || { base: '🧑', hat: null, glasses: null, badge: null };
    avatarState[acc.slot] = id;
    saveAvatarState(avatarState);
    
    if (window.showToast) window.showToast('<i class="fa-solid fa-award"></i> ' + acc.name + ' berhasil dibeli & dipakai!', 'success');
    openAvatarShop();
  }

  function toggleEquip(id) {
    const acc = ACCESSORIES.find(a => a.id === id);
    if (!acc) return;
    const avatarState = loadAvatarState() || { base: '🧑', hat: null, glasses: null, badge: null };
    if (avatarState[acc.slot] === id) {
      avatarState[acc.slot] = null;
      if (window.showToast) window.showToast(acc.name + ' dilepas.', 'info');
    } else {
      avatarState[acc.slot] = id;
      if (window.showToast) window.showToast(acc.emoji + ' ' + acc.name + ' dipakai!', 'success');
    }
    saveAvatarState(avatarState);
    openAvatarShop();
  }

  window.addEventListener('storage', syncProfileUI);

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.addXP === 'undefined') {
      window.addXP = function(n) {
        let xp = readXP() + n;
        writeXP(xp);
        if (window.showToast) window.showToast('+' + n + ' XP diperoleh! Total: ' + xp + ' XP', 'success');
      };
    }
    syncProfileUI();
  });

  window.openProfileModal = function() {
    const modal = document.getElementById('profileModal');
    if (modal) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const name = localStorage.getItem('profileName') || user.name || 'Alex Johnson';
      const grade = localStorage.getItem('profileGrade') || user.role || 'Grade 11-A';
      const email = localStorage.getItem('profileEmail') || '';
      
      const inpName = document.getElementById('profileNameInput'); if (inpName) inpName.value = name;
      const inpGrade = document.getElementById('profileGradeInput'); if (inpGrade) inpGrade.value = grade;
      const inpEmail = document.getElementById('profileEmailInput'); if (inpEmail) inpEmail.value = email;
      
      const dispName = document.getElementById('profileModalDisplayName') || document.getElementById('profileDisplayName');
      if (dispName) dispName.textContent = name;
      const dispGrade = document.getElementById('profileModalDisplayGrade') || document.getElementById('profileDisplayGrade');
      if (dispGrade) dispGrade.textContent = grade;
      
      syncProfileUI();
      modal.classList.add('open');
    } else {
      openAvatarShop();
    }
  };

  window.closeProfileModal = function() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('open');
  };

  window.openAvatarShop = openAvatarShop;
  window.selectBase = selectBase;
  window.buyAccessory = buyAccessory;
  window.toggleEquip = toggleEquip;
  window.syncProfileUI = syncProfileUI;
})();
