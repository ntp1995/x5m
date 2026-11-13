/* ============================================================================
   FitCoach v3.4.0 — Modern Full-Screen Body & Course Calibration Wizard
   - Preserves full calcBMR() clinical & course analysis formulas (no fake TG analysis)
   - Step 1: Interactive Weight Scale Ruler (น้ำหนักปัจจุบัน & น้ำหนักเป้าหมาย + BMI)
   - Step 2: Vertical Height Stadiometer + Gender & Age
   - Step 3: InBody & Cardio Biometrics (%BF, กล้ามเนื้อ, Visceral, BMR, RHR, VO2, HRV)
   - Step 4: Course Plan, Goal Type, Occupational NEAT, Structured EAT & Steps + IF
   - Step 5: Orbital Course Calculation Animation
   - Step 6: Course Analysis Summary, Safety Badge & Weight Trajectory Curve
   ============================================================================ */

let obStep = 1;
let obMode = 'register'; // 'register' (first login) or 'recalibrate' (ปรับเป้า)

const OB_WORK_FACTORS = { sedentary: 1.15, light: 1.28, active: 1.42 };
const OB_EXERCISE_FACTORS = { none: 0.0, light: 0.12, moderate: 0.25, heavy: 0.35 };

let obState = {
    gender: 'M',
    age: 31,
    height: 168,
    weight: 77.3,
    targetWeight: 68.0,
    bf: 25.9,
    muscle: 54.3,
    visceral: 11,
    bmrCustom: 1630,
    rhr: 45,
    vo2max: 45,
    hrv: 73,
    courseWeeks: 20,
    goalType: 'recomp',
    workType: 'light',
    exerciseType: 'moderate',
    stepTarget: 8000,
    ifGoal: 16,
    outdoorMode: false
};

function initOnboardingDraftFromStore() {
    const lastCheck = (D && D.checks && D.checks.length) ? (D.checks[D.checks.length - 1] || {}) : {};
    const bio = (D && D.cfg && D.cfg.biometrics) ? D.cfg.biometrics : {};
    const saved = (D && D.cfg && D.cfg.bmrInfo) ? D.cfg.bmrInfo : {};

    obState.weight = Number(lastCheck.w || 77.3);
    obState.height = Number(bio.height || saved.height || 168);
    obState.age = Number(bio.age || saved.age || 31);
    obState.gender = bio.gender || saved.gender || 'M';
    obState.bf = Number(bio.bf || lastCheck.bf || 25.9);
    obState.muscle = Number(bio.muscle || 54.3);
    obState.visceral = Number(bio.visceral || 11);
    obState.rhr = Number(bio.rhr || 45);
    obState.vo2max = Number(bio.vo2max || 45);
    obState.hrv = Number(bio.hrv || 73);
    obState.bmrCustom = Number(bio.bmrCustom || 1630);

    obState.targetWeight = Number((D && D.cfg && D.cfg.targetWeight) || 68.0);
    obState.courseWeeks = Number((D && D.cfg && D.cfg.courseWeeks) || 20);
    obState.goalType = saved.goalType || 'recomp';
    obState.workType = (D && D.cfg && D.cfg.workType) || saved.workType || 'light';
    obState.exerciseType = (D && D.cfg && D.cfg.exerciseType) || saved.exerciseType || 'moderate';
    obState.stepTarget = Number((D && D.cfg && D.cfg.stepTarget) || saved.stepTarget || 8000);
    obState.ifGoal = Number((D && D.if && D.if.goal) || 16);
    obState.outdoorMode = Boolean(D && D.outdoorMode);
}

function openOnboardingWizard(startStep = 1, mode) {
    initOnboardingDraftFromStore();
    obStep = startStep;
    obMode = mode || ((D && D.cfg && D.cfg.onboardingDone) ? 'recalibrate' : 'register');
    const page = document.getElementById('p-onboard');
    if (page) {
        page.classList.add('on');
        if (document.body) document.body.classList.add('onboard-active');
        renderOnboardingStep();
    }
}

function closeOnboardingWizard(markSkipped = false) {
    const page = document.getElementById('p-onboard');
    if (page) page.classList.remove('on');
    if (document.body) document.body.classList.remove('onboard-active');
    if (markSkipped && D && D.cfg) {
        D.cfg.onboardingDone = true;
        save();
    }
}

function setObField(key, val) {
    obState[key] = val;
    renderOnboardingStep();
}

function adjustObWeight(field, delta) {
    const cur = Number(obState[field]) || 70;
    const next = Math.max(40, Math.min(160, Math.round((cur + delta) * 10) / 10));
    obState[field] = next;
    renderOnboardingStep();
}

function onObWeightSlider(field, val) {
    obState[field] = Math.round(parseFloat(val) * 10) / 10;
    const numEl = document.getElementById(field === 'weight' ? 'obWeightNum' : 'obTargetNum');
    const ticksEl = document.getElementById(field === 'weight' ? 'obWeightTicks' : 'obTargetTicks');
    if (numEl) numEl.textContent = obState[field].toFixed(1);
    if (ticksEl) {
        const offsetPx = ((obState[field] - 75) * -9);
        ticksEl.style.transform = `translateX(${offsetPx}px)`;
    }
    const bmiEl = document.getElementById('obLiveBmiBadge');
    if (bmiEl) {
        const hM = (obState.height || 168) / 100;
        const bmi = (obState.weight / (hM * hM)).toFixed(1);
        const diff = (obState.weight - obState.targetWeight).toFixed(1);
        bmiEl.textContent = `BMI ${bmi} • ${diff > 0 ? `เป้าหมายลด ${diff} กก.` : 'รักษาน้ำหนัก'}`;
    }
}

function onObHeightSlider(val) {
    obState.height = parseInt(val, 10) || 168;
    const hNum = document.getElementById('obHeightNum');
    const laser = document.getElementById('obHeightLaser');
    const tag = document.getElementById('obHeightLaserTag');
    const sil = document.getElementById('obSilhouetteSvg');
    if (hNum) hNum.textContent = obState.height;
    if (tag) tag.textContent = `${obState.height} cm`;
    const pctBottom = Math.max(22, Math.min(86, ((obState.height - 135) / 70) * 64 + 22));
    if (laser) laser.style.bottom = `${pctBottom}%`;
    if (sil) {
        const scaleH = Math.max(0.68, Math.min(1.08, 0.68 + ((obState.height - 140) / 60) * 0.4));
        sil.style.transform = `scaleY(${scaleH.toFixed(2)})`;
    }
}

function adjustObInt(field, delta, minV, maxV) {
    const cur = parseInt(obState[field], 10) || minV;
    obState[field] = Math.max(minV, Math.min(maxV, cur + delta));
    renderOnboardingStep();
}

function computeOnboardingPlan() {
    const w = Math.max(40, Number(obState.weight) || 77.3);
    const h = Math.max(130, Number(obState.height) || 168);
    const age = Math.max(15, Number(obState.age) || 31);
    const gender = obState.gender || 'M';
    const targetW = Math.max(40, Number(obState.targetWeight) || 68.0);
    const weeks = Math.max(4, Number(obState.courseWeeks) || 20);
    const customBmr = Number(obState.bmrCustom) || 0;
    const gType = obState.goalType || 'recomp';

    const act = (OB_WORK_FACTORS[obState.workType] || 1.28) + (OB_EXERCISE_FACTORS[obState.exerciseType] || 0.25);
    const bmr = customBmr > 1000 ? customBmr : (10 * w + 6.25 * h - 5 * age + (gender === 'M' ? 5 : -161));
    const tdee = bmr * act;
    const diff = Math.max(0, w - targetW);
    const lossPerWk = weeks > 0 ? (diff / weeks) : 0;
    const lossPerMonth = lossPerWk * 4.33;

    let deficitNeeded = Math.round((lossPerWk * 7700) / 7);
    if (gType === 'maintain') deficitNeeded = 0;
    else if (gType === 'bulk') deficitNeeded = -300;
    else if (gType === 'slowcut') deficitNeeded = Math.min(deficitNeeded, 350);

    const calTarget = Math.max(1200, Math.round(tdee - deficitNeeded));
    const proMultiplier = gType === 'maintain' ? 1.8 : 2.0;
    const proTarget = Math.round(w * proMultiplier);
    const fatTarget = Math.round((calTarget * 0.25) / 9);
    const carbsTarget = Math.max(50, Math.round((calTarget - (proTarget * 4) - (fatTarget * 9)) / 4));
    const waterTarget = Math.round((w * 35) / 50) * 50;

    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + weeks * 7);
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const goalDateTxt = `${goalDate.getDate()} ${thaiMonths[goalDate.getMonth()] || 'มี.ค.'}`;

    const safeLabel = lossPerWk <= 0.65
        ? 'ปลอดภัยสูงสุด ลีนไขมันรักษากล้ามเนื้อ'
        : (lossPerWk <= 0.9 ? 'อัตราเร่งปานกลาง ควรทานโปรตีนให้ครบ' : 'อัตราลดสูง เสี่ยงสูญเสียมวลกล้ามเนื้อ');
    const safeColor = lossPerWk <= 0.65 ? '#059669' : (lossPerWk <= 0.9 ? '#d97706' : '#dc2626');

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        act,
        diff,
        lossPerWk,
        lossPerMonth,
        safeLabel,
        safeColor,
        calTarget,
        proTarget,
        carbsTarget,
        fatTarget,
        waterTarget,
        stepTarget: Number(obState.stepTarget) || 8000,
        goalDateTxt,
        midWeight: ((w + targetW) / 2).toFixed(1)
    };
}

function captureObStepInputs() {
    if (obStep === 3) {
        const readNum = (id, minV) => {
            const v = parseFloat(document.getElementById(id)?.value);
            return (!isNaN(v) && v >= minV) ? v : null;
        };
        const bf = readNum('obInBF', 3);
        const muscle = readNum('obInMuscle', 15);
        const visceral = readNum('obInVisceral', 1);
        const bmrC = readNum('obInBmrCustom', 0);
        const rhr = readNum('obInRHR', 30);
        const vo2 = readNum('obInVO2', 15);
        const hrv = readNum('obInHRV', 10);
        if (bf !== null) obState.bf = bf;
        if (muscle !== null) obState.muscle = muscle;
        if (visceral !== null) obState.visceral = Math.round(visceral);
        if (bmrC !== null) obState.bmrCustom = Math.round(bmrC);
        if (rhr !== null) obState.rhr = Math.round(rhr);
        if (vo2 !== null) obState.vo2max = Math.round(vo2);
        if (hrv !== null) obState.hrv = Math.round(hrv);
    } else if (obStep === 4) {
        const st = parseInt(document.getElementById('obInStepTarget')?.value, 10);
        if (!isNaN(st) && st >= 2000) obState.stepTarget = st;
    }
}

function goObStep(nextStep) {
    captureObStepInputs();
    obStep = nextStep;
    renderOnboardingStep();
    const page = document.getElementById('p-onboard');
    if (page) page.scrollTop = 0;

    if (obStep === 5) {
        runOnboardingAnalysisAnimation();
    }
}

function runOnboardingAnalysisAnimation() {
    let pct = 15;
    const bar = document.getElementById('obAnalyzeBar');
    const pctTxt = document.getElementById('obAnalyzePct');
    const items = [1, 2, 3, 4];
    const timer = setInterval(() => {
        pct = Math.min(100, pct + 22);
        if (bar) bar.style.width = pct + '%';
        if (pctTxt) pctTxt.textContent = pct + '%';
        const doneCount = Math.floor((pct / 100) * items.length);
        items.forEach((n, idx) => {
            const row = document.getElementById('obCheckRow' + n);
            if (row && idx < doneCount) row.classList.add('done');
        });
        if (pct >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                if (obStep === 5) {
                    obStep = 6;
                    renderOnboardingStep();
                }
            }, 350);
        }
    }, 240);
}

function applyOnboardingPlanToApp() {
    const plan = computeOnboardingPlan();
    D.cfg = D.cfg || {};
    D.cfg.courseWeeks = obState.courseWeeks;
    D.cfg.targetWeight = obState.targetWeight;
    D.cfg.calTarget = plan.calTarget;
    D.cfg.proteinTarget = plan.proTarget;
    D.cfg.carbsTarget = plan.carbsTarget;
    D.cfg.fatTarget = plan.fatTarget;
    D.cfg.waterTarget = plan.waterTarget;
    D.cfg.lossPerWk = plan.lossPerWk;
    D.cfg.lossPerMonth = plan.lossPerMonth;
    D.cfg.workType = obState.workType;
    D.cfg.exerciseType = obState.exerciseType;
    D.cfg.stepTarget = obState.stepTarget;
    D.cfg.bmrInfo = {
        gender: obState.gender,
        age: obState.age,
        height: obState.height,
        workType: obState.workType,
        exerciseType: obState.exerciseType,
        stepTarget: obState.stepTarget,
        activity: plan.act,
        goalType: obState.goalType
    };
    D.cfg.biometrics = {
        gender: obState.gender,
        age: obState.age,
        height: obState.height,
        bf: obState.bf,
        muscle: obState.muscle,
        visceral: obState.visceral,
        rhr: obState.rhr,
        vo2max: obState.vo2max,
        hrv: obState.hrv,
        bmrCustom: obState.bmrCustom
    };
    D.cfg.onboardingDone = true;

    CAL_TARGET = plan.calTarget;
    PROTEIN_TARGET = plan.proTarget;
    CARBS_TARGET = plan.carbsTarget;
    FAT_TARGET = plan.fatTarget;
    WATER_TARGET = plan.waterTarget;

    D.outdoorMode = obState.outdoorMode;
    D.if = D.if || { start: null, goal: 16 };
    D.if.goal = obState.ifGoal;

    if (!D.checks || D.checks.length === 0) {
        D.checks = [{ d: iso(), w: obState.weight, bf: obState.bf, cal: 0, protein: 0, carbs: 0, fat: 0, water: 0, steps: 0, meals: [] }];
    }

    save();
    closeOnboardingWizard(true);
    render();
    if (typeof updateIFUI === 'function') updateIFUI();
}

function buildScaleTicksHtml() {
    let html = '';
    for (let i = 0; i <= 40; i++) {
        html += `<div class="ob-tick ${i % 5 === 0 ? 'major' : ''}"></div>`;
    }
    return html;
}

function renderOnboardingStep() {
    const body = document.getElementById('obWizardBody');
    if (!body) return;
    const totalSteps = 6;
    const progressPct = Math.round((obStep / totalSteps) * 100);
    const plan = computeOnboardingPlan();
    const isRecal = obMode === 'recalibrate';

    const headerHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <button type="button" onclick="${obStep > 1 ? `goObStep(${obStep - 1})` : 'closeOnboardingWizard(true)'}" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:99px; padding:6px 12px; font-size:12px; font-weight:800; color:#475569; cursor:pointer; font-family:inherit;">
                ${obStep > 1 ? '← ย้อนกลับ' : '← กลับหน้าหลัก'}
            </button>
            <span style="font-size:11.5px; font-weight:800; color:#2563eb; background:#eff6ff; padding:5px 12px; border-radius:99px;">
                ${isRecal ? '🧮 ปรับเป้า & คอร์สส่วนตัว' : '✨ ประเมินเริ่มต้นโปรแกรม'} • ${obStep}/${totalSteps}
            </span>
        </div>
        <div style="height:6px; background:#dbeafe; border-radius:99px; overflow:hidden; margin-bottom:16px;">
            <div style="height:100%; width:${progressPct}%; background:linear-gradient(90deg,#2563eb,#10b981); transition:width 0.35s cubic-bezier(0.22,1,0.36,1);"></div>
        </div>
    `;

    if (obStep === 1) {
        const hM = (obState.height || 168) / 100;
        const bmi = (obState.weight / (hM * hM)).toFixed(1);
        const diff = (obState.weight - obState.targetWeight).toFixed(1);
        const wOffset = (obState.weight - 75) * -9;
        const tOffset = (obState.targetWeight - 75) * -9;

        body.innerHTML = headerHtml + `
            <div class="ob-hero-icon">⚖️</div>
            <h2 style="margin:0 0 4px; font-size:21px; font-weight:900; color:#0f172a; text-align:center;">น้ำหนักปัจจุบัน & เป้าหมาย</h2>
            <p style="margin:0 0 14px; font-size:12.5px; color:#64748b; text-align:center;">เลื่อนตาชั่งเพื่อตั้งค่าน้ำหนักปัจจุบันและเป้าหมายของคุณ</p>

            <div class="ob-scale-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; font-weight:800; color:#475569;">น้ำหนักปัจจุบัน</span>
                    <span id="obLiveBmiBadge" style="font-size:11px; font-weight:800; color:#2563eb; background:#eff6ff; padding:3px 9px; border-radius:99px;">BMI ${bmi} • ${diff > 0 ? `เป้าหมายลด ${diff} กก.` : 'รักษาน้ำหนัก'}</span>
                </div>
                <div class="ob-scale-readout">
                    <span id="obWeightNum" class="ob-scale-num">${obState.weight.toFixed(1)}</span>
                    <span style="font-size:16px; font-weight:800; color:#64748b;">กก.</span>
                </div>
                <div class="ob-ruler-window">
                    <div id="obWeightTicks" class="ob-ruler-ticks" style="transform:translateX(${wOffset}px);">${buildScaleTicksHtml()}</div>
                    <div class="ob-ruler-needle"></div>
                </div>
                <input type="range" class="ob-range-slider" min="45" max="130" step="0.1" value="${obState.weight}" oninput="onObWeightSlider('weight', this.value)">
                <div class="ob-step-btns">
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('weight', -0.5)">−0.5</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('weight', -0.1)">−0.1</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('weight', 0.1)">+0.1</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('weight', 0.5)">+0.5</button>
                </div>
            </div>

            <div class="ob-scale-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px; font-weight:800; color:#059669;">🎯 น้ำหนักเป้าหมาย</span>
                    <span style="font-size:11px; font-weight:700; color:#059669;">คำนวณอัตราเผาผลาญอัตโนมัติ</span>
                </div>
                <div class="ob-scale-readout">
                    <span id="obTargetNum" class="ob-scale-num" style="color:#059669;">${obState.targetWeight.toFixed(1)}</span>
                    <span style="font-size:16px; font-weight:800; color:#64748b;">กก.</span>
                </div>
                <div class="ob-ruler-window">
                    <div id="obTargetTicks" class="ob-ruler-ticks" style="transform:translateX(${tOffset}px);">${buildScaleTicksHtml()}</div>
                    <div class="ob-ruler-needle" style="background:#10b981;"></div>
                </div>
                <input type="range" class="ob-range-slider" style="accent-color:#10b981;" min="45" max="115" step="0.1" value="${obState.targetWeight}" oninput="onObWeightSlider('targetWeight', this.value)">
                <div class="ob-step-btns">
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('targetWeight', -0.5)">−0.5</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('targetWeight', -0.1)">−0.1</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('targetWeight', 0.1)">+0.1</button>
                    <button type="button" class="ob-step-pill" onclick="adjustObWeight('targetWeight', 0.5)">+0.5</button>
                </div>
            </div>

            <button type="button" class="btn" style="border-radius:99px; font-size:15px; padding:14px;" onclick="goObStep(2)">ถัดไป: ส่วนสูง เพศ & อายุ ➔</button>
        `;
    } else if (obStep === 2) {
        const pctBottom = Math.max(22, Math.min(86, ((obState.height - 135) / 70) * 64 + 22));
        const scaleH = Math.max(0.68, Math.min(1.08, 0.68 + ((obState.height - 140) / 60) * 0.4));

        body.innerHTML = headerHtml + `
            <div class="ob-hero-icon">📏</div>
            <h2 style="margin:0 0 4px; font-size:21px; font-weight:900; color:#0f172a; text-align:center;">ส่วนสูง เพศ & อายุ</h2>
            <p style="margin:0 0 14px; font-size:12.5px; color:#64748b; text-align:center;">ใช้คำนวณ BMR ตามสูตร Mifflin-St Jeor</p>

            <div class="ob-stadiometer-card" style="margin-bottom:12px;">
                <div>
                    <div style="font-size:12px; font-weight:800; color:#64748b;">ส่วนสูงปัจจุบัน</div>
                    <div style="display:flex; align-items:baseline; gap:5px; margin:4px 0 12px;">
                        <span id="obHeightNum" style="font-size:42px; font-weight:900; color:#0f172a; letter-spacing:-1.5px;">${obState.height}</span>
                        <span style="font-size:16px; font-weight:800; color:#64748b;">ซม.</span>
                    </div>
                    <input type="range" class="ob-range-slider" min="140" max="200" step="1" value="${obState.height}" oninput="onObHeightSlider(this.value)">
                    <div style="display:flex; justify-content:space-between; font-size:10.5px; color:#64748b; margin-top:4px;">
                        <span>140 cm</span><span>170 cm</span><span>200 cm</span>
                    </div>
                </div>
                <div class="ob-height-stage">
                    <div id="obHeightLaser" class="ob-height-laser" style="bottom:${pctBottom}%;">
                        <span id="obHeightLaserTag" class="ob-height-laser-tag">${obState.height} cm</span>
                    </div>
                    <div class="ob-height-ruler-vert">${Array.from({length: 13}).map(() => '<span></span>').join('')}</div>
                    <svg id="obSilhouetteSvg" viewBox="0 0 60 140" width="54" height="145" style="transform-origin:bottom center; transform:scaleY(${scaleH.toFixed(2)}); transition:transform 0.18s ease-out;">
                        <circle cx="30" cy="18" r="11" fill="#3b82f6"/>
                        <path d="M16 36 C16 32 44 32 44 36 L47 80 L40 80 L39 135 L32 135 L30 92 L28 135 L21 135 L20 80 L13 80 Z" fill="#2563eb"/>
                    </svg>
                </div>
            </div>

            <div class="g2" style="gap:10px; margin-bottom:16px;">
                <div class="ob-scale-card" style="margin:0; text-align:center;">
                    <div style="font-size:11.5px; font-weight:800; color:#64748b; margin-bottom:8px;">👤 เพศ</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                        <button type="button" onclick="setObField('gender','M')" style="padding:10px 4px; border-radius:12px; border:1.5px solid ${obState.gender === 'M' ? '#2563eb' : '#e2e8f0'}; background:${obState.gender === 'M' ? '#eff6ff' : '#fff'}; font-weight:800; font-size:13px; color:#0f172a; cursor:pointer;">👨 ชาย</button>
                        <button type="button" onclick="setObField('gender','F')" style="padding:10px 4px; border-radius:12px; border:1.5px solid ${obState.gender === 'F' ? '#ec4899' : '#e2e8f0'}; background:${obState.gender === 'F' ? '#fdf2f8' : '#fff'}; font-weight:800; font-size:13px; color:#0f172a; cursor:pointer;">👩 หญิง</button>
                    </div>
                </div>
                <div class="ob-scale-card" style="margin:0; text-align:center;">
                    <div style="font-size:11.5px; font-weight:800; color:#64748b;">🎂 อายุ (ปี)</div>
                    <div style="font-size:28px; font-weight:900; color:#0f172a; margin:2px 0;">${obState.age}</div>
                    <div class="ob-step-btns">
                        <button type="button" class="ob-step-pill" onclick="adjustObInt('age', -1, 15, 85)">−</button>
                        <button type="button" class="ob-step-pill" onclick="adjustObInt('age', 1, 15, 85)">+</button>
                    </div>
                </div>
            </div>

            <button type="button" class="btn" style="border-radius:99px; font-size:15px; padding:14px;" onclick="goObStep(3)">ถัดไป: ข้อมูล InBody & ชีพจร ➔</button>
        `;
    } else if (obStep === 3) {
        body.innerHTML = headerHtml + `
            <div class="ob-hero-icon">🧬</div>
            <h2 style="margin:0 0 4px; font-size:21px; font-weight:900; color:#0f172a; text-align:center;">ข้อมูลองค์ประกอบร่างกาย</h2>
            <p style="margin:0 0 12px; font-size:12.5px; color:#64748b; text-align:center;">ค่าจากเครื่องชั่ง InBody & นาฬิกา (ใช้คำนวณ BMR จริงของคุณ)</p>

            <div class="ob-scale-card" style="padding:14px;">
                <div style="font-size:12px; font-weight:800; color:#2563eb; margin-bottom:10px;">📊 องค์ประกอบร่างกาย (InBody)</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:#64748b;">ไขมันร่างกาย (%BF)</label>
                        <input id="obInBF" type="number" step="0.1" value="${obState.bf}" style="margin-top:4px; padding:9px 10px; font-weight:800;">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:#64748b;">มวลกล้ามเนื้อ (กก.)</label>
                        <input id="obInMuscle" type="number" step="0.1" value="${obState.muscle}" style="margin-top:4px; padding:9px 10px; font-weight:800;">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:#64748b;">ไขมันช่องท้อง (Visceral)</label>
                        <input id="obInVisceral" type="number" value="${obState.visceral}" style="margin-top:4px; padding:9px 10px; font-weight:800;">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:#64748b;">BMR เครื่องชั่ง (kcal)</label>
                        <input id="obInBmrCustom" type="number" value="${obState.bmrCustom}" style="margin-top:4px; padding:9px 10px; font-weight:800;">
                    </div>
                </div>
            </div>

            <div class="ob-scale-card" style="padding:14px;">
                <div style="font-size:12px; font-weight:800; color:#059669; margin-bottom:10px;">❤️ สมรรถภาพหัวใจ & การฟื้นตัว</div>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
                    <div>
                        <label style="font-size:10.5px; font-weight:700; color:#64748b;">RHR (bpm)</label>
                        <input id="obInRHR" type="number" value="${obState.rhr}" style="margin-top:4px; padding:9px 8px; font-weight:800;">
                    </div>
                    <div>
                        <label style="font-size:10.5px; font-weight:700; color:#64748b;">VO2 Max</label>
                        <input id="obInVO2" type="number" value="${obState.vo2max}" style="margin-top:4px; padding:9px 8px; font-weight:800;">
                    </div>
                    <div>
                        <label style="font-size:10.5px; font-weight:700; color:#64748b;">HRV (ms)</label>
                        <input id="obInHRV" type="number" value="${obState.hrv}" style="margin-top:4px; padding:9px 8px; font-weight:800;">
                    </div>
                </div>
            </div>

            <button type="button" class="btn" style="border-radius:99px; font-size:15px; padding:14px;" onclick="goObStep(4)">ถัดไป: เลือกคอร์ส & กิจวัตร ➔</button>
        `;
    } else if (obStep === 4) {
        const weekOpts = [8, 12, 16, 20, 22];
        const goalOpts = [
            { id: 'recomp', t: 'ลดไขมันรักษากล้ามเนื้อ (Recomp) — แนะนำ' },
            { id: 'fatloss', t: 'เน้นลดไขมัน/น้ำหนักเร็ว (Fat Loss Cut)' },
            { id: 'slowcut', t: 'ลดไขมันช้าๆ สบายๆ ไม่เครียด (Slow Cut)' },
            { id: 'maintain', t: 'รักษาน้ำหนักและกล้ามเนื้อเดิม (Maintain)' },
            { id: 'bulk', t: 'เพิ่มกล้ามเนื้อ (Lean Bulk)' }
        ];
        const workOpts = [
            { id: 'sedentary', t: '🪑 นั่งโต๊ะทำงานเป็นหลัก (1.15)' },
            { id: 'light', t: '👮 เดินตรวจ / ยืนบ่อย / กึ่งลงพื้นที่ (1.28)' },
            { id: 'active', t: '🏃 ใช้แรงงาน / ภาคสนามตลอดวัน (1.42)' }
        ];
        const exOpts = [
            { id: 'moderate', t: '🏋️ เวท + เดินลู่ 3-5 วัน/สัปดาห์ (+0.25)' },
            { id: 'light', t: '🧘 เวทเบาๆ 1-3 วัน/สัปดาห์ (+0.12)' },
            { id: 'heavy', t: '🔥 ออกกำลังกายหนัก 6-7 วัน (+0.35)' },
            { id: 'none', t: '🛋️ ไม่ออกกำลังกายเลย (+0.00)' }
        ];

        body.innerHTML = headerHtml + `
            <div class="ob-hero-icon">🎯</div>
            <h2 style="margin:0 0 4px; font-size:21px; font-weight:900; color:#0f172a; text-align:center;">วางแผนคอร์ส & กิจวัตร (NEAT/EAT)</h2>
            <p style="margin:0 0 12px; font-size:12.5px; color:#64748b; text-align:center;">วิเคราะห์ความเข้มข้นและตัวคูณการเผาผลาญตามจริง</p>

            <div class="ob-scale-card" style="padding:12px;">
                <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:8px;">📅 ระยะเวลาคอร์ส (สัปดาห์)</div>
                <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:6px; margin-bottom:10px;">
                    ${weekOpts.map(wk => `
                        <button type="button" onclick="setObField('courseWeeks', ${wk})" style="padding:8px 2px; border-radius:12px; border:1.5px solid ${obState.courseWeeks === wk ? '#2563eb' : '#e2e8f0'}; background:${obState.courseWeeks === wk ? '#eff6ff' : '#fff'}; font-weight:900; font-size:12.5px; color:${obState.courseWeeks === wk ? '#2563eb' : '#475569'}; cursor:pointer;">${wk}w</button>
                    `).join('')}
                </div>
                <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px;">เป้าหมายหลักของคอร์ส</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                    ${goalOpts.map(g => `
                        <div onclick="setObField('goalType', '${g.id}')" style="cursor:pointer; padding:9px 11px; border-radius:12px; border:1.5px solid ${obState.goalType === g.id ? '#2563eb' : '#e2e8f0'}; background:${obState.goalType === g.id ? '#eff6ff' : '#fff'}; font-size:12px; font-weight:800; color:#0f172a;">${g.t}</div>
                    `).join('')}
                </div>
            </div>

            <div class="ob-scale-card" style="padding:12px;">
                <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px;">1. ลักษณะงาน (Occupational NEAT)</div>
                <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:10px;">
                    ${workOpts.map(w => `
                        <div onclick="setObField('workType', '${w.id}')" style="cursor:pointer; padding:8px 10px; border-radius:11px; border:1.5px solid ${obState.workType === w.id ? '#10b981' : '#e2e8f0'}; background:${obState.workType === w.id ? '#ecfdf5' : '#fff'}; font-size:11.5px; font-weight:700;">${w.t}</div>
                    `).join('')}
                </div>
                <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px;">2. การออกกำลังกาย (EAT)</div>
                <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:10px;">
                    ${exOpts.map(e => `
                        <div onclick="setObField('exerciseType', '${e.id}')" style="cursor:pointer; padding:8px 10px; border-radius:11px; border:1.5px solid ${obState.exerciseType === e.id ? '#2563eb' : '#e2e8f0'}; background:${obState.exerciseType === e.id ? '#eff6ff' : '#fff'}; font-size:11.5px; font-weight:700;">${e.t}</div>
                    `).join('')}
                </div>
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                    <span style="font-size:11.5px; font-weight:800; color:#475569;">3. เป้าก้าวเดิน/วัน</span>
                    <input id="obInStepTarget" type="number" step="500" min="2000" max="30000" value="${obState.stepTarget}" style="width:120px; padding:7px 10px; font-weight:800; text-align:right;">
                </div>
            </div>

            <button type="button" class="btn" style="border-radius:99px; font-size:15px; padding:14px; background:linear-gradient(135deg,#2563eb,#10b981);" onclick="goObStep(5)">✨ คำนวณแผนคอร์สของฉัน</button>
        `;
    } else if (obStep === 5) {
        body.innerHTML = headerHtml + `
            <div style="text-align:center; padding:16px 0;">
                <div class="ob-orbital-wrap">
                    <div class="ob-orbital-ring"></div>
                    <div class="ob-orbital-ring inner"></div>
                    <div style="font-size:30px;">🧬</div>
                </div>
                <h2 style="margin:0 0 6px; font-size:21px; font-weight:900; color:#0f172a;">กำลังคำนวณคอร์สของคุณ</h2>
                <div style="font-size:38px; font-weight:900; color:#2563eb; margin:6px 0;" id="obAnalyzePct">15%</div>
                <div style="height:10px; background:#dbeafe; border-radius:99px; overflow:hidden; margin:0 12px 20px;">
                    <div id="obAnalyzeBar" style="height:100%; width:15%; background:linear-gradient(90deg,#2563eb,#10b981); transition:width 0.25s ease;"></div>
                </div>
                <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                    <div id="obCheckRow1" class="ob-check-row"><span>✓</span> คำนวณ BMR (${plan.bmr}) × ตัวคูณ ${plan.act.toFixed(2)} = TDEE ${plan.tdee} kcal</div>
                    <div id="obCheckRow2" class="ob-check-row"><span>✓</span> วิเคราะห์อัตราลด ${plan.lossPerWk.toFixed(2)} กก./สัปดาห์ (${obState.courseWeeks} สัปดาห์)</div>
                    <div id="obCheckRow3" class="ob-check-row"><span>✓</span> จัดสัดส่วนโปรตีน ${plan.proTarget}g • ไขมัน 25% • คาร์บ ${plan.carbsTarget}g</div>
                    <div id="obCheckRow4" class="ob-check-row"><span>✓</span> กำหนดเป้าน้ำดื่ม ${plan.waterTarget.toLocaleString()} มล. & ${plan.stepTarget.toLocaleString()} ก้าว/วัน</div>
                </div>
            </div>
        `;
    } else if (obStep === 6) {
        body.innerHTML = headerHtml + `
            <div style="text-align:center;">
                <span style="background:rgba(16,185,129,0.14); color:#059669; font-size:11.5px; font-weight:800; padding:5px 14px; border-radius:99px;">🎉 วิเคราะห์คอร์สเสร็จสมบูรณ์!</span>
                <h2 style="margin:10px 0 4px; font-size:21px; font-weight:900; color:#0f172a;">คาดการณ์บรรลุเป้าหมาย ${obState.targetWeight.toFixed(1)} กก.</h2>
                <div style="font-size:12.5px; color:#64748b;">คอร์ส <b>${obState.courseWeeks} สัปดาห์</b> • ลด <b>${plan.lossPerWk.toFixed(2)} กก./สัปดาห์</b> (~${plan.lossPerMonth.toFixed(1)} กก./เดือน)</div>
            </div>

            <div class="ob-scale-card" style="margin:12px 0;">
                <svg viewBox="0 0 280 95" width="100%" height="95" style="display:block;">
                    <defs>
                        <linearGradient id="obGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#f97316"/>
                            <stop offset="50%" stop-color="#eab308"/>
                            <stop offset="100%" stop-color="#10b981"/>
                        </linearGradient>
                    </defs>
                    <path d="M 28 22 C 95 24, 165 66, 250 72" fill="none" stroke="url(#obGrad)" stroke-width="4.5" stroke-linecap="round"/>
                    <circle cx="28" cy="22" r="5.5" fill="#fff" stroke="#f97316" stroke-width="3"/>
                    <circle cx="140" cy="48" r="5" fill="#fff" stroke="#eab308" stroke-width="3"/>
                    <circle cx="250" cy="72" r="6" fill="#10b981" stroke="#fff" stroke-width="2.5"/>
                    <text x="28" y="12" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">${obState.weight.toFixed(1)} kg</text>
                    <text x="140" y="37" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b">${plan.midWeight} kg</text>
                    <text x="245" y="58" text-anchor="middle" font-size="11" font-weight="900" fill="#059669">${obState.targetWeight.toFixed(1)} kg</text>
                    <text x="28" y="89" text-anchor="middle" font-size="9.5" fill="#64748b">วันนี้</text>
                    <text x="250" y="89" text-anchor="middle" font-size="9.5" font-weight="800" fill="#059669">${plan.goalDateTxt}</text>
                </svg>
                <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #e2e8f0; display:flex; justify-content:space-between; font-size:12px;">
                    <span style="color:#64748b;">BMR / TDEE:</span>
                    <span><b>${plan.bmr}</b> / <b style="color:#2563eb;">${plan.tdee} kcal</b> (×${plan.act.toFixed(2)})</span>
                </div>
                <div style="margin-top:4px; font-size:12px; font-weight:800; color:${plan.safeColor}; text-align:center;">${plan.safeLabel}</div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; text-align:center; margin-bottom:14px;">
                <div style="background:#ffffff; border:1px solid #dbeafe; border-radius:14px; padding:10px 4px;">
                    <div style="font-size:10px; color:#1d4ed8; font-weight:700;">แคลอรี/วัน</div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">${plan.calTarget}</div>
                </div>
                <div style="background:#ffffff; border:1px solid #fed7aa; border-radius:14px; padding:10px 4px;">
                    <div style="font-size:10px; color:#c2410c; font-weight:700;">โปรตีน</div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">${plan.proTarget}g</div>
                </div>
                <div style="background:#ffffff; border:1px solid #bbf7d0; border-radius:14px; padding:10px 4px;">
                    <div style="font-size:10px; color:#15803d; font-weight:700;">คาร์บ</div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">${plan.carbsTarget}g</div>
                </div>
                <div style="background:#ffffff; border:1px solid #fef08a; border-radius:14px; padding:10px 4px;">
                    <div style="font-size:10px; color:#a16207; font-weight:700;">ไขมัน</div>
                    <div style="font-size:16px; font-weight:900; color:#0f172a;">${plan.fatTarget}g</div>
                </div>
            </div>

            <button type="button" class="btn" style="border-radius:99px; background:linear-gradient(135deg,#2563eb,#10b981); font-size:15px; padding:14px;" onclick="applyOnboardingPlanToApp()">
                ${isRecal ? '💾 บันทึกเป้าหมาย & คอร์สใหม่' : '🚀 เริ่มใช้งาน FitCoach เลย!'}
            </button>
        `;
    }
}
