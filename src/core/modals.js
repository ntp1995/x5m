/* FitCoach v3.0 — Core Modals & App Version */
const APP_VERSION = '3.0.0';

/* ============ CUSTOM MODALS ============ */
let _fcRes = null;
function fcShow(type, title, desc, defVal) {
    return new Promise(resolve => {
        _fcRes = resolve;
        const m = document.getElementById('fcModal');
        document.getElementById('fcTitle').innerHTML = title;
        document.getElementById('fcDesc').innerHTML = desc || '';
        const b = document.getElementById('fcModalBody');
        if (b) b.scrollTop = 0;
        document.getElementById('fcInputContainer').style.display = type === 'prompt' ? 'block' : 'none';
        document.getElementById('fcCancel').style.display = type === 'alert' ? 'none' : 'block';
        const inp = document.getElementById('fcInput');
        if (type === 'prompt') {
            inp.value = defVal || '';
            setTimeout(() => { inp.focus(); inp.select(); }, 100);
        }
        m.classList.add('on');
    });
}
function fcClose(val) {
    document.getElementById('fcModal').classList.remove('on');
    const okBtn = document.getElementById('fcOk');
    const cancelBtn = document.getElementById('fcCancel');
    const actionsEl = document.querySelector('.fc-modal-actions');
    if (actionsEl) actionsEl.style.display = 'flex';
    if (okBtn) { okBtn.style.display = 'block'; okBtn.textContent = 'ตกลง'; }
    if (cancelBtn) cancelBtn.textContent = 'ยกเลิก';
    // DO NOT clear fcDesc.innerHTML here: async callers need to read input values after fcConfirm resolves
    if (_fcRes) _fcRes(val);
    _fcRes = null;
}
document.getElementById('fcCancel').onclick = () => fcClose(null);
document.getElementById('fcOk').onclick = () => {
    const isP = document.getElementById('fcInputContainer').style.display !== 'none';
    fcClose(isP ? document.getElementById('fcInput').value : true);
};
document.getElementById('fcInput').onkeyup = (e) => { if (e.key === 'Enter') document.getElementById('fcOk').click(); };
function fcShowChoiceModal(title, desc, choices) {
    return new Promise(resolve => {
        _fcRes = resolve;
        const m = document.getElementById('fcModal');
        document.getElementById('fcTitle').innerHTML = title;
        
        let choicesHtml = `<div style="font-size:14px;color:var(--dim);margin-bottom:12px;line-height:1.5;">${desc}</div><div style="display:grid;gap:9px;margin-top:10px;">`;
        choices.forEach(c => {
            choicesHtml += `<button type="button" class="btn" onclick="fcClose('${c.id}')" style="text-align:left;padding:12px 14px;background:var(--card2);border:1px solid var(--line);border-radius:12px;color:var(--tx);line-height:1.4;">
                <div style="font-weight:800;font-size:15px;color:var(--tx);">${c.label}</div>
                ${c.sub ? `<div style="font-size:12px;color:var(--dim);margin-top:3px;">${c.sub}</div>` : ''}
            </button>`;
        });
        choicesHtml += `</div>`;
        
        document.getElementById('fcDesc').innerHTML = choicesHtml;
        document.getElementById('fcInputContainer').style.display = 'none';
        document.getElementById('fcOk').style.display = 'none';
        document.getElementById('fcCancel').style.display = 'block';
        document.getElementById('fcCancel').textContent = 'ข้ามการประเมิน';
        m.classList.add('on');
    });
}
window.fcAlert = (desc, title) => fcShow('alert', title || 'แจ้งเตือน', desc);
window.fcConfirm = (desc, titleOrCallback, maybeTitle) => {
    if (typeof titleOrCallback === 'function') {
        return fcShow('confirm', maybeTitle || 'ยืนยันการดำเนินการ', desc).then(ok => {
            if (ok) titleOrCallback();
            return ok;
        });
    }
    return fcShow('confirm', titleOrCallback || 'ยืนยันการดำเนินการ', desc);
};
window.fcPrompt = (desc, defVal, title) => fcShow('prompt', title || 'ระบุข้อมูล', desc, defVal);
window.fcChoice = (title, desc, choices) => fcShowChoiceModal(title, desc, choices);

async function calcBMR(titleOverride, isSilent, isProgramSetup = false) {
    const lastCheck = D.checks[D.checks.length - 1] || {};
    const lastW = lastCheck.w || 77.3;
    const bio = D.cfg.biometrics || {};
    const saved = D.cfg.bmrInfo || {};

    const curW = lastW;
    const curH = bio.height || saved.height || 168;
    const curAge = bio.age || saved.age || 31;
    const curGender = bio.gender || saved.gender || 'M';
    const curBF = bio.bf || lastCheck.bf || 25.9;
    const curMuscle = bio.muscle || 54.3;
    const curVisceral = bio.visceral || 11;
    const curWater = bio.water || 50.7;
    const curBone = bio.bone || 2.91;
    const curRHR = bio.rhr || 45;
    const curVO2 = bio.vo2max || 45;
    const curHRV = bio.hrv || 73;
    const curBMRCustom = bio.bmrCustom || 1630;
    const targetW = D.cfg.targetWeight || 68.0;
    const courseWeeks = D.cfg.courseWeeks || 20;
    const curGoalType = saved.goalType || 'recomp';
    const curWorkType = D.cfg.workType || saved.workType || 'light';
    const curExerciseType = D.cfg.exerciseType || saved.exerciseType || 'moderate';
    const curStepTarget = D.cfg.stepTarget || saved.stepTarget || 8000;
    const workFactors = { sedentary: 1.15, light: 1.28, active: 1.42 };
    const exerciseFactors = { none: 0.0, light: 0.12, moderate: 0.25, heavy: 0.35 };
    const curAct = (workFactors[curWorkType] || 1.28) + (exerciseFactors[curExerciseType] || 0.25);

    const html = `
    <div style="text-align:left; font-size:13.5px; line-height:1.5;">
        <div style="background:rgba(27,89,248,0.08); padding:10px 14px; border-radius:12px; margin-bottom:14px; border-left:4px solid var(--acc);">
            <div style="font-weight:bold; color:var(--acc); font-size:14px;">🎯 ตั้งค่าโปรแกรม & แผนสรีระส่วนตัว</div>
            <div style="font-size:12px; color:var(--dim); margin-top:2px;">กรอกข้อมูลร่างกายเพื่อคำนวณ BMR, TDEE, แคลอรี่ และจัดแผนลดน้ำหนักอัตโนมัติ</div>
        </div>

        <!-- หมวด 1: ข้อมูลร่างกาย -->
        <div style="font-weight:bold; color:var(--tx); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
            <span>🧍‍♂️ ข้อมูลสรีระและสุขภาพล่าสุด</span>
        </div>
        <div style="display:flex; gap:8px;">
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">เพศ</label>
                <select id="bmrGender" onchange="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
                    <option value="M" ${curGender === 'M' ? 'selected' : ''}>ชาย</option>
                    <option value="F" ${curGender === 'F' ? 'selected' : ''}>หญิง</option>
                </select>
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">อายุ (ปี)</label>
                <input type="number" id="bmrAge" value="${curAge}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">ส่วนสูง (ซม.)</label>
                <input type="number" id="bmrHeight" value="${curH}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:8px;">
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">น้ำหนักปัจจุบัน (กก.)</label>
                <input type="number" step="0.1" id="bmrWeight" value="${curW}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px; font-weight:bold;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">ไขมันร่างกาย (%BF)</label>
                <input type="number" step="0.1" id="bmrBF" value="${curBF}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">มวลกล้ามเนื้อ (กก.)</label>
                <input type="number" step="0.1" id="bmrMuscle" value="${curMuscle}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:8px;">
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">BMR เครื่องชั่ง (kcal)</label>
                <input type="number" id="bmrCustom" value="${curBMRCustom}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">ไขมันช่องท้อง</label>
                <input type="number" id="bmrVisceral" value="${curVisceral}" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">ชีพจรพัก (RHR bpm)</label>
                <input type="number" id="bmrRHR" value="${curRHR}" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:8px;">
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">VO2 Max</label>
                <input type="number" id="bmrVO2" value="${curVO2}" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
            <div style="flex:1;">
                <label style="font-size:12px; color:var(--dim);">HRV เฉลี่ย (ms)</label>
                <input type="number" id="bmrHRV" value="${curHRV}" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
            </div>
        </div>

        <!-- หมวด 2: เป้าหมาย & คอร์ส -->
        <div style="margin-top:14px; border-top:1px solid var(--line); padding-top:10px;">
            <div style="font-weight:bold; color:var(--tx); margin-bottom:6px;">🎯 วางแผนเป้าหมาย & ระยะเวลาคอร์ส</div>
            <div style="display:flex; gap:8px;">
                <div style="flex:1;">
                    <label style="font-size:12px; color:var(--dim); font-weight:bold;">น้ำหนักเป้าหมาย (กก.)</label>
                    <input type="number" step="0.5" id="bmrTargetW" value="${targetW}" oninput="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--acc); color:var(--acc); font-size:15px; font-weight:bold;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px; color:var(--dim); font-weight:bold;">ระยะเวลาคอร์ส</label>
                    <select id="bmrWeeks" onchange="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px; font-weight:bold;">
                        <option value="20" ${courseWeeks == 20 ? 'selected' : ''}>20 สัปดาห์ (~5 เดือน สำหรับเที่ยว)</option>
                        <option value="16" ${courseWeeks == 16 ? 'selected' : ''}>16 สัปดาห์ (~4 เดือน)</option>
                        <option value="12" ${courseWeeks == 12 ? 'selected' : ''}>12 สัปดาห์ (~3 เดือน)</option>
                        <option value="8" ${courseWeeks == 8 ? 'selected' : ''}>8 สัปดาห์ (~2 เดือน สปีด)</option>
                        <option value="22" ${courseWeeks == 22 ? 'selected' : ''}>22 สัปดาห์ (โปรแกรมเต็ม)</option>
                    </select>
                </div>
            </div>

            <div style="margin-top:8px;">
                <label style="font-size:12px; color:var(--dim);">เป้าหมายหลัก</label>
                <select id="bmrGoalType" onchange="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px;">
                    <option value="recomp" ${curGoalType === 'recomp' ? 'selected' : ''}>ลดไขมันรักษากล้ามเนื้อ (Body Recomposition) — แนะนำ</option>
                    <option value="fatloss" ${curGoalType === 'fatloss' ? 'selected' : ''}>เน้นลดไขมัน/น้ำหนักเร็ว (Fat Loss Cut)</option>
                    <option value="slowcut" ${curGoalType === 'slowcut' ? 'selected' : ''}>ลดไขมันช้าๆ สบายๆ ไม่เครียด (Slow Cut)</option>
                    <option value="maintain" ${curGoalType === 'maintain' ? 'selected' : ''}>รักษาน้ำหนักและกล้ามเนื้อเดิม (Maintain)</option>
                    <option value="bulk" ${curGoalType === 'bulk' ? 'selected' : ''}>เพิ่มกล้ามเนื้อ (Lean Bulk)</option>
                </select>
            </div>

            <!-- ช่องที่ 1: ลักษณะงาน & กิจวัตรประจำวัน (Occupational NEAT) -->
            <div style="margin-top:10px;">
                <label style="font-size:12px; color:var(--dim); font-weight:700;">1. ลักษณะงาน & กิจวัตรประจำวัน (Occupational NEAT)</label>
                <select id="bmrWorkType" onchange="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:13.5px;">
                    <option value="sedentary" ${curWorkType === 'sedentary' ? 'selected' : ''}>🪑 นั่งโต๊ะทำงานเป็นหลัก / ขับรถ (Sedentary Desk Job)</option>
                    <option value="light" ${curWorkType === 'light' ? 'selected' : ''}>👮 เดินตรวจตรา / ยืนบ่อย / กึ่งลงพื้นที่ (Lightly Active - เช่น งานตำรวจ, เดินตรวจเวร)</option>
                    <option value="active" ${curWorkType === 'active' ? 'selected' : ''}>🏃 ใช้แรงงานหนัก / ลงพื้นที่ภาคสนามตลอดวัน (Highly Active Fieldwork)</option>
                </select>
            </div>

            <!-- ช่องที่ 2: การออกกำลังกาย (Structured Exercise / EAT) -->
            <div style="margin-top:10px;">
                <label style="font-size:12px; color:var(--dim); font-weight:700;">2. การออกกำลังกายแบบมีโครงสร้าง (Structured Exercise / EAT)</label>
                <select id="bmrExerciseType" onchange="window.updateBmrPreview()" style="width:100%; margin-top:3px; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:13.5px;">
                    <option value="moderate" ${curExerciseType === 'moderate' ? 'selected' : ''}>🏋️ ออกกำลังกาย 3-5 วัน/สัปดาห์ (ตามโปรแกรม FitCoach เวท + เดินลู่)</option>
                    <option value="light" ${curExerciseType === 'light' ? 'selected' : ''}>🧘 เวทเทรนนิ่งเบาๆ 1-3 วัน/สัปดาห์</option>
                    <option value="heavy" ${curExerciseType === 'heavy' ? 'selected' : ''}>🔥 ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (เวทหนัก + คาร์ดิโอทุกวัน)</option>
                    <option value="none" ${curExerciseType === 'none' ? 'selected' : ''}>🛋️ ไม่ออกกำลังกายเลย</option>
                </select>
            </div>

            <!-- ช่องที่ 3: เป้าหมายก้าวเดินเฉลี่ยต่อวัน -->
            <div style="margin-top:10px;">
                <label style="font-size:12px; color:var(--dim); font-weight:700;">3. เป้าหมายก้าวเดินเฉลี่ยต่อวัน (Step Count Goal / NEAT)</label>
                <div style="display:flex; align-items:center; gap:8px; margin-top:3px;">
                    <input type="number" step="500" min="2000" max="30000" id="bmrStepTarget" value="${curStepTarget}" oninput="window.updateBmrPreview()" style="flex:1; padding:8px 10px; border-radius:8px; background:var(--bg); border:1px solid var(--line); color:var(--tx); font-size:14px; font-weight:bold;">
                    <span style="font-size:13px; color:var(--dim); font-weight:600;">ก้าว/วัน</span>
                </div>
                <div style="font-size:11px; color:var(--dim); margin-top:3px;">💡 การเดิน 8,000 - 10,000 ก้าว ช่วยเพิ่มการเผาผลาญ (NEAT) ได้ 200 - 350 kcal/วัน</div>
            </div>
        </div>

        <!-- หมวด 3: กล่องพรีวิวผลการคำนวณสด -->
        <div style="margin-top:12px;">
            <div id="bmrPreviewBox"></div>
        </div>
    </div>`;

    // Function to update preview live inside modal
    window.updateBmrPreview = function() {
        const w = parseFloat(document.getElementById('bmrWeight')?.value) || 77.3;
        const h = parseFloat(document.getElementById('bmrHeight')?.value) || 168;
        const age = parseInt(document.getElementById('bmrAge')?.value) || 31;
        const gender = document.getElementById('bmrGender')?.value || 'M';
        const targetW = parseFloat(document.getElementById('bmrTargetW')?.value) || 68.0;
        const weeks = parseInt(document.getElementById('bmrWeeks')?.value) || 20;
        const customBmr = parseFloat(document.getElementById('bmrCustom')?.value) || 0;
        const gType = document.getElementById('bmrGoalType')?.value || 'recomp';

        const workType = document.getElementById('bmrWorkType')?.value || 'light';
        const exerciseType = document.getElementById('bmrExerciseType')?.value || 'moderate';
        const stepTarget = parseInt(document.getElementById('bmrStepTarget')?.value) || 8000;
        const act = (workFactors[workType] || 1.28) + (exerciseFactors[exerciseType] || 0.25);

        let bmr = customBmr > 1000 ? customBmr : (10 * w + 6.25 * h - 5 * age + (gender === 'M' ? 5 : -161));
        let tdee = bmr * act;
        let diff = Math.max(0, w - targetW);
        let lossPerWk = weeks > 0 ? (diff / weeks) : 0;
        let lossPerMonth = lossPerWk * 4.33;

        let deficitNeeded = Math.round((lossPerWk * 7700) / 7);
        if (gType === 'maintain') deficitNeeded = 0;
        else if (gType === 'bulk') deficitNeeded = -300;
        else if (gType === 'slowcut') deficitNeeded = Math.min(deficitNeeded, 350);

        let calTgt = Math.max(1200, Math.round(tdee - deficitNeeded));
        let proMultiplier = gType === 'maintain' ? 1.8 : 2.0;
        let proTgt = Math.round(w * proMultiplier);
        let waterTgt = Math.round((w * 35) / 50) * 50;

        const previewEl = document.getElementById('bmrPreviewBox');
        if (previewEl) {
            let safeStatus = lossPerWk <= 0.65 
                ? '<span style="color:var(--ok);font-weight:bold;">✓ ปลอดภัยสูงสุด ลีนไขมันรักษากล้ามเนื้อ</span>' 
                : (lossPerWk <= 0.9 ? '<span style="color:var(--warn);font-weight:bold;">⚡ อัตราเร่งปานกลาง ควรทานโปรตีนให้ครบ</span>' : '<span style="color:var(--red);font-weight:bold;">⚠ อัตราลดสูง อาจเสี่ยงสูญเสียมวลกล้ามเนื้อ</span>');

            previewEl.innerHTML = `
                <div style="background:var(--card2); border-radius:12px; padding:12px; border:1px solid var(--line); font-size:13px; line-height:1.6;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--dim);">เป้าหมายน้ำหนัก:</span>
                        <b style="color:var(--acc);">${w.toFixed(1)} กก. → ${targetW.toFixed(1)} กก. (ลด ${diff.toFixed(1)} กก.)</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--dim);">ระยะเวลา & อัตราลด:</span>
                        <b>${weeks} สัปดาห์ • <span style="color:var(--acc);">${lossPerWk.toFixed(2)} กก./สัปดาห์</span> (~${lossPerMonth.toFixed(1)} กก./เดือน)</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--dim);">การประเมิน:</span>
                        <span>${safeStatus}</span>
                    </div>
                    <div style="border-top:1px dashed var(--line); margin:6px 0;"></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--dim);">BMR / TDEE:</span>
                        <span><b>${Math.round(bmr)}</b> / <b style="color:var(--acc);">${Math.round(tdee)}</b> kcal (ตัวคูณ ${act.toFixed(2)})</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:11.5px;">
                        <span style="color:var(--dim);">กิจกรรม & ก้าวเดิน:</span>
                        <span style="color:var(--tx);">${workType === 'light' ? 'เดินตรวจ/ยืนบ่อย' : (workType === 'sedentary' ? 'นั่งโต๊ะ' : 'ใช้แรงงาน')} + ${exerciseType === 'moderate' ? 'FitCoach 3-5 วัน' : (exerciseType === 'light' ? 'เวท 1-3 วัน' : (exerciseType === 'heavy' ? 'ออกกำลังหนัก' : 'ไม่ออกกำลัง'))} • 👟 ${stepTarget.toLocaleString()} ก้าว</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="color:var(--dim);">เป้าหมายพลังงาน:</span>
                        <b style="color:var(--acc); font-size:14px;">${calTgt} kcal/วัน</b>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--dim);">เป้าหมายโปรตีน & น้ำ:</span>
                        <b style="color:var(--acc); font-size:14px;">${proTgt} g/วัน • น้ำ ${waterTgt.toLocaleString()} มล. (~${(waterTgt/1000).toFixed(1)}L)</b>
                    </div>
                </div>
            `;
        }
    };

    setTimeout(() => { if (typeof window.updateBmrPreview === 'function') window.updateBmrPreview(); }, 80);

    const confirmed = await fcConfirm(html, titleOverride || '⚡ คำนวณเป้าหมายและจัดโปรแกรมใหม่');
    if (!confirmed) return null;

    // Extract values
    const gender = document.getElementById('bmrGender')?.value || curGender;
    const age = parseInt(document.getElementById('bmrAge')?.value) || curAge;
    const h = parseInt(document.getElementById('bmrHeight')?.value) || curH;
    const w = parseFloat(document.getElementById('bmrWeight')?.value) || curW;
    const targetWVal = parseFloat(document.getElementById('bmrTargetW')?.value) || targetW;
    const weeksVal = parseInt(document.getElementById('bmrWeeks')?.value) || courseWeeks;
    const workType = document.getElementById('bmrWorkType')?.value || curWorkType;
    const exerciseType = document.getElementById('bmrExerciseType')?.value || curExerciseType;
    const stepTarget = parseInt(document.getElementById('bmrStepTarget')?.value) || curStepTarget;
    const act = (workFactors[workType] || 1.28) + (exerciseFactors[exerciseType] || 0.25);
    const goalType = document.getElementById('bmrGoalType')?.value || curGoalType;
    const bfVal = parseFloat(document.getElementById('bmrBF')?.value) || curBF;
    const muscleVal = parseFloat(document.getElementById('bmrMuscle')?.value) || curMuscle;
    const customBmrVal = parseFloat(document.getElementById('bmrCustom')?.value) || curBMRCustom;
    const visceralVal = parseInt(document.getElementById('bmrVisceral')?.value) || curVisceral;
    const rhrVal = parseInt(document.getElementById('bmrRHR')?.value) || curRHR;
    const vo2Val = parseInt(document.getElementById('bmrVO2')?.value) || curVO2;
    const hrvVal = parseInt(document.getElementById('bmrHRV')?.value) || curHRV;

    // Calculations
    let bmr = customBmrVal > 1000 ? customBmrVal : (10 * w + 6.25 * h - 5 * age + (gender === 'M' ? 5 : -161));
    let tdee = bmr * act;
    let diff = Math.max(0, w - targetWVal);
    let lossPerWk = weeksVal > 0 ? (diff / weeksVal) : 0;
    let lossPerMonth = lossPerWk * 4.33;

    let deficitNeeded = Math.round((lossPerWk * 7700) / 7);
    if (goalType === 'maintain') deficitNeeded = 0;
    else if (goalType === 'bulk') deficitNeeded = -300;
    else if (goalType === 'slowcut') deficitNeeded = Math.min(deficitNeeded, 350);

    let targetCal = Math.max(1200, Math.round(tdee - deficitNeeded));
    let proMultiplier = goalType === 'maintain' ? 1.8 : 2.0;
    let targetPro = Math.round(w * proMultiplier);
    let targetWater = Math.round((w * 35) / 50) * 50;

    // Save to D.cfg
    D.cfg.courseWeeks = weeksVal;
    D.cfg.targetWeight = targetWVal;
    D.cfg.calTarget = targetCal;
    D.cfg.proteinTarget = targetPro;
    D.cfg.waterTarget = targetWater;
    D.cfg.lossPerWk = lossPerWk;
    D.cfg.lossPerMonth = lossPerMonth;
    D.cfg.workType = workType;
    D.cfg.exerciseType = exerciseType;
    D.cfg.stepTarget = stepTarget;
    D.cfg.bmrInfo = { gender, age, height: h, workType, exerciseType, stepTarget, activity: act, goalType };
    D.cfg.biometrics = { 
        gender, age, height: h, bf: bfVal, muscle: muscleVal, 
        visceral: visceralVal, rhr: rhrVal, vo2max: vo2Val, hrv: hrvVal, 
        bmrCustom: customBmrVal 
    };

    const targetFat = Math.round((targetCal * 0.25) / 9);
    const targetCarbs = Math.max(50, Math.round((targetCal - (targetPro * 4) - (targetFat * 9)) / 4));

    D.cfg.fatTarget = targetFat;
    D.cfg.carbsTarget = targetCarbs;
    CAL_TARGET = targetCal;
    PROTEIN_TARGET = targetPro;
    FAT_TARGET = targetFat;
    CARBS_TARGET = targetCarbs;
    if (targetWater) { D.cfg.waterTarget = targetWater; WATER_TARGET = targetWater; }
    save();
    render();

    if (!isSilent) {
        setTimeout(() => {
            fcAlert(`
                <div style="font-size:16px;"><b>🎉 ปรับแต่งโปรแกรมเรียบร้อย!</b></div><br>
                ระยะเวลาคอร์ส: <b>${weeksVal} สัปดาห์ (~${(weeksVal/4.33).toFixed(1)} เดือน)</b><br>
                เป้าหมายน้ำหนัก: <b>${w.toFixed(1)} กก. → ${targetWVal.toFixed(1)} กก.</b> (ลด ${diff.toFixed(1)} กก.)<br>
                อัตราลดเป้าหมาย: <b>${lossPerWk.toFixed(2)} กก./สัปดาห์ (~${lossPerMonth.toFixed(1)} กก./เดือน)</b><br><br>
                <div style="color:var(--acc);font-weight:bold;">เป้าหมายประจำวัน:</div>
                พลังงาน: <b>${targetCal}</b> kcal/วัน<br>
                โปรตีน: <b>${targetPro}</b> g/วัน<br>
                น้ำดื่ม: <b>${targetWater.toLocaleString()}</b> มล. (~${(targetWater/1000).toFixed(1)} ลิตร)
            `);
        }, 300);
    }

    return { 
        w, bmr, tdee, targetCal, targetPro, targetWater, 
        targetW: targetWVal, courseWeeks: weeksVal, lossPerWk, lossPerMonth,
        bf: bfVal, muscle: muscleVal, visceral: visceralVal, rhr: rhrVal, vo2max: vo2Val, hrv: hrvVal 
    };
}

function updateAuthGateState(user) {
    const gate = document.getElementById('p-landing');
    const nav = document.querySelector('nav');
    const appPages = document.querySelectorAll('.page');
    const gateBtn = document.getElementById('authGateBtn');
    const gateMsg = document.getElementById('authGateMsg');

    if (user) {
        document.body.classList.remove('auth-required');
        if (gate) {
            gate.classList.add('hidden');
            setTimeout(() => { gate.style.display = 'none'; }, 500);
        }
        if (nav) nav.style.display = '';
        let hasActive = false;
        appPages.forEach(p => {
            if (p.classList.contains('on')) hasActive = true;
        });
        if (!hasActive) {
            const home = document.getElementById('p-home');
            if (home) home.classList.add('on');
        }
    } else {
        document.body.classList.add('auth-required');
        if (gate) {
            gate.style.display = 'flex';
            gate.classList.remove('hidden');
        }
        if (nav) nav.style.display = 'none';
        appPages.forEach(p => p.classList.remove('on'));
        if (gateBtn) {
            gateBtn.innerHTML = `
                <svg width="22" height="22" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>เข้าสู่ระบบด้วย Google เพื่อเริ่มต้นใช้งาน</span>
            `;
            gateBtn.onclick = loginWithGoogle;
        }
        if (gateMsg) gateMsg.textContent = 'กรุณาเข้าสู่ระบบด้วย Google เพื่อความปลอดภัยและเข้าถึงข้อมูลส่วนตัว';
    }
}

