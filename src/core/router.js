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
    const targetWk = W[SCHED[dow]];
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

/* ============ INTERMITTENT FASTING (IF) LOGIC ============ */
D.if = D.if || { start: null, goal: 16, updatedAt: Date.now() };

function setIFGoal(hrs) {
    D.if.goal = hrs;
    D.if.updatedAt = Date.now();
    save();
    updateIFUI();
    if (currentUser && fbDb) pushToCloud();
    fcAlert('ตั้งค่าเป้าหมายการอดอาหารเป็น ' + hrs + ' ชั่วโมงเรียบร้อย');
}

async function toggleIF() {
    if (D.if.start) {
        if (await fcConfirm('สิ้นสุดการทำ IF รอบนี้ (เริ่มช่วงเวลากินอาหาร) ใช่หรือไม่?')) {
            D.if.start = null;
            D.if.updatedAt = Date.now();
            save();
            if (currentUser && fbDb) pushToCloud();
        }
    } else {
        D.if.start = Date.now();
        D.if.notifiedComplete = false;
        D.if.updatedAt = Date.now();
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        save();
        if (currentUser && fbDb) pushToCloud();
    }
    updateIFUI();
}

let editIFSelectedDay = 'yesterday';

function setIFEditDay(dayChoice) {
    editIFSelectedDay = dayChoice;
    const btnY = document.getElementById('ifBtnYesterday');
    const btnT = document.getElementById('ifBtnToday');
    if (btnY && btnT) {
        if (dayChoice === 'yesterday') {
            btnY.style.background = 'var(--acc)';
            btnY.style.color = '#fff';
            btnY.style.borderColor = 'var(--acc)';
            btnT.style.background = 'var(--card)';
            btnT.style.color = 'var(--tx)';
            btnT.style.borderColor = 'var(--line)';
        } else {
            btnT.style.background = 'var(--acc)';
            btnT.style.color = '#fff';
            btnT.style.borderColor = 'var(--acc)';
            btnY.style.background = 'var(--card)';
            btnY.style.color = 'var(--tx)';
            btnY.style.borderColor = 'var(--line)';
        }
    }
    updateIFEditPreview();
}

function updateIFEditPreview() {
    const timeVal = document.getElementById('ifTimeInput')?.value || '19:45';
    const prevEl = document.getElementById('ifEditPreviewText');
    if (!prevEl) return;
    const parts = timeVal.split(':');
    if (parts.length !== 2) return;
    const h = parseInt(parts[0]), m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m)) return;

    const now = new Date();
    const todayIso = iso(now);
    const p = todayIso.split('-');
    const baseDate = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    if (editIFSelectedDay === 'yesterday') {
        baseDate.setDate(baseDate.getDate() - 1);
    }
    baseDate.setHours(h, m, 0, 0);

    const diffSec = Math.max(0, Math.floor((now.getTime() - baseDate.getTime()) / 1000));
    const diffH = Math.floor(diffSec / 3600);
    const diffM = Math.floor((diffSec % 3600) / 60);

    const goalHrs = (D.if && D.if.goal) ? D.if.goal : 16;
    const goalSec = goalHrs * 3600;
    const endMs = baseDate.getTime() + (goalSec * 1000);
    const endDate = new Date(endMs);

    const endDayStr = iso(endDate);
    const isEndToday = endDayStr === todayIso;
    const endDayLabel = isEndToday ? 'วันนี้' : (endDate.getDate() + '/' + (endDate.getMonth() + 1));

    if (diffSec >= goalSec) {
        const overM = Math.floor((diffSec - goalSec) / 60);
        prevEl.innerHTML = `
            <div style="color:#22c55e; font-weight:700;">🎉 อดมาแล้ว: ${diffH} ชม. ${diffM} นาที (ครบ ${goalHrs} ชม. แล้ว)</div>
            <div style="color:var(--dim); font-size:11.5px; margin-top:2px;">เริ่มกินได้ตั้งแต่: ${endDayLabel} ${formatThaiTime(endDate)} น.</div>
        `;
    } else {
        const remSec = goalSec - diffSec;
        const remH = Math.floor(remSec / 3600);
        const remM = Math.floor((remSec % 3600) / 60);
        prevEl.innerHTML = `
            <div style="color:var(--acc); font-weight:700;">⏳ อดมาแล้ว: ${diffH} ชม. ${diffM} นาที (เหลืออีก ${remH} ชม. ${remM} นาที)</div>
            <div style="color:var(--dim); font-size:11.5px; margin-top:2px;">🎯 จะเริ่มกินได้ตอน: <b>${endDayLabel} ${formatThaiTime(endDate)} น.</b></div>
        `;
    }
}

async function editIFStart() {
    // Determine default day and time
    let initDay = 'yesterday';
    let initTime = '19:45';

    if (D.if && D.if.start) {
        const curStart = new Date(D.if.start);
        const curIso = iso(curStart);
        const todayIso = iso(new Date());
        initDay = (curIso === todayIso) ? 'today' : 'yesterday';
        initTime = formatThaiTime(curStart);
    }
    editIFSelectedDay = initDay;

    const html = `
        <div style="text-align:left; font-size:14px; line-height:1.5;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:4px;">⏱️ ตั้งค่าเวลาเริ่มอดอาหาร</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:12px;">ระบุวันที่และเวลาที่ทานมื้อสุดท้ายเสร็จ เพื่อเริ่มนับเวลาอดอาหาร</div>

            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:12px; margin-bottom:12px;">
                <label style="display:block; font-weight:700; font-size:12.5px; margin-bottom:6px;">1. วันที่เริ่มอดอาหาร:</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
                    <button type="button" id="ifBtnYesterday" class="btn sm" onclick="setIFEditDay('yesterday')" style="padding:8px; font-size:13px; font-weight:700; border-radius:8px; border:1.5px solid var(--acc); background:${initDay === 'yesterday' ? 'var(--acc)' : 'var(--card)'}; color:${initDay === 'yesterday' ? '#fff' : 'var(--tx)'};">เมื่อวานนี้</button>
                    <button type="button" id="ifBtnToday" class="btn sm" onclick="setIFEditDay('today')" style="padding:8px; font-size:13px; font-weight:700; border-radius:8px; border:1.5px solid var(--line); background:${initDay === 'today' ? 'var(--acc)' : 'var(--card)'}; color:${initDay === 'today' ? '#fff' : 'var(--tx)'};">วันนี้</button>
                </div>

                <label style="display:block; font-weight:700; font-size:12.5px; margin-bottom:6px;">2. เวลาที่เริ่มอด (มื้อสุดท้ายเสร็จ):</label>
                <input type="time" id="ifTimeInput" value="${initTime}" oninput="updateIFEditPreview()" onchange="updateIFEditPreview()" style="width:100%; font-size:18px; font-weight:800; padding:10px 14px; border-radius:8px; border:1.5px solid var(--acc); background:var(--bg); color:var(--tx); text-align:center; box-sizing:border-box;">

                <div id="ifEditPreviewText" style="margin-top:12px; padding:10px; background:var(--card); border:1px solid var(--line); border-radius:8px; font-size:12.5px; text-align:center;">
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        updateIFEditPreview();
    }, 60);

    const ok = await fcConfirm(html, 'บันทึกเวลาเริ่มอดอาหาร');
    if (!ok) return;

    const timeVal = document.getElementById('ifTimeInput')?.value || '19:45';
    const parts = timeVal.split(':');
    if (parts.length !== 2) return fcAlert('รูปแบบเวลาไม่ถูกต้อง');
    const h = parseInt(parts[0]), m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return fcAlert('รูปแบบเวลาไม่ถูกต้อง');

    const now = new Date();
    const todayIso = iso(now);
    const p = todayIso.split('-');
    const baseDate = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
    if (editIFSelectedDay === 'yesterday') {
        baseDate.setDate(baseDate.getDate() - 1);
    }
    baseDate.setHours(h, m, 0, 0);

    if (!D.if) D.if = { goal: 16 };
    D.if.start = baseDate.getTime();
    D.if.updatedAt = Date.now();
    D.if.notifiedComplete = false;

    save();
    render();
    updateIFUI();
    if (currentUser && fbDb) pushToCloud();
    msg('✓ อัปเดตเวลาเริ่มอดอาหารและซิงก์คลาวด์แล้ว');
}

function updateIFUI() {
    const disp = document.getElementById('ifTimerDisplay');
    if (!disp) return;
    const bar = document.getElementById('ifProgressBar');
    const stText = document.getElementById('ifStatusText');
    const stTime = document.getElementById('ifStartTime');
    const endTimeEl = document.getElementById('ifEndTime');
    const goalTx = document.getElementById('ifGoalText');
    const eatWindowTx = document.getElementById('ifEatWindowText');
    const countdownTx = document.getElementById('ifCountdownText');
    const btn = document.getElementById('ifToggleBtn');
    const timerSub = document.getElementById('ifTimerSub');
    
    const goalHrs = (D.if && D.if.goal) ? D.if.goal : 16;
    if (goalTx) goalTx.textContent = goalHrs;
    if (eatWindowTx) eatWindowTx.textContent = `${24 - goalHrs} ชม.`;

    if (D.if && D.if.start) {
        const now = Date.now();
        const diffSec = Math.max(0, Math.floor((now - D.if.start) / 1000));
        const goalSec = goalHrs * 3600;

        // Check Fasting Completion notification
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

        // Format Timer (HH:MM:SS)
        const h = Math.floor(diffSec / 3600);
        const m = Math.floor((diffSec % 3600) / 60);
        const s = diffSec % 60;
        disp.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (timerSub) timerSub.textContent = 'ระยะเวลาที่อดอาหารไปแล้ว';

        // Format Start Time with accurate Thai day difference
        const startDate = new Date(D.if.start);
        const nowDate = new Date();
        const todayIso = iso(nowDate);
        const startDayIso = iso(startDate);

        const todayMidnightMs = new Date(todayIso + 'T00:00:00+07:00').getTime();
        const startMidnightMs = new Date(startDayIso + 'T00:00:00+07:00').getTime();
        const daysDiff = Math.round((todayMidnightMs - startMidnightMs) / 864e5);

        let startDayText = '';
        if (daysDiff === 0) startDayText = 'วันนี้ ';
        else if (daysDiff === 1) startDayText = 'เมื่อวาน ';
        else if (daysDiff > 1) startDayText = `${startDate.getDate()}/${startDate.getMonth() + 1} (${daysDiff} วันก่อน) `;
        else startDayText = `${startDate.getDate()}/${startDate.getMonth() + 1} `;

        const startHM = formatThaiTime(startDate);
        if (stTime) stTime.textContent = startDayText + startHM;

        // Format End Time (When fasting ends and eating window begins)
        const endDate = new Date(D.if.start + goalSec * 1000);
        const endHM = formatThaiTime(endDate);
        const endDayIso = iso(endDate);
        const endMidnightMs = new Date(endDayIso + 'T00:00:00+07:00').getTime();
        const endDaysDiff = Math.round((endMidnightMs - todayMidnightMs) / 864e5);

        let endDay = 'วันนี้ ';
        if (endDaysDiff === 1) endDay = 'พรุ่งนี้ ';
        else if (endDaysDiff === -1) endDay = 'เมื่อวาน ';
        else if (endDaysDiff !== 0) endDay = `${endDate.getDate()}/${endDate.getMonth() + 1} `;
        if (endTimeEl) endTimeEl.textContent = endDay + endHM + ' น.';

        // Progress Bar
        const pct = Math.min(100, Math.max(0, (diffSec / goalSec) * 100));
        if (bar) bar.style.width = pct + '%';

        if (diffSec >= goalSec) {
            // Fast completed! Inside eating window
            const overSec = diffSec - goalSec;
            const overH = Math.floor(overSec / 3600);
            const overM = Math.floor((overSec % 3600) / 60);
            if (stText) {
                stText.innerHTML = '🎉 <b>ครบเป้าหมาย ' + goalHrs + ' ชม. แล้ว! สิ้นสุดการอด</b>';
                stText.style.color = '#22c55e';
            }
            if (countdownTx) {
                countdownTx.innerHTML = '<span style="color:#22c55e;">🍽️ เริ่มกินได้แล้ว! (เลยมา ' + (overH > 0 ? overH + ' ชม. ' : '') + overM + ' นาที)</span>';
            }
            if (bar) bar.style.background = '#22c55e';
        } else {
            // Still fasting
            const remSec = goalSec - diffSec;
            const remH = Math.floor(remSec / 3600);
            const remM = Math.floor((remSec % 3600) / 60);
            if (stText) {
                stText.textContent = '🔥 กำลังอดอาหาร (Fasting)';
                stText.style.color = 'var(--warn)';
            }
            if (countdownTx) {
                countdownTx.innerHTML = `เหลืออีก <strong>${remH} ชม. ${remM} นาที</strong>`;
                countdownTx.style.color = 'var(--warn)';
            }
            if (bar) bar.style.background = 'linear-gradient(90deg, var(--warn), var(--acc))';
        }
        
        if (btn) { btn.textContent = '🍽️ สิ้นสุดการอด (บันทึกเริ่มกิน)'; btn.className = 'btn g'; }
    } else {
        disp.textContent = '00:00:00';
        if (timerSub) timerSub.textContent = 'ยังไม่ได้เริ่มจับเวลา';
        if (stTime) stTime.textContent = '--:--';
        if (endTimeEl) endTimeEl.textContent = 'รอเริ่ม IF';
        if (bar) bar.style.width = '0%';
        if (stText) {
            stText.textContent = '🍽️ อยู่ในช่วงเวลากินอาหาร (ยังไม่เริ่ม IF)';
            stText.style.color = 'var(--dim)';
        }
        if (countdownTx) {
            countdownTx.textContent = 'กดเริ่มเมื่อทานมื้อสุดท้ายเสร็จ';
            countdownTx.style.color = 'var(--dim)';
        }
        if (btn) { btn.textContent = '⏳ เริ่มอดอาหาร (Start Fasting)'; btn.className = 'btn'; }
    }
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
