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
    document.getElementById('pl').classList.add('on');
    document.body.classList.add('workout-running');
    adjustPlayerLayout();
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
async function quitW() {
    if (await fcConfirm('ออกจากการฝึก? ความคืบหน้าจะไม่ถูกบันทึก')) {
        clearInterval(tick);
        _sid = '';
        document.getElementById('pl').classList.remove('on');
        document.body.classList.remove('workout-running');
    }
}
async function finishW() {
    clearInterval(tick);
    document.getElementById('pl').classList.remove('on');
    document.body.classList.remove('workout-running');
    lock && lock.release && lock.release();
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


/* ============================================================================
   POST-WORKOUT SUMMARY, HEATMAP & SHARE CARD CANVAS ENGINE (v3.5.0)
   ============================================================================ */
window._activeSummarySession = null;
window._shareCardRatio = 'story'; // 'story' (9:16) or 'square' (1:1)

const WORKOUT_MUSCLE_MAPPING = {
    'A': {
        name: 'อก ไหล่หน้า และหลังแขน (Push Day)',
        muscles: ['chest', 'shoulders', 'triceps', 'core'],
        labels: ['อก (Chest) 95%', 'ไหล่ (Delts) 85%', 'หลังแขน (Triceps) 80%', 'แกนกลาง (Core) 70%'],
        tip: '🥩 เน้นโปรตีน 35-40g ภายใน 60 นาที และยืดเหยียดเปิดหน้าอกคลายความตึง'
    },
    'B': {
        name: 'หลัง บ่า และหน้าแขน (Pull Day)',
        muscles: ['upper_back', 'biceps', 'core'],
        labels: ['หลังบน/ปีก (Lats) 95%', 'หน้าแขน (Biceps) 85%', 'บ่า (Traps) 80%', 'แกนกลาง (Core) 65%'],
        tip: '🥩 ทานโปรตีนเสริม และทำท่ายืดแขวนบาร์ (Dead Hang) 30 วินาที คลายแรงกดกระดูกสันหลัง'
    },
    'C': {
        name: 'ขา ก้น และแกนกลางลำตัว (Leg Day)',
        muscles: ['quads', 'glutes_hams', 'core', 'lower_back'],
        labels: ['ต้นขาหน้า (Quads) 95%', 'ก้น/ขาหลัง (Glutes/Hams) 90%', 'แกนกลาง (Core) 80%', 'หลังล่าง 65%'],
        tip: '🦵 ยืด Hamstring และโฟมโรลเลอร์คลายกล้ามเนื้อขา พร้อมดื่มน้ำชดเชยเหงื่อ 600-800 ml'
    },
    'Z': {
        name: 'Zone 2 คาร์ดิโอ & หน้าท้อง',
        muscles: ['core', 'quads'],
        labels: ['ระบบหัวใจ Zone 2 100%', 'แกนกลาง (Core) 85%', 'ขา/น่อง 75%'],
        tip: '💧 ดื่มน้ำชดเชยการสูญเสียเหงื่อ และเดินยืดขาเบาๆ 3 นาทีเพื่อ Cooldown สมบูรณ์'
    },
    'R': {
        name: 'Active Recovery & ฟื้นฟูหลัง (McGill Shield)',
        muscles: ['lower_back', 'core', 'glutes_hams'],
        labels: ['🛡️ เกราะหลังล่าง McGill 100%', 'แกนกลางลำตัว 85%', 'การยืดเหยียด 90%'],
        tip: '🛡️ ทำท่า Cat-Camel และ Bird-Dog ต่อเนื่องสม่ำเสมอ ช่วยลดแรงกดทับหมอนรองกระดูกได้ดีที่สุด'
    }
};

function openWorkoutSummaryModal(sessionId) {
    let session = null;
    if (sessionId) {
        session = (D.sessions || []).find(s => s.id === sessionId);
    }
    if (!session) {
        session = (D.sessions || [])[D.sessions.length - 1];
    }
    if (!session) {
        if (typeof fcAlert === 'function') fcAlert('ยังไม่มีข้อมูลการฝึกซ้อม');
        return;
    }

    window._activeSummarySession = session;
    window._shareCardRatio = 'story';

    // Populate Headers & Bento Stats
    const wk = session.workout_key || 'A';
    const mapping = WORKOUT_MUSCLE_MAPPING[wk] || WORKOUT_MUSCLE_MAPPING['A'];

    const elTitle = document.getElementById('wsWorkoutTitle');
    const elDate = document.getElementById('wsDateSub');
    const elDur = document.getElementById('wsDurVal');
    const elKcal = document.getElementById('wsKcalVal');
    const elVol = document.getElementById('wsVolVal');
    const elSets = document.getElementById('wsSetsVal');
    const elTip = document.getElementById('wsRecoveryTipText');
    const elTags = document.getElementById('wsMuscleTags');

    if (elTitle) elTitle.textContent = session.workout_name || mapping.name;
    if (elDate) {
        const d = session.date || iso();
        elDate.textContent = `วันที่ ${d} • สำเร็จสมบูรณ์แบบ`;
    }
    if (elDur) elDur.textContent = Math.round((session.duration_sec || 0) / 60);
    if (elKcal) elKcal.textContent = (session.kcal || 350).toLocaleString();
    if (elVol) elVol.textContent = (session.total_volume_kg || 0).toLocaleString();
    if (elSets) elSets.textContent = session.total_reps ? `${session.total_reps} ครั้ง` : 'ผ่านครบเซ็ต';
    if (elTip) elTip.textContent = mapping.tip;

    // Render Muscle Tags
    if (elTags) {
        elTags.innerHTML = mapping.labels.map(l => `<span class="fc-summary-muscle-pill">${l}</span>`).join('');
    }

    // Render Heatmap Mini SVGs
    renderSummaryHeatmapSvgs(mapping.muscles);

    // Sync RPE & Pain buttons
    updateSummaryRpeButtons(session.rpe || 7);
    updateSummaryPainButtons(session.pain_after != null ? session.pain_after : 0);

    // Render Share Card Canvas
    renderShareCardCanvas();

    // Show Modal
    const modal = document.getElementById('fcWorkoutSummaryModal');
    if (modal) modal.style.display = 'flex';
}

function closeWorkoutSummaryModal() {
    const modal = document.getElementById('fcWorkoutSummaryModal');
    if (modal) modal.style.display = 'none';
    window._activeSummarySession = null;
}

function renderSummaryHeatmapSvgs(activeMuscles) {
    const frontEl = document.getElementById('wsFrontHeatmap');
    const backEl = document.getElementById('wsBackHeatmap');
    if (!frontEl || !backEl) return;

    const coral = '#f43f5e';
    const dim = '#334155';

    // Front SVG
    const isShoulder = activeMuscles.includes('shoulders') ? coral : dim;
    const isChest = activeMuscles.includes('chest') ? coral : dim;
    const isBiceps = activeMuscles.includes('biceps') ? coral : dim;
    const isCore = activeMuscles.includes('core') ? coral : dim;
    const isQuads = activeMuscles.includes('quads') ? coral : dim;

    frontEl.innerHTML = `
        <svg viewBox="0 0 120 200" width="100%" height="100%">
            <text x="60" y="12" fill="#94a3b8" font-size="10" font-weight="700" text-anchor="middle">ด้านหน้า</text>
            <circle cx="60" cy="28" r="10" fill="#64748b" opacity="0.5"/>
            <rect x="28" y="44" width="14" height="18" rx="5" fill="${isShoulder}"/>
            <rect x="78" y="44" width="14" height="18" rx="5" fill="${isShoulder}"/>
            <rect x="44" y="44" width="32" height="24" rx="5" fill="${isChest}"/>
            <rect x="26" y="66" width="12" height="24" rx="5" fill="${isBiceps}"/>
            <rect x="82" y="66" width="12" height="24" rx="5" fill="${isBiceps}"/>
            <rect x="46" y="70" width="28" height="34" rx="5" fill="${isCore}"/>
            <rect x="43" y="108" width="15" height="42" rx="6" fill="${isQuads}"/>
            <rect x="62" y="108" width="15" height="42" rx="6" fill="${isQuads}"/>
            <rect x="45" y="154" width="12" height="28" rx="4" fill="#64748b" opacity="0.4"/>
            <rect x="63" y="154" width="12" height="28" rx="4" fill="#64748b" opacity="0.4"/>
        </svg>
    `;

    // Back SVG
    const isBack = activeMuscles.includes('upper_back') ? coral : dim;
    const isTriceps = activeMuscles.includes('triceps') ? coral : dim;
    const isLowerBack = activeMuscles.includes('lower_back') ? coral : dim;
    const isGlutes = activeMuscles.includes('glutes_hams') ? coral : dim;

    backEl.innerHTML = `
        <svg viewBox="0 0 120 200" width="100%" height="100%">
            <text x="60" y="12" fill="#94a3b8" font-size="10" font-weight="700" text-anchor="middle">ด้านหลัง</text>
            <circle cx="60" cy="28" r="10" fill="#64748b" opacity="0.5"/>
            <rect x="43" y="44" width="34" height="30" rx="6" fill="${isBack}"/>
            <rect x="27" y="58" width="12" height="28" rx="5" fill="${isTriceps}"/>
            <rect x="81" y="58" width="12" height="28" rx="5" fill="${isTriceps}"/>
            <rect x="46" y="76" width="28" height="20" rx="4" fill="${isLowerBack}"/>
            <rect x="42" y="98" width="36" height="26" rx="6" fill="${isGlutes}"/>
            <rect x="43" y="126" width="15" height="36" rx="5" fill="${isGlutes}"/>
            <rect x="62" y="126" width="15" height="36" rx="5" fill="${isGlutes}"/>
            <rect x="45" y="166" width="12" height="22" rx="4" fill="#64748b" opacity="0.4"/>
            <rect x="63" y="166" width="12" height="22" rx="4" fill="#64748b" opacity="0.4"/>
        </svg>
    `;
}

function setSummaryRpe(val) {
    if (window._activeSummarySession) {
        window._activeSummarySession.rpe = val;
        save();
        render();
        updateSummaryRpeButtons(val);
        renderShareCardCanvas();
    }
}

function updateSummaryRpeButtons(activeVal) {
    const group = document.getElementById('wsRpeBtnGroup');
    if (!group) return;
    const btns = group.querySelectorAll('.fc-rpe-btn');
    btns.forEach(b => {
        const num = parseInt(b.textContent);
        if (num === activeVal) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setSummaryPain(val) {
    if (window._activeSummarySession) {
        window._activeSummarySession.pain_after = val;
        // Also update today check pain
        const tc = todayCheck();
        if (tc) tc.pain = val;
        save();
        render();
        updateSummaryPainButtons(val);
        renderShareCardCanvas();
    }
}

function updateSummaryPainButtons(activeVal) {
    const group = document.getElementById('wsPainBtnGroup');
    if (!group) return;
    const btns = group.querySelectorAll('.fc-rpe-btn');
    btns.forEach(b => {
        const t = b.textContent;
        if (activeVal === 0 && t.startsWith('0')) b.classList.add('active');
        else if (activeVal >= 1 && activeVal <= 2 && t.startsWith('1-2')) b.classList.add('active');
        else if (activeVal >= 3 && activeVal <= 4 && t.startsWith('3-4')) b.classList.add('active');
        else if (activeVal >= 5 && t.startsWith('5+')) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setShareCardRatio(ratio) {
    window._shareCardRatio = ratio;
    const bStory = document.getElementById('btnShareRatioStory');
    const bSquare = document.getElementById('btnShareRatioSquare');
    if (ratio === 'square') {
        if (bSquare) bSquare.classList.add('active');
        if (bStory) bStory.classList.remove('active');
    } else {
        if (bStory) bStory.classList.add('active');
        if (bSquare) bSquare.classList.remove('active');
    }
    renderShareCardCanvas();
}

/* Canvas Painter for Athletic Share Card */
function renderShareCardCanvas() {
    const canvas = document.getElementById('fcShareCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = window._activeSummarySession || (D.sessions && D.sessions[D.sessions.length - 1]);
    if (!s) return;

    const isSquare = (window._shareCardRatio === 'square');
    const W = isSquare ? 720 : 540;
    const H = isSquare ? 720 : 960;

    canvas.width = W;
    canvas.height = H;

    // 1. Dark Athletic Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#1e293b');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative Glow Accents
    const glow = ctx.createRadialGradient(W * 0.8, H * 0.15, 10, W * 0.8, H * 0.15, 260);
    glow.addColorStop(0, 'rgba(0, 192, 112, 0.22)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 2. FitCoach Brand Header
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('fitcoach.', 40, 60);

    ctx.fillStyle = '#00c070';
    ctx.beginPath();
    ctx.arc(148, 58, 4, 0, Math.PI * 2);
    ctx.fill();

    // Date Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, W - 180, 36, 140, 32, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 13px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.date || iso(), W - 110, 57);
    ctx.textAlign = 'left';

    // 3. Workout Title & Badge
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    roundRect(ctx, 40, 100, 180, 30, 15);
    ctx.fillStyle = '#34d399';
    ctx.font = '800 12px -apple-system, sans-serif';
    ctx.fillText('🏆 WORKOUT COMPLETED', 54, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px -apple-system, sans-serif';
    const titleText = (s.workout_name || 'Workout A').split(' — ')[0];
    ctx.fillText(titleText, 40, 170);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px -apple-system, sans-serif';
    const subTitle = (s.workout_name || '').split(' — ')[1] || 'Strength Training';
    ctx.fillText(subTitle, 40, 198);

    // 4. Bento Grid (4 Cards)
    const durMins = Math.round((s.duration_sec || 0) / 60);
    const kcalVal = (s.kcal || 350).toLocaleString();
    const volVal = (s.total_volume_kg || 0).toLocaleString();
    const repsVal = s.total_reps ? s.total_reps + ' ครั้ง' : 'ครบตามเป้า';

    const bentoY = 230;
    const cardW = (W - 100) / 2;
    const cardH = 90;

    // Card 1: Duration
    drawBentoCard(ctx, 40, bentoY, cardW, cardH, '⏱️ ระยะเวลาฝึก', `${durMins}`, 'นาที', '#ffffff');
    // Card 2: Kcal
    drawBentoCard(ctx, 40 + cardW + 20, bentoY, cardW, cardH, '🔥 เผาผลาญ', kcalVal, 'kcal', '#f59e0b');
    // Card 3: Volume
    drawBentoCard(ctx, 40, bentoY + cardH + 16, cardW, cardH, '🏋️ น้ำหนักสะสม (Volume)', volVal, 'กก.', '#38bdf8');
    // Card 4: Intensity / Reps
    drawBentoCard(ctx, 40 + cardW + 20, bentoY + cardH + 16, cardW, cardH, '🎯 เซ็ต / RPE', `RPE ${s.rpe || 7}`, repsVal, '#10b981');

    // 5. Active Muscle Heatmap Card (if Story format or space permits)
    const heatY = bentoY + cardH * 2 + 40;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const heatH = isSquare ? 180 : 280;
    roundRect(ctx, 40, heatY, W - 80, heatH, 20, true, true);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 16px -apple-system, sans-serif';
    ctx.fillText('🧬 แผนผังกล้ามเนื้อที่ถูกกระตุ้น', 64, heatY + 36);

    const wk = s.workout_key || 'A';
    const mapping = WORKOUT_MUSCLE_MAPPING[wk] || WORKOUT_MUSCLE_MAPPING['A'];

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 13px -apple-system, sans-serif';
    ctx.fillText(mapping.name, 64, heatY + 62);

    // Draw active muscle pills
    let pillX = 64;
    let pillY = heatY + 88;
    mapping.labels.forEach((l) => {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        roundRect(ctx, pillX, pillY, 130, 28, 14, true, true);
        ctx.fillStyle = '#fb7185';
        ctx.font = '700 11px -apple-system, sans-serif';
        ctx.fillText(l, pillX + 12, pillY + 18);
        pillX += 138;
        if (pillX > W - 180) {
            pillX = 64;
            pillY += 36;
        }
    });

    // 6. Footer Branding & Verified Badge
    const footerY = H - 50;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(40, footerY - 20, W - 80, 1);

    ctx.fillStyle = '#64748b';
    ctx.font = '700 12px -apple-system, sans-serif';
    ctx.fillText('FitCoach Personal AI Assistant • Science-based Training', 40, footerY + 8);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#10b981';
    ctx.fillText('✓ VERIFIED WORKOUT', W - 40, footerY + 8);
    ctx.textAlign = 'left';
}

function drawBentoCard(ctx, x, y, w, h, label, val, unit, valColor) {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 16, true, true);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 12px -apple-system, sans-serif';
    ctx.fillText(label, x + 16, y + 28);

    ctx.fillStyle = valColor || '#ffffff';
    ctx.font = '900 24px -apple-system, sans-serif';
    ctx.fillText(val, x + 16, y + 64);

    if (unit) {
        const valW = ctx.measureText(val).width;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px -apple-system, sans-serif';
        ctx.fillText(' ' + unit, x + 16 + valW, y + 64);
    }
}

function roundRect(ctx, x, y, w, h, r, fill = true, stroke = false) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function downloadShareCardPng() {
    const canvas = document.getElementById('fcShareCanvas');
    if (!canvas) return;
    const s = window._activeSummarySession || {};
    const d = s.date || iso();
    const link = document.createElement('a');
    link.download = `fitcoach-workout-${d}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof msg === 'function') msg('✓ บันทึกรูปภาพการ์ดแชร์เรียบร้อยแล้ว');
}

async function shareCardViaWebShare() {
    const canvas = document.getElementById('fcShareCanvas');
    if (!canvas) return;
    const s = window._activeSummarySession || {};
    const d = s.date || iso();
    const wkName = s.workout_name || 'Workout';

    if (canvas.toBlob && navigator.canShare) {
        canvas.toBlob(async blob => {
            const file = new File([blob], `fitcoach-workout-${d}.png`, { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: `จบการฝึก ${wkName} บน FitCoach!`,
                        text: `สำเร็จการฝึก ${wkName} เรียบร้อยแล้ว! ⏱️ ${Math.round((s.duration_sec||0)/60)} นาที • 🔥 ${s.kcal||350} kcal`,
                        files: [file]
                    });
                    return;
                } catch (e) {
                    console.log('Share dismissed or failed:', e);
                }
            }
            downloadShareCardPng();
        }, 'image/png');
    } else {
        downloadShareCardPng();
    }
}
