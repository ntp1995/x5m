/* FitCoach v3.0 — Check-in History, Step Counter, Morning Weigh-in & Analytics Charts */
/* ============ DAILY TRACKER EDIT & CHECK-IN HISTORY ============ */


/* ============ STEP COUNT & NEAT TRACKING ============ */
async function logDailySteps(targetDate) {
    const dateStr = targetDate || iso();
    let rec = D.checks.find(x => x.d === dateStr);
    const curSteps = rec?.steps != null ? rec.steps : (D.cfg?.stepTarget || 8000);

    const p = await fcPrompt(
        'ระบุจำนวนก้าวเดินวันนี้ (จากสมาร์ทวอทช์/มือถือ):\n\n(แอปจะคำนวณพลังงานที่เผาผลาญเพิ่มจาก NEAT และนำไปเพิ่มในโควตาแคลอรี่ให้อัตโนมัติ)',
        curSteps,
        '👟 บันทึกก้าวเดินประจำวัน'
    );
    if (p === null) return;
    const nSteps = parseInt(String(p).replace(/,/g, '').trim());
    if (isNaN(nSteps) || nSteps < 0 || nSteps > 150000) {
        fcAlert('กรุณาระบุจำนวนก้าวเดินให้ถูกต้อง (0 - 150,000 ก้าว)');
        return;
    }

    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = {
            d: dateStr,
            w: prev?.w || 77.9,
            steps: nSteps,
            cal: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            water: 0,
            meals: []
        };
        D.checks.push(rec);
    } else {
        rec.steps = nSteps;
    }

    save();
    render();
    msg('✓ บันทึก ' + nSteps.toLocaleString() + ' ก้าวเรียบร้อย');
}

/* ============ MORNING WEIGH-IN & BODY COMPOSITION MODAL ============ */
async function openMorningWeighInModal(targetDate) {
    const dateStr = targetDate || iso();
    const rec = D.checks.find(x => x.d === dateStr);
    const prev = D.checks.filter(x => x.w && x.d !== dateStr).sort((a, b) => b.d.localeCompare(a.d))[0];
    const w = rec?.w != null ? rec.w : (prev?.w || '');
    const bf = rec?.bf != null ? rec.bf : (prev?.bf || D.cfg.biometrics?.bf || '');
    const muscle = rec?.muscle != null ? rec.muscle : (prev?.muscle || D.cfg.biometrics?.muscle || '');
    const hrv = rec?.hrv != null ? rec.hrv : (prev?.hrv || '');
    const pain = rec?.pain != null ? rec.pain : '';

    const html = `
        <div style="text-align:left; font-size:14px; line-height:1.5;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:4px;">⚖️ บันทึกน้ำหนัก & สัดส่วนยามเช้า</div>
            <div style="font-size:12px; color:var(--dim); margin-bottom:12px;">📅 วันที่: <b>${dateStr}</b> (แนะนำชั่งตอนเช้าหลังตื่นนอน ปัสสาวะแล้ว ก่อนดื่มน้ำ/ทานมื้อแรก)</div>

            <div style="background:var(--card2); border:1px solid var(--line); border-radius:12px; padding:12px; margin-bottom:12px;">
                <div style="margin-bottom:10px;">
                    <label style="display:block; font-weight:700; font-size:12.5px; color:var(--tx); margin-bottom:4px;">⚖️ น้ำหนักตัว (กก.) <span style="color:var(--red)">*</span></label>
                    <input type="number" step="0.1" id="mWeighW" value="${w}" oninput="window._tempWeighW=this.value" placeholder="เช่น 70.5" style="width:100%; font-size:16px; font-weight:700; padding:9px; background:var(--bg); border:1.5px solid var(--acc); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                    <div>
                        <label style="display:block; font-weight:700; font-size:12px; color:var(--dim); margin-bottom:4px;">📉 ไขมันในร่างกาย (% BF)</label>
                        <input type="number" step="0.1" id="mWeighBF" value="${bf}" placeholder="เช่น 18.5" style="width:100%; font-size:14px; padding:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-weight:700; font-size:12px; color:var(--dim); margin-bottom:4px;">💪 มวลกล้ามเนื้อ (กก.)</label>
                        <input type="number" step="0.1" id="mWeighMuscle" value="${muscle}" placeholder="เช่น 32.5" style="width:100%; font-size:14px; padding:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <label style="display:block; font-weight:700; font-size:12px; color:var(--dim); margin-bottom:4px;">💓 HRV ยามเช้า (ms)</label>
                        <input type="number" id="mWeighHRV" value="${hrv}" placeholder="เว้นว่างได้" style="width:100%; font-size:14px; padding:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-weight:700; font-size:12px; color:var(--dim); margin-bottom:4px;">🩹 อาการปวดหลัง (0-10)</label>
                        <input type="number" min="0" max="10" id="mWeighPain" value="${pain}" placeholder="0 = ไม่ปวดเลย" style="width:100%; font-size:14px; padding:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                    </div>
                </div>

                <div style="margin-top:10px;">
                    <label style="display:block; font-weight:700; font-size:12px; color:var(--dim); margin-bottom:4px;">👟 จำนวนก้าวเดินวันนี้ (Steps)</label>
                    <input type="number" step="100" id="mWeighSteps" value="${rec?.steps != null ? rec.steps : ''}" placeholder="เช่น 8500 (เว้นว่างได้)" style="width:100%; font-size:14px; padding:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
                </div>
            </div>
        </div>
    `;

    const ok = await fcConfirm(html, 'บันทึกข้อมูลยามเช้า');
    if (!ok) return;

    const wVal = (document.getElementById('mWeighW')?.value || window._tempWeighW || '').toString().trim();
    window._tempWeighW = null;
    const nW = wVal ? parseFloat(wVal) : null;
    if (!nW || nW < 30 || nW > 250) {
        fcAlert('กรุณากรอกน้ำหนักตัวให้ถูกต้อง (30 - 250 กก.) ครับ');
        return;
    }

    const bfVal = document.getElementById('mWeighBF')?.value.trim();
    const nBf = bfVal ? parseFloat(bfVal) : null;

    const muscleVal = document.getElementById('mWeighMuscle')?.value.trim();
    const nMuscle = muscleVal ? parseFloat(muscleVal) : null;

    const hrvVal = document.getElementById('mWeighHRV')?.value.trim();
    const nHrv = hrvVal ? parseInt(hrvVal) : null;

    const painVal = document.getElementById('mWeighPain')?.value.trim();
    const nPain = painVal !== '' ? parseInt(painVal) : null;
    const stepsVal = document.getElementById('mWeighSteps')?.value.trim();
    const nSteps = stepsVal !== '' ? parseInt(stepsVal) : null;

    let cur = D.checks.find(x => x.d === dateStr);
    if (!cur) {
        cur = {
            d: dateStr,
            w: nW,
            bf: nBf,
            muscle: nMuscle,
            hrv: nHrv,
            pain: nPain,
            steps: nSteps,
            cal: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            water: 0,
            meals: []
        };
        D.checks.push(cur);
    } else {
        cur.w = nW;
        if (nBf != null) cur.bf = nBf;
        if (nMuscle != null) cur.muscle = nMuscle;
        if (nHrv != null) cur.hrv = nHrv;
        if (nPain != null) cur.pain = nPain;
        if (nSteps != null) cur.steps = nSteps;
    }

    cur.updatedAt = Date.now();
    if (!D.cfg.biometrics) D.cfg.biometrics = {};
    if (nBf != null) D.cfg.biometrics.bf = nBf;
    if (nMuscle != null) D.cfg.biometrics.muscle = nMuscle;
    if (nW != null) D.cfg.biometrics.w = nW;

    save();
    render();
    if (currentUser && fbDb) {
        pushToCloud();
    } else if (typeof autoSync === 'function') {
        autoSync();
    }
    msg('✓ บันทึกน้ำหนัก & สัดส่วนเช้านี้เรียบร้อยแล้ว!');
}

async function editDailyTracker(targetDate) {
    const dateStr = targetDate || iso();
    let rec = D.checks.find(x => x.d === dateStr);
    const cal = rec?.cal || 0;
    const pro = rec?.protein || 0;
    const carbs = rec?.carbs || 0;
    const fat = rec?.fat || 0;
    const wat = rec?.water || 0;
    const w = rec?.w != null ? rec.w : '';

    const html = `<div style="text-align:left; font-size:14px; line-height:1.5;">
        <div style="font-weight:700; color:var(--acc); font-size:15px; margin-bottom:12px;">📅 ข้อมูลวันที่ ${dateStr}</div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:var(--acc);">⚡ แคลอรี่ (kcal)</label>
                <input type="number" id="edCal" value="${cal}" style="width:100%; font-size:15px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:var(--acc2);">🍗 โปรตีน (g)</label>
                <input type="number" id="edPro" value="${pro}" style="width:100%; font-size:15px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:#3b82f6;">🍚 คาร์บ (g)</label>
                <input type="number" id="edCarbs" value="${carbs}" style="width:100%; font-size:15px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:#10b981;">🥑 ไขมัน (g)</label>
                <input type="number" id="edFat" value="${fat}" style="width:100%; font-size:15px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:#ec4899;">🍭 น้ำตาล (g)</label>
                <input type="number" id="edSugar" value="${rec?.sugar || 0}" style="width:100%; font-size:14px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:#8b5cf6;">🧂 โซเดียม (mg)</label>
                <input type="number" id="edSodium" value="${rec?.sodium || 0}" style="width:100%; font-size:14px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;">💧 น้ำดื่ม (มล. / ml)</label>
                <input type="number" id="edWat" value="${wat}" style="width:100%; font-size:14px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;color:var(--acc);">👟 ก้าวเดิน (ก้าว)</label>
                <input type="number" id="edSteps" value="${rec?.steps != null ? rec.steps : ''}" placeholder="เช่น 8500" style="width:100%; font-size:14px; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
        </div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:14px;">
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;">น้ำหนัก (กก.)</label>
                <input type="number" step="0.1" id="edW" value="${w}" placeholder="เว้นว่างได้" style="width:100%; font-size:14px; text-align:left; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;">ไขมัน (%)</label>
                <input type="number" step="0.1" id="edBf" value="${rec?.bf != null ? rec.bf : ''}" placeholder="เว้นว่างได้" style="width:100%; font-size:14px; text-align:left; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
            <div>
                <label style="display:block;font-weight:bold;font-size:12px;">กล้ามเนื้อ (กก.)</label>
                <input type="number" step="0.1" id="edMuscle" value="${rec?.muscle != null ? rec.muscle : ''}" placeholder="เว้นว่างได้" style="width:100%; font-size:14px; text-align:left; padding:8px; margin-top:2px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px; box-sizing:border-box;">
            </div>
        </div>
        
        <div style="margin-top:6px;">
            <button type="button" class="btn" onclick="resetTodayTracker('${dateStr}')" style="background:rgba(239,68,68,0.12); color:#ef4444; border:1px solid rgba(239,68,68,0.3); font-size:13px; padding:10px; width:100%;">🗑️ ล้างค่าอาหารและน้ำของวันนี้กลับเป็น 0</button>
        </div>
    </div>`;

    const ok = await fcConfirm(html, '✏️ แก้ไขข้อมูลประจำวัน');
    if (!ok) return;

    const nCal = parseInt(document.getElementById('edCal').value) || 0;
    const nPro = parseInt(document.getElementById('edPro').value) || 0;
    const nCarbs = parseInt(document.getElementById('edCarbs').value) || 0;
    const nFat = parseInt(document.getElementById('edFat').value) || 0;
    const nSugar = parseInt(document.getElementById('edSugar')?.value) || 0;
    const nSodium = parseInt(document.getElementById('edSodium')?.value) || 0;
    const nWat = parseInt(document.getElementById('edWat').value) || 0;
    const wVal = document.getElementById('edW').value.trim();
    const nW = wVal !== '' ? parseFloat(wVal) : null;
    const bfVal = document.getElementById('edBf')?.value.trim();
    const nBf = bfVal !== '' ? parseFloat(bfVal) : null;
    const muscleVal = document.getElementById('edMuscle')?.value.trim();
    const nMuscle = muscleVal !== '' ? parseFloat(muscleVal) : null;
    const stepsVal = document.getElementById('edSteps')?.value.trim();
    const nSteps = stepsVal !== '' ? parseInt(stepsVal) : null;

    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = { d: dateStr, w: nW || (prev?.w || 70), bf: nBf != null ? nBf : (prev?.bf || null), muscle: nMuscle != null ? nMuscle : (prev?.muscle || null), hrv: null, pain: null, cal: nCal, protein: nPro, carbs: nCarbs, fat: nFat, sugar: nSugar, sodium: nSodium, water: nWat, meals: [] };
        D.checks.push(rec);
    } else {
        rec.cal = nCal;
        rec.protein = nPro;
        rec.carbs = nCarbs;
        rec.fat = nFat;
        rec.sugar = nSugar;
        rec.sodium = nSodium;
        rec.water = nWat;
        if (nW != null && !isNaN(nW)) rec.w = nW;
        if (nBf != null && !isNaN(nBf)) rec.bf = nBf;
        if (nMuscle != null && !isNaN(nMuscle)) rec.muscle = nMuscle;
        if (nSteps != null && !isNaN(nSteps)) rec.steps = nSteps;
    }
    if (!D.cfg.biometrics) D.cfg.biometrics = {};
    if (nBf != null && !isNaN(nBf)) D.cfg.biometrics.bf = nBf;
    if (nMuscle != null && !isNaN(nMuscle)) D.cfg.biometrics.muscle = nMuscle;

    save();
    render();
    if (currentUser && fbDb) pushToCloud();
    setTimeout(() => fcAlert('บันทึกการแก้ไขเรียบร้อยแล้ว!'), 200);
}

async function resetTodayTracker(dateStr) {
    fcClose();
    const confirmed = await fcConfirm(`ต้องการล้างค่าแคลอรี่ โปรตีน และน้ำดื่มของวันที่ ${dateStr} กลับเป็น 0 ใช่หรือไม่?`, 'ล้างข้อมูลประจำวัน');
    if (!confirmed) return;

    let rec = D.checks.find(x => x.d === dateStr);
    if (rec) {
        rec.cal = 0;
        rec.protein = 0;
        rec.water = 0;
        save();
        render();
        if (currentUser && fbDb) pushToCloud();
        setTimeout(() => fcAlert('ล้างค่าอาหารและน้ำเรียบร้อยแล้ว!'), 200);
    }
}

async function deleteCheck(dateStr) {
    const confirmed = await fcConfirm(`ต้องการลบรายการเช็คอินของวันที่ ${dateStr} ใช่หรือไม่?\n\n(สถิติและกราฟจะถูกคำนวณใหม่)`, '🗑️ ยืนยันการลบ');
    if (!confirmed) return;

    D.checks = (D.checks || []).filter(x => x.d !== dateStr);
    save();
    render();
    if (currentUser && fbDb) pushToCloud();
    setTimeout(() => fcAlert(`ลบข้อมูลวันที่ ${dateStr} เรียบร้อยแล้ว`), 200);
}

function renderCheckHistory() {
    const el = document.getElementById('checkHistory');
    if (!el) return;
    const cnt = document.getElementById('checkCount');
    if (cnt) cnt.textContent = `${D.checks.length} วัน`;

    if (!D.checks || D.checks.length === 0) {
        el.innerHTML = '<div class="sub" style="text-align:center;padding:12px;">ยังไม่มีข้อมูลเช็คอิน</div>';
        return;
    }

    const sorted = [...D.checks].sort((a, b) => b.d.localeCompare(a.d));
    el.innerHTML = sorted.map(c => `
        <div class="row" style="padding:10px 0; border-bottom:1px solid var(--line); align-items:center;">
            <div style="flex:1;">
                <div style="font-size:14px; font-weight:700;">${c.d} ${c.d === iso() ? '<span class="tag" style="font-size:11px;padding:2px 6px;">วันนี้</span>' : ''}</div>
                <div class="sub" style="font-size:12.5px; margin-top:2px;">
                    ${c.w ? `น้ำหนัก: <b>${(+c.w).toFixed(1)}</b> กก. ` : ''}
                    ${c.bf ? `• ไขมัน <b>${c.bf}</b>% ` : ''}
                    ${c.muscle ? `• กล้ามเนื้อ <b>${c.muscle}</b> กก. ` : ''}
                    ${c.steps ? `• 👟 <b>${c.steps.toLocaleString()}</b> ก้าว ` : ''}
                    ${c.cal ? `• <b>${c.cal}</b> kcal ` : ''}
                    ${c.protein ? `• โปรตีน <b>${c.protein}</b>g ` : ''}
                    ${c.water ? `• น้ำ <b>${c.water >= 1000 ? (c.water/1000).toFixed(1) + 'L' : c.water + 'ml'}</b>` : ''}
                </div>
            </div>
            <div style="display:flex; gap:6px;">
                <button onclick="editDailyTracker('${c.d}')" style="background:var(--card2); border:1px solid var(--line); border-radius:8px; padding:6px 10px; font-size:12px; cursor:pointer; color:var(--tx);" title="แก้ไข">✏️</button>
                <button onclick="deleteCheck('${c.d}')" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:6px 10px; font-size:12px; cursor:pointer; color:var(--red);" title="ลบ">🗑️</button>
            </div>
        </div>
    `).join('');
}

/* ============ CHECK-IN + CHARTS ============ */
function addCheck() {
    const w = parseFloat(document.getElementById('inW').value);
    if (!w || w < 30 || w > 250) return fcAlert('กรอกน้ำหนักให้ถูกต้อง (30-250 กก.)');
    const prev = D.checks[D.checks.length - 1];
    const existing = D.checks.find(x => x.d === iso());
    const bf = parseFloat(document.getElementById('inBF').value) || prev?.bf || null;
    const muscle = parseFloat(document.getElementById('inMuscle')?.value) || prev?.muscle || null;
    const steps = parseInt(document.getElementById('inSteps')?.value) || (existing?.steps || null);
    let checkCal = parseInt(document.getElementById('inCal')?.value);
    let checkPro = parseInt(document.getElementById('inProtein')?.value);
    if ((isNaN(checkCal) || checkCal <= 0) && existing?.meals?.length > 0) {
        checkCal = existing.cal || 0;
    } else if (isNaN(checkCal)) {
        checkCal = existing?.cal || null;
    }
    if ((isNaN(checkPro) || checkPro <= 0) && existing?.meals?.length > 0) {
        checkPro = existing.protein || 0;
    } else if (isNaN(checkPro)) {
        checkPro = existing?.protein || null;
    }

    const rec = {
        d: iso(), w, 
        bf,
        muscle,
        steps,
        hrv: parseInt(document.getElementById('inHRV').value) || null,
        pain: document.getElementById('inPain').value === '' ? null : parseInt(document.getElementById('inPain').value),
        cal: checkCal,
        protein: checkPro,
        carbs: existing?.carbs || null,
        fat: existing?.fat || null,
        water: parseInt(document.getElementById('inWater').value) || (existing?.water || null),
        meals: existing?.meals || []
    };
    const i = D.checks.findIndex(x => x.d === iso());
    i >= 0 ? D.checks[i] = rec : D.checks.push(rec);
    if (!D.cfg.biometrics) D.cfg.biometrics = {};
    if (bf) D.cfg.biometrics.bf = bf;
    if (muscle) D.cfg.biometrics.muscle = muscle;
    save(); render(); autoSync();
    ['inW', 'inBF', 'inMuscle', 'inSteps', 'inHRV', 'inPain', 'inCal', 'inProtein', 'inWater'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    fcAlert('✓ บันทึกเช็กอินประจำวันเรียบร้อยแล้ว!');
}

function openAiFoodScanner() {
    const html = `
        <div style="text-align:left; font-size:14px;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:8px;">🤖 AI สแกนอาหาร</div>
            <div style="font-size:12.5px; color:var(--dim); margin-bottom:14px;">เลือกวิธีให้ AI วิเคราะห์คุณค่าทางโภชนาการ (แคลอรี่, โปรตีน, คาร์บ, ไขมัน):</div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <button class="btn" onclick="fcClose(); aiFoodScanner('image');" style="padding:12px; font-size:14px; background:var(--acc); color:#fff; font-weight:700;">📸 ถ่ายรูปหรือเลือกภาพจากอัลบั้ม</button>
                <button class="btn" onclick="fcClose(); aiFoodScanner('text');" style="padding:12px; font-size:14px; background:var(--card2); border:1px solid var(--line); color:var(--tx); font-weight:700;">💬 พิมพ์บอกเมนูอาหารที่ทาน</button>
            </div>
        </div>
    `;
    fcAlert(html);
}

function saveAiFoodMeal(portion) {
    const name = (document.getElementById('aiFoodName')?.value || 'อาหาร').trim();
    const mealType = document.getElementById('aiMealType')?.value || 'lunch';
    const cal = Math.round(Number(document.getElementById('aiCal')?.value) || 0);
    const pro = Math.round(Number(document.getElementById('aiPro')?.value) || 0);
    const carbs = Math.round(Number(document.getElementById('aiCarbs')?.value) || 0);
    const fat = Math.round(Number(document.getElementById('aiFat')?.value) || 0);
    const sugar = Math.round(Number(document.getElementById('aiSugar')?.value) || 0);
    const sodium = Math.round(Number(document.getElementById('aiSodium')?.value) || 0);
    const fiber = Math.round((Number(document.getElementById('aiFiber')?.value) || 0) * 10) / 10;

    const pLabel = document.getElementById('aiPortionLabel')?.textContent || '';
    const finalPortion = (pLabel && !pLabel.includes('100%')) ? `${portion || '1 จาน'} (${pLabel})` : (portion || '1 จาน');

    const baseMeta = window._aiScanBase || {};
    addMealToToday(mealType, name, finalPortion, cal, pro, carbs, fat, sugar, sodium, {
        fiber: fiber,
        nutriGrade: baseMeta.nutriGrade,
        healthScore: baseMeta.healthScore,
        satietyScore: baseMeta.satietyScore,
        coachTip: baseMeta.coachTip,
        ingredients: baseMeta.ingredients
    });
    fcClose();
}

async function aiFoodScanner(mode) {
    if (!D.cfg.aiKey) {
        fcAlert('กรุณาใส่ Gemini API Key ในหน้าซิงก์ก่อนใช้งานครับ');
        return;
    }
    if (mode === 'text') {
        const text = await fcPrompt('พิมพ์บอก AI ว่ากินอะไรไปบ้าง?', 'ข้าวกะเพราหมูสับไข่ดาว 1 จาน');
        if (!text) return;
        processAIFood(null, text);
    } else {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            let file = e.target.files[0];
            if(file) processAIFood(file, null);
        }
        input.click();
    }
}

// Helper for AI scan portion adjusting & live hero pill sync
window.syncAiHeroPillsFromInputs = function() {
    const calVal = Math.round(Number(document.getElementById('aiCal')?.value) || 0);
    const proVal = Math.round(Number(document.getElementById('aiPro')?.value) || 0);
    const carbsVal = Math.round(Number(document.getElementById('aiCarbs')?.value) || 0);
    const fatVal = Math.round(Number(document.getElementById('aiFat')?.value) || 0);
    const fiberVal = Math.round((Number(document.getElementById('aiFiber')?.value) || 0) * 10) / 10;

    const heroCal = document.getElementById('aiHeroCalDisplay');
    const pillPro = document.getElementById('aiPillProDisplay');
    const pillCarbs = document.getElementById('aiPillCarbsDisplay');
    const pillFat = document.getElementById('aiPillFatDisplay');
    const pillFiber = document.getElementById('aiPillFiberDisplay');

    if (heroCal) heroCal.textContent = calVal;
    if (pillPro) pillPro.textContent = proVal + ' g';
    if (pillCarbs) pillCarbs.textContent = carbsVal + ' g';
    if (pillFat) pillFat.textContent = fatVal + ' g';
    if (pillFiber) pillFiber.textContent = fiberVal + ' g';
};

window.applyAiPortion = function(pct, label) {
    const base = window._aiScanBase;
    if (!base) return;
    const calEl = document.getElementById('aiCal');
    const proEl = document.getElementById('aiPro');
    const carbsEl = document.getElementById('aiCarbs');
    const fatEl = document.getElementById('aiFat');
    const sugarEl = document.getElementById('aiSugar');
    const sodiumEl = document.getElementById('aiSodium');
    const fiberEl = document.getElementById('aiFiber');
    const lbl = document.getElementById('aiPortionLabel');
    if (calEl) calEl.value = Math.round(base.cal * pct);
    if (proEl) proEl.value = Math.round(base.pro * pct);
    if (carbsEl) carbsEl.value = Math.round(base.carbs * pct);
    if (fatEl) fatEl.value = Math.round(base.fat * pct);
    if (sugarEl) sugarEl.value = Math.round((base.sugar || 0) * pct);
    if (sodiumEl) sodiumEl.value = Math.round((base.sodium || 0) * pct);
    if (fiberEl) fiberEl.value = Math.round(((base.fiber || 0) * pct) * 10) / 10;
    if (lbl) lbl.textContent = label || (Math.round(pct * 100) + '%');

    // Update ingredient breakdown calories if present
    document.querySelectorAll('.ai-ing-cal').forEach(el => {
        const bCal = Number(el.getAttribute('data-base-cal')) || 0;
        el.textContent = Math.round(bCal * pct) + ' kcal';
    });

    if (typeof window.syncAiHeroPillsFromInputs === 'function') {
        window.syncAiHeroPillsFromInputs();
    }
};

async function processAIFood(file, text) {
    fcClose();
    // Show loading and hide buttons
    fcAlert('<div style="text-align:center;">🤖 AI กำลังวิเคราะห์อาหาร...<br><br><div style="font-size:24px; animation: spin 1s linear infinite;">⏳</div><style>.fc-modal-actions { display:none !important; }</style></div>');
    
    const processRequest = async (parts) => {
        try {
            const keysToTry = [
                (D.cfg.aiKey || '').trim(),
                (D.cfg.aiKeyBackup || '').trim()
            ].filter((k, i, arr) => k && arr.indexOf(k) === i);

            if (keysToTry.length === 0) {
                throw new Error('ไม่พบ Gemini API Key กรุณากรอกในหน้าซิงก์');
            }

            const payload = { contents: [{ parts }] };
            
            // Verified active Google Gemini models
            const models = [
                'gemini-3.5-flash',
                'gemini-3.8-flash-lite',
                'gemini-flash-latest',
                'gemini-3.1-flash-lite',
                'gemini-2.5-flash-lite',
                'gemini-3.8-flash'
            ];

            let res = null;
            let lastStatus = 0;
            let lastErrText = '';

            // Try keys with model waterfall
            keyLoop: for (const apiKey of keysToTry) {
                for (const model of models) {
                    try {
                        const ep = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                        const r = await fetch(ep, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (r.ok) {
                            res = r;
                            break keyLoop;
                        }
                        lastStatus = r.status;
                        const errTxt = await r.text();
                        lastErrText = errTxt;
                        // If 429 quota or rate limit, break to try next key immediately
                        if (r.status === 429) {
                            break;
                        }
                        // If 404 model not found or 503 high demand, try next model in loop
                        if (r.status === 404 || r.status === 503) {
                            continue;
                        }
                    } catch (fetchErr) {
                        lastErrText = fetchErr.message;
                    }
                }
            }

            if (!res) {
                let hint = '';
                if (lastStatus === 404) {
                    hint = ' (Error 404: โมเดลไม่พร้อมใช้งาน แนะนำตรวจสอบการอัปเดตโมเดล)';
                } else if (lastStatus === 503) {
                    hint = ' (Error 503: ระบบ Gemini มีการใช้งานหนาแน่นชั่วคราว กรุณาลองใหม่อีกครั้งใน 1-2 นาที)';
                }
                throw new Error(`ไม่สามารถเชื่อมต่อ Gemini ได้${hint}`);
            }

            const data = await res.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('AI ส่งผลลัพธ์ไม่สมบูรณ์ (No candidates)');
            }
            
            let resText = data.candidates[0].content.parts[0].text;
            const jsonMatch = resText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('AI ส่งผลลัพธ์ไม่ตรงรูปแบบ JSON');
            const result = JSON.parse(jsonMatch[0]);
            
            fcClose();
            setTimeout(() => {
                const foodName = (result.name || 'อาหาร').trim();
                const calVal = Math.round(Number(result.calories) || 0);
                const proVal = Math.round(Number(result.protein) || 0);
                const carbsVal = Math.round(Number(result.carbs) || 0);
                const fatVal = Math.round(Number(result.fat) || 0);
                const sugarVal = Math.round(Number(result.sugar) || 0);
                const sodiumVal = Math.round(Number(result.sodium) || 0);
                const portionVal = (result.portion || '1 จาน').trim();

                const healthMetrics = computeFoodHealthMetrics(
                    calVal, proVal, carbsVal, fatVal, sugarVal, sodiumVal,
                    result.fiber,
                    {
                        nutriGrade: result.nutriGrade,
                        healthScore: result.healthScore,
                        satietyScore: result.satietyScore,
                        coachTip: result.coachTip,
                        ingredients: result.ingredients
                    }
                );
                const fiberVal = healthMetrics.fiber;

                window._aiScanBase = {
                    cal: calVal, pro: proVal, carbs: carbsVal, fat: fatVal,
                    sugar: sugarVal, sodium: sodiumVal, fiber: fiberVal,
                    portion: portionVal,
                    nutriGrade: healthMetrics.nutriGrade,
                    healthScore: healthMetrics.healthScore,
                    satietyScore: healthMetrics.satietyScore,
                    coachTip: healthMetrics.coachTip,
                    ingredients: healthMetrics.ingredients
                };

                const imgBannerHtml = window._lastScannedImageSrc ? `
                    <div style="position:relative; width:100%; height:145px; border-radius:14px; overflow:hidden; margin-bottom:12px; border:1px solid var(--line); box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                        <img src="${window._lastScannedImageSrc}" alt="${foodName}" style="width:100%; height:100%; object-fit:cover; display:block;">
                        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%); display:flex; align-items:flex-end; justify-content:space-between; padding:10px 12px;">
                            <div style="color:#fff; font-weight:800; font-size:14.5px; text-shadow:0 1px 3px rgba(0,0,0,0.6);">${foodName}</div>
                            <span style="background:rgba(255,255,255,0.22); backdrop-filter:blur(6px); color:#fff; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:20px;">📸 สแกนจากภาพ</span>
                        </div>
                    </div>
                ` : '';

                const nowH = new Date().getHours() + (new Date().getMinutes() / 60);
                const defMeal = nowH < 10.5 ? 'breakfast' : nowH < 14.5 ? 'lunch' : nowH < 17.5 ? 'snack' : 'dinner';

                const resModalHtml = `
                    <div style="text-align:left; font-size:14px; max-height:78vh; overflow-y:auto; padding-right:2px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <div style="font-weight:900; font-size:16px; color:var(--acc);">🤖 การ์ดวิเคราะห์โภชนาการ AI</div>
                            <span style="font-size:11px; color:var(--dim); font-weight:700;">${portionVal}</span>
                        </div>

                        ${imgBannerHtml}

                        <!-- Gizi-Style Hero Calorie & Colored Macro Pills -->
                        <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color:#fff; border-radius:14px; padding:12px 14px; margin-bottom:10px; box-shadow:0 4px 12px rgba(15,23,42,0.18);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <div>
                                    <div style="font-size:11px; color:#94a3b8; font-weight:700;">🔥 พลังงานโดยประมาณ</div>
                                    <div style="display:flex; align-items:baseline; gap:5px; margin-top:2px;">
                                        <span id="aiHeroCalDisplay" style="font-size:28px; font-weight:900; color:#f97316; line-height:1;">${calVal}</span>
                                        <span style="font-size:12.5px; color:#cbd5e1; font-weight:700;">กิโลแคลอรี (kcal)</span>
                                    </div>
                                </div>
                                <div style="text-align:right;">
                                    <span style="display:inline-block; background:rgba(249,115,22,0.2); border:1px solid rgba(249,115,22,0.45); color:#fdba74; font-size:11px; font-weight:800; padding:3px 9px; border-radius:20px;">
                                        เกรด ${healthMetrics.nutriGrade} • สุขภาพ ${healthMetrics.healthScore}/10
                                    </span>
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; text-align:center;">
                                <div style="background:rgba(239,68,68,0.16); border:1px solid rgba(239,68,68,0.35); border-radius:10px; padding:6px 4px;">
                                    <div style="font-size:10px; color:#fca5a5; font-weight:700;">🍗 โปรตีน</div>
                                    <div id="aiPillProDisplay" style="font-size:13.5px; font-weight:900; color:#fff; margin-top:2px;">${proVal} g</div>
                                </div>
                                <div style="background:rgba(139,92,246,0.16); border:1px solid rgba(139,92,246,0.35); border-radius:10px; padding:6px 4px;">
                                    <div style="font-size:10px; color:#c4b5fd; font-weight:700;">🍚 คาร์บ</div>
                                    <div id="aiPillCarbsDisplay" style="font-size:13.5px; font-weight:900; color:#fff; margin-top:2px;">${carbsVal} g</div>
                                </div>
                                <div style="background:rgba(234,179,8,0.16); border:1px solid rgba(234,179,8,0.35); border-radius:10px; padding:6px 4px;">
                                    <div style="font-size:10px; color:#fde047; font-weight:700;">🥑 ไขมัน</div>
                                    <div id="aiPillFatDisplay" style="font-size:13.5px; font-weight:900; color:#fff; margin-top:2px;">${fatVal} g</div>
                                </div>
                                <div style="background:rgba(16,185,129,0.16); border:1px solid rgba(16,185,129,0.35); border-radius:10px; padding:6px 4px;">
                                    <div style="font-size:10px; color:#6ee7b7; font-weight:700;">🥦 ไฟเบอร์</div>
                                    <div id="aiPillFiberDisplay" style="font-size:13.5px; font-weight:900; color:#fff; margin-top:2px;">${fiberVal} g</div>
                                </div>
                            </div>
                        </div>

                        <!-- Nutri-Score A-E, Health Score, Satiety Score, Ingredients & Coach Tip -->
                        ${renderNutriScoreWidgetHtml(healthMetrics)}

                        <!-- Quick Portion Selector for AI Scanner -->
                        <div style="background:var(--card2); border:1px solid var(--line); border-radius:10px; padding:8px 10px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span style="font-size:11.5px; font-weight:700; color:var(--dim);">🍽️ สัดส่วนที่ทานจริง (แตะเพื่อหักลบแคลอัตโนมัติ):</span>
                                <span id="aiPortionLabel" style="font-size:11px; font-weight:700; color:var(--acc);">100% (ทานหมด)</span>
                            </div>
                            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;">
                                <button type="button" class="btn sm" onclick="applyAiPortion(1.0, '100% (ทานหมด)')" style="padding:5px 2px; font-size:11px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">100%</button>
                                <button type="button" class="btn sm" onclick="applyAiPortion(0.75, '75% (เหลือ 1/4)')" style="padding:5px 2px; font-size:11px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">75%</button>
                                <button type="button" class="btn sm" onclick="applyAiPortion(0.5, '50% (ครึ่งเดียว)')" style="padding:5px 2px; font-size:11px; font-weight:700; background:rgba(234,88,12,0.12); border:1.5px solid var(--acc); color:var(--acc); border-radius:8px;">50% (ครึ่ง)</button>
                                <button type="button" class="btn sm" onclick="applyAiPortion(0.33, '33% (1 ใน 3)')" style="padding:5px 2px; font-size:11px; font-weight:700; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:8px;">33% (1/3)</button>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:8px; margin-bottom:10px;">
                            <div>
                                <label style="font-size:11.5px; font-weight:700; color:var(--dim); display:block; margin-bottom:3px;">ชื่ออาหาร:</label>
                                <input type="text" id="aiFoodName" value="${foodName}" style="width:100%; padding:7px 9px; font-size:13.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:11.5px; font-weight:700; color:var(--dim); display:block; margin-bottom:3px;">บันทึกลงในมื้อ:</label>
                                <select id="aiMealType" style="width:100%; padding:7px 8px; font-size:13px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--card2); color:var(--tx); box-sizing:border-box;">
                                    <option value="breakfast" ${defMeal === 'breakfast' ? 'selected' : ''}>🌅 มื้อเช้า</option>
                                    <option value="lunch" ${defMeal === 'lunch' ? 'selected' : ''}>☀️ มื้อเที่ยง</option>
                                    <option value="dinner" ${defMeal === 'dinner' ? 'selected' : ''}>🌙 มื้อเย็น</option>
                                    <option value="snack" ${defMeal === 'snack' ? 'selected' : ''}>🍎 ของว่าง</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-bottom:8px;">
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:var(--acc); display:block; margin-bottom:2px;">⚡ แคลอรี่ (kcal)</label>
                                <input type="number" id="aiCal" value="${calVal}" oninput="syncAiHeroPillsFromInputs()" style="width:100%; padding:6px 8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:var(--acc2); display:block; margin-bottom:2px;">🍗 โปรตีน (g)</label>
                                <input type="number" id="aiPro" value="${proVal}" oninput="syncAiHeroPillsFromInputs()" style="width:100%; padding:6px 8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:#3b82f6; display:block; margin-bottom:2px;">🍚 คาร์บ (g)</label>
                                <input type="number" id="aiCarbs" value="${carbsVal}" oninput="syncAiHeroPillsFromInputs()" style="width:100%; padding:6px 8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:12px;">
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:#10b981; display:block; margin-bottom:2px;">🥑 ไขมัน (g)</label>
                                <input type="number" id="aiFat" value="${fatVal}" oninput="syncAiHeroPillsFromInputs()" style="width:100%; padding:6px 6px; font-size:13.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:#059669; display:block; margin-bottom:2px;">🥦 ไฟเบอร์ (g)</label>
                                <input type="number" step="0.5" id="aiFiber" value="${fiberVal}" oninput="syncAiHeroPillsFromInputs()" style="width:100%; padding:6px 6px; font-size:13.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:#ec4899; display:block; margin-bottom:2px;">🍭 น้ำตาล (g)</label>
                                <input type="number" id="aiSugar" value="${sugarVal}" style="width:100%; padding:6px 6px; font-size:13.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-size:10.5px; font-weight:700; color:#8b5cf6; display:block; margin-bottom:2px;">🧂 โซเดียม</label>
                                <input type="number" id="aiSodium" value="${sodiumVal}" style="width:100%; padding:6px 6px; font-size:13.5px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                            </div>
                        </div>

                        <!-- CLOUD FAVORITE ACTION -->
                        <div style="margin-bottom:12px; background:var(--card2); border:1px dashed var(--line); border-radius:10px; padding:9px 10px; display:flex; justify-content:space-between; align-items:center;">
                            <div style="flex:1; padding-right:8px;">
                                <div style="font-size:12px; font-weight:800; color:var(--tx);">⭐ บันทึกลงคลังเมนูโปรด & คลาวด์</div>
                                <div style="font-size:10.5px; color:var(--dim); margin-top:1px;">เก็บไว้กดเลือกซ้ำใน 1 แตะโดยไม่ต้องถ่ายรูปใหม่</div>
                            </div>
                            <button id="btnSaveFavCloud" type="button" class="btn sm" onclick="saveScannedToFavorites('${portionVal}')" style="font-size:11px; padding:6px 10px; background:transparent; border:1px solid var(--acc); color:var(--acc); font-weight:700; border-radius:8px; white-space:nowrap;">+ บันทึกลงคลัง</button>
                        </div>

                        <div style="display:flex; gap:8px;">
                            <button class="btn sm g" onclick="fcClose()" style="flex:1; padding:9px;">ยกเลิก</button>
                            <button class="btn sm" onclick="saveAiFoodMeal('${portionVal}')" style="flex:1.6; padding:9px; background:var(--acc); color:#fff; font-weight:800;">💾 บันทึกมื้ออาหาร</button>
                        </div>
                    </div>
                `;
                fcAlert(resModalHtml);
            }, 300);
        } catch (err) {
            fcClose();
            setTimeout(() => fcAlert('เกิดข้อผิดพลาด: ' + err.message), 300);
        }
    };

    let parts = [
        { text: 'Analyze this food thoroughly as an expert Thai nutritionist specializing in Thai and Northern Thai cuisine (อาหารเหนือ เช่น ข้าวซอย, น้ำพริกหนุ่ม, น้ำพริกอ่อง, ขนมจีนน้ำเงี้ยว, แกงฮังเล, ไส้อั่ว, ลาบคั่ว, แกงแค, แกงโฮะ ฯลฯ). Estimate calories (kcal), protein (g), carbohydrates (g), fat (g), fiber (g), sugar (g), sodium (mg), overall nutritional grade "nutriGrade" ("A", "B", "C", "D", or "E"), "healthScore" (1-10 integer), "satietyScore" (1-10 integer for fullness/satiety), "ingredients" (array of 2-4 main components with name in Thai and cal), and "coachTip" (short 1-2 sentence actionable Thai advice for fat loss and muscle retention). If the user provides a specific food name, use that exact name in the "name" field. Respond ONLY in valid JSON format without markdown or formatting backticks, exactly like this: {"name": "ชื่ออาหารภาษาไทย", "calories": 450, "protein": 30, "carbs": 45, "fat": 15, "fiber": 4, "sugar": 4, "sodium": 650, "portion": "1 จาน", "nutriGrade": "A", "healthScore": 8, "satietyScore": 8, "ingredients": [{"name": "ข้าวสวย", "cal": 180}, {"name": "อกไก่ผัดพริกแกง", "cal": 270}], "coachTip": "โปรตีนสูงดีมาก แนะนำลดน้ำซอสลงเล็กน้อยเพื่อคุมโซเดียมครับ"}' }
    ];
    
    if (text) {
        window._lastScannedImageSrc = null;
        parts.push({ text: "The user described their meal as: " + text });
        processRequest(parts);
    } else if (file) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            const max = 1000;
            if (w > max || h > max) {
                if (w > h) { h = h * (max / w); w = max; }
                else { w = w * (max / h); h = max; }
            }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            window._lastScannedImageSrc = dataUrl;
            const base64Image = dataUrl.split(',')[1];
            parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Image } });
            processRequest(parts);
        };
        img.onerror = () => {
            fcClose();
            setTimeout(() => fcAlert('ไม่สามารถอ่านไฟล์ภาพได้'), 300);
        };
        img.src = URL.createObjectURL(file);
    }
}

