/* FitCoach v3.0 — View Router, Exercise Modal, AI Food Vision & IF Timer Engine */
/* ============ NAV ============ */
function go(p) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('on'));
    document.getElementById('p-' + p).classList.add('on');
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.p === p)); window.scrollTo(0, 0)
}
document.querySelectorAll('nav button[data-p]').forEach(b => b.onclick = () => go(b.dataset.p));

/* ============ EXERCISE MODAL ============ */
function showExModal(k){
    const e=EX[k]; if(!e) return;
    if (typeof playing !== 'undefined' && playing) {
        togglePlay(); // Pause workout timer while reviewing exercise
    }
    const hasVid = !!getVideoUrl(k);
    document.getElementById('exModalFig').innerHTML=fig(k,240);
    document.getElementById('exModalFig').className='modal-fig' + (hasVid ? '' : ' single-media');
    document.querySelectorAll('#exModalFig video').forEach(v => { v.muted = true; v.play().catch(()=>{}); });
    document.getElementById('exModalName').textContent=e.n;
    document.getElementById('exModalEq').innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M14.4 14.4l-4.8-4.8"/><path d="M6.5 10.8l-4.3 4.3a2 2 0 0 0 2.8 2.8l4.3-4.3"/><path d="M17.5 13.2l4.3-4.3a2 2 0 0 0-2.8-2.8l-4.3 4.3"/><path d="M2.2 16.2l3 3"/><path d="M18.8 4.8l-3 3"/><path d="M7 9l8 8"/><path d="M9 7l8 8"/></svg> ' + (e.eq || 'ไม่ต้องใช้อุปกรณ์');
    document.getElementById('exModalCue').innerHTML=e.cue.map(c=>'<li>'+c+'</li>').join('');
    const yt=document.getElementById('exModalYt');
    yt.href='https://www.youtube.com/results?search_query='+encodeURIComponent(e.yt);
    document.getElementById('exModal').classList.add('on');
}
function closeExModal(){
    document.getElementById('exModal').classList.remove('on');
    document.querySelectorAll('#exModalFig video').forEach(v => v.pause());
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeExModal()});

/* ==================================================
   ANIMATED FIGURE ENGINE
   pose = [hx,hy, nx,ny, px,py,  feX,feY,fwX,fwY,  neX,neY,nwX,nwY,
           fkX,fkY,faX,faY,  nkX,nkY,naX,naY]
   h=head n=neck p=pelvis  f=far n=near  e=elbow w=wrist k=knee a=ankle
   ================================================== */
const PR={
 tread:'<rect x="22" y="91" width="68" height="4" rx="2" class="pp"/><rect x="86" y="56" width="4" height="35" class="pp"/><rect x="80" y="50" width="16" height="6" rx="2" class="pp"/>',
 benchH:'<rect x="14" y="70" width="60" height="5" rx="2" class="pp"/><rect x="18" y="75" width="4" height="16" class="pp"/><rect x="64" y="75" width="4" height="16" class="pp"/>',
 benchE:'<rect x="6" y="62" width="30" height="6" rx="2" class="pp"/><rect x="9" y="68" width="4" height="22" class="pp"/>',
 chairR:'<rect x="54" y="66" width="34" height="5" rx="2" class="pp"/><rect x="57" y="71" width="4" height="19" class="pp"/><rect x="81" y="71" width="4" height="19" class="pp"/>',
 chairB:'<rect x="64" y="70" width="28" height="5" rx="2" class="pp"/><rect x="67" y="75" width="4" height="15" class="pp"/>',
 chairT:'<rect x="58" y="54" width="34" height="5" rx="2" class="pp"/><rect x="61" y="59" width="4" height="27" class="pp"/><rect x="86" y="59" width="4" height="27" class="pp"/>',
 incline:'<polygon points="38,90 70,40 78,45 46,92" class="pp"/>',
 wallL:'<rect x="36" y="5" width="4" height="89" class="pp"/>',
 wallR:'<rect x="76" y="5" width="4" height="89" class="pp"/>',
 door:'<rect x="26" y="5" width="4" height="89" class="pp"/>'
};
const AN={
 walk:{st:PR.tread,a:[50,15,50,26,50,54,55,39,59,47,45,38,41,32,57,70,61,88,43,70,37,84],b:[50,15,50,26,50,54,45,38,41,32,55,39,59,47,43,70,37,86,57,70,61,86]},
 run:{st:PR.tread,a:[50,14,50,25,50,53,57,38,62,44,43,36,38,28,60,66,68,84,40,72,32,80],b:[50,14,50,25,50,53,43,36,38,28,57,38,62,44,40,68,34,86,60,64,66,74]},
 catcow:{a:[76,50,68,54,42,58,70,68,72,86,70,68,72,86,40,74,38,88,40,74,38,88],b:[74,62,68,62,42,50,70,70,72,86,70,70,72,86,40,72,38,88,40,72,38,88]},
 thor:{st:PR.chairT,a:[70,58,62,56,40,60,68,52,78,50,68,52,78,50,38,74,32,84,38,74,32,84],b:[70,66,62,62,40,58,68,56,78,52,68,56,78,52,38,74,32,84,38,74,32,84]},
 p9090:{a:[46,40,46,50,46,70,40,60,36,70,40,60,36,70,34,78,22,72,60,76,74,72],b:[46,40,46,50,46,70,40,60,36,70,40,60,36,70,34,74,20,80,60,74,72,82]},
 hipflex:{a:[50,24,50,34,50,58,46,46,44,58,46,46,44,58,40,84,28,88,62,66,62,88],b:[52,20,52,30,55,56,50,36,48,22,50,36,48,22,38,86,26,90,60,66,60,88]},
 bridge:{a:[22,80,30,80,52,84,30,86,40,88,30,86,40,88,66,66,66,88,66,66,66,88],b:[22,78,30,78,52,68,30,84,40,88,30,84,40,88,66,60,66,88,66,60,66,88]},
 bmarch:{a:[22,78,30,78,52,68,30,84,40,88,30,84,40,88,66,60,66,88,66,60,66,88],b:[22,78,30,78,52,68,30,84,40,88,30,84,40,88,66,60,66,88,60,50,64,66]},
 birddog:{a:[76,52,68,56,42,58,70,66,72,86,70,66,72,86,40,74,38,88,40,74,38,88],b:[76,50,68,54,42,58,80,50,90,46,70,66,72,86,40,74,38,88,30,60,18,54]},
 deadbug:{a:[20,78,28,78,56,80,30,64,30,52,30,66,30,54,64,62,76,62,66,60,78,60],b:[20,78,28,78,56,80,26,60,18,50,30,66,30,54,70,72,86,78,66,60,78,60]},
 sideplank:{a:[76,50,70,54,44,74,70,74,62,80,70,74,62,80,30,84,20,90,30,84,20,90],b:[76,48,70,52,44,70,70,74,62,80,70,74,62,80,30,82,20,88,30,82,20,88]},
 wallslide:{st:PR.wallL,a:[48,18,48,28,48,56,40,38,40,26,40,38,40,26,48,74,48,90,48,74,48,90],b:[48,18,48,28,48,56,42,28,42,14,42,28,42,14,48,74,48,90,48,74,48,90]},
 child:{a:[74,74,66,70,38,66,78,72,88,76,78,72,88,76,34,80,26,84,34,80,26,84],b:[78,78,68,74,38,68,82,76,92,80,82,76,92,80,34,82,26,86,34,82,26,86]},
 fig4:{a:[18,80,26,80,54,82,34,74,46,68,34,74,46,68,62,68,74,64,66,64,60,50],b:[18,80,26,80,54,82,32,70,44,62,32,70,44,62,58,60,70,54,62,56,54,44]},
 hamstr:{dy:'strap',a:[18,80,26,80,54,82,34,74,48,68,34,74,48,68,64,80,78,82,66,72,78,74],b:[18,80,26,80,54,82,34,70,50,54,34,70,50,54,64,80,78,82,62,58,66,38]},
 thread:{a:[76,52,68,56,42,58,70,66,72,86,70,66,72,86,40,74,38,88,40,74,38,88],b:[70,72,64,66,42,58,56,72,44,76,70,66,72,86,40,74,38,88,40,74,38,88]},
 door:{st:PR.door,a:[48,18,48,28,48,56,40,38,34,32,40,38,34,32,48,74,48,90,48,74,48,90],b:[54,18,54,28,54,56,44,38,34,30,44,38,34,30,42,74,38,90,58,74,62,90]},
 twist:{a:[20,80,28,80,54,82,34,74,46,72,34,74,46,72,66,74,78,78,66,74,78,78],b:[20,80,28,80,54,80,34,72,46,70,34,72,46,70,62,64,72,58,62,64,72,58]},
 legswall:{st:PR.wallR,a:[18,84,26,84,54,86,32,78,44,74,32,78,44,74,64,64,70,44,64,64,70,44],b:[18,84,26,84,54,86,32,78,44,74,32,78,44,74,66,62,72,40,66,62,72,40]},
 goblet:{dy:'kb',a:[50,16,50,27,50,56,43,38,47,31,43,38,47,31,50,74,50,92,50,74,50,92],b:[46,30,47,40,44,64,40,50,45,43,40,50,45,43,57,72,50,92,57,72,50,92]},
 hinge:{dy:'db',a:[50,16,50,27,50,55,48,41,47,55,48,41,47,55,50,74,50,92,50,74,50,92],b:[64,32,58,38,42,54,55,52,55,68,55,52,55,68,47,74,50,92,47,74,50,92]},
 hipthrust:{st:PR.benchE,dy:'db',a:[26,62,33,60,52,76,33,68,42,74,33,68,42,74,62,62,62,88,62,62,62,88],b:[26,58,33,56,52,58,33,64,42,60,33,64,42,60,62,58,62,88,62,58,62,88]},
 benchpress:{st:PR.benchH,dy:'db',a:[24,64,32,64,58,66,40,64,34,58,40,64,34,58,70,66,74,88,70,66,74,88],b:[24,64,32,64,58,66,34,54,34,42,34,54,34,42,70,66,74,88,70,66,74,88]},
 bss:{st:PR.chairB,dy:'db',a:[50,18,50,28,50,56,48,42,47,56,48,42,47,56,62,66,74,70,44,74,42,92],b:[50,26,50,36,50,64,48,50,47,64,48,50,47,64,60,78,74,72,42,78,40,92]},
 ohp:{dy:'db',a:[50,17,50,28,50,56,42,40,45,30,42,40,45,30,50,74,50,92,50,74,50,92],b:[50,17,50,28,50,56,46,26,47,13,46,26,47,13,50,74,50,92,50,74,50,92]},
 row:{st:PR.chairR,dy:'db1',a:[74,44,68,48,42,54,66,56,72,64,66,64,66,80,34,70,34,90,42,72,42,90],b:[74,44,68,48,42,54,66,56,72,64,58,58,62,64,34,70,34,90,42,72,42,90]},
 csrow:{st:PR.incline,dy:'db',a:[66,38,62,46,44,64,62,60,62,76,62,60,62,76,44,78,44,92,46,78,46,92],b:[66,38,62,46,44,64,54,54,58,62,54,54,58,62,44,78,44,92,46,78,46,92]},
 pullover:{st:PR.benchH,dy:'db1',a:[26,62,34,62,60,66,30,52,24,44,30,52,24,44,72,66,76,88,72,66,76,88],b:[26,62,34,62,60,66,38,54,42,44,38,54,42,44,72,66,76,88,72,66,76,88]},
 curl:{dy:'db',a:[50,16,50,27,50,55,48,43,47,57,48,43,47,57,50,74,50,92,50,74,50,92],b:[50,16,50,27,50,55,48,43,44,33,48,43,44,33,50,74,50,92,50,74,50,92]},
 lat:{dy:'db',a:[50,16,50,27,50,55,53,42,54,55,47,42,46,55,50,74,50,92,50,74,50,92],b:[50,16,50,27,50,55,60,32,71,29,40,32,29,29,50,74,50,92,50,74,50,92]},
 swing:{dy:'kb',a:[62,34,58,40,42,56,54,56,52,70,54,56,52,70,46,74,50,92,46,74,50,92],b:[50,16,50,27,50,55,52,38,62,36,52,38,62,36,50,74,50,92,50,74,50,92]},
 thruster:{dy:'db',a:[46,30,47,40,44,64,40,50,45,43,40,50,45,43,57,72,50,92,57,72,50,92],b:[50,17,50,28,50,56,46,26,47,13,46,26,47,13,50,74,50,92,50,74,50,92]},
 pushup:{a:[76,58,70,60,46,68,72,72,74,86,72,72,74,86,30,76,22,88,30,76,22,88],b:[76,68,70,70,46,76,64,76,74,86,64,76,74,86,30,82,22,90,30,82,22,90]},
 abwheel:{dy:'wheel',a:[62,46,56,52,44,64,66,56,74,62,66,56,74,62,42,80,30,84,42,80,30,84],b:[74,62,68,64,46,70,80,68,90,74,80,68,90,74,32,84,22,88,32,84,22,88]},
 plank:{a:[76,62,70,64,44,70,70,80,60,86,70,80,60,86,28,78,20,88,28,78,20,88],b:[76,64,70,66,44,72,70,80,60,86,70,80,60,86,28,80,20,88,28,80,20,88]},
 mtn:{a:[76,58,70,60,46,68,72,72,74,86,72,72,74,86,30,76,22,88,30,76,22,88],b:[76,58,70,60,46,68,72,72,74,86,72,72,74,86,30,76,22,88,52,72,60,80]},
 hula:{dy:'hoop',a:[50,15,50,26,48,54,58,34,62,22,42,34,38,22,52,72,54,90,46,72,46,90],b:[50,15,50,26,52,54,58,34,62,22,42,34,38,22,56,72,56,90,50,72,48,90]}
};
/* จับคู่ท่า -> แอนิเมชัน */
const AMAP={w_walk:'walk',c_walk:'walk',walk:'walk',z2:'walk',hiitW:'walk',hiitR:'run',
 w_cat:'catcow',w_thor:'thor',w_9090:'p9090',w_hipflex:'hipflex',c_hip:'hipflex',
 w_bridge:'bridge',bmarch:'bmarch',w_bird:'birddog',w_deadbug:'deadbug',w_side:'sideplank',
 w_wall:'wallslide',c_child:'child',c_fig4:'fig4',c_ham:'hamstr',c_thread:'thread',
 c_door:'door',c_twist:'twist',c_legs:'legswall',goblet:'goblet',rdl:'hinge',thrust:'hipthrust',
 bench:'benchpress',bss:'bss',press:'ohp',row:'row',csrow:'csrow',pullover:'pullover',
 curl:'curl',lat:'lat',swing:'swing',thruster:'thruster',pushup:'pushup',wheel:'abwheel',
 plank:'plank',mtn:'mtn',hula:'hula'};

const VIDEO_MAP = {
    // Warm-up & Core
    w_cat: 'video/catcow.mp4',
    w_thor: 'video/w_thor.mp4',
    w_hipflex: 'video/w_hipflex.mp4',
    w_bridge: 'video/w_bridge.mp4',
    w_bird: 'video/birddog.mp4',
    w_deadbug: 'video/deadbug.mp4',
    w_side: 'video/sideplank.mp4',
    w_wall: 'video/w_wall.mp4',
    // Main Strength & Core Exercises
    goblet: 'video/squat_trainer.mp4',
    rdl: 'video/rdl.mp4',
    thrust: 'video/thrust.mp4',
    bmarch: 'video/bmarch.mp4',
    bench: 'video/bench.mp4',
    bss: 'video/bss.mp4',
    press: 'video/press.mp4',
    row: 'video/row.mp4',
    csrow: 'video/csrow.mp4',
    pullover: 'video/pullover.mp4',
    curl: 'video/curl.mp4',
    lat: 'video/lat.mp4',
    swing: 'video/swing.mp4',
    thruster: 'video/thruster.mp4',
    pushup: 'video/pushup.mp4',
    wheel: 'video/wheel.mp4',
    plank: 'video/plank.mp4',
    mtn: 'video/mtn.mp4'
};

function getVideoUrl(k) {
    if (VIDEO_MAP[k]) return VIDEO_MAP[k];
    const e = EX[k];
    if (e && e.vid) return e.vid;
    return null;
}

function figClass(k){return k.startsWith('w_')?'warm':k.startsWith('c_')?'cool':''}

function fig(k,sz){
    const e=EX[k];
    if(!e) return '';
    const vid = getVideoUrl(k);
    
    // In small list view (sz <= 80), show single media thumbnail
    if (sz <= 80) {
        if (vid) {
            return `<video src="${vid}" poster="${e.img || ''}" autoplay loop muted playsinline style="width:${sz}px;height:${sz}px;object-fit:cover;border-radius:10px;border:1px solid var(--line);background:#000;flex:0 0 auto;"></video>`;
        } else if (e.img) {
            return `<img src="${e.img}" style="width:${sz}px;height:${sz}px;object-fit:cover;border-radius:10px;border:1px solid var(--line);background:#f8fafc;flex:0 0 auto;" />`;
        }
        return '';
    }

    // In Player & Modal: mutually exclusive media (video ONLY if video exists, image ONLY if no video)
    if (vid) {
        return `<video src="${vid}" poster="${e.img || ''}" autoplay loop muted playsinline onclick="this.paused?this.play():this.pause()" title="แตะเพื่อหยุด/เล่นต่อ"></video>`;
    }
    if (e.img) {
        return `<img src="${e.img}" alt="${e.n || ''}" />`;
    }
    return '';
}

function eqp(t,p){
 const dumb=(x,y)=>`<rect class="eqp" x="${x-6}" y="${y-1.4}" width="12" height="2.8" rx="1.4"/><rect class="eqp" x="${x-7.5}" y="${y-3.6}" width="3" height="7.2" rx="1.4"/><rect class="eqp" x="${x+4.5}" y="${y-3.6}" width="3" height="7.2" rx="1.4"/>`;
 if(t==='db')return dumb(p[8],p[9])+dumb(p[12],p[13]);
 if(t==='db1')return dumb(p[12],p[13]);
 if(t==='kb')return `<circle class="eqp" cx="${p[12]}" cy="${p[13]+4}" r="5"/><path class="eqp" d="M${p[12]-4} ${p[13]} q4 -5 8 0 v2 h-2 q-2 -3 -4 0 z"/>`;
 if(t==='wheel')return `<circle class="eqp" cx="${p[12]}" cy="${p[13]+3}" r="6"/><rect class="eqp" x="${p[12]-8}" y="${p[13]+1.8}" width="16" height="2.4" rx="1.2"/>`;
 if(t==='hoop')return `<ellipse cx="${p[4]}" cy="${p[5]+3}" rx="18" ry="5.5" fill="none" stroke="#5b93f0" stroke-width="2.4"/>`;
 if(t==='strap')return `<line x1="${p[12]}" y1="${p[13]}" x2="${p[20]}" y2="${p[21]}" stroke="#5b93f0" stroke-width="1.8" stroke-dasharray="3 2"/>`;
 return '';
}
function paintFig(el,t){
 const a=AN[el.dataset.a]; if(!a) return;
 const p=a.a.map((v,i)=>v+(a.b[i]-v)*t);
 el.innerHTML=`<line class="gr" x1="3" y1="94" x2="97" y2="94"/>${a.st||''}`
 +`<polyline class="lf" points="${p[2]},${p[3]} ${p[6]},${p[7]} ${p[8]},${p[9]}"/>`
 +`<polyline class="lf" points="${p[4]},${p[5]} ${p[14]},${p[15]} ${p[16]},${p[17]}"/>`
 +`<line class="ln" x1="${p[2]}" y1="${p[3]}" x2="${p[4]}" y2="${p[5]}"/>`
 +`<circle class="hd" cx="${p[0]}" cy="${p[1]}" r="6.4"/>`
 +`<polyline class="ln" points="${p[4]},${p[5]} ${p[18]},${p[19]} ${p[20]},${p[21]}"/>`
 +`<polyline class="ln" points="${p[2]},${p[3]} ${p[10]},${p[11]} ${p[12]},${p[13]}"/>`
 +(a.dy?eqp(a.dy,p):'');
}
let _ft=0;
setInterval(()=>{
 _ft+=0.045; const t=(1-Math.cos(_ft*Math.PI*2))/2, vh=innerHeight;
 document.querySelectorAll('.fig').forEach(el=>{
   const r=el.getBoundingClientRect();
   if(r.bottom>-40&&r.top<vh+40)paintFig(el,t);});
   
 // Toggle 2-frame AI images based on t (t cycles 0 to 1)
 document.querySelectorAll('.ai-fig').forEach(el=>{
   const f2 = el.querySelector('.f2');
   if(f2) f2.style.opacity = (t > 0.5) ? 1 : 0;
 });
},80);

/* ============ IF TIMER LOGIC ============ */
D.if = D.if || { start: null, goal: 16 };



async function shiftSchedule(days = 1) {
    D.schOffs = ((D.schOffs || 0) + days) % 7;
    D.schOffsUpdatedAt = Date.now();
    save();
    render();
    if (currentUser && fbDb) {
        await pushToCloud();
    }
    const actualD = getThaiDayOfWeek();
    const dow = (actualD - (D.schOffs || 0) + 7) % 7;
    const activeSched = (typeof getActiveSchedule === 'function') ? getActiveSchedule() : SCHED;
    const targetWk = W[activeSched[dow]];
    msg('✓ เลื่อนชดเชยแล้ว ➜ วันนี้เป็น: <b>' + (targetWk ? targetWk.n : 'ตารางใหม่') + '</b>');
}

async function resetScheduleShift() {
    D.schOffs = 0;
    D.schOffsUpdatedAt = Date.now();
    save();
    render();
    if (currentUser && fbDb) {
        await pushToCloud();
    }
    msg('✓ คืนค่าตารางปกติเรียบร้อยแล้ว');
}

async function resetProgram() {
    const confirmed = await fcConfirm('ต้องการรีเซ็ตเพื่อเริ่มต้นโปรแกรมใหม่ (เริ่มสัปดาห์ที่ 1 วันนี้) ใช่หรือไม่?', '🔄 เริ่มโปรแกรมใหม่');
    if (!confirmed) return;

    const clearStats = await fcConfirm('ต้องการล้างประวัติสถิติเดิมทั้งหมด (เช็คอิน, กราฟ, ประวัติซ้อม) ด้วยหรือไม่?\n\n• กด "ตกลง" = ล้างสถิติเก่า เริ่มนับ 1 ใหม่ทั้งหมด\n• กด "ยกเลิก" = เก็บสถิติเดิมไว้ แค่เริ่มโปรแกรมใหม่', '📊 ล้างสถิติเก่าหรือไม่?');

    // Open full onboarding Smart Program Wizard
    const res = await calcBMR('🎯 ตั้งค่าโปรแกรมและข้อมูลสุขภาพใหม่', true, true);
    if (!res) return; // User cancelled modal

    const { w, bmr, tdee, targetCal, targetPro, targetWater, targetW, courseWeeks, lossPerWk, lossPerMonth, bf, muscle, visceral, rhr, vo2max, hrv } = res;
    
    // Apply Reset
    D.start = iso();
    D.schOffs = (getThaiDayOfWeek() - 1 + 7) % 7;
    D.schOffsUpdatedAt = Date.now();
    
    const prev = D.checks.length > 0 ? D.checks[D.checks.length - 1] : null;
    const rec = { 
        d: iso(), 
        w: w, 
        bf: bf || prev?.bf || null, 
        muscle: muscle || null,
        visceral: visceral || null,
        rhr: rhr || null,
        vo2max: vo2max || null,
        hrv: hrv || null, 
        pain: 0, 
        cal: null, 
        protein: null, 
        water: null 
    };
    
    if (clearStats) {
        D.checks = [ rec ];
        D.sessions = [];
        D.sets = [];
    } else {
        const existingIndex = D.checks.findIndex(x => x.d === iso());
        if (existingIndex >= 0) {
            D.checks[existingIndex] = { ...D.checks[existingIndex], ...rec };
        } else {
            D.checks.push(rec);
        }
    }
    
    save(); render();
    if (currentUser && fbDb) {
        await pushToCloud();
    }
    
    setTimeout(() => {
        fcAlert(`
            <div style="font-size:16px;"><b>🎉 เริ่มต้นโปรแกรมใหม่สำเร็จ!</b></div><br>
            ระยะเวลาคอร์ส: <b>${courseWeeks} สัปดาห์ (~${(courseWeeks/4.33).toFixed(1)} เดือน)</b><br>
            เป้าหมายน้ำหนัก: <b>${w.toFixed(1)} กก. → ${targetW.toFixed(1)} กก.</b> (ลด ${(w - targetW).toFixed(1)} กก.)<br>
            อัตราลดเป้าหมาย: <b>${lossPerWk.toFixed(2)} กก./สัปดาห์ (~${lossPerMonth.toFixed(1)} กก./เดือน)</b><br><br>
            <div style="color:var(--acc);font-weight:bold;">เป้าหมายประจำวัน:</div>
            พลังงาน: <b>${targetCal}</b> kcal/วัน<br>
            โปรตีน: <b>${targetPro}</b> g/วัน<br>
            น้ำดื่ม: <b>${targetWater.toLocaleString()}</b> มล. (~${(targetWater/1000).toFixed(1)} ลิตร)<br><br>
            <span style="color:var(--dim);font-size:13px;">${clearStats ? '(ล้างสถิติเดิม เริ่มนับ 1 ใหม่จากศูนย์)' : '(เก็บประวัติสถิติเดิมไว้)'}</span>
        `);
    }, 300);
}

async function resetAllData() {
    const ok = await fcConfirm('⚠️ ต้องการล้างสถิติและข้อมูลทั้งหมดเพื่อเริ่มต้นใหม่จากศูนย์หรือไม่?\n\n(ประวัติเช็คอิน กราฟ และประวัติการออกกำลังกายทั้งในเครื่องและบนคลาวด์จะถูกล้างใหม่ทั้งหมด)', '⚠️ ล้างข้อมูลเริ่มต้นใหม่');
    if (!ok) return;

    const doubleCheck = await fcConfirm('ยืนยันอีกครั้ง! คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมดเพื่อเริ่มนับ 1 ใหม่?', 'ยืนยันการล้างข้อมูล');
    if (!doubleCheck) return;

    const res = await calcBMR('🎯 ตั้งค่าน้ำหนักและเป้าหมายใหม่', true);
    if (!res) return;

    const { w, bmr, tdee, targetCal, targetPro } = res;

    D.start = iso();
    D.schOffs = (getThaiDayOfWeek() - 1 + 7) % 7;
    D.schOffsUpdatedAt = Date.now();
    D.checks = [{ d: iso(), w: w, bf: null, hrv: null, pain: null, cal: null, protein: null, water: null }];
    D.sessions = [];
    D.sets = [];
    
    save(); render();
    if (currentUser && fbDb) {
        await pushToCloud();
    }
    
    setTimeout(() => {
        fcAlert(`<div style="font-size:16px;"><b>✨ ล้างข้อมูลและเริ่มต้นใหม่จากศูนย์เรียบร้อย!</b></div><br>น้ำหนักตั้งต้น: <b>${w}</b> กก.<br>เป้าหมายพลังงาน: <b>${targetCal}</b> kcal/วัน<br>เป้าหมายโปรตีน: <b>${targetPro}</b> g/วัน`);
    }, 300);
}

/* ============ INTERMITTENT FASTING (IF) LOGIC — WISEMEAL MODEL ============ */
D.if = D.if || { start: null, goal: 16, updatedAt: Date.now() };

let ifDraftGoal = 16;
let ifRollerState = {
    day: 'today', // 'yesterday', 'today', 'tomorrow'
    hour: 18,
    min: 0
};

const IF_PLANS_CATALOG = [
    {
        goal: 12, eat: 12,
        name: '12:12',
        desc: 'จังหวะเริ่มต้นที่สมดุล',
        icon: '🥗',
        clockColor: '#67e8f9',
        bowlColor: '#ccfbf1'
    },
    {
        goal: 14, eat: 10,
        name: '14:10',
        desc: 'ช่วงอดอาหารแบบเบา',
        icon: '🍲',
        clockColor: '#fde047',
        bowlColor: '#fef9c3'
    },
    {
        goal: 16, eat: 8,
        name: '16:8',
        desc: 'แผนเริ่มต้นที่เหมาะกับมือใหม่',
        icon: '🥣',
        clockColor: '#38bdf8',
        bowlColor: '#e0f2fe'
    },
    {
        goal: 18, eat: 6,
        name: '18:6',
        desc: 'ช่วงอดอาหารที่นานขึ้น',
        icon: '🥘',
        clockColor: '#f472b6',
        bowlColor: '#fce7f3'
    },
    {
        goal: 20, eat: 4,
        name: '20:4',
        desc: 'แผนอดอาหารขั้นสูง',
        icon: '🥑',
        clockColor: '#c084fc',
        bowlColor: '#f3e8ff'
    }
];

function setIFGoal(hrs) {
    D.if.goal = hrs;
    D.if.updatedAt = Date.now();
    save();
    updateIFUI();
    if (currentUser && fbDb) pushToCloud();
    if (typeof msg === 'function') msg('✓ ตั้งค่าเป้าหมาย IF เป็น ' + hrs + ':8 แล้ว');
}

function endFastingSession(endTimeMs, durationHours) {
    if (!D.if) D.if = { goal: 16 };
    const endMs = endTimeMs || Date.now();
    const dur = durationHours != null ? durationHours : (D.if.start ? Math.max(0, (endMs - D.if.start) / 3600000) : 0);
    D.if.lastFastEnd = endMs;
    D.if.lastFastDuration = dur;
    D.if.eatingWindowStart = endMs;
    D.if.start = null;
    D.if.updatedAt = Date.now();
    save();
    if (currentUser && fbDb) pushToCloud();
    const h = Math.floor(dur);
    const m = Math.floor((dur % 1) * 60);
    if (typeof msg === 'function') msg(`✓ สิ้นสุดการอดอาหาร (${h} ชม. ${m} นาที) เริ่มช่วงเวลารับประทานอาหาร`);
    updateIFUI();
}
window.endFastingSession = endFastingSession;

function endFastingFromLoggedMeal() {
    const tc = typeof todayCheck === 'function' ? todayCheck() : null;
    const mealsToday = (tc && tc.meals) ? tc.meals.filter(m => (Number(m.cal) || 0) > 0) : [];
    if (mealsToday.length > 0 && mealsToday[0].time) {
        const parts = mealsToday[0].time.split(':');
        const mealDate = new Date();
        mealDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
        const endMs = mealDate.getTime();
        const dur = (D.if && D.if.start) ? Math.max(0, (endMs - D.if.start) / 3600000) : 0;
        endFastingSession(endMs, dur);
    } else {
        endFastingSession();
    }
}
window.endFastingFromLoggedMeal = endFastingFromLoggedMeal;

async function toggleIF() {
    if (D.if.start) {
        const tc = typeof todayCheck === 'function' ? todayCheck() : null;
        const mealsToday = (tc && tc.meals) ? tc.meals.filter(m => (Number(m.cal) || 0) > 0) : [];
        let promptMsg = 'สิ้นสุดการทำ IF รอบนี้ (เริ่มช่วงเวลากินอาหาร) ใช่หรือไม่?';
        let customEndTime = Date.now();
        let customDuration = (Date.now() - D.if.start) / 3600000;

        if (mealsToday.length > 0 && mealsToday[0].time) {
            const mParts = mealsToday[0].time.split(':');
            if (mParts.length === 2) {
                const mealDate = new Date();
                mealDate.setHours(parseInt(mParts[0], 10), parseInt(mParts[1], 10), 0, 0);
                if (mealDate.getTime() > D.if.start && mealDate.getTime() <= Date.now()) {
                    const durH = (mealDate.getTime() - D.if.start) / 3600000;
                    const h = Math.floor(durH);
                    const m = Math.floor((durH % 1) * 60);
                    promptMsg = `ตรวจพบว่าเริ่มทานอาหารมื้อแรก (${mealsToday[0].name}) เวลา ${mealsToday[0].time} น.<br><br>ต้องการ <b>สิ้นสุดการอดอาหารที่เวลา ${mealsToday[0].time} น.</b> (ทำได้ ${h} ชม. ${m} นาที) และเริ่มช่วงเวลากินอาหาร ใช่หรือไม่?`;
                    customEndTime = mealDate.getTime();
                    customDuration = durH;
                }
            }
        }

        if (await fcConfirm(promptMsg, '⏹ สิ้นสุดการอดอาหาร')) {
            endFastingSession(customEndTime, customDuration);
        }
    } else {
        D.if.start = Date.now();
        D.if.notifiedComplete = false;
        D.if.eatingWindowStart = null;
        D.if.updatedAt = Date.now();
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        save();
        if (currentUser && fbDb) pushToCloud();
        if (typeof msg === 'function') msg('✓ เริ่มต้นจับเวลาการอดอาหารแล้ว');
        updateIFUI();
    }
}

/* ============ WISEMEAL IF MODAL HANDLERS ============ */
function openIfPlanModal() {
    ifDraftGoal = (D.if && D.if.goal) ? D.if.goal : 16;
    renderIfPlanCards();
    const sheet = document.getElementById('ifPlanModalSheet');
    if (sheet) sheet.classList.add('on');
}

function renderIfPlanCards() {
    const container = document.getElementById('ifPlanCardsContainer');
    if (!container) return;
    container.innerHTML = IF_PLANS_CATALOG.map(p => {
        const isSel = p.goal === ifDraftGoal;
        return `
            <div class="wm-if-plan-card ${isSel ? 'selected' : ''}" onclick="selectIfPlan(${p.goal})">
                <div style="display:flex; align-items:center;">
                    <div class="wm-if-plan-radio"></div>
                    <div>
                        <div style="font-size:18px; font-weight:900; color:#0f172a; line-height:1.2;">${p.name}</div>
                        <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:2px;">${p.desc}</div>
                    </div>
                </div>
                <div style="width:48px; height:48px; border-radius:14px; background:${p.bowlColor}; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 2px 8px rgba(15,23,42,0.04);">
                    ${p.icon}
                </div>
            </div>
        `;
    }).join('');
}

function selectIfPlan(hrs) {
    ifDraftGoal = hrs;
    renderIfPlanCards();
}

function confirmIfPlanSelection() {
    setIFGoal(ifDraftGoal);
    closeIfModal('ifPlanModalSheet');
}

function openIfTimeModal() {
    const baseDate = (D.if && D.if.start) ? new Date(D.if.start) : new Date();
    ifRollerState.hour = baseDate.getHours();
    ifRollerState.min = baseDate.getMinutes();

    const todayIso = iso(new Date());
    const startIso = iso(baseDate);
    ifRollerState.day = (startIso === todayIso) ? 'today' : 'yesterday';

    updateIfRollerDisplay();
    const sheet = document.getElementById('ifTimeModalSheet');
    if (sheet) sheet.classList.add('on');
}

function updateIfRollerDisplay() {
    const dayEl = document.getElementById('ifRollerDayText');
    const hrEl = document.getElementById('ifRollerHourText');
    const minEl = document.getElementById('ifRollerMinText');

    if (dayEl) {
        dayEl.textContent = ifRollerState.day === 'today' ? 'วันนี้' : (ifRollerState.day === 'yesterday' ? 'เมื่อวานนี้' : 'พรุ่งนี้');
    }
    if (hrEl) {
        hrEl.textContent = String(ifRollerState.hour).padStart(2, '0');
    }
    if (minEl) {
        minEl.textContent = String(ifRollerState.min).padStart(2, '0');
    }
}

function setIfTimeDay(d) {
    ifRollerState.day = d;
    updateIfRollerDisplay();
}

function adjustIfTimeHour(delta) {
    let h = ifRollerState.hour + delta;
    if (h < 0) h = 23;
    if (h > 23) h = 0;
    ifRollerState.hour = h;
    updateIfRollerDisplay();
}

function adjustIfTimeMinute(delta) {
    let m = ifRollerState.min + delta;
    if (m < 0) m = 55;
    if (m > 59) m = 0;
    ifRollerState.min = m;
    updateIfRollerDisplay();
}

function saveIfRollerTime() {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (ifRollerState.day === 'yesterday') {
        targetDate.setDate(targetDate.getDate() - 1);
    } else if (ifRollerState.day === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
    }
    targetDate.setHours(ifRollerState.hour, ifRollerState.min, 0, 0);

    D.if.start = targetDate.getTime();
    D.if.updatedAt = Date.now();
    save();
    updateIFUI();
    if (currentUser && fbDb) pushToCloud();
    closeIfModal('ifTimeModalSheet');
    if (typeof msg === 'function') msg('✓ บันทึกเวลาเริ่มอดอาหารเป็น ' + formatThaiTime(targetDate) + ' น.');
}

function openIfNoticeModal() {
    const sheet = document.getElementById('ifNoticeModalSheet');
    if (sheet) sheet.classList.add('on');
}

function closeIfModal(id) {
    const sheet = document.getElementById(id);
    if (sheet) sheet.classList.remove('on');
}

function openIfHistoryModal() {
    const lastCheck = (D && D.checks && D.checks.length) ? D.checks[D.checks.length - 1] : {};
    const goalHrs = (D && D.if && D.if.goal) ? D.if.goal : 16;
    fcAlert(`
        <div style="text-align:left; font-size:13.5px; line-height:1.6;">
            <div style="font-size:16px; font-weight:900; color:#0f172a; margin-bottom:8px;">📋 ประวัติและสถิติ IF</div>
            <div style="background:#f8fafd; border-radius:12px; padding:12px; border:1px solid #e2e8f0; margin-bottom:10px;">
                <div>🎯 <b>แผนปัจจุบัน:</b> IF ${goalHrs}:${24 - goalHrs}</div>
                <div>⏱️ <b>สถานะล่าสุด:</b> ${D.if.start ? 'กำลังอดอาหาร' : 'ช่วงเวลารับประทาน (Feeding Window)'}</div>
                <div>🔥 <b>การเผาผลาญไขมันตับ:</b> กำลังทำงานสมบูรณ์</div>
            </div>
            <div style="font-size:12px; color:#64748b;">ระบบบันทึกเวลา IF และซิงก์ตรงกับ Google Cloud อัตโนมัติทุกรอบ</div>
        </div>
    `);
}

function editIFStart() {
    openIfTimeModal();
}

/* ============ MAIN UPDATE IF UI (WISEMEAL REPLICA) ============ */
function updateIFUI() {
    const disp = document.getElementById('ifTimerDisplay');
    if (!disp) return;

    const cardTitle = document.getElementById('ifCardTitle');
    const timerSub = document.getElementById('ifTimerSub');
    const dayLabel = document.getElementById('ifDayLabel');
    const goalPill = document.getElementById('ifGoalPillText');
    const toggleBtn = document.getElementById('ifToggleBtn');
    const btnIcon = document.getElementById('ifToggleBtnIcon');
    const btnText = document.getElementById('ifToggleBtnText');
    const arcEl = document.getElementById('v3IfArcPath');

    const stTime = document.getElementById('ifStartTime');
    const startDayEl = document.getElementById('ifStartDayText');
    const endTimeEl = document.getElementById('ifEndTime');
    const endDayEl = document.getElementById('ifEndDayText');

    // Compatibility Elements
    const bar = document.getElementById('ifProgressBar');
    const stText = document.getElementById('ifStatusText');
    const goalTx = document.getElementById('ifGoalText');
    const eatWindowTx = document.getElementById('ifEatWindowText');
    const countdownTx = document.getElementById('ifCountdownText');

    const goalHrs = (D.if && D.if.goal) ? D.if.goal : 16;
    const goalSec = goalHrs * 3600;

    if (goalPill) goalPill.textContent = `${goalHrs}:${24 - goalHrs}`;
    if (goalTx) goalTx.textContent = goalHrs;
    if (eatWindowTx) eatWindowTx.textContent = `${24 - goalHrs} ชม.`;

    const now = Date.now();

    if (D.if && D.if.start) {
        const diffSec = Math.max(0, Math.floor((now - D.if.start) / 1000));
        const elapsedHours = diffSec / 3600;

        // Completion voice & notification
        if (diffSec >= goalSec && !D.if.notifiedComplete) {
            D.if.notifiedComplete = true;
            save();
            speakCoach('ยินดีด้วยครับ คุณอดอาหารครบ ' + goalHrs + ' ชั่วโมงแล้ว เริ่มรับประทานอาหารได้ครับ');
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    new Notification('🎉 FitCoach: อดอาหารครบเวลาแล้ว!', {
                        body: 'คุณอดอาหารครบ ' + goalHrs + ' ชั่วโมงแล้ว เริ่มช่วงเวลาทานอาหารได้เลยครับ',
                        icon: 'icon.svg'
                    });
                } catch(e) {}
            }
        }

        // Live Timer Readout (HH:MM:SS)
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        disp.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        if (cardTitle) cardTitle.textContent = 'กำลังอดอาหาร';
        if (timerSub) timerSub.textContent = 'อดอาหารไปแล้ว';

        // Day label above time
        const startDate = new Date(D.if.start);
        const nowDate = new Date();
        const todayMidnightMs = new Date(iso(nowDate) + 'T00:00:00+07:00').getTime();
        const startMidnightMs = new Date(iso(startDate) + 'T00:00:00+07:00').getTime();
        const daysDiff = Math.round((todayMidnightMs - startMidnightMs) / 864e5);

        let startDayStr = 'วันนี้';
        if (daysDiff === 1) startDayStr = 'เมื่อวานนี้';
        else if (daysDiff > 1) startDayStr = `${startDate.getDate()}/${startDate.getMonth() + 1}`;
        if (dayLabel) dayLabel.textContent = startDayStr;
        if (startDayEl) startDayEl.textContent = startDayStr;
        if (stTime) stTime.textContent = formatThaiTime(startDate);

        // Calculated End Time
        const endDate = new Date(D.if.start + goalSec * 1000);
        const endMidnightMs = new Date(iso(endDate) + 'T00:00:00+07:00').getTime();
        const endDaysDiff = Math.round((endMidnightMs - todayMidnightMs) / 864e5);

        let endDayStr = 'วันนี้';
        if (endDaysDiff === 1) endDayStr = 'พรุ่งนี้';
        else if (endDaysDiff > 1) endDayStr = `${endDate.getDate()}/${endDate.getMonth() + 1}`;
        if (endDayEl) endDayEl.textContent = endDayStr;
        if (endTimeEl) endTimeEl.textContent = formatThaiTime(endDate);

        // Circular Dial Progress Arc (Total circumference 462)
        const pct = Math.min(1, Math.max(0.04, diffSec / goalSec));
        if (arcEl && typeof arcEl.setAttribute === 'function') {
            arcEl.setAttribute('stroke-dashoffset', String(Math.round(462 * (1 - pct))));
            arcEl.setAttribute('stroke-opacity', '1');
            arcEl.setAttribute('stroke', diffSec >= goalSec ? '#10b981' : '#0284c7');
        }
        if (bar) bar.style.width = (pct * 100) + '%';

        // Toggle Button State
        if (toggleBtn) {
            toggleBtn.classList.add('is-fasting');
            toggleBtn.style.background = '';
            if (btnIcon) btnIcon.textContent = '⏹';
            if (btnText) btnText.textContent = 'สิ้นสุดการอดอาหาร';
        }

        // 5 Milestone Beads on Dial
        updateIfBeads(elapsedHours);

        // Check if user has already eaten meals today during active fasting
        const conflictBanner = document.getElementById('ifMealConflictBanner');
        const tc = (typeof todayCheck === 'function') ? todayCheck() : null;
        const mealsToday = (tc && tc.meals) ? tc.meals.filter(m => (Number(m.cal) || 0) > 0) : [];
        if (conflictBanner) {
            if (mealsToday.length > 0) {
                const fMeal = mealsToday[0];
                let mTimeMs = Date.now();
                if (fMeal.time && fMeal.time.includes(':')) {
                    const p = fMeal.time.split(':');
                    const mDate = new Date();
                    mDate.setHours(parseInt(p[0], 10), parseInt(p[1], 10), 0, 0);
                    mTimeMs = mDate.getTime();
                }
                const actualFastH = Math.max(0, (mTimeMs - D.if.start) / 3600000);
                const fh = Math.floor(actualFastH);
                const fm = Math.floor((actualFastH % 1) * 60);
                const durText = `${fh} ชม. ${fm} นาที`;

                conflictBanner.style.display = 'block';
                conflictBanner.innerHTML = `
                    <div style="background:rgba(239,68,68,0.08); border:1.5px solid #ef4444; border-radius:14px; padding:12px 14px; text-align:left; box-shadow:0 4px 12px rgba(239,68,68,0.1);">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                            <div style="flex:1;">
                                <div style="font-size:13px; font-weight:800; color:#dc2626; display:flex; align-items:center; gap:6px;">
                                    <span>⚠️ ตรวจพบการทานอาหารแล้ว</span>
                                    <span class="tag" style="background:#fee2e2; color:#b91c1c; font-size:10px; padding:1px 6px;">${fMeal.time || ''}</span>
                                </div>
                                <div style="font-size:11.5px; color:#475569; margin-top:3px; line-height:1.4;">
                                    บันทึก <b>${fMeal.name}</b> (${fMeal.cal} kcal) แล้ว — สภาวะ Fasting สิ้นสุดลงทางสรีรวิทยา
                                </div>
                            </div>
                            <button type="button" class="btn sm" onclick="endFastingFromLoggedMeal()" style="background:#dc2626; color:#fff; border:none; border-radius:8px; font-size:11.5px; font-weight:800; padding:8px 12px; cursor:pointer; white-space:nowrap; box-shadow:0 2px 8px rgba(220,38,38,0.25);">
                                ⏹ ตัดรอบ Fast (${durText})
                            </button>
                        </div>
                    </div>
                `;
            } else {
                conflictBanner.style.display = 'none';
                conflictBanner.innerHTML = '';
            }
        }

        if (stText) stText.textContent = diffSec >= goalSec ? 'ครบเป้าหมายแล้ว' : 'กำลังอดอาหาร';
    } else {
        const conflictBanner = document.getElementById('ifMealConflictBanner');
        if (conflictBanner) {
            conflictBanner.style.display = 'none';
            conflictBanner.innerHTML = '';
        }

        const tc = (typeof todayCheck === 'function') ? todayCheck() : null;
        const mealsToday = (tc && tc.meals) ? tc.meals.filter(m => (Number(m.cal) || 0) > 0) : [];

        // Fasting Not Active — Check if currently within Feeding Window (e.g. 8h)
        const eatGoalHrs = 24 - goalHrs; // e.g. 8h for 16:8
        const eatGoalSec = eatGoalHrs * 3600;

        let eatStartMs = D.if?.eatingWindowStart;
        if (!eatStartMs && mealsToday.length > 0 && mealsToday[0].time) {
            const parts = mealsToday[0].time.split(':');
            const mDate = new Date();
            mDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
            eatStartMs = mDate.getTime();
        }

        const elapsedEatSec = eatStartMs ? Math.max(0, Math.floor((now - eatStartMs) / 1000)) : 0;
        const isEatingWindow = eatStartMs && (elapsedEatSec < eatGoalSec);

        if (isEatingWindow) {
            const remainSec = Math.max(0, eatGoalSec - elapsedEatSec);
            const rh = Math.floor(remainSec / 3600);
            const rm = Math.floor((remainSec % 3600) / 60);
            const rs = remainSec % 60;

            if (cardTitle) cardTitle.textContent = 'ช่วงเวลารับประทานอาหาร (Eating Window)';
            if (timerSub) timerSub.textContent = 'เหลือเวลากินอาหารอีก';
            if (dayLabel) dayLabel.textContent = 'วันนี้';
            disp.textContent = `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;

            const eatStartDate = new Date(eatStartMs);
            const eatEndDate = new Date(eatStartMs + eatGoalSec * 1000);

            if (startDayEl) startDayEl.textContent = 'เริ่มกินอาหาร';
            if (stTime) stTime.textContent = formatThaiTime(eatStartDate);
            if (endDayEl) endDayEl.textContent = 'หมดเวลากิน';
            if (endTimeEl) endTimeEl.textContent = formatThaiTime(eatEndDate);

            const eatPct = Math.min(1, Math.max(0.04, elapsedEatSec / eatGoalSec));
            if (arcEl && typeof arcEl.setAttribute === 'function') {
                // Keep IF fasting arc hidden while in Eating Window (fasting hasn't started)
                arcEl.setAttribute('stroke-dashoffset', '462');
                arcEl.setAttribute('stroke-opacity', '0');
            }
            if (bar) bar.style.width = (eatPct * 100) + '%';

            if (toggleBtn) {
                toggleBtn.classList.remove('is-fasting');
                toggleBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                if (btnIcon) btnIcon.textContent = '▶';
                if (btnText) btnText.textContent = 'เริ่มอดอาหารรอบใหม่';
            }
            if (stText) stText.textContent = 'ช่วงเวลารับประทานอาหาร';
            updateIfBeads(0);
        } else {
            // Fasting Not Started (WiseMeal default view)
            const defaultStart = new Date();
            defaultStart.setHours(18, 0, 0, 0);

            if (cardTitle) cardTitle.textContent = 'พร้อมเริ่มอดอาหารหรือยัง?';
            if (timerSub) timerSub.textContent = 'เริ่มอดอาหาร';
            if (dayLabel) dayLabel.textContent = 'วันนี้';
            disp.textContent = '18:00';

            if (startDayEl) startDayEl.textContent = 'วันนี้';
            if (stTime) stTime.textContent = '18:00';

            const endH = (18 + goalHrs) % 24;
            const isNextDay = (18 + goalHrs) >= 24;
            if (endDayEl) endDayEl.textContent = isNextDay ? 'พรุ่งนี้' : 'วันนี้';
            if (endTimeEl) endTimeEl.textContent = `${String(endH).padStart(2, '0')}:00`;

            if (arcEl && typeof arcEl.setAttribute === 'function') {
                arcEl.setAttribute('stroke-dashoffset', '462');
                arcEl.setAttribute('stroke-opacity', '0');
                arcEl.setAttribute('stroke', '#0284c7');
            }
            if (bar) bar.style.width = '0%';

            if (toggleBtn) {
                toggleBtn.classList.remove('is-fasting');
                toggleBtn.style.background = '';
                if (btnIcon) btnIcon.textContent = '▶';
                if (btnText) btnText.textContent = 'เริ่มอดอาหาร';
            }

            updateIfBeads(0);
            if (stText) stText.textContent = 'พร้อมเริ่มอดอาหาร';
        }
    }
}

function updateIfBeads(elapsedHours) {
    const b1 = document.getElementById('ifBead1');
    const b2 = document.getElementById('ifBead2');
    const b3 = document.getElementById('ifBead3');
    const b4 = document.getElementById('ifBead4');
    const b5 = document.getElementById('ifBead5');

    const isFasting = elapsedHours > 0;
    if (b1) b1.classList.toggle('active', isFasting && elapsedHours >= 0.1);
    if (b2) b2.classList.toggle('active', isFasting && elapsedHours >= 4);
    if (b3) b3.classList.toggle('active', isFasting && elapsedHours >= 8);
    if (b4) b4.classList.toggle('active', isFasting && elapsedHours >= 12);
    if (b5) b5.classList.toggle('active', isFasting && elapsedHours >= 16);
}

setInterval(() => {
    if (document.getElementById('p-if').classList.contains('on')) {
        updateIFUI();
    }
}, 1000);


const _origUpdateIFUIV2 = updateIFUI;
updateIFUI = function() {
    _origUpdateIFUIV2();
    if (typeof renderFastingMetabolicStages === 'function') {
        try { renderFastingMetabolicStages(); } catch (e) {}
    }
};
