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

/* ============ FULL-SCREEN CAMERA SCANNER & MULTI-IMAGE ENGINE (v3.4.1) ============ */
window._scannedFoodImages = [];
window._cameraMediaStream = null;
window._cameraFacingMode = 'environment';

function openAiFoodScanner() {
    if (!D.cfg.aiKey) {
        fcAlert('กรุณากรอก Gemini API Key ในหน้าซิงก์ก่อนใช้งาน AI สแกนอาหารครับ');
        return;
    }
    window._scannedFoodImages = [];
    const noteEl = document.getElementById('cameraFoodNote');
    if (noteEl) noteEl.value = '';
    renderCameraThumbnailsTray();

    const modal = document.getElementById('fcCameraScannerModal');
    if (modal) {
        modal.style.display = 'flex';
        startCameraStream();
    }
}

function closeAiCameraScanner() {
    stopCameraStream();
    const modal = document.getElementById('fcCameraScannerModal');
    if (modal) modal.style.display = 'none';
}

async function startCameraStream() {
    stopCameraStream();
    const video = document.getElementById('fcCameraVideo');
    const placeholder = document.getElementById('fcCamPlaceholder');
    if (placeholder) placeholder.style.display = 'none';

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (placeholder) placeholder.style.display = 'flex';
        return;
    }

    try {
        const constraints = {
            video: {
                facingMode: { ideal: window._cameraFacingMode },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window._cameraMediaStream = stream;
        if (video) {
            video.srcObject = stream;
            video.play().catch(() => {});
        }
    } catch (err) {
        console.warn('Camera stream error:', err);
        if (placeholder) placeholder.style.display = 'flex';
    }
}

function stopCameraStream() {
    if (window._cameraMediaStream) {
        try {
            window._cameraMediaStream.getTracks().forEach(t => t.stop());
        } catch (e) {}
        window._cameraMediaStream = null;
    }
    const video = document.getElementById('fcCameraVideo');
    if (video) video.srcObject = null;
}

function toggleCameraFacing() {
    window._cameraFacingMode = window._cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCameraStream();
}

function captureCameraPhoto() {
    if (window._scannedFoodImages.length >= 5) {
        fcAlert('บันทึกได้สูงสุด 5 ภาพต่อ 1 เมนูแล้วครับ');
        return;
    }
    const video = document.getElementById('fcCameraVideo');
    if (!video || !video.videoWidth) {
        triggerCameraGallery();
        return;
    }

    const canvas = document.createElement('canvas');
    let w = video.videoWidth;
    let h = video.videoHeight;
    const maxDim = 1200;
    if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
        else { w = Math.round(w * (maxDim / h)); h = maxDim; }
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

    window._scannedFoodImages.push(dataUrl);

    // Subtle shutter animation / vibration
    if (navigator.vibrate) navigator.vibrate(40);
    const vp = document.querySelector('.fc-cam-viewport');
    if (vp) {
        vp.style.opacity = '0.35';
        setTimeout(() => { vp.style.opacity = '1'; }, 100);
    }
    renderCameraThumbnailsTray();
}

function triggerCameraGallery() {
    const inp = document.getElementById('cameraGalleryInput');
    if (inp) {
        inp.value = '';
        inp.click();
    }
}

function handleCameraGallerySelection(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let remainingSlots = 5 - window._scannedFoodImages.length;
    if (remainingSlots <= 0) {
        fcAlert('สามารถเลือกภาพได้สูงสุด 5 ภาพครับ');
        return;
    }

    const filesToLoad = files.slice(0, remainingSlots);
    let loadedCount = 0;

    filesToLoad.forEach(file => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            const maxDim = 1200;
            if (w > maxDim || h > maxDim) {
                if (w > h) { h = Math.round(h * (maxDim / w)); w = maxDim; }
                else { w = Math.round(w * (maxDim / h)); h = maxDim; }
            }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            window._scannedFoodImages.push(canvas.toDataURL('image/jpeg', 0.82));
            loadedCount++;
            if (loadedCount === filesToLoad.length) {
                renderCameraThumbnailsTray();
            }
        };
        img.src = URL.createObjectURL(file);
    });
}

function deleteCameraImage(idx) {
    if (idx >= 0 && idx < window._scannedFoodImages.length) {
        window._scannedFoodImages.splice(idx, 1);
        renderCameraThumbnailsTray();
    }
}

function renderCameraThumbnailsTray() {
    const tray = document.getElementById('fcCamThumbnailsTray');
    const countEl = document.getElementById('fcCamAnalyzeCount');
    const count = window._scannedFoodImages.length;
    if (countEl) countEl.textContent = `(${count} รูป)`;

    if (!tray) return;

    if (count === 0) {
        tray.innerHTML = `
            <div class="fc-cam-thumb-empty" onclick="captureCameraPhoto()">
                <span>📷 ถ่ายรูปที่ 1</span>
            </div>
            <div style="font-size:11.5px; color:#94a3b8; font-weight:600; margin-left:6px;">
                กดชัตเตอร์ ⚪ เพื่อถ่าย หรือเลือกจากอัลบั้ม 🖼️
            </div>
        `;
        return;
    }

    let html = '';
    window._scannedFoodImages.forEach((src, idx) => {
        html += `
            <div class="fc-cam-thumb">
                <img src="${src}" alt="Dish ${idx+1}">
                <button type="button" class="fc-cam-thumb-del" onclick="deleteCameraImage(${idx})" title="ลบภาพ">✕</button>
            </div>
        `;
    });

    if (count < 5) {
        html += `
            <div class="fc-cam-thumb-empty" onclick="captureCameraPhoto()" title="เพิ่มรูปอีก">
                <span>+ รูปที่ ${count+1}</span>
            </div>
        `;
    }
    tray.innerHTML = html;
}

function submitMultiImageFoodScan() {
    const note = (document.getElementById('cameraFoodNote')?.value || '').trim();
    if (window._scannedFoodImages.length === 0 && !note) {
        fcAlert('กรุณากดถ่ายภาพอย่างน้อย 1 ภาพ หรือพิมพ์รายละเอียดอาหารเพื่อวิเคราะห์ครับ');
        return;
    }
    const imgs = [...window._scannedFoodImages];
    closeAiCameraScanner();
    processMultiImageAIFood(imgs, note);
}

function aiFoodScanner(mode) {
    if (mode === 'text') {
        fcPrompt('พิมพ์บอก AI ว่ากินอะไรไปบ้าง?', 'ข้าวกะเพราหมูสับไข่ดาว 1 จาน').then(text => {
            if (text) processMultiImageAIFood([], text.trim());
        });
    } else {
        openAiFoodScanner();
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

async function processMultiImageAIFood(imagesArray = [], textNote = '') {
    fcClose();
    // Show loading modal with animated spinner
    fcAlert(`
        <div style="text-align:center; padding:10px 0;">
            <div style="font-weight:800; font-size:16px; color:var(--acc); margin-bottom:6px;">🤖 Gemini AI กำลังวิเคราะห์โภชนาการ...</div>
            <div style="font-size:28px; animation: fcSpin 1s linear infinite; margin:14px 0;">⏳</div>
            <div style="font-size:12px; color:var(--dim); line-height:1.4;">
                ${imagesArray.length > 0 ? `ประมวลผลข้อมูลจากรูปภาพ ${imagesArray.length} ภาพ` : 'ประมวลผลข้อมูลเมนู'}<br>
                ${textNote ? `ร่วมกับ: "${textNote}"` : 'กำลังคำนวณแคลอรี่และสารอาหารละเอียด'}
            </div>
            <style>.fc-modal-actions { display:none !important; }</style>
        </div>
    `);

    try {
        const keysToTry = [
            (D.cfg.aiKey || '').trim(),
            (D.cfg.aiKeyBackup || '').trim()
        ].filter((k, i, arr) => k && arr.indexOf(k) === i);

        if (keysToTry.length === 0) {
            throw new Error('ไม่พบ Gemini API Key กรุณากรอกในหน้าซิงก์');
        }

        const parts = [
            { text: 'Analyze this food thoroughly as an expert Thai nutritionist specializing in Thai and Northern Thai cuisine (อาหารเหนือ เช่น ข้าวซอย, น้ำพริกหนุ่ม, น้ำพริกอ่อง, ขนมจีนน้ำเงี้ยว, แกงฮังเล, ไส้อั่ว, ลาบคั่ว, แกงแค, แกงโฮะ ฯลฯ). Estimate calories (kcal), protein (g), carbohydrates (g), fat (g), fiber (g), sugar (g), sodium (mg), overall nutritional grade "nutriGrade" ("A", "B", "C", "D", or "E"), "healthScore" (1-10 integer), "satietyScore" (1-10 integer for fullness/satiety), "ingredients" (array of 2-4 main components with name in Thai and cal), and "coachTip" (short 1-2 sentence actionable Thai advice for fat loss and muscle retention). If the user provides a specific food name or note, strictly adhere to and prioritize that name in the "name" field and adjust portion/macros accordingly. Respond ONLY in valid JSON format without markdown or formatting backticks, exactly like this: {"name": "ชื่ออาหารภาษาไทย", "calories": 450, "protein": 30, "carbs": 45, "fat": 15, "fiber": 4, "sugar": 4, "sodium": 650, "portion": "1 จาน", "nutriGrade": "A", "healthScore": 8, "satietyScore": 8, "ingredients": [{"name": "ข้าวสวย", "cal": 180}, {"name": "อกไก่ผัดพริกแกง", "cal": 270}], "coachTip": "โปรตีนสูงดีมาก แนะนำลดน้ำซอสลงเล็กน้อยเพื่อคุมโซเดียมครับ"}' }
        ];

        if (textNote) {
            parts.push({ text: `ข้อมูลและรายละเอียดสำคัญเพิ่มเติมจากผู้ทาน: "${textNote}" (กรุณาใช้ข้อมูลนี้เป็นหลักในการระบุชื่อเมนู คำนวณปริมาณ และประเมินส่วนประกอบ)` });
        }

        if (imagesArray && imagesArray.length > 0) {
            parts.push({ text: `ผู้ทานแนบรูปภาพอาหารมาทั้งหมด ${imagesArray.length} ภาพ (ประกอบด้วยจานหลัก, เครื่องเคียง, น้ำจิ้ม, หรือฉลาก) กรุณาวิเคราะห์สารอาหารรวมจากทุกรูปเข้าด้วยกัน` });
            imagesArray.forEach(imgDataUrl => {
                const b64 = imgDataUrl.split(',')[1];
                if (b64) {
                    parts.push({ inlineData: { mimeType: 'image/jpeg', data: b64 } });
                }
            });
        }

        const payload = { contents: [{ parts }] };
        
        // Priority waterfall: Gemini 3.1 Flash Lite (500 RPD) first, then 3.6/3.8 Flash
        const models = [
            'gemini-3.1-flash-lite',
            'gemini-3.6-flash',
            'gemini-3.8-flash',
            'gemini-2.5-flash-lite'
        ];

        let res = null;
        let lastStatus = 0;

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
                    if (r.status === 429) break; // Try next key
                } catch (fetchErr) {}
            }
        }

        if (!res) {
            let hint = '';
            if (lastStatus === 429) hint = ' (โควต้าชนเพดานชั่วคราว กรุณารอ 1 นาที)';
            else if (lastStatus === 503) hint = ' (เซิร์ฟเวอร์ Google มีผู้ใช้หนาแน่นชั่วคราว)';
            throw new Error(`ไม่สามารถเชื่อมต่อ Gemini ได้${hint}`);
        }

        const data = await res.json();
        if (typeof recordAiUsage === 'function') {
            recordAiUsage(`สแกนอาหาร (${imagesArray.length || 1} รูป)`, true);
        }
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('AI ส่งผลลัพธ์ไม่สมบูรณ์ (No candidates)');
        }
        
        const resText = data.candidates[0].content.parts[0].text;
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

            window._lastScannedImageSrc = imagesArray.length > 0 ? imagesArray[0] : null;

            // Multi-image banner or single image banner
            let imgBannerHtml = '';
            if (imagesArray.length === 1) {
                imgBannerHtml = `
                    <div style="position:relative; width:100%; height:145px; border-radius:14px; overflow:hidden; margin-bottom:12px; border:1px solid var(--line); box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                        <img src="${imagesArray[0]}" alt="${foodName}" style="width:100%; height:100%; object-fit:cover; display:block;">
                        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%); display:flex; align-items:flex-end; justify-content:space-between; padding:10px 12px;">
                            <div style="color:#fff; font-weight:800; font-size:14.5px; text-shadow:0 1px 3px rgba(0,0,0,0.6);">${foodName}</div>
                            <span style="background:rgba(255,255,255,0.22); backdrop-filter:blur(6px); color:#fff; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:20px;">📸 สแกนจากกล้อง</span>
                        </div>
                    </div>
                `;
            } else if (imagesArray.length > 1) {
                imgBannerHtml = `
                    <div style="margin-bottom:12px;">
                        <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none;">
                            ${imagesArray.map((src, i) => `
                                <div style="position:relative; width:95px; height:85px; border-radius:10px; overflow:hidden; flex-shrink:0; border:1.5px solid var(--acc);">
                                    <img src="${src}" style="width:100%; height:100%; object-fit:cover; display:block;">
                                    <span style="position:absolute; bottom:2px; right:2px; background:rgba(0,0,0,0.65); color:#fff; font-size:9.5px; font-weight:700; padding:1px 5px; border-radius:4px;">#${i+1}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                            <span style="font-size:11.5px; font-weight:800; color:var(--acc);">📸 วิเคราะห์รวมจาก ${imagesArray.length} ภาพ</span>
                            ${textNote ? `<span style="font-size:11px; color:#475569; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;">📝 ${textNote}</span>` : ''}
                        </div>
                    </div>
                `;
            } else if (textNote) {
                imgBannerHtml = `
                    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:8px 12px; margin-bottom:12px; font-size:12px; color:#1d4ed8; font-weight:700;">
                        📝 วิเคราะห์จากข้อความ: "${textNote}"
                    </div>
                `;
            }

            const nowH = new Date().getHours() + (new Date().getMinutes() / 60);
            const defMeal = nowH < 10.5 ? 'breakfast' : nowH < 14.5 ? 'lunch' : nowH < 17.5 ? 'snack' : 'dinner';

            const resModalHtml = `
                <div style="text-align:left; font-size:14px; max-height:78vh; overflow-y:auto; padding-right:2px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="font-weight:900; font-size:16px; color:var(--acc);">🤖 การ์ดวิเคราะห์โภชนาการ AI</div>
                        <span style="font-size:11px; color:var(--dim); font-weight:700;">${portionVal}</span>
                    </div>

                    ${imgBannerHtml}

                    <!-- Hero Calorie & Colored Macro Pills -->
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
                                <div style="font-size:10px; color:#94a3b8; font-weight:700;">สัดส่วนที่ทานจริง</div>
                                <span id="aiPortionLabel" style="font-size:12px; font-weight:800; background:#3b82f6; color:#fff; padding:3px 8px; border-radius:99px; display:inline-block; margin-top:2px;">100%</span>
                            </div>
                        </div>

                        <!-- 4 Macro Pills Grid -->
                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; text-align:center;">
                            <div style="background:rgba(255,255,255,0.08); border-radius:8px; padding:6px 3px;">
                                <div style="font-size:9.5px; color:#fb923c; font-weight:700;">โปรตีน</div>
                                <div id="aiPillProDisplay" style="font-size:13px; font-weight:900; color:#fff; margin-top:1px;">${proVal} g</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.08); border-radius:8px; padding:6px 3px;">
                                <div style="font-size:9.5px; color:#60a5fa; font-weight:700;">คาร์บ</div>
                                <div id="aiPillCarbsDisplay" style="font-size:13px; font-weight:900; color:#fff; margin-top:1px;">${carbsVal} g</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.08); border-radius:8px; padding:6px 3px;">
                                <div style="font-size:9.5px; color:#34d399; font-weight:700;">ไขมัน</div>
                                <div id="aiPillFatDisplay" style="font-size:13px; font-weight:900; color:#fff; margin-top:1px;">${fatVal} g</div>
                            </div>
                            <div style="background:rgba(255,255,255,0.08); border-radius:8px; padding:6px 3px;">
                                <div style="font-size:9.5px; color:#a78bfa; font-weight:700;">ไฟเบอร์</div>
                                <div id="aiPillFiberDisplay" style="font-size:13px; font-weight:900; color:#fff; margin-top:1px;">${fiberVal} g</div>
                            </div>
                        </div>
                    </div>

                    <!-- 1-Tap Portion Multipliers -->
                    <div style="display:flex; gap:5px; margin-bottom:12px;">
                        <button type="button" class="btn sm" onclick="applyAiPortion(0.5, 'ทานครึ่งเดียว 50%')" style="flex:1; padding:6px 2px; font-size:11px; background:var(--card2); border:1px solid var(--line); color:var(--tx); font-weight:700; border-radius:8px;">½ ครึ่งเดียว</button>
                        <button type="button" class="btn sm" onclick="applyAiPortion(0.75, 'ทาน 3 ใน 4 (75%)')" style="flex:1; padding:6px 2px; font-size:11px; background:var(--card2); border:1px solid var(--line); color:var(--tx); font-weight:700; border-radius:8px;">¾ 75%</button>
                        <button type="button" class="btn sm" onclick="applyAiPortion(1.0, 'ทานหมดจาน 100%')" style="flex:1; padding:6px 2px; font-size:11px; background:#eff6ff; border:1.5px solid var(--acc); color:var(--acc); font-weight:800; border-radius:8px;">✓ 100%</button>
                        <button type="button" class="btn sm" onclick="applyAiPortion(1.5, 'จานพิเศษ 1.5 เท่า')" style="flex:1; padding:6px 2px; font-size:11px; background:var(--card2); border:1px solid var(--line); color:var(--tx); font-weight:700; border-radius:8px;">+ พิเศษ</button>
                    </div>

                    <!-- Nutri-Score & Satiety Quality Card -->
                    ${renderNutriScoreWidgetHtml(healthMetrics)}

                    <div style="display:grid; grid-template-columns:1.8fr 1fr; gap:8px; margin:10px 0 8px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">ชื่ออาหาร</label>
                            <input type="text" id="aiFoodName" value="${foodName}" style="width:100%; padding:8px; font-size:14px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--dim); display:block; margin-bottom:2px;">บันทึกในมื้อ</label>
                            <select id="aiMealType" style="width:100%; padding:8px; font-size:13px; font-weight:700; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--tx); box-sizing:border-box;">
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
}

// Backwards-compatible alias for existing callers
function processAIFood(file, text) {
    if (text) {
        processMultiImageAIFood([], text);
    } else if (file) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            const max = 1200;
            if (w > max || h > max) {
                if (w > h) { h = Math.round(h * (max / w)); w = max; }
                else { w = Math.round(w * (max / h)); h = max; }
            }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            processMultiImageAIFood([canvas.toDataURL('image/jpeg', 0.82)], '');
        };
        img.src = URL.createObjectURL(file);
    }
}


/* ============================================================================
   WiseMeal Body Tracking & Weekly Circumference Measurement Engine (v3.5.0)
   ============================================================================ */
window._selectedMeasurePart = 'waist';
window._weightChartFilter = 'week'; // 'week', 'month', 'quarter'
window._tapeCurrentValue = 82;
window._tapeCurrentUnit = 'cm';

const MEASURE_PARTS = {
    waist: { name: 'รอบเอว', short: 'เอว', defVal: 82, min: 45, max: 160 },
    chest: { name: 'รอบอก', short: 'รอบอก', defVal: 100, min: 60, max: 170 },
    thigh: { name: 'รอบขา', short: 'รอบขา', defVal: 56, min: 30, max: 110 },
    hips: { name: 'รอบสะโพก', short: 'สะโพก', defVal: 95, min: 60, max: 170 },
    arm: { name: 'รอบแขน', short: 'รอบแขน', defVal: 34, min: 18, max: 70 }
};

function ensureMeasurementsStore() {
    if (!D.cfg) D.cfg = {};
    if (!D.cfg.measurements) {
        D.cfg.measurements = {
            waist: 82,
            chest: 100,
            thigh: 56,
            hips: 95,
            arm: 34,
            lastMeasuredDate: null
        };
    }
    return D.cfg.measurements;
}

function switchBodySubTab(tab) {
    const tabWeight = document.getElementById('tabBodyWeight');
    const tabCirc = document.getElementById('tabBodyCircumference');
    const secWeight = document.getElementById('bodyWeightSection');
    const secCirc = document.getElementById('bodyCircumferenceSection');

    if (!tabWeight || !tabCirc || !secWeight || !secCirc) return;

    if (tab === 'weight') {
        tabWeight.classList.add('active');
        tabCirc.classList.remove('active');
        secWeight.style.display = 'block';
        secCirc.style.display = 'none';
        if (typeof charts === 'function') charts();
    } else {
        tabCirc.classList.add('active');
        tabWeight.classList.remove('active');
        secWeight.style.display = 'none';
        secCirc.style.display = 'block';
        renderBodyFigureAndPins();
        selectMeasurePart(window._selectedMeasurePart || 'waist');
        updateWeeklyCadenceStatus();
    }
}

function updateWeeklyCadenceStatus() {
    const badge = document.getElementById('wmWeeklyMeasureBadge');
    if (!badge) return;
    const store = ensureMeasurementsStore();
    const lastDate = store.lastMeasuredDate;
    if (!lastDate) {
        badge.textContent = '🔔 รอวัดสัปดาห์นี้';
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
        return;
    }

    const todayMs = new Date(iso() + 'T00:00:00+07:00').getTime();
    const lastMs = new Date(lastDate + 'T00:00:00+07:00').getTime();
    const daysAgo = Math.max(0, Math.floor((todayMs - lastMs) / 864e5));

    if (daysAgo >= 7) {
        badge.textContent = `🔔 ถึงรอบวัดแล้ว (${daysAgo} วันก่อน)`;
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
    } else {
        badge.textContent = `✓ วัดแล้ว (${daysAgo === 0 ? 'วันนี้' : daysAgo + ' วันที่แล้ว'})`;
        badge.style.background = '#d1fae5';
        badge.style.color = '#047857';
    }
}

function getLatestMeasurement(partKey) {
    const store = ensureMeasurementsStore();
    // Look in todayCheck or recent checks first
    for (let i = D.checks.length - 1; i >= 0; i--) {
        const c = D.checks[i];
        if (c.measurements && c.measurements[partKey] != null) {
            return { val: c.measurements[partKey], date: c.d };
        }
    }
    return { val: store[partKey] || MEASURE_PARTS[partKey].defVal, date: store.lastMeasuredDate || iso() };
}

function renderBodyFigureAndPins() {
    const container = document.getElementById('wmBodyFigureContainer');
    if (!container) return;

    const curWaist = getLatestMeasurement('waist').val;
    const curChest = getLatestMeasurement('chest').val;
    const curThigh = getLatestMeasurement('thigh').val;
    const curHips = getLatestMeasurement('hips').val;
    const curArm = getLatestMeasurement('arm').val;

    container.innerHTML = `
        <svg class="wm-body-figure-svg" viewBox="0 0 320 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bodySkinGrad" x1="160" y1="20" x2="160" y2="360" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#cbd5e1" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.95"/>
                </linearGradient>
                <linearGradient id="bodyMuscleShadow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#64748b" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#475569" stop-opacity="0.6"/>
                </linearGradient>
            </defs>

            <!-- Anatomical Athletic Male Silhouette -->
            <g id="figureSilhouette">
                <!-- Head & Neck -->
                <ellipse cx="160" cy="46" rx="20" ry="24" fill="url(#bodySkinGrad)"/>
                <path d="M152 68 L150 90 L170 90 L168 68 Z" fill="url(#bodySkinGrad)"/>

                <!-- Traps & Shoulders -->
                <path d="M150 84 Q125 90 98 104 Q92 110 94 130 L108 178 L122 176 L118 132 Q128 120 148 108 Z" fill="url(#bodySkinGrad)"/>
                <path d="M170 84 Q195 90 222 104 Q228 110 226 130 L212 178 L198 176 L202 132 Q192 120 172 108 Z" fill="url(#bodySkinGrad)"/>

                <!-- Torso / Chest / Core -->
                <path d="M102 112 Q130 96 160 96 Q190 96 218 112 Q208 140 204 168 Q182 174 160 174 Q138 174 116 168 Q112 140 102 112 Z" fill="url(#bodySkinGrad)"/>
                
                <!-- Chest Definition Lines -->
                <path d="M125 124 Q142 136 160 134 Q178 136 195 124" stroke="url(#bodyMuscleShadow)" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M160 110 L160 148" stroke="url(#bodyMuscleShadow)" stroke-width="2" stroke-linecap="round"/>

                <!-- Abdomen / Waist Taper -->
                <path d="M116 168 Q124 192 126 214 L194 214 Q196 192 204 168 Z" fill="url(#bodySkinGrad)"/>
                <!-- Abs Lines -->
                <line x1="160" y1="152" x2="160" y2="208" stroke="url(#bodyMuscleShadow)" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="144" y1="172" x2="176" y2="172" stroke="url(#bodyMuscleShadow)" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="145" y1="192" x2="175" y2="192" stroke="url(#bodyMuscleShadow)" stroke-width="1.5" stroke-linecap="round"/>

                <!-- Pelvis & Hips -->
                <path d="M126 214 Q124 232 116 250 L204 250 Q196 232 194 214 Z" fill="url(#bodySkinGrad)"/>

                <!-- Athletic Thighs -->
                <!-- Left Thigh -->
                <path d="M118 248 Q114 280 120 326 Q128 358 136 364 L154 362 Q150 326 156 260 Z" fill="url(#bodySkinGrad)"/>
                <!-- Right Thigh -->
                <path d="M202 248 Q206 280 200 326 Q192 358 184 364 L166 362 Q170 326 164 260 Z" fill="url(#bodySkinGrad)"/>
            </g>

            <!-- Guide Dotted Lines -->
            <!-- 1. Chest Line -->
            <path d="M84 94 H122 L142 122" stroke="#00c070" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- 2. Arm Line -->
            <path d="M232 94 H212 L206 126" stroke="#00c070" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- 3. Waist Line -->
            <path d="M84 176 H118 L138 180" stroke="#00c070" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- 4. Hips Line -->
            <path d="M232 208 H198 L188 222" stroke="#00c070" stroke-width="1.5" stroke-dasharray="3 3"/>
            <!-- 5. Thigh Line -->
            <path d="M232 292 H196 L184 300" stroke="#00c070" stroke-width="1.5" stroke-dasharray="3 3"/>

            <!-- Anatomical Center Dots -->
            <circle cx="142" cy="122" r="4" fill="#ffffff" stroke="#00c070" stroke-width="2.5"/>
            <circle cx="206" cy="126" r="4" fill="#ffffff" stroke="#00c070" stroke-width="2.5"/>
            <circle cx="138" cy="180" r="4" fill="#ffffff" stroke="#00c070" stroke-width="2.5"/>
            <circle cx="188" cy="222" r="4" fill="#ffffff" stroke="#00c070" stroke-width="2.5"/>
            <circle cx="184" cy="300" r="4" fill="#ffffff" stroke="#00c070" stroke-width="2.5"/>
        </svg>

        <!-- HTML Interactive Callout Pin Pills -->
        <div class="wm-measure-pin ${window._selectedMeasurePart === 'chest' ? 'selected' : ''}" id="pin_chest" style="top:76px; left:12px;" onclick="selectMeasurePart('chest')">
            รอบอก
        </div>
        <div class="wm-measure-pin ${window._selectedMeasurePart === 'arm' ? 'selected' : ''}" id="pin_arm" style="top:76px; right:12px;" onclick="selectMeasurePart('arm')">
            รอบแขน
        </div>
        <div class="wm-measure-pin ${window._selectedMeasurePart === 'waist' ? 'selected' : ''}" id="pin_waist" style="top:158px; left:12px;" onclick="selectMeasurePart('waist')">
            รอบเอว
        </div>
        <div class="wm-measure-pin ${window._selectedMeasurePart === 'hips' ? 'selected' : ''}" id="pin_hips" style="top:190px; right:12px;" onclick="selectMeasurePart('hips')">
            รอบสะโพก
        </div>
        <div class="wm-measure-pin ${window._selectedMeasurePart === 'thigh' ? 'selected' : ''}" id="pin_thigh" style="top:274px; right:12px;" onclick="selectMeasurePart('thigh')">
            รอบขา
        </div>
    `;
}

function selectMeasurePart(partKey) {
    if (!MEASURE_PARTS[partKey]) partKey = 'waist';
    window._selectedMeasurePart = partKey;

    // Update pins
    ['chest', 'arm', 'waist', 'hips', 'thigh'].forEach(pk => {
        const pin = document.getElementById('pin_' + pk);
        if (pin) {
            if (pk === partKey) pin.classList.add('selected');
            else pin.classList.remove('selected');
        }
        const tab = document.getElementById('tabPart_' + pk);
        if (tab) {
            if (pk === partKey) tab.classList.add('active');
            else tab.classList.remove('active');
        }
    });

    // Update header & info
    const info = MEASURE_PARTS[partKey];
    const latest = getLatestMeasurement(partKey);
    const titleEl = document.getElementById('wmPartTitle');
    const valEl = document.getElementById('wmPartCurrentVal');
    const btnEl = document.getElementById('wmLogMeasureBtn');
    const badgeEl = document.getElementById('wmPartChangeBadge');

    if (titleEl) titleEl.textContent = info.name;
    if (valEl) valEl.textContent = `${(+latest.val).toFixed(1)} ซม.`;
    if (btnEl) btnEl.textContent = `บันทึกขนาด${info.short}`;

    // Calculate diff from first record
    let firstVal = null;
    for (let c of D.checks) {
        if (c.measurements && c.measurements[partKey] != null) {
            firstVal = c.measurements[partKey];
            break;
        }
    }
    if (firstVal != null && badgeEl) {
        const diff = latest.val - firstVal;
        if (diff < 0) {
            badgeEl.textContent = `${diff.toFixed(1)} ซม.`;
            badgeEl.style.color = '#10b981';
            badgeEl.style.background = 'rgba(16, 185, 129, 0.1)';
        } else if (diff > 0) {
            badgeEl.textContent = `+${diff.toFixed(1)} ซม.`;
            badgeEl.style.color = '#f59e0b';
            badgeEl.style.background = 'rgba(245, 158, 11, 0.1)';
        } else {
            badgeEl.textContent = `คงที่ 0.0 ซม.`;
            badgeEl.style.color = 'var(--dim)';
            badgeEl.style.background = 'var(--card2)';
        }
    }

    renderCircumferenceChart(partKey);
}

function renderCircumferenceChart(partKey) {
    const box = document.getElementById('circumferenceTrendChart');
    if (!box) return;

    // Collect measurements over time
    const data = [];
    for (let c of D.checks) {
        if (c.measurements && c.measurements[partKey] != null) {
            data.push({ d: c.d, val: Number(c.measurements[partKey]) });
        }
    }

    const cur = getLatestMeasurement(partKey);
    if (data.length === 0) {
        data.push({ d: cur.date, val: Number(cur.val) });
    }

    if (data.length < 2) {
        // Render 1 point or guide
        box.innerHTML = `
            <div style="background:var(--card2); border-radius:12px; padding:20px; text-align:center;">
                <div style="font-size:24px; font-weight:900; color:#00c070; margin-bottom:4px;">${(+cur.val).toFixed(1)} ซม.</div>
                <div style="font-size:12.5px; color:var(--dim);">
                    บันทึกสัดส่วนสัปดาห์ละ 1 ครั้ง เพื่อเริ่มแสดงกราฟเปรียบเทียบการเปลี่ยนแปลง
                </div>
            </div>`;
        return;
    }

    // Render multi-point trend SVG
    const Wd = 300, H = 100;
    const vals = data.map(x => x.val);
    const mx = Math.max(...vals) + 2;
    const mn = Math.max(0, Math.min(...vals) - 2);

    const pts = data.map((x, i) => [
        (i / (data.length - 1)) * Wd,
        H - ((x.val - mn) / Math.max(1, (mx - mn))) * H
    ]);

    const dateLabels = data.map((x, i) => {
        const parts = x.d.split('-');
        const label = `${parts[2]}/${parts[1]}`;
        const xPos = (i / (data.length - 1)) * Wd;
        return `<text x="${xPos}" y="${H + 18}" fill="var(--dim)" font-size="9" text-anchor="middle" font-weight="600">${label}</text>`;
    }).join('');

    const valBadges = pts.map((p, i) => {
        return `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#00c070" stroke="#ffffff" stroke-width="2"/>
                <text x="${p[0]}" y="${p[1] - 8}" fill="#00c070" font-size="10" font-weight="800" text-anchor="middle">${data[i].val}</text>`;
    }).join('');

    box.innerHTML = `
        <svg viewBox="-8 -16 ${Wd + 16} ${H + 36}" style="width:100%; overflow:visible;">
            <line x1="0" y1="${H}" x2="${Wd}" y2="${H}" stroke="var(--line)" stroke-width="1"/>
            <polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#00c070" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            ${valBadges}
            ${dateLabels}
        </svg>
    `;
}

/* ============ TAPE MEASURE RULER MODAL (v3.5) ============ */
function openMeasureTapeModal(partKey) {
    if (partKey) window._selectedMeasurePart = partKey;
    const pk = window._selectedMeasurePart || 'waist';
    const info = MEASURE_PARTS[pk];
    const latest = getLatestMeasurement(pk);

    window._tapeCurrentValue = Number(latest.val) || info.defVal;
    window._tapeCurrentUnit = 'cm';

    const titleEl = document.getElementById('tapeMetricTitle');
    if (titleEl) titleEl.textContent = info.name;

    updateTapeDisplay();
    renderTapeRulerTicks();

    const sheet = document.getElementById('wmMeasureTapeSheet');
    if (sheet) sheet.style.display = 'flex';
}

function closeMeasureTapeModal() {
    const sheet = document.getElementById('wmMeasureTapeSheet');
    if (sheet) sheet.style.display = 'none';
}

function updateTapeDisplay() {
    const valEl = document.getElementById('tapeValueDisplay');
    const unitEl = document.getElementById('tapeUnitDisplay');
    if (!valEl) return;

    if (window._tapeCurrentUnit === 'in') {
        const valInches = (window._tapeCurrentValue / 2.54).toFixed(1);
        valEl.textContent = valInches;
        if (unitEl) unitEl.textContent = 'in';
    } else {
        valEl.textContent = window._tapeCurrentValue.toFixed(1);
        if (unitEl) unitEl.textContent = 'cm';
    }
}

function switchTapeUnit(unit) {
    window._tapeCurrentUnit = unit;
    const btnCm = document.getElementById('tapeUnitCm');
    const btnIn = document.getElementById('tapeUnitIn');
    if (unit === 'in') {
        if (btnIn) { btnIn.style.background = '#10b981'; btnIn.style.color = '#fff'; }
        if (btnCm) { btnCm.style.background = 'transparent'; btnCm.style.color = 'var(--dim)'; }
    } else {
        if (btnCm) { btnCm.style.background = '#10b981'; btnCm.style.color = '#fff'; }
        if (btnIn) { btnIn.style.background = 'transparent'; btnIn.style.color = 'var(--dim)'; }
    }
    updateTapeDisplay();
}

function adjustTapeValue(delta) {
    const pk = window._selectedMeasurePart || 'waist';
    const info = MEASURE_PARTS[pk];
    window._tapeCurrentValue = Math.max(info.min, Math.min(info.max, Math.round((window._tapeCurrentValue + delta) * 10) / 10));
    updateTapeDisplay();
    renderTapeRulerTicks();
}

function renderTapeRulerTicks() {
    const container = document.getElementById('wmRulerTicks');
    if (!container) return;

    const cur = window._tapeCurrentValue;
    const start = Math.floor(cur - 15);
    const end = Math.ceil(cur + 15);

    let html = '';
    for (let v = start; v <= end; v += 0.5) {
        const isMajor = (v % 10 === 0);
        const isMid = (v % 5 === 0 && !isMajor);
        const isOne = (v % 1 === 0 && !isMid && !isMajor);

        let h = 18;
        if (isMajor) h = 42;
        else if (isMid) h = 28;
        else if (isOne) h = 22;

        html += `
            <div style="display:flex; flex-direction:column; align-items:center; width:14px; flex-shrink:0;">
                ${isMajor ? `<span style="font-size:10px; font-weight:800; color:var(--dim); margin-bottom:4px;">${v}</span>` : ''}
                <div style="width:${isMajor ? '2px' : '1px'}; height:${h}px; background:${isMajor ? 'var(--tx)' : 'var(--line)'};"></div>
            </div>`;
    }
    container.innerHTML = html;
}

function saveBodyCircumference() {
    const pk = window._selectedMeasurePart || 'waist';
    const val = Number(window._tapeCurrentValue);
    const todayStr = iso();

    let rec = D.checks.find(x => x.d === todayStr);
    if (!rec) {
        const prev = D.checks[D.checks.length - 1];
        rec = {
            d: todayStr,
            w: prev?.w || 78.0,
            bf: prev?.bf || null,
            muscle: prev?.muscle || null,
            hrv: null, pain: null,
            cal: 0, protein: 0, carbs: 0, fat: 0, water: 0, meals: [],
            measurements: {}
        };
        D.checks.push(rec);
    }
    if (!rec.measurements) rec.measurements = {};
    rec.measurements[pk] = val;

    const store = ensureMeasurementsStore();
    store[pk] = val;
    store.lastMeasuredDate = todayStr;

    save();
    render();
    if (typeof pushToCloud === 'function') pushToCloud();

    closeMeasureTapeModal();
    selectMeasurePart(pk);
    updateWeeklyCadenceStatus();

    const info = MEASURE_PARTS[pk];
    if (typeof fcAlert === 'function') {
        fcAlert(`✓ บันทึกขนาด${info.name} ${val.toFixed(1)} ซม. ประจำสัปดาห์เรียบร้อยแล้ว!`);
    }
}

/* ============ BODY SETTINGS MODAL ============ */
function openBodySettingsModal() {
    const sheet = document.getElementById('wmBodySettingsSheet');
    if (!sheet) return;

    if (!D.cfg) D.cfg = {};
    const weightRem = (D.cfg.weightReminder !== false);
    const measRem = (D.cfg.measureReminder !== false);

    const wCb = document.getElementById('cfgWeightReminder');
    const mCb = document.getElementById('cfgMeasureReminder');
    if (wCb) wCb.checked = weightRem;
    if (mCb) mCb.checked = measRem;

    if (typeof updatePushStatusUI === 'function') updatePushStatusUI();

    sheet.style.display = 'flex';
}

function closeBodySettingsModal() {
    const sheet = document.getElementById('wmBodySettingsSheet');
    if (sheet) sheet.style.display = 'none';
}

function toggleBodySetting(key, enabled) {
    if (!D.cfg) D.cfg = {};
    D.cfg[key] = enabled;
    save();
}

function setBodyUnit(type, unit) {
    if (!D.cfg) D.cfg = {};
    if (type === 'weight') {
        D.cfg.weightUnit = unit;
        const bKg = document.getElementById('cfgUnitKg');
        const bLbs = document.getElementById('cfgUnitLbs');
        if (unit === 'kg') {
            if (bKg) { bKg.style.background = '#10b981'; bKg.style.color = '#fff'; }
            if (bLbs) { bLbs.style.background = 'transparent'; bLbs.style.color = 'var(--dim)'; }
        } else {
            if (bLbs) { bLbs.style.background = '#10b981'; bLbs.style.color = '#fff'; }
            if (bKg) { bKg.style.background = 'transparent'; bKg.style.color = 'var(--dim)'; }
        }
    } else {
        D.cfg.lengthUnit = unit;
        const bCm = document.getElementById('cfgUnitCm');
        const bFt = document.getElementById('cfgUnitFt');
        if (unit === 'cm') {
            if (bCm) { bCm.style.background = '#10b981'; bCm.style.color = '#fff'; }
            if (bFt) { bFt.style.background = 'transparent'; bFt.style.color = 'var(--dim)'; }
        } else {
            if (bFt) { bFt.style.background = '#10b981'; bFt.style.color = '#fff'; }
            if (bCm) { bCm.style.background = 'transparent'; bCm.style.color = 'var(--dim)'; }
        }
    }
    save();
    render();
}

/* ============ WEIGHT INSIGHT MODAL ============ */
function openWeightInsightModal() {
    const m = document.getElementById('wmWeightInsightModal');
    if (m) m.style.display = 'flex';
}

function closeWeightInsightModal() {
    const m = document.getElementById('wmWeightInsightModal');
    if (m) m.style.display = 'none';
}

/* ============ EDIT START & TARGET WEIGHT ============ */
async function promptEditStartWeight() {
    const cur = D.cfg.startWeight || (D.checks[0]?.w || 78.0);
    const val = await fcPrompt('ระบุน้ำหนักเริ่มต้น (กก.):', String(cur), '🎯 แก้ไขน้ำหนักเริ่มต้น');
    if (val === null) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 30 && num < 250) {
        D.cfg.startWeight = num;
        save();
        render();
        if (typeof pushToCloud === 'function') pushToCloud();
    }
}

async function promptEditTargetWeight() {
    const cur = D.cfg.targetWeight || 70.0;
    const val = await fcPrompt('ระบุน้ำหนักเป้าหมาย (กก.):', String(cur), '🎯 แก้ไขน้ำหนักเป้าหมาย');
    if (val === null) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 30 && num < 250) {
        D.cfg.targetWeight = num;
        save();
        render();
        if (typeof pushToCloud === 'function') pushToCloud();
    }
}

/* ============ WEIGHT FILTER SWITCHER ============ */
function setWeightChartFilter(period) {
    window._weightChartFilter = period;
    ['Week', 'Month', 'Quarter'].forEach(p => {
        const btn = document.getElementById('btnFilter' + p);
        if (btn) {
            if (p.toLowerCase() === period) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
    if (typeof charts === 'function') charts();
}

/* ============ SYNC UI HOOK FOR WISEMEAL STATS ============ */
function updateWiseMealStatsHeader() {
    const latest = (D.checks && D.checks.length > 0) ? D.checks[D.checks.length - 1] : { w: 78.0 };
    const curW = latest?.w != null ? latest.w : 78.0;
    const startW = D.cfg?.startWeight || (D.checks[0]?.w || 78.0);
    const targetW = D.cfg?.targetWeight || 70.0;

    const elCur = document.getElementById('wmCurrentWeight');
    const elStart = document.getElementById('wmStartWeightVal');
    const elTarget = document.getElementById('wmTargetWeightVal');
    const elChartTarget = document.getElementById('wmChartTargetWeightVal');
    const elAvg = document.getElementById('wmAvgWeightVal');

    if (elCur) elCur.textContent = (+curW).toFixed(1);
    if (elStart) elStart.textContent = (+startW).toFixed(1);
    if (elTarget) elTarget.textContent = (+targetW).toFixed(1);
    if (elChartTarget) elChartTarget.textContent = `${(+targetW).toFixed(1)} kg`;

    if (elAvg && D.checks && D.checks.length > 0) {
        const last7 = D.checks.filter(x => x.w).slice(-7);
        const avg = last7.reduce((a, b) => a + Number(b.w), 0) / Math.max(1, last7.length);
        elAvg.textContent = `${avg.toFixed(1)} kg`;
    }
}

/* ============ MEASUREMENT HISTORY MODAL ============ */
async function openMeasureHistoryModal() {
    const pk = window._selectedMeasurePart || 'waist';
    const info = MEASURE_PARTS[pk];
    
    // Find all checks that have measurements for this part
    const history = [];
    (D.checks || []).forEach(c => {
        if (c.measurements && c.measurements[pk] != null) {
            history.push({ d: c.d, val: c.measurements[pk] });
        }
    });
    history.sort((a, b) => b.d.localeCompare(a.d));

    let listHtml = '';
    if (history.length === 0) {
        listHtml = '<div class="sub" style="text-align:center;padding:16px;">ยังไม่มีประวัติการบันทึกสัดส่วนนี้</div>';
    } else {
        listHtml = history.map(h => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line);">
                <div>
                    <div style="font-weight:700; font-size:13.5px; color:var(--tx);">${h.d}</div>
                    <div style="font-size:12px; color:var(--dim); margin-top:2px;">${info.name}: <b style="color:#10b981;">${(+h.val).toFixed(1)} ซม.</b></div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn sm g" onclick="editSpecificMeasurement('${pk}', '${h.d}', ${h.val})" style="font-size:11px; padding:4px 8px; border-radius:6px;">✏️ แก้ไข</button>
                    <button class="btn sm g" onclick="deleteSpecificMeasurement('${pk}', '${h.d}')" style="font-size:11px; padding:4px 8px; border-radius:6px; color:var(--red);">🗑️ ลบ</button>
                </div>
            </div>
        `).join('');
    }

    const html = `
        <div style="text-align:left;">
            <div style="font-size:12.5px; color:var(--dim); margin-bottom:10px;">รายการประวัติการวัด <b>${info.name}</b> ย้อนหลัง</div>
            <div style="max-height:260px; overflow-y:auto;">
                ${listHtml}
            </div>
        </div>
    `;

    fcConfirm(html, `📋 ประวัติ ${info.name}`);
}

async function editSpecificMeasurement(partKey, dateStr, currentVal) {
    fcClose();
    const info = MEASURE_PARTS[partKey];
    const newVal = await fcPrompt(`แก้ไขขนาด ${info.name} ของวันที่ ${dateStr} (ซม.):`, String(currentVal), '✏️ แก้ไขข้อมูล');
    if (newVal === null) return;
    const num = parseFloat(newVal);
    if (!isNaN(num) && num >= info.min && num <= info.max) {
        const rec = D.checks.find(x => x.d === dateStr);
        if (rec) {
            if (!rec.measurements) rec.measurements = {};
            rec.measurements[partKey] = num;
            save();
            render();
            if (typeof pushToCloud === 'function') pushToCloud();
            selectMeasurePart(partKey);
            setTimeout(() => fcAlert(`✓ แก้ไขขนาด ${info.name} เป็น ${num.toFixed(1)} ซม. เรียบร้อยแล้ว`), 200);
        }
    }
}

async function deleteSpecificMeasurement(partKey, dateStr) {
    fcClose();
    const info = MEASURE_PARTS[partKey];
    const confirmed = await fcConfirm(`ต้องการลบข้อมูล ${info.name} ของวันที่ ${dateStr} ใช่หรือไม่?`, '🗑️ ยืนยันการลบ');
    if (!confirmed) return;

    const rec = D.checks.find(x => x.d === dateStr);
    if (rec && rec.measurements) {
        delete rec.measurements[partKey];
        save();
        render();
        if (typeof pushToCloud === 'function') pushToCloud();
        selectMeasurePart(partKey);
        setTimeout(() => fcAlert(`✓ ลบข้อมูลเรียบร้อยแล้ว`), 200);
    }
}
