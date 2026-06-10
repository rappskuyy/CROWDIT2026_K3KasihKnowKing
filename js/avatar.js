// Shared avatar/shop code (extracted for reuse across pages)
(function(){
  const BASE_AVATARS = ['🧑','👩','👨','🧑‍🎓','🧑‍🏫','🧑‍⚕️'];
  const ACCESSORIES = [
    {id:'hat_top',emoji:'🎩',name:'Top Hat',slot:'hat',cost:120,desc:'Stylish top hat.'},
    {id:'sunglasses',emoji:'🕶️',name:'Sunglasses',slot:'glasses',cost:90,desc:'Look cool.'},
    {id:'badge_star',emoji:'⭐',name:'Badge Bintang',slot:'badge',cost:200,desc:'Penghargaan pencapaian top.'},
    {id:'badge_fire',emoji:'🔥',name:'Badge On Fire',slot:'badge',cost:180,desc:'Kamu sedang on fire!'},
  ];

  function readXP(){
    try{ if(typeof loadXP==='function') return loadXP(); }catch(e){}
    try{ if(typeof loadXPLocal==='function') return loadXPLocal(); }catch(e){}
    try{ if(typeof loadXPMain==='function') return loadXPMain(); }catch(e){}
    return parseInt(localStorage.getItem('edu_xp')||'0',10)||0;
  }
  function writeXP(v){
    try{ if(typeof saveXP==='function'){ saveXP(v); return; } }catch(e){}
    try{ if(typeof saveXPLocal==='function'){ saveXPLocal(v); return; } }catch(e){}
    try{ if(typeof saveXPMain==='function'){ saveXPMain(v); return; } }catch(e){}
    try{ localStorage.setItem('edu_xp',String(v)); }catch(e){}
  }

  function loadAvatarState(){try{return JSON.parse(localStorage.getItem('avatar_state')||'null');}catch(e){return null;}}
  function saveAvatarState(s){try{localStorage.setItem('avatar_state',JSON.stringify(s));}catch(e){}
  }
  function loadOwnedAccessories(){try{return JSON.parse(localStorage.getItem('owned_acc')||'[]');}catch(e){return[];}}
  function saveOwnedAccessories(a){try{localStorage.setItem('owned_acc',JSON.stringify(a));}catch(e){}
  }

  let avatarState = loadAvatarState()||{base:'🧑',hat:null,glasses:null,badge:null};
  let ownedAccessories = loadOwnedAccessories();

  function applySidebarAvatar(){
    const emojiEl=document.getElementById('sidebarAvatarEmoji');
    const hatEl=document.getElementById('sidebarHatBadge');
    if(emojiEl) emojiEl.textContent=avatarState.base||'🧑';
    if(hatEl){
      if(avatarState.hat){const acc=ACCESSORIES.find(a=>a.id===avatarState.hat);hatEl.textContent=acc?acc.emoji:'';hatEl.classList.toggle('hidden',!avatarState.hat);} else hatEl.classList.add('hidden');
    }
  }

  function updateSidebarXP(){
    const xp = readXP();
    const el=document.getElementById('sidebarXP');if(el)el.textContent=xp+' XP';
    const el2=document.getElementById('avatarShopXP');if(el2)el2.textContent=xp+' XP';
    const el3=document.getElementById('xpDisplay');if(el3)el3.textContent=xp+' XP';
  }

  function applyPreviewAvatar(){
    const circle=document.getElementById('avatarPreviewCircle');
    const hatPrev=document.getElementById('avatarHatPreview');
    const glassesPrev=document.getElementById('avatarGlassesPreview');
    if(!circle) return;
    circle.textContent=avatarState.base||'🧑';
    if(hatPrev){const acc=avatarState.hat?ACCESSORIES.find(a=>a.id===avatarState.hat):null;hatPrev.textContent=acc?acc.emoji:'';hatPrev.classList.toggle('hidden',!avatarState.hat);}    
    if(glassesPrev){const acc=avatarState.glasses?ACCESSORIES.find(a=>a.id===avatarState.glasses):null;glassesPrev.textContent=acc?acc.emoji:'';glassesPrev.classList.toggle('hidden',!avatarState.glasses);}    
  }

  function openAvatarShop(){
    updateSidebarXP();
    const grid=document.getElementById('baseAvatarGrid');
    if(grid) grid.innerHTML=BASE_AVATARS.map(e=>`<button onclick="selectBase('${e}')" class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${avatarState.base===e?'border-primary bg-surface-container-high':'border-outline-variant bg-surface-container-lowest'}" style="font-size:22px">${e}</button>`).join('');
    const shopGrid=document.getElementById('accessoryShopGrid');
    if(shopGrid) shopGrid.innerHTML=ACCESSORIES.map(acc=>{
      const owned=ownedAccessories.includes(acc.id);
      const equipped=avatarState[acc.slot]===acc.id;
      const canAfford=readXP()>=acc.cost;
      return `<div class="rounded-xl p-3 flex items-center gap-3 border ${equipped?'border-primary bg-surface-container-low':'border-outline-variant bg-surface-container-lowest'}">
        <div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">${acc.emoji}</div>
        <div class="flex-1 min-w-0"><div class="font-bold text-sm">${acc.name}</div><div class="text-xs text-on-surface-variant">${acc.desc}</div>${owned?`<div class="text-xs text-primary font-semibold mt-0.5">✅ Sudah dimiliki</div>`:`<div class="text-xs font-bold mt-0.5" style="color:${canAfford?'#f59e0b':'#ba1a1a'}">💰 ${acc.cost} XP</div>`}</div>
        <div>${owned?`<button onclick="toggleEquip('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${equipped?'bg-primary text-white':'border border-primary text-primary'}">${equipped?'Dipakai':'Pakai'}</button>`:`<button onclick="buyAccessory('${acc.id}')" class="text-xs font-bold px-3 py-1.5 rounded-full transition-all ${canAfford?'bg-primary text-white':'bg-surface-container text-on-surface-variant cursor-not-allowed'}" ${!canAfford?'disabled':''}>Beli</button>`}</div>
      </div>`;
    }).join('');
    applyPreviewAvatar();
    const modal = document.getElementById('avatarShopModal'); if(modal) modal.classList.add('open');
  }

  function selectBase(emoji){ avatarState.base=emoji; saveAvatarState(avatarState); applySidebarAvatar(); applyPreviewAvatar(); document.querySelectorAll('#baseAvatarGrid button').forEach((btn,i)=>{const e=BASE_AVATARS[i];btn.className=`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${e===emoji?'border-primary bg-surface-container-high':'border-outline-variant bg-surface-container-lowest'}`;btn.style.fontSize='22px';}); }

  function buyAccessory(id){ const acc=ACCESSORIES.find(a=>a.id===id); if(!acc) return; let xp = readXP(); if(xp<acc.cost){ showToast && showToast('XP tidak cukup! Tonton video/artikel dulu.','error'); return; } xp-=acc.cost; writeXP(xp); ownedAccessories.push(id); saveOwnedAccessories(ownedAccessories); avatarState[acc.slot]=id; saveAvatarState(avatarState); const el=document.getElementById('xpDisplay'); if(el) el.textContent=xp+' XP'; updateSidebarXP(); applySidebarAvatar(); showToast && showToast('🎉 '+acc.name+' berhasil dibeli & dipakai!','success'); openAvatarShop(); }

  function toggleEquip(id){ const acc=ACCESSORIES.find(a=>a.id===id); if(!acc) return; if(avatarState[acc.slot]===id){ avatarState[acc.slot]=null; showToast && showToast(acc.name+' dilepas.','info'); } else { avatarState[acc.slot]=id; showToast && showToast(acc.emoji+' '+acc.name+' dipakai!','success'); } saveAvatarState(avatarState); applySidebarAvatar(); applyPreviewAvatar(); openAvatarShop(); }

  // Expose to global for inline onclick handlers
  window.openAvatarShop = openAvatarShop;
  window.selectBase = selectBase;
  window.buyAccessory = buyAccessory;
  window.toggleEquip = toggleEquip;

  // Keep UI in sync when storage changes (other tabs) or on load
  window.addEventListener('storage', function(e){ if(e.key==='edu_xp' || e.key==='avatar_state' || e.key==='owned_acc'){ avatarState = loadAvatarState()||avatarState; ownedAccessories = loadOwnedAccessories(); applySidebarAvatar(); updateSidebarXP(); } });
  document.addEventListener('DOMContentLoaded', function(){ avatarState = loadAvatarState()||avatarState; ownedAccessories = loadOwnedAccessories(); applySidebarAvatar(); updateSidebarXP(); });
})();
