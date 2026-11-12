/* FitCoach v3.0 — Guided Workout Player, Thai Voice Coach & Weight Progression */
/* ============ PLAYER ============ */
let ST = [], idx = 0, left = 0, up = 0, tick = null, playing = false, curK = '', t0 = 0, lock = null;
function buildSteps(k) {
    const items = fullItems(k), out = [];
    items.forEach((it, ii) => {
        const e = EX[it.e], last = ii === items.length - 1;
        for (let s = 1; s <= (it.sets || 1); s++) {
            (e.side ? ['ขวา', 'ซ้าย'] : [null]).forEach((sd, si) => {
                out.push({
                    k: 'work', ph: it.ph, e: it.e, name: e.n + (sd ? ' — ข้าง' + sd : ''), type: it.type, dur: it.t || 0,
                    tgt: it.type === 'time' ? fmt(it.t) : it.r, set: s, sets: it.sets || 1, log: it.log
                });
                if (sd && si === 0) out.push({ k: 'rest', ph: it.ph, dur: 15, name: 'สลับข้าง', next: e.n });
            });
            if (s < (it.sets || 1)) out.push({ k: 'rest', ph: it.ph, dur: it.rest || 45, name: 'พักระหว่างเซ็ต', next: e.n });
        }
        if (!last && (it.after || 0) > 0) out.push({ k: 'rest', ph: it.ph, dur: it.after, name: 'พักก่อนท่าถัดไป', next: EX[items[ii + 1].e].n });
    });
    return out;
}
function startW(k) {
    curK = k; ST = buildSteps(k); idx = 0; t0 = Date.now();
    document.getElementById('pl').classList.add('on'); adjustPlayerLayout();
    try { navigator.wakeLock && navigator.wakeLock.request('screen').then(l => lock = l) } catch (e) { }
    loadStep(); playing = true; run();
}
const PHL = { warm: ['WARM-UP', 'var(--warn)'], main: ['ส่วนหลัก', 'var(--acc)'], cool: ['COOL-DOWN', 'var(--vio)'] };

/* ============ ORIENTATION ADAPTER ============ */
function adjustPlayerLayout() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const pl = document.getElementById('pl');
    if (pl) {
        pl.classList.toggle('landscape', isLandscape);
    }
    const fig = document.getElementById('plFig');
    const leftPane = document.getElementById('plLandLeft');
    const bodyPane = document.getElementById('plPortBody');
    if (!fig || !leftPane || !bodyPane) return;

    let moved = false;
    if (isLandscape) {
        if (fig.parentElement !== leftPane) {
            leftPane.appendChild(fig);
            moved = true;
        }
    } else {
        if (fig.parentElement !== bodyPane) {
            const target = document.getElementById('plTarget');
            if (target) {
                bodyPane.insertBefore(fig, target);
            } else {
                bodyPane.appendChild(fig);
            }
            moved = true;
        }
    }
    if (moved && typeof playing !== 'undefined' && playing) {
        const vid = fig.querySelector('video');
        if (vid && vid.paused) {
            vid.play().catch(() => {});
        }
    }
}
window.addEventListener('resize', adjustPlayerLayout);
window.addEventListener('orientationchange', adjustPlayerLayout);

function parseRepsTarget(tgt) {
    if (!tgt) return { num: '–', unit: '' };
    const str = String(tgt).trim();
    const m = str.match(/^(\d+(?:-\d+)?)\s*(.*)$/);
    if (m) {
        return {
            num: m[1],
            unit: m[2] || 'ครั้ง'
        };
    }
    return { num: str, unit: '' };
}


/* ============ THAI VOICE COACH ENGINE (Web Speech API) ============ */
let thaiVoiceSelected = null;
function initThaiVoice() {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        thaiVoiceSelected = voices.find(v => v.lang === 'th-TH' || v.lang.startsWith('th')) || null;
    };
    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
    }
}
initThaiVoice();

function speakCoach(text) {
    if (!text || (D.cfg && D.cfg.voiceCoach === false) || !('speechSynthesis' in window)) return;
    try {
        // Wake up Web Audio subsystem on iOS/iPadOS
        try {
            ac = ac || new (window.AudioContext || window.webkitAudioContext)();
            if (ac.state === 'suspended') ac.resume().catch(() => {});
        } catch (e) {}

        window.speechSynthesis.cancel(); // Stop prior utterance
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'th-TH';
        u.rate = 1.0; // Natural, clear pace
        u.pitch = 1.0;
        u.volume = 1.0; // Max hardware volume
        if (thaiVoiceSelected) u.voice = thaiVoiceSelected;
        window.speechSynthesis.speak(u);
    } catch (e) {
        console.log('Speech error:', e);
    }
}

function testAudioVolume() {
    beep(880, 150, 'triangle', 0.95);
    setTimeout(() => {
        speakCoach('ทดสอบระดับเสียงเตือนและความดังโค้ช ระดับหนึ่งร้อยเปอร์เซ็นต์ครับ');
    }, 250);
}

function toggleVoiceCoach() {
    if (!D.cfg) D.cfg = {};
    D.cfg.voiceCoach = D.cfg.voiceCoach === false ? true : false;
    save();
    updateVoiceCoachBtn();
    if (D.cfg.voiceCoach) {
        speakCoach('เปิดเสียงโค้ชแล้วครับ');
    } else {
        msg('ปิดเสียงโค้ชแล้ว');
    }
}

function updateVoiceCoachBtn() {
    const btn = document.getElementById('plVoiceBtn');
    if (btn) {
        const on = D.cfg && D.cfg.voiceCoach !== false;
        btn.textContent = on ? '🔊' : '🔇';
        btn.title = on ? 'เสียงโค้ช: เปิดอยู่ (แตะเพื่อปิด)' : 'เสียงโค้ช: ปิดอยู่ (แตะเพื่อเปิด)';
    }
}

function adjustLiveSetWeight(delta, ev) {
    if (ev) ev.stopPropagation();
    const s = ST[idx];
    if (!s) return;
    const curKg = s.actKg != null ? s.actKg : (getExerciseWeightInfo(s.e).kg || 6);
    const newKg = Math.max(0, Math.min(60, curKg + delta));
    s.actKg = newKg;
    const disp = document.getElementById('liveWeightDisplay');
    if (disp) disp.textContent = newKg + ' kg';
    // Save to exercise custom weight preference
    if (!D.cfg.weights) D.cfg.weights = {};
    D.cfg.weights[s.e] = newKg;
    save();
    beep(980, 50);
}

function loadStep() {
    const s = ST[idx]; if (!s) return finishW();
    left = s.dur; up = 0;
    const isW = s.k === 'work', rest = !isW, col = PHL[s.ph][1];
    const pl = document.getElementById('pl');
    if (pl) pl.classList.toggle('is-rest', rest);

    // Phase Tag
    const tg = document.getElementById('plPhase');
    tg.textContent = PHL[s.ph][0];
    tg.className = 'tag ' + (s.ph === 'warm' ? 'o' : s.ph === 'cool' ? 'v' : '');

    // Step Counter: Exclude rest steps from total exercises count
    const totalWork = ST.filter(x => x.k === 'work').length;
    const currentWorkIdx = ST.slice(0, idx + 1).filter(x => x.k === 'work').length;
    if (isW) {
        document.getElementById('plProg').textContent = `ท่าที่ ${currentWorkIdx}/${totalWork}`;
    } else {
        const nextWorkIdx = currentWorkIdx + 1;
        document.getElementById('plProg').textContent = nextWorkIdx <= totalWork 
            ? `พักผ่อน (เตรียมท่า ${nextWorkIdx}/${totalWork})` 
            : `พักผ่อน`;
    }

    const e = isW ? EX[s.e] : null;
    document.getElementById('plEx').textContent = s.name;

    // Thai Voice Coach announcement with comprehensive cues and reps
    if (isW) {
        const speechParts = [];
        // 1. Exercise Name & Set Number
        const setTxt = s.sets > 1 ? (' เซ็ตที่ ' + s.set + ' จาก ' + s.sets + ' เซ็ต') : '';
        speechParts.push('ท่าต่อไป ' + s.name + setTxt);

        // 2. Goal: Reps + Equipment Weight or Duration
        if (s.type === 'reps') {
            const wInfo = getExerciseWeightInfo(s.e);
            const weightKg = s.actKg != null ? s.actKg : wInfo.kg;
            let targetText = 'เป้าหมาย ' + s.tgt;
            if (weightKg && weightKg > 0) {
                targetText += ' ใช้น้ำหนัก ' + weightKg + ' กิโลกรัม';
            }
            speechParts.push(targetText);
        } else if (s.dur) {
            const mins = Math.floor(s.dur / 60);
            const secs = s.dur % 60;
            let timeStr = 'ทำต่อเนื่อง ';
            if (mins > 0 && secs > 0) timeStr += mins + ' นาที ' + secs + ' วินาที';
            else if (mins > 0) timeStr += mins + ' นาที';
            else timeStr += secs + ' วินาที';
            speechParts.push(timeStr);
        }

        // 3. Technique Cues from the bottom box
        if (e && e.cue && e.cue.length) {
            const cleanCues = e.cue.map(c => c.replace(/[*#]/g, '').trim()).filter(Boolean);
            if (cleanCues.length) {
                speechParts.push('เทคนิคท่า: ' + cleanCues.join('. '));
            }
        }

        const fullSpeech = speechParts.join('. ');
        speakCoach(fullSpeech);
    } else {
        const nextWork = ST.slice(idx + 1).find(x => x.k === 'work');
        const nextName = nextWork ? nextWork.name : (s.next || '');
        speakCoach('พักผ่อน ' + s.dur + ' วินาที ท่าต่อไปคือ ' + nextName);
    }

    // Ring Mode & Display (Big, bold reps without overflowing or overlapping)
    const C = 678.6;
    if (isW && s.type === 'reps') {
        const repInfo = parseRepsTarget(s.tgt);
        document.getElementById('plMode').textContent = 'เป้าหมาย';
        document.getElementById('plMode').style.color = 'var(--acc)';
        document.getElementById('plTime').className = 'tim is-reps';
        document.getElementById('plTime').innerHTML = `<span class="rep-num">${repInfo.num}</span><span class="rep-unit">${repInfo.unit}</span>`;
        const setTxt = s.sets > 1 ? `เซ็ต ${s.set}/${s.sets}` : '';
        document.getElementById('plSet').innerHTML = `${setTxt ? `${setTxt} • ` : ''}<span style="color:var(--tx);font-weight:700;">⏱️ 00:00</span>`;
        document.getElementById('arc').setAttribute('stroke', col);
        document.getElementById('arc').style.strokeDashoffset = 0;
    } else if (isW) {
        document.getElementById('plMode').textContent = 'ทำต่อเนื่อง';
        document.getElementById('plMode').style.color = col;
        document.getElementById('plTime').className = 'tim';
        document.getElementById('plTime').textContent = fmt(left);
        document.getElementById('plSet').textContent = s.sets > 1 ? `เซ็ต ${s.set}/${s.sets}` : '';
        document.getElementById('arc').setAttribute('stroke', col);
        document.getElementById('arc').style.strokeDashoffset = C * (1 - (s.dur ? left / s.dur : 0));
    } else {
        document.getElementById('plMode').textContent = 'พักฟื้นตัว';
        document.getElementById('plMode').style.color = 'var(--dim)';
        document.getElementById('plTime').className = 'tim';
        document.getElementById('plTime').textContent = fmt(left);
        document.getElementById('plSet').textContent = 'นับถอยหลัง';
        document.getElementById('arc').setAttribute('stroke', '#4b5768');
        document.getElementById('arc').style.strokeDashoffset = C * (1 - (s.dur ? left / s.dur : 0));
    }

    // Target Pill: Large, prominent reps + equipment weight badge
    const targetEl = document.getElementById('plTarget');
    if (isW) {
        const wInfo = getExerciseWeightInfo(s.e);
        const eqDisplay = wInfo.label || (e && e.eq) || '';
        const eqText = eqDisplay ? ` • 🏋️ <span style="color:var(--tx);font-weight:700;">${eqDisplay}</span>` : '';
        if (s.type === 'reps') {
            const wInfo = getExerciseWeightInfo(s.e);
            s.actKg = s.actKg != null ? s.actKg : wInfo.kg;
            const weightStepper = (s.actKg != null) ? `
                <span style="display:inline-flex; align-items:center; gap:4px; margin-left:6px; background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:8px;">
                    <button onclick="adjustLiveSetWeight(-1, event)" style="background:none; border:none; color:var(--acc); font-weight:900; font-size:14px; cursor:pointer; padding:0 3px;">−</button>
                    <span id="liveWeightDisplay" style="font-weight:800; color:var(--tx); font-size:12px;">${s.actKg} kg</span>
                    <button onclick="adjustLiveSetWeight(1, event)" style="background:none; border:none; color:var(--acc); font-weight:900; font-size:14px; cursor:pointer; padding:0 3px;">+</button>
                </span>` : eqText;

            targetEl.innerHTML = `<span class="pl-target-pill">🎯 <strong style="font-size:1.15em;">${s.tgt}</strong>${weightStepper}</span>`;
        } else {
            targetEl.innerHTML = `<span class="pl-target-pill">⏱️ <strong style="font-size:1.15em;">${fmt(s.dur)}</strong>${eqText}</span>`;
        }
        targetEl.style.display = 'block';
    } else {
        targetEl.innerHTML = '';
        targetEl.style.display = 'none';
    }

    // Media: Exclusive rendering (video ONLY if exists, image ONLY if no video)
    const figEl = document.getElementById('plFig');
    if (isW && e) {
        figEl.innerHTML = fig(s.e, 150);
        const hasVid = !!getVideoUrl(s.e);
        figEl.className = figClass(s.e) + (hasVid ? '' : ' single-media');
        figEl.style.display = 'flex';
        document.querySelectorAll('#plFig video').forEach(v => { v.muted = true; v.play().catch(()=>{}); });
    } else {
        figEl.innerHTML = '';
        figEl.style.display = 'none';
    }

    // Form Cues: High contrast, readable 15px font card
    const cueEl = document.getElementById('plCue');
    if (isW && e && e.cue && e.cue.length) {
        cueEl.innerHTML = e.cue.map(c => '<li>' + c + '</li>').join('');
        cueEl.style.display = 'block';
    } else {
        cueEl.innerHTML = '';
        cueEl.style.display = 'none';
    }

    // Video Sample Modal button
    const yt = document.getElementById('plYt');
    yt.style.display = (isW && e) ? 'inline-block' : 'none';
    if (isW && e) {
        yt.onclick = function(ev) { if (ev) ev.preventDefault(); showExModal(s.e); };
    }

    // Rest Screen: Preview of Next Exercise with Image/Thumbnail & Set Progress
    const restPreviewEl = document.getElementById('plRestPreview');
    if (restPreviewEl) {
        if (rest) {
            const nextWork = ST.slice(idx + 1).find(x => x.k === 'work');
            if (nextWork) {
                const nextE = nextWork.e;
                const nextExObj = EX[nextE] || {};
                const nextSetsRem = nextWork.sets - nextWork.set + 1;
                const nextWInfo = getExerciseWeightInfo(nextE); const nextEq = nextWInfo.label || nextExObj.eq || '';
                const nextCue = (nextExObj.cue && nextExObj.cue[0]) ? nextExObj.cue[0] : '';
                const vidUrl = getVideoUrl(nextE);
                const mediaHtml = vidUrl
                    ? `<video src="${vidUrl}" poster="${nextExObj.img || ''}" autoplay loop muted playsinline class="rest-thumb-media"></video>`
                    : (nextExObj.img ? `<img src="${nextExObj.img}" alt="${nextWork.name}" class="rest-thumb-media" />` : '');

                restPreviewEl.innerHTML = `
                    <div class="rest-preview-card">
                        <div class="rest-header-row">
                            <span class="rest-badge-step">ท่าถัดไป</span>
                            <span class="rest-badge-set">${nextWork.sets > 1 ? `เซ็ตที่ ${nextWork.set} / ${nextWork.sets}` : '1 เซ็ต'}</span>
                            <span class="rest-badge-remain ${nextSetsRem === 1 ? 'last-set' : ''}">${nextSetsRem === 1 ? '🔥 เซ็ตสุดท้าย!' : `เหลืออีก ${nextSetsRem} เซ็ต`}</span>
                        </div>
                        <div class="rest-card-content">
                            <div class="rest-media-box" onclick="showExModal('${nextE}')" title="แตะเพื่อดูวิธีเล่นแบบละเอียด">
                                ${mediaHtml}
                                <div class="rest-media-zoom">🔍 ขยาย</div>
                            </div>
                            <div class="rest-info-box">
                                <div class="rest-ex-title">${nextWork.name}</div>
                                <div class="rest-target-line">🎯 เป้าหมาย: <span class="rest-val-highlight">${nextWork.tgt}</span></div>
                                ${nextEq ? `<div class="rest-eq-line">🏋️ อุปกรณ์: <span class="rest-val-highlight">${nextEq}</span></div>` : ''}
                                ${nextCue ? `<div class="rest-cue-hint">💡 <span>${nextCue}</span></div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
                restPreviewEl.style.display = 'block';
            } else {
                restPreviewEl.innerHTML = `
                    <div class="rest-preview-card" style="text-align:center;padding:16px;">
                        <div style="font-size:26px;margin-bottom:6px;">🏁</div>
                        <div style="font-weight:800;font-size:16px;color:var(--ok);">จบครบทุกท่าของการฝึกวันนี้แล้ว!</div>
                        <div style="font-size:13px;color:var(--dim);margin-top:4px;">พักฟื้นตัวตามสบาย แล้วกดเสร็จสิ้นเพื่อบันทึกผล</div>
                    </div>
                `;
                restPreviewEl.style.display = 'block';
            }
        } else {
            restPreviewEl.innerHTML = '';
            restPreviewEl.style.display = 'none';
        }
    }

    const nx = ST[idx + 1];
    document.getElementById('plNext').innerHTML = nx ? 'ถัดไป: ' + (nx.k === 'rest' ? 'พัก ' + nx.dur + ' วิ' + (nx.next ? ' → ' + nx.next : '') : nx.name) : '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> ท่าสุดท้าย!';
    document.getElementById('plAdd').style.display = rest ? 'block' : 'none';
    document.getElementById('plMain').textContent = (isW && s.type === 'reps') ? '✓ เสร็จเซ็ตนี้' : 'หยุดชั่วคราว';
    paint();
}
function paint() {
    const s = ST[idx], C = 678.6;
    if (!s) return;
    if (s.k === 'work' && s.type === 'reps') {
        const setTxt = s.sets > 1 ? `เซ็ต ${s.set}/${s.sets}` : '';
        document.getElementById('plSet').innerHTML = `${setTxt ? `${setTxt} • ` : ''}<span style="color:var(--tx);font-weight:700;">⏱️ ${fmt(up)}</span>`;
        document.getElementById('arc').style.strokeDashoffset = 0;
    } else {
        document.getElementById('plTime').textContent = fmt(left);
        document.getElementById('arc').style.strokeDashoffset = C * (1 - (s.dur ? left / s.dur : 0));
        document.getElementById('plTime').className = 'tim' + (left <= 3 && left > 0 && s.dur && s.k !== 'reps' ? ' beat' : '');
    }
}
function run() {
    clearInterval(tick); tick = setInterval(() => {
        if (!playing) return; const s = ST[idx];
        if (s.k === 'work' && s.type === 'reps') { up++; paint(); return; }
        left--; 

        // Feature 3: Mid-Set Voice Coach & Form Reminders
        if (D.cfg?.voiceCoach !== false && D.cfg?.voiceMidSet !== false && s.k === 'work' && s.dur) {
            const elapsed = s.dur - left;
            
            // Posture & form reminder 15s into the exercise
            if (elapsed === 15 && s.dur >= 30) {
                const eKey = (s.e || '').toLowerCase();
                const eName = (s.name || '').toLowerCase();
                if (eKey.includes('plank') || eKey.includes('dog') || eKey.includes('curl') || eKey.includes('deadbug') || eKey.includes('bridge') || eName.includes('แพลงก์') || eName.includes('เบิร์ดด็อก') || eName.includes('เคิร์ลอัป')) {
                    speakCoach('เกร็งแกนกลางลำตัว หลังตรง ไม่แอ่นหลัง หายใจเข้าออกสม่ำเสมอนะครับ');
                } else if (eKey.includes('walk') || eKey.includes('cardio') || eKey.includes('treadmill') || eName.includes('เดิน') || eName.includes('คาร์ดิโอ')) {
                    speakCoach('ยืดอก เปิดหัวไหล่ แกว่งแขนเป็นจังหวะ ปรับจังหวะก้าวให้มั่นคงครับ');
                } else if (eKey.includes('squat') || eKey.includes('lunge') || eName.includes('สควอท') || eName.includes('ลันจ์')) {
                    speakCoach('อกผาย ทิ้งสะโพกไปด้านหลัง น้ำหนักลงเต็มฝ่าเท้า หัวเข่าไม่หุบเข้าด้านในนะครับ');
                }
            }
            // Halfway mark announcement
            else if (s.dur >= 40 && left === Math.floor(s.dur / 2)) {
                speakCoach('ผ่านไปครึ่งทางแล้วครับ รักษาฟอร์มและจังหวะหายใจไว้');
            }
            // 1-minute remaining alert
            else if (s.dur >= 90 && left === 60) {
                speakCoach('เหลืออีกหนึ่งนาทีสุดท้าย รีดพลังออกมาครับ');
            }
        }

        if (left === 3) {
            if (D.cfg?.voiceCoach !== false) speakCoach('สาม');
            else beep(880, 120, 'triangle', 0.95);
        } else if (left === 2) {
            if (D.cfg?.voiceCoach !== false) speakCoach('สอง');
            else beep(880, 120, 'triangle', 0.95);
        } else if (left === 1) {
            if (D.cfg?.voiceCoach !== false) speakCoach('หนึ่ง');
            else beep(880, 120, 'triangle', 0.95);
        }
        if (left <= 0) {
            beep(1320, 300, 'square', 0.95); // High energy gym buzzer / finish bell
            nextStep();
            return;
        }
        paint();
    }, 1000);
}
async function togglePlay() {
    const s = ST[idx];
    if (s.k === 'work' && s.type === 'reps') { await logSet(s); nextStep(1); return; }
    playing = !playing; document.getElementById('plMain').textContent = playing ? 'หยุดชั่วคราว' : '▶ เล่นต่อ';
    document.querySelectorAll('#plFig video').forEach(v => { if (playing) v.play().catch(()=>{}); else v.pause(); });
}
function defaultWeightOf(eKey) {
    const e = EX[eKey];
    if (!e || !e.eq) return null;
    const mPair = e.eq.match(/(\d+(?:\.\d+)?)\s*กก\.\s*[×x]\s*2/i);
    if (mPair) return parseFloat(mPair[1]) * 2;
    const mSingle = e.eq.match(/(\d+(?:\.\d+)?)\s*กก\./i);
    if (mSingle) return parseFloat(mSingle[1]);
    if (e.eq.includes('ดัมเบล 1 ตัว')) return 6;
    if (e.eq.includes('ดัมเบล')) return 12;
    return null;
}
async function logSet(s) {
    if (!s.log) return;
    const wInfo = getExerciseWeightInfo(s.e);
    const historyW = (D.sets || []).filter(st => st.exercise_key === s.e && st.weight_kg != null).pop()?.weight_kg;
    const defW = historyW ?? wInfo.kg ?? defaultWeightOf(s.e) ?? '';
    const defReps = parseInt(s.tgt) || 12;
    const eqHint = wInfo.label ? ` • 🏋️ ${wInfo.label}` : (EX[s.e]?.eq ? ` • 🏋️ ${EX[s.e].eq}` : '');
    
    const promptMsg = `บันทึก: ${s.name} (เซ็ต ${s.set}/${s.sets})\nเป้าหมาย: ${s.tgt}${eqHint}\n\nใส่น้ำหนัก (กก.) หรือ "น้ำหนัก x ครั้ง" เช่น "${defW || '10'} x ${defReps}"`;
    const inputVal = await fcPrompt(promptMsg, defW ? `${defW}` : '', '🏋️ บันทึกน้ำหนัก & จำนวนครั้ง');
    if (inputVal === null) return;
    
    let w = null, r = defReps;
    const str = String(inputVal).trim();
    if (str) {
        const parts = str.split(/[xX*@,\s]+/);
        if (parts.length >= 2) {
            w = parseFloat(parts[0]) || null;
            r = parseInt(parts[1]) || defReps;
        } else {
            w = parseFloat(parts[0]) || null;
        }
    }
    
    D.sets.push({
        id: curSid() + '|' + s.e + '|' + s.set,
        session_id: curSid(),
        code: D.cfg.code || 'local',
        exercise_key: s.e,
        exercise_name: EX[s.e].n,
        set_no: s.set,
        weight_kg: w,
        reps: r,
        seconds: null
    });
    save();
}
let _sid = ''; function curSid() { return _sid || (_sid = (D.cfg.code || 'local') + '|' + iso() + '|' + curK + '|' + Date.now()) }
function nextStep(m) { if (m) beep(1046, 120); idx++; idx >= ST.length ? finishW() : (loadStep(), playing = true, document.getElementById('plMain').textContent = 'หยุดชั่วคราว') }
function prevStep() { if (idx > 0) { idx--; loadStep(); playing = true } }
function addTime() { left += 20; ST[idx].dur += 20; paint() }
async function quitW() { if (await fcConfirm('ออกจากการฝึก? ความคืบหน้าจะไม่ถูกบันทึก')) { clearInterval(tick); _sid = ''; document.getElementById('pl').classList.remove('on') } }
async function finishW() {
    clearInterval(tick); document.getElementById('pl').classList.remove('on'); lock && lock.release && lock.release();
    const dur = Math.round((Date.now() - t0) / 1000);
    const rpeRes = await fcPrompt('เหนื่อยระดับไหน? (RPE 1-10)', '7'); const rpe = rpeRes !== null ? parseInt(rpeRes) || null : null;
    const painRes = await fcPrompt('หลังเป็นยังไงหลังฝึก? (0=ไม่ปวดเลย, 10=ปวดมาก)', '2'); const pain = painRes !== null ? parseInt(painRes) : NaN;
    
    const sessionSets = (D.sets || []).filter(st => st.session_id === curSid());
    const totalVol = sessionSets.reduce((sum, st) => sum + ((st.weight_kg || 0) * (st.reps || 0)), 0);
    const totalReps = sessionSets.reduce((sum, st) => sum + (st.reps || 0), 0);
    
    let estKcal = W[curK]?.kcal || 350;
    if (totalVol > 0) {
        const volKcal = Math.round(totalVol * 0.035);
        estKcal = Math.max(estKcal, Math.round(estKcal * 0.85 + volKcal));
    }

    // Post-Workout Weight Evaluation (Check if weights were manageable)
    let weightEval = null;
    if (['A', 'B', 'C'].includes(curK) || totalVol > 0) {
        weightEval = await evaluateWorkoutWeights(curK, isNaN(pain) ? 0 : pain);
    }

    D.sessions.push({
        id: curSid(), code: D.cfg.code || 'local', date: iso(), workout_key: curK, workout_name: W[curK].n,
        duration_sec: dur, kcal: estKcal, total_volume_kg: totalVol, total_reps: totalReps,
        rpe, back_safe: !!D.bs, pain_after: isNaN(pain) ? null : pain,
        weight_eval: weightEval
    });
    _sid = ''; save(); render(); autoSync();
    beep(660, 150); setTimeout(() => beep(880, 150), 160); setTimeout(() => beep(1320, 300), 320);
    
    const volSummary = totalVol > 0 ? `\n🏋️ ยกสะสมรวม (Volume): ${totalVol.toLocaleString()} กก. (${totalReps} ครั้ง)` : '';
    await fcAlert('🏆 จบ ' + W[curK].n + '!\n⏱️ ใช้เวลา ' + fmt(dur) + ' • 🔥 ~' + estKcal + ' kcal' + volSummary + '\n\n🥩 ดื่มเวย์/โปรตีน 35-40 g ภายใน 90 นาที');
}
let ac;
function beep(f, d, type = 'triangle', vol = 0.95) {
    try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === 'suspended') ac.resume().catch(() => {});
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f, ac.currentTime);
        // Crisp linear attack, full punch hold, clean exponential ramp release
        g.gain.setValueAtTime(0.001, ac.currentTime);
        g.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.012);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (d / 1000));
        o.connect(g);
        g.connect(ac.destination);
        o.start(ac.currentTime);
        o.stop(ac.currentTime + (d / 1000) + 0.05);
    } catch (e) { }
    if (navigator.vibrate) navigator.vibrate(60);
}



/* ============ WEIGHT PROGRESSION & EVALUATION HELPERS ============ */
async function evaluateWorkoutWeights(workoutKey, painLevel) {
    if (painLevel >= 5) {
        await fcAlert(`⚠️ ระบบตรวจพบระดับปวดหลัง (${painLevel}/10)\n\nระบบแนะนำให้เปิด "โหมดหลังปลอดภัย" หรือลดน้ำหนักลง 20-30% ในครั้งถัดไป เพื่อให้กระดูกสันหลังและกล้ามเนื้อพยุงหลังได้ฟื้นตัวเต็มที่`);
        D.cfg.weightFeedback = D.cfg.weightFeedback || {};
        D.cfg.weightFeedback[workoutKey] = { date: iso(), status: 'pain_deload' };
        return 'pain_deload';
    }

    const choice = await fcChoice(
        '🏋️ ประเมินน้ำหนักอุปกรณ์ที่ใช้',
        `น้ำหนักที่ใช้ใน <b>${W[workoutKey]?.n || 'การฝึกวันนี้'}</b> ไหวจริงไหม? รู้สึกอย่างไรเพื่อปรับโปรแกรมให้เหมาะสมในครั้งถัดไป:`,
        [
            { id: 'light', label: '🟢 เบาไป / ยกได้สบายมาก', sub: 'แนะนำปรับเพิ่มน้ำหนัก (+1 ถึง +2 กก.) ในครั้งถัดไป' },
            { id: 'ok', label: '🔵 พอดี / ท้าทายกำลังดี', sub: 'น้ำหนักเหมาะสมมาก ยึดตามโปรแกรมประจำสัปดาห์' },
            { id: 'heavy', label: '🔴 หนักเกินไป / ฟอร์มเริ่มหลุด', sub: 'แนะนำปรับลดน้ำหนัก (-1 ถึง -2 กก.) ในครั้งถัดไปเพื่อเซฟฟอร์ม' }
        ]
    );

    if (!choice) return null;
    D.cfg.weightFeedback = D.cfg.weightFeedback || {};
    D.cfg.weights = D.cfg.weights || {};

    if (choice === 'light') {
        const adjust = await fcConfirm('ต้องการให้ระบบปรับเพิ่มน้ำหนัก (+2 กก.) สำหรับท่าหลักในเซสชันนี้อัตโนมัติเลยไหม?\n(สามารถปรับแต่งเองได้ในแท็บโปรแกรม)', '⚡ ปรับเพิ่มน้ำหนักก้าวหน้า');
        if (adjust) {
            const changed = autoAdjustWorkoutWeights(workoutKey, +2);
            await fcAlert(`✓ ปรับเพิ่มน้ำหนัก (+2 กก.) เรียบร้อยแล้ว:\n\n• ${changed.join('\n• ')}\n\nในครั้งถัดไประบบจะแนะนำน้ำหนักใหม่นี้โดยอัตโนมัติ`);
        }
    } else if (choice === 'heavy') {
        const adjust = await fcConfirm('ต้องการให้ระบบปรับลดน้ำหนัก (-2 กก.) เพื่อเซฟฟอร์มและหลังในเซสชันถัดไปไหม?\n(สามารถปรับแต่งเองได้ในแท็บโปรแกรม)', '🛡️ ปรับลดน้ำหนักเซฟหลัง');
        if (adjust) {
            const changed = autoAdjustWorkoutWeights(workoutKey, -2);
            await fcAlert(`✓ ปรับลดน้ำหนัก (-2 กก.) เรียบร้อยแล้ว:\n\n• ${changed.join('\n• ')}\n\nในครั้งถัดไประบบจะใช้น้ำหนักที่ปรับลดนี้เพื่อฟื้นฟูฟอร์ม`);
        }
    }

    D.cfg.weightFeedback[workoutKey] = { date: iso(), status: choice };
    save();
    return choice;
}

function autoAdjustWorkoutWeights(workoutKey, delta) {
    D.cfg.weights = D.cfg.weights || {};
    const items = fullItems(workoutKey);
    const touched = [];
    items.forEach(it => {
        if (it.ph === 'main' && PHASE_WEIGHTS[it.e]) {
            const curWInfo = getExerciseWeightInfo(it.e);
            if (curWInfo.kg != null) {
                const newKg = Math.max(2, curWInfo.kg + delta);
                D.cfg.weights[it.e] = newKg;
                touched.push(`${EX[it.e].n}: ${newKg} กก.`);
            }
        }
    });
    save(); render(); autoSync();
    return touched;
}

async function editExerciseWeight(k) {
    const e = EX[k]; if (!e) return;
    const pIdx = phIdx();
    const baseKg = (PHASE_WEIGHTS[k] && PHASE_WEIGHTS[k][pIdx] != null) ? PHASE_WEIGHTS[k][pIdx] : (defaultWeightOf(k) || 10);
    const wInfo = getExerciseWeightInfo(k);
    const unitLabel = wInfo.isPair ? 'กก. ต่อข้าง (ดัมเบลคู่)' : 'กก.';
    const res = await fcPrompt(
        `กำหนดน้ำหนักสำหรับ ${e.n} (${unitLabel})\n\n• ค่ามาตรฐานโปรแกรม Phase ${pIdx + 1}: ${baseKg} กก.\n• ปัจจุบันของคุณ: ${wInfo.kg} กก.\n(ใส่ตัวเลขน้ำหนัก หรือกดตกลงโดยเว้นว่างเพื่อคืนค่าตามโปรแกรม)`,
        String(wInfo.kg),
        '🏋️ ปรับน้ำหนักอุปกรณ์เฉพาะตัว'
    );
    if (res === null) return;
    const val = parseFloat(res);
    if (isNaN(val) || val <= 0) {
        resetExerciseWeight(k);
        return;
    }
    D.cfg.weights = D.cfg.weights || {};
    D.cfg.weights[k] = val;
    save(); render(); autoSync();
    await fcAlert(`✓ บันทึกน้ำหนัก ${e.n} เป็น ${val} ${unitLabel} เรียบร้อยแล้ว!`);
}

function resetExerciseWeight(k) {
    if (D.cfg && D.cfg.weights && D.cfg.weights[k] != null) {
        delete D.cfg.weights[k];
        save(); render(); autoSync();
        msg(`✓ คืนค่าน้ำหนัก ${EX[k]?.n || k} ตามโปรแกรมมาตรฐานแล้ว`);
    }
}

async function resetAllWeightsToProgram() {
    if (await fcConfirm('ต้องการรีเซ็ตน้ำหนักอุปกรณ์ทุกท่ากลับไปใช้ค่ามาตรฐานตามโปรแกรม 5 เฟสหรือไม่?', '🔄 คืนค่าน้ำหนักมาตรฐาน')) {
        if (D.cfg) D.cfg.weights = {};
        save(); render(); autoSync();
        await fcAlert('✓ รีเซ็ตน้ำหนักทุกท่ากลับเป็นค่ามาตรฐานตามสัปดาห์และเฟสของโปรแกรมแล้ว');
    }
}

function showWeightTableModal() {
    const currentPhaseIdx = phIdx();
    const phases = getPhases();
    
    let html = `
        <div style="font-size:13px;color:var(--dim);margin-bottom:12px;line-height:1.5;">
            โปรแกรมแบ่งความหนักเป็น 5 เฟสเพื่อสร้างกล้ามเนื้อและลดไขมันอย่างต่อเนื่อง (Progressive Overload)
        </div>
        <div style="overflow-x:auto;margin-top:8px;">
            <table style="width:100%;font-size:12px;text-align:center;border-collapse:collapse;min-width:480px;">
                <thead>
                    <tr style="border-bottom:2px solid var(--line);color:var(--dim);">
                        <th style="text-align:left;padding:8px 6px;">ท่าออกกำลังกาย</th>
                        ${phases.map((p, i) => `<th style="padding:8px 6px;${i === currentPhaseIdx ? 'color:var(--acc);font-weight:800;background:rgba(242,78,30,0.12);border-radius:6px 6px 0 0;' : ''}">P${i+1}<br><span style="font-size:10px;font-weight:normal;">สัปดาห์ ${p.w}</span></th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(PHASE_WEIGHTS).map(k => {
                        const e = EX[k];
                        const isPair = getExerciseWeightInfo(k).isPair;
                        return `<tr style="border-bottom:1px solid var(--line);">
                            <td style="text-align:left;padding:8px 6px;font-weight:700;">${e ? e.n : k}</td>
                            ${PHASE_WEIGHTS[k].map((w, i) => `
                                <td style="padding:8px 6px;${i === currentPhaseIdx ? 'font-weight:800;color:var(--acc);background:rgba(242,78,30,0.12);' : 'color:var(--tx);'}">
                                    ${w} กก.${isPair ? '×2' : ''}
                                </td>
                            `).join('')}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <div style="margin-top:14px;font-size:12px;color:var(--dim);line-height:1.4;">
            💡 <b>คอลัมน์สีส้ม:</b> คือเฟสปัจจุบันของคุณ คุณสามารถแตะปุ่ม "✏️ ปรับ" ในแต่ละท่าเพื่อปรับแต่งน้ำหนักตามความพร้อมได้ทุกเวลา
        </div>
    `;

    fcAlert(html);
}

function renderWeightProgressionUI() {
    const container = document.getElementById('weightProgressionList');
    if (!container) return;
    const pIdx = phIdx();
    const keys = Object.keys(PHASE_WEIGHTS);
    const phaseLabel = document.getElementById('weightProgPhaseLabel');
    if (phaseLabel) {
        phaseLabel.textContent = `สัปดาห์ที่ ${wkNo()}/${totalWeeks()} • Phase ${pIdx + 1} (${getPhases()[pIdx]?.n.split(' · ')[1] || ''})`;
    }
    
    let html = '';
    keys.forEach(k => {
        const e = EX[k];
        if (!e) return;
        const baseKg = PHASE_WEIGHTS[k][pIdx];
        const wInfo = getExerciseWeightInfo(k);
        const isCustom = wInfo.isCustom;
        
        html += `
            <div style="background:var(--card2);border:1px solid var(--line);border-radius:12px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <strong style="font-size:14px;color:var(--tx);">${e.n}</strong>
                        ${isCustom ? '<span class="tag o" style="font-size:10px;padding:1px 6px;">ปรับแต่งเอง</span>' : '<span class="tag gr" style="font-size:10px;padding:1px 6px;">ตามโปรแกรม P' + (pIdx + 1) + '</span>'}
                    </div>
                    <div style="font-size:12px;color:var(--dim);margin-top:2px;">
                        โปรแกรมแนะนำ: ${baseKg} กก.${wInfo.isPair ? '×2' : ''} • ใช้อยู่: <span style="color:var(--acc);font-weight:700;">${wInfo.label}</span>
                    </div>
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0;">
                    <button class="btn sm" onclick="editExerciseWeight('${k}')" style="padding:6px 12px;font-size:12px;">✏️ ปรับ</button>
                    ${isCustom ? `<button class="btn sm g" onclick="resetExerciseWeight('${k}')" style="padding:6px 8px;font-size:12px;" title="คืนค่ามาตรฐานโปรแกรม">🔄</button>` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

